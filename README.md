# 🙌 Please credit Mohammad Ahsan Hummayoun when using, sharing, or adapting this code  

# AIMS – ASTA Internship Management System  

AIMS (**ASTA Internship Management System**) is a full-stack web platform designed to streamline internship applications between students and companies. It provides dedicated dashboards, seamless application flows, and account management tools — making the internship process more efficient and transparent.  

---

# 📌 Before You Start  
The backend server runs on **Express** (`index.js`), with additional modules handling routes and business logic.  

---

# 🚀 Tech Stack  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js (Express)  
- **Database:** MySQL  

---

# ✨ Key Features  
- Student and Company **Login / Signup**  
- **Student Dashboard** with internship browsing and application submission  
- **Company Dashboard** to create, edit, and manage internships  
- **Application Tracking** for students (My Applications, My Internships)  
- **Application Review** for companies (Received Applications)  
- **Account Management** for both students and companies  

---

# 🛠️ Installation & Setup  

Follow these steps to run **AIMS (ASTA Internship Management System)** locally:  

### 1. Install Node.js  
Download and install [Node.js](https://nodejs.org/) (LTS version recommended).  
Verify installation:  
```bash
node -v
npm -v
```  

---

### 2. Clone the Repository  
```bash
git clone https://github.com/your-username/AIMS.git
cd AIMS
```  

---

### 3. Install Dependencies  
Run the following command inside the project directory:  
```bash
npm install express express-session mysql2 formidable
```  

*(The `path`, `fs`, and `url` modules are built into Node.js and do not require installation.)*  

---

### 4. Configure the Database  
1. Install and start **MySQL** on your system.  
2. Create a database for the project:  
```sql
CREATE DATABASE aims_db;
```  
3. Open `db.js` and update the connection details:  
```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'aims_db'
});
```  
4. Import or create required tables (e.g., students, companies, internships, applications).  

---

### 5. Start the Server  
From the project root directory, run:  
```bash
node index.js
```  

If successful, the server will start, and you can access the app in your browser at:  
```
http://localhost:8080
```  

---

# 📜 License  
This project is licensed under the [MIT License](./LICENSE).  
Please **credit Mohammad Ahsan Hummayoun** when using, sharing, or adapting this code.  
