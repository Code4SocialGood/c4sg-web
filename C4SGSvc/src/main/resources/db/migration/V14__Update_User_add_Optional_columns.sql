-- Modify columns
ALTER TABLE user
ADD  introduction         	 varchar(500) AFTER location,
ADD linked_inurl        	 	 varchar(100) AFTER introduction,
ADD personal_web_site     	 varchar(100) AFTER linked_inurl,
ADD resume        		 varchar(500) AFTER personal_web_site,
ADD skill1        		 varchar(30) AFTER resume,
ADD skill2        		 varchar(30) AFTER skill1,
ADD skill3        		 varchar(30) AFTER skill2,
ADD skill4        		 varchar(30) AFTER skill3,
ADD skill5       		 varchar(30) AFTER skill4;
