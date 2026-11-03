'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cinematic3DCrystalHero from '../components/Cinematic3DCrystalHero';
import CoverFlow3DSlideshow from '../components/CoverFlow3DSlideshow';
import LuxuryCategorySliders from '../components/LuxuryCategorySliders';

import {
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

// Refined, editorial categories for the luxury storefront
export const LUXURY_CURATED_CATEGORIES = [
  {
    id: 'wealth-abundance',
    name: 'Wealth & Manifestation',
    subtitle: 'Golden Pyrite & Citrine',
    desc: 'High-density mineral specimens tuned for career focus, commercial luck, and sustained abundance.',
    image: '/images/products/pyrite.jpg',
    href: '/shop?filter=energy:numerology',
  },
  {
    id: 'peace-intuition',
    name: 'Peace & Inner Stillness',
    subtitle: 'Amethyst & Selenite',
    desc: 'Deep violet cathedral geodes and meditative crystals for quiet contemplation and emotional restoration.',
    image: '/images/products/amethyst.jpg',
    href: '/shop?filter=energy:chakras',
  },
  {
    id: 'shielding-grounding',
    name: 'Shielding & Deep Grounding',
    subtitle: 'Obsidian & Tiger’s Eye',
    desc: 'Volcanic glass and chatoyant iron minerals calibrated for daily energetic boundaries and resilience.',
    image: '/images/products/obsidian.jpg',
    href: '/shop?filter=energy:astrology',
  },
  {
    id: 'heart-harmony',
    name: 'Heart & Auric Harmony',
    subtitle: 'Rose Quartz & Green Jade',
    desc: 'Soft rose mineral spheres and natural jade carvings radiating unconditional warmth and emotional ease.',
    image: '/images/products/rose-quartz.jpg',
    href: '/shop?filter=energy:chakras',
  },
  {
    id: 'luxury-jewelry',
    name: 'Wearable Consecrated Art',
    subtitle: 'AAA Gemstone Bracelets & Malas',
    desc: 'Strung by hand with selected natural mineral beads and energized silver components.',
    image: '/images/products/pendant.jpg',
    href: '/shop?pillar=jewellery&filter=jewellery:bracelets',
  },
  {
    id: 'crystal-trees',
    name: 'Vastu Bonsai & Trees of Life',
    subtitle: 'Wire-Wrapped Gemstone Trees',
    desc: '300+ natural bead wire-wrapped energy trees designed to anchor harmony in homes and sanctuaries.',
    image: '/images/products/tree.jpg',
    href: '/shop?filter=specimen:crystal-trees',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#29242D] selection:bg-[#EAE2F2] selection:text-[#79539B] overflow-x-hidden relative font-sans w-full max-w-full">
      
      {/* ══════════════════════════════════════════════════════════
          1. CINEMATIC 3D CRYSTAL HERO
          Genuine Three.js / React Three Fiber interactive gemstone stage
         ══════════════════════════════════════════════════════════ */}
      <Cinematic3DCrystalHero />

      {/* ══════════════════════════════════════════════════════════
          2. INTERACTIVE 3D FEATURED COLLECTION
          Perspective Cover-Flow Carousel (Tiger's Eye, Amethyst, Pyrite, etc.)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 my-8 sm:my-14">
        <CoverFlow3DSlideshow />
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. CURATED CRYSTAL CATEGORIES
          Editorial Luxury Layout (Clean photography, balanced typography)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#EAE2F2]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans uppercase tracking-widest text-[#79539B] bg-[#EAE2F2] border border-[#EAE2F2] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
              <span>Sanctuary Curation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29242D] tracking-tight">
              Curated by Form &amp; Intention
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#79539B] hover:text-[#684587] font-bold transition-colors"
          >
            <span>Explore All Vault Specimens</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6-Card Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {LUXURY_CURATED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group block rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-[0_4px_20px_rgba(41,36,45,0.04)] hover:shadow-xl hover:border-[#79539B]/40 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F8F6F2]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#C8A65E] font-bold block">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                <p className="text-xs text-[#29242D]/75 font-sans leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-sans font-bold text-[#79539B] uppercase tracking-wider">
                  <span>View Collection</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. LUXURY CATEGORY SHOWCASE & TOUCH-FRIENDLY SLIDERS
          Replaces Image 5 with the 5 dedicated collections:
          Crystal Bracelets, Crystal Malas, Crystal Stones, Gemstone Trees & Home Décor
         ══════════════════════════════════════════════════════════ */}
      <LuxuryCategorySliders />



    </div>
  );
}
