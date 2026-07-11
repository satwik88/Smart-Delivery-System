async function testWebhook() {
  console.log("Simulating Stripe checkout.session.completed webhook...");
  try {
    const res = await fetch('http://localhost:5000/api/billing/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: '1', // Test company ID
            payment_status: 'paid'
          }
        }
      })
    });
    const text = await res.text();
    console.log("Webhook response status:", res.status);
    console.log("Webhook response body:", text);
  } catch (err) {
    console.error("Webhook error:", err);
  }
}

testWebhook();
