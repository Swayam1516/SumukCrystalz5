import { NextResponse } from 'next/server';
import { saveCustomerToSupabase, saveOrderToSupabase } from '../../../../lib/supabase';

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_ME_URL =
  process.env.NEXT_PUBLIC_RAZORPAY_ME_URL ||
  'https://razorpay.me/@soumyaanaveenkumarkaradimath';
const RAZORPAY_ME_HANDLE =
  process.env.NEXT_PUBLIC_RAZORPAY_ME_HANDLE || 'soumyaanaveenkumarkaradimath';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, buyerName, buyerEmail } = body;

    // Strict input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty. Please select crystals.' }, { status: 400 });
    }

    if (
      !buyerName?.trim() ||
      !buyerEmail?.trim() ||
      !shippingAddress?.line1?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.state?.trim() ||
      !shippingAddress?.postalCode?.trim() ||
      !shippingAddress?.phone?.trim()
    ) {
      return NextResponse.json(
        { error: 'All delivery address fields marked with * are required.' },
        { status: 400 }
      );
    }

    // Strict price computation & item consolidation
    let subtotal = 0;
    const orderItems = items.map((line) => {
      const unitPrice = Math.max(1, Number(line.unitPrice || line.price) || 699);
      const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
      subtotal += unitPrice * qty;

      return {
        productId: String(line.productId || line.id || `item_${Date.now()}`),
        name: String(line.name || 'Sacred Crystal Specimen'),
        variantLabel: line.variantLabel || '8mm Regular',
        unitPrice,
        quantity: qty,
      };
    });

    // Insured shipping threshold: Free shipping above ₹5000, else ₹150
    const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 150;
    const total = subtotal + shippingFee;
    const amountInPaise = Math.round(total * 100);

    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    let razorpayOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let isSimulated = true;

    // Call Official Razorpay Orders API if live or test keys are present in environment variables
    if (KEY_ID && KEY_SECRET && !KEY_ID.includes('xxxx') && !KEY_SECRET.includes('xxxx')) {
      try {
        const authHeader = `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')}`;
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${orderNumber.slice(-10)}`,
            payment_capture: 1,
            notes: {
              orderNumber,
              buyerName: buyerName.trim(),
              buyerEmail: buyerEmail.trim().toLowerCase(),
              buyerPhone: shippingAddress.phone.trim(),
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          razorpayOrderId = rzpData.id;
          isSimulated = false;
        } else {
          const errData = await rzpRes.json().catch(() => ({}));
          console.warn('Razorpay API creation warning, fallback enabled:', errData);
        }
      } catch (err) {
        console.warn('Razorpay Gateway unreachable, fallback enabled:', err.message);
      }
    }

    // Persist pending order with status='created' (NEVER mark as paid at creation)
    saveOrderToSupabase({
      orderId: orderNumber,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      currency: 'INR',
      razorpayOrderId,
      status: 'created',
    }).catch((e) => console.warn('Supabase pending order sync notice:', e.message));

    // Save/update customer profile
    saveCustomerToSupabase({
      fullName: buyerName.trim(),
      email: buyerEmail.trim().toLowerCase(),
      phone: shippingAddress.phone?.trim() || '',
      shippingAddress,
      totalOrders: 1,
      totalSpent: total,
    }).catch((e) => console.warn('Supabase customer profile sync notice:', e.message));

    return NextResponse.json({
      orderId: orderNumber,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: KEY_ID,
      isSimulated,
      subtotal,
      shippingFee,
      total,
      razorpayMeUrl: RAZORPAY_ME_URL,
      razorpayMeHandle: RAZORPAY_ME_HANDLE,
    });
  } catch (err) {
    console.error('Create-order API Exception:', err);
    return NextResponse.json({ error: 'Failed to initialize order: ' + err.message }, { status: 500 });
  }
}
