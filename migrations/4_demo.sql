-- +migrate Up
INSERT INTO users (username, password) VALUES
  ('demo', '$2a$10$/wpJVaavtG45fk/XKfUSp.5pI2cqCp4VmwKo6qFlXeOyrgwc9g7BG');

-- +migrate Down
DELETE FROM users WHERE username = 'demo';