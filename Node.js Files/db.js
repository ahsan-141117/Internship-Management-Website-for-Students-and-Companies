const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'astadb',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err.message);
        return;
    }

    console.log('Connected to ASTADB!');
});

module.exports = connection;