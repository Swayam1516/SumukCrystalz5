const path = require('path');
const { createClient } = require(path.join(__dirname, '../backend/node_modules/@supabase/supabase-js'));
const fs = require('fs');

const envPath = path.join(__dirname, '../backend/.env');
const env = fs.readFileSync(envPath, 'utf8');
let url = '', key = '';
env.split('\n').forEach(l => {
  if (l.startsWith('SUPABASE_URL=')) url = l.replace('SUPABASE_URL=', '').trim();
  if (l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = l.replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim();
  if (!key && l.startsWith('SUPABASE_KEY=')) key = l.replace('SUPABASE_KEY=', '').trim();
});

const client = createClient(url, key);

async function testRpc() {
  const rpcs = ['exec_sql', 'execute_sql', 'run_sql', 'query'];
  for (const r of rpcs) {
    const { data, error } = await client.rpc(r, { query: 'SELECT 1;', sql: 'SELECT 1;' });
    console.log(`RPC [${r}]:`, data, error?.message);
  }
}

testRpc();

