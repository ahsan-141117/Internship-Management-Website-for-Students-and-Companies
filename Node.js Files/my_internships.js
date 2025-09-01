const url = require('url');
const db  = require('./db');
module.exports = function handleMyInternships(req, res) {
    const { pathname, query } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');
    if (pathname === '/my_internships' && req.method === 'GET') {
        const companyId = req.session.userId;
        if (!companyId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }
        const sql = `
            SELECT internship_id,
                   title,
                   mode,
                   skills,
                   salary,
                   duration,
                   DATE_FORMAT(deadline, '%Y-%m-%d') as deadline,
                   domain,
                   location,
                   description
              FROM internships
             WHERE company_id = ${companyId}
        `;
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
    else if (pathname === '/delete_internship' && req.method === 'GET') {
        const companyId = req.session.userId;
        if (!companyId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }
        const id = query.internship_id;
        if (!id) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing internship_id' }));
            return;
        }
        const sql = `
            DELETE FROM internships
             WHERE internship_id = ${id}
               AND company_id    = ${companyId}
        `;
        db.query(sql, (err, result) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Deletion failed' }));
                return;
            }
            if (result.affectedRows === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found or unauthorized' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Internship deleted' }));
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};