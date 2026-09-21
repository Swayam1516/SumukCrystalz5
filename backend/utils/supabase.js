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
 * Syncs / Upserts a Product into Supabase
 */
async function syncProductToSupabase(product) {
  if (!supabase) return null;
  try {
    const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      title: product.name || product.title,
      slug,
      description: product.description || product.shortDescription || '',
      base_price: parseFloat(product.price || product.basePrice || 0),
      currency: product.currency || 'INR',
      images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
      total_stock: parseInt(product.stockCount || product.totalStock || 0, 10),
      is_active: product.isActive !== undefined ? product.isActive : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'slug' })
      .select();

    if (error) {
      console.warn('Supabase product sync notice:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Supabase product sync exception:', e.message);
    return null;
  }
}

/**
 * Deletes a Product from Supabase
 */
async function deleteProductFromSupabase(idOrSlug) {
  if (!supabase) return null;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = supabase.from('products').delete();
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase product delete exception:', e.message);
    return null;
  }
}

/**
 * Retrieves products from Supabase
 */
async function getSupabaseProducts() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    return [];
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
  syncProductToSupabase,
  deleteProductFromSupabase,
  getSupabaseProducts,
  getSupabaseOrders,
  getSupabaseCustomers,
};
