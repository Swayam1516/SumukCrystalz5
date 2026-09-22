const paymentService = require('../services/paymentService');

/**
 * POST /api/payment/create-order (or /api/checkout/create-order)
 * Initializes official Razorpay Order for in-app Standard Checkout Popup
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
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/verify (or /api/checkout/verify)
 * Cryptographically verifies Razorpay payment signature and fulfills order
 */
async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      buyerName,
      buyerEmail,
      shippingAddress,
      items,
    } = req.body;

    const result = await paymentService.verifyAndFulfillPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      buyerName,
      buyerEmail,
      shippingAddress,
      items,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/webhook (or /api/checkout/webhook)
 * Verifies and handles server-to-server Razorpay webhooks
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

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
};

