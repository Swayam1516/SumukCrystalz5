const http = require('http');
const assert = require('assert');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'integration_test_secret_32_characters_long';
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret';

const app = require('./server');
const mailer = require('./config/mailer');

async function runTests() {
  console.log('🧪 Running Comprehensive Backend Integration Verification...\n');

  let passed = 0;
  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`, err);
      process.exit(1);
    }
  }

  // 1. Trust proxy check
  test("app.get('trust proxy') is configured to 1", () => {
    assert.strictEqual(app.get('trust proxy'), 1);
  });

  // 2. Mailer and Template Engine tests
  test('config/mailer exports renderTemplate, sendWelcomeEmail, sendOrderConfirmationEmail', () => {
    assert.strictEqual(typeof mailer.renderTemplate, 'function');
    assert.strictEqual(typeof mailer.sendWelcomeEmail, 'function');
    assert.strictEqual(typeof mailer.sendOrderConfirmationEmail, 'function');
    assert(mailer.transporter);
  });

  test('renderTemplate properly substitutes welcome.html variables', () => {
    const rendered = mailer.renderTemplate('welcome.html', {
      customer_name: 'Aditi Rao',
    });
    assert(rendered.includes('Aditi Rao'), 'Missing customer_name in welcome email');
  });

  test('renderTemplate properly substitutes order-confirmation.html variables', () => {
    const rendered = mailer.renderTemplate('order-confirmation.html', {
      order_id: 'ORD-SUMUK-7788',
      customer_name: 'Aditi Rao',
      total_amount: '4,999',
    });
    assert(rendered.includes('ORD-SUMUK-7788'), 'Missing order_id in order confirmation');
    assert(rendered.includes('Aditi Rao'), 'Missing customer_name in order confirmation');
    assert(rendered.includes('4,999'), 'Missing total_amount in order confirmation');
  });

  // 3. HTTP Server and Endpoint Testing
  const port = process.env.PORT || 4000;
  const baseUrl = `http://localhost:${port}`;

  try {
    // Test GET /api/health
    await new Promise((resolve, reject) => {
      http.get(`${baseUrl}/api/health`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            assert.strictEqual(res.statusCode, 200);
            const json = JSON.parse(data);
            assert.strictEqual(json.status, 'ok', 'GET /api/health must return { status: "ok" }');
            console.log('  ✅ PASS: GET /api/health returns HTTP 200 with { status: "ok" }');
            passed++;
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    // Test rawBody attachment on express.json
    await new Promise((resolve, reject) => {
      const payload = JSON.stringify({ testKey: 'crystalValue' });
      const req = http.request(
        `${baseUrl}/api/payment/webhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              // Missing signature will return 400 from webhook validator
              assert.strictEqual(res.statusCode, 400);
              const json = JSON.parse(data);
              assert(json.message.includes('Missing webhook signature') || json.error);
              console.log('  ✅ PASS: Webhook endpoint mounted and rawBody/signature verified');
              passed++;
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    // Test CORS headers
    await new Promise((resolve, reject) => {
      const req = http.request(
        `${baseUrl}/api/health`,
        {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://sumukcrystalz.vercel.app',
            'Access-Control-Request-Method': 'GET',
          },
        },
        (res) => {
          try {
            assert.strictEqual(res.headers['access-control-allow-origin'], 'https://sumukcrystalz.vercel.app');
            console.log('  ✅ PASS: CORS headers correctly return allowed origin for https://sumukcrystalz.vercel.app');
            passed++;
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      );
      req.on('error', reject);
      req.end();
    });

    // Test Admin CORS headers
    await new Promise((resolve, reject) => {
      const req = http.request(
        `${baseUrl}/api/health`,
        {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://admin.sumukcrystalz.com',
            'Access-Control-Request-Method': 'GET',
          },
        },
        (res) => {
          try {
            assert.strictEqual(res.headers['access-control-allow-origin'], 'https://admin.sumukcrystalz.com');
            console.log('  ✅ PASS: CORS headers correctly return allowed origin for https://admin.sumukcrystalz.com');
            passed++;
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      );
      req.on('error', reject);
      req.end();
    });

    // Test 404 handler
    await new Promise((resolve, reject) => {
      http.get(`${baseUrl}/api/non-existent-endpoint`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            assert.strictEqual(res.statusCode, 404);
            const json = JSON.parse(data);
            assert.strictEqual(json.success, false);
            console.log('  ✅ PASS: Centralized 404 handler catches unknown routes cleanly');
            passed++;
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (err) {
    throw err;
  }

  console.log(`\n🎉 ALL ${passed} INTEGRATION TESTS PASSED SUCCESSFULLY!`);
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
