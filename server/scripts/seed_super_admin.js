require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Super Admin...");
    
    const username = process.env.SUPER_ADMIN_USERNAME;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!username || !password) {
        console.error("Missing SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD in .env file.");
        process.exit(1);
    }

    const existingUser = await prisma.users.findUnique({
        where: { username }
    });

    if (existingUser) {
        console.log(`Super Admin user '${username}' already exists. Skipping.`);
        process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.users.create({
        data: {
            username,
            email: 'admin@slrros.local',
            full_name: 'System Super Admin',
            password_hash,
            role: 'super_admin',
            company_id: null // Super Admin does not belong to any specific company
        }
    });

    console.log(`Successfully created Super Admin user: ${superAdmin.username}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
