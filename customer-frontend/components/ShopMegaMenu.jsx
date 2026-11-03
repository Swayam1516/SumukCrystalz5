'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Gift,
  Flame,
  ChevronRight,
  Gem,
  Compass,
  Trees,
  Layers,
  Heart,
  Flower2,
} from 'lucide-react';

export const SIDEBAR_CATEGORIES = [
  {
    id: 'all',
    title: 'All Crystals',
    subtitle: 'Explore our complete collection',
    href: '/shop',
    icon: Gem,
    activeColor: 'text-[#6B21A8]',
    activeBg: 'bg-[#F3E8FF]',
    badgeBg: 'bg-[#EDE9FE]',
    badgeColor: 'text-[#6B21A8]',
  },
  {
    id: 'numerology',
    title: 'Numerology Crystals',
    subtitle: 'Align with your destiny',
    href: '/shop?filter=energy:numerology',
    icon: Compass,
    activeColor: 'text-[#92400E]',
    activeBg: 'bg-[#FEF3C7]',
    badgeBg: 'bg-[#FDE68A]',
    badgeColor: 'text-[#92400E]',
  },
  {
    id: 'trees',
    title: 'Crystal Trees',
    subtitle: 'Prosperity & positive energy',
    href: '/shop?filter=specimen:crystal-trees',
    icon: Trees,
    activeColor: 'text-[#92400E]',
    activeBg: 'bg-[#FEF3C7]',
    badgeBg: 'bg-[#FDE68A]',
    badgeColor: 'text-[#92400E]',
  },
  {
    id: 'chips',
    title: 'Crystal Chips',
    subtitle: 'Versatile & powerful',
    href: '/shop?filter=specimen:raw-clusters',
    icon: Layers,
    activeColor: 'text-[#92400E]',
    activeBg: 'bg-[#FEF3C7]',
    badgeBg: 'bg-[#FDE68A]',
    badgeColor: 'text-[#92400E]',
  },
  {
    id: 'towers',
    title: 'Towers & Points',
    subtitle: 'Focus & manifestation',
    href: '/shop?filter=specimen:points-towers',
    icon: Sparkles,
    activeColor: 'text-[#92400E]',
    activeBg: 'bg-[#FEF3C7]',
    badgeBg: 'bg-[#FDE68A]',
    badgeColor: 'text-[#92400E]',
  },
  {
    id: 'purpose',
    title: 'By Purpose',
    subtitle: 'Love, Healing, Prosperity & more',
    href: '/shop?filter=energy:chakras',
    icon: Flower2,
    activeColor: 'text-[#92400E]',
    activeBg: 'bg-[#FEF3C7]',
    badgeBg: 'bg-[#FDE68A]',
    badgeColor: 'text-[#92400E]',
  },
];

export const FEATURED_MINERAL_CARDS = [
  {
    id: 'amethyst',
    name: 'Amethyst',
    intention: 'Spiritual Growth',
    image: '/images/megamenu/amethyst.png',
    href: '/shop?filter=mineral:amethyst',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    intention: 'Love & Compassion',
    image: '/images/megamenu/rose-quartz.png',
    href: '/shop?filter=mineral:rose-quartz',
  },
  {
    id: 'tigers-eye',
    name: "Tiger's Eye",
    intention: 'Confidence & Strength',
    image: '/images/megamenu/tigers-eye.png',
    href: '/shop?filter=mineral:tigers-eye',
  },
  {
    id: 'clear-quartz',
    name: 'Clear Quartz',
    intention: 'Clarity & Focus',
    image: '/images/megamenu/clear-quartz.png',
    href: '/shop?filter=mineral:clear-quartz',
  },
  {
    id: 'pyrite',
    name: 'Golden Pyrite',
    intention: 'Wealth & Prosperity',
    image: '/images/megamenu/pyrite.png',
    href: '/shop?filter=mineral:pyrite',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    intention: 'Protection & Grounding',
    image: '/images/megamenu/obsidian.png',
    href: '/shop?filter=mineral:black-obsidian',
  },
];

export const TRUST_PROPOSITIONS = [
  {
    id: 'authentic',
    title: '100% Authentic',
    subtitle: 'Natural Crystals',
    icon: ShieldCheck,
  },
  {
    id: 'shipping',
    title: 'Free Shipping',
    subtitle: 'On Orders Above ₹999',
    icon: Truck,
  },
  {
    id: 'packaging',
    title: 'Premium Packaging',
    subtitle: 'Perfect for Gifting',
    icon: Gift,
  },
  {
    id: 'blessed',
    title: 'Energized & Blessed',
    subtitle: 'With Positive Intentions',
    icon: Flame,
  },
];

