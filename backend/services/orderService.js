const AppError = require('../utils/AppError');
const { ORDER_STATUS } = require('../utils/constants');
const {
  sendOrderPackedNotification,
  sendOrderShippedNotification,
  sendOrderDeliveredNotification,
} = require('./emailService');
const {
  notifyWhatsAppOrderPacked,
  notifyWhatsAppOrderShipped,
  notifyWhatsAppOrderDelivered,
} = require('./whatsappService');
const { supabase, syncOrderToSupabase, getSupabaseOrders } = require('../utils/supabase');

/**
 * Retrieves orders placed by a specific authenticated user
 */
async function getUserOrders(userId, email) {
  if (!supabase) return [];
  const cleanEmail = email?.toLowerCase().trim();

  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (cleanEmail) {
      query = query.eq('buyer_email', cleanEmail);
    }
    const { data } = await query;
    return data || [];
  } catch (err) {
    console.error('Error fetching user orders from Supabase:', err.message);
    return [];
  }
}

/**
 * Retrieves a single order by ID with ownership verification
 */
async function getOrderById(orderId, requestingUser = null) {
  if (!supabase) throw new AppError('Database unavailable', 500);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  let query = supabase.from('orders').select('*');
  if (isUuid) {
    query = query.eq('id', orderId);
  } else {
    query = query.or(`order_number.eq.${orderId},razorpay_order_id.eq.${orderId}`);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    throw new AppError('Order not found', 404);
  }

  // Access check: allow admins or matching customer
  if (requestingUser && requestingUser.role !== 'admin') {
    const isOwner =
      order.buyer_email?.toLowerCase() === requestingUser.email?.toLowerCase() ||
      order.user_id === requestingUser.id;

    if (!isOwner) {
      throw new AppError('Access Denied: You do not have permission to view this order.', 403);
    }
  }

  return order;
}

/**
 * Cancels an order (allowed only if status is pending or confirmed/paid)
 */
async function cancelOrder(orderId, requestingUser) {
  const order = await getOrderById(orderId, requestingUser);

  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, 'created', 'pending', 'paid'];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(`Cannot cancel order in "${order.status}" status.`, 400);
  }

  const { data: updated, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)
    .select()
    .single();

  if (error) {
    throw new AppError(`Failed to cancel order: ${error.message}`, 400);
  }

  return updated;
}

/**
 * Admin: Updates order status and dispatches status notifications
 */
async function updateOrderStatus(orderId, { status, trackingNumber, carrier }) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (status) updateData.status = status;
  if (trackingNumber) updateData.tracking_number = trackingNumber;
  if (carrier) updateData.carrier = carrier;

  if (status === ORDER_STATUS.PACKED || status === 'packed') updateData.packed_at = new Date().toISOString();
  if (status === ORDER_STATUS.SHIPPED || status === 'shipped') updateData.shipped_at = new Date().toISOString();
  if (status === ORDER_STATUS.DELIVERED || status === 'delivered') updateData.delivered_at = new Date().toISOString();

  let query = supabase.from('orders').update(updateData);
  if (isUuid) {
    query = query.eq('id', orderId);
  } else {
    query = query.or(`order_number.eq.${orderId},razorpay_order_id.eq.${orderId}`);
  }

  const { data: order, error } = await query.select().single();

  if (error || !order) {
    throw new AppError(`Order not found or update failed: ${error?.message}`, 404);
  }

  // Trigger status-specific emails & WhatsApp
  if (status === ORDER_STATUS.PACKED || status === 'packed') {
    sendOrderPackedNotification(order).catch((e) => console.warn('Packed email notice:', e.message));
    notifyWhatsAppOrderPacked(order).catch((e) => console.warn('Packed WhatsApp notice:', e.message));
  } else if (status === ORDER_STATUS.SHIPPED || status === 'shipped') {
    sendOrderShippedNotification(order).catch((e) => console.warn('Shipped email notice:', e.message));
    notifyWhatsAppOrderShipped(order).catch((e) => console.warn('Shipped WhatsApp notice:', e.message));
  } else if (status === ORDER_STATUS.DELIVERED || status === 'delivered') {
    sendOrderDeliveredNotification(order).catch((e) => console.warn('Delivered email notice:', e.message));
    notifyWhatsAppOrderDelivered(order).catch((e) => console.warn('Delivered WhatsApp notice:', e.message));
  }

  return order;
}

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
