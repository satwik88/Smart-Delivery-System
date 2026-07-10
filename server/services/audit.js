const prisma = require('../config/prisma');

async function logAudit(companyId, userId, action, description, ipAddress = null) {
    try {
        await prisma.audit_logs.create({
            data: {
                company_id: companyId,
                user_id: userId,
                action,
                description,
                ip_address: ipAddress
            }
        });
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
}

module.exports = { logAudit };
