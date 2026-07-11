const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const pluginRows = await p.plugins.findMany({ where: { plugin_id: 'shopify_connector' } });
  console.log('=== plugins DB rows (shopify_connector) ===');
  console.table(pluginRows.map(r => ({ id: r.id, company_id: r.company_id, plugin_id: r.plugin_id, is_active: r.is_active })));

  const keyRows = await p.api_keys.findMany({ orderBy: { id: 'desc' } });
  console.log('\n=== api_keys DB rows (key tail only) ===');
  console.table(keyRows.map(r => ({ id: r.id, company_id: r.company_id, name: r.name, key_tail: r.key.slice(-6), created_at: r.created_at })));
}

main().finally(() => p.$disconnect());
