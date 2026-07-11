const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const latestOrder = await prisma.orders.findFirst({
    orderBy: { created_at: 'desc' }
  });
  console.log("Latest Order:", latestOrder.tracking_code, "Budget:", latestOrder.budget);

  const tx = await prisma.financial_transactions.findFirst({
    where: { reference_id: latestOrder.tracking_code }
  });

  if (tx) {
    console.log("Found Financial Transaction for order:", tx.reference_id, "| Amount:", tx.amount, "| Type:", tx.type);
  } else {
    console.log("NO FINANCIAL TRANSACTION FOUND FOR ORDER:", latestOrder.tracking_code);
  }

  await prisma.$disconnect();
}

check().catch(console.error);
