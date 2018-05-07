package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	pq "github.com/lib/pq"
	"github.com/rubenv/sql-migrate"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	// pb "git.dolansoft.org/philippe/coffee-random/pb"
)

var postgresURL = flag.String("postgres-url", "", "(required) URL for the master database, example: myuser:mypass@172.17.0.2:5432/servis_registry?sslmode=disable")

// Server is a coffee-random server.
type Server struct {
	DB *sql.DB
}

func main() {
	loadFlags()

	db, e := sql.Open("postgres", fmt.Sprintf("postgres://%v", *postgresURL))
	ensure(e)
	defer db.Close()

	migrations := migrate.FileMigrationSource{Dir: "migrations"}
	migCount, e := migrate.Exec(db, "postgres", migrations, migrate.Up)
	ensure(e)
	log.Printf("applied %v migrations", migCount)

	ownS := Server{DB: db}

	grpcS := grpc.NewServer()
	pb.RegisterMailaliasServer(grpcS, &ownS)
	grpcLis, e := net.Listen("tcp", *grpcLisAddr)
	ensure(e)
	ownS.WrappedGrpc = grpcweb.WrapServer(grpcS)

	log.Println("listening")
	http.HandleFunc("/", ownS.handleHTTP)
	go func() { log.Fatal(http.ListenAndServe(*httpLisAddr, nil)) }()
	go ownS.periodicSync()
	log.Fatal(grpcS.Serve(grpcLis))
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

// CreateAlias creates a new alias.
func (s *Server) CreateAlias(ctx context.Context, r *pb.CreateAliasRequest) (*pb.Empty, error) {
	priv, e := s.assertAPIKey(ctx)
	if e != nil {
		return nil, e
	}
	if !priv && r.Locked && r.CanSend {
		return nil, grpc.Errorf(codes.PermissionDenied, "a priviliged key is required to create aliases with locked or can_send")
	}
	if !isValidEmail(r.Source) || !isValidEmail(r.Destination) {
		return nil, grpc.Errorf(codes.InvalidArgument, "invalid email in source or destination (%v, %v)", r.Source, r.Destination)
	}
	if r.Source == r.Destination {
		return nil, grpc.Errorf(codes.InvalidArgument, "source and destination can not be equal")
	}
	_, e = s.DB.Exec("INSERT INTO aliases (source, destination, locked, can_send, comment) VALUES ($1, $2, $3, $4, $5)",
		r.Source, r.Destination, r.Locked, r.CanSend, r.Comment)
	if e != nil {
		if pgE, ok := e.(*pq.Error); ok && pgE.Code.Name() == "unique_violation" {
			return nil, grpc.Errorf(codes.AlreadyExists, "an alias with this source and destination already exists, you must delete it first")
		}
		return nil, internalError(e)
	}
	return &pb.Empty{}, nil
}
