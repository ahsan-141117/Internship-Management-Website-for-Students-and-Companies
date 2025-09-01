const url = require('url');
const db  = require('./db');

module.exports = function handleCreateInternship(req, res) {
    const { pathname } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/create_internship' && req.method === 'POST') {
        const companyId = req.session.userId;
        if (!companyId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { title, mode, skills, salary, duration,
                    deadline, domain, location, description } = data;

            // Validate required fields
            if (!title || !mode || !skills || salary == null ||
                !duration || !deadline || !domain ||
                !location || !description) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'All fields are required' }));
                return;
            }

            // Validate mode
            if (mode !== 'remote' && mode !== 'on-site') {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Mode must be remote or on-site' }));
                return;
            }

            // Validate salary
            const sal = Number(salary);
            if (isNaN(sal) || sal < 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Salary must be a non-negative number' }));
                return;
            }

            const sql = `
                INSERT INTO internships
                    (company_id, title, mode, skills, salary,
                     duration, deadline, domain, location, description)
                VALUES
                    (${companyId},
                     '${title}',
                     '${mode}',
                     '${skills}',
                     ${sal},
                     '${duration}',
                     '${deadline}',
                     '${domain}',
                     '${location}',
                     '${description}')
            `;

            db.query(sql, (err, result) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Database error' }));
                    return;
                }

                res.writeHead(200);
                res.end(JSON.stringify({
                    message: 'Internship created successfully',
                    internshipId: result.insertId
                }));
            });
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
