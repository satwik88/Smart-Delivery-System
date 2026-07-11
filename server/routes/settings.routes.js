const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/settings/company
router.get('/company', async (req, res) => {
  try {
    const company = await prisma.companies.findUnique({
      where: { id: req.user.company_id }
    });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/settings/company
router.put('/company', async (req, res) => {
  try {
    const { 
      name, timezone, currency, date_format, 
      tax_id, support_email, phone, address, 
      base_fare, price_per_km, max_delivery_radius 
    } = req.body;

    const updated = await prisma.companies.update({
      where: { id: req.user.company_id },
      data: {
        name,
        timezone,
        currency,
        date_format,
        tax_id,
        support_email,
        phone,
        address,
        base_fare: base_fare ? parseFloat(base_fare) : undefined,
        price_per_km: price_per_km ? parseFloat(price_per_km) : undefined,
        max_delivery_radius: max_delivery_radius ? parseFloat(max_delivery_radius) : undefined,
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/settings/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true, full_name: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/settings/profile
router.put('/profile', async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const updated = await prisma.users.update({
      where: { id: req.user.id },
      data: { full_name, email },
      select: { id: true, username: true, email: true, full_name: true, role: true }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/settings/password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');

    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await prisma.users.update({
      where: { id: req.user.id },
      data: { password_hash }
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
