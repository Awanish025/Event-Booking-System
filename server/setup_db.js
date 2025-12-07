const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
});

const schemaPath = path.join(__dirname, '../database/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL.');

    connection.query(schemaSql, (err, results) => {
        if (err) {
            console.error('Error executing schema:', err.message);
            process.exit(1);
        }
        console.log('Database initialized successfully.');
        connection.end();
    });
});