export default function ShopMegaMenu({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div
      role="dialog"
      aria-label="Shop by Category Mega Menu"
      className="w-full max-w-7xl mx-auto rounded-[28px] bg-[#FFFDF9] border-2 border-[#EADBBA] shadow-[0_30px_90px_rgba(20,10,35,0.25)] p-5 sm:p-7 text-[#181124] select-none transition-all duration-300 animate-fade-in relative z-50"
    >
      {/* Top 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ══════════════════════════════════════════════════════════
            1. LEFT COLUMN: VERTICAL CATEGORY SIDEBAR
           ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-1.5 flex flex-col justify-between">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={onClose}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 group cursor-pointer ${
                  isSelected
                    ? `${cat.activeBg} border-2 border-[#C084FC] shadow-sm`
                    : 'bg-[#FBF9F5] hover:bg-[#F5EFE6] border border-[#EEDBBA]/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${cat.badgeBg} ${cat.badgeColor} flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0 text-left">
                    <p
                      className={`text-xs sm:text-[13px] font-sans font-bold leading-tight truncate ${
                        isSelected ? 'text-[#581C87]' : 'text-[#181124] group-hover:text-black'
                      }`}
                    >
                      {cat.title}
                    </p>
                    <p className="text-[10.5px] sm:text-[11px] text-[#4F4759] font-sans font-medium truncate mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform flex-shrink-0 ${
                    isSelected
                      ? `${cat.activeColor} translate-x-0.5 stroke-[2.5]`
                      : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. CENTER COLUMN: SHOP BY CATEGORY (2x3 GRID)
           ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-[#EADBBA]/80">
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-black text-[#181124] tracking-tight">
                Shop by Category
              </h3>
              <p className="text-xs text-[#4F4759] font-sans font-medium mt-0.5">
                Discover authentic natural crystals for every intention
              </p>
            </div>

            <Link
              href="/shop"
              onClick={onClose}
              className="text-xs font-sans font-bold text-[#6B21A8] hover:text-[#4C1D95] flex items-center gap-1 group transition cursor-pointer"
            >
              <span>View All Crystals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.2]" />
            </Link>
          </div>

          {/* 6-Card Mineral Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURED_MINERAL_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                onClick={onClose}
                className="group relative rounded-2xl bg-white p-3 border-2 border-[#EADBBA]/80 hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Mineral Artwork */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#FAF7F2] flex items-center justify-center p-2 mb-2">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Details & Circular Action Button */}
                <div className="flex items-end justify-between gap-1 pt-1">
                  <div className="min-w-0">
                    <h4 className="font-sans font-bold text-xs sm:text-[13px] text-[#181124] group-hover:text-[#B45309] transition-colors truncate">
                      {card.name}
                    </h4>
                    <p className="text-[10px] sm:text-[10.5px] text-[#4F4759] font-sans font-medium truncate mt-0.5">
                      {card.intention}
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-[#FEF3C7] group-hover:bg-[#FDE68A] text-[#92400E] flex items-center justify-center flex-shrink-0 transition-colors shadow-xs">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            3. RIGHT COLUMN: CONSECRATED COLLECTION HERO BANNER
           ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3">
          <div className="relative h-full min-h-[310px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EC] to-[#FFF1D6] border-2 border-[#EEDBBA] p-5 flex flex-col justify-between shadow-xs">
            
            {/* Top Glowing Lotus Amethyst Specimen */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#EADBBA]/60">
              <Image
                src="/images/consecrated-lotus-amethyst.jpg"
                alt="Consecrated Lotus Amethyst Crystal"
                fill
                sizes="25vw"
                className="object-cover object-center filter brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8EC]/80 via-transparent to-transparent" />
            </div>

            {/* Typography Content */}
            <div className="relative z-10 pt-3">
              <span className="font-serif text-[14px] font-bold text-[#B45309] uppercase tracking-wider block">
                Consecrated
              </span>
              <h4 className="font-serif text-2xl font-black text-[#181124] tracking-tight leading-tight block">
                Crystal Collection
              </h4>
              <p className="text-xs font-sans font-semibold text-[#181124] mt-1">
                Authentic &bull; Energized &bull; Premium Quality
              </p>
              <p className="text-[11px] font-sans text-[#4F4759] font-medium mt-0.5 leading-snug">
                Bringing divine energy into your everyday spaces.
              </p>

              {/* Gold Gradient CTA Button */}
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C99E2A] to-[#B3891E] hover:from-[#c29824] hover:to-[#9f7917] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </Link>
            </div>

            {/* Bottom-right decorative lotus line watermark */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 pointer-events-none opacity-20 text-[#D4AF37]">
              <Flower2 className="w-full h-full" />
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          4. BOTTOM ROW: 4-COLUMN VALUE PROPOSITIONS & TRUST STRIP
         ══════════════════════════════════════════════════════════ */}
      <div className="mt-6 pt-5 border-t border-[#EADBBA]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FBF9F5] p-4 rounded-2xl border border-[#EADBBA]">
        {TRUST_PROPOSITIONS.map((prop, idx) => {
          const Icon = prop.icon;
          return (
            <div
              key={prop.id}
              className={`flex items-center gap-3 ${
                idx !== 0 ? 'sm:border-l sm:border-[#EADBBA] sm:pl-6' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="font-sans font-bold text-xs text-[#181124] leading-tight truncate">
                  {prop.title}
                </p>
                <p className="text-[10.5px] text-[#4F4759] font-sans font-medium truncate mt-0.5">
                  {prop.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
