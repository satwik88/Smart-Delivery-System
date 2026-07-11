const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("\n--- DB PROOF ---");
        const driver = await prisma.users.findFirst({ where: { username: 'audit_driver_02' } });
        console.table([driver]);

        const vehicle = await prisma.vehicles.findFirst({ where: { name: 'Audit Van 02' } });
        console.table([vehicle]);

        const wh = await prisma.warehouses.create({ data: { company_id: driver.company_id, name: 'Proof WH', address: 'Proof City', pos_x: 0, pos_y: 0 } });
        const item = await prisma.inventory_items.create({
            data: {
                company_id: driver.company_id,
                warehouse_id: wh.id,
                sku: 'PROOF-SKU',
                name: 'Proof Item',
                quantity: 100,
                reorder_point: 10,
                cost_price: 5.5,
                selling_price: 15.0
            }
        });
        console.table([item]);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}
run();
