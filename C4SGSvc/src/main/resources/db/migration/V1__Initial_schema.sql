-- Table structure for table `application`
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `id`          int(11)   NOT NULL AUTO_INCREMENT,
  `user_id`     int(11)   NOT NULL,
  `project_id`  int(11)   NOT NULL,
  PRIMARY KEY (`id`)
);

-- Table structure for table `cause`
DROP TABLE IF EXISTS `cause`;
CREATE TABLE `cause` (
  `id`      int(11)      NOT NULL AUTO_INCREMENT,
  `cause`   varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

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
  `status`               char(1)      NOT NULL DEFAULT 'A',
  PRIMARY KEY (`id`)
);

-- Table structure for table `project`
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id`              int(11)      NOT NULL AUTO_INCREMENT,
  `name`            varchar(100) NOT NULL,
  `description`     varchar(500) DEFAULT NULL,
  `image`           varchar(100) DEFAULT NULL,
  `organization_id` int(11)      DEFAULT NULL,
  `address`         varchar(100) DEFAULT NULL,
  `city`            varchar(100) DEFAULT NULL,
  `state`           varchar(100) DEFAULT NULL,
  `country`         varchar(100) DEFAULT NULL,
  `zip`             varchar(100) DEFAULT NULL,
  `remote`          char(1)      DEFAULT 'Y',
  `contact_name`    varchar(100) DEFAULT NULL,
  `contact_phone`   varchar(20)  DEFAULT NULL,
  `contact_email`   varchar(30)  DEFAULT NULL,
  `status`          char(1)      DEFAULT 'A',
  PRIMARY KEY (`id`)
);

-- Table structure for table `skill`
DROP TABLE IF EXISTS `skill`;
CREATE TABLE `skill` (
  `id`    int(11)      NOT NULL AUTO_INCREMENT,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Table structure for table `user`
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id`          int(11)      NOT NULL AUTO_INCREMENT,
  `email`       varchar(100) NOT NULL,
  `phone`       varchar(100) DEFAULT NULL,
  `state`       varchar(100) DEFAULT NULL,
  `country`     varchar(100) DEFAULT NULL,
  `zip`         varchar(100) DEFAULT NULL,
  `status`      char(1)      NOT NULL,
  PRIMARY KEY (`id`)
);

-- Table structure for table `user_organization`
DROP TABLE IF EXISTS `user_organization`;
CREATE TABLE `user_organization` (
  `id`              int(11) NOT NULL AUTO_INCREMENT,
  `user_id`         int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `status`          char(1) NOT NULL,
  PRIMARY KEY (`id`)
);
