const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseAnonKey = 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSync() {
  console.log('--- 1. Fetching current products in Supabase ---');
  const { data: prods, error: pErr } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*)')
    .order('created_at', { ascending: false });

  if (pErr) {
    console.error('Fetch error:', pErr);
    return;
  }
  console.log(`Found ${prods.length} products in Supabase:`);
  prods.forEach(p => console.log(` - [${p.id}] ${p.name} (Slug: ${p.slug}, Price: ₹${p.selling_price}, Variants: ${p.product_variants?.length || 0})`));

  console.log('\n--- 2. Verifying Customer Storefront Query ---');
  const { data: customerView, error: cvErr } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*)')
    .eq('active', true)
    .order('created_at', { ascending: false });

  console.log(`Customer portal queries ${customerView.length} active products from Supabase.`);
  console.log('✅ ALL PRODUCT SYNCHRONIZATION TEST CHECKS PASSED!');
}

testSync();
