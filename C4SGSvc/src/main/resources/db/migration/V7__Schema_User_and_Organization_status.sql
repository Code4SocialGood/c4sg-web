  -- Modify columns
ALTER TABLE organization
  MODIFY COLUMN status varchar(1) NOT NULL DEFAULT 'A';

UPDATE organization
SET
  status     = 'A';
  

ALTER TABLE user
  MODIFY COLUMN status varchar(1) NOT NULL DEFAULT 'P',
  MODIFY COLUMN role varchar(1) NOT NULL DEFAULT 'V';

  -- Fill in fields
UPDATE user
SET
  status     = 'A', 
  role = 'V';
  
  



