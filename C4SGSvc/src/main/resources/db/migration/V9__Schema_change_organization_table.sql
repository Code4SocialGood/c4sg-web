-- Modify columns
ALTER TABLE organization DROP brief_description;
ALTER TABLE organization CHANGE COLUMN detailed_description description VARCHAR(500) DEFAULT NULL;