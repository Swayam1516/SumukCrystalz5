'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Crown,
  User,
  Heart,
  MapPin,
  Bell,
} from 'lucide-react';

export default function Cinematic3DCrystalHero() {
  const handleOpenAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] bg-[#000000] text-white overflow-hidden flex flex-col justify-between pt-10 sm:pt-16 pb-8 px-4 sm:px-8 lg:px-12 select-none">
      {/* Background Subtle Ambiance (Deep violet purple rim aura behind specimen) */}
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-purple-900/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Responsive Hero Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 flex-1 my-auto">
        
        {/* LEFT COLUMN: Editorial Luxury Narrative */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge: Ethically Sourced Sus Gaon, Pune */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-stone-700/60 text-[#E5C378] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>ETHICALLY SOURCED &bull; SUS GAON, PUNE</span>
          </div>

          {/* Headline Matching Exact Screenshot */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-bold text-white tracking-tight leading-[1.02] uppercase font-sans">
            AUTHENTIC <br />
            HIGH-VIBRATIONAL <br />
            <span className="font-serif italic font-normal text-stone-200 lowercase first-letter:uppercase block leading-[1.08] mt-1">
              Natural Minerals.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl font-light">
            Each raw specimen and hand-crafted masterwork is personally curated by Usui Reiki Master{' '}
            <strong className="text-white font-medium">Soumyaa Naveen</strong> and cleansed with pure sound resonance
            to elevate your sanctuary.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Primary Solid White Pill */}
            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-stone-950 stroke-[2.2]" />
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2]" />
            </Link>

            {/* Secondary Outline Pill */}
            <Link
              href="/services"
              className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/[0.08] border border-stone-600/80 text-white font-mono text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
            >
              <span>CONSULTATION SERVICES</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: The 4K Glowing Amethyst Crystal Specimen on Dark Rock */}
        <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center">
          <div className="relative w-full h-full max-w-[620px] max-h-[520px] flex items-center justify-center group">
            <Image
              src="/images/hero-amethyst-4k.jpg"
              alt="Authentic 4K Glowing Amethyst Natural Specimen - Sumuk Crystalz 5"
              fill
              priority
              quality={98}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 620px"
              className="object-contain filter drop-shadow-[0_20px_50px_rgba(147,51,234,0.45)] transition-transform duration-700 group-hover:scale-102"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM REGISTER BAR & FLOATING ASSISTANT (Matching Screenshot Exactly) */}
      <div className="max-w-7xl mx-auto w-full pt-8 sm:pt-12 mt-6 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
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
