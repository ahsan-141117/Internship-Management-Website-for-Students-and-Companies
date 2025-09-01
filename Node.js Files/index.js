const express = require('express');
const session = require('express-session');
const path    = require('path');

const signup               = require('./signup');
const login                = require('./login');
const studentDashboard     = require('./student_dashboard');
const companyDashboard     = require('./company_dashboard');
const manageStudentAccount = require('./manage_student_account');
const browseInternships    = require('./browse_internships');
const internshipDetails    = require('./internship_details');
const submitApplication    = require('./submit_application');
const myApplications       = require('./my_applications');
const manageCompanyAccount = require('./manage_company_account');
const createInternship     = require('./create_internship');
const myInternships        = require('./my_internships');
const editInternship       = require('./edit_internship');
const receivedApplications = require('./received_applications');

const app = express();

// Redirect root "/" to signup.html
app.get('/', (req, res) => {
    res.redirect('/signup.html');
});

// session support with secure: false for localhost http
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

// serve static assets
app.use('/',           express.static(path.join(__dirname, '../frontend/html')));
app.use('/javascript', express.static(path.join(__dirname, '../frontend/javascript')));
app.use('/css',        express.static(path.join(__dirname, '../frontend/css')));
app.use('/uploads',    express.static(path.join(__dirname, 'uploads')));

// auth
app.post('/signup', signup);
app.post('/login',  login);
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        res.redirect('/login.html');
    });
});

// student routes
app.get('/student_dashboard',       studentDashboard);
app.get('/manage_student_account',  manageStudentAccount);
app.post('/manage_student_account', manageStudentAccount);
app.get('/browse_internships',      browseInternships);
app.get('/internship_details',      internshipDetails);
app.post('/submit_application',     submitApplication);
app.get('/my_applications',         myApplications);

// company routes
app.get('/company_dashboard',       companyDashboard);
app.get('/manage_company_account',  manageCompanyAccount);
app.post('/manage_company_account', manageCompanyAccount);
app.post('/create_internship',      createInternship);
app.get('/my_internships',          myInternships);
app.get('/delete_internship',       myInternships);
app.get('/edit_internship',         editInternship);
app.post('/edit_internship',        editInternship);

// applications & resume routes
app.get('/received_applications',   receivedApplications);
app.get('/download_resume',         receivedApplications);
app.get('/action_application',      receivedApplications);

// start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
