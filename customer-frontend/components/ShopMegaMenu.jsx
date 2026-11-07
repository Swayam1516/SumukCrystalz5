'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronRight,
  Gem,
  Compass,
  Trees,
  Layers,
  Heart,
  Flower2,
  Crown,
  Tag,
  Home,
  CheckCircle2,
  Headphones,
  Maximize2,
  X,
} from 'lucide-react';

// Golden Blooming Lotus Crest SVG
function LotusCrest({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
      </defs>
      <path d="M24 3 C21 13 20 23 24 34 C28 23 27 13 24 3 Z" fill="url(#lotusGoldGrad)" />
      <path d="M24 12 C18 16 13 24 17 33 C20 31 22 26 24 22 Z" fill="url(#lotusGoldGrad)" opacity="0.9" />
      <path d="M24 12 C30 16 35 24 31 33 C28 31 26 26 24 22 Z" fill="url(#lotusGoldGrad)" opacity="0.9" />
      <path d="M20 18 C10 20 5 28 11 34 C15 33 18 28 20 24 Z" fill="url(#lotusGoldGrad)" opacity="0.8" />
      <path d="M28 18 C38 20 43 28 37 34 C33 33 30 28 28 24 Z" fill="url(#lotusGoldGrad)" opacity="0.8" />
      <path d="M11 36 Q24 39 37 36 Q24 37 11 36 Z" fill="#D4AF37" />
    </svg>
  );
}

// 6 Master Discovery Dimensions (Left Navigation)
export const DISCOVERY_DIMENSIONS = [
  {
    id: 'purpose',
    title: 'Shop by Purpose',
    subtitle: 'Love, Money, Protection & more',
    href: '/shop?pillar=purpose',
    icon: Flower2,
  },
  {
    id: 'energy_system',
    title: 'Shop by Energy System',
    subtitle: '7 Chakras, Zodiac, Numerology & more',
    href: '/shop?pillar=energy_system',
    icon: Sparkles,
  },
  {
    id: 'crystal_specimen',
    title: 'Shop by Crystal / Specimen',
    subtitle: 'Raw, Tumbles, Towers, Clusters & more',
    href: '/shop?pillar=crystal_specimen',
    icon: Layers,
  },
  {
    id: 'jewellery',
    title: 'Shop by Jewellery',
    subtitle: 'Bracelets, Malas, Necklaces & more',
    href: '/shop?pillar=jewellery',
    icon: Crown,
  },
  {
    id: 'bead_size',
    title: 'Shop by Bead Size',
    subtitle: '4mm, 6mm, 8mm, 10mm, 12mm+',
    href: '/shop?pillar=bead_size',
    icon: Tag,
  },
  {
    id: 'home_space',
    title: 'Shop for Home & Space',
    subtitle: 'Vastu Crystals, Crystal Trees, Décor & more',
    href: '/shop?pillar=home_space',
    icon: Home,
  },
];

