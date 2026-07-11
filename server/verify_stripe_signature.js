const stripe = require('stripe')('sk_test_123'); // Dummy API key, not making remote calls
const endpointSecret = 'whsec_test_secret_123';
const payload = JSON.stringify({
    type: 'checkout.session.completed',
    data: {
        object: {
            client_reference_id: '1',
            payment_status: 'paid'
        }
    }
});

async function runTests() {
    console.log("=== Running Negative Test (No Signature) ===");
    try {
        const res = await fetch('http://localhost:5000/api/billing/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text}\n`);
    } catch (e) {
        console.error(e);
    }

    console.log("=== Running Negative Test (Invalid Signature) ===");
    try {
        const res = await fetch('http://localhost:5000/api/billing/webhook', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'stripe-signature': 't=123,v1=invalid_signature'
            },
            body: payload
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text}\n`);
    } catch (e) {
        console.error(e);
    }

    console.log("=== Running Positive Test (Valid Signature) ===");
    // Generate valid signature using Stripe library
    const validSignature = stripe.webhooks.generateTestHeaderString({
        payload: payload,
        secret: endpointSecret
    });

    try {
        const res = await fetch('http://localhost:5000/api/billing/webhook', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'stripe-signature': validSignature
            },
            body: payload
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text}\n`);
    } catch (e) {
        console.error(e);
    }
}

runTests();
