const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Known plugin catalogue (static metadata — install state lives in DB)
const CATALOGUE = [
    { plugin_id: 'salesforce_sync', name: 'Salesforce Sync', desc: 'Automatically sync orders from Salesforce CRM.', icon: '☁️' },
    { plugin_id: 'shopify_connector', name: 'Shopify Connector', desc: 'Pull eCommerce orders in real-time.', icon: '🛍️' },
    { plugin_id: 'iot_temp_sensors', name: 'IoT Temp Sensors', desc: 'Native integration for Bluetooth cold-chain sensors.', icon: '🌡️' },
    { plugin_id: 'sap_erp', name: 'SAP ERP', desc: 'Enterprise data push/pull for financial ledgers.', icon: '🏢' },
];

// GET installed plugins merged with catalogue
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const installed = await prisma.plugins.findMany({ where: { company_id: companyId } });
        const installedIds = new Set(installed.filter(p => p.is_active).map(p => p.plugin_id));

        const result = CATALOGUE.map(p => ({
            ...p,
            installed: installedIds.has(p.plugin_id)
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST install a plugin
router.post('/:plugin_id/install', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { plugin_id } = req.params;
        if (!CATALOGUE.find(p => p.plugin_id === plugin_id)) {
            return res.status(404).json({ error: 'Unknown plugin' });
        }
        await prisma.plugins.upsert({
            where: { company_id_plugin_id: { company_id: companyId, plugin_id } },
            create: { company_id: companyId, plugin_id, is_active: true },
            update: { is_active: true }
        });
        res.json({ success: true, installed: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST uninstall a plugin
router.post('/:plugin_id/uninstall', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { plugin_id } = req.params;
        await prisma.plugins.updateMany({
            where: { company_id: companyId, plugin_id },
            data: { is_active: false }
        });
        res.json({ success: true, installed: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
