# Please credit Mohammad Ahsan Hummayoun when using, sharing, or adapting this code

# AIMS – ASTA Internship Management System

AIMS (ASTA Internship Management System) is a full-stack web platform designed to streamline internship applications between students and companies. It provides dedicated dashboards, seamless application flows, and account management tools — making the internship process more efficient and transparent.

# Before you start
The index.js is built using express while the remaining webpages use vanilla Node.js.

# 🚀 Tech Stack

## Frontend: HTML, CSS, JavaScript

## Backend: Node.js (Express)

## Database: MySQL

# ✨ Key Features

- Student and Company Login / Signup

- Student Dashboard with internship browsing and application submission

- Company Dashboard to create, edit, and manage internships

- Application Tracking for students (My Applications, My Internships)

- Application Review for companies (Received Applications)

- Account Management for both students and companies



# 🛠️ Installation & Setup

Follow these steps to run AIMS (ASTA Internship Management System) locally:

1. Install Node.js

Download and install Node.js
 (LTS version recommended).
Verify installation:

node -v
npm -v

2. Clone the Repository
git clone https://github.com/your-username/AIMS.git
cd AIMS

3. Install Dependencies

Run the following command inside the project directory:

npm install express express-session mysql2 formidable


(The path module is built into Node.js and does not require installation.)

4. Configure the Database

Install and start MySQL on your system.

Create a database for the project:

CREATE DATABASE aims_db;


Open db.js and update the connection details:

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'aims_db'
});


Import or create required tables (e.g., students, companies, internships, applications).

5. Start the Server

From the project root directory, run:

node index.js


If successful, the server will start, and you can access the app in your browser at:

http://localhost:8080

# 📜 License

This project is licensed under the MIT License
.
Please credit Mohammad Ahsan Hummayoun when using, sharing, or adapting this code.

⚡ This version is minimal but still clear and recruiter-friendly.
