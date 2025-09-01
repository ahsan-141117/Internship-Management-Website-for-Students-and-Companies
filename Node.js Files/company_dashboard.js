const url = require('url');
const db = require('./db');

module.exports = function handleCompanyInfo(req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/company_dashboard' && req.method === 'GET') {
        if (!(req.session && req.session.userType === 'Company')) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }

        const companyId = req.session.userId;

        const sql = `SELECT name FROM companies WHERE company_id = ${companyId}`;
        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database error' }));
            }

            if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Company not found' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ name: results[0].name }));
        });

        return true; // handled
    }

    return false; // not handled
};
