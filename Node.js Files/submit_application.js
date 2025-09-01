const url        = require('url');
const formidable = require('formidable');
const db         = require('./db');
const fs         = require('fs');
const path       = require('path');

module.exports = function handleSubmitApplication(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { pathname } = url.parse(req.url, true);

    if (pathname === '/submit_application' && req.method === 'POST') {
        const studentId = req.session.userId;
        if (!studentId) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: 'Unauthorized' }));
        }

        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, 'uploads');
        form.keepExtensions = true;

        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir);
        }

        // Save with timestamp prefix + original filename
        form.on('fileBegin', (name, file) => {
            const timestamp = Date.now();
            const newFilename = timestamp + '-' + file.originalFilename;
            file.filepath = path.join(form.uploadDir, newFilename);
            file.newFilename = newFilename;
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Form parse error:', err);
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Form parse error' }));
            }

            const internshipId = fields.internship_id;
            if (!internshipId) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: 'Missing internship_id' }));
            }

            const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
            const resumeFilePath = resumeFile
                ? path.relative(__dirname, resumeFile.filepath).replace(/\\/g, '/')
                : '';

            console.log('Storing resume path:', resumeFilePath);

            const sql = `
                INSERT INTO applications
                    (student_id, internship_id, status, resume)
                VALUES
                    (${studentId}, ${internshipId}, 'Submitted', '${resumeFilePath}')
            `;

            db.query(sql, (err, result) => {
                if (err) {
                    console.error('DB error:', err);
                    res.writeHead(500);
                    return res.end(JSON.stringify({ error: 'DB error' }));
                }
                console.log('Application inserted with ID:', result.insertId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
