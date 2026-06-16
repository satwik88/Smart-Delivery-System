const mysql = require('mysql2/promise');

const firstNames = ['Asha', 'Vikram', 'Priya', 'Rahul', 'Sneha', 'Amit', 'Neha', 'Rohan', 'Kavita', 'Sanjay', 'Pooja', 'Anil', 'Sunita', 'Raj', 'Meena'];
const lastNames = ['Rao', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Kumar', 'Verma', 'Reddy', 'Desai', 'Joshi', 'Kapoor', 'Das', 'Sen', 'Bose', 'Nair'];

const statuses = ['placed', 'verified', 'packed', 'dispatched', 'in_transit', 'delivered'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedOrders() {
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

        console.log('Clearing existing orders...');
        await connection.query('DELETE FROM order_items');
        await connection.query('DELETE FROM orders');
        await connection.query('ALTER TABLE orders AUTO_INCREMENT = 1');

        console.log('Generating 100 orders...');
        const values = [];

        for (let i = 1; i <= 100; i++) {
            const customer_name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
            const budget = getRandomInt(500, 5000);
            
            // Format tracking code as 001, 002...
            const tracking_code = i.toString().padStart(3, '0');
            
            const source_warehouse_id = getRandomInt(1, 15);
            let dest_warehouse_id = getRandomInt(1, 15);
            while (dest_warehouse_id === source_warehouse_id) {
                dest_warehouse_id = getRandomInt(1, 15);
            }
            const vehicle_id = 1;
            
            const statusIndex = getRandomInt(0, 5);
            const status = statuses[statusIndex];
            
            let progress_pct = 0;
            if (status === 'delivered') progress_pct = 100;
            else if (status === 'in_transit' || status === 'dispatched') progress_pct = getRandomInt(40, 99);
            else if (status === 'packed') progress_pct = getRandomInt(20, 39);
            else if (status === 'verified') progress_pct = getRandomInt(1, 19);

            values.push([customer_name, budget, tracking_code, source_warehouse_id, dest_warehouse_id, vehicle_id, status, progress_pct]);
        }

        const query = `
            INSERT INTO orders 
            (customer_name, budget, tracking_code, source_warehouse_id, dest_warehouse_id, vehicle_id, status, progress_pct) 
            VALUES ?
        `;

        await connection.query(query, [values]);

        console.log('100 orders successfully seeded!');
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

seedOrders();
