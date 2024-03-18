[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/zN7EOVUc)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13823623&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### EP - Course Assignment

Startup code for Noroff back-end development 1 - EP course (e-commerce).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application installation:

1. Installation:
After cloning the repository from github, all dependencies needs to be installed
Use the following command in the terminal
npm install 


# Running the application

1. Setting up the  database:
A database in mysql have to be set up.
Using the following query to create a new database in the mysql software

CREATE DATABASE yourDatabaseNameHere

The database name must then be used in the .env file. Example below
Then we need a user with full access to the database
In MySql go to administration, then users and privileges, create a new user and give it right to all schema privileges
The mysql username and password must be used in the .env file. Example below


2. .env config
Needed for connection to the database
Example of my env file here

HOST = "localhost"
ADMIN_USERNAME = "ProjectAdmin"
ADMIN_PASSWORD = "project"
DATABASE_NAME = "eCommerce"
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
TOKEN_SECRET = "5779535e125729d8a3e70b10171733494eaaf9b5f503912ef832567fb851313f400ce38b1f9c84c77193d8ddadb44b0739b4d846741fe00df84b420bb1e1f3d5"


3. Token secret
The above .env file have a TOKEN_SECRET. To create a new token secret, use the built in node.js module "crypto"
In the terminal write the following

crypto.randomBytes(64).toString('hex')

then copy that string and paste it in the .env as TOKEN_SECRET


4. Start the server
use the command as follows in the terminal
npm start

The server can now be accessed with the url http://localhost:3000


5. Initializing the database
The database is currently empty
Using postman we can send a post request to the following url 
http://localhost:3000/init

this will initialize the database with brands, categories, order statuses, membership statuses, roles, products and an Admin user

# Test API
Tests have been made for /auth /categories and /products
Database must be initialized first for tests to function proparly. 
To run tests, first start the server

npm start

then open a second terminal and type the following in that terminal

npm test


# Using the application

1. API endpoints
http://localhost:3000/auth
http://localhost:3000/products
http://localhost:3000/brands
http://localhost:3000/categories
http://localhost:3000/memberships
http://localhost:3000/orders
http://localhost:3000/cart
http://localhost:3000/search
http://localhost:3000/roles
http://localhost:3000/init

2. Admin frontend
The frontend is a seperate part that only works for users with Admin role. It is accessed through this endpoint
http://localhost:3000/admin


# Node.js
Node js version: v18.18.0


# References

I have used the internet and chatgpt to help me with logical struggles and syntax issues during this test.

orderNumberGenerator: 
logic was created with the help of chatGPT. 
I was at first looking for a simple method already in js that could help me. But i did not find any in my search.
Then i went for the logic myself. After some time of tinkering, but not getting to it, i used chatGPT for help, so i dont get stuck for too long at a single problem.

Authorization and res.cookies:
I had som issues getting the token to work in my frontend. Struggled to find a way to set the authorization header.
I used some youtube videos going through jwt and express js. They showed a great way of using res.cookies.
This is why i have a check for authorization header and res.cookies in my middleware function.
The admin frontend part stores the token in the res.cookies. For my backend api i used the authorization header i can set in postman

Front End: 
I have done significantly more backend training, and so my front end is not as fluent. 
I used chatGPT and bootstrap.com to help me with basic setups of tables and dropdown buttons and syntax issues.
Also used my earlier CA assignments to compare and copy what worked great for me there


# Dependencies and version

Axios 1.6.7:
Used for sending http requests to the server from the frontend

Bootstrap 5.3.3:
Used for the frontend to get access to premade styles, to make frontend creation easier and look consistent

Dotenv 16.4.4:
For loading variables from .env to process.env

Ejs 3.1.9:
A template engine for using javascript inside html code

Express 4.18.2:
A framework for node.js used to build web applications and RestAPI

Jsend 1.1.0:
To format JSON responses in a consistent manner

JsonWebToken 9.0.2:
A tool used for creating JWT for authenticating logged in users

MySql 2.18.1 and MySql2 3.9.1:
Used to interact with the MySql database software

Sequelize 6.37.0:
using ORM to simplify interactions between javascript and mysql

Supertest 6.3.4:
Used for testing HTTP server requests

Jest 29.7.0:
Used to test functions, to see if the results is as expected

Swagger-autogen 2.23.7:
Automatically creates swagger documentations for express.js. Using JSDoc comments

Swagger-ui-express 5.0.0:
Used to create a user interface to interact with the API




