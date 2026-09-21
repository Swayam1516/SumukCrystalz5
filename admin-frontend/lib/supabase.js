import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Persist customer profile directly to Supabase
 */
export async function saveCustomerToSupabase(customer) {
  try {
    const payload = {
      full_name: customer.fullName || customer.name || 'Valued Collector',
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
      console.warn('Supabase customer save notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase customer error:', err.message);
    return null;
  }
}

/**
 * Persist order details directly to Supabase
 */
export async function saveOrderToSupabase(order) {
  try {
    const payload = {
      order_number: order.orderId || order._id || `ORD-${Date.now()}`,
      buyer_name: order.buyerName || order.shippingAddress?.fullName || 'Collector',
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase order save notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase order error:', err.message);
    return null;
  }
}

/**
 * Query orders from Supabase
 */
export async function getSupabaseOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch orders notice:', err.message);
    return [];
  }
}

/**
 * Query customers from Supabase
 */
export async function getSupabaseCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch customers notice:', err.message);
    return [];
  }
}
