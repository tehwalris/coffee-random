#!/bin/sh -e

GO_OUT_DIR="."

protoc \
    --go_out=plugins=grpc:"${GO_OUT_DIR}" \
    coffee.proto
