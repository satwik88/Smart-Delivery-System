const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment.');
}

// POST /api/auth/register-company
router.post('/register-company', async (req, res) => {
    try {
        const { companyName, ownerUsername, ownerPassword } = req.body;
        if (!companyName || !ownerUsername || !ownerPassword) {
            return res.status(400).json({ error: 'companyName, ownerUsername, and ownerPassword are required' });
        }

        const existingUser = await prisma.users.findUnique({
            where: { username: ownerUsername }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const password_hash = await bcrypt.hash(ownerPassword, 10);

        // Transaction to create company and user
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.companies.create({
                data: {
                    name: companyName
                }
            });

            const user = await tx.users.create({
                data: {
                    company_id: company.id,
                    username: ownerUsername,
                    password_hash,
                    role: 'company_owner'
                }
            });

            return { company, user };
        });

        res.status(201).json({
            message: 'Company and owner registered successfully',
            companyId: result.company.id,
            userId: result.user.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' });
        }

        const user = await prisma.users.findUnique({
            where: { username },
            include: { company: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.company && user.company.status === 'SUSPENDED' && user.role !== 'super_admin') {
            return res.status(403).json({ error: 'Company account is suspended. Contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            company_id: user.company_id,
            role: user.role,
            username: user.username
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                company_id: user.company_id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const payload = {
            id: decoded.id,
            company_id: decoded.company_id,
            role: decoded.role,
            username: decoded.username
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
        res.json({ token });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});

module.exports = router;
