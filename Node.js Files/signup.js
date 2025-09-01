const fs        = require('fs');
const path      = require('path');
const formidable = require('formidable');
const db        = require('./db');

module.exports = function handleSignup(req, res) {
    if (req.method === 'POST' && req.url === '/signup') {
        const contentType = req.headers['content-type'] || '';

        if (contentType.startsWith('application/json')) {
            // Handle JSON request (Student signup)
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const { userType, name, email, password } = JSON.parse(body);

                    const cleanUserType = userType ? userType.toString().trim() : '';
                    const cleanName = name ? name.toString().trim() : '';
                    const cleanEmail = email ? email.toString().trim() : '';
                    const cleanPassword = password ? password.toString() : '';

                    if (!cleanUserType || !cleanName || !cleanEmail || !cleanPassword) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'All fields are required' }));
                    }

                    if (cleanUserType !== 'Student') {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: `Invalid user type for JSON signup: ${cleanUserType}` }));
                    }

                    const sql =
                        `INSERT INTO students (name, email, password)` +
                        ` VALUES ('${cleanName}', '${cleanEmail}', '${cleanPassword}')`;

                    db.query(sql, (err) => {
                        if (err) {
                            console.error('Student insert error:', err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Database error' }));
                        }
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Student signup successful' }));
                    });
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
                }
            });
        }
        else if (contentType.startsWith('multipart/form-data')) {
            // Handle multipart request (Company signup with logo file)
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, 'uploads');
            form.keepExtensions = true;

            if (!fs.existsSync(form.uploadDir)) {
                fs.mkdirSync(form.uploadDir);
            }

            form.on('fileBegin', (name, file) => {
                console.log('fileBegin event:', { name, originalFilename: file.originalFilename });
                if (name === 'logo' && file.originalFilename) {
                    const timestamp = Date.now();
                    const newFilename = `${timestamp}-${file.originalFilename}`;
                    file.filepath = path.join(form.uploadDir, newFilename);
                    file.newFilename = newFilename;
                    console.log('Set new filepath:', file.filepath);
                }
            });

            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Form parse error' }));
                }

                const userType = Array.isArray(fields.userType) ? fields.userType[0] : fields.userType;
                const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
                const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
                const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

                const cleanUserType = userType ? userType.toString().trim() : '';
                const cleanName = name ? name.toString().trim() : '';
                const cleanEmail = email ? email.toString().trim() : '';
                const cleanPassword = password ? password.toString() : '';

                console.log('Parsed fields:', { userType, name, email, password });
                console.log('Clean values:', { cleanUserType, cleanName, cleanEmail });

                if (!cleanUserType || !cleanName || !cleanEmail || !cleanPassword) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'All fields are required' }));
                }

                if (cleanUserType !== 'Company') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Invalid user type for multipart signup: ${cleanUserType}` }));
                }

                const logoFile = files.logo;
                console.log('Logo file received:', logoFile);
                console.log('Files object:', files);

                const actualLogoFile = Array.isArray(logoFile) ? logoFile[0] : logoFile;

                const logoPath = actualLogoFile && actualLogoFile.newFilename
                    ? `/uploads/${actualLogoFile.newFilename}`
                    : null;

                console.log('Final logo path:', logoPath);

                const sql =
                    `INSERT INTO companies (name, email, password, logo_path)` +
                    ` VALUES ('${cleanName}', '${cleanEmail}', '${cleanPassword}', '${logoPath}')`;

                db.query(sql, (err) => {
                    if (err) {
                        console.error('Company insert error:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Database error' }));
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Company signup successful' }));
                });
            });
        }
        else {
            // Unsupported Content-Type
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unsupported Content-Type' }));
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
