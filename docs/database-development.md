# Database Development


## 1. Database Change Procedure

### 1.1 Introduction

*Flyway* is adopted as the database migration tool for this project. 

Database scripts are located at: `\C4SG\C4SGSvc\src\main\resources\db\migration\`

The scripts are in two categories: Database Strcure scripts, and Data Load scripts.

### 1.2 Initial setup

In WinSQL workbench, create a schema: `c4sg`

When you run the SpringBoot application, the tables will be created and data will be loaded automatically.

### 1.3 How to sync up with database change

You do nothing. 

If you have the latest code from repository, it contains the latest database script. When you start the Spring boot application, your local MySQL database will be updated automatically.

### 1.4 How to make database change

We apply additional  database changes incrementally to the existing scripts.

In your local repository, create a new script file under: `\C4SG\C4SGSvc\src\main\resources\db\migration\`.

The name convention of your file should follow: 
* `V[next version]_Schema_[change description]`: for database structure change
* `V[next version]_Data_[change description]`: for data change

For example, if the current scripts are:
* `V1_Initial_schema`
* `V2_Initial_data`

The next script will be named like: 
* `V3_Schema_add_user_table` (if you want to change table structure)
* `V3_Data_load_user_data` (if you want to change data)
