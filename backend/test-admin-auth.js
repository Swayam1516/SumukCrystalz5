// backend/test-admin-auth.js
// Dedicated Founder Admin Authentication & Credential Security Verification Suite

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'sumuk_crystalz_luxury_secret_key_99482749102834710293';
process.env.ADMIN_EMAIL = 'Sumukcrystalz5@gmail.com';
process.env.ADMIN_PASSWORD = 'Sumukcrystalz@555';

const assert = require('assert');
const http = require('http');
const app = require('./server');

let server;
let TEST_PORT;

function makeRequest(path, method, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {}
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data, json });
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAdminSecurityTests() {
  console.log('======================================================================');
  console.log('👑 SUMUK CRYSTALZ — FOUNDER ADMIN CREDENTIAL SECURITY TEST SUITE');
  console.log('======================================================================\n');

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      TEST_PORT = server.address().port;
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  function test(desc, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${desc} -> ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Correct Founder Admin Credentials
    const validAdminRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'Sumukcrystalz5@gmail.com',
      password: 'Sumukcrystalz@555',
    });

    test('Valid Founder Admin credentials (Sumukcrystalz5@gmail.com / Sumukcrystalz@555) returns HTTP 200', () => {
      assert.strictEqual(validAdminRes.statusCode, 200);
      assert.strictEqual(validAdminRes.json?.success, true);
    });

    test('Valid Founder Admin credentials returns role "admin" and name "Soumyaa Naveen"', () => {
      assert.strictEqual(validAdminRes.json?.user?.role, 'admin');
      assert.strictEqual(validAdminRes.json?.user?.name, 'Soumyaa Naveen');
      assert.strictEqual(validAdminRes.json?.user?.email, 'sumukcrystalz5@gmail.com');
    });

    test('Valid Founder Admin credentials issues valid JWT token', () => {
      assert(typeof validAdminRes.json?.token === 'string');
      assert(validAdminRes.json.token.length > 20);
    });

    const adminToken = validAdminRes.json?.token;

    // 2. Case Insensitive Email Check
    const caseAdminRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'SUMUKCRYSTALZ5@GMAIL.COM',
      password: 'Sumukcrystalz@555',
    });

    test('Case-insensitive uppercase email (SUMUKCRYSTALZ5@GMAIL.COM) succeeds', () => {
      assert.strictEqual(caseAdminRes.statusCode, 200);
      assert.strictEqual(caseAdminRes.json?.user?.role, 'admin');
    });

    // 3. Incorrect Password for Founder Email
    const wrongPassRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'Sumukcrystalz5@gmail.com',
      password: 'WrongPassword999!',
    });

    test('Founder email with wrong password is rejected with HTTP 401', () => {
      assert.strictEqual(wrongPassRes.statusCode, 401);
      assert.strictEqual(wrongPassRes.json?.success, false);
    });

    // 4. Registration block for reserved admin email
    const regAdminRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Imposter',
      email: 'Sumukcrystalz5@gmail.com',
      password: 'TestPassword123',
      phone: '9876543210',
    });

    test('Attempt to public-register with Founder admin email is rejected with HTTP 400', () => {
      assert.strictEqual(regAdminRes.statusCode, 400);
    });

    // 5. Protected Admin Route Authorization with Admin Token
    const adminOrdersRes = await makeRequest('/api/admin/orders', 'GET', null, {
      Authorization: `Bearer ${adminToken}`,
    });

    test('Protected /api/admin/orders returns HTTP 200 with Founder Admin Token', () => {
      assert.strictEqual(adminOrdersRes.statusCode, 200);
      assert.strictEqual(adminOrdersRes.json?.success, true);
    });

    // 6. Protected Admin Route Rejected for Unauthenticated
    const unauthRes = await makeRequest('/api/admin/orders', 'GET');

    test('Protected /api/admin/orders rejects unauthenticated access with HTTP 401', () => {
      assert.strictEqual(unauthRes.statusCode, 401);
    });

    console.log('\n======================================================================');
    console.log(`TOTAL ADMIN SECURITY TESTS: ${passed + failed}`);
    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log('======================================================================\n');

    await require('mongoose').disconnect().catch(() => {});
    if (failed === 0) {
      console.log('👑 FOUNDER ADMIN AUTHENTICATION SECURED & 100% VERIFIED!');
      setTimeout(() => process.exit(0), 100);
    } else {
      setTimeout(() => process.exit(1), 100);
    }
  } catch (err) {
    await require('mongoose').disconnect().catch(() => {});
    setTimeout(() => process.exit(1), 100);
  }
}

runAdminSecurityTests();
