# Dev Environment Setup

Github

	https://github.com/Code4SocialGood/C4SG
	
Database

	1. Install MySQL	
	2. Run the DDL script from MySQL -> C4SG.sql

Backend	

	1. Install your favorite IDE
	2. Start MySQL	
	3. Eclipse specific	
		 - Import project: File -> Import -> General -> Projects from Folder or Archive -> Import Source: C4SGSvc
		 - Run application: Right click on project: C4SGSvc, Run as: Spring Boot App
	4. Test Backend: Test Rest API in browser: http://localhost:8080/api/project/all

Frontend	

	1. Install your favorite IDE
	2. Install node/npm	
	3. Install npm packages: Run "npm install"
	4. Test Frontend: Run "npm start", the application is launched in brown: http://localhost:3000

More information could be found in Documentation folder.
