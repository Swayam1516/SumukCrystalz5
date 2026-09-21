const crypto = require('crypto');

/**
 * Validates Razorpay client verification signature: HMAC_SHA256(orderId + "|" + paymentId, secret) === signature
 */
function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }

  const generated = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generated, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch (err) {
    return generated === signature;
  }
}

/**
 * Validates Razorpay server-to-server webhook signature: HMAC_SHA256(rawBodyBuffer, secret) === signature
 */
function verifyWebhookSignature(rawBodyBuffer, signature, secret) {
  if (!rawBodyBuffer || !signature || !secret) {
    return false;
  }

  const generated = crypto
    .createHmac('sha256', secret)
    .update(rawBodyBuffer)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generated, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch (err) {
    return generated === signature;
  }
}

module.exports = {
  verifyPaymentSignature,
  verifyWebhookSignature,
};
