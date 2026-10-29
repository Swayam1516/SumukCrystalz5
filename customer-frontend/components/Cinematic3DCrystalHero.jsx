'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Crown,
  User,
  Heart,
  MapPin,
  Bell,
} from 'lucide-react';

// Dynamic client-side import for real-time Three.js / WebGL 3D Amethyst stage
const PhotorealisticAmethyst3DStage = dynamic(
  () => import('./PhotorealisticAmethyst3DStage'),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none">
        {/* Soft ambient violet pre-glow */}
        <div className="absolute w-[420px] h-[420px] bg-purple-900/25 rounded-full blur-[140px] pointer-events-none" />
        <div
          className="relative w-full h-full max-w-[580px] max-h-[500px] flex items-center justify-center"
          style={{
            maskImage:
              'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
          }}
        >
          <Image
            src="/images/hero-amethyst-4k.jpg"
            alt="Authentic 4K Glowing Amethyst Natural Specimen - Sumuk Crystalz 5"
            fill
            priority
            quality={98}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
            className="object-contain filter drop-shadow-[0_20px_50px_rgba(147,51,234,0.45)]"
          />
        </div>
      </div>
    ),
  }
);

export default function Cinematic3DCrystalHero() {
  const handleOpenAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] bg-[#000000] text-white overflow-hidden flex flex-col justify-between pt-8 sm:pt-14 pb-8 px-4 sm:px-8 lg:px-12 select-none">
      {/* ══════════════════════════════════════════════════════════
          ATMOSPHERIC AMBIANCE (Deep midnight violet aura)
          ══════════════════════════════════════════════════════════ */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-950/30 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-amber-700/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
          MAIN EDITORIAL HERO GRID (40-50% Visual Balance)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 flex-1 my-auto">
        {/* LEFT COLUMN: Editorial Luxury Narrative (7 Columns) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge: Ethically Sourced Sus Gaon, Pune */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-stone-700/60 text-[#E5C378] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>ETHICALLY SOURCED &bull; SUS GAON, PUNE</span>
          </motion.div>

          {/* Headline Matching Exact Screenshot with Cinematic Entrance */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.35 }}
            className="text-4xl sm:text-6xl lg:text-[76px] font-bold text-white tracking-tight leading-[1.02] uppercase font-sans"
          >
            AUTHENTIC <br />
            HIGH-VIBRATIONAL <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.65 }}
              className="font-serif italic font-normal text-purple-200/90 lowercase first-letter:uppercase block leading-[1.08] mt-1"
            >
              Natural minerals.
            </motion.span>
          </motion.h1>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.85 }}
            className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl font-light"
          >
            Each raw specimen and hand-crafted masterwork is personally curated by Usui Reiki Master{' '}
            <strong className="text-white font-medium">Soumyaa Naveen</strong> and cleansed with pure sound resonance
            to elevate your sanctuary.
          </motion.p>

          {/* Call-to-Action Buttons with Upward Entrance Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.15 }}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            {/* Primary Solid White Pill */}
            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-stone-950 stroke-[2.2]" />
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2]" />
            </Link>

            {/* Secondary Outline Pill */}
            <Link
              href="/services"
              className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/[0.08] border border-stone-600/80 hover:border-purple-400/60 text-white font-mono text-xs uppercase tracking-[0.16em] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>CONSULTATION SERVICES</span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Photorealistic Real-Time 3D Amethyst Cluster (5 Columns) */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <PhotorealisticAmethyst3DStage />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM REGISTER BAR & FLOATING ASSISTANT
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto w-full pt-8 sm:pt-10 mt-6 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
        {/* Left Links: Collector Profile, Saved Wishlist, Saved Sanctuaries, Notifications */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-400 font-sans">
          <Link href="/account" className="flex items-center gap-2 hover:text-white transition">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>Collector Profile</span>
          </Link>

          <Link href="/shop" className="flex items-center gap-2 hover:text-white transition">
            <Heart className="w-3.5 h-3.5 text-stone-400" />
            <span>Saved Wish list</span>
          </Link>

          <Link href="/about" className="flex items-center gap-2 hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>Saved Sanctuaries</span>
          </Link>

          <span className="hidden sm:inline-block text-stone-600">|</span>

          <div className="flex items-center gap-2 text-stone-400">
            <Bell className="w-3.5 h-3.5 text-stone-400" />
            <span>Notifications &amp; Vedic Alerts</span>
          </div>
        </div>

        {/* Right: Floating Pill Widget for Sumuk Assistant */}
        <button
          type="button"
          onClick={handleOpenAssistant}
          className="self-end lg:self-auto px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-900 shadow-2xl flex items-center gap-3 border border-stone-200/50 hover:scale-[1.02] transition-transform cursor-pointer"
          aria-label="Open Sumuk Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-stone-900 font-mono">
              <span>SUMUK ASSISTANT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-stone-500 font-sans">
              Sacred Consecrated AI Guide
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-700 ml-1 stroke-[2.2]" />
        </button>
      </div>
    </section>
  );
}
