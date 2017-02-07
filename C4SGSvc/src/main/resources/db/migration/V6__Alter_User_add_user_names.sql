UPDATE user
SET status = '1';

ALTER TABLE user
  ADD user_name VARCHAR(100) NOT NULL AFTER id,
  ADD first_name VARCHAR(100) AFTER user_name,
  ADD last_name VARCHAR(100) AFTER first_name,
  MODIFY COLUMN status INTEGER NOT NULL;