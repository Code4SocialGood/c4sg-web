--Create table for `title`
DROP TABLE IF EXISTS `title`;
CREATE TABLE `title` (
  `id`       INT(11)      NOT NULL AUTO_INCREMENT,
  `title`    VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
);