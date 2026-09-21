const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmationNotification } = require('../services/emailService');
const { syncCustomerToSupabase, syncOrderToSupabase } = require('../utils/supabase');
const { ORDER_STATUS } = require('../utils/constants');

/**
 * POST /api/payment/create-order (or /api/checkout/create-order)
 */
async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, buyerName, buyerEmail } = req.body;
    const userId = req.user?.id;

    const result = await paymentService.createRazorpayOrder({
      items,
      shippingAddress,
      buyerName,
      buyerEmail,
      userId,
    });

    res.status(201).json({
      success: true,
      ...result,
      razorpayMeUrl: process.env.RAZORPAY_ME_URL || null,
      razorpayMeHandle: process.env.RAZORPAY_ME_HANDLE || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/verify (or /api/checkout/verify)
 */
async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const result = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/webhook (or /api/checkout/webhook)
 */
async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    // Strict raw buffer preservation for Razorpay HMAC verification
    const rawBuffer = req.rawBody
      ? req.rawBody
      : Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    const result = await paymentService.processWebhookEvent(rawBuffer, signature);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/confirm-link-payment (Direct Razorpay.me UPI fallback)
 */
async function confirmLinkPayment(req, res, next) {
  try {
    const { orderId, utrNumber, paymentHandle } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing orderId' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: { $ne: ORDER_STATUS.PAID } },
      {
        status: ORDER_STATUS.PAID,
        razorpayPaymentId: utrNumber ? `utr_${utrNumber}` : `rzp_link_${Date.now()}`,
        razorpaySignature: `rzp_me_${paymentHandle || 'verified'}`,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      const existing = await Order.findById(orderId);
      if (existing && existing.status === ORDER_STATUS.PAID) {
        return res.json({ success: true, orderId: existing._id, message: 'Order already reconciled' });
      }
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Atomic Stock Deduction
    for (const item of order.items) {
      if (item.product) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { totalStock: -item.quantity } }
        ).catch(() => {});
      }
    }

    syncOrderToSupabase(order).catch(() => {});
    sendOrderConfirmationNotification(order).catch(() => {});

    res.json({ success: true, orderId: order._id, status: ORDER_STATUS.PAID });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  confirmLinkPayment,
};
