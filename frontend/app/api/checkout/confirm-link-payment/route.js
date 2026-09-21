import { NextResponse } from 'next/server';
import { saveOrderToSupabase } from '../../../../lib/supabase';

const RAZORPAY_ME_HANDLE = process.env.NEXT_PUBLIC_RAZORPAY_ME_HANDLE || 'soumyaanaveenkumarkaradimath';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, utrNumber, paymentHandle, buyerName, buyerEmail, shippingAddress, items, subtotal, shippingFee, total } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const razorpayPaymentId = utrNumber ? `utr_${utrNumber}` : `rzp_link_${Date.now()}`;
    const razorpaySignature = `rzp_me_${paymentHandle || RAZORPAY_ME_HANDLE}`;

    saveOrderToSupabase({
      orderId,
      buyerName: buyerName || 'Collector',
      buyerEmail: buyerEmail || '',
      shippingAddress: shippingAddress || {},
      items: items || [],
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      total: total || 0,
      razorpayOrderId: `rzp_me_${Date.now()}`,
      razorpayPaymentId,
      status: 'paid',
    }).catch((e) => console.warn('Supabase link order sync notice:', e.message));

    return NextResponse.json({
      success: true,
      orderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
    });
  } catch (err) {
    console.error('Confirm link error:', err);
    return NextResponse.json({ error: 'Failed to confirm link payment: ' + err.message }, { status: 500 });
  }
}
