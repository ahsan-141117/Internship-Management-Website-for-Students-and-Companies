const url  = require('url');
const fs   = require('fs');
const path = require('path');
const db   = require('./db');

module.exports = function handleReceivedApplications(req, res) {
  const { pathname, query } = url.parse(req.url, true);

  // always send JSON by default
  res.setHeader('Content-Type', 'application/json');

  // 1) List all received applications for this company (only status = 'Submitted')
  if (pathname === '/received_applications' && req.method === 'GET') {
    const companyId = req.session.userId;
    if (!companyId) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    // Build base SQL
    let sql =
      `SELECT
         a.application_id,
         s.name   AS student_name,
         s.email  AS student_email,
         i.title  AS applied_post,
         a.resume,
         a.status
       FROM applications a
       JOIN internships  i ON a.internship_id = i.internship_id
       JOIN students     s ON a.student_id    = s.student_id
       WHERE i.company_id = ${companyId}
         AND a.status = 'Submitted'`;

    // Filter by candidate name if provided
    if (query.candidate_name) {
      sql += ` AND s.name LIKE '%${query.candidate_name}%'`;
    }

    db.query(sql, (err, results) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: 'Database error' }));
      }
      res.writeHead(200);
      res.end(JSON.stringify(results));
    });
  }
  // 2) Download a candidate's resume
  else if (pathname === '/download_resume' && req.method === 'GET') {
    const companyId = req.session.userId;
    if (!companyId) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    const appId = query.application_id;
    if (!appId) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Missing application_id' }));
    }

    const sqlDownload =
      `SELECT a.resume
         FROM applications a
         JOIN internships i ON a.internship_id = i.internship_id
        WHERE a.application_id = ${appId}
          AND i.company_id    = ${companyId}`;

    db.query(sqlDownload, (err, results) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: 'Database error' }));
      }
      if (!results[0] || !results[0].resume) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Resume not found' }));
      }

      const filePath = path.join(__dirname, results[0].resume);

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'File not found on server' }));
      }

      res.writeHead(200, {
        'Content-Type':        'application/octet-stream',
        'Content-Disposition': `attachment; filename=${path.basename(filePath)}`
      });
      fs.createReadStream(filePath).pipe(res);
    });
  }
  // 3) Take action on an application (accept / reject / shortlist)
  else if (pathname === '/action_application' && req.method === 'GET') {
    const companyId = req.session.userId;
    if (!companyId) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    const appId  = query.application_id;
    const action = query.action;
    if (!appId) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Missing application_id' }));
    }
    if (!['accept','reject','shortlist'].includes(action)) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Invalid action' }));
    }

    const statusMap = {
      accept: 'accepted',
      reject: 'rejected',
      shortlist: 'shortlisted'
    };

    const messages = {
      accept:    'Application accepted',
      reject:    'Application rejected',
      shortlist: 'Application shortlisted'
    };

    const newStatus = statusMap[action];
    const msg = messages[action];

    const sqlAction =
      `UPDATE applications a
         JOIN internships i ON a.internship_id = i.internship_id
        SET a.status = '${newStatus}'
        WHERE a.application_id = ${appId}
          AND i.company_id      = ${companyId}`;

    db.query(sqlAction, err => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: 'Update failed' }));
      }
      res.writeHead(200);
      res.end(JSON.stringify({ message: msg }));
    });
  }
  // 404 for other routes
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};
