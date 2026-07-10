const prisma = require('../config/prisma');

async function broadcastNotification(io, companyId, title, message, type = 'INFO') {
    try {
        // Save to Database
        const notification = await prisma.notifications.create({
            data: {
                company_id: companyId,
                title,
                message,
                type
            }
        });

        // Broadcast to all admins in the company room
        if (io) {
            io.to(`company_${companyId}`).emit('system_alert', notification);
        }

        return notification;
    } catch (err) {
        console.error('Failed to broadcast notification:', err);
    }
}

module.exports = {
    broadcastNotification
};
