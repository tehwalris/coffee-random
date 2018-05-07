-- +migrate Up
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL
);
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  machine_column smallint NOT NULL,
  quality float(10) NOT NULL,
  business float(10) NOT NULL,
  created_at TIMESTAMPTZ
);

-- +migrate Down
DROP TABLE ratings;
DROP TABLE users;
