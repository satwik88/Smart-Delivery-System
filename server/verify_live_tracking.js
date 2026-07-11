const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log("=== Running Live Tracking Verification ===");

  // 1. Find or create a test warehouse
  let srcWarehouse = await prisma.warehouses.findFirst({ where: { company_id: 1 } });
  if (!srcWarehouse) {
    srcWarehouse = await prisma.warehouses.create({
      data: { company_id: 1, name: "Verification Hub", pos_x: 28.58, pos_y: 77.30 }
    });
  }
  let dstWarehouse = await prisma.warehouses.findFirst({ where: { id: { not: srcWarehouse.id }, company_id: 1 } });
  if (!dstWarehouse) {
    dstWarehouse = await prisma.warehouses.create({
      data: { company_id: 1, name: "Verification Destination", pos_x: 28.65, pos_y: 77.35 }
    });
  }

  // 2. Find or create a test vehicle
  let vehicle = await prisma.vehicles.findFirst({ where: { company_id: 1 } });
  if (!vehicle) {
    vehicle = await prisma.vehicles.create({
      data: { company_id: 1, name: "Verification Truck", capacity_weight: 1500 }
    });
  }

  // 3. Find or create a test driver (user with role driver)
  let driver = await prisma.users.findFirst({ where: { company_id: 1, role: 'driver' } });
  if (!driver) {
    driver = await prisma.users.create({
      data: {
        company_id: 1,
        username: "test_driver_verification",
        password_hash: "mock_hash",
        role: "driver"
      }
    });
  }

  // 4. Create active assignment for driver on vehicle
  await prisma.driver_assignments.updateMany({
    where: { vehicle_id: vehicle.id, company_id: 1 },
    data: { status: "COMPLETED", end_time: new Date() }
  });
  const assignment = await prisma.driver_assignments.create({
    data: {
      company_id: 1,
      vehicle_id: vehicle.id,
      user_id: driver.id,
      status: "ACTIVE"
    }
  });

  // 5. Create an in_transit order assigned to this vehicle
  const trackingCode = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const order = await prisma.orders.create({
    data: {
      company_id: 1,
      customer_name: "Verification Client",
      budget: 250.00,
      source_warehouse_id: srcWarehouse.id,
      dest_warehouse_id: dstWarehouse.id,
      vehicle_id: vehicle.id,
      status: "in_transit",
      tracking_code: trackingCode
    }
  });

  // Set initial telemetry for the vehicle to source warehouse
  await prisma.vehicles.update({
    where: { id: vehicle.id },
    data: {
      current_location_lat: srcWarehouse.pos_x,
      current_location_lng: srcWarehouse.pos_y
    }
  });

  console.log(`Created order ${trackingCode} linked to Driver ${driver.username} and Vehicle ${vehicle.name}`);

  // 6. Query exactly like liveTracking.js does
  const activeOrders = await prisma.orders.findMany({
    where: {
      company_id: 1,
      status: 'in_transit',
      vehicle_id: { not: null }
    },
    include: {
      vehicle: {
        include: {
          driver_assignments: {
            where: { status: 'ACTIVE' },
            include: { user: true }
          }
        }
      },
      source_warehouse: true,
      dest_warehouse: true
    }
  });

  const activeDrivers = activeOrders.map(o => {
    const v = o.vehicle;
    const activeAssignment = v?.driver_assignments?.[0];
    const driverName = activeAssignment?.user?.username || 'Unassigned Driver';

    let lat = v?.current_location_lat;
    let lng = v?.current_location_lng;

    if (!lat || !lng) {
      lat = o.source_warehouse?.pos_x || 28.58;
      lng = o.source_warehouse?.pos_y || 77.30;
    }

    return {
      id: `DRV-${activeAssignment?.user?.id || 'V' + v?.id}`,
      name: `${driverName} (${v?.name || 'No Vehicle'})`,
      pos: [lat, lng],
      status: `Delivering ${o.tracking_code}`
    };
  });

  console.log("\n=== EMITTED SOCKET PAYLOAD ===");
  console.log(JSON.stringify(activeDrivers, null, 2));

  // Clean up order so it doesn't pollute subsequent verification
  await prisma.orders.delete({ where: { id: order.id } });
  await prisma.driver_assignments.delete({ where: { id: assignment.id } });
  console.log("\nVerification cleanup completed successfully.");
}

verify().catch(console.error).finally(() => prisma.$disconnect());