// The 6 Center Category Cards per Discovery Dimension (2 Rows x 3 Columns)
export const DIMENSION_CARDS = {
  purpose: [
    {
      id: 'purpose_money',
      pillarBadge: 'PURPOSE',
      name: 'Money & Abundance',
      intention: 'Wealth • Business • Success',
      image: '/images/products/pyrite.jpg',
      href: '/shop?filter=purpose:money-abundance',
    },
    {
      id: 'purpose_love',
      pillarBadge: 'PURPOSE',
      name: 'Love & Relationships',
      intention: 'Heart Healing • Harmony • Compassion',
      image: '/images/products/rose-quartz.jpg',
      href: '/shop?filter=purpose:love-relationships',
    },
    {
      id: 'purpose_protection',
      pillarBadge: 'PURPOSE',
      name: 'Protection & Shielding',
      intention: 'Evil Eye • Grounding • Safety',
      image: '/images/megamenu/obsidian.png',
      href: '/shop?filter=purpose:protection',
    },
    {
      id: 'purpose_peace',
      pillarBadge: 'PURPOSE',
      name: 'Peace & Relaxation',
      intention: 'Calmness • Anti-Stress • Serenity',
      image: '/images/products/amethyst.jpg',
      href: '/shop?filter=purpose:peace-relaxation',
    },
    {
      id: 'purpose_confidence',
      pillarBadge: 'PURPOSE',
      name: 'Confidence & Power',
      intention: 'Courage • Willpower • Leadership',
      image: '/images/products/citrine.jpg',
      href: '/shop?filter=purpose:confidence',
    },
    {
      id: 'purpose_healing',
      pillarBadge: 'PURPOSE',
      name: 'Healing & Wellness',
      intention: 'Vitality • Recovery • Balance',
      image: '/images/products/clear-quartz.jpg',
      href: '/shop?filter=purpose:healing-wellness',
    },
  ],

  energy_system: [
    {
      id: 'energy_chakras',
      pillarBadge: '7 CHAKRAS',
      name: 'Seven Chakra Crystals',
      intention: 'Align • Activate • Balance',
      image: '/images/categories/category-stones.jpg',
      href: '/shop?pillar=energy_system&filter=energy:7-chakras',
    },
    {
      id: 'energy_heart',
      pillarBadge: 'CHAKRA',
      name: 'Heart Chakra (Anahata)',
      intention: 'Love • Compassion • Emotional Calm',
      image: '/images/products/rose-quartz.jpg',
      href: '/shop?pillar=energy_system&filter=energy:heart-chakra',
    },
    {
      id: 'energy_third_eye',
      pillarBadge: 'CHAKRA',
      name: 'Third Eye & Crown',
      intention: 'Intuition • Higher Consciousness',
      image: '/images/products/amethyst.jpg',
      href: '/shop?pillar=energy_system&filter=energy:third-eye-chakra',
    },
    {
      id: 'energy_solar',
      pillarBadge: 'CHAKRA',
      name: 'Solar Plexus Chakra',
      intention: 'Personal Power • Abundance • Drive',
      image: '/images/products/citrine.jpg',
      href: '/shop?pillar=energy_system&filter=energy:solar-plexus-chakra',
    },
    {
      id: 'energy_zodiac',
      pillarBadge: 'ZODIAC',
      name: 'Zodiac Alignment',
      intention: 'Birthstones & Astrological Resonators',
      image: '/images/megamenu/tigers-eye.png',
      href: '/shop?pillar=energy_system&filter=energy:zodiac',
    },
    {
      id: 'energy_vastu',
      pillarBadge: 'VASTU',
      name: 'Vastu Energy Direction',
      intention: 'North, East & Centre Harmony',
      image: '/images/categories/category-stones.jpg',
      href: '/shop?pillar=energy_system&filter=energy:vastu',
    },
  ],

  crystal_specimen: [
    {
      id: 'specimen_raw',
      pillarBadge: 'RAW MINERALS',
      name: 'Natural Crystal Stones',
      intention: 'Raw • Tumbles • Clusters • Geodes',
      image: '/images/categories/category-stones.jpg',
      href: '/shop?pillar=crystal_specimen&filter=specimen:raw-stones',
    },
    {
      id: 'crystal_pyrite',
      pillarBadge: 'SPECIMEN',
      name: 'Pyrite Golden Clusters',
      intention: 'Money Magnet • Abundance • Power',
      image: '/images/products/pyrite.jpg',
      href: '/shop?filter=crystal:pyrite',
    },
    {
      id: 'crystal_amethyst',
      pillarBadge: 'SPECIMEN',
      name: 'Amethyst Sacred Crystals',
      intention: 'Third Eye • Divine Peace • Calmness',
      image: '/images/products/amethyst.jpg',
      href: '/shop?filter=crystal:amethyst',
    },
    {
      id: 'crystal_fluorite',
      pillarBadge: 'SPECIMEN',
      name: 'Fluorite Natural Crystal',
      intention: 'Aura Cleansing • Focus • Balance',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?filter=crystal:fluorite',
    },
    {
      id: 'specimen_towers',
      pillarBadge: 'POINTS',
      name: 'Towers & Points',
      intention: 'Energy • Clarity • Manifestation',
      image: '/images/products/clear-quartz.jpg',
      href: '/shop?pillar=crystal_specimen&filter=specimen:towers-points',
    },
    {
      id: 'specimen_pyramids',
      pillarBadge: 'SACRED GEOMETRY',
      name: 'Crystal Pyramids',
      intention: 'Vortex Amplification & Vastu',
      image: '/images/products/clear-quartz.jpg',
      href: '/shop?pillar=crystal_specimen&filter=specimen:pyramids',
    },
  ],

  jewellery: [
    {
      id: 'jewellery_bracelets',
      pillarBadge: 'JEWELLERY',
      name: 'Crystal Bracelets',
      intention: 'Protection • Balance • Abundance',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:bracelets',
    },
    {
      id: 'jewellery_malas',
      pillarBadge: 'JEWELLERY',
      name: 'Consecrated Malas',
      intention: '108 Japa • Meditation • Inner Stillness',
      image: '/images/categories/category-malas.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:malas',
    },
    {
      id: 'jewellery_necklaces',
      pillarBadge: 'JEWELLERY',
      name: 'Crystal Necklaces',
      intention: 'Throat & Heart Energy Activation',
      image: '/images/categories/category-malas.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:necklaces',
    },
    {
      id: 'jewellery_pendants',
      pillarBadge: 'JEWELLERY',
      name: 'Sacred Pendants',
      intention: 'Daily Protection & Direct Contact',
      image: '/images/products/pendant.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:pendants',
    },
    {
      id: 'jewellery_rings',
      pillarBadge: 'JEWELLERY',
      name: 'Crystal Energy Rings',
      intention: 'Subtle Energy Circulation & Mudras',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:rings',
    },
    {
      id: 'jewellery_beads',
      pillarBadge: 'JEWELLERY',
      name: 'Loose Consecrated Beads',
      intention: 'Vedic Strands & Custom Weaving',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=jewellery&filter=jewellery:beads',
    },
  ],

  bead_size: [
    {
      id: 'bead_4mm',
      pillarBadge: 'BEAD SIZE',
      name: '4 mm Delicate Bands',
      intention: 'Subtle • Layerable • Lightweight',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=bead_size&filter=bead:4mm',
    },
    {
      id: 'bead_6mm',
      pillarBadge: 'BEAD SIZE',
      name: '6 mm Meditation Beads',
      intention: 'Graceful • Balanced Flow • Daily Wear',
      image: '/images/categories/category-malas.jpg',
      href: '/shop?pillar=bead_size&filter=bead:6mm',
    },
    {
      id: 'bead_8mm',
      pillarBadge: 'BEAD SIZE',
      name: '8 mm Classic Energy Bands',
      intention: 'Standard Calibration • Everyday Power',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=bead_size&filter=bead:8mm',
    },
    {
      id: 'bead_10mm',
      pillarBadge: 'BEAD SIZE',
      name: '10 mm Statement Wristwear',
      intention: 'Bold Energy • High Density Vibration',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=bead_size&filter=bead:10mm',
    },
    {
      id: 'bead_12mm',
      pillarBadge: 'BEAD SIZE',
      name: '12 mm+ Power Specimen Bands',
      intention: 'Maximum Vibration • Altar & High Energy',
      image: '/images/categories/category-bracelets.jpg',
      href: '/shop?pillar=bead_size&filter=bead:12mm-plus',
    },
    {
      id: 'bead_custom',
      pillarBadge: 'BEAD SIZE',
      name: 'Custom Size & Calibration',
      intention: 'Founder-Attuned Personalized Fit',
      image: '/images/categories/category-curated-amethyst.jpg',
      href: '/shop?pillar=bead_size&filter=bead:custom-size',
    },
  ],

  home_space: [
    {
      id: 'home_trees',
      pillarBadge: 'HOME & SPACE',
      name: 'Vastu Gemstone Trees',
      intention: 'Wealth • Harmony • Positive Energy',
      image: '/images/categories/category-trees.jpg',
      href: '/shop?pillar=home_space&filter=home:crystal-trees',
    },
    {
      id: 'home_vastu',
      pillarBadge: 'HOME & SPACE',
      name: 'Vastu Space Crystals',
      intention: 'Spatial Clearing & Positivity Flow',
      image: '/images/categories/category-stones.jpg',
      href: '/shop?pillar=home_space&filter=home:vastu-crystals',
    },
    {
      id: 'home_pyramids',
      pillarBadge: 'HOME & SPACE',
      name: 'Crystal Pyramids',
      intention: 'Cosmic Antenna for Living Rooms',
      image: '/images/products/clear-quartz.jpg',
      href: '/shop?pillar=home_space&filter=home:crystal-pyramids',
    },
    {
      id: 'home_geodes',
      pillarBadge: 'HOME & SPACE',
      name: 'Raw Geodes for Living Room',
      intention: 'Grounding Earth Energy & Décor',
      image: '/images/categories/category-stones.jpg',
      href: '/shop?pillar=home_space&filter=home:raw-geodes-office',
    },
    {
      id: 'home_desk',
      pillarBadge: 'HOME & SPACE',
      name: 'Desk & Workspace Crystals',
      intention: 'Focus • Abundance • Productivity',
      image: '/images/products/pyrite.jpg',
      href: '/shop?pillar=home_space&filter=home:desk-workspace',
    },
    {
      id: 'home_altar',
      pillarBadge: 'HOME & SPACE',
      name: 'Temple & Altar Specimens',
      intention: 'Pooja Room Sacred Consecration',
      image: '/images/categories/category-curated-amethyst.jpg',
      href: '/shop?pillar=home_space&filter=home:temple-altar',
    },
  ],
};

