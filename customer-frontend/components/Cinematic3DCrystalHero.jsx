'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Crown,
} from 'lucide-react';

export const GANESHA_HERO_DATA = {
  id: 'ganesha-sanctuary',
  badge: 'DIVINE BLESSINGS • AUTHENTIC NATURAL CRYSTALS',
  titleLine1: 'DIVINE ENERGY.',
  titleLine2: 'TIMELESS CRYSTALS.',
  subtitle: 'Blessed by the divine. Inspired by nature.',
  description:
    'Discover authentic natural crystals, thoughtfully curated to bring beauty, meaning and positive energy into your everyday spaces.',
  imageDesktop: '/images/ganesha-hero-sanctuary-desktop.jpg',
  aspectRatio: '1376 / 768',
  ctaPrimary: {
    label: 'EXPLORE COLLECTION',
    href: '/shop',
    icon: Crown,
  },
  ctaSecondary: {
    label: 'DISCOVER YOUR CRYSTAL',
    href: '/shop?filter=energy:chakras',
    icon: Sparkles,
  },
};

export default function Cinematic3DCrystalHero() {
  const hero = GANESHA_HERO_DATA;

  return (
    <div className="w-full flex flex-col bg-[#05020A]">
      {/* ══════════════════════════════════════════════════════════
          1. FIXED ULTRA-HD 4K GANESHA SANCTUARY HERO BANNER
          Clean 4K artwork with NO baked-in buttons or assistant guide
         ══════════════════════════════════════════════════════════ */}
      <section
        style={{ aspectRatio: hero.aspectRatio }}
        className="relative w-full max-w-full bg-[#05020A] text-white overflow-hidden flex items-center select-none"
        aria-label="Sumuk Crystalz 5 Divine Ganesha Sanctuary Hero"
      >
        {/* Full 4K Fixed Hero Image Display */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={hero.imageDesktop}
            alt="Divine Energy. Timeless Crystals. - Sumuk Crystalz 5"
            fill
            priority
            quality={100}
            unoptimized={true}
            sizes="100vw"
            className="object-cover object-center filter brightness-[1.02] contrast-[1.02]"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. SOLID, PIXEL-PERFECT, 100% INTERACTIVE ACTION BUTTONS
               Zero duplication: Underlying artwork is completely clean!
           ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute z-20 flex items-center gap-[1.2vw] pointer-events-auto"
          style={{
            left: '5.2%',
            top: '71.5%',
            maxWidth: '45%',
          }}
        >
          {/* Button 1: EXPLORE COLLECTION (Solid White Luxury Pill) */}
          <Link
            href={hero.ctaPrimary.href}
            className="rounded-full bg-white hover:bg-[#FDFBF7] text-[#16121D] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.7)] flex items-center justify-center gap-[0.55vw] px-[1.4vw] py-[0.75vw] transition-all duration-200 cursor-pointer group hover:scale-[1.03] active:scale-95"
            title={hero.ctaPrimary.label}
          >
            <Crown className="w-[1.1vw] h-[1.1vw] min-w-[14px] min-h-[14px] text-[#16121D] stroke-[2.2] flex-shrink-0" />
            <span className="text-[0.82vw] font-bold tracking-wider uppercase font-sans whitespace-nowrap text-[#16121D]">
              {hero.ctaPrimary.label}
            </span>
            <ArrowRight className="w-[1vw] h-[1vw] min-w-[12px] min-h-[12px] text-[#16121D] stroke-[2.4] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>

          {/* Button 2: DISCOVER YOUR CRYSTAL (Solid Dark Gold-Bordered Luxury Pill) */}
          <Link
            href={hero.ctaSecondary.href}
            className="rounded-full bg-[#0A0512] hover:bg-[#140A22] text-[#F3E5AB] border-[1.5px] border-[#D4AF37] shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:border-[#FFF1C5] hover:shadow-[0_0_30px_rgba(212,175,55,0.65)] flex items-center justify-center gap-[0.55vw] px-[1.4vw] py-[0.75vw] transition-all duration-200 cursor-pointer group hover:scale-[1.03] active:scale-95"
            title={hero.ctaSecondary.label}
          >
            <Sparkles className="w-[1.1vw] h-[1.1vw] min-w-[14px] min-h-[14px] text-[#D4AF37] stroke-[2.2] flex-shrink-0" />
            <span className="text-[0.82vw] font-bold tracking-wider uppercase font-sans whitespace-nowrap text-[#F3E5AB]">
              {hero.ctaSecondary.label}
            </span>
            <ArrowRight className="w-[1vw] h-[1vw] min-w-[12px] min-h-[12px] text-[#D4AF37] stroke-[2.4] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════
            3. SCREEN-READER & SEO SEMANTIC CONTENT (Accessible)
           ══════════════════════════════════════════════════════════ */}
        <div className="sr-only">
          <h1>{hero.titleLine1} {hero.titleLine2}</h1>
          <p>{hero.badge}</p>
          <p>{hero.subtitle}</p>
          <p>{hero.description}</p>
          <a href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</a>
          <a href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. MOBILE TOUCH BAR (Visible on screens < 640px)
         ══════════════════════════════════════════════════════════ */}
      <div className="sm:hidden flex items-center justify-between gap-3 px-4 py-3 bg-[#0B0514] border-t border-[#D4AF37]/30">
        <Link
          href={hero.ctaPrimary.href}
          className="flex-1 py-2.5 px-3 rounded-full bg-white text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <Crown className="w-3.5 h-3.5 text-stone-950 stroke-[2.2]" />
          <span className="truncate">Explore Collection</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-950 stroke-[2.2]" />
        </Link>
        <Link
          href={hero.ctaSecondary.href}
          className="flex-1 py-2.5 px-3 rounded-full bg-black/85 border border-[#D4AF37] text-[#E5C378] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
          <span className="truncate">Discover Crystal</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
        </Link>
      </div>
    </div>
  );
}
