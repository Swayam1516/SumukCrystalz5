'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/useCart';
import { useAuthStore } from '../../store/useAuth';
import { saveCustomerToSupabase, saveOrderToSupabase, getSupabaseDeliverySettings } from '../../lib/supabase';
import { calculateDeliveryFee, DEFAULT_DELIVERY_SETTINGS } from '../../lib/shippingEngine';
import InsuredDeliveryDetails from '../../components/InsuredDeliveryDetails';
import {
  ShieldCheck,
  Lock,
  Truck,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Banknote,
  Ban,
  Copy,
  Check,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || '';
const RAZORPAY_ME_URL =
  process.env.NEXT_PUBLIC_RAZORPAY_ME_URL || 'https://razorpay.me/@soumyaanaveenkumarkaradimath';
const RAZORPAY_ME_HANDLE =
  process.env.NEXT_PUBLIC_RAZORPAY_ME_HANDLE || 'soumyaanaveenkumarkaradimath';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, token } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
  });

  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [shippingCalculation, setShippingCalculation] = useState({
    valid: false,
    fee: 150,
    baseFee: 150,
    tierName: 'Standard Armored Delivery',
    estimatedDays: '3-5 Business Days',
    isFree: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Fetch live delivery settings directly from Supabase
  useEffect(() => {
    let isMounted = true;
    getSupabaseDeliverySettings()
      .then((settings) => {
        if (isMounted && settings) {
          setDeliverySettings(settings);
        }
      })
      .catch((err) => console.warn('Delivery settings fetch note:', err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  const [paymentMode, setPaymentMode] = useState('razorpay'); // 'razorpay' | 'razorpay_direct' | 'instant_sandbox'
  const [status, setStatus] = useState('idle'); // idle | processing | link_pending | error
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');

  const subtotal =
    items && items.length > 0
      ? items.reduce((sum, item) => {
          const rawPrice =
            item.price !== undefined && item.price !== null && item.price !== ''
              ? item.price
              : item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice !== ''
              ? item.unitPrice
              : 0;
          return sum + (Number(rawPrice) || 0) * (Number(item.quantity) || 1);
        }, 0)
      : getTotalPrice() || 0;

  // Re-calculate dynamic shipping whenever postal code, subtotal, or delivery settings change
  useEffect(() => {
    let isMounted = true;
    const cleanPin = String(formData.postalCode || '').replace(/\D/g, '').slice(0, 6);

    if (cleanPin.length === 6) {
      calculateDeliveryFee(cleanPin, subtotal, deliverySettings).then((calc) => {
        if (isMounted) {
          setShippingCalculation(calc);
          if (calc.valid && calc.city && calc.state) {
            setFormData((prev) => ({
              ...prev,
              city: prev.city && prev.city !== 'Bengaluru' && prev.city !== 'Pune' ? prev.city : calc.city,
              state:
                prev.state && prev.state !== 'Karnataka' && prev.state !== 'Maharashtra'
                  ? prev.state
                  : calc.state,
            }));
          }
        }
      });
    } else {
      const isFree =
        Boolean(deliverySettings.is_free_shipping_enabled) &&
        subtotal >= Number(deliverySettings.free_shipping_threshold || 5000);
      setShippingCalculation({
        valid: false,
        fee: isFree ? 0 : Number(deliverySettings.interstate_fee || 150),
        baseFee: Number(deliverySettings.interstate_fee || 150),
        tierName: 'Standard Armored Delivery',
        estimatedDays: '3-5 Business Days',
        isFree,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [formData.postalCode, subtotal, deliverySettings]);

  const isFreeByThreshold =
    Boolean(deliverySettings.is_free_shipping_enabled) &&
    subtotal >= Number(deliverySettings.free_shipping_threshold || 5000);

  const shippingFee =
    subtotal === 0
      ? 0
      : isFreeByThreshold || shippingCalculation.isFree
      ? 0
      : Number(shippingCalculation.fee ?? deliverySettings.interstate_fee ?? 150);

  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(RAZORPAY_ME_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmLinkPayment = async (orderIdToConfirm) => {
    const targetId = orderIdToConfirm || pendingOrder?._id;
    if (!targetId) return;

    setStatus('processing');
    try {
      if (API_BASE) {
        try {
          const authHeaders = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };

          const confirmRes = await fetch(`${API_BASE}/api/payment/verify-link-payment`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
              orderId: targetId,
              paymentRef: utrNumber.trim(),
              buyerName: formData.fullName,
              buyerEmail: formData.email,
              shippingAddress: formData,
              items,
              subtotal,
              shippingFee,
              total,
            }),
          });
          if (!confirmRes.ok) {
            const confirmData = await confirmRes.json();
            console.warn('Backend link payment verify note:', confirmData.error);
          }
        } catch (apiErr) {
          console.warn('Backend link verify endpoint note:', apiErr.message);
        }
      }

      await saveOrderToSupabase({
        orderId: targetId,
        userId: user?.id || user?._id || null,
        buyerName: formData.fullName,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        shippingAddress: formData,
        items,
        subtotal,
        shippingFee,
        total,
        razorpayOrderId: pendingOrder?.razorpayOrderId || `rzp_me_${Date.now()}`,
        status: 'paid',
        paymentMethod: 'razorpay_link',
      });

      clearCart();
      router.push(`/order-success/${targetId}`);
    } catch (err) {
      console.error('Confirm link error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Payment confirmation failed');
    }
  };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add specimens first.');
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.line1 ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      setErrorMessage('Please fill in all required delivery details marked with *.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      let finalOrderId = `ORD-${Date.now()}`;
      let finalRazorpayOrderId = `rzp_order_${Date.now()}`;
      let isSimulated = false;
      let orderData = null;

      // 1. Attempt backend order creation
      if (API_BASE) {
        try {
          const authHeaders = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };

          const createRes = await fetch(`${API_BASE}/api/payment/create-order`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
              amount: Math.round(total * 100),
              currency: 'INR',
              items: items.map((i) => ({
                productId: i.productId || i.id,
                name: i.name,
                unitPrice: i.unitPrice || i.price,
                variantLabel: i.variantLabel || undefined,
                quantity: i.quantity,
              })),
              buyerName: formData.fullName,
              buyerEmail: formData.email,
              shippingAddress: {
                fullName: formData.fullName,
                phone: formData.phone,
                line1: formData.line1,
                line2: formData.line2,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              },
            }),
          });

          if (createRes.ok) {
            orderData = await createRes.json();
            finalOrderId = orderData.orderId || finalOrderId;
            finalRazorpayOrderId = orderData.razorpayOrderId || orderData.id || finalRazorpayOrderId;
            isSimulated = Boolean(orderData.isSimulated);
          } else {
            const errData = await createRes.json().catch(() => ({}));
            console.warn('Backend order creation returned error:', errData.error || createRes.statusText);
          }
        } catch (apiErr) {
          console.warn('Backend order endpoint unreachable, falling back:', apiErr.message);
        }
      }

      // Sync customer directly to Supabase
      saveCustomerToSupabase({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: formData,
        totalOrders: 1,
        totalSpent: total,
      });

      // 2A. Direct Razorpay.me Payment Link Mode
      if (paymentMode === 'razorpay_direct') {
        await saveOrderToSupabase({
          orderId: finalOrderId,
          userId: user?.id || user?._id || null,
          buyerName: formData.fullName,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          shippingAddress: formData,
          items,
          subtotal,
          shippingFee,
          total,
          razorpayOrderId: finalRazorpayOrderId,
          status: 'pending',
          paymentMethod: 'razorpay_link',
        });

        setPendingOrder({ _id: finalOrderId, razorpayOrderId: finalRazorpayOrderId });
        setStatus('link_pending');
        window.open(RAZORPAY_ME_URL, '_blank', 'noopener,noreferrer');
        return;
      }

      // 2B. Instant Sandbox / Fallback mode
      if (paymentMode === 'instant_sandbox' || isSimulated) {
        await saveOrderToSupabase({
          orderId: finalOrderId,
          userId: user?.id || user?._id || null,
          buyerName: formData.fullName,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          shippingAddress: formData,
          items,
          subtotal,
          shippingFee,
          total,
          razorpayOrderId: finalRazorpayOrderId,
          status: 'paid',
          paymentMethod: paymentMode || 'sandbox',
        });

        clearCart();
        router.push(`/order-success/${finalOrderId}`);
        return;
      }

      // 2C. Live Razorpay Modal SDK
      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: orderData?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData?.amount || Math.round(total * 100),
        currency: orderData?.currency || 'INR',
        name: 'Sumuk Crystalz 5',
        description: `Order ${finalOrderId}`,
        order_id: finalRazorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#eab308' },
        handler: async (response) => {
          let verifiedSuccessfully = true;

          if (API_BASE) {
            try {
              const authHeaders = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              };

              const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                  ...response,
                  orderId: finalOrderId,
                  buyerName: formData.fullName,
                  buyerEmail: formData.email,
                  shippingAddress: formData,
                  items,
                  subtotal,
                  shippingFee,
                  total,
                }),
              });

              if (!verifyRes.ok) {
                const verifyData = await verifyRes.json();
                setStatus('error');
                setErrorMessage(verifyData.error || 'Payment signature verification failed');
                verifiedSuccessfully = false;
                return;
              }
            } catch (err) {
              console.warn('Backend payment verification fallback:', err.message);
            }
          }

          if (verifiedSuccessfully) {
            await saveOrderToSupabase({
              orderId: finalOrderId,
              userId: user?.id || user?._id || null,
              buyerName: formData.fullName,
              buyerEmail: formData.email,
              buyerPhone: formData.phone,
              shippingAddress: formData,
              items,
              subtotal,
              shippingFee,
              total,
              razorpayOrderId: finalRazorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              status: 'paid',
            });

            clearCart();
            router.push(`/order-success/${finalOrderId}`);
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      rzp.on('payment.failed', (resp) => {
        setStatus('error');
        setErrorMessage(resp.error?.description || 'Payment was declined by gateway');
      });

      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-white">Your Collection is Empty</h2>
        <p className="text-xs text-luxe-400">
          Please add a specimen or cathedral geode to your collection before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-wider"
        >
          Explore Masterworks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-3d text-[#e8c97c] text-[11px] font-mono uppercase tracking-[0.2em] font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>ENCRYPTED SACRED CHECKOUT</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Complete Your Acquisition
        </h1>
      </div>

      <form onSubmit={handleCheckout} className="space-y-10">
        <section>
          <InsuredDeliveryDetails
            formData={formData}
            onChange={handleChange}
            shippingCalculation={shippingCalculation}
            onSubmit={null}
            showClose={false}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#e8c97c]">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-white">Payment Method</h3>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Razorpay Verified
                </span>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('razorpay')}
                  className={`w-full p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    paymentMode === 'razorpay'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                      : 'bg-white/[0.03] border-white/10 text-luxe-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-xs text-white">
                        Razorpay Gateway (UPI, Cards, NetBanking, Wallets)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      OFFICIAL
                    </span>
                  </div>
                  <p className="text-[11px] text-luxe-300 mt-2 leading-relaxed">
                    Official 256-bit encrypted Razorpay modal. Accepts Google Pay, PhonePe, Paytm, all Credit/Debit cards &amp; NetBanking.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('razorpay_direct')}
                  className={`w-full p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    paymentMode === 'razorpay_direct'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                      : 'bg-white/[0.03] border-white/10 text-luxe-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-xs text-white">
                        Razorpay.me Direct UPI / Handle
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#e8c97c] font-bold">
                      @{RAZORPAY_ME_HANDLE}
                    </span>
                  </div>
                  <p className="text-[11px] text-luxe-300 mt-2 leading-relaxed">
                    Direct transfer to verified merchant handle. Supports GPay, PhonePe, Paytm &amp; all UPI apps.
                  </p>
                </button>

                <div
                  className="w-full p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-luxe-500 opacity-60 cursor-not-allowed select-none transition flex flex-col justify-between"
                  aria-disabled="true"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-neutral-400" />
                      <span className="font-semibold text-xs text-neutral-300">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30 uppercase tracking-wider flex items-center gap-1">
                      <Ban className="w-3 h-3 text-rose-400" />
                      <span>Not Available</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-luxe-400 mt-2 leading-relaxed">
                    Cash on Delivery is unavailable. We exclusively process secure prepaid orders (UPI, Cards, NetBanking) for armored insured transit &amp; 528Hz consecration.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-amber-200">Official Merchant Account</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#e8c97c] hover:underline cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-white">
                  <span className="font-mono text-amber-400 font-semibold">{RAZORPAY_ME_URL}</span>
                  <a
                    href={RAZORPAY_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-luxe-300">
                  Every order includes museum provenance certificate &amp; 528Hz sound attunement.
                </p>
              </div>
            </div>

            {status === 'link_pending' && (
              <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#181126] to-[#0c0817] border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 text-amber-400">
                  <Smartphone className="w-6 h-6" />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Complete Payment on Razorpay</h4>
                    <p className="text-[11px] text-luxe-300">A new tab opened to {RAZORPAY_ME_URL}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-luxe-300 space-y-2">
                  <p>
                    1. Complete the transfer of <strong className="text-white">₹{Number(total).toLocaleString('en-IN')}</strong> on the opened Razorpay page.
                  </p>
                  <p>
                    2. (Optional) Enter the UPI Ref / UTR number below for instant reconciliation:
                  </p>
                  <input
                    type="text"
                    placeholder="Enter UPI Ref / UTR Number (Optional)"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={RAZORPAY_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-amber-500/30"
                  >
                    <span>Reopen Razorpay.me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleConfirmLinkPayment()}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Completed Payment</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-5">
              <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantLabel || 'def'}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-luxe-900 border border-white/10 flex-shrink-0">
                        <Image
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] font-mono text-luxe-400">
                          Qty: {item.quantity} {item.variantLabel && `• ${item.variantLabel}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-serif font-bold text-white">
                      ₹{Number((item.price || item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-luxe-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{Number(subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span>Insured Armored Delivery</span>
                    {shippingCalculation?.tierName && (
                      <span className="block text-[10px] font-mono text-[#e8c97c]">
                        {shippingCalculation.tierName}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-semibold">Complimentary (₹0)</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gemological Certification &amp; 528Hz Consecration</span>
                  <span className="text-[#e8c97c]">Included Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold text-white items-center">
                  <span>Total Investment</span>
                  <span className="font-serif text-xl gold-gradient-text font-mono">
                    ₹{Number(total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status !== 'link_pending' && (
                <button
                  type="submit"
                  disabled={status === 'processing'}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold uppercase tracking-[0.16em] text-xs shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:scale-[1.01] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === 'processing' ? (
                    <span>Securing Transaction…</span>
                  ) : (
                    <>
                      <span>
                        {paymentMode === 'razorpay_direct'
                          ? `Pay ₹${Number(total || 0).toLocaleString('en-IN')} via Razorpay.me`
                          : `Confirm & Pay ₹${Number(total || 0).toLocaleString('en-IN')}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
