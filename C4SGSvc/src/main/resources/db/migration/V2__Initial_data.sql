-- Dumping data for table `cause`
INSERT INTO `cause`
VALUES (12,'All'),
       (13,'Animals'),
       (14,'Arts & Culture'),
       (15,'Disaster Relief'),
       (16,'Education'),
       (17,'Environment'),
       (18,'International'),
       (19,'Justice & Legal'),
       (20,'LGBT'),
       (21,'Politics'),
       (22,'Poverty'),
       (23,'Technology'),
       (24,'Women'),
       (25,'Youth');

-- Dumping data for table `organization`
INSERT INTO `organization`
VALUES (1,'Teens Give','http://www.teensgive.org','Logo_teensGive','Teens Give Organization', NULL, '7451 North William Court', NULL,'Rye','NY','USA','10580',NULL,NULL,NULL,'A'),
       (2,'AFRICAN FILM FESTIVAL, INC.','http://www.africanfilmny.org/','Logo_AFF', 'African Film Festival', NULL, '154 West 18th Street', 'Suite 2A','New York','NY','USA','10011',NULL,NULL,NULL,'A'),
       (3,'NATIONAL ASSOCIATION OF SCHOOL NURSES','http://www.nasn.org/','Logo_NASN.jpg', 'National Association of School Nurses', NULL, ' 1100 Wayne Ave', '#925','Silver Spring','MD','USA','20910 ',NULL,NULL,NULL,'A'),
       (4,'RUBICON PROGRAMS INC.','http://www.rubiconprograms.org','Logo_Rubison.png', 'Rubicon Programs Inc', NULL, '2500 Bissell Avenue', NULL,'Richmond','CS','USA','94804',NULL,NULL,NULL,'A'),
       (5,'Conversations For Good','http://www.convoforgood.org','Logo_ConvoForGood.png', 'Conversations For Good', NULL, '504 Marsh Court ', NULL,'Berkeley','CA','USA',NULL,NULL,NULL,NULL,'A');

-- Dumping data for table `project`
INSERT INTO `project`
VALUES (1, 'WebSite Construction','Development of a new website based on one of the available CMS website templates (such as Wordpress, Squarespace, or Drupal. Training to ensure Organization\'s staff members can update content and manage the site post-launch. Note: Only includes websites built on CMS based platforms. This is not a website from scratch.','Project_TeensGive.png', 1,NULL,'','','','','Y',NULL,NULL,NULL,'A'),
       (3,'PROTOTYPING A MOBILE SITE','A mobile-friendly website that adjusts to all mobile devices. Documentation on how users will experience the mobile site and how to maintain the site. Guidance on resources for finding assistance moving forward. Note: This project does not include site content development or redesign of your website.','Project_AFF.jpg', 2,NULL,NULL,NULL,'',NULL,'Y',NULL,NULL,NULL,'A'),
       (13, 'SEARCH ENGINE MARKETING PLAN','An overall Search Engine Marketing (SEM) plan that includes goals and actionable strategies for improving rankings of Organization’s website or blog.', 'Project_NASN.jpg', 3,NULL,NULL,NULL,'',NULL,'Y',NULL,NULL,NULL,'A'),
       (14,'LOGO DESIGN & VISUAL BRAND IDENTITY','Expert consultation regarding the Organization’s current branding and desired branding objectives. Visual Branding guidelines that include specific colors, fonts, and graphic elements to build into communications, print and online mediums. High-resolution logo delivered electronically.','Project_Rubicon.jpg', 4,NULL,NULL,NULL,NULL,NULL,'Y',NULL,NULL,NULL,'A'),
       (15,'Website Visual Design','Visual design','Project_ConvoForGood.jpg',5,NULL,NULL,NULL,NULL,NULL,'Y',NULL,NULL,NULL,'A');

-- Dumping data for table `skill`
INSERT INTO `skill`
VALUES (1,'Web Design'),(2,'Web Development'),(3,'Mobile App'),(4,'WordPress'),
       (5,'Drupal'),(6,'Java'),(7,'PhP'),(8,'JavaScript'),(9,'C++');
