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

async function inspectProduct() {
  const { data } = await client.from('products').select('*').limit(1);
  if (data && data[0]) {
    console.log('Product columns:', Object.keys(data[0]));
    console.log('Sample data:', data[0]);
  }
}

inspectProduct();

