const Razorpay = require('razorpay');

let razorpayClient = null;

function getRazorpayInstance() {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.includes('xxxx') && !keySecret.includes('xxxx')) {
    try {
      razorpayClient = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      console.log('✨ Razorpay SDK initialized with Key ID:', keyId);
    } catch (err) {
      console.warn('⚠️ Razorpay SDK initialization error:', err.message);
    }
  } else {
    console.log('ℹ️ Razorpay running in simulated mode (no live credentials set)');
  }

  return razorpayClient;
}

module.exports = { getRazorpayInstance };
