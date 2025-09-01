const url = require('url');
const db  = require('./db');

module.exports = function handleBrowseInternships(req, res) {
    const { query, pathname } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/browse_internships' && req.method === 'GET') {
        const studentId = req.session.userId;
        if (!studentId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        // Include logo_path in the SELECT so logos can be displayed dynamically
        let sql = 'SELECT i.*, c.name, c.logo_path FROM internships i JOIN companies c ON i.company_id = c.company_id WHERE 1';
        if (query.keyword)   sql += ` AND (i.title LIKE '%${query.keyword}%' OR c.name LIKE '%${query.keyword}%' OR i.skills LIKE '%${query.keyword}%')`;
        if (query.location)  sql += ` AND i.location LIKE '%${query.location}%'`;
        if (query.domain)    sql += ` AND i.domain LIKE '%${query.domain}%'`;
        if (query.salary_min && Number(query.salary_min) >= 0) sql += ` AND i.salary >= ${query.salary_min}`;
        if (query.salary_max && Number(query.salary_max) >= 0) sql += ` AND i.salary <= ${query.salary_max}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(results));
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
