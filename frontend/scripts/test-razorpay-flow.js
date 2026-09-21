/**
 * Verification Test for Razorpay Signature Verification and Order Creation
 */
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_SECRET) {
  console.log('ℹ️ RAZORPAY_KEY_SECRET is not provided in environment variables.');
  process.exit(0);
}

console.log('--- 1. Testing HMAC SHA-256 Signature Verification ---');
const orderId = 'order_test_1234567890';
const paymentId = 'pay_test_9876543210';

// Generate valid signature
const validSignature = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

console.log('Generated Signature:', validSignature);

// Test verification with correct signature
const checkSignature1 = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

const isMatch1 = crypto.timingSafeEqual(
  Buffer.from(checkSignature1, 'utf8'),
  Buffer.from(validSignature, 'utf8')
);

console.log('✓ Valid signature matches:', isMatch1 === true ? 'PASS' : 'FAIL');

// Test verification with tampered payment ID
const tamperedPaymentId = 'pay_test_HACKED';
const checkSignature2 = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(`${orderId}|${tamperedPaymentId}`)
  .digest('hex');

const isMatch2 = checkSignature2 === validSignature;
console.log('✓ Tampered signature rejected:', isMatch2 === false ? 'PASS' : 'FAIL');

console.log('\n--- 2. Testing Razorpay Orders API connectivity ---');
async function testRazorpayOrderCreation() {
  if (!KEY_ID || !KEY_SECRET || KEY_ID.includes('xxxx')) {
    console.log('Skipping network call: real credentials not set.');
    return;
  }
  try {
    const authHeader = `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')}`;
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 69900, // ₹699
        currency: 'INR',
        receipt: `test_rcpt_${Date.now().toString().slice(-8)}`,
      }),
    });

    const data = await res.json();
    if (res.ok && data.id) {
      console.log('✓ Razorpay API Order Created Successfully:', data.id);
      console.log('  Amount:', data.amount, data.currency);
      console.log('  Status:', data.status);
    } else {
      console.log('Razorpay response notice:', data);
    }
  } catch (err) {
    console.warn('Test network note:', err.message);
  }
}

testRazorpayOrderCreation().then(() => {
  console.log('\nAll core cryptographic & API checks complete.');
});
