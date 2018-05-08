-- +migrate Up
INSERT INTO users (username, password) VALUES
  ('marc', '$2a$10$37bXQkZoz3T62lVAjzVY/ub9Srur7aDoOYvhiNg5OszUxwQhPZmaK'),
  ('philippe', '$2a$10$JDrg37BxJDVnze8grWtAFu4il8k2JCILl4IalomFshcaggktDmEJm');

-- +migrate Down
DELETE FROM users WHERE username = 'marc' OR username = 'philippe';