// Default Fallback
export const SHOP_CATEGORY_CARDS = DIMENSION_CARDS.jewellery;

// Bottom Trust Strip Proportions
export const TRUST_PROPOSITIONS = [
  { id: 'delivery', title: 'Pan-India Delivery', icon: Truck },
  { id: 'secure', title: 'Secure Payments', icon: ShieldCheck },
  { id: 'lab', title: 'Lab-Tested Authenticity', icon: CheckCircle2 },
  { id: 'vastu', title: 'Vastu Compliant Selection', icon: Flower2 },
  { id: 'support', title: 'Dedicated Support', icon: Headphones },
];

export default function ShopMegaMenu({ onClose }) {
  const [activeDimension, setActiveDimension] = useState('purpose');

  return (
    <>
      <div
        role="dialog"
        aria-label="Sumuk Crystalz 5 Shop by Category Mega Menu"
        className="w-full max-w-[1360px] mx-auto rounded-[24px] sm:rounded-[32px] bg-[#FFFDF9] border border-[#E8DFC8] shadow-[0_30px_90px_rgba(20,10,35,0.22)] p-4 sm:p-6 text-[#181124] select-none transition-all duration-300 animate-fade-in relative z-50 overflow-hidden"
      >
        {/* Subtle Decorative Amethyst Crystals Background Watermark */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-200/20 via-amber-100/10 to-transparent pointer-events-none rounded-bl-full" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 via-purple-100/10 to-transparent pointer-events-none rounded-br-full" />

        {/* Explicit Close Button in Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-950 flex items-center justify-center transition shadow-xs z-20 cursor-pointer"
          title="Close Shop Menu"
          aria-label="Close Shop Menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ══════════════════════════════════════════════════════════
            TOP HEADER: SUMUK CRYSTALZ 5 — SHOP BY CATEGORY
           ══════════════════════════════════════════════════════════ */}
        <div className="text-center mb-4 sm:mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 mb-1">
            <LotusCrest className="w-5 h-5 text-[#B8860B]" />
            <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[#2A1D36]">
              Sumuk Crystalz5
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1224] tracking-tight">
            Shop by Category
          </h2>

          <p className="text-xs sm:text-[13px] text-[#5A5064] font-sans font-medium mt-0.5">
            Discover authentic crystals, jewellery and sacred décor for every intention
          </p>

          {/* Golden Center Flourish Divider */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <LotusCrest className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            3-COLUMN MAIN LAYOUT:
            Col 1: Left 6 Discovery Dimensions (3 cols)
            Col 2: Center 2x3 Category Grid (6 cols)
            Col 3: Right Curated Collection (3 cols)
           ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch relative z-10">
          
          {/* ══════════════════════════════════════════════════════════
              COL 1: LEFT VERTICAL NAVIGATION (6 DIMENSIONS)
             ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-2 flex flex-col justify-between">
            {DISCOVERY_DIMENSIONS.map((dim) => {
              const Icon = dim.icon;
              const isSelected = activeDimension === dim.id;

              return (
                <Link
                  key={dim.id}
                  href={dim.href}
                  onClick={() => {
                    onClose?.();
                  }}
                  onMouseEnter={() => setActiveDimension(dim.id)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#F7EDFD] to-[#FCF8FE] border-2 border-[#B975E8] shadow-[0_4px_16px_rgba(185,117,232,0.18)]'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#EADBBA]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-[#EBD2F9] text-[#792CA7] shadow-xs'
                          : 'bg-[#F2ECE1] text-[#8C6D1F]'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>

                    <div className="min-w-0 text-left">
                      <p
                        className={`text-xs sm:text-[13px] font-sans font-bold leading-tight truncate ${
                          isSelected ? 'text-[#601A8A]' : 'text-[#20152B] group-hover:text-black'
                        }`}
                      >
                        {dim.title}
                      </p>
                      <p className="text-[10px] sm:text-[10.5px] text-[#635770] font-sans font-medium truncate mt-0.5">
                        {dim.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${
                      isSelected
                        ? 'text-[#792CA7] translate-x-0.5 stroke-[2.5]'
                        : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════════════════════
              COL 2: CENTER 2x3 CATEGORY CARDS GRID (DYNAMIC TO ACTIVE DIMENSION)
             ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-2">
            {/* Active Dimension Header Pill with Explore Link */}
            <div className="flex items-center justify-between pb-1.5 px-1 border-b border-[#EADBBA]/60">
              <span className="text-[11px] font-sans font-bold text-[#601A8A] uppercase tracking-wider">
                {DISCOVERY_DIMENSIONS.find((d) => d.id === activeDimension)?.title || 'Curated Dimension'}
              </span>
              <Link
                href={`/shop?pillar=${activeDimension}`}
                onClick={onClose}
                className="text-[11px] font-sans font-bold text-[#8C6D1F] hover:text-[#5E410B] flex items-center gap-1 transition"
              >
                <span>View All In This Category</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-1">
              {(DIMENSION_CARDS[activeDimension] || DIMENSION_CARDS.jewellery).map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  onClick={onClose}
                  className="group relative rounded-2xl bg-[#FFFDF9] p-2 sm:p-2.5 border border-[#EADBBA] hover:border-[#D4AF37] hover:shadow-[0_8px_24px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Category Image with Pill Badge */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-2 shadow-inner">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    {/* Gold Pill Badge */}
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[#F3E5AB] text-[8px] font-sans font-bold uppercase tracking-wider border border-[#D4AF37]/50 shadow-xs">
                        {card.pillarBadge}
                      </span>
                    </div>
                  </div>

                  {/* Card Title & Bottom Action */}
                  <div className="flex items-end justify-between gap-1 pt-0.5">
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-xs sm:text-[12.5px] text-[#181124] group-hover:text-[#B8860B] transition-colors truncate leading-tight">
                        {card.name}
                      </h4>
                      <p className="text-[9.5px] sm:text-[10px] text-[#635770] font-sans font-medium truncate mt-0.5 leading-tight">
                        {card.intention}
                      </p>
                    </div>

                    <div className="w-5 h-5 rounded-full bg-[#FEF3C7] group-hover:bg-[#FDE68A] text-[#92400E] flex items-center justify-center flex-shrink-0 transition-colors shadow-xs">
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              COL 3: RIGHT FEATURED CURATED COLLECTION CARD
             ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3">
            <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#FFF3DC] border border-[#EADBBA] p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
              
              {/* Illuminated Amethyst on Golden Lotus Artwork */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#EADBBA]">
                <Image
                  src="/images/categories/category-curated-amethyst.jpg"
                  alt="Curated Collection - Sumuk Crystalz 5"
                  fill
                  sizes="25vw"
                  className="object-cover object-center filter brightness-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9EE]/70 via-transparent to-transparent" />
              </div>

              {/* Typography Content */}
              <div className="pt-2 text-center">
                <span className="font-sans text-[10px] sm:text-[11px] font-bold text-[#8C6D1F] uppercase tracking-[0.18em] block">
                  CURATED COLLECTION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1224] tracking-tight leading-tight mt-0.5">
                  Crystal Collection
                </h3>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-3 gap-1 mt-2.5 py-1.5 border-t border-b border-[#EADBBA]/70">
                  <div className="flex flex-col items-center">
                    <Gem className="w-3.5 h-3.5 text-[#792CA7] mb-0.5" />
                    <span className="text-[8.5px] font-sans font-bold text-[#2A1D36] leading-tight">
                      Authentic<br />Crystals
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-x border-[#EADBBA]/70 px-1">
                    <LotusCrest className="w-3.5 h-3.5 text-[#B8860B] mb-0.5" />
                    <span className="text-[8.5px] font-sans font-bold text-[#2A1D36] leading-tight">
                      Energized<br />&amp; Cleansed
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mb-0.5" />
                    <span className="text-[8.5px] font-sans font-bold text-[#2A1D36] leading-tight">
                      Premium<br />Quality
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-[#635770] font-sans font-medium mt-2 leading-snug">
                  Bringing divine energy into your everyday spaces.
                </p>

                {/* Purple Velvet Gradient Action Button */}
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-3 w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#601A8A] via-[#7526A4] to-[#4F1373] hover:from-[#4F1373] hover:to-[#380954] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(96,26,138,0.35)] transition-all active:scale-95 cursor-pointer"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM TRUST STRIP: 5 PROPOSITIONS
           ══════════════════════════════════════════════════════════ */}
        <div className="mt-5 pt-3.5 border-t border-[#EADBBA] grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#FAF7F2] p-3 rounded-2xl">
          {TRUST_PROPOSITIONS.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.id}
                className={`flex items-center justify-center gap-2 ${
                  idx !== 0 ? 'sm:border-l sm:border-[#E8DFC8]' : ''
                }`}
              >
                <Icon className="w-4 h-4 text-[#B8860B] flex-shrink-0 stroke-[2]" />
                <span className="font-sans font-bold text-[10.5px] sm:text-[11px] text-[#2A1D36] whitespace-nowrap">
                  {prop.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
