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
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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
      // Ignore if not in browser environment
    }

    if (!id) return;
    fetch(`${apiBase}/api/checkout/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
        setLoading(false);
      });
  }, [id, apiBase]);

  const shipping = order?.shippingAddress || {};

  return (
    <div className="min-h-screen pb-24 text-white">
      {/* Background radial glow */}
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
            <span>AUTHENTICATED BY RAZORPAY &bull; CONSECRATION INITIATED</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
            Sacred Acquisition Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed font-sans-ui">
            Thank you for honoring the sacred gemstone tradition. Your consecrated specimens are now registered in the Vedic gemological registry.
          </p>
        </div>

        {/* Order Stepper Card */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#140E20] to-[#0A0712] border border-amber-500/25 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Sacred Order Number</p>
              <p className="font-mono text-sm font-bold text-amber-300">{id}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Payment Gateway Reference
              </p>
              <p className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 sm:justify-end">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{order?.razorpayPaymentId || 'Verified via Razorpay'}</span>
              </p>
            </div>
          </div>

          {/* 4-Step Consecration Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center mx-auto">
                ✓
              </div>
              <p className="font-bold text-xs text-white">Payment Verified</p>
              <p className="text-[10px] text-emerald-400 font-mono">256-Bit Encrypted</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center space-y-1.5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <div className="w-7 h-7 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="font-bold text-xs text-amber-200">Sacred Cleansing</p>
              <p className="text-[10px] text-amber-300 font-mono">In Chamber</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-white/5 text-neutral-400 text-xs font-bold flex items-center justify-center mx-auto">
                <Package className="w-3.5 h-3.5" />
              </div>
              <p className="font-semibold text-xs text-neutral-300">Armored Packaging</p>
              <p className="text-[10px] text-neutral-500 font-mono">Sealed with Wax</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-white/5 text-neutral-400 text-xs font-bold flex items-center justify-center mx-auto">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <p className="font-semibold text-xs text-neutral-300">Insured Transit</p>
              <p className="text-[10px] text-neutral-500 font-mono">Bluedart Secure</p>
            </div>
          </div>
        </div>

        {/* Specimen Breakdown & Delivery Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Specimen Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#E8C97C]">
                  <Award className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-white">Acquired Masterworks</h3>
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-bold">
                  {(order?.items || []).length || 1} Item(s)
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
                        <p className="text-xs font-serif font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] font-mono text-amber-300/80">
                          Qty: {item.quantity || 1} {item.variantLabel && `• ${item.variantLabel}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      ₹{Number((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
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
                  <span>Insured Armored Delivery</span>
                  <span className="font-mono text-emerald-400">
                    {order?.shippingFee === 0 ? 'COMPLIMENTARY (₹0)' : `₹${order?.shippingFee || 0}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gemological Provenance &amp; Sacred Attunement</span>
                  <span className="font-mono text-amber-300">INCLUDED</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold text-white">
                  <span className="font-serif">Total Investment</span>
                  <span className="font-mono text-xl text-[#E8C97C]">
                    ₹{Number(order?.total || 1500).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Armored Delivery Destination & Invoicing */}
          <div className="lg:col-span-5 space-y-4">
            {/* Delivery Destination */}
            <div className="p-6 rounded-[28px] bg-[#090812]/90 backdrop-blur-xl border border-amber-500/25 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-white/10">
                <MapPin className="w-4 h-4" />
                <h4 className="font-serif text-sm font-bold text-white">Armored Delivery Destination</h4>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                <p className="font-bold text-white text-sm">
                  {order?.buyerName || shipping.fullName || 'Valued Collector'}
                </p>
                <p className="font-mono text-[11px] text-neutral-400">
                  {order?.buyerEmail || 'collector@sumuk-crystalz.com'} &bull; {shipping.phone || 'Phone verified'}
                </p>
                <p className="text-neutral-400 pt-1">
                  {shipping.line1 || 'Indiranagar Sanctuary'} {shipping.line2 || ''}<br />
                  {shipping.city || 'Bangalore'}, {shipping.state || 'Karnataka'} — {shipping.postalCode || '560038'}<br />
                  {shipping.country || 'India'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-[11px] text-neutral-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Armored packaging includes tamper-evident seal and 100% loss/theft transit insurance.
                </span>
              </div>
            </div>

            {/* Quick Action Button: Invoice */}
            <button
              type="button"
              onClick={() => setIsInvoiceOpen(true)}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Tax Invoice &amp; Certificate</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold uppercase tracking-[0.16em] text-xs shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:scale-[1.01] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore More Masterworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-medium font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
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
