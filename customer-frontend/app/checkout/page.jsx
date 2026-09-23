'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/useCart';
import { useAuthStore } from '../../store/useAuth';
import { getSupabaseDeliverySettings } from '../../lib/supabase';
import { calculateDeliveryFee, DEFAULT_DELIVERY_SETTINGS } from '../../lib/shippingEngine';
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
  UserCheck,
  LogIn,
  ShoppingBag,
  MapPin,
  ChevronDown,
  ChevronUp,
  Shield,
  Gem,
  Award,
  Check,
} from 'lucide-react';
import InsuredDeliveryDetails from '../../components/InsuredDeliveryDetails';

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

// Payment Brand Icons Component (GPay, PhonePe, Paytm, Visa, Mastercard, RuPay)
function PaymentBrandIcons() {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-1">
      {/* Google Pay */}
      <div className="px-2 py-1 rounded-md bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center h-6">
        <span className="text-[10px] font-bold tracking-tight text-neutral-700 flex items-center gap-0.5">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">P</span>
          <span className="text-[#FBBC05]">a</span>
          <span className="text-[#34A853]">y</span>
        </span>
      </div>

      {/* PhonePe */}
      <div className="px-2 py-1 rounded-md bg-[#5f259f] text-white flex items-center justify-center h-6 shadow-xs">
        <span className="text-[10px] font-bold font-sans">PhonePe</span>
      </div>

      {/* Paytm */}
      <div className="px-2 py-1 rounded-md bg-white border border-[#002970]/20 text-[#002970] flex items-center justify-center h-6 shadow-xs">
        <span className="text-[10px] font-extrabold tracking-tighter">
          pay<span className="text-[#00BAF2]">tm</span>
        </span>
      </div>

      {/* VISA */}
      <div className="px-2 py-1 rounded-md bg-[#1a1f71] text-white flex items-center justify-center h-6 shadow-xs">
        <span className="text-[10px] font-black italic tracking-widest">VISA</span>
      </div>

      {/* MasterCard */}
      <div className="px-2 py-1 rounded-md bg-[#222222] flex items-center justify-center h-6 shadow-xs">
        <div className="flex items-center -space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
          <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90" />
        </div>
      </div>

      {/* RuPay */}
      <div className="px-2 py-1 rounded-md bg-white border border-neutral-200/80 flex items-center justify-center h-6 shadow-xs">
        <span className="text-[10px] font-extrabold text-[#0083CA] flex items-center">
          Ru<span className="text-[#F37021]">Pay</span>
          <span className="text-[8px] text-[#F37021] ml-0.5 font-bold">❯</span>
        </span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, token, openAuthModal, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    country: 'India',
  });

  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [shippingCalculation, setShippingCalculation] = useState({
    valid: true,
    fee: 50,
    baseFee: 50,
    tierName: 'Tier 1: • Pune Local (≤ 50 km)',
    estimatedDays: '1-2 Business Days',
    isFree: false,
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'verifying' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || user.name || '',
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

  // Compute subtotal accurately across items
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
              city: prev.city ? prev.city : calc.city,
              state: prev.state ? prev.state : calc.state,
            }));
          }
        }
      });
    } else {
      const isFree =
        Boolean(deliverySettings.is_free_shipping_enabled) &&
        subtotal >= Number(deliverySettings.free_shipping_threshold || 5000);
      setShippingCalculation({
        valid: true,
        fee: isFree ? 0 : Number(deliverySettings.tier_1_fee || 50),
        baseFee: Number(deliverySettings.tier_1_fee || 50),
        tierName: 'Tier 1: • Pune Local (≤ 50 km)',
        estimatedDays: '1-2 Business Days',
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
      : Number(shippingCalculation.fee ?? deliverySettings.tier_1_fee ?? 50);

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

    if (!user && !isAuthenticated()) {
      openAuthModal('login');
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
      setShowAddressDetails(true);
      setErrorMessage('Please complete your delivery address details below.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const authHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId || i.id,
          name: i.name,
          unitPrice: i.unitPrice || i.price,
          price: i.unitPrice || i.price,
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

      // 1. Create Verified Razorpay Order from server-side engine
      const createRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(orderPayload),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || (!orderData.amount && !orderData.razorpayOrderId && !orderData.orderId)) {
        throw new Error(orderData.error || orderData.message || 'Failed to initialize verified payment order.');
      }

      const finalOrderId = orderData.orderId || `ORD-${Date.now()}`;
      const finalRazorpayOrderId = orderData.razorpayOrderId || orderData.id;
      const verifiedAmount = Number(orderData.amount); // Exact amount in paise from backend

      if (!verifiedAmount || isNaN(verifiedAmount)) {
        throw new Error('Server returned invalid payment amount. Please retry.');
      }

      const razorpayKey =
        orderData.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_test_TdpRP2dJ2kJRLp';

      // 2. Load Official Razorpay Checkout Modal
      await loadRazorpayScript();

      const rzpOptions = {
        key: razorpayKey,
        amount: verifiedAmount,
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
          color: '#7c3aed',
          backdrop_color: 'rgba(15, 10, 26, 0.94)',
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
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-[32px] bg-white/90 backdrop-blur-xl border border-purple-100 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1E1B4B]">Your Collection is Empty</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Please select a sacred specimen or energy band from our masterworks collection before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>Explore Masterworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FAF7FD] via-[#F4EEFB] to-[#FAF8FC] text-[#1E1B4B] py-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative Amethyst Crystal Elements & Luminous Soft Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-indigo-300/15 rounded-full blur-[140px] pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-200/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative Amethyst Crystal Cluster Art - Left Side */}
      <div className="hidden xl:block absolute left-2 top-24 w-36 pointer-events-none opacity-40 select-none">
        <svg viewBox="0 0 100 200" className="w-full h-auto text-purple-600 drop-shadow-[0_10px_20px_rgba(147,51,234,0.15)]">
          <polygon points="20,180 50,20 80,180" fill="url(#amethystGrad1)" opacity="0.85" />
          <polygon points="5,190 35,60 65,190" fill="url(#amethystGrad2)" opacity="0.7" />
          <polygon points="45,195 70,40 95,195" fill="url(#amethystGrad1)" opacity="0.6" />
          <polygon points="50,20 35,90 20,180" fill="#E9D5FF" opacity="0.4" />
          <defs>
            <linearGradient id="amethystGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
            <linearGradient id="amethystGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="60%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative Amethyst Crystal Cluster Art - Right Side */}
      <div className="hidden xl:block absolute right-2 top-32 w-36 pointer-events-none opacity-40 select-none">
        <svg viewBox="0 0 100 200" className="w-full h-auto text-purple-600 drop-shadow-[0_10px_20px_rgba(147,51,234,0.15)]">
          <polygon points="15,190 45,30 75,190" fill="url(#amethystGrad2)" opacity="0.8" />
          <polygon points="40,195 68,15 92,195" fill="url(#amethystGrad1)" opacity="0.7" />
          <polygon points="68,15 52,85 40,195" fill="#F3E8FF" opacity="0.45" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-purple-100/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-[#8B5CF6]">
                SECURE CHECKOUT
              </span>
              <div className="w-8 h-[2px] bg-[#D4AF37]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#110D23] font-serif">
              Complete Your Purchase
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Secure payments for your precious crystals
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 self-start md:self-auto text-xs text-[#6B7280]">
            {/* Safe & Encrypted badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
              </div>
              <div>
                <div className="font-semibold text-[#1F1A15] text-[11px] leading-tight">
                  Safe &amp; Encrypted
                </div>
                <div className="text-[10px] text-[#6B7280] flex items-center gap-1">
                  <span>256-bit security</span>
                  <div className="w-4 h-[1px] bg-[#D4AF37]/70 inline-block" />
                </div>
              </div>
            </div>

            {/* Crystals for a brighter tomorrow watermark */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-purple-200/60">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-[#6B7280]">
                Crystals for a brighter tomorrow
              </span>
            </div>
          </div>
        </div>

        {/* Strict Authentication Required Gate Banner */}
        {(!user || !isAuthenticated()) && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/90 via-[#221338] to-purple-950/90 text-white border border-purple-400/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 text-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Patron Authentication Required</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5DEB3] uppercase">
                    Guest Checkout Disabled
                  </span>
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Sign in or register to link this consecrated acquisition to your authentic patron provenance and unlock Sacred Checkout.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#1C132B] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer flex-shrink-0"
            >
              <LogIn className="w-4 h-4 text-[#1C132B]" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {/* Delivery Address Collapsible Toggle Bar */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAddressDetails(!showAddressDetails)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-50/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-xs font-bold text-[#1E1B4B] block">
                  Delivery Destination:{' '}
                  <span className="font-normal text-[#4B5563]">
                    {formData.line1 ? `${formData.line1}, ` : ''}{formData.city}, {formData.state} - {formData.postalCode}
                  </span>
                </span>
                <span className="text-[10px] text-purple-600 font-mono">
                  {shippingCalculation.tierName} • {shippingCalculation.estimatedDays}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold">
              <span>{showAddressDetails ? 'Hide Address Form' : 'Edit Delivery Details'}</span>
              {showAddressDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAddressDetails && (
            <div className="p-2 sm:p-4 border-t border-purple-100 bg-[#FAF8FD] animate-in fade-in duration-200">
              <InsuredDeliveryDetails
                formData={formData}
                onChange={handleChange}
                onSubmit={() => setShowAddressDetails(false)}
                onClose={() => setShowAddressDetails(false)}
                shippingCalculation={shippingCalculation}
                submitLabel="Confirm & Apply Delivery Details"
                showClose={true}
              />
            </div>
          )}
        </div>

        {/* 2-Column Grid Matching Provided Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CARD: PAYMENT METHOD */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl border border-purple-100/90 rounded-[28px] p-6 sm:p-8 shadow-xl shadow-purple-950/5 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B4B]">Payment Method</h3>
                  <p className="text-xs text-[#6B7280]">Choose a secure payment option</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/50 text-[#8C6208] text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Razorpay Verified</span>
              </div>
            </div>

            {/* Payment Options Stack */}
            <div className="space-y-4">
              {/* Option 1: Official Razorpay Gateway (Selected) */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-purple-400/90 bg-[#F9F6FE] shadow-sm relative space-y-3 cursor-pointer ring-1 ring-purple-300/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Radio Button Active */}
                    <div className="w-5 h-5 rounded-full border-2 border-purple-600 flex items-center justify-center bg-white flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-700" />
                      <span className="text-xs sm:text-sm font-bold text-[#1E1B4B]">
                        Razorpay Gateway (UPI, Cards, NetBanking, Wallets)
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    OFFICIAL
                  </span>
                </div>

                <p className="text-[11px] text-[#6B7280] leading-relaxed pl-8">
                  Official 256-bit encrypted Razorpay modal. Accepts Google Pay, PhonePe, Paytm, all Credit/Debit cards &amp; NetBanking.
                </p>

                {/* Brand Logos Row */}
                <div className="pl-8">
                  <PaymentBrandIcons />
                </div>
              </div>

              {/* Option 2: Cash on Delivery (Disabled) */}
              <div
                className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/60 opacity-60 cursor-not-allowed select-none space-y-2"
                aria-disabled="true"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Radio Button Inactive */}
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex items-center justify-center bg-white flex-shrink-0" />

                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-neutral-500" />
                      <span className="text-xs sm:text-sm font-semibold text-neutral-600">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-300 flex items-center gap-1">
                    <Ban className="w-3 h-3 text-rose-600" />
                    <span>NOT AVAILABLE</span>
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed pl-8">
                  Cash on Delivery is unavailable. We exclusively process secure prepaid orders (UPI, Cards, NetBanking) for armored insured transit &amp; 528Hz consecration.
                </p>
              </div>
            </div>

            {/* Guarantee / Provenance Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/70 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <p className="text-xs text-purple-900 font-medium">
                Every order includes museum provenance certificate &amp; 528Hz sound attunement.
              </p>
            </div>

            {/* 3 Trust Badges Footer Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-100 text-center">
              <div className="flex flex-col items-center justify-center p-2 space-y-1">
                <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-[#4B5563]">256-bit Encryption</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 space-y-1">
                <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-[#4B5563]">100% Secure Payments</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 space-y-1">
                <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-[#4B5563]">Trusted by Crystal Collectors</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: ORDER SUMMARY */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl border border-purple-100/90 rounded-[28px] p-6 sm:p-8 shadow-xl shadow-purple-950/5 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E1B4B]">Order Summary</h3>
                <p className="text-xs text-[#6B7280]">Review your items before payment</p>
              </div>
            </div>

            {/* Specimen Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => {
                const itemPrice = Number(item.price || item.unitPrice || 0);
                const itemQty = Number(item.quantity || 1);
                const itemTotal = itemPrice * itemQty;

                return (
                  <div
                    key={`${item.productId || item.id}-${item.variantLabel || 'std'}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAF8FD] border border-purple-100/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-purple-100/60 border border-purple-200/80 flex-shrink-0">
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
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1E1B4B] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#6B7280]">
                          Qty: {itemQty} {item.variantLabel ? `• ${item.variantLabel}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#1E1B4B] font-mono flex-shrink-0">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pricing Breakdown Breakdown lines */}
            <div className="space-y-3 pt-4 border-t border-purple-100 text-xs text-[#4B5563]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#1E1B4B]">
                  ₹{Number(subtotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="block font-medium">Insured Armored Delivery</span>
                  <span className="text-[10px] text-purple-600 font-mono">
                    {shippingCalculation.tierName || 'Tier 1: • Pune Local (≤ 50 km)'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#1E1B4B]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600">Complimentary (₹0)</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Gemological Certification &amp; 528Hz Consecration</span>
                <span className="text-[#B8860B] font-bold">Included Free</span>
              </div>

              {/* Total Investment Line */}
              <div className="flex justify-between items-center pt-4 border-t border-purple-200">
                <span className="text-sm font-bold text-[#1E1B4B]">Total Investment</span>
                <span className="text-2xl font-extrabold text-[#110D23] font-mono tracking-tight">
                  ₹{Number(total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CTA Button Matching Reference Image Gradient Amethyst Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={status === 'processing' || status === 'verifying'}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-extrabold text-xs uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'processing' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Transaction…</span>
                </span>
              ) : status === 'verifying' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Signature &amp; Reserving Specimen…</span>
                </span>
              ) : (
                <>
                  <span>CONFIRM &amp; PAY ₹{Number(total || 0).toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Legal terms footer */}
            <p className="text-[10px] text-center text-[#9CA3AF] leading-normal">
              By proceeding, you agree to our{' '}
              <Link href="/about" className="underline hover:text-purple-700">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link href="/about" className="underline hover:text-purple-700">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Bottom Ambient Brand Watermarks Matching Reference Image */}
        <div className="flex items-center justify-between pt-6 border-t border-purple-200/50 text-[10px] font-mono tracking-widest text-[#9CA3AF] uppercase">
          <div>NATURAL AUTHENTIC TIMELESS</div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-[1px] bg-[#D4AF37]/60" />
            <span>MORE THAN CRYSTALS A BETTER YOU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
