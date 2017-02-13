-- Update user row fields before change type
UPDATE user
SET
  display_flag = NULL,
  status       = '1';

-- Modify columns
ALTER TABLE user
  ADD user_name VARCHAR(100) NOT NULL AFTER id,
  ADD first_name VARCHAR(100) AFTER user_name,
  ADD last_name VARCHAR(100) AFTER first_name,
  MODIFY COLUMN display_flag BOOLEAN DEFAULT NULL,
  MODIFY COLUMN status INTEGER NOT NULL;

-- Fill in new fields
UPDATE user
SET
  user_name  = "testUserName",
  first_name = "testFirstName",
  last_name  = "testLastName",
  status     = 1
WHERE id BETWEEN 2 AND 7;