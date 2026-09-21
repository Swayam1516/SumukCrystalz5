'use client';

import React from 'react';
import { X, Award, ShieldCheck, Gem, Compass, CheckCircle } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const certNumber = `SMK-CERT-${product.slug?.toUpperCase().substring(0, 6) || '2026'}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#181524] to-[#0d0b14] border-2 border-gold-500/40 p-8 shadow-2xl text-luxe-100 overflow-hidden">
        {/* Decorative holographic gold watermark */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold-500/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amethyst-500/5 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-luxe-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-3">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-[10px] uppercase font-mono tracking-[0.3em] text-gold-400">
            Sumuk Crystalz 5 Gemological Archive • @sumukcrystalz5
          </p>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide mt-1">
            Certificate of Authenticity & Provenance
          </h2>
          <p className="text-xs text-luxe-400 mt-1">Specimen Registry Code: <span className="font-mono text-gold-300">{certNumber}</span></p>
        </div>

        {/* Specimen Details Grid */}
        <div className="grid grid-cols-2 gap-4 my-6 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-luxe-400 text-[11px]">
              <Gem className="w-3.5 h-3.5 text-amethyst-400" />
              <span>Mineral Specimen</span>
            </div>
            <p className="text-sm font-semibold text-white">{product.name}</p>
            <p className="text-luxe-300 text-[11px]">Form: {product.form} • Crystal: {product.crystalType}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-luxe-400 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>Geological Origin</span>
            </div>
            <p className="text-sm font-semibold text-white">{product.origin || 'Ethical Fair-Mined Reserve'}</p>
            <p className="text-luxe-300 text-[11px] truncate">{product.sourcedFrom || 'Artisanal Reserve'}</p>
          </div>
        </div>

        {/* Provenance Attestation */}
        <div className="p-4 rounded-xl bg-gold-500/[0.04] border border-gold-500/20 text-xs text-luxe-200 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-gold-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Hand-Selected with Intention • Soumyaa Naveen Guarantee</span>
          </div>
          <p>
            This document certifies that the aforementioned specimen is 100% genuine, unadulterated, and extracted under fair-trade artisanal protocols. Hand-selected and consecrated with intention by Founder Soumyaa Naveen to elevate your sanctuary and nurture inner peace.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-luxe-400">
            <span>
              Curator & Founder: <strong className="text-white">Soumyaa Naveen</strong> (@sumukcrystalz5)
            </span>
            {product.artisanRepresentative && (
              <span>
                Lapidary Partner: <span className="text-luxe-300">{product.artisanRepresentative}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-[11px] text-luxe-400">
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Tamper-Proof Holographic Seal Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition text-xs"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
