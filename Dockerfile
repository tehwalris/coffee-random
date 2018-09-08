FROM node:9.4-alpine
WORKDIR /usr/src/app
ENV REACT_APP_API_URL="https://coffee.walr.is"
RUN apk --update add protobuf git build-base && \
  mkdir frontend
COPY frontend/package.json frontend/package.json
COPY frontend/yarn.lock frontend/yarn.lock
RUN cd frontend && yarn --pure-lockfile
COPY pb pb
COPY frontend/public frontend/public
COPY frontend/src frontend/src
RUN cd pb && ./gen-ts.sh
COPY frontend/tslint.json frontend/tslint.json
COPY frontend/tsconfig.json frontend/tsconfig.json
RUN cd frontend && yarn run build

FROM golang:1.9.2-alpine3.7
WORKDIR /go/src/github.com/tehwalris/coffee-random
RUN apk --update add git protobuf
RUN go get -u github.com/golang/dep/cmd/dep && \
  go get -u github.com/golang/protobuf/protoc-gen-go
COPY Gopkg.lock Gopkg.toml ./
RUN dep ensure -vendor-only
COPY pb pb
COPY migrations migrations
COPY --from=0 /usr/src/app/frontend/build frontend/build
RUN cd pb && ./gen-go.sh
COPY backend backend
RUN cd backend && go build

CMD ["/bin/sh", "-c", "cd backend && ./backend -postgres-url $POSTGRES_URL"]
