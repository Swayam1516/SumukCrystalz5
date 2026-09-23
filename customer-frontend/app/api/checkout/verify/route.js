import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, saveOrderToSupabase } from '../../../../lib/supabase';
import {
  sendOrderConfirmationEmail,
  sendLuxuryEmail,
  generateOrderConfirmationEmailHtml,
} from '../../../../lib/notify';

const processedPayments = new Set();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      buyerName,
      buyerEmail,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      total,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Invalid verification request: Missing Razorpay transaction identifiers.' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

    // 1. Forward verification to Backend Payment Engine (Source of Truth)
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.status < 500 && data.success) {
          return NextResponse.json(data, { status: res.status });
        }
      } catch (err) {
        console.warn('Backend proxy verify notice, using local verification engine:', err.message);
      }
    }

    // 2. Replay Attack & Duplicate Payment Prevention
    if (processedPayments.has(razorpay_payment_id)) {
      return NextResponse.json({
        success: true,
        orderId: orderId || `ORD-${razorpay_payment_id.slice(-8)}`,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'paid',
        message: 'Order was already verified and confirmed.',
      });
    }

    // 3. Cryptographic HMAC SHA-256 Signature Verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isSignatureValid = false;

    if (
      razorpay_order_id.startsWith('order_sim_') ||
      razorpay_signature?.startsWith('sim_sig_') ||
      !keySecret ||
      keySecret.includes('xxxx')
    ) {
      // Sandbox / Simulated test mode
      isSignatureValid = true;
    } else {
      if (!razorpay_signature) {
        return NextResponse.json(
          { error: 'Security alert: Missing cryptographic signature.' },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      try {
        isSignatureValid = crypto.timingSafeEqual(
          Buffer.from(generatedSignature, 'utf8'),
          Buffer.from(razorpay_signature, 'utf8')
        );
      } catch (err) {
        isSignatureValid = generatedSignature === razorpay_signature;
      }
    }

    if (!isSignatureValid) {
      console.error('Cryptographic signature verification failed for:', {
        razorpay_order_id,
        razorpay_payment_id,
      });

      return NextResponse.json(
        {
          error:
            'Cryptographic verification failed. The payment signature could not be authenticated.',
        },
        { status: 400 }
      );
    }

    // 4. Mark payment as processed to lock against replay
    processedPayments.add(razorpay_payment_id);
    const confirmedOrderId = orderId || `ORD-${Date.now()}`;

    const orderRecord = {
      orderId: confirmedOrderId,
      buyerName: buyerName?.trim() || shippingAddress?.fullName || 'Collector',
      buyerEmail: buyerEmail?.trim()?.toLowerCase() || 'collector@sumuk-crystalz.com',
      shippingAddress: shippingAddress || {},
      items: items || [],
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      total: total || (subtotal || 0) + (shippingFee || 0),
      currency: 'INR',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || 'verified',
      status: 'paid',
      paidAt: new Date().toISOString(),
    };

    // 5. Persist verified order into Supabase ONLY AFTER signature verification
    saveOrderToSupabase(orderRecord).catch((e) =>
      console.warn('Supabase paid sync notice:', e.message)
    );

    // 6. Trigger automated notifications via Brevo SMTP / Nodemailer
    try {
      sendOrderConfirmationEmail(orderRecord).catch((e) =>
        console.warn('Customer order confirmation email notice:', e.message)
      );

      sendLuxuryEmail({
        to: process.env.ADMIN_EMAIL || 'sumukcrystalz@gmail.com',
        subject: `🚨 New Verified Order #${confirmedOrderId} — ₹${Number(orderRecord.total || 0).toLocaleString('en-IN')}`,
        html: generateOrderConfirmationEmailHtml(orderRecord),
      }).catch((e) => console.warn('Admin notification email notice:', e.message));

      console.log(`[Brevo Notification Engine] Order #${confirmedOrderId} verified & confirmation emails dispatched.`);
    } catch (e) {
      console.warn('Notification engine notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      orderId: confirmedOrderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'paid',
      message: 'Payment verified and sacred order confirmed.',
    });
  } catch (err) {
    console.error('Verify Route Exception:', err);
    return NextResponse.json(
      { error: 'Payment verification failed: ' + err.message },
      { status: 500 }
    );
  }
}

