/**
 * WhatsApp Cloud API Integration Service (Meta Business Platform)
 * Dispatches automated transactional WhatsApp notifications using approved templates.
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';

/**
 * Dispatches a WhatsApp template message
 */
async function sendWhatsAppTemplateMessage({ to, templateName, components = [], languageCode = 'en' }) {
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_CLOUD_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(`ℹ️ [WhatsApp Service] Meta Cloud API credentials not active. Logged notification for ${to} (${templateName}).`);
    return { success: true, isSimulated: true, recipient: to, template: templateName };
  }

  // Format recipient: Ensure country code prefix without '+'
  const cleanPhone = to.replace(/\D/g, '').replace(/^0+/, '');
  const recipientPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    };

    const res = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✨ [WhatsApp Service] Template "${templateName}" sent to ${recipientPhone}`);
      return { success: true, isSimulated: false, messageId: data.messages?.[0]?.id };
    } else {
      console.warn('[WhatsApp Service Error]', data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error('[WhatsApp Exception]:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Order Confirmed WhatsApp
 */
async function notifyWhatsAppOrderConfirmed(order) {
  const buyerPhone = order.shippingAddress?.phone || order.buyerPhone;
  if (!buyerPhone) return;

  const orderId = order._id?.toString() || order.orderId || 'ORD';
  const total = Number(order.total || 0).toLocaleString('en-IN');

  return sendWhatsAppTemplateMessage({
    to: buyerPhone,
    templateName: process.env.WHATSAPP_TEMPLATE_ORDER_CONFIRMED || 'sumuk_order_confirmed',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: order.buyerName || 'Valued Collector' },
          { type: 'text', text: orderId },
          { type: 'text', text: `₹${total}` },
        ],
      },
    ],
  });
}

/**
 * 2. Order Packed WhatsApp
 */
async function notifyWhatsAppOrderPacked(order) {
  const buyerPhone = order.shippingAddress?.phone || order.buyerPhone;
  if (!buyerPhone) return;

  const orderId = order._id?.toString() || order.orderId;

  return sendWhatsAppTemplateMessage({
    to: buyerPhone,
    templateName: process.env.WHATSAPP_TEMPLATE_ORDER_PACKED || 'sumuk_order_packed',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: order.buyerName || 'Valued Collector' },
          { type: 'text', text: orderId },
        ],
      },
    ],
  });
}

/**
 * 3. Order Shipped with Tracking WhatsApp
 */
async function notifyWhatsAppOrderShipped(order) {
  const buyerPhone = order.shippingAddress?.phone || order.buyerPhone;
  if (!buyerPhone) return;

  const orderId = order._id?.toString() || order.orderId;
  const trackingNumber = order.trackingNumber || order.awb_code || 'In Transit';
  const carrier = order.carrier || 'Bluedart Express';

  return sendWhatsAppTemplateMessage({
    to: buyerPhone,
    templateName: process.env.WHATSAPP_TEMPLATE_ORDER_SHIPPED || 'sumuk_order_shipped',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: order.buyerName || 'Valued Collector' },
          { type: 'text', text: orderId },
          { type: 'text', text: carrier },
          { type: 'text', text: trackingNumber },
        ],
      },
    ],
  });
}

/**
 * 4. Order Delivered WhatsApp
 */
async function notifyWhatsAppOrderDelivered(order) {
  const buyerPhone = order.shippingAddress?.phone || order.buyerPhone;
  if (!buyerPhone) return;

  const orderId = order._id?.toString() || order.orderId;

  return sendWhatsAppTemplateMessage({
    to: buyerPhone,
    templateName: process.env.WHATSAPP_TEMPLATE_ORDER_DELIVERED || 'sumuk_order_delivered',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: order.buyerName || 'Valued Collector' },
          { type: 'text', text: orderId },
        ],
      },
    ],
  });
}

module.exports = {
  sendWhatsAppTemplateMessage,
  notifyWhatsAppOrderConfirmed,
  notifyWhatsAppOrderPacked,
  notifyWhatsAppOrderShipped,
  notifyWhatsAppOrderDelivered,
};
