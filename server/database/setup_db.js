const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'rvitm',
            multipleStatements: true
        });

        console.log('Connected to MySQL.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Executing schema.sql...');
        await connection.query(schemaSql);
        console.log('Schema created successfully.');

        // Reconnect specifying the database, just in case
        await connection.query('USE slrros');

        const seedPath = path.join(__dirname, 'seed-data.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        console.log('Executing seed-data.sql...');
        await connection.query(seedSql);
        console.log('Seed data inserted successfully.');

        await connection.end();
        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

setupDB();
