const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Registering test company...");
        const regRes = await fetch('http://localhost:5000/api/auth/register-company', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName: 'Audit Co', ownerUsername: 'audit_owner', ownerPassword: 'password123' })
        });
        
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'audit_owner', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) throw new Error("No token returned: " + JSON.stringify(loginData));
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        console.log("Creating Driver via API...");
        const driverRes = await fetch('http://localhost:5000/api/drivers', {
            method: 'POST',
            headers,
            body: JSON.stringify({ username: 'audit_driver_02', password: 'secure_password' })
        });
        const driverData = await driverRes.json();
        console.log("Driver API Response:", driverData);

        console.log("Creating Vehicle via API...");
        const vehicleRes = await fetch('http://localhost:5000/api/fleet', {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: 'Audit Van 02', license_plate: 'AUD-9998', capacity_weight: 1500, type: 'VAN' })
        });
        const vehicleData = await vehicleRes.json();
        console.log("Vehicle API Response:", vehicleData);

        console.log("Creating Warehouse via Prisma directly (for test setup)...");
        // We will create the warehouse directly since there might not be a POST /warehouses route
        const testWarehouse = await prisma.warehouses.create({
            data: {
                company_id: loginData.user.company_id,
                name: 'Audit Main Warehouse',
                location: 'Audit City'
            }
        });

        console.log("Creating Inventory Item via API...");
        const invRes = await fetch('http://localhost:5000/api/inventory', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                warehouse_id: testWarehouse.id,
                sku: 'AUDIT-SKU-002',
                name: 'Audit Test Package',
                description: 'Created for verification',
                quantity: 50,
                reorder_point: 10,
                cost_price: 15.50,
                selling_price: 30.00
            })
        });
        const invData = await invRes.json();
        console.log("Inventory API Response:", invData);

        // Now fetch from DB and console.table
        console.log("\n--- DB PROOF ---");
        const driver = await prisma.users.findUnique({ where: { id: driverData.id } });
        console.table([driver]);

        const vehicle = await prisma.vehicles.findUnique({ where: { id: vehicleData.id } });
        console.table([vehicle]);

        const item = await prisma.inventory_items.findUnique({ where: { id: invData.id } });
        console.table([item]);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}
run();
