import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

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

export async function saveOrderToSupabase(order) {
  try {
    const orderNumber = order.orderId || order._id || order.orderNumber || `ORD-${Date.now()}`;
    const buyerEmail = order.buyerEmail?.toLowerCase().trim() || '';
    const buyerName = order.buyerName || order.shippingAddress?.fullName || 'Collector';
    const totalAmount = Number(order.total || order.total_amount || 0);

    const payload = {
      order_number: orderNumber,
      user_id: order.userId || order.user_id || null,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: order.buyerPhone || order.shippingAddress?.phone || '',
      shipping_address: order.shippingAddress || {},
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      shipping_fee: Number(order.shippingFee || 0),
      total: totalAmount,
      total_amount: totalAmount,
      currency: order.currency || 'INR',
      razorpay_order_id: order.razorpayOrderId || '',
      razorpay_payment_id: order.razorpayPaymentId || '',
      status: order.status || 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    const createdOrderId = orderResult?.id || payload.order_number;

    if (order.items && Array.isArray(order.items) && order.items.length > 0 && orderResult?.id) {
      const lineItemsPayload = order.items.map((it) => ({
        order_id: orderResult.id,
        product_id: it.productId || it.product_id || it.id || null,
        product_name: it.name || it.product_name || 'Sacred Crystal Specimen',
        product_image: it.image || it.images?.[0] || it.product_image || '',
        price: Number(it.price || it.unitPrice || 0),
        quantity: Number(it.quantity || 1),
        is_reviewed: false,
      }));

      await supabase.from('order_items').insert(lineItemsPayload).select();
    }

    if (typeof window !== 'undefined') {
      try {
        const localRecord = {
          ...payload,
          id: createdOrderId,
          _id: createdOrderId,
          createdAt: payload.created_at,
          order_items: (order.items || []).map((it, idx) => ({
            id: `item_${Date.now()}_${idx}`,
            product_id: it.productId || it.id,
            product_name: it.name,
            product_image: it.image || it.images?.[0],
            price: Number(it.price || it.unitPrice || 0),
            quantity: Number(it.quantity || 1),
            is_reviewed: false,
          })),
        };

        const existingRaw = localStorage.getItem('sumuk_recent_orders');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = [localRecord, ...existingList.filter(o => (o.id !== createdOrderId && o._id !== createdOrderId && o.order_number !== orderNumber))];
        localStorage.setItem('sumuk_recent_orders', JSON.stringify(updatedList));
      } catch (storageErr) {}
    }

    return orderResult || payload;
  } catch (err) {
    console.warn('Supabase saveOrder error:', err.message);
    return null;
  }
}

export async function getSupabaseOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch orders notice:', err.message);
    return [];
  }
}

export async function getSupabaseOrdersByUser(userId, email) {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`user_id.eq.${userId},buyer_email.eq.${email?.toLowerCase().trim()}`);
    } else if (email) {
      query = query.eq('buyer_email', email.toLowerCase().trim());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch orders by user notice:', err.message);
    return [];
  }
}

export async function updateOrderStatusInSupabase(orderId, status, details = {}) {
  try {
    const updates = {
      status,
      updated_at: new Date().toISOString(),
      ...details,
    };

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Update order status error:', err);
    return { data: null, error: err.message };
  }
}

export async function updateProductAvailabilityInSupabase(productId, isActive, stock = null) {
  try {
    const updates = {
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };
    if (stock !== null) {
      updates.total_stock = stock;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Update product availability error:', err);
    return { data: null, error: err.message };
  }
}

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
