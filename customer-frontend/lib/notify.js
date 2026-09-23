import nodemailer from 'nodemailer';

// Initialize Nodemailer Transport with Brevo SMTP
function createEmailTransporter() {
  const host = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.EMAIL_USER || process.env.BREVO_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.BREVO_SMTP_PASS || process.env.SMTP_PASS;

  if (!user || !pass || pass === 'mock_pass') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'mock@ethereal.email', pass: 'mock_pass' },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // 587 uses STARTTLS
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const mailTransport = createEmailTransporter();
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'sumukcrystalz5@gmail.com';
const EMAIL_FROM_NAME = process.env.EMAIL_NAME || 'Sumuk Crystalz 5';
const EMAIL_SENDER = `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`;

/**
 * Shared Luxury Header
 */
function getLuxuryEmailHeader() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="padding-bottom: 20px; border-bottom: 1px solid rgba(212,175,55,0.25);">
      <tr>
        <td align="left" style="vertical-align: middle;">
          <div style="font-family: 'Cinzel', Georgia, serif; font-size: 18px; font-weight: bold; color: #D4AF37; letter-spacing: 1px; text-transform: uppercase;">
            SUMUK CRYSTALZ 5
          </div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #D4AF37; opacity: 0.9; margin-top: 3px;">
            Luxury Crystals &amp; Spiritual Elegance &bull; Soumyaa Naveen
          </div>
        </td>
        <td align="right" style="vertical-align: middle;">
          <span style="font-size: 22px; color: #D4AF37;">💎</span>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Shared Luxury Footer
 */
function getLuxuryEmailFooter() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(212,175,55,0.2); text-align: center;">
      <tr>
        <td align="center">
          <p style="margin: 0 0 8px; font-size: 12px; color: #C5BBAF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Sanctuary &amp; Office: Sus Gaon, Pune, Maharashtra &bull; Need help? Contact us anytime.
          </p>
          <p style="margin: 0 0 14px; font-size: 12px; color: #D4AF37; font-family: monospace;">
            ✉ <a href="mailto:sumukcrystalz5@gmail.com" style="color: #D4AF37; text-decoration: none;">sumukcrystalz5@gmail.com</a> &nbsp;&bull;&nbsp; 
            📞 +91 91117 16355 &nbsp;&bull;&nbsp; 
            📷 <a href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn" style="color: #D4AF37; text-decoration: none;">@sumukcrystalz5</a>
          </p>
          <p style="margin: 0; font-size: 11px; color: #777777; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            &copy; 2026 Sumuk Crystalz 5 &bull; Consecrated by Soumyaa Naveen.
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Base Email Wrapper
 */
function wrapEmailTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sumuk Crystalz</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050408; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E5E0D8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050408; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #0B0B0B; border: 1px solid rgba(212,175,55,0.35); border-radius: 16px; padding: 30px 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.9);">
          <tr>
            <td>
              ${getLuxuryEmailHeader()}
              ${content}
              ${getLuxuryEmailFooter()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * EMAIL 1: Welcome Email (New User Registration)
 */
export function generateWelcomeEmailHtml(data) {
  const customerName = data.customerName || data.fullName || data.name || 'Valued Patron';
  const customerEmail = data.customerEmail || data.email;
  const username = data.username || customerEmail?.split('@')[0] || customerName;
  const registrationDate =
    data.registrationDate ||
    new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const content = `
    <!-- Title -->
    <div style="padding: 24px 0 16px;">
      <h2 style="margin: 0 0 8px; font-family: 'Cinzel', Georgia, serif; font-size: 20px; font-weight: bold; color: #FFFFFF;">
        ✨ Welcome to Sumuk Crystalz 5
      </h2>
      <p style="margin: 0; font-size: 13px; color: #C5BBAF; line-height: 1.6;">
        Hi <strong style="color: #FFFFFF;">${customerName}</strong>, thank you for joining Sumuk Crystalz 5. We are honored to welcome you into our inner circle of metaphysical crystal collectors and spiritual practitioners guided by Soumyaa Naveen.
      </p>
    </div>

    <!-- Account Details Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Customer Name</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #FFFFFF; font-family: monospace;">${customerName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Registered Email</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #D4AF37; font-family: monospace;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Username</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #FFFFFF; font-family: monospace;">${username}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Registration Date</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; color: #C5BBAF; font-family: monospace;">${registrationDate}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Membership Status</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #34D399; font-family: monospace;">🟢 Active Patron</td>
      </tr>
    </table>

    <!-- Important Notice Card -->
    <div style="background-color: #14130E; border: 1px solid #D4AF37; border-radius: 14px; padding: 18px; margin-bottom: 24px; text-align: center;">
      <div style="font-family: 'Cinzel', Georgia, serif; font-size: 14px; font-weight: bold; color: #D4AF37; margin-bottom: 8px;">
        ✦ Important Security Notice ✦
      </div>
      <p style="margin: 0; font-size: 12px; color: #E5E0D8; line-height: 1.6;">
        Please remember your registered email and password carefully. For security reasons, your current system does not allow password changes, so keep your credentials safe.
      </p>
    </div>

    <!-- Login CTA Button -->
    <div style="text-align: center; padding: 10px 0 20px;">
      <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/shop" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #E8C97C 50%, #B8860B 100%); color: #0B0B0B; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 32px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 20px rgba(212,175,55,0.4);">
        Login to Your Account
      </a>
    </div>

    <!-- Spiritual Guarantee Message -->
    <div style="background-color: #161616; border: 1px solid #222222; border-radius: 12px; padding: 14px; text-align: center; font-size: 12px; color: #C5BBAF; line-height: 1.5;">
      Every crystal specimen in our treasury is 100% natural, lab-certified, and attuned with 528Hz Solfeggio sound bowls by Soumyaa Naveen for maximum pranic energy.
    </div>
  `;

  return wrapEmailTemplate(content);
}

/**
 * EMAIL 2: Order Confirmation Email
 */
export function generateOrderConfirmationEmailHtml(order) {
  const customerName = order.buyerName || order.shippingAddress?.fullName || 'Valued Collector';
  const orderId = order.orderId || order._id || 'SC1025';
  const paymentId = order.razorpayPaymentId || 'pay_RZP123456789';
  const orderDate = new Date(order.paidAt || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subtotal = Number(order.subtotal || order.total || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const total = Number(order.total || subtotal + shippingFee);
  const shipping = order.shippingAddress || {};

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161616; border: 1px solid #222222; border-radius: 12px; padding: 12px; margin-bottom: 8px;">
        <tr>
          <td width="60" style="vertical-align: middle;">
            <div style="width: 50px; height: 50px; background-color: #222222; border-radius: 8px; border: 1px solid rgba(212,175,55,0.3); text-align: center; line-height: 50px; font-size: 22px;">
              🔮
            </div>
          </td>
          <td style="vertical-align: middle; padding-left: 12px;">
            <div style="font-size: 13px; font-weight: bold; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              ${item.name}
            </div>
            <div style="font-size: 11px; color: #888888; margin-top: 2px; font-family: monospace;">
              Qty: ${item.quantity || 1} ${item.variantLabel ? `&bull; ${item.variantLabel}` : ''}
            </div>
          </td>
          <td align="right" style="vertical-align: middle; font-size: 14px; font-weight: bold; color: #D4AF37; font-family: monospace;">
            ₹${Number((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
          </td>
        </tr>
      </table>
    `
    )
    .join('');

  const content = `
    <!-- Header Title -->
    <div style="padding: 20px 0 16px;">
      <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        ✨ Your Order Has Been Confirmed
      </h2>
      <p style="margin: 0; font-size: 13px; color: #C5BBAF; line-height: 1.5;">
        Hi <strong style="color: #FFFFFF;">${customerName}</strong>, thank you for choosing Sumuk Crystalz 5. Your payment has been successfully verified and your order is now confirmed.
      </p>
    </div>

    <!-- Order Metadata Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 14px 18px; margin-bottom: 22px;">
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Order ID</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #FFFFFF; font-family: monospace;">${orderId}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Payment ID</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #FFFFFF; font-family: monospace;">${paymentId}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Order Date</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; color: #FFFFFF; font-family: monospace;">${orderDate}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Status</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #34D399; font-family: monospace;">🟢 Confirmed</td>
      </tr>
    </table>

    <!-- Your Items Section -->
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: #D4AF37; margin-bottom: 8px;">
      Your Items
    </div>
    ${itemsHtml || '<p style="font-size:12px; color:#888;">Sacred Consecrated Specimen</p>'}

    <!-- Delivery Details Section -->
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: #D4AF37; margin: 18px 0 8px;">
      Delivery Details
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161616; border: 1px solid #222222; border-radius: 12px; padding: 14px 18px; margin-bottom: 22px;">
      <tr>
        <td style="font-size: 13px; color: #E5E0D8; line-height: 1.6;">
          <strong style="color: #FFFFFF; font-size: 13px;">${shipping.fullName || customerName}</strong><br/>
          ${shipping.line1 || 'Sanctuary Address'} ${shipping.line2 || ''}<br/>
          ${shipping.city || 'Pune'}, ${shipping.state || 'Maharashtra'} ${shipping.postalCode || ''}<br/>
          ${shipping.country || 'India'}<br/>
          <span style="color: #C5BBAF; font-size: 12px; display: inline-block; margin-top: 4px;">
            Estimated Delivery: 3–5 Business Days
          </span>
        </td>
      </tr>
    </table>

    <!-- Payment Summary Section -->
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: #D4AF37; margin: 18px 0 8px;">
      Payment Summary
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161616; border: 1px solid #222222; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 4px 0; font-size: 12px; color: #C5BBAF;">Subtotal</td>
        <td align="right" style="padding: 4px 0; font-size: 12px; color: #FFFFFF; font-family: monospace;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-size: 12px; color: #C5BBAF;">Shipping</td>
        <td align="right" style="padding: 4px 0; font-size: 12px; color: #34D399; font-family: monospace;">${shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-size: 12px; color: #C5BBAF;">GST</td>
        <td align="right" style="padding: 4px 0; font-size: 12px; color: #FFFFFF; font-family: monospace;">Included</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px 0 4px; border-top: 1px solid rgba(212,175,55,0.25);">
          <table width="100%">
            <tr>
              <td style="font-size: 14px; font-weight: bold; color: #FFFFFF;">Total Paid</td>
              <td align="right" style="font-size: 16px; font-weight: bold; color: #D4AF37; font-family: monospace;">₹${Number(total).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Thank You Action Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #14130E; border: 1px solid #D4AF37; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 15px;">
      <tr>
        <td align="center">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; color: #D4AF37; margin-bottom: 6px;">
            Thank You for Shopping With Us
          </div>
          <p style="margin: 0 0 16px; font-size: 12px; color: #E5E0D8; line-height: 1.5; max-width: 480px;">
            Every crystal is carefully selected and packed with care. We appreciate your trust in Sumuk Crystalz 5.
          </p>

          <!-- Buttons -->
          <div>
            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/order-success/${orderId}" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-weight: bold; font-size: 12px; text-decoration: none; padding: 10px 24px; border-radius: 999px; margin-right: 8px; margin-bottom: 8px;">
              Track My Order
            </a>
            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/order-success/${orderId}" style="display: inline-block; background-color: #1E1B15; border: 1px solid #444444; color: #FFFFFF; font-weight: bold; font-size: 12px; text-decoration: none; padding: 10px 24px; border-radius: 999px; margin-bottom: 8px;">
              Download Invoice
            </a>
          </div>
        </td>
      </tr>
    </table>
  `;

  return wrapEmailTemplate(content);
}

/**
 * EMAIL 3: Order Shipped Email
 */
export function generateOrderShippedEmailHtml(data) {
  const customerName = data.customerName || data.buyerName || 'Valued Collector';
  const orderId = data.orderId || 'SC1025';
  const trackingId = data.trackingId || data.trackingNumber || 'BD-9948274910';
  const courierName = data.courierName || data.carrier || 'Bluedart Express / Delhivery';
  const dispatchDate =
    data.dispatchDate ||
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const deliveryDate = data.deliveryDate || '2–4 Business Days';
  const trackingUrl =
    data.trackingUrl ||
    `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/order-success/${orderId}`;

  const content = `
    <!-- Header Title -->
    <div style="padding: 20px 0 16px;">
      <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        🚚 Your Sumuk Crystalz 5 Order Has Been Shipped
      </h2>
      <p style="margin: 0; font-size: 13px; color: #C5BBAF; line-height: 1.5;">
        Great news, <strong style="color: #FFFFFF;">${customerName}</strong>! Your crystals are now on their way.
      </p>
    </div>

    <!-- Shipment Metadata Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 14px 18px; margin-bottom: 22px;">
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Order ID</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #FFFFFF; font-family: monospace;">${orderId}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Courier Partner</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #D4AF37; font-family: monospace;">${courierName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Dispatch Date</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; color: #FFFFFF; font-family: monospace;">${dispatchDate}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Estimated Arrival</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #34D399; font-family: monospace;">${deliveryDate}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-size: 12px; color: #9E9589; font-family: monospace;">Status</td>
        <td align="right" style="padding: 5px 0; font-size: 12px; font-weight: bold; color: #60A5FA; font-family: monospace;">🚚 Dispatched / In Transit</td>
      </tr>
    </table>

    <!-- Prominent Gold Bordered Reference ID Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #14130E; border: 2px solid #D4AF37; border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 24px;">
      <tr>
        <td align="center">
          <div style="font-size: 11px; font-family: monospace; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">
            ✦ TRACKING / REFERENCE ID ✦
          </div>
          <div style="font-size: 22px; font-weight: bold; color: #FFFFFF; letter-spacing: 3px; font-family: monospace; margin: 12px 0 14px; background-color: #000000; display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px solid rgba(212,175,55,0.4);">
            ${trackingId}
          </div>
          <p style="margin: 0 0 16px; font-size: 12px; color: #C5BBAF;">
            Use the reference ID above to track your shipment with the courier partner.
          </p>
          <div>
            <a href="${trackingUrl}" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 28px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px;">
              Track Your Order
            </a>
          </div>
        </td>
      </tr>
    </table>

    <!-- Protection Message -->
    <div style="background-color: #161616; border: 1px solid #222222; border-radius: 12px; padding: 14px; text-align: center; font-size: 12px; color: #C5BBAF; line-height: 1.5; margin-bottom: 10px;">
      Your order has left our dispatch station and is carefully making its way to you in tamper-evident armored packaging. Thank you for trusting Sumuk Crystalz 5.
    </div>
  `;

  return wrapEmailTemplate(content);
}

/**
 * Dispatch Email with Brevo SMTP / Nodemailer
 */
export async function sendLuxuryEmail({ to, subject, html }) {
  try {
    const info = await mailTransport.sendMail({
      from: EMAIL_SENDER,
      to,
      subject,
      html,
    });
    console.log(`[Brevo SMTP] Email delivered to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Brevo SMTP Error] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Trigger Welcome Email
 */
export async function sendWelcomeEmail(userData) {
  const html = generateWelcomeEmailHtml(userData);
  return sendLuxuryEmail({
    to: userData.email || userData.customerEmail,
    subject: '✨ Welcome to Sumuk Crystalz 5 – Your Journey Begins',
    html,
  });
}

/**
 * Trigger Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(order) {
  const html = generateOrderConfirmationEmailHtml(order);
  return sendLuxuryEmail({
    to: order.buyerEmail || order.shippingAddress?.email,
    subject: '✨ Your Sumuk Crystalz 5 Order is Confirmed',
    html,
  });
}

/**
 * Password Reset Email Template (Luxury Crystal Theme)
 */
export function generatePasswordResetEmailHtml({ customerName, resetLink }) {
  const content = `
    <!-- Header Notice -->
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="font-size: 32px; margin-bottom: 8px;">🔑</div>
      <h1 style="font-family: 'Cinzel', Georgia, serif; font-size: 24px; color: #FFFFFF; margin: 0 0 8px; letter-spacing: 1px;">
        Reset Your Password
      </h1>
      <div style="font-size: 11px; font-family: monospace; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">
        ✦ SACRED SANCTUARY SECURITY ✦
      </div>
    </div>

    <!-- Message -->
    <div style="background-color: #121016; border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 22px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 12px; font-size: 14px; color: #FFFFFF; font-weight: 600;">
        Hello, ${customerName || 'Valued Patron'}
      </p>
      <p style="margin: 0 0 20px; font-size: 13px; color: #C5BBAF; line-height: 1.6;">
        We received a request to reset the password for your Sumuk Crystalz account. Click the secure button below to create your new password:
      </p>
      <div style="margin: 20px 0;">
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #AA820A 100%); color: #07050A; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 36px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 25px rgba(212,175,55,0.35);">
          Reset My Password →
        </a>
      </div>
      <p style="margin: 20px 0 0; font-size: 11px; color: #8C827A; line-height: 1.4;">
        This secure link will expire in 60 minutes. If you did not request a password reset, you can safely ignore this email — your account remains completely secure.
      </p>
    </div>
  `;

  return wrapEmailTemplate(content);
}

/**
 * Trigger Password Reset Email
 */
export async function sendPasswordResetEmail({ toEmail, customerName, resetLink }) {
  const html = generatePasswordResetEmailHtml({ customerName, resetLink });
  return sendLuxuryEmail({
    to: toEmail,
    subject: '🔑 Reset Your Sumuk Crystalz Password',
    html,
  });
}

/**
 * Trigger Order Shipped Email
 */
export async function sendOrderShippedEmail(data) {
  const html = generateOrderShippedEmailHtml(data);
  return sendLuxuryEmail({
    to: data.buyerEmail || data.email,
    subject: '🚚 Your Sumuk Crystalz 5 Order Has Been Shipped',
    html,
  });
}

/**
 * WhatsApp Formatters
 */
export function formatCustomerWhatsAppMessage(order) {
  return (
    `✦ *SUMUK CRYSTALZ 5 — ORDER CONFIRMED* ✦\n\n` +
    `Dear ${order.buyerName || 'Collector'},\n` +
    `Your sacred payment of *₹${Number(order.total || 0).toLocaleString('en-IN')}* has been successfully verified!\n\n` +
    `📦 *Order ID:* ${order.orderId || order._id}\n` +
    `💳 *Payment ID:* ${order.razorpayPaymentId || 'Verified'}\n\n` +
    `✨ *Acquired Specimens:*\n` +
    (order.items || []).map((i) => `• ${i.name} (x${i.quantity})`).join('\n') +
    `\n\n🔮 *Next Step:* Your specimens are now entering the 528Hz Vedic sound attunement by Soumyaa Naveen & insured armored boxing.\n\n` +
    `Thank you for honoring the sacred gemstone tradition with Sumuk Crystalz 5.`
  );
}

export function formatAdminWhatsAppMessage(order) {
  return (
    `🚨 *NEW SACRED ORDER RECEIVED — SUMUK CRYSTALZ 5* 🚨\n\n` +
    `*Order #:* ${order.orderId || order._id}\n` +
    `*Collector:* ${order.buyerName} (${order.buyerEmail})\n` +
    `*Phone:* ${order.shippingAddress?.phone || 'N/A'}\n` +
    `*City:* ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}\n` +
    `*Amount Paid:* ₹${Number(order.total || 0).toLocaleString('en-IN')}\n` +
    `*Payment Gateway Ref:* ${order.razorpayPaymentId || 'Direct UPI'}\n\n` +
    `*Items:*\n` +
    (order.items || []).map((i) => `• ${i.name} x${i.quantity}`).join('\n')
  );
}
