const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// GET /api/billing/status
router.get('/status', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const company = await prisma.companies.findUnique({
            where: { id: companyId },
            select: { subscription_tier: true, stripe_customer: true }
        });
        
        if (!company) return res.status(404).json({ error: 'Company not found' });
        
        res.json({
            tier: company.subscription_tier,
            hasStripe: !!company.stripe_customer
        });
    } catch (err) {
        console.error("Billing status error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/billing/upgrade
router.post('/upgrade', async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ error: 'Stripe is not configured on the server. Please add STRIPE_SECRET_KEY to .env' });
        }

        const companyId = req.user.company_id;
        
        // In a real app we'd look up if they already have a stripe_customer_id, 
        // but for this demo we'll just create a fresh checkout session with customer_email
        // or just let Stripe handle customer creation.
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'SLRROS Pro Tier',
                            description: 'Unlocks Live Tracking & Advanced Analytics'
                        },
                        unit_amount: 4900, // $49.00 / month
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1,
                },
            ],
            // Pass the companyId in client_reference_id so we know who paid
            client_reference_id: companyId.toString(),
            success_url: `http://localhost:5173/admin/billing?success=true`,
            cancel_url: `http://localhost:5173/admin/billing?canceled=true`,
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("Stripe checkout error:", err);
        res.status(500).json({ error: 'Failed to create Stripe session' });
    }
});



module.exports = router;
