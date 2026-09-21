const paymentService = require('../services/paymentService');
const { supabase } = require('../utils/supabase');

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

    const result = await paymentService.verifyAndFulfillPayment({
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

    let updatedOrder = null;
    if (supabase) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      let query = supabase.from('orders').update({
        status: 'paid',
        razorpay_payment_id: utrNumber ? `utr_${utrNumber}` : `rzp_link_${Date.now()}`,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (isUuid) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('order_number', orderId);
      }

      const { data } = await query.select().single();
      updatedOrder = data;
    }

    res.json({
      success: true,
      orderId: updatedOrder?.order_number || orderId,
      status: 'paid',
    });
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
