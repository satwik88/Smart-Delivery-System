const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function updatePassword() {
    try {
        const hash = await bcrypt.hash('sas', 10);
        const updated = await prisma.users.update({
            where: { username: 'admin' },
            data: { password_hash: hash }
        });
        console.log('Password updated successfully to "sas" for user:', updated.username);
    } catch(err) {
        console.error('Error updating password:', err);
    } finally {
        await prisma.$disconnect();
    }
}

updatePassword();
