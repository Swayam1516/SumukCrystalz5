// backend/test-user-auth.js
// Comprehensive User Authentication & Authorization Verification Suite

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'sumuk_crystalz_luxury_secret_key_99482749102834710293';
process.env.ADMIN_EMAIL = 'sumukcrystalz5@gmail.com';
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

async function runUserAuthTests() {
  console.log('======================================================================');
  console.log('💎 SUMUK CRYSTALZ — USER AUTHENTICATION & AUTHORIZATION TEST SUITE');
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
    const testPatronEmail = `swayamh16_${Date.now()}@gmail.com`;
    const testPassword = 'SecurePassword@123';

    // TEST 1: Register New Patron User
    console.log('--- TEST GROUP 1: User Registration ---');
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Swayam Patron',
      email: testPatronEmail,
      password: testPassword,
      phone: '9876543210',
      pincode: '560001',
      dob: '15/08/1995',
    });

    test('Initial user registration returns HTTP 201 Created', () => {
      assert.strictEqual(regRes.statusCode, 201);
      assert.strictEqual(regRes.json?.success, true);
    });

    test('Registration response contains valid JWT token and user profile', () => {
      assert(typeof regRes.json?.token === 'string' && regRes.json.token.length > 20);
      assert.strictEqual(regRes.json?.user?.email, testPatronEmail);
      assert.strictEqual(regRes.json?.user?.role, 'user');
    });

    const userToken = regRes.json?.token;

    // TEST 2: Duplicate Email Registration Prevention
    console.log('\n--- TEST GROUP 2: Duplicate Email Rejection ---');
    const duplicateRegRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Imposter User',
      email: testPatronEmail,
      password: 'AnotherPassword@456',
      phone: '9123456780',
    });

    test('Attempting to re-register with same email returns HTTP 409 Conflict', () => {
      assert.strictEqual(duplicateRegRes.statusCode, 409);
      assert.strictEqual(duplicateRegRes.json?.success, false);
    });

    test('Duplicate email error provides clear feedback that email is already registered', () => {
      const errText = duplicateRegRes.json?.error || duplicateRegRes.json?.message || '';
      assert(errText.toLowerCase().includes('already registered'), `Expected 'already registered' in '${errText}'`);
    });

    // TEST 3: Case-Insensitive Duplicate Email Check
    const uppercaseDuplicateRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Imposter User 2',
      email: testPatronEmail.toUpperCase(),
      password: 'AnotherPassword@456',
    });

    test('Case-insensitive duplicate registration (UPPERCASE) is also rejected with HTTP 409', () => {
      assert.strictEqual(uppercaseDuplicateRes.statusCode, 409);
      assert.strictEqual(uppercaseDuplicateRes.json?.success, false);
    });

    // TEST 4: Reserved Admin Email Registration Check
    const adminRegRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Fake Admin',
      email: 'sumukcrystalz5@gmail.com',
      password: 'TestPassword123',
    });

    test('Registering with Founder Admin email is blocked with HTTP 400', () => {
      assert.strictEqual(adminRegRes.statusCode, 400);
      assert.strictEqual(adminRegRes.json?.success, false);
    });

    // TEST 5: User Login Credential Validation
    console.log('\n--- TEST GROUP 3: Login & Password Validation ---');
    const wrongPassRes = await makeRequest('/api/auth/login', 'POST', {
      email: testPatronEmail,
      password: 'WrongPassword@999',
    });

    test('Login with wrong password rejected with HTTP 401 Unauthorized', () => {
      assert.strictEqual(wrongPassRes.statusCode, 401);
      assert.strictEqual(wrongPassRes.json?.success, false);
    });

    const validLoginRes = await makeRequest('/api/auth/login', 'POST', {
      email: testPatronEmail,
      password: testPassword,
    });

    test('Login with correct password succeeds with HTTP 200', () => {
      assert.strictEqual(validLoginRes.statusCode, 200);
      assert.strictEqual(validLoginRes.json?.success, true);
      assert.strictEqual(validLoginRes.json?.user?.email, testPatronEmail);
      assert.strictEqual(validLoginRes.json?.user?.role, 'user');
    });

    // TEST 6: User Profile & Authentication Verification
    console.log('\n--- TEST GROUP 4: Authenticated Profile Access ---');
    const unauthProfileRes = await makeRequest('/api/auth/me', 'GET');
    test('Unauthenticated /api/auth/me request rejected with HTTP 401', () => {
      assert.strictEqual(unauthProfileRes.statusCode, 401);
    });

    const authProfileRes = await makeRequest('/api/auth/me', 'GET', null, {
      Authorization: `Bearer ${userToken}`,
    });

    test('Authenticated /api/auth/me with Bearer token returns HTTP 200 and user profile', () => {
      assert.strictEqual(authProfileRes.statusCode, 200);
      assert.strictEqual(authProfileRes.json?.user?.email, testPatronEmail);
    });

    // TEST 7: Role-Based Access Control (RBAC) - Customer vs Admin Routes
    console.log('\n--- TEST GROUP 5: Authorization & RBAC Enforcement ---');
    const patronAdminAccessRes = await makeRequest('/api/admin/orders', 'GET', null, {
      Authorization: `Bearer ${userToken}`,
    });

    test('Regular customer role (role="user") blocked from Admin routes with HTTP 403 Forbidden', () => {
      assert.strictEqual(patronAdminAccessRes.statusCode, 403);
      assert.strictEqual(patronAdminAccessRes.json?.success, false);
    });

    // TEST 8: Founder Admin Login & Access
    const adminLoginRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'sumukcrystalz5@gmail.com',
      password: 'Sumukcrystalz@555',
    });

    test('Founder Admin login succeeds with HTTP 200 and role "admin"', () => {
      assert.strictEqual(adminLoginRes.statusCode, 200);
      assert.strictEqual(adminLoginRes.json?.user?.role, 'admin');
    });

    const adminToken = adminLoginRes.json?.token;
    const adminOrdersRes = await makeRequest('/api/admin/orders', 'GET', null, {
      Authorization: `Bearer ${adminToken}`,
    });

    test('Founder Admin can access protected /api/admin/orders with HTTP 200', () => {
      assert.strictEqual(adminOrdersRes.statusCode, 200);
      assert.strictEqual(adminOrdersRes.json?.success, true);
    });

    console.log('\n======================================================================');
    console.log(`TOTAL USER AUTH & AUTHORIZATION TESTS: ${passed + failed}`);
    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log('======================================================================\n');

    if (failed === 0) {
      console.log('👑 USER AUTHENTICATION, DUPLICATE PREVENTION & RBAC 100% SECURE & VERIFIED!');
      setTimeout(() => process.exit(0), 100);
    } else {
      setTimeout(() => process.exit(1), 100);
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    setTimeout(() => process.exit(1), 100);
  }
}

runUserAuthTests();
