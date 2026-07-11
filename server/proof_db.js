const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function proof() {
  const latestOrder = await prisma.orders.findFirst({
    where: { customer_name: 'Test Customer' },
    orderBy: { created_at: 'desc' }
  });

  console.log("--- ORDERS ROW ---");
  console.table([{
    id: latestOrder.id,
    company_id: latestOrder.company_id,
    customer_name: latestOrder.customer_name,
    budget: latestOrder.budget,
    status: latestOrder.status,
    tracking_code: latestOrder.tracking_code
  }]);

  const tx = await prisma.financial_transactions.findFirst({
    where: { reference_id: latestOrder.tracking_code }
  });

  console.log("--- FINANCIAL_TRANSACTIONS ROW ---");
  console.table([{
    id: tx.id,
    company_id: tx.company_id,
    reference_id: tx.reference_id,
    amount: tx.amount,
    type: tx.type,
    category: tx.category
  }]);

  await prisma.$disconnect();
}

proof().catch(console.error);
