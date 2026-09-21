import { NextResponse } from 'next/server';
import { getSupabaseOrders, supabase } from '../../../../lib/supabase';
import { sendOrderShippedEmail } from '../../../../lib/notify';
import { verifyAdminAuth } from '../../../../lib/auth-middleware';

export async function GET(request) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const orders = await getSupabaseOrders();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders: ' + err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { orderId, status, trackingNumber, trackingId, carrier, courierName, buyerEmail, buyerName, deliveryDate } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const refTrackingId = trackingNumber || trackingId;
    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (refTrackingId) updatePayload.tracking_number = refTrackingId;
    if (carrier || courierName) updatePayload.carrier = carrier || courierName;

    let targetEmail = buyerEmail;
    let targetName = buyerName;

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('order_number', orderId)
      .select();

    if (data && data.length > 0) {
      targetEmail = targetEmail || data[0].buyer_email;
      targetName = targetName || data[0].buyer_name;
    }

    if (refTrackingId || status === 'shipped') {
      if (targetEmail) {
        sendOrderShippedEmail({
          buyerEmail: targetEmail,
          customerName: targetName || 'Valued Collector',
          orderId,
          trackingId: refTrackingId || 'BD-9948274910',
          courierName: carrier || courierName || 'Bluedart Express / Delhivery Secure',
          dispatchDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          deliveryDate: deliveryDate || '2–4 Business Days',
        }).catch((e) => console.warn('Order shipped email error:', e.message));

        console.log(`[Brevo SMTP] Order Shipped Email triggered for ${targetEmail} (Tracking: ${refTrackingId})`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated and shipping notification triggered.',
      updated: data,
    });
  } catch (err) {
    console.error('Admin update order error:', err);
    return NextResponse.json({ error: 'Failed to update order: ' + err.message }, { status: 500 });
  }
}
