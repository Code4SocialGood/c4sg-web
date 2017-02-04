UPDATE user
SET
  user_name  = "testUserName",
  first_name = "testFirstName",
  last_name  = "testLastName"
WHERE id IN (7, 2, 3, 4, 5, 6);