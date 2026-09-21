import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabase';

const processedEvents = new Set();

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing webhook signature or RAZORPAY_WEBHOOK_SECRET' }, { status: 400 });
    }

    if (!webhookSecret.includes('mock')) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isSigValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(signature, 'utf8')
      );

      if (!isSigValid) {
        console.error('[Razorpay Webhook] Signature mismatch detected');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || `${payload.event}_${Date.now()}`;

    if (processedEvents.has(eventId)) {
      return NextResponse.json({ status: 'already_processed' });
    }
    processedEvents.add(eventId);

    const event = payload.event;
    console.log(`[Razorpay Webhook] Authenticated event received: ${event}`);

    switch (event) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity;
        const razorpayOrderId = payment?.order_id;
        const razorpayPaymentId = payment?.id;

        if (razorpayOrderId) {
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              razorpay_payment_id: razorpayPaymentId,
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpayOrderId);
          console.log(`[Razorpay Webhook] Marked order ${razorpayOrderId} as paid.`);
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity;
        const razorpayOrderId = payment?.order_id;

        if (razorpayOrderId) {
          await supabase
            .from('orders')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpayOrderId);
          console.log(`[Razorpay Webhook] Payment failed for order ${razorpayOrderId}`);
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = payload.payload?.order?.entity;
        if (orderEntity?.id) {
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderEntity.id);
        }
        break;
      }

      case 'refund.processed': {
        const refund = payload.payload?.refund?.entity;
        const paymentId = refund?.payment_id;

        if (paymentId) {
          await supabase
            .from('orders')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_payment_id', paymentId);
          console.log(`[Razorpay Webhook] Processed refund for payment ${paymentId}`);
        }
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed: ' + err.message }, { status: 500 });
  }
}
