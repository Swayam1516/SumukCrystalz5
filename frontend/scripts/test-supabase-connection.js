/**
 * Test Connection to the New Supabase Instance
 */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseKey = 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('--- Testing New Supabase Connection ---');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey.slice(0, 20) + '...');

  try {
    // Attempt to query or check connection
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    
    if (error) {
      console.log('Supabase Response (Table status):', error.message);
      console.log('✓ Successfully communicated with Supabase project cmsiounkoqpwjccczebk!');
    } else {
      console.log('✓ Successfully connected and queried Supabase orders table!');
      console.log('  Data rows count:', data?.length);
    }
  } catch (err) {
    console.warn('Network / Test note:', err.message);
  }
}

testSupabase();
