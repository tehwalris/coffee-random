package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"github.com/rubenv/sql-migrate"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	pb "git.dolansoft.org/philippe/coffee-random/pb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

var postgresURL = flag.String("postgres-url", "", "(required) URL of the database, example: myuser:mypass@172.17.0.2:5432/servis_registry?sslmode=disable")
var httpLisAddr = flag.String("http-listen", ":80", "URL (like \":port\" or \"ip:port\") to use for HTTP (and GRPC-web)")

// Server is a coffee-random server.
type Server struct {
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

	ownS := Server{DB: db}
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

func (s *Server) handleHTTP(w http.ResponseWriter, r *http.Request) {
	if s.WrappedGrpc.IsGrpcWebRequest(r) {
		s.WrappedGrpc.ServeHTTP(w, r)
	} else {
		fmt.Fprint(w, "The service is only available via GRPC-web.")
	}
}

// Submit submits a new rating.
func (s *Server) Submit(ctx context.Context, r *pb.SubmitRequest) (*pb.Empty, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "not implemented")
}
