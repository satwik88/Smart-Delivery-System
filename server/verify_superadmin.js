const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function testSuperAdminWorkflow() {
    console.log("=== Testing Super Admin Workflow ===");
    
    // 1. Create a test company and owner
    const testPassword = 'testpassword123';
    const password_hash = await bcrypt.hash(testPassword, 10);
    
    const company = await prisma.companies.create({
        data: { name: 'Super Admin Test Company' }
    });
    
    const owner = await prisma.users.create({
        data: {
            username: `owner_${company.id}`,
            password_hash,
            role: 'company_owner',
            company_id: company.id
        }
    });

    console.log(`Created test company '${company.name}' (ID: ${company.id}) with owner '${owner.username}'`);

    // 2. Login as Super Admin
    const saLoginReq = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: 'superadmin', password: 'supersecret' })
    });
    const saLoginRes = await saLoginReq.json();
    const saToken = saLoginRes.token;
    console.log("Super Admin Login: SUCCESS");

    // 3. Suspend company
    await fetch(`http://localhost:5000/api/superadmin/companies/${company.id}/suspend`, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${saToken}`},
        body: JSON.stringify({ suspend: true })
    });
    
    let dbComp = await prisma.companies.findUnique({ where: { id: company.id } });
    console.log(`Company Status after suspension: ${dbComp.status}`);

    // 4. Try logging in as company owner
    const loginFailReq = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: owner.username, password: testPassword })
    });
    if (!loginFailReq.ok) {
        const failData = await loginFailReq.json();
        console.log("Company Owner Login during suspension: BLOCKED -", failData.error);
    } else {
        console.log("Company Owner Login during suspension: UNEXPECTED SUCCESS");
    }

    // 5. Reactivate company
    await fetch(`http://localhost:5000/api/superadmin/companies/${company.id}/suspend`, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${saToken}`},
        body: JSON.stringify({ suspend: false })
    });
    
    dbComp = await prisma.companies.findUnique({ where: { id: company.id } });
    console.log(`Company Status after reactivation: ${dbComp.status}`);

    // 6. Try logging in as company owner again
    const loginSuccessReq = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: owner.username, password: testPassword })
    });
    if (loginSuccessReq.ok) {
        console.log("Company Owner Login after reactivation: SUCCESS");
    } else {
        console.log("Company Owner Login after reactivation: FAILED -", await loginSuccessReq.text());
    }
}

testSuperAdminWorkflow().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
