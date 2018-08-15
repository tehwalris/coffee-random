-- +migrate Up
INSERT INTO users (username, password) VALUES
  ('noah', '$2a$10$120SCt02YaOiJadGwgKYTe9e/HDmu6JXjtRQNyTx683kvHoT0kc0e');

-- +migrate Down
DELETE FROM users WHERE username = 'noah';