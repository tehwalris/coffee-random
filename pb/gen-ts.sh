#!/bin/sh -e

PROTOC_GEN_TS_PATH="../frontend/node_modules/.bin/protoc-gen-ts"
TS_OUT_DIR="../frontend/src/generated"

mkdir "$TS_OUT_DIR" || exit 0
protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${TS_OUT_DIR}" \
    --ts_out=service=true:"${TS_OUT_DIR}" \
    coffee.proto