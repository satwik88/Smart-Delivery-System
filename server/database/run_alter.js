const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runAlter() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'rvitm',
            database: 'slrros',
            multipleStatements: true
        });

        const sqlPath = path.join(__dirname, 'alter.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executing alter.sql...');
        await connection.query(sql);
        console.log('Alteration and seeding complete.');
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

runAlter();
