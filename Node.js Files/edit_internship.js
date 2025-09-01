const url = require('url');
const db  = require('./db');

module.exports = function handleEditInternship(req, res) {
    const { pathname, query } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    // GET current internship data
    if (pathname === '/edit_internship' && req.method === 'GET') {
        const companyId    = req.session.userId;
        const internshipId = query.internship_id;
        if (!companyId) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }
        if (!internshipId) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Missing internship_id' }));
        }

        const sql = `
            SELECT
                internship_id,
                title,
                mode,
                skills,
                salary,
                duration,
                deadline,
                domain,
                location,
                description
            FROM internships
            WHERE internship_id = ${internshipId}
              AND company_id    = ${companyId}
        `;
        db.query(sql, (err, results) => {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Database error' }));
            }
            if (!results.length) {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'Not found or unauthorized' }));
            }
            res.writeHead(200);
            res.end(JSON.stringify(results[0]));
        });
    }
    // POST updates to internship
    else if (pathname === '/edit_internship' && req.method === 'POST') {
        const companyId = req.session.userId;
        if (!companyId) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }

            const id = data.internship_id;
            if (!id) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: 'Missing internship_id' }));
            }

            const cols   = [
                'title', 'mode', 'skills', 'salary',
                'duration', 'deadline', 'domain',
                'location', 'description'
            ];
            const updates = [];
            cols.forEach(col => {
                if (data[col] !== undefined) {
                    const val = col === 'salary'
                              ? Number(data[col])
                              : data[col];
                    
                    // Fix: Don't quote numeric values
                    if (col === 'salary') {
                        updates.push(`${col} = ${val}`);  // No quotes for numbers
                    } else {
                        updates.push(`${col} = '${val}'`); // Quotes for strings
                    }
                }
            });

            if (!updates.length) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: 'No fields provided to update' }));
            }

            const sql = `
                UPDATE internships
                   SET ${updates.join(', ')}
                 WHERE internship_id = ${id}
                   AND company_id    = ${companyId}
            `;
            db.query(sql, (err, result) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(JSON.stringify({ error: 'Update failed' }));
                }
                if (result.affectedRows === 0) {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: 'Not found or unauthorized' }));
                }
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Internship updated successfully' }));
            });
        });
    }
    // all other routes
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};