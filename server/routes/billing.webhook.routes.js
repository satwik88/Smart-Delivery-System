const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!endpointSecret) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
        }
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const companyId = parseInt(session.client_reference_id);

        if (companyId) {
            try {
                await prisma.companies.update({
                    where: { id: companyId },
                    data: { subscription_tier: 'PRO' }
                });
                console.log(`Company ${companyId} upgraded to PRO via webhook.`);
            } catch (error) {
                console.error(`Failed to update company tier:`, error);
                return res.status(500).json({ error: 'Failed to update company' });
            }
        }
    }

    res.status(200).json({ received: true });
});

module.exports = router;
