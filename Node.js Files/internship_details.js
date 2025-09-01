const url = require('url');
const db  = require('./db');
module.exports = function handleInternshipDetails(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const { query, pathname } = url.parse(req.url, true);
    if (pathname === '/internship_details' && req.method === 'GET') {
        const userId = req.session.userId;
        if (!userId) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }
        const internshipId = query.internship_id;
        if (!internshipId) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'No ID' }));
        }
        const sql = `
            SELECT
                i.internship_id,
                i.title,
                i.mode,
                i.skills,
                i.salary,
                i.duration,
                DATE_FORMAT(i.deadline, '%Y-%m-%d') as deadline,
                i.domain,
                i.location,
                i.description,
                c.company_id,
                c.name AS company_name,
                c.logo_path
            FROM internships i
            JOIN companies c ON i.company_id = c.company_id
            WHERE i.internship_id = ${internshipId}
        `;
        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'DB error' }));
            }
            if (!results.length) {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'Not found' }));
            }
            const internship = results[0];
            internship.skills = internship.skills
                .split(',')
                .map(skill => skill.trim());
            res.writeHead(200);
            res.end(JSON.stringify(internship));
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
};