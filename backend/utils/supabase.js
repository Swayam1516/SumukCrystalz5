const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

let supabase = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log('✨ Connected to Supabase DB instance:', supabaseUrl);
  }
} catch (err) {
  console.warn('⚠️ Supabase client initialization notice:', err.message);
}

/**
 * Syncs a customer record into Supabase
 */
async function syncCustomerToSupabase(customer) {
  if (!supabase) return null;
  try {
    const payload = {
      full_name: customer.name || customer.fullName || 'Valued Collector',
      email: customer.email?.toLowerCase().trim(),
      phone: customer.phone || '',
      shipping_address: customer.shippingAddress || customer.address || {},
      total_orders: customer.totalOrders || 1,
      total_spent: customer.totalSpent || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert(payload, { onConflict: 'email' })
      .select();

    if (error) {
      // Table might not exist yet or policy restriction
      console.warn('Supabase customer sync notice:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Supabase sync customer exception:', e.message);
    return null;
  }
}

/**
 * Syncs an order record into Supabase
 */
async function syncOrderToSupabase(order) {
  if (!supabase) return null;
  try {
    const payload = {
      order_number: order._id?.toString() || `ORD-${Date.now()}`,
      buyer_name: order.buyerName || order.shippingAddress?.fullName || 'Valued Collector',
      buyer_email: order.buyerEmail?.toLowerCase().trim(),
      buyer_phone: order.shippingAddress?.phone || '',
      shipping_address: order.shippingAddress || {},
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shipping_fee: order.shippingFee || 0,
      total: order.total || 0,
      currency: order.currency || 'INR',
      razorpay_order_id: order.razorpayOrderId || '',
      razorpay_payment_id: order.razorpayPaymentId || '',
      status: order.status || 'paid',
      created_at: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase order sync notice:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Supabase sync order exception:', e.message);
    return null;
  }
}

/**
 * Retrieves orders from Supabase
 */
async function getSupabaseOrders() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}

/**
 * Retrieves customers from Supabase
 */
async function getSupabaseCustomers() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}

module.exports = {
  supabase,
  syncCustomerToSupabase,
  syncOrderToSupabase,
  getSupabaseOrders,
  getSupabaseCustomers,
};
