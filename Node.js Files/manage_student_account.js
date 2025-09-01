const url = require('url');
const db  = require('./db');

module.exports = function handleManageStudentAccount(req, res) {
    const { pathname } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/manage_student_account' && req.method === 'GET') {
        const studentId = req.session.userId;
        if (!studentId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        const sql = `SELECT student_id, name, email FROM students WHERE student_id = ${studentId}`;
        db.query(sql, (err, result) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
            }
            if (!result[0]) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Student not found' }));
                return;
            }
            const { name, email } = result[0];
            res.writeHead(200);
            res.end(JSON.stringify({ name, email }));
        });
    }
    else if (pathname === '/manage_student_account' && req.method === 'POST') {
        const studentId = req.session.userId;
        if (!studentId) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { name, email, password } = JSON.parse(body);
            const fields = [];
            if (name)     fields.push(`name = '${name}'`);
            if (email)    fields.push(`email = '${email}'`);
            if (password) fields.push(`password = '${password}'`);

            if (fields.length === 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'No fields to update' }));
                return;
            }

            const updateSql = `UPDATE students SET ${fields.join(', ')} WHERE student_id = ${studentId}`;
            db.query(updateSql, err => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Update failed' }));
                    return;
                }

                const selectSql = `SELECT student_id, name, email FROM students WHERE student_id = ${studentId}`;
                db.query(selectSql, (err, result) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: 'Database error' }));
                        return;
                    }
                    const { name, email } = result[0];
                    res.writeHead(200);
                    res.end(JSON.stringify({ name, email }));
                });
            });
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
