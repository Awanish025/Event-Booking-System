// const mysql = require('mysql2');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     multipleStatements: true
// });

// const schemaPath = path.join(__dirname, '../database/schema.sql');
// const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err.message);
//         process.exit(1);
//     }
//     console.log('Connected to MySQL.');

//     connection.query(schemaSql, (err, results) => {
//         if (err) {
//             console.error('Error executing schema:', err.message);
//             process.exit(1);
//         }
//         console.log('Database initialized successfully.');
//         connection.end();
//     });
// });
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
const result = require('dotenv').config({ path: envPath });
if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('Loaded .env keys:', Object.keys(result.parsed));
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, 'certs/ca.pem'))
    }
});

const schemaPath = path.join(__dirname, '../database/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

connection.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('🎉 Connected to Aiven MySQL!');

    connection.query(schemaSql, (err, results) => {
        if (err) {
            console.error('❌ Error executing schema:', err.message);
            process.exit(1);
        }
        console.log('📌 Database initialized successfully.');
        connection.end();
    });
});
