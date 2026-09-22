const crypto = require('crypto');
require('dotenv').config();

const { createRazorpayOrder, verifyAndFulfillPayment } = require('./services/paymentService');

async function runPaymentE2ETests() {
  console.log('======================================================================');
  console.log('💎 EXECUTING RAZORPAY STANDARD CHECKOUT & ZERO-TRUST FULFILLMENT TESTS');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'WO8H2BGJod4exSF7AA7rfTHd';

  // 1. Create Razorpay Order with zero-trust validation
  console.log('--- TEST GROUP 1: Server-Side Zero-Trust Order Creation ---');
  const { getSupabaseAllProducts } = require('./utils/supabaseProductService');
  const products = await getSupabaseAllProducts({});
  
  const testProduct = Array.isArray(products) && products.length > 0 ? products[0] : null;
  if (!testProduct) {
    console.error('No products found in database to test. Please ensure Supabase contains active products.');
    process.exit(1);
  }

  const mockItems = [
    {
      productId: testProduct.id || testProduct.slug,
      name: testProduct.name,
      unitPrice: testProduct.sellingPrice || testProduct.price || 999,
      quantity: 1,
    },
  ];

  const shippingAddress = {
    fullName: 'Arjun Verma',
    phone: '9876543210',
    line1: '42 Lotus Temple Road',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    country: 'India',
  };

  const orderResult = await createRazorpayOrder({
    items: mockItems,
    shippingAddress,
    buyerName: 'Arjun Verma',
    buyerEmail: 'arjun.verma@example.com',
  });

  assert(orderResult && orderResult.orderId, 'Order creation generated internal order ID');
  assert(orderResult && orderResult.razorpayOrderId, 'Razorpay order ID received');
  assert(orderResult.amount > 0, `Amount recalculated correctly: ${orderResult.amount} paise`);
  assert(orderResult.currency === 'INR', 'Currency is INR');

  // 2. Cryptographic Signature Verification & Fulfillment
  console.log('\n--- TEST GROUP 2: Cryptographic HMAC SHA256 Signature Verification ---');
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderResult.razorpayOrderId}|pay_test_88992211`)
    .digest('hex');

  const fulfillResult = await verifyAndFulfillPayment({
    razorpay_order_id: orderResult.razorpayOrderId,
    razorpay_payment_id: 'pay_test_88992211',
    razorpay_signature: generatedSignature,
    orderId: orderResult.orderId,
    buyerName: 'Arjun Verma',
    buyerEmail: 'arjun.verma@example.com',
    shippingAddress,
    items: mockItems,
    subtotal: 5499,
    shippingFee: 0,
    total: 5499,
  });

  assert(fulfillResult.success === true, 'Payment verified and fulfilled successfully');
  assert(fulfillResult.status === 'paid', 'Order status set to paid');
  assert(fulfillResult.orderId === orderResult.orderId, 'Correct order ID linked in confirmation');

  // 3. Replay Protection & Idempotency
  console.log('\n--- TEST GROUP 3: Duplicate Payment / Replay Protection ---');
  const replayResult = await verifyAndFulfillPayment({
    razorpay_order_id: orderResult.razorpayOrderId,
    razorpay_payment_id: 'pay_test_88992211',
    razorpay_signature: generatedSignature,
    orderId: orderResult.orderId,
  });

  assert(replayResult.success === true, 'Duplicate verification handled gracefully without double charging/deduction');
  assert(replayResult.message && replayResult.message.includes('already verified'), 'Idempotency message returned');

  // 4. Tampered Signature Rejection
  console.log('\n--- TEST GROUP 4: Forged / Tampered Signature Detection ---');
  const tamperedSig = 'badf00d_deadbeef_000000000000000000000000000000000000000000000000';
  let rejectedAsExpected = false;
  try {
    await verifyAndFulfillPayment({
      razorpay_order_id: `rzp_order_${Date.now()}`,
      razorpay_payment_id: 'pay_fraud_999999',
      razorpay_signature: tamperedSig,
      orderId: `ORD-FRAUD-${Date.now()}`,
    });
  } catch (err) {
    rejectedAsExpected = true;
    assert(err.message.includes('signature') || err.statusCode === 400, 'Tampered signature rejected with security error');
  }
  if (!rejectedAsExpected) {
    assert(false, 'Tampered signature was NOT rejected');
  }

  console.log('\n======================================================================');
  console.log(`TOTAL PAYMENT E2E TESTS: ${passed + failed}`);
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPaymentE2ETests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
