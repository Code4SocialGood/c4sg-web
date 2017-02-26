-- Table structure for table `user_project`
DROP TABLE IF EXISTS `user_project`;
CREATE TABLE `user_project`(
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `project_id` INT(11) NOT NULL,
  `status` char(1) DEFAULT 'A',
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  KEY `fk_project` (`project_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
);

-- Updating some data project
UPDATE `project`SET
  name = 'PROTOTYPING A MOBILE SITE',
  country = 'Ireland',
  contact_email = 'testnonprofituser1@gmail.com' WHERE id = 3;

-- Updating some data user
UPDATE `user` SET
  user_name = 'testvolunteeruser1 1',
  first_name = 'Volunteer 1',
  last_name = 'volunteer',
  email = 'testvolunteeruser1@gmail.com',
  phone = '13414134',
  state = 'Alabama',
  country = 'US',
  zip = '41341' WHERE id = 2;