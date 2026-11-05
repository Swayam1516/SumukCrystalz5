'use client';

import React from 'react';
import Link from 'next/link';
import Cinematic3DCrystalHero from '../components/Cinematic3DCrystalHero';
import Services3DCoverFlow from '../components/Services3DCoverFlow';
import CoverFlow3DSlideshow from '../components/CoverFlow3DSlideshow';
import LuxuryCategorySliders from '../components/LuxuryCategorySliders';

import {
  ArrowRight,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#29242D] selection:bg-[#EAE2F2] selection:text-[#79539B] overflow-x-hidden relative font-sans w-full max-w-full">
      
      {/* ══════════════════════════════════════════════════════════
          1. FIXED 4K DIVINE GANESHA SANCTUARY HERO BANNER
          Static, zero-slideshow, fully interactive options & assistant trigger
         ══════════════════════════════════════════════════════════ */}
      <Cinematic3DCrystalHero />

      {/* ══════════════════════════════════════════════════════════
          2. FLAGSHIP SERVICES 3D COVER FLOW SLIDESHOW
          Brought directly from the Services page to the main page
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 my-10 sm:my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#EAE2F2]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest text-[#79539B] bg-[#EAE2F2] border border-[#EAE2F2] mb-3">
              <Compass className="w-3.5 h-3.5 text-[#C8A65E]" />
              <span>Sacred Energy Healing &amp; Metaphysical Services</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29242D] tracking-tight">
              Spiritual Modalities &amp; Consultations
            </h2>
            <p className="text-xs sm:text-sm text-[#29242D]/75 font-sans mt-1">
              Personalized energy sessions, chakra scans, and custom crystal curations guided by Usui Reiki Master Soumyaa Naveen.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#79539B] hover:text-[#684587] font-bold transition-colors self-start md:self-auto"
          >
            <span>View All Consultations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D Cover Flow Carousel of Consultations & Healing */}
        <Services3DCoverFlow />
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. INTERACTIVE 3D FEATURED COLLECTION
          Perspective Cover-Flow Carousel (Tiger's Eye, Amethyst, Pyrite, etc.)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 my-8 sm:my-14">
        <CoverFlow3DSlideshow />
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. LUXURY CATEGORY SHOWCASE & TOUCH-FRIENDLY SLIDERS
         ══════════════════════════════════════════════════════════ */}
      <LuxuryCategorySliders />

    </div>
  );
}
