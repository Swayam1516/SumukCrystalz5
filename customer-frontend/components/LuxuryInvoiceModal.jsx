'use client';

import React, { useRef } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  X,
  ShieldCheck,
  QrCode,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function LuxuryInvoiceModal({ order, isOpen, onClose }) {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${new Date().getFullYear()}-${(order.orderId || order._id || '1001')
    .toString()
    .slice(-6)
    .toUpperCase()}`;
  const invoiceDate = new Date(order.paidAt || order.createdAt || Date.now()).toLocaleDateString(
    'en-IN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const subtotal = Number(order.subtotal || order.total || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const total = Number(order.total || subtotal + shippingFee);

  // Gemstone GST calculation: 3% composite GST (1.5% CGST + 1.5% SGST)
  const taxableValue = subtotal / 1.03;
  const gstAmount = subtotal - taxableValue;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl my-8 bg-[#0C0914] text-white rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Top Actions Bar (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-[#140D24] border-b border-amber-500/20">
          <div className="flex items-center gap-2 text-[#E8C97C]">
            <Award className="w-5 h-5" />
            <span className="font-serif font-bold text-sm tracking-wide">
              Official Gemological Tax Invoice &bull; {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          ref={invoiceRef}
          className="p-8 sm:p-10 space-y-8 bg-gradient-to-b from-[#0F0B18] via-[#090610] to-[#06040A] print:p-0 print:bg-white print:text-black"
        >
          {/* Header & Emblem */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-amber-500/25 print:border-neutral-300">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-widest font-bold print:border-black print:text-black">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Certificate of Provenance</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-wider">
                SUMUK CRYSTALZ 5
              </h1>
              <p className="text-xs text-neutral-400 print:text-neutral-600 font-mono mt-0.5">
                Sacred Masterworks &bull; Vedic Consecrated Crystals
              </p>
              <p className="text-[11px] text-neutral-500 print:text-neutral-700 mt-2 font-mono leading-relaxed">
                GSTIN: 27AAYCS9948K1Z5 &bull; HSN: 7103 / 7113<br />
                Sanctuary / Office: Sus Gaon, Pune, Maharashtra
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 print:text-neutral-600 font-semibold tracking-wider block">
                Tax Invoice / Receipt
              </span>
              <p className="text-sm font-mono font-bold text-white print:text-black">{invoiceNumber}</p>
              <p className="text-xs font-mono text-neutral-400 print:text-neutral-600">Date: {invoiceDate}</p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold print:border-neutral-400 print:text-black">
                  PAYMENT VERIFIED (PAID)
                </span>
              </div>
            </div>
          </div>

          {/* Billing & Gateway Reference Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/10 print:bg-neutral-50 print:border-neutral-300">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-neutral-700 font-bold mb-1.5">
                Acquired By (Collector)
              </p>
              <p className="text-sm font-bold text-white print:text-black">
                {order.buyerName || order.shippingAddress?.fullName || 'Valued Collector'}
              </p>
              <p className="text-xs text-neutral-400 print:text-neutral-700 font-mono mt-0.5">
                {order.buyerEmail || 'collector@sumuk-crystalz.com'}
              </p>
              <p className="text-xs text-neutral-400 print:text-neutral-700 font-mono">
                Phone: {order.shippingAddress?.phone || 'N/A'}
              </p>
              <p className="text-xs text-neutral-400 print:text-neutral-700 mt-2 leading-relaxed">
                {order.shippingAddress?.line1 || ''} {order.shippingAddress?.line2 || ''}<br />
                {order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} —{' '}
                {order.shippingAddress?.postalCode || ''}<br />
                {order.shippingAddress?.country || 'India'}
              </p>
            </div>

            <div className="space-y-2 sm:text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-neutral-700 font-bold mb-1.5">
                Payment Verification
              </p>
              <p className="text-xs text-neutral-300 print:text-neutral-800 font-mono">
                Gateway: <strong className="text-white print:text-black">Razorpay Secure 256-bit</strong>
              </p>
              <p className="text-xs text-neutral-300 print:text-neutral-800 font-mono">
                Payment ID: <strong className="text-emerald-400 print:text-black">{order.razorpayPaymentId || 'Verified'}</strong>
              </p>
              <p className="text-xs text-neutral-300 print:text-neutral-800 font-mono">
                Order Ref: <strong className="text-white print:text-black">{order.razorpayOrderId || order.orderId}</strong>
              </p>
              <p className="text-xs text-neutral-300 print:text-neutral-800 font-mono">
                Currency: <strong className="text-white print:text-black">INR (₹)</strong>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-500/30 bg-amber-500/5 print:bg-neutral-100 print:border-neutral-300">
                  <th className="py-3 px-3 font-mono text-[10px] uppercase text-amber-400 print:text-black">
                    Sacred Specimen
                  </th>
                  <th className="py-3 px-3 font-mono text-[10px] uppercase text-amber-400 print:text-black text-center">
                    HSN
                  </th>
                  <th className="py-3 px-3 font-mono text-[10px] uppercase text-amber-400 print:text-black text-center">
                    Qty
                  </th>
                  <th className="py-3 px-3 font-mono text-[10px] uppercase text-amber-400 print:text-black text-right">
                    Rate (₹)
                  </th>
                  <th className="py-3 px-3 font-mono text-[10px] uppercase text-amber-400 print:text-black text-right">
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-neutral-200">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-3">
                      <strong className="text-white print:text-black text-xs font-serif block">
                        {item.name}
                      </strong>
                      <span className="text-[10px] text-amber-400/80 font-mono">
                        {item.variantLabel || 'Consecrated 8mm Regular'} &bull; Lab Certified
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-neutral-400 print:text-neutral-700">
                      7103
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-neutral-300 print:text-black">
                      {item.quantity || 1}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-neutral-300 print:text-black">
                      ₹{Number(item.unitPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-300 print:text-black">
                      ₹{Number((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="pt-4 border-t border-amber-500/20 print:border-neutral-300">
            <div className="w-full sm:w-72 ml-auto space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Taxable Value</span>
                <span className="font-mono">₹{taxableValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>CGST (1.5%)</span>
                <span className="font-mono">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>SGST (1.5%)</span>
                <span className="font-mono">₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Insured Armored Delivery</span>
                <span className="font-mono text-emerald-400 print:text-black">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Gemological Certification</span>
                <span className="font-mono text-amber-400 print:text-black">INCLUDED FREE</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-amber-500/30 text-sm font-bold text-white print:text-black">
                <span className="font-serif">Grand Total Paid</span>
                <span className="font-mono text-base text-[#E8C97C] print:text-black">
                  ₹{Number(total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Gemological Provenance & Seal */}
          <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:bg-neutral-50 print:border-neutral-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-serif font-bold text-white print:text-black">
                  Authenticity &amp; 528Hz Sound Consecration Sealed
                </p>
                <p className="text-[11px] text-neutral-400 print:text-neutral-600 font-sans-ui">
                  Every crystal specimen is ethically mined, lab certified for 100% natural mineral provenance, and attuned with 528Hz Solfeggio sound bowls.
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right flex-shrink-0">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Master Attuner</p>
              <p className="font-serif text-xs font-bold text-amber-300 print:text-black mt-0.5">Soumyaa Naveen</p>
            </div>
          </div>

          {/* Terms & Footer */}
          <div className="text-[10px] text-neutral-500 print:text-neutral-600 font-mono text-center space-y-1 border-t border-white/5 print:border-neutral-200 pt-4">
            <p>
              This is a computer-generated tax invoice verified under the Razorpay Merchant Network. No signature required.
            </p>
            <p>Thank you for welcoming the natural healing energies of Sumuk Crystalz 5 into your life.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
