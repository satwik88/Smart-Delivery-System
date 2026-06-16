const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDB() {
    try {
        require('dotenv').config();
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
            port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
            user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
            password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'rvitm',
            database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'slrros',
            multipleStatements: true
        });

        console.log('Connected to MySQL.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Executing schema.sql...');
        await connection.query(schemaSql);
        console.log('Schema created successfully.');

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
