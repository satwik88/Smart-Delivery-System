const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.users.findFirst({ where: { username: 'quick_driver_01' } })
  .then(r => { console.table([r]); return p.$disconnect(); });
