
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await fetch('http://localhost:5000/api/auth/register-company', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: 'Alpha Logistics', ownerUsername: 'alpha_admin', ownerPassword: 'secret123' })
  });
  await fetch('http://localhost:5000/api/auth/register-company', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: 'Beta Couriers', ownerUsername: 'beta_admin', ownerPassword: 'secret123' })
  });
  const companies = await prisma.companies.findMany({ orderBy: { id: 'desc' }, take: 2 });
  const users = await prisma.users.findMany({ orderBy: { id: 'desc' }, take: 2 });
  console.log('---COMPANIES---');
  console.table(companies.map(c => ({ id: c.id, name: c.name })));
  console.log('---USERS---');
  console.table(users.map(u => ({ id: u.id, username: u.username, company_id: u.company_id })));
}
run().catch(console.error).finally(() => prisma.\$disconnect\());

