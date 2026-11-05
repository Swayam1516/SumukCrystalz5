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

async function list() {
  const { data: prods, error } = await client.from('products').select('*, product_variants(*), product_images(*)');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Total products in Supabase:', prods?.length);
  prods?.forEach((p, i) => {
    console.log(`[${i+1}] ID: ${p.id} | Slug: ${p.slug} | Name: ${p.name} | Category: ${p.category} | Active: ${p.active} | Variants: ${p.product_variants?.length}`);
  });
}

list();
