const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.users.findMany({ select: { id: true, username: true, company_id: true, role: true } })
  .then(r => { console.table(r); return p.$disconnect(); });
