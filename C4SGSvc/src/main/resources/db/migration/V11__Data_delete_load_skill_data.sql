--Delete previous data from skill table
DELETE FROM `skill`;

--Load new data into skill table
INSERT INTO `skill` (`id`,`skill`)
  VALUES ('1','HTML'),
         ('2','CSS'),
         ('3','Java'),
         ('4','Python'),
         ('5','PhP'),
         ('6','Ruby'),
         ('7','iPhone Programming'),
         ('8','Android Programming');