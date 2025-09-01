const url = require('url');
const db  = require('./db');

module.exports = function handleMyApplications(req, res) {
    const { pathname } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/my_applications' && req.method === 'GET') {
        const studentId = req.session.userId;
        if (!studentId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        const sql = 
            `SELECT
                a.application_id,
                i.title,
                c.name AS company,
                a.status
             FROM applications a
             JOIN internships i ON a.internship_id = i.internship_id
             JOIN companies c   ON i.company_id    = c.company_id
             WHERE a.student_id = ${studentId}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(results));
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
