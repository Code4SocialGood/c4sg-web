CREATE DATABASE  IF NOT EXISTS `testc4sg` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `testc4sg`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: testc4sg
-- ------------------------------------------------------
-- Server version	5.7.16-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `status` char(1) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `match_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `delete_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cause`
--

DROP TABLE IF EXISTS `cause`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cause` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cause` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cause`
--

LOCK TABLES `cause` WRITE;
/*!40000 ALTER TABLE `cause` DISABLE KEYS */;
INSERT INTO `cause` VALUES (12,'All'),(13,'Animals'),(14,'Arts & Culture'),(15,'Disaster Relief'),(16,'Education'),(17,'Environment'),(18,'International'),(19,'Justice & Legal'),(20,'LGBT'),(21,'Politics '),(22,'Poverty'),(23,'Technology'),(24,'Women'),(25,'Youth');
/*!40000 ALTER TABLE `cause` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip` varchar(100) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `contact_email` varchar(30) DEFAULT NULL,
  `status` char(1) NOT NULL DEFAULT 'A',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_by` int(11) DEFAULT '0',
  `change_time` timestamp NULL DEFAULT NULL,
  `change_by` int(11) DEFAULT NULL,
  `delete_time` timestamp NULL DEFAULT NULL,
  `delete_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;
INSERT INTO `organization` VALUES (1,'Teens Give','http://www.teensgive.org','Logo_teensGive',NULL,'Rye','NY','USA','10580',NULL,NULL,NULL,'A','2016-12-25 16:42:32',0,NULL,NULL,NULL,NULL),(2,'AFRICAN FILM FESTIVAL, INC.','http://www.africanfilmny.org/','Logo_AFF','154 West 18th Street, Suite 2A','New York','NY','USA','10011',NULL,NULL,NULL,'A','2016-12-25 16:42:32',0,NULL,NULL,NULL,NULL),(3,'NATIONAL ASSOCIATION OF SCHOOL NURSES','http://www.nasn.org/','Logo_NASN.jpg',' 1100 Wayne Ave #925','Silver Spring','MD','USA','20910 ',NULL,NULL,NULL,'A','2016-12-25 16:50:55',0,NULL,NULL,NULL,NULL),(4,'RUBICON PROGRAMS INC.','http://www.rubiconprograms.org','Logo_Rubison.png','2500 Bissell Avenue','Richmond','CS','USA','94804',NULL,NULL,NULL,'A','2016-12-25 20:15:14',0,NULL,NULL,NULL,NULL),(5,'Conversations For Good','http://www.convoforgood.org','Logo_ConvoForGood.png',NULL,'Berkeley','CA','USA',NULL,NULL,NULL,NULL,'A','2016-12-25 20:22:29',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip` varchar(100) DEFAULT NULL,
  `remote` char(1) DEFAULT 'Y',
  `contact_name` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `contact_email` varchar(30) DEFAULT NULL,
  `status` char(1) DEFAULT 'A',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_by` int(11) DEFAULT '0',
  `change_time` timestamp NULL DEFAULT NULL,
  `change_by` int(11) DEFAULT NULL,
  `delete_time` timestamp NULL DEFAULT NULL,
  `delete_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'WebSite Construction','Development of a new website based on one of the available CMS website templates (such as Wordpress, Squarespace, or Drupal. Training to ensure Organization\'s staff members can update content and manage the site post-launch. Note: Only includes websites built on CMS based platforms. This is not a website from scratch.','Project_TeensGive.png',1,NULL,'','','','','Y',NULL,NULL,NULL,'A','2016-12-25 21:08:48',0,NULL,NULL,'0000-00-00 00:00:00',NULL),(3,'PROTOTYPING A MOBILE SITE','A mobile-friendly website that adjusts to all mobile devices. Documentation on how users will experience the mobile site and how to maintain the site. Guidance on resources for finding assistance moving forward. Note: This project does not include site content development or redesign of your website.','Project_AFF.jpg',2,NULL,NULL,NULL,'',NULL,'Y',NULL,NULL,NULL,'A','2016-12-25 16:53:46',0,NULL,NULL,'0000-00-00 00:00:00',NULL),(13,'SEARCH ENGINE MARKETING PLAN','An overall Search Engine Marketing (SEM) plan that includes goals and actionable strategies for improving rankings of Organization’s website or blog.','Project_NASN.jpg',3,NULL,NULL,NULL,'',NULL,'Y',NULL,NULL,NULL,'A','2016-12-25 21:12:08',0,NULL,NULL,NULL,NULL),(14,'LOGO DESIGN & VISUAL BRAND IDENTITY','Expert consultation regarding the Organization\'s current branding and desired branding objectives. Visual Branding guidelines that include specific colors, fonts, and graphic elements to build into communications, print and online mediums. High-resolution logo delivered electronically.','Project_Rubicon.jpg',4,NULL,NULL,NULL,NULL,NULL,'Y',NULL,NULL,NULL,'A','2016-12-25 20:10:54',0,NULL,NULL,NULL,NULL),(15,'Website Visual Design','Visual design','Project_ConvoForGood.jpg',5,NULL,NULL,NULL,NULL,NULL,'Y',NULL,NULL,NULL,'A','2016-12-25 21:26:34',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (1,'Web Design'),(2,'Web Development'),(3,'Mobile App'),(4,'WordPress'),(5,'Drupal'),(6,'Java'),(7,'PhP'),(8,'JavaScript'),(9,'C++');
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip` varchar(100) DEFAULT NULL,
  `status` char(1) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `change_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `delete_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_organization`
--

DROP TABLE IF EXISTS `user_organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `status` char(1) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_organization`
--

LOCK TABLES `user_organization` WRITE;
/*!40000 ALTER TABLE `user_organization` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_organization` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-28 19:18:16
