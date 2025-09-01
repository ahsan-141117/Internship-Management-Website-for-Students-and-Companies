const db = require('./db');

// we are expecting a post request that has JSON
module.exports = function handleLogin(req, res) {
    // accumulate incoming chunks in body
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', () => {
        // parse JSON body
        const { userType, email, password } = JSON.parse(body);

        // ensure required fields are present
        if (!userType || !email || !password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'All fields (userType, email, password) are required' }));
            return;
        }

        // determine which table to query
        const table = userType === 'Student' ? 'students' : 'companies';

        // build SQL using template strings
        const sql = `SELECT * FROM ${table} WHERE email = '${email}' AND password = '${password}'`;

        // execute query
        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
            }

            if (results.length > 0) {
                // New code: store user info in session for later authenticated requests
                if (req.session) {
                    req.session.userId = results[0][table === 'students' ? 'student_id' : 'company_id'];
                    req.session.userType = userType;
                    req.session.userName = results[0].name;   // Store username in session
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
                // error code 401 is Authentication Failed error
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid email or password' }));
            }
        });
    });
};
