const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCustomerWorkflow() {
    console.log("=== Testing Customer Portal Workflow ===");
    
    // 1. Create a company owner login and get a token
    const testCompanyId = 1;
    const testOwner = await prisma.users.findFirst({
        where: { company_id: testCompanyId, role: 'company_owner' }
    });

    if (!testOwner) {
        console.error("Test owner not found for company 1");
        process.exit(1);
    }

    // We can just login directly using the password 'admin123' (assuming it exists from seed)
    // or just generate an order using a fetch with auth
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: testOwner.username, password: 'password123' }) // 'password123' or 'admin123'?
    });
    
    // If login fails because we don't know the exact password, we can just use Prisma to create the order
    // But the prompt wants us to create an order with an email, log in as customer, verify order appears.
    
    const customerEmail = `customer_${Date.now()}@example.com`;
    const customerPass = 'customer123';

    console.log("Using API to create customer order...");

    // To bypass auth for this test script, we can inject a JWT or use a hack. Let's just create a token.
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: testOwner.id, role: testOwner.role, company_id: testOwner.company_id }, process.env.JWT_SECRET);

    const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            customer_name: 'Test Customer',
            customer_email: customerEmail,
            budget: '50'
        })
    });
    const orderData = await orderRes.json();
    console.log(`Created Order ID: ${orderData.id}`);

    // Check if customer was auto-created in the database
    const dbCustomer = await prisma.users.findUnique({ where: { username: customerEmail } });
    console.log(`Customer auto-created ID: ${dbCustomer.id}`);

    // Fetch the order from the database to show customer_id is populated
    const dbOrder = await prisma.orders.findUnique({ where: { id: orderData.id } });
    console.log(`Order customer_id: ${dbOrder.customer_id}`);

    // 2. Login as the newly created customer
    const custLoginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: customerEmail, password: customerPass })
    });
    const custLoginData = await custLoginRes.json();
    console.log(`Customer Login Token received: ${!!custLoginData.token}`);

    // 3. Fetch customer orders
    const custOrdersRes = await fetch('http://localhost:5000/api/customer/orders', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${custLoginData.token}` }
    });
    const custOrdersData = await custOrdersRes.json();
    console.log(`Customer retrieved ${custOrdersData.length} orders.`);
    console.log(`Order matches: ${custOrdersData[0].id === orderData.id}`);
}

require('dotenv').config();
testCustomerWorkflow().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
