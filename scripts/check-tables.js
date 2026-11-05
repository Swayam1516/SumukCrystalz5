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

const candidates = [
  'products', 'product_variants', 'product_images', 'product_options', 'product_option_values',
  'categories', 'product_id_sequences', 'orders', 'order_items', 'customers', 'reviews',
  'testimonials', 'shipping_settings', 'announcements', 'services', 'discovery_filter_groups',
  'discovery_filters', 'product_discovery_filters', 'filters', 'product_filters'
];

async function checkTables() {
  for (const t of candidates) {
    const { data, error } = await client.from(t).select('*').limit(1);
    if (!error) {
      console.log(`[EXISTS] ${t} (Count: ${data?.length})`);
    } else {
      console.log(`[MISSING] ${t}: ${error.message}`);
    }
  }
}

checkTables();

