const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
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
const { syncOrderToSupabase } = require('../utils/supabase');

/**
 * Retrieves orders placed by a specific authenticated user
 */
async function getUserOrders(userId, email) {
  const filter = {
    $or: [
      { user: userId },
      { buyerEmail: email?.toLowerCase().trim() },
    ],
  };

  return Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images slug');
}

/**
 * Retrieves a single order by ID with ownership verification
 */
async function getOrderById(orderId, requestingUser = null) {
  let order = null;

  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId).populate('items.product', 'name images slug description');
  }

  if (!order) {
    order = await Order.findOne({ razorpayOrderId: orderId }).populate('items.product', 'name images slug description');
  }

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Access check: allow admins or the matching customer
  if (requestingUser && requestingUser.role !== 'admin') {
    const isOwner =
      (order.user && order.user.toString() === requestingUser.id) ||
      order.buyerEmail?.toLowerCase() === requestingUser.email?.toLowerCase();

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

  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, 'created'];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(`Cannot cancel order in "${order.status}" status.`, 400);
  }

  order.status = ORDER_STATUS.CANCELLED;
  order.cancelledAt = new Date();
  await order.save();

  // Rollback product stock if it was previously deducted
  for (const item of order.items) {
    if (item.product) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: item.quantity } }
      ).catch(() => {});
    }
  }

  syncOrderToSupabase(order).catch(() => {});
  return order;
}

/**
 * Admin: Updates order status (confirmed -> packed -> shipped -> delivered) and dispatches status emails & WhatsApp
 */
async function updateOrderStatus(orderId, { status, trackingNumber, carrier }) {
  const validStatuses = Object.values(ORDER_STATUS);
  if (status && !validStatuses.includes(status)) {
    throw new AppError(`Invalid order status: ${status}`, 400);
  }

  const updateData = { updatedAt: new Date() };
  if (status) updateData.status = status;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (carrier) updateData.carrier = carrier;

  if (status === ORDER_STATUS.PACKED) updateData.packedAt = new Date();
  if (status === ORDER_STATUS.SHIPPED) updateData.shippedAt = new Date();
  if (status === ORDER_STATUS.DELIVERED) updateData.deliveredAt = new Date();

  const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Trigger status-specific emails & WhatsApp
  if (status === ORDER_STATUS.PACKED) {
    sendOrderPackedNotification(order).catch((e) => console.warn('Packed email notice:', e.message));
    notifyWhatsAppOrderPacked(order).catch((e) => console.warn('Packed WhatsApp notice:', e.message));
  } else if (status === ORDER_STATUS.SHIPPED) {
    sendOrderShippedNotification(order).catch((e) => console.warn('Shipped email notice:', e.message));
    notifyWhatsAppOrderShipped(order).catch((e) => console.warn('Shipped WhatsApp notice:', e.message));
  } else if (status === ORDER_STATUS.DELIVERED) {
    sendOrderDeliveredNotification(order).catch((e) => console.warn('Delivered email notice:', e.message));
    notifyWhatsAppOrderDelivered(order).catch((e) => console.warn('Delivered WhatsApp notice:', e.message));
  }

  syncOrderToSupabase(order).catch(() => {});
  return order;
}

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};

