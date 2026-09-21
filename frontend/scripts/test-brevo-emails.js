/**
 * Test Script for Brevo SMTP and all 3 Luxury Email Templates
 */
crequire("dotenv").config();

const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST;
const BREVO_SMTP_PORT = Number(process.env.BREVO_SMTP_PORT || 587);
const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER;
const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_NAME = process.env.EMAIL_NAME || "Sumuk Crystalz";

const transporter = nodemailer.createTransport({
  host: BREVO_SMTP_HOST,
  port: BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log('--- 1. Testing Brevo SMTP Connection ---');

transporter.verify((error, success) => {
  if (error) {
    console.error('Brevo SMTP Connection Failed:', error.message);
  } else {
    console.log('✓ Brevo SMTP Server is Ready to Deliver Messages!');
    
    // Test sample order confirmation email
    const { generateOrderConfirmationEmailHtml, generateWelcomeEmailHtml, generateOrderShippedEmailHtml } = require('../../backend/utils/notify');
    
    const sampleOrder = {
      buyerName: 'Swayam Hiremath',
      buyerEmail: 'sumukcrystalz@gmail.com',
      orderId: 'SC1025',
      razorpayPaymentId: 'pay_RZP123456789',
      paidAt: new Date(),
      items: [
        { name: 'Amethyst Crystal Tower', quantity: 1, unitPrice: 9600, variantLabel: '8mm Regular' },
      ],
      subtotal: 9600,
      shippingFee: 0,
      total: 9600,
      shippingAddress: {
        fullName: 'Swayam Hiremath',
        line1: 'Indiranagar Sanctuary',
        city: 'Bagalkote',
        state: 'Karnataka',
        postalCode: '587101',
        country: 'India',
      },
    };

    console.log('--- 2. Verifying HTML Generation for All 3 Email Templates ---');
    const welcomeHtml = generateWelcomeEmailHtml({ customerName: 'Swayam Hiremath', customerEmail: 'sumukcrystalz@gmail.com' });
    const orderHtml = generateOrderConfirmationEmailHtml(sampleOrder);
    const shippedHtml = generateOrderShippedEmailHtml({
      customerName: 'Swayam Hiremath',
      buyerEmail: 'sumukcrystalz@gmail.com',
      orderId: 'SC1025',
      trackingId: 'BD-9948274910',
      courierName: 'Bluedart Express',
    });

    console.log('✓ Welcome Email HTML length:', welcomeHtml.length, 'bytes');
    console.log('✓ Order Confirmation Email HTML length:', orderHtml.length, 'bytes');
    console.log('✓ Order Shipped Email HTML length:', shippedHtml.length, 'bytes');

    console.log('\n--- 3. Dispatching Test Order Confirmation Email via Brevo SMTP ---');
    transporter.sendMail({
      from: `"${EMAIL_NAME}" <${EMAIL_FROM}>`,
      to: 'sumukcrystalz@gmail.com',
      subject: '✨ Your Sumuk Crystalz Order is Confirmed',
      html: orderHtml,
    }).then((info) => {
      console.log('✓ Test Email Successfully Sent via Brevo SMTP!');
      console.log('  Message ID:', info.messageId);
      console.log('  Accepted:', info.accepted);
      process.exit(0);
    }).catch((err) => {
      console.error('Email send failed:', err.message);
      process.exit(1);
    });
  }
});
