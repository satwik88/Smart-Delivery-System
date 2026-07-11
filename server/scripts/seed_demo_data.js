const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function clearExisting(name) {
    const existing = await prisma.companies.findFirst({ where: { name } });
    if (existing) {
        console.log(`Deleting existing company: ${name}`);
        await prisma.companies.delete({ where: { id: existing.id } });
    }
}

async function seedCompany(companyName, rolePrefix) {
    console.log(`\nSeeding Company: ${companyName}...`);
    
    // Create company
    const company = await prisma.companies.create({
        data: {
            name: companyName,
            subscription_tier: 'PRO',
            status: 'ACTIVE',
            timezone: 'Asia/Kolkata',
            currency: 'INR'
        }
    });

    const companyId = company.id;

    // Create Owner
    const passwordHash = await bcrypt.hash('password123', 10);
    const owner = await prisma.users.create({
        data: {
            company_id: companyId,
            username: `${rolePrefix}_owner`,
            email: `owner@${rolePrefix}.com`,
            full_name: `${companyName} Owner`,
            password_hash: passwordHash,
            role: 'company_owner'
        }
    });

    // Create Warehouses in Bengaluru
    const locations = [
        { name: 'Koramangala Hub', lat: 12.9352, lng: 77.6245, address: '17th Main, Koramangala' },
        { name: 'Indiranagar Depot', lat: 12.9716, lng: 77.6411, address: '100ft Road, Indiranagar' },
        { name: 'Whitefield Fulfillment', lat: 12.9698, lng: 77.7500, address: 'ITPL Main Rd, Whitefield' },
        { name: 'HSR Layout Hub', lat: 12.9121, lng: 77.6446, address: 'Sector 2, HSR Layout' }
    ];

    const warehouses = [];
    for (const loc of locations) {
        const w = await prisma.warehouses.create({
            data: {
                company_id: companyId,
                name: loc.name,
                pos_x: loc.lng, // storing lng as pos_x
                pos_y: loc.lat, // storing lat as pos_y
                address: loc.address,
                capacity_sqft: 5000 + Math.random() * 10000,
                status: 'ACTIVE'
            }
        });
        warehouses.push(w);
    }

    // Create Vehicles
    const vehicleTypes = ['BIKE', 'BIKE', 'VAN', 'VAN', 'TRUCK', 'BIKE'];
    const vehicles = [];
    for (let i = 0; i < vehicleTypes.length; i++) {
        const v = await prisma.vehicles.create({
            data: {
                company_id: companyId,
                name: `${vehicleTypes[i]} ${i+1}`,
                capacity_weight: vehicleTypes[i] === 'BIKE' ? 20 : vehicleTypes[i] === 'VAN' ? 500 : 2000,
                license_plate: `KA-01-${Math.floor(1000 + Math.random() * 9000)}`,
                type: vehicleTypes[i],
                status: 'ACTIVE',
                current_location_lat: locations[i % locations.length].lat,
                current_location_lng: locations[i % locations.length].lng,
            }
        });
        vehicles.push(v);
    }

    // Create Drivers and Assignments
    const drivers = [];
    for (let i = 0; i < vehicles.length; i++) {
        const d = await prisma.users.create({
            data: {
                company_id: companyId,
                username: `${rolePrefix}_driver_${i+1}`,
                email: `driver${i+1}@${rolePrefix}.com`,
                full_name: `Driver ${i+1}`,
                password_hash: passwordHash,
                role: 'driver'
            }
        });
        drivers.push(d);

        await prisma.driver_assignments.create({
            data: {
                company_id: companyId,
                vehicle_id: vehicles[i].id,
                user_id: d.id,
                status: 'ACTIVE',
                start_time: new Date()
            }
        });
    }

    // Create Customers
    const customerNames = ['Ravi Kumar', 'Sneha Reddy', 'Amit Sharma', 'Priya Singh', 'Ananya Patel'];
    const customers = [];
    for (let i = 0; i < customerNames.length; i++) {
        const c = await prisma.users.create({
            data: {
                company_id: companyId,
                username: `${rolePrefix}_cust_${i+1}@example.com`,
                email: `${rolePrefix}_cust_${i+1}@example.com`,
                full_name: customerNames[i],
                password_hash: passwordHash,
                role: 'customer'
            }
        });
        customers.push(c);
    }

    // Create Inventory Items
    for (const w of warehouses) {
        for (let i = 0; i < 5; i++) {
            await prisma.inventory_items.create({
                data: {
                    company_id: companyId,
                    warehouse_id: w.id,
                    sku: `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
                    name: `Product ${Math.floor(100 + Math.random() * 900)}`,
                    quantity: 50 + Math.floor(Math.random() * 200),
                    cost_price: 10 + Math.random() * 50,
                    selling_price: 60 + Math.random() * 100
                }
            });
        }
    }

    // Create Orders and Financials
    const statuses = ['placed', 'verified', 'packed', 'dispatched', 'in_transit', 'delivered', 'delivered', 'delivered'];
    
    for (let i = 0; i < 20; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const sourceW = warehouses[Math.floor(Math.random() * warehouses.length)];
        const destW = warehouses[Math.floor(Math.random() * warehouses.length)];
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        const budget = 100 + Math.floor(Math.random() * 900);
        
        // Spread dates over the last 20 days
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 20));

        const order = await prisma.orders.create({
            data: {
                company_id: companyId,
                customer_name: customer.full_name,
                customer_id: customer.id,
                budget: budget,
                tracking_code: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                source_warehouse_id: sourceW.id,
                dest_warehouse_id: destW.id,
                vehicle_id: vehicle.id,
                status: status,
                created_at: pastDate,
                scheduled_for: pastDate,
                order_type: 'DELIVERY'
            }
        });

        // Add order event
        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: order.id,
                status: status,
                description: `Order is currently ${status}`,
                created_at: pastDate
            }
        });

        // Add revenue transaction
        await prisma.financial_transactions.create({
            data: {
                company_id: companyId,
                type: 'REVENUE',
                category: 'ORDER',
                amount: budget,
                description: `Revenue from Order ${order.tracking_code}`,
                reference_id: order.tracking_code,
                created_at: pastDate
            }
        });
        
        // Add expense transaction
        await prisma.financial_transactions.create({
            data: {
                company_id: companyId,
                type: 'EXPENSE',
                category: 'OTHER',
                amount: budget * 0.4, // 40% cost
                description: `Fulfillment cost for Order ${order.tracking_code}`,
                reference_id: order.tracking_code,
                created_at: pastDate
            }
        });
    }
    
    // Add regular payroll expenses
    const pastMonthDate = new Date();
    pastMonthDate.setDate(pastMonthDate.getDate() - 15);
    await prisma.financial_transactions.create({
        data: {
            company_id: companyId,
            type: 'EXPENSE',
            category: 'PAYROLL',
            amount: 5000,
            description: `Bi-weekly Payroll`,
            created_at: pastMonthDate
        }
    });

    console.log(`Company ${companyName} seeded successfully!`);
}

async function main() {
    await clearExisting('Metro Grocers');
    await clearExisting('QuickMed Pharmacy');

    await seedCompany('Metro Grocers', 'metro');
    await seedCompany('QuickMed Pharmacy', 'quickmed');

    console.log('\n=== Post-Seeding Row Counts ===');
    console.log('Companies:', await prisma.companies.count());
    console.log('Users:', await prisma.users.count());
    console.log('Warehouses:', await prisma.warehouses.count());
    console.log('Vehicles:', await prisma.vehicles.count());
    console.log('Driver Assignments:', await prisma.driver_assignments.count());
    console.log('Orders:', await prisma.orders.count());
    console.log('Inventory Items:', await prisma.inventory_items.count());
    console.log('Financial Txns:', await prisma.financial_transactions.count());
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
