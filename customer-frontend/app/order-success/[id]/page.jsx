'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import LuxuryInvoiceModal from '../../../components/LuxuryInvoiceModal';
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  Truck,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
  Printer,
  FileText,
  CreditCard,
  MapPin,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';

  useEffect(() => {
    // Fire celebratory confetti explosion
    try {
      const count = 120;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#E8C97C', '#D4AF37', '#9333EA', '#10B981', '#FFFFFF'],
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch (e) {
      // Ignore if non-browser
    }

    if (!id) return;

    // Check localStorage first for immediate responsiveness
    if (typeof window !== 'undefined') {
      try {
        const storedRaw = localStorage.getItem('sumuk_recent_orders');
        if (storedRaw) {
          const list = JSON.parse(storedRaw);
          const found = list.find((o) => o.order_number === id || o.id === id || o._id === id);
          if (found) {
            setOrder(found);
            setLoading(false);
          }
        }
      } catch (_) {}
    }

    fetch(`${apiBase}/api/checkout/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Notice loading order from backend:', err.message);
        setLoading(false);
      });
  }, [id, apiBase]);

  const displayOrderNumber = order?.order_number || order?.orderId || id || 'SC5-2026-000001';
  const shipping = order?.shippingAddress || order?.shipping_address || {};
  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const paymentMethodDisplay = order?.payment_method
    ? order.payment_method.toUpperCase()
    : 'RAZORPAY SECURE';

  const isCourierAssigned = Boolean(
    order?.delivery_partner_name || order?.carrier || order?.tracking_number
  );

  const handleCopyOrderNumber = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(displayOrderNumber);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#E8C97C] text-[11px] font-mono uppercase tracking-[0.2em] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PAYMENT VERIFIED &bull; SACRED CONSECRATION QUEUED</span>
          </div>

          {/* Exact Master Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
            Your Order Has Been Confirmed!
          </h1>

          {/* Exact Master Message */}
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed font-sans-ui">
            Your order has been securely confirmed on Sumuk Crystalz5 Sanctum. Our sanctuary team will now begin processing your crystal selection. Delivery partner allocation and tracking details will be updated once your order is prepared and dispatched. You can follow every stage of your order journey from your account.
          </p>
        </div>

        {/* Order Meta Ribbon */}
        <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-b from-[#140E20] to-[#0A0712] border border-amber-500/25 shadow-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-white/10 text-xs">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Order Number</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  {displayOrderNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                  title="Copy Order Number"
                >
                  {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Payment Status</p>
              <p className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ({paymentMethodDisplay})</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Order Placed Date</p>
              <p className="font-mono text-xs text-neutral-200 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{orderDate}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Gateway Reference</p>
              <p className="font-mono text-xs text-neutral-300 mt-1 truncate">
                {order?.razorpay_payment_id || order?.razorpayPaymentId || 'Verified Transaction'}
              </p>
            </div>
          </div>

          {/* Courier Allocation Status Notice */}
          {!isCourierAssigned ? (
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90">
              <Truck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white text-xs mb-0.5">
                  Courier Partner Assignment
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  Delivery partner allocation and tracking details will be available once your order is processed and dispatched.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200/90">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">
                    Assigned Delivery Partner: {order.delivery_partner_name || order.carrier}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300">
                    AWB / Tracking ID: {order.tracking_number}
                  </span>
                </div>
              </div>
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 self-start sm:self-auto transition"
                >
                  <span>Track Courier</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Specimen Breakdown & Delivery Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Specimen Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#E8C97C]">
                  <Award className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-bold">
                  {(order?.items || []).length || 1} Specimen(s)
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(order?.items || [
                  { name: 'Sacred Consecrated Specimen', quantity: 1, unitPrice: 1500, variantLabel: '8mm Regular' },
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-serif font-bold text-white line-clamp-1">
                          {item.name || item.product_name}
                        </p>
                        <p className="text-[10px] font-mono text-amber-300/80">
                          Qty: {item.quantity || 1} {item.variantLabel && `• ${item.variantLabel}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      ₹{Number((item.unitPrice || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ₹{Number(order?.subtotal || order?.total || 1500).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Delivery</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {Number(order?.shipping_fee ?? order?.shippingFee ?? 0) === 0
                      ? 'FREE DELIVERY (₹0)'
                      : `₹${Number(order?.shipping_fee ?? order?.shippingFee ?? 80)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vedic Sound Cleansing &amp; 432Hz Attunement</span>
                  <span className="font-mono text-amber-300">INCLUDED</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold text-white">
                  <span className="font-serif">Total Amount</span>
                  <span className="font-mono text-xl text-[#E8C97C]">
                    ₹{Number(order?.total_amount || order?.total || 1500).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Armored Delivery Destination & Tracking CTA */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Delivery Destination */}
            <div className="p-6 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-white/10">
                <MapPin className="w-4 h-4" />
                <h4 className="font-serif text-sm font-bold text-white">Delivery Destination</h4>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                <p className="font-bold text-white text-sm">
                  {order?.buyer_name || order?.buyerName || shipping.fullName || 'Valued Patron'}
                </p>
                <p className="font-mono text-[11px] text-neutral-400">
                  {order?.buyer_email || order?.buyerEmail || 'patron@sumukcrystalz.com'} &bull; {order?.buyer_phone || shipping.phone || 'Phone verified'}
                </p>
                <p className="text-neutral-400 pt-1">
                  {shipping.line1 || shipping.address || 'Sanctuary Address'} {shipping.line2 || ''}<br />
                  {shipping.city || 'Pune'}, {shipping.state || 'Maharashtra'} — {shipping.postalCode || shipping.pincode || '411045'}<br />
                  {shipping.country || 'India'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-[11px] text-neutral-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Secure insured packaging includes tamper-evident seal and 100% loss/damage transit insurance.
                </span>
              </div>
            </div>

            {/* Track My Order Button */}
            <Link
              href={`/account?tab=tracking&orderId=${displayOrderNumber}`}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-serif font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track My Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Quick Action Button: Invoice */}
            <button
              type="button"
              onClick={() => setIsInvoiceOpen(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Download Tax Invoice &amp; Certificate</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <span>Explore More Sacred Specimens</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>

          <button
            type="button"
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-medium font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Official Tax Invoice & Provenance Certificate Modal */}
      {order && (
        <LuxuryInvoiceModal
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
}
