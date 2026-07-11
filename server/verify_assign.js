const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Logging in to get token...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'audit_owner', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("Assigning Driver 9 to Vehicle 7...");
        const assignRes = await fetch('http://localhost:5000/api/fleet/7/assignments', {
            method: 'POST',
            headers,
            body: JSON.stringify({ user_id: 9 })
        });
        const assignData = await assignRes.json();
        console.log("Assign Response:", assignData);

        console.log("Creating Order assigned to Vehicle 7...");
        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                customer_name: 'Test Customer',
                budget: 150.50,
                vehicle_id: 7
            })
        });
        const orderData = await orderRes.json();
        console.log("Order Response:", orderData.id);

        console.log("\n--- DB PROOF: driver_assignments ---");
        const assignment = await prisma.driver_assignments.findFirst({
            where: { vehicle_id: 7, user_id: 9, status: 'ACTIVE' },
            include: {
                user: { select: { id: true, username: true } },
                vehicle: { select: { id: true, name: true } }
            }
        });
        
        // Flatten for console.table
        if (assignment) {
            const flat = {
                id: assignment.id,
                company_id: assignment.company_id,
                vehicle_id: assignment.vehicle_id,
                user_id: assignment.user_id,
                status: assignment.status,
                driver_username: assignment.user.username,
                vehicle_name: assignment.vehicle.name
            };
            console.table([flat]);
        } else {
            console.log("No assignment found.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}
run();
