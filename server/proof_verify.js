const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // 1. Dashboard metrics raw data (what /dashboard/metrics aggregates)
  const company_id = 3; // alpha_admin's company
  const totalOrders = await p.orders.count({ where: { company_id } });
  const deliveredOrders = await p.orders.count({ where: { company_id, status: 'delivered' } });
  const inTransitOrders = await p.orders.count({ where: { company_id, status: 'in_transit' } });
  const pendingOrders = await p.orders.count({ where: { company_id, status: { in: ['placed','verified','packed'] } } });
  const activeDrivers = await p.users.count({ where: { company_id, role: 'driver' } });
  const revenueAgg = await p.orders.aggregate({ where: { company_id, status: 'delivered' }, _sum: { budget: true } });
  const finRev = await p.financial_transactions.aggregate({ where: { company_id, type: 'REVENUE' }, _sum: { amount: true } });
  const finExp = await p.financial_transactions.aggregate({ where: { company_id, type: 'EXPENSE' }, _sum: { amount: true } });

  console.log('\n=== /dashboard/metrics (company_id=3) ===');
  console.table([{ totalOrders, deliveredOrders, inTransitOrders, pendingOrders, activeDrivers, orderRevenue: revenueAgg._sum.budget }]);

  console.log('\n=== /finance/summary (company_id=3) ===');
  console.table([{ revenue: finRev._sum.amount, expenses: finExp._sum.amount, net_profit: (finRev._sum.amount||0) - (finExp._sum.amount||0) }]);

  // 2. chart-data sample (first 3 rows)
  const chartOrders = await p.orders.findMany({ where: { company_id }, select: { created_at: true, budget: true, status: true }, take: 5 });
  console.log('\n=== /dashboard/chart-data (sample 5 raw orders) ===');
  console.table(chartOrders.map(o => ({ date: o.created_at?.toLocaleDateString('en-US',{month:'short',day:'numeric'}), status: o.status, budget: o.budget })));

  // 3. Marketplace plugin isolation test
  // Install shopify_connector for company 3, check it doesn't bleed to company 4
  const c3Plugins = await p.plugins.findMany({ where: { company_id: 3 } });
  const c4Plugins = await p.plugins.findMany({ where: { company_id: 4 } });
  console.log('\n=== plugins table: company_id=3 ===');
  if (c3Plugins.length) console.table(c3Plugins.map(r => ({ id: r.id, company_id: r.company_id, plugin_id: r.plugin_id, is_active: r.is_active })));
  else console.log('(none yet — will install via API)');
  console.log('\n=== plugins table: company_id=4 ===');
  if (c4Plugins.length) console.table(c4Plugins.map(r => ({ id: r.id, company_id: r.company_id, plugin_id: r.plugin_id, is_active: r.is_active })));
  else console.log('(none)');

  // 4. API keys table
  const keys = await p.api_keys.findMany({ orderBy: { created_at: 'desc' }, take: 5 });
  console.log('\n=== api_keys table (key redacted) ===');
  if (keys.length) console.table(keys.map(k => ({ id: k.id, company_id: k.company_id, name: k.name, key_preview: `...${k.key.slice(-6)}`, last_used: k.last_used, created_at: k.created_at })));
  else console.log('(none yet)');
}

main().finally(() => p.$disconnect());
