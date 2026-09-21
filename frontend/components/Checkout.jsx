import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

/** Injects the Razorpay Checkout.js script once and resolves when ready. */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

/**
 * cart:  [{ productId, variantLabel?, quantity, name, unitPrice }]
 * buyer: { buyerName, buyerEmail, shippingAddress }
 */
export default function Checkout({ cart, buyer, onSuccess, onError }) {
  const [status, setStatus] = useState('idle'); // idle | processing | success | error

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  async function handlePay() {
    setStatus('processing');
    try {
      await loadRazorpayScript();

      // 1. Ask the server to create a Razorpay order (server recomputes price)
      const createRes = await fetch(`${API_BASE}/api/checkout/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.productId,
            variantLabel: c.variantLabel,
            quantity: c.quantity,
          })),
          buyerName: buyer.buyerName,
          buyerEmail: buyer.buyerEmail,
          shippingAddress: buyer.shippingAddress,
        }),
      });
      const orderData = await createRes.json();
      if (!createRes.ok) throw new Error(orderData.error || 'Could not start checkout');

      // 2. Open the Razorpay payment sheet
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Lumière Crystals',
        description: `Order ${orderData.orderId}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: buyer.buyerName,
          email: buyer.buyerEmail,
          contact: buyer.shippingAddress?.phone,
        },
        theme: { color: '#6d5bd0' },
        handler: async (response) => {
          // 3. Server-side signature verification — this is the source of truth
          const verifyRes = await fetch(`${API_BASE}/api/checkout/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setStatus('error');
            onError?.(verifyData.error || 'Payment verification failed');
            return;
          }
          setStatus('success');
          onSuccess?.(verifyData.orderId);
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      rzp.on('payment.failed', (resp) => {
        setStatus('error');
        onError?.(resp.error?.description || 'Payment failed');
      });

      rzp.open();
    } catch (err) {
      setStatus('error');
      onError?.(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={handlePay}
        disabled={status === 'processing' || cart.length === 0}
        className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition disabled:opacity-50"
      >
        {status === 'processing' ? 'Processing…' : `Pay ₹${subtotal.toFixed(2)}`}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600">Payment could not be completed. Please try again.</p>
      )}
    </div>
  );
}
