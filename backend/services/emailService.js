const fs = require('fs');
const path = require('path');
const { transporter, fromAddress, fromName, adminEmail } = require('../config/mailer');

/**
 * Reads an HTML template and substitutes placeholders formatted like {{variable_name}}
 */
function renderTemplate(templateName, variables = {}) {
  const templatePath = path.resolve(__dirname, '..', 'templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf8');

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value !== undefined && value !== null ? String(value) : '');
  }

  return html;
}

/**
 * Formats an array of order items into a luxury HTML table snippet
 */
function formatItemsTable(items = []) {
  if (!items.length) {
    return '<p style="font-size: 12px; color: #888;">Sacred Crystal Specimen</p>';
  }

  return items
    .map(
      (item) => `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161522; border: 1px solid rgba(212,175,55,0.2); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px;">
        <tr>
          <td width="42" style="vertical-align: middle;">
            <div style="width: 36px; height: 36px; background-color: #222030; border-radius: 8px; border: 1px solid rgba(212,175,55,0.3); text-align: center; line-height: 36px; font-size: 18px;">
              🔮
            </div>
          </td>
          <td style="vertical-align: middle; padding-left: 10px;">
            <div style="font-size: 13px; font-weight: bold; color: #FFFFFF;">
              ${item.name || 'Consecrated Crystal'}
            </div>
            <div style="font-size: 11px; color: #8E877D; margin-top: 2px; font-family: monospace;">
              Qty: ${item.quantity || 1} ${item.variantLabel ? `&bull; ${item.variantLabel}` : ''}
            </div>
          </td>
          <td align="right" style="vertical-align: middle; font-size: 13px; font-weight: bold; color: #D4AF37; font-family: monospace;">
            ₹${Number((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
          </td>
        </tr>
      </table>
    `
    )
    .join('');
}

/**
 * Base email dispatcher with non-blocking error containment
 */
async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Delivered "${subject}" to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches Welcome Email upon customer registration
 */
async function sendWelcomeNotification(user) {
  const customerName = user.name || user.fullName || 'Valued Patron';
  const customerEmail = user.email;

  const html = renderTemplate('welcome.html', {
    customer_name: customerName,
    customer_email: customerEmail,
    storefront_url: process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app',
  });

  return sendEmail({
    to: customerEmail,
    subject: '✨ Welcome to Sumuk Crystalz – Sacred Sanctuary',
    html,
  });
}

/**
 * Dispatches Order Confirmation Email upon verified payment
 */
async function sendOrderConfirmationNotification(order) {
  const customerName = order.buyerName || order.shippingAddress?.fullName || 'Valued Collector';
  const customerEmail = order.buyerEmail;
  const orderId = order._id?.toString() || order.orderId || 'ORD';
  const subtotal = Number(order.subtotal || order.total || 0);
  const shippingFeeNum = Number(order.shippingFee || 0);
  const shippingFeeStr = shippingFeeNum === 0 ? 'Complimentary (₹0)' : `₹${shippingFeeNum}`;
  const total = Number(order.total || subtotal + shippingFeeNum);
  const shipping = order.shippingAddress || {};
  const shippingAddressStr = `${shipping.line1 || ''} ${shipping.line2 || ''}, ${shipping.city || ''}, ${shipping.state || ''} ${shipping.postalCode || ''}, ${shipping.country || 'India'}`;

  const html = renderTemplate('order-confirmation.html', {
    order_id: orderId,
    customer_name: customerName,
    payment_id: order.razorpayPaymentId || 'Verified',
    order_date: new Date(order.paidAt || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    items_table: formatItemsTable(order.items),
    subtotal: subtotal.toLocaleString('en-IN'),
    shipping_fee: shippingFeeStr,
    total_amount: total.toLocaleString('en-IN'),
    shipping_address: shippingAddressStr,
    order_tracking_url: `${process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app'}/order-success/${orderId}`,
  });

  // 1. Send to Buyer
  const buyerPromise = sendEmail({
    to: customerEmail,
    subject: `✨ Order Confirmation #${orderId} — Sumuk Crystalz`,
    html,
  });

  // 2. Send Alert to Admin
  const adminPromise = sendEmail({
    to: adminEmail,
    subject: `🚨 New Verified Order #${orderId} (₹${total.toLocaleString('en-IN')})`,
    html,
  });

  return Promise.allSettled([buyerPromise, adminPromise]);
}

/**
 * Dispatches Order Packed Email
 */
async function sendOrderPackedNotification(order) {
  const customerName = order.buyerName || order.shippingAddress?.fullName || 'Valued Collector';
  const orderId = order._id?.toString() || order.orderId;

  const html = renderTemplate('order-packed.html', {
    order_id: orderId,
    customer_name: customerName,
    order_tracking_url: `${process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app'}/order-success/${orderId}`,
  });

  return sendEmail({
    to: order.buyerEmail,
    subject: `📦 Your Order #${orderId} is Packed & Consecrated`,
    html,
  });
}

/**
 * Dispatches Order Shipped Email with Tracking & Carrier details
 */
async function sendOrderShippedNotification(order) {
  const customerName = order.buyerName || order.shippingAddress?.fullName || 'Valued Collector';
  const orderId = order._id?.toString() || order.orderId;
  const carrier = order.carrier || 'Bluedart Armored Logistics';
  const trackingNumber = order.trackingNumber || order.awb_code || 'In Transit';

  const html = renderTemplate('order-shipped.html', {
    order_id: orderId,
    customer_name: customerName,
    carrier,
    tracking_number: trackingNumber,
    estimated_delivery: '3–4 Business Days',
    order_tracking_url: `${process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app'}/order-success/${orderId}`,
  });

  return sendEmail({
    to: order.buyerEmail,
    subject: `🚚 Your Order #${orderId} Has Been Dispatched`,
    html,
  });
}

/**
 * Dispatches Order Delivered Email & Review Invitation
 */
async function sendOrderDeliveredNotification(order) {
  const customerName = order.buyerName || order.shippingAddress?.fullName || 'Valued Collector';
  const orderId = order._id?.toString() || order.orderId;

  const html = renderTemplate('order-delivered.html', {
    order_id: orderId,
    customer_name: customerName,
    review_url: `${process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app'}/shop`,
  });

  return sendEmail({
    to: order.buyerEmail,
    subject: `✨ Your Sumuk Crystalz Order #${orderId} Has Been Delivered`,
    html,
  });
}

module.exports = {
  renderTemplate,
  formatItemsTable,
  sendEmail,
  sendWelcomeNotification,
  sendOrderConfirmationNotification,
  sendOrderPackedNotification,
  sendOrderShippedNotification,
  sendOrderDeliveredNotification,
};

