package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"github.com/rubenv/sql-migrate"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	pb "git.dolansoft.org/philippe/coffee-random/pb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

const columnCount = 4

var postgresURL = flag.String("postgres-url", "", "(required) URL of the database, example: myuser:mypass@172.17.0.2:5432/servis_registry?sslmode=disable")
var httpLisAddr = flag.String("http-listen", ":80", "URL (like \":port\" or \"ip:port\") to use for HTTP (and GRPC-web)")

type server struct {
	DB          *sql.DB
	WrappedGrpc *grpcweb.WrappedGrpcServer
}

func main() {
	loadFlags()

	db, e := sql.Open("postgres", fmt.Sprintf("postgres://%v", *postgresURL))
	ensure(e)
	defer db.Close()

	migrations := migrate.FileMigrationSource{Dir: "../migrations"}
	migCount, e := migrate.Exec(db, "postgres", migrations, migrate.Up)
	ensure(e)
	log.Printf("applied %v migrations", migCount)

	ownS := server{DB: db}
	grpcS := grpc.NewServer()
	pb.RegisterCoffeeSurveyServer(grpcS, &ownS)
	ownS.WrappedGrpc = grpcweb.WrapServer(grpcS)

	http.HandleFunc("/", ownS.handleHTTP)

	log.Println("listening")
	log.Fatal(http.ListenAndServe(*httpLisAddr, nil))
}

func ensure(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func internalError(e error) error {
	if e != nil {
		log.Printf("Error: %v\n", e)
	}
	return grpc.Errorf(codes.Internal, "internal error")
}

func loadFlags() {
	flag.Parse()
	if *postgresURL == "" {
		log.Fatalf("missing required arguments, see help")
	}
}

func (s *server) handleHTTP(w http.ResponseWriter, r *http.Request) {
	if s.WrappedGrpc.IsGrpcWebRequest(r) || s.WrappedGrpc.IsAcceptableGrpcCorsRequest(r) {
		s.WrappedGrpc.ServeHTTP(w, r)
	} else {
		http.FileServer(http.Dir("../frontend/build/")).ServeHTTP(w, r)
	}
}

// authUser checks credentials and retruns the users ID.
func (s *server) authUser(ctx context.Context, uname string, pw string) (int, error) {
	var id int
	var hash string
	e := s.DB.QueryRowContext(ctx, "SELECT id, password FROM users WHERE username = $1", uname).Scan(&id, &hash)
	if e != nil {
		return 0, e
	}
	e = bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw))
	if e != nil {
		return 0, e
	}
	return id, nil
}

func (s *server) CheckCreds(ctx context.Context, r *pb.CheckCredsRequest) (*pb.Empty, error) {
	if _, e := s.authUser(ctx, r.Username, r.Password); e != nil {
		return nil, grpc.Errorf(codes.Unauthenticated, "wrong username or password")
	}
	return &pb.Empty{}, nil
}

func (s *server) NextColumn(ctx context.Context, r *pb.NextColumnRequest) (*pb.NextColumnResponse, error) {
	// TODO real implementation
	// TODO auth
	// TODO not_column
	// TODO zero probablities

	return &pb.NextColumnResponse{MachineColumn: uint32(rand.Intn(columnCount) + 1)}, nil
}

func (s *server) Submit(ctx context.Context, r *pb.SubmitRequest) (*pb.Empty, error) {
	userID, e := s.authUser(ctx, r.Username, r.Password)
	if e != nil {
		return nil, grpc.Errorf(codes.Unauthenticated, "wrong username or password")
	}
	_, e = s.DB.ExecContext(ctx,
		"INSERT INTO ratings (user_id, machine_column, quality, business, created_at) VALUES ($1, $2, $3, $4, $5)",
		userID, r.MachineColumn, r.Quality, r.Business, time.Now())
	if e != nil {
		return nil, internalError(e)
	}
	return &pb.Empty{}, nil
}
