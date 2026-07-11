// Exercises the real plugin install/uninstall and api_key create endpoints
// using the same auth token the browser uses.
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const BASE = 'http://localhost:5000/api';

async function login(username, password) {
  const res = await axios.post(`${BASE}/auth/login`, { username, password });
  return res.data.token;
}

async function main() {
  // 1. Login as alpha_admin (company_id=3) and beta_admin (company_id=4/5)
  const tokenA = await login('alpha_admin', 'password123');
  const tokenB = await login('audit_owner', 'password123').catch(() => login('beta_admin', 'password123'));

  const headA = { headers: { Authorization: `Bearer ${tokenA}` } };
  const headB = { headers: { Authorization: `Bearer ${tokenB}` } };

  // 2. Install shopify_connector for company A
  const installRes = await axios.post(`${BASE}/plugins/shopify_connector/install`, {}, headA);
  console.log('Plugin install (company A):', installRes.data);

  // 3. Fetch plugins for company A — should show shopify_connector installed
  const pluginsA = await axios.get(`${BASE}/plugins`, headA);
  const shopifyA = pluginsA.data.find(p => p.plugin_id === 'shopify_connector');
  console.log('\nCompany A shopify_connector installed:', shopifyA?.installed);

  // 4. Fetch plugins for company B — should NOT show it installed
  const pluginsB = await axios.get(`${BASE}/plugins`, headB);
  const shopifyB = pluginsB.data.find(p => p.plugin_id === 'shopify_connector');
  console.log('Company B shopify_connector installed:', shopifyB?.installed);

  // 5. DB proof: show plugins rows
  const rows = await p.plugins.findMany({ where: { plugin_id: 'shopify_connector' } });
  console.log('\n=== plugins rows (shopify_connector across all companies) ===');
  console.table(rows.map(r => ({ id: r.id, company_id: r.company_id, plugin_id: r.plugin_id, is_active: r.is_active })));

  // 6. Generate an API key for company A
  const keyRes = await axios.post(`${BASE}/developer/keys`, { name: 'Proof Key' }, headA);
  console.log('\nGenerated key name:', keyRes.data.name);
  console.log('Key preview (last 6):', keyRes.data.key_preview);
  console.log('Full key (shown once, then gone):', keyRes.data.key.slice(0, 10) + '...[REDACTED]');

  // 7. DB proof: api_keys row
  const dbKey = await p.api_keys.findFirst({ where: { name: 'Proof Key' }, orderBy: { id: 'desc' } });
  console.log('\n=== api_keys DB row (key redacted) ===');
  console.table([{ id: dbKey?.id, company_id: dbKey?.company_id, name: dbKey?.name, key_tail: dbKey?.key?.slice(-6), created_at: dbKey?.created_at }]);

  // 8. Fetch keys list — should show masked only
  const keysList = await axios.get(`${BASE}/developer/keys`, headA);
  const listedKey = keysList.data.find(k => k.name === 'Proof Key');
  console.log('\nKey as returned by GET /developer/keys (masked):', listedKey?.key_preview);
}

main().catch(console.error).finally(() => p.$disconnect());
