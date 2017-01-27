-- Table structure for table `organization`
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
  `id`                   int(11)      NOT NULL AUTO_INCREMENT,
  `name`                 varchar(100) NOT NULL,
  `url`                  varchar(100) DEFAULT NULL,
  `logo`                 varchar(100) DEFAULT NULL,
  `brief_description`    varchar(200) DEFAULT NULL,
  `detailed_description` varchar(500) DEFAULT NULL,
  `address1`             varchar(100) DEFAULT NULL,
  `address2`             varchar(100) DEFAULT NULL,
  `city`                 varchar(100) DEFAULT NULL,
  `state`                varchar(100) DEFAULT NULL,
  `country`              varchar(100) DEFAULT NULL,
  `zip`                  varchar(100) DEFAULT NULL,
  `contact_name`         varchar(100) DEFAULT NULL,
  `contact_phone`        varchar(20)  DEFAULT NULL,
  `contact_email`        varchar(30)  DEFAULT NULL,
  `status`               int(1)      NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);
INSERT INTO `organization`
VALUES (1,'Teens Give','http://www.teensgive.org','Logo_teensGive','Teens Give Organization', NULL, '7451 North William Court', NULL,'Rye','NY','USA','10580',NULL,NULL,NULL,0),
  (2,'AFRICAN FILM FESTIVAL, INC.','http://www.africanfilmny.org/','Logo_AFF', 'African Film Festival', NULL, '154 West 18th Street', 'Suite 2A','New York','NY','USA','10011',NULL,NULL,NULL,0),
  (3,'NATIONAL ASSOCIATION OF SCHOOL NURSES','http://www.nasn.org/','Logo_NASN.jpg', 'National Association of School Nurses', NULL, ' 1100 Wayne Ave', '#925','Silver Spring','MD','USA','20910 ',NULL,NULL,NULL,1),
  (4,'RUBICON PROGRAMS INC.','http://www.rubiconprograms.org','Logo_Rubison.png', 'Rubicon Programs Inc', NULL, '2500 Bissell Avenue', NULL,'Richmond','CS','USA','94804',NULL,NULL,NULL,0),
  (5,'Conversations For Good','http://www.convoforgood.org','Logo_ConvoForGood.png', 'Conversations For Good', NULL, '504 Marsh Court ', NULL,'Berkeley','CA','USA',NULL,NULL,NULL,NULL,0);
