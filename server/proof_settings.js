const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const BASE = 'http://localhost:5000/api';

async function main() {
  const jwt = require('jsonwebtoken');
  const currentUser = await p.users.findFirst();
  const token = jwt.sign(
      { id: currentUser.id, username: currentUser.username, role: currentUser.role, company_id: currentUser.company_id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
  );
  const head = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 1. Profile Update
  console.log('--- Updating Profile ---');
  let putProf = await fetch(`${BASE}/settings/profile`, { method: 'PUT', headers: head, body: JSON.stringify({ full_name: 'Alpha Administrator', email: 'alpha@example.com' }) });
  console.log('PUT Profile Status:', putProf.status, await putProf.text());
  
  // Read back profile
  let getProf = await fetch(`${BASE}/settings/profile`, { headers: head });
  console.log('GET Profile Status:', getProf.status);
  const profRes = await getProf.json();
  console.table([{ id: profRes.id, username: profRes.username, full_name: profRes.full_name, email: profRes.email }]);

  // 2. Settings Update
  console.log('\n--- Updating Settings ---');
  let putSet = await fetch(`${BASE}/settings/company`, { method: 'PUT', headers: head, body: JSON.stringify({
    name: 'Alpha Logistics Inc',
    timezone: 'PST',
    currency: 'EUR',
    date_format: 'YYYY-MM-DD',
    tax_id: '99-9999999',
    support_email: 'support@alphalogistics.com',
    phone: '555-999-0000',
    address: '123 Alpha Way',
    base_fare: '10.50',
    price_per_km: '2.00',
    max_delivery_radius: '100'
  })});
  console.log('PUT Settings Status:', putSet.status, await putSet.text());

  // Read back settings
  let getSet = await fetch(`${BASE}/settings/company`, { headers: head });
  console.log('GET Settings Status:', getSet.status);
  const setRes = await getSet.json();
  console.table([{ 
    id: setRes.id, 
    name: setRes.name, 
    timezone: setRes.timezone,
    currency: setRes.currency,
    tax_id: setRes.tax_id,
    base_fare: setRes.base_fare
  }]);

  // DB Proof
  console.log('\n=== DB Proof ===');
  const user = await p.users.findUnique({ where: { username: 'alpha_admin' }});
  const company = await p.companies.findUnique({ where: { id: user.company_id }});
  
  console.log('users table:');
  console.table([{ username: user.username, full_name: user.full_name, email: user.email }]);
  
  console.log('companies table:');
  console.table([{ 
    name: company.name, 
    timezone: company.timezone, 
    currency: company.currency, 
    date_format: company.date_format,
    tax_id: company.tax_id,
    support_email: company.support_email,
    phone: company.phone,
    address: company.address,
    base_fare: company.base_fare,
    price_per_km: company.price_per_km,
    max_delivery_radius: company.max_delivery_radius
  }]);
}

main().catch(console.error).finally(() => p.$disconnect());
