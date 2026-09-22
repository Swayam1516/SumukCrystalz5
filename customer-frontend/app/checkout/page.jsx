'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/useCart';
import { useAuthStore } from '../../store/useAuth';
import { getSupabaseDeliverySettings } from '../../lib/supabase';
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
  Banknote,
  Ban,
  Loader2,
} from 'lucide-react';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load official Razorpay SDK'));
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

  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'verifying' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add specimens first.');
      return;
    }

    if (
      !formData.fullName?.trim() ||
      !formData.email?.trim() ||
      !formData.phone?.trim() ||
      !formData.line1?.trim() ||
      !formData.city?.trim() ||
      !formData.state?.trim() ||
      !formData.postalCode?.trim()
    ) {
      setErrorMessage('Please fill in all required delivery details marked with *.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // 1. Create Verified Razorpay Order from server-side engine
      const authHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const orderPayload = {
        amount: Math.round(total * 100),
        currency: 'INR',
        items: items.map((i) => ({
          productId: i.productId || i.id,
          name: i.name,
          unitPrice: i.unitPrice || i.price,
          variantLabel: i.variantLabel || undefined,
          quantity: i.quantity || 1,
        })),
        buyerName: formData.fullName.trim(),
        buyerEmail: formData.email.trim(),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          line1: formData.line1.trim(),
          line2: formData.line2 ? formData.line2.trim() : '',
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country || 'India',
        },
      };

      const createRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(orderPayload),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || (!orderData.id && !orderData.razorpayOrderId)) {
        throw new Error(orderData.error || 'Failed to initialize encrypted payment order.');
      }

      const finalOrderId = orderData.orderId || `ORD-${Date.now()}`;
      const finalRazorpayOrderId = orderData.razorpayOrderId || orderData.id;
      const razorpayKey =
        orderData.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_test_TdpRP2dJ2kJRLp';

      // 2. Load Official Razorpay Checkout Modal
      await loadRazorpayScript();

      const rzpOptions = {
        key: razorpayKey,
        amount: orderData.amount || Math.round(total * 100),
        currency: orderData.currency || 'INR',
        name: 'Sumuk Crystalz 5',
        description: `Order ${finalOrderId} • Sacred Specimen Acquisition`,
        image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=200&q=80',
        order_id: finalRazorpayOrderId,
        prefill: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: '#d4af37',
          backdrop_color: 'rgba(5, 3, 10, 0.88)',
        },
        handler: async (response) => {
          setStatus('verifying');
          try {
            // 3. Cryptographic Signature Verification & Order Confirmation
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: finalOrderId,
                buyerName: formData.fullName.trim(),
                buyerEmail: formData.email.trim(),
                shippingAddress: {
                  ...formData,
                  phone: formData.phone.trim(),
                },
                items,
                subtotal,
                shippingFee,
                total,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  'Payment verification could not be confirmed. If funds were deducted, our team will automatically reconcile your order.'
              );
            }

            // 4. Clear cart on verified acquisition and navigate to success page
            clearCart();
            router.push(`/order-success/${verifyData.orderId || finalOrderId}`);
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setStatus('error');
            setErrorMessage(
              verifyErr.message ||
                `Verification failed. Payment Reference: ${response.razorpay_payment_id}. Please contact support.`
            );
          }
        },
        modal: {
          ondismiss: () => {
            setStatus('idle');
          },
          escape: true,
          backdropclose: false,
        },
      };

      const rzp = new window.Razorpay(rzpOptions);

      rzp.on('payment.failed', (resp) => {
        console.error('Razorpay payment failed:', resp.error);
        setStatus('error');
        setErrorMessage(
          resp.error?.description ||
            'Payment was declined by your bank or payment app. Please retry or choose another payment method in Razorpay.'
        );
      });

      rzp.open();
    } catch (err) {
      console.error('Checkout initiation error:', err);
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
                {/* 1. Official Razorpay Gateway (Active) */}
                <div
                  className="w-full p-4 rounded-2xl border text-left flex flex-col justify-between bg-amber-500/15 border-amber-400 text-white shadow-[0_0_25px_rgba(212,175,55,0.2)] ring-1 ring-amber-400/40"
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
                </div>

                {/* 2. Cash on Delivery (Disabled) */}
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

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-luxe-300">
                  Every order includes museum provenance certificate &amp; 528Hz sound attunement.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-5">
              <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId || item.id}-${item.variantLabel || 'def'}`}
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
                          Qty: {item.quantity || 1} {item.variantLabel && `• ${item.variantLabel}`}
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

              <button
                type="submit"
                disabled={status === 'processing' || status === 'verifying'}
                className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold uppercase tracking-[0.16em] text-xs shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:scale-[1.01] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'processing' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Securing Transaction…</span>
                  </span>
                ) : status === 'verifying' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying Signature &amp; Reserving Specimen…</span>
                  </span>
                ) : (
                  <>
                    <span>Confirm &amp; Pay ₹{Number(total || 0).toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
