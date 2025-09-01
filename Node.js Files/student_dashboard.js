const url = require('url');
const db  = require('./db');

module.exports = function handleStudentInfo(req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/student_dashboard' && req.method === 'GET') {
        if (!(req.session && req.session.userType === 'Student')) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }

        const studentId = req.session.userId;

        const sql = `SELECT name FROM students WHERE student_id = ${studentId}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database error' }));
            }

            if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Student not found' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ name: results[0].name }));
        });

        return true;
    }

    return false;
};
