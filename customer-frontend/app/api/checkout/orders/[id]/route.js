import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('orders')
      .select('*, order_items(*)');

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      query = query.or(`id.eq.${id},order_number.eq.${id}`);
    } else {
      query = query.or(`order_number.eq.${id},razorpay_order_id.eq.${id},razorpay_payment_id.eq.${id}`);
    }

    let { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Fallback query without join in case order_items table schema isn't cached
      const fallbackQuery = supabase
        .from('orders')
        .select('*');
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        fallbackQuery.or(`id.eq.${id},order_number.eq.${id}`);
      } else {
        fallbackQuery.or(`order_number.eq.${id},razorpay_order_id.eq.${id},razorpay_payment_id.eq.${id}`);
      }
      const fallbackRes = await fallbackQuery.maybeSingle();
      if (!fallbackRes.error && fallbackRes.data) {
        data = fallbackRes.data;
        error = null;
      }
    }

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found in registry' }, { status: 404 });
    }

    if ((!data.items || data.items.length === 0) && data.order_items?.length > 0) {
      data.items = data.order_items.map((it) => ({
        ...it,
        name: it.product_name || it.name,
        price: it.price,
        unitPrice: it.price,
        quantity: it.quantity,
        image: it.product_image || it.image,
      }));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Fetch order error:', err);
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}
