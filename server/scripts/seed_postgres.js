const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

async function main() {
    console.log('Starting seed...');

    // Clean up
    await prisma.orders.deleteMany();
    await prisma.packages.deleteMany();
    await prisma.vehicles.deleteMany();
    await prisma.warehouses.deleteMany();
    await prisma.users.deleteMany();
    await prisma.companies.deleteMany();

    // 1. Create Company
    const company = await prisma.companies.create({
        data: {
            id: 1, // Legacy company ID
            name: 'Legacy Default Company'
        }
    });
    console.log('Created company:', company.name);

    // 2. Create Owner User
    const password_hash = await bcrypt.hash('password123', 10);
    const owner = await prisma.users.create({
        data: {
            company_id: company.id,
            username: 'admin',
            password_hash,
            role: 'company_owner'
        }
    });
    console.log('Created owner:', owner.username);

    // 3. Create Warehouses
    const w1 = await prisma.warehouses.create({ data: { company_id: company.id, name: 'Warehouse A', pos_x: 40.7128, pos_y: -74.0060 } });
    const w2 = await prisma.warehouses.create({ data: { company_id: company.id, name: 'Warehouse B', pos_x: 34.0522, pos_y: -118.2437 } });
    const w3 = await prisma.warehouses.create({ data: { company_id: company.id, name: 'Warehouse C', pos_x: 41.8781, pos_y: -87.6298 } });
    console.log('Created 3 warehouses');

    // 4. Create Vehicles
    const v1 = await prisma.vehicles.create({ data: { company_id: company.id, name: 'Truck 1', capacity_weight: 5000 } });
    const v2 = await prisma.vehicles.create({ data: { company_id: company.id, name: 'Van 1', capacity_weight: 2000 } });
    const v3 = await prisma.vehicles.create({ data: { company_id: company.id, name: 'Drone 1', capacity_weight: 50 } });
    console.log('Created 3 vehicles');

    // 5. Create Orders
    const statuses = ['placed', 'verified', 'packed', 'in_transit', 'delivered'];
    const ordersData = [];
    
    for(let i = 1; i <= 50; i++) {
        const randStatus = statuses[Math.floor(Math.random() * statuses.length)];
        let pct = 0;
        if (randStatus === 'verified') pct = 10;
        if (randStatus === 'packed') pct = 30;
        if (randStatus === 'in_transit') pct = 60;
        if (randStatus === 'delivered') pct = 100;

        ordersData.push({
            company_id: company.id,
            customer_name: `Customer ${i}`,
            source_warehouse_id: i % 2 === 0 ? w1.id : w2.id,
            dest_warehouse_id: i % 2 === 0 ? w2.id : w3.id,
            status: randStatus,
            tracking_code: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            progress_pct: pct,
            vehicle_id: randStatus === 'in_transit' || randStatus === 'delivered' ? v2.id : null,
            budget: Math.floor(Math.random() * 500) + 50
        });
    }

    await prisma.orders.createMany({ data: ordersData });
    console.log('Created 50 mock orders');

    console.log('Seeding complete! You can login with username: admin, password: password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
