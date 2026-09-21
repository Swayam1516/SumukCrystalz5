'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Instagram,
  MessageCircle,
  Phone,
  ArrowUpRight,
  HeartHandshake,
  Maximize2,
  Compass,
  Gem,
} from 'lucide-react';

const CRYSTAL_CHOOSES_POINTS = [
  "You never simply pick a crystal; the crystal intuitively calls to you.",
  "Hand-selected with intention and cleared of all stagnant past frequencies.",
  "Infused with high-vibrational Reiki energy to awaken its dormant mineral spirit.",
  "Sealed with divine light to bring sacred protection, peace, and abundance.",
  "Arrives attuned, harmonious, and eager to step into your life’s journey.",
  "Magnetizes your personal intentions to supercharge daily manifestations.",
  "Anchors your awareness during meditation, breathwork, and quiet reflection.",
  "Balances energy centers while absorbing chaotic everyday vibrations.",
  "Acts as a pocket-sized ally to ground your emotions wherever you walk.",
  "A destined soul connection, awakened by energy and delivered to your hands."
];

const ABOUT_PRODUCT_POINTS = [
  "Each crystal is hand-selected, cleared of dense energy, and cleansed before dispatch.",
  "Infused with authentic Reiki to amplify natural universal life force vibrations.",
  "Sealed with divine blessings to attract peace, protection, and abundance to your space.",
  "Arrives energetically attuned and ready for immediate personal use without initial cleansing.",
  "Perfect for deepening meditation, breathwork, and spiritual mindfulness routines.",
  "Enhances manifestation practices by anchoring and projecting your focused personal intentions.",
  "Aids in aligning chakras and dissolving stagnant emotional or physical blockages.",
  "Neutralizes negative frequencies when placed on desks, altars, or room entryways.",
  "Serves as a tactile daily pocket stone for stress relief, calm, and grounded energy.",
  "Sustained easily by charging under the monthly full moon or resting on selenite."
];

export default function SpecimenDossier({ activeCrystal }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Specimen Dossier Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chakra Stones Chart (Replaced old dark specimen card) */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-28">
          <div className="glass-panel-3d p-4 sm:p-5 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-2xl bg-[#0e0b1a]/90 backdrop-blur-2xl flex flex-col items-center">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />

            {/* Top Bar / Badge */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-3 px-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-3d text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Sacred Alignment Chart</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-luxe-300 hover:text-white transition"
                title="View Full Size"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chakra Stones Chart Image */}
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-amber-400/20 bg-[#fdfbf7] cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src="/chakra-stones-chart.jpg"
                alt="Chakra Stones Chart - Sacred Energy Centers & Corresponding Healing Crystals"
                width={800}
                height={1066}
                priority
                className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-1.5 rounded-full bg-black/75 text-white text-[11px] font-mono backdrop-blur-md flex items-center gap-1.5 shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  Click to Expand
                </span>
              </div>
            </div>

            {/* Explore Store by Chakra Button (Matching Image 1 Pill Style & Font) */}
            <Link
              href="/shop"
              className="mt-4 w-full btn-pill-primary text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
            >
              <Gem className="w-4 h-4 text-black stroke-[2.2]" />
              <span>EXPLORE CHAKRA ENERGY STONES</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3 Curated Sacred Dossier Boxes */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* BOX 1: Crystal Chooses the Person */}
          <div className="glass-panel-3d p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide text-3d-subtle">
                  Crystal Chooses the Person
                </h3>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase font-bold px-3 py-1 rounded-full badge-3d">
                SACRED ATTUNEMENT
              </span>
            </div>

            <ul className="space-y-3">
              {CRYSTAL_CHOOSES_POINTS.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-sans-ui text-luxe-200 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400">
                    ✦
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BOX 2: ABOUT PRODUCT */}
          <div className="glass-panel-3d p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide text-3d-subtle">
                  ABOUT PRODUCT
                </h3>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase font-bold px-3 py-1 rounded-full badge-3d">
                AUTHENTIC REIKI PURITY
              </span>
            </div>

            <ul className="space-y-3">
              {ABOUT_PRODUCT_POINTS.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-sans-ui text-luxe-200 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-400">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BOX 3: Social & Direct Connect Channels */}
          <div className="glass-panel-3d p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide text-3d-subtle">
                  Connect With Sumuk Crystalz
                </h3>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase font-bold px-3 py-1 rounded-full badge-3d">
                DIRECT ASSISTANCE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card-3d border border-pink-500/30 hover:border-pink-400 bg-gradient-to-b from-pink-950/20 to-black/40 group flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-300 group-hover:text-white transition">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-pink-400/70 group-hover:text-pink-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pink-300 uppercase tracking-wider block font-semibold">
                    Follow us on Instagram
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 font-sans-ui truncate">
                    @sumukcrystalz5
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/c/919111716355"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card-3d border border-emerald-500/30 hover:border-emerald-400 bg-gradient-to-b from-emerald-950/20 to-black/40 group flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:text-white transition">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider block font-semibold">
                    Through WhatsApp
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 font-sans-ui truncate">
                    wa.me/c/919111716355
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+919111716355"
                className="p-4 rounded-2xl glass-card-3d border border-amber-500/30 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 to-black/40 group flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:text-white transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-amber-400/70 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block font-semibold">
                    Through Phone Number
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 font-sans-ui">
                    +91-9111716355
                  </p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Full Size Modal Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#100d1c] p-3 sm:p-5 rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 mb-3">
              <span className="font-editorial text-base sm:text-lg text-white font-bold tracking-wide">
                Sacred Chakra Stones Chart
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/chakra-stones-chart.jpg"
                alt="Chakra Stones Chart Full Size"
                width={1000}
                height={1333}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
