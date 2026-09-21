const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

function createTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    // Development fallback without hardcoded secrets
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: '', pass: '' },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

const transporter = createTransporter();
const fromAddress = process.env.EMAIL_FROM || 'orders@sumuk-crystalz.com';
const fromName = process.env.EMAIL_NAME || 'Sumuk Crystalz';
const adminEmail = process.env.ADMIN_EMAIL || 'sumukcrystalz@gmail.com';

/**
 * Loads an HTML template from backend/templates/ and substitutes {{variable}} placeholders
 */
function renderTemplate(templateName, variables = {}) {
  const templatePath = path.resolve(__dirname, '..', 'templates', templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Email template not found: ${templateName}`);
  }
  let html = fs.readFileSync(templatePath, 'utf8');

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value !== undefined && value !== null ? String(value) : '');
  }

  return html;
}

/**
 * Dispatches Welcome Email to newly registered user
 */
async function sendWelcomeEmail({ to, customerName, storefrontUrl }) {
  const html = renderTemplate('welcome.html', {
    customer_name: customerName || 'Valued Patron',
    customer_email: to,
    storefront_url: storefrontUrl || process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app',
  });

  return transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject: '✨ Welcome to Sumuk Crystalz – Sacred Sanctuary',
    html,
  });
}

/**
 * Dispatches Order Confirmation Email upon verified payment
 */
async function sendOrderConfirmationEmail({
  to,
  orderId,
  customerName,
  paymentId,
  orderDate,
  itemsTable,
  subtotal,
  shippingFee,
  totalAmount,
  shippingAddress,
  trackingUrl,
}) {
  const html = renderTemplate('order-confirmation.html', {
    order_id: orderId,
    customer_name: customerName || 'Valued Collector',
    payment_id: paymentId || 'Verified',
    order_date:
      orderDate ||
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    items_table: itemsTable || '',
    subtotal: subtotal || '0',
    shipping_fee: shippingFee || 'Complimentary (₹0)',
    total_amount: totalAmount || '0',
    shipping_address: shippingAddress || '',
    order_tracking_url:
      trackingUrl ||
      `${process.env.FRONTEND_URL || 'https://sumukcrystalz.vercel.app'}/order-success/${orderId}`,
  });

  return transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject: `✨ Order Confirmation #${orderId} — Sumuk Crystalz`,
    html,
  });
}

module.exports = {
  transporter,
  fromAddress,
  fromName,
  adminEmail,
  renderTemplate,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
};


