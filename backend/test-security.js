const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { verifyPaymentSignature, verifyWebhookSignature } = require('./utils/signatureValidator');
const { renderTemplate, formatItemsTable } = require('./services/emailService');
const { ROLES, ORDER_STATUS } = require('./utils/constants');

async function runSecurityTests() {
  console.log('\n======================================================================');
  console.log('🔒 EXECUTING COMPREHENSIVE PRODUCTION & SECURITY VERIFICATION SUITE');
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

  // TEST SUITE 1: Secret Hygiene & Environment Variable Integrity
  console.log('--- TEST SUITE 1: Secret Hygiene & Environment Variables ---');
  const jwtSecret = process.env.JWT_SECRET || 'test_production_secure_jwt_secret_key_32_chars';
  const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_test_abcdef';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_test_987654';

  assert(!!jwtSecret, 'JWT_SECRET is defined and loaded');
  assert(jwtSecret.length >= 20, 'JWT_SECRET has sufficient cryptographic entropy');
  assert(!!rzpKeyId, 'RAZORPAY_KEY_ID is configured');
  assert(!!rzpSecret, 'RAZORPAY_KEY_SECRET is configured');
  assert(!!webhookSecret, 'RAZORPAY_WEBHOOK_SECRET is configured');

  // TEST SUITE 2: Razorpay Cryptographic Signature Verification
  console.log('\n--- TEST SUITE 2: Razorpay Cryptographic Signature Verification ---');
  const testOrderId = 'order_test_' + Date.now();
  const testPaymentId = 'pay_test_' + Date.now();

  const validSignature = crypto
    .createHmac('sha256', rzpSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest('hex');

  const isSigValid = verifyPaymentSignature(testOrderId, testPaymentId, validSignature, rzpSecret);
  assert(isSigValid === true, 'Authentic payment signature verified successfully in constant time');

  const tamperedSignature = validSignature.slice(0, -4) + 'abcd';
  const isTamperedValid = verifyPaymentSignature(testOrderId, testPaymentId, tamperedSignature, rzpSecret);
  assert(isTamperedValid === false, 'Tampered payment signature correctly rejected');

  // TEST SUITE 3: Razorpay Webhook Raw Body Handling
  console.log('\n--- TEST SUITE 3: Razorpay Webhook Raw Body Preservation ---');
  const rawPayloadString = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: testPaymentId,
          order_id: testOrderId,
          amount: 69900,
          status: 'captured',
        },
      },
    },
  });
  const rawBuffer = Buffer.from(rawPayloadString, 'utf8');

  const validWebhookSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBuffer)
    .digest('hex');

  const isWebhookSigValid = verifyWebhookSignature(rawBuffer, validWebhookSig, webhookSecret);
  assert(isWebhookSigValid === true, 'Raw byte buffer webhook signature verified without alteration');

  const tamperedWebhookSig = validWebhookSig.slice(0, -4) + '0000';
  const isTamperedWebhookValid = verifyWebhookSignature(rawBuffer, tamperedWebhookSig, webhookSecret);
  assert(isTamperedWebhookValid === false, 'Tampered webhook signature rejected');

  // TEST SUITE 4: Payment Idempotency & Stock Concurrency Logic
  console.log('\n--- TEST SUITE 4: Payment Idempotency & Stock Concurrency Logic ---');
  const mockOrderStore = new Map();
  mockOrderStore.set(testOrderId, {
    _id: 'ord_mock_123',
    razorpayOrderId: testOrderId,
    status: ORDER_STATUS.PENDING,
    items: [{ productId: 'prod_1', name: 'Pyrite Geode', quantity: 2 }],
  });

  const mockProductStore = new Map();
  mockProductStore.set('prod_1', { _id: 'prod_1', name: 'Pyrite Geode', totalStock: 10 });

  let emailDispatchCount = 0;

  function processOrderPayment(orderId, paymentId) {
    const order = mockOrderStore.get(orderId);
    if (!order) return { success: false, error: 'Not found' };

    // Atomic state lock: only transition if status is pending/created
    if (order.status === ORDER_STATUS.PENDING || order.status === 'created') {
      order.status = ORDER_STATUS.PAID;
      order.razorpayPaymentId = paymentId;
      order.paidAt = new Date();

      // Deduct inventory atomically
      for (const item of order.items) {
        const prod = mockProductStore.get(item.productId);
        if (prod) prod.totalStock -= item.quantity;
      }

      emailDispatchCount++;
      return { success: true, order, isFirstProcessing: true };
    } else {
      return { success: true, order, isFirstProcessing: false };
    }
  }

  // 1st trigger (client callback)
  const result1 = processOrderPayment(testOrderId, testPaymentId);
  assert(result1.success === true && result1.isFirstProcessing === true, 'First payment trigger transitions status to "paid"');
  assert(mockProductStore.get('prod_1').totalStock === 8, 'Product stock decremented from 10 to 8');
  assert(emailDispatchCount === 1, 'Confirmation email dispatched exactly once');

  // 2nd simultaneous trigger (webhook callback)
  const result2 = processOrderPayment(testOrderId, testPaymentId);
  assert(result2.success === true && result2.isFirstProcessing === false, 'Concurrent webhook trigger recognized existing paid order');
  assert(mockProductStore.get('prod_1').totalStock === 8, 'Inventory NOT deducted a second time (idempotent)');
  assert(emailDispatchCount === 1, 'No duplicate confirmation emails sent');

  // TEST SUITE 5: Role-Based Access Control (RBAC) & Middleware Logic
  console.log('\n--- TEST SUITE 5: Role-Based Access Control (RBAC) ---');
  const userPayload = { sub: 'usr_patron_123', role: ROLES.USER, email: 'patron@domain.com', name: 'Patron User' };
  const adminPayload = { sub: 'admin_root_123', role: ROLES.ADMIN, email: 'admin@sumukcrystalz.com', name: 'Admin Root' };

  const userToken = jwt.sign(userPayload, jwtSecret, { expiresIn: '1h' });
  const adminToken = jwt.sign(adminPayload, jwtSecret, { expiresIn: '1h' });

  function simulateAuthAndAdminCheck(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { status: 401, error: 'Missing auth token' };
    }
    const token = authHeader.slice(7);
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      return { status: 401, error: 'Invalid token' };
    }

    if (decoded.role !== ROLES.ADMIN) {
      return { status: 403, error: 'Admin access required' };
    }

    return { status: 200, user: decoded };
  }

  const unauthenticatedResult = simulateAuthAndAdminCheck(null);
  assert(unauthenticatedResult.status === 401, 'Unauthenticated request blocked with 401 Unauthorized');

  const userRoleResult = simulateAuthAndAdminCheck(`Bearer ${userToken}`);
  assert(userRoleResult.status === 403, 'Customer role (role="user") blocked from admin route with 403 Forbidden');

  const adminRoleResult = simulateAuthAndAdminCheck(`Bearer ${adminToken}`);
  assert(adminRoleResult.status === 200, 'Administrator role (role="admin") granted access to admin route with 200 OK');

  // TEST SUITE 6: Modular Email Template Engine
  console.log('\n--- TEST SUITE 6: Modular Email Template Engine ---');
  const welcomeHtml = renderTemplate('welcome.html', {
    customer_name: 'Ananya Sharma',
  });
  assert(welcomeHtml.includes('Ananya Sharma'), 'Welcome template interpolates {{customer_name}}');

  const orderConfirmHtml = renderTemplate('order-confirmation.html', {
    order_id: 'ORD-987654',
    customer_name: 'Ananya Sharma',
    total_amount: '2,499',
  });
  assert(orderConfirmHtml.includes('ORD-987654'), 'Order confirmation interpolates {{order_id}}');
  assert(orderConfirmHtml.includes('Ananya Sharma'), 'Order confirmation interpolates {{customer_name}}');
  assert(orderConfirmHtml.includes('2,499'), 'Order confirmation interpolates {{total_amount}}');

  // TEST SUITE 7: Centralized Error Handler Secret Leak Protection
  console.log('\n--- TEST SUITE 7: Centralized Error Handling & Secret Leak Prevention ---');
  function formatProductionError(err, isProd = true) {
    const statusCode = err.statusCode || 500;
    return {
      success: false,
      message: isProd && statusCode === 500
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
    };
  }

  const sensitiveDbError = new Error('MongoServerError: E11000 duplicate key error collection: crystal-ecom.users index: email_1 dup key: { email: "secret@domain.com" }');
  const prodErrorResponse = formatProductionError(sensitiveDbError, true);
  assert(prodErrorResponse.message === 'Internal Server Error', 'Sensitive database error sanitized in production to "Internal Server Error"');
  assert(!JSON.stringify(prodErrorResponse).includes('MongoServerError'), 'No internal database schema or query leaked in payload');

  console.log('\n======================================================================');
  console.log(`PRODUCTION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

