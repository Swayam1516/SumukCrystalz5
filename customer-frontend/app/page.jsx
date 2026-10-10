'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import DynamicVideoEngine from '../components/DynamicVideoEngine';
import VideoPreloader from '../components/VideoPreloader';
import DualTierFilterTicker from '../components/DualTierFilterTicker';
import ProvenanceTrustCards from '../components/ProvenanceTrustCards';
import LiveProductSlideshow from '../components/LiveProductSlideshow';
import { CRYSTAL_CATALOG } from '../data/crystals';
import { getSupabaseProducts } from '../lib/supabase';
import { crystalAudio } from '../utils/harmonicResonance';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Compass,
  Gem,
  Check,
  ChevronRight,
  ChevronLeft,
  Moon,
  Trees,
  Crown,
  Boxes,
  Triangle,
  Zap,
  Layers,
  Hash,
  SlidersHorizontal,
  ArrowDown,
} from 'lucide-react';

export const POPULAR_FILTER_CATEGORIES = [
  {
    id: 'numerology',
    name: 'Numerology',
    badge: '1–9 & Master Numbers',
    subtitle: 'Crystals based on Numbers',
    desc: 'Sacred vibrational crystals attuned to Life Path, Destiny & Master Numbers 11/22/33.',
    specimens: 'Pyrite (1) • Moonstone (2) • Citrine (3) • Emerald (5)',
    href: '/shop?filter=energy:numerology',
    vaultCategory: 'Numerology',
    color: 'from-purple-900/60 via-purple-950/40 to-black',
    border: 'border-purple-500/40 hover:border-purple-400',
    accent: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.45)',
    icon: Hash,
  },
  {
    id: 'astrology',
    name: 'Astrology',
    badge: 'Zodiac & Planetary Energy',
    subtitle: 'Crystals based on Zodiac Signs',
    desc: 'Align with natal Sun, Moon & Rising astrological charts and pacify planetary transits.',
    specimens: 'Aries Carnelian • Leo Tiger’s Eye • Pisces Amethyst',
    href: '/shop?filter=energy:zodiac',
    vaultCategory: 'Astrology',
    color: 'from-indigo-900/60 via-indigo-950/40 to-black',
    border: 'border-indigo-500/40 hover:border-indigo-400',
    accent: '#818cf8',
    glow: 'rgba(99, 102, 241, 0.45)',
    icon: Moon,
  },
  {
    id: 'trees',
    name: 'Crystal Trees',
    badge: 'Vastu & Feng Shui Energy',
    subtitle: 'Gemstone Bonsai & Trees of Life',
    desc: '300+ natural bead wire-wrapped money and health trees radiating continuous abundance.',
    specimens: '7-Chakra Tree • Citrine Wealth Bonsai • Rose Quartz Harmony',
    href: '/shop?filter=specimen:crystal-trees',
    vaultCategory: 'Trees',
    color: 'from-emerald-900/60 via-emerald-950/40 to-black',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.45)',
    icon: Trees,
  },
  {
    id: 'luxury-jewelry',
    name: 'Luxury Jewelry',
    badge: 'Wearable Consecrated Art',
    subtitle: 'Sacred Bracelets, Malas & Pendants',
    desc: 'AAA natural gemstone bracelets, 108 japa malas & energized sterling silver talisman pendants.',
    specimens: 'Pyrite Wealth Band • Tiger Eye Mala • Moldavite Pendants',
    href: '/shop?pillar=jewellery&filter=jewellery:bracelets',
    vaultCategory: 'Luxury Jewelry',
    color: 'from-amber-900/60 via-amber-950/40 to-black',
    border: 'border-amber-500/40 hover:border-amber-400',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    icon: Crown,
  },
  {
    id: 'chips',
    name: 'Crystal Chips',
    badge: 'Apothecary & Sacred Grids',
    subtitle: 'Natural Crushed Gemstones',
    desc: 'Raw crushed mineral gravel for singing bowl charging, crystal vials & potted plant energizers.',
    specimens: 'Clear Quartz Chips • Black Tourmaline • Raw Amethyst Grit',
    href: '/shop?filter=specimen:crystal-chips',
    vaultCategory: 'Chips',
    color: 'from-rose-900/60 via-rose-950/40 to-black',
    border: 'border-rose-500/40 hover:border-rose-400',
    accent: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.45)',
    icon: Boxes,
  },
  {
    id: 'pyramids',
    name: 'Pyramids',
    badge: 'Sacred Geometry Vortex',
    subtitle: 'Cosmic Energy Generators',
    desc: 'Precision 4-sided apex pyramids concentrating and amplifying manifestation frequencies.',
    specimens: 'Orgonite Wealth Pyramid • Black Obsidian Shield • Selenite Apex',
    href: '/shop?filter=specimen:pyramids',
    vaultCategory: 'Pyramids',
    color: 'from-cyan-900/60 via-cyan-950/40 to-black',
    border: 'border-cyan-500/40 hover:border-cyan-400',
    accent: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.45)',
    icon: Triangle,
  },
  {
    id: 'towers',
    name: 'Towers & Points',
    badge: 'High Vibrational Obelisks',
    subtitle: 'Standing Generator Prisms',
    desc: 'Six-faceted natural towers channeling high vibrational energy skyward to clear room aurics.',
    specimens: 'Clear Quartz Tower • Smoky Quartz Point • Fluorite Pillar',
    href: '/shop?filter=specimen:towers-points',
    vaultCategory: 'Towers',
    color: 'from-sky-900/60 via-sky-950/40 to-black',
    border: 'border-sky-500/40 hover:border-sky-400',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    icon: Layers,
  },
  {
    id: 'chakras',
    name: '7 Chakras',
    badge: 'Harmonic Alignment',
    subtitle: 'Kundalini Energy Balancing',
    desc: 'Solfeggio sound bowl cleansed stones balanced for the 7 primary spiritual energy wheels.',
    specimens: 'Crown Amethyst • Heart Rose Quartz • Root Black Tourmaline',
    href: '/shop?pillar=energy_system&filter=energy:7-chakras',
    vaultCategory: 'Chakras',
    color: 'from-fuchsia-900/60 via-fuchsia-950/40 to-black',
    border: 'border-fuchsia-500/40 hover:border-fuchsia-400',
    accent: '#e879f9',
    glow: 'rgba(232, 121, 249, 0.45)',
    icon: Compass,
  },
];

const VAULT_CATEGORIES = [
  'All Masterworks',
  'Numerology',
  'Astrology',
  'Trees',
  'Luxury Jewelry',
  'Chips',
  'Pyramids',
  'Towers',
  'Chakras',
  'Wealth & Abundance',
  'Protection & Shielding',
  'Love & Harmony',
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function HomePage() {
  const router = useRouter();
  
  // Active crystal index: Starts on Video 2 (Index 0 in CRYSTAL_CATALOG: Amethyst)
  const [activeCrystalIndex, setActiveCrystalIndex] = useState(0);
  const activeCrystal = CRYSTAL_CATALOG[activeCrystalIndex] || CRYSTAL_CATALOG[0];

  // Cart store
  const { addItem, openDrawer, getTotalCount, getTotalPrice } = useCartStore();
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Masterworks');

  // Featured masterworks state - strictly connected to live Supabase database
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch live products directly from Supabase database
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      setLoadingProducts(true);
      try {
        // 1. Fetch live products from Supabase (Source of Truth)
        const supaItems = await getSupabaseProducts(true);
        if (supaItems && supaItems.length > 0 && isMounted) {
          setFeaturedProducts(supaItems);
          return;
        }

        // 2. Fetch from Backend API if configured
        if (API_BASE) {
          try {
            const res = await fetch(`${API_BASE}/api/products`);
            if (res.ok && isMounted) {
              const data = await res.json();
              const items = Array.isArray(data) ? data : (data.products || []);
              if (items.length > 0) {
                setFeaturedProducts(items);
                return;
              }
            }
          } catch (_) {
            // Backend offline - smooth Supabase fallback
          }
        }

        if (isMounted) {
          setFeaturedProducts(supaItems || []);
        }
      } catch (err) {
        console.warn('Customer storefront live products notice:', err?.message);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchLiveProducts();
    return () => { isMounted = false; };
  }, [API_BASE]);

  // Auto Advance Callback for DynamicVideoEngine
  const handleAutoAdvance = useCallback(() => {
    setActiveCrystalIndex((prev) => (prev + 1) % CRYSTAL_CATALOG.length);
  }, []);

  // Hydration safety for client-persisted cart state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getTotalCount() : 0;
  const cartTotalFormatted = mounted ? Number(getTotalPrice() || 0).toLocaleString('en-IN') : '0';

  // Update dynamic CSS root variables when active crystal changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--crystal-glow', activeCrystal.colorGlow);
      document.documentElement.style.setProperty('--crystal-accent', activeCrystal.colorAccent);
      document.documentElement.style.setProperty('--crystal-border', activeCrystal.rimGlow);
    }
  }, [activeCrystal]);



  const handleQuickAdd = (product) => {
    const prodId = product.id || product._id;
    const price = Number(product.price || product.sellingPrice || product.selling_price || product.basePrice || 0);
    const origPrice = Number(product.originalPrice || product.original_price || price * 1.25);
    const img = product.images?.[0] || product.heroImage || product.hero_image || product.image || 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80';

    addItem({
      productId: prodId,
      id: prodId,
      name: product.name,
      price: price,
      unitPrice: price,
      originalPrice: origPrice,
      quantity: 1,
      variantLabel: product.variants?.[0]?.name || product.form || product.category || 'Curated Specimen',
      chakra: Array.isArray(product.chakra) ? product.chakra : [product.chakra].filter(Boolean),
      image: img,
    });
    setQuickAddedId(prodId);
    crystalAudio.playSingingBowl(528);
    setTimeout(() => setQuickAddedId(null), 2000);
  };

  const handleFilterVault = (categoryName) => {
    setSelectedCategory(categoryName);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('sanctuary-vault');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Filtered vault products from live Supabase / Canonical catalog
  const filteredVaultProducts = featuredProducts.filter((p) => {
    if (selectedCategory === 'All Masterworks') return true;
    const cat = (p.category || p.form || '').toLowerCase();
    const col = (p.collection || '').toLowerCase();
    const purp = (p.purpose || p.purposeLabel || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const chk = Array.isArray(p.chakra) ? p.chakra.join(' ').toLowerCase() : String(p.chakra || '').toLowerCase();
    const zod = (p.zodiac || '').toLowerCase();
    const sub = (p.subtitle || '').toLowerCase();

    if (selectedCategory === 'Numerology') {
      return cat.includes('number') || purp.includes('number') || name.includes('pyrite') || name.includes('moonstone') || name.includes('citrine') || name.includes('emerald');
    }
    if (selectedCategory === 'Astrology') {
      return zod !== '' || cat.includes('zodiac') || purp.includes('astro') || name.includes('amethyst') || name.includes('tiger') || name.includes('carnelian');
    }
    if (selectedCategory === 'Trees') {
      return cat.includes('tree') || name.includes('tree') || sub.includes('tree');
    }
    if (selectedCategory === 'Luxury Jewelry') {
      return cat.includes('bracelet') || cat.includes('mala') || cat.includes('pendant') || cat.includes('jewel') || name.includes('bracelet') || name.includes('mala') || name.includes('band') || name.includes('pendant');
    }
    if (selectedCategory === 'Chips') {
      return cat.includes('chip') || name.includes('chip') || name.includes('vial') || sub.includes('chip');
    }
    if (selectedCategory === 'Pyramids') {
      return cat.includes('pyramid') || name.includes('pyramid') || sub.includes('pyramid');
    }
    if (selectedCategory === 'Towers') {
      return cat.includes('tower') || cat.includes('point') || name.includes('tower') || name.includes('point') || name.includes('obelisk') || sub.includes('tower');
    }
    if (selectedCategory === 'Chakras') {
      return chk !== '' || cat.includes('chakra') || name.includes('chakra');
    }
    if (selectedCategory === 'Wealth & Abundance') {
      return purp.includes('wealth') || name.includes('pyrite') || name.includes('citrine') || name.includes('money') || chk.includes('solar');
    }
    if (selectedCategory === 'Protection & Shielding') {
      return purp.includes('protect') || name.includes('tourmaline') || name.includes('tiger') || name.includes('shield');
    }
    if (selectedCategory === 'Love & Harmony') {
      return purp.includes('love') || name.includes('rose') || name.includes('jade') || chk.includes('heart');
    }

    return (
      cat.includes(selectedCategory.toLowerCase()) ||
      col.includes(selectedCategory.toLowerCase()) ||
      purp.includes(selectedCategory.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-white selection:text-black overflow-x-hidden relative font-sans-ui w-full max-w-full">
      
      {/* 0. CINEMATIC FULL-SCREEN VIDEO PRELOADER (Plays Video 1 intro, reveals "WELCOME TO SUMUK CRYSTALZ 5", then transitions) */}
      <VideoPreloader
        videoSrc="/videos/video1.mp4"
        altVideoSrc="/videos/Video 1.mp4"
        mainTitle="WELCOME TO SUMUK CRYSTALZ 5"
        subtitle="SACRED ENERGY & INTENTIONAL HEALING STONES"
        onComplete={() => {}}
      />

      {/* 1. IMMERSIVE FULL-SCREEN CINEMATIC HERO VIDEO STAGE */}
      <section className="relative w-full max-w-full h-[85vh] sm:h-[90vh] lg:h-screen min-h-[540px] sm:min-h-[600px] flex flex-col justify-between overflow-hidden">
        
        {/* Full-Screen Dual-Layer Video Engine (Object-Fit Cover, 100%, 100%) */}
        <div className="absolute inset-0 z-0 w-full h-full max-w-full pointer-events-none overflow-hidden">
          <DynamicVideoEngine
            activeCrystal={activeCrystal}
            onAutoAdvance={handleAutoAdvance}
            lightingMode="natural"
          />
        </div>

        {/* Minimal Frosted-Glass Top HUD Overlay */}
        <header className="relative z-30 pt-4 sm:pt-6 md:pt-8 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
          
          {/* Empty spacer for header layout balance */}
          <div className="hidden sm:block" />

          <div className="pointer-events-auto flex items-center gap-3 ml-auto">
            <button
              onClick={openDrawer}
              className="px-3.5 sm:px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Vault ({cartCount})</span>
            </button>
          </div>
        </header>

        {/* Hero Central / Bottom Typography & Interactive Glass Segment Selector */}
        <div className="relative z-30 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto w-full flex flex-col items-start justify-end gap-4 sm:gap-6 pb-8 sm:pb-12 pointer-events-none">
          
          <div className="space-y-3 sm:space-y-4 max-w-3xl pointer-events-auto">

            {/* Specimen Main Title */}
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
              {activeCrystal.title}
            </h1>

            {/* Exact User-Specified Specimen Description */}
            <p className="text-sm sm:text-lg md:text-xl font-sans-ui text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-normal">
              {activeCrystal.description}
            </p>

            {/* Call to Action Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
              <Link
                href="/shop"
                className="btn-pill-primary text-xs px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.45)] active:scale-95"
              >
                <span>EXPLORE SANCTUARY SHOP</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </Link>

              <a
                href="#sanctuary-vault"
                className="btn-pill-secondary text-xs px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ACQUIRE FROM VAULT</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 LIVE CONSECRATED PRODUCT SLIDESHOW SHOWCASE */}
      <section className="relative z-20 my-6 sm:my-8">
        <LiveProductSlideshow />
      </section>

      {/* 3. DUAL-TIER HORIZONTAL TICKER (Intentions & Modalities) */}
      <div className="w-full relative z-20">
        <DualTierFilterTicker />
      </div>

      {/* 4. DIRECT ACCESS SACRED CRYSTAL FILTERS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d text-xs font-sans-ui uppercase tracking-wider text-amber-300 font-semibold border border-amber-500/30 bg-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Direct Access Sacred Discovery</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white text-3d-title">
            Crystals Curated by Form &amp; Energy
          </h2>
          <p className="text-xs sm:text-sm font-sans-ui text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Direct filter access to authentic museum-grade crystals calibrated for numerology, astrology, sacred trees, luxury jewelry, chips, pyramids, towers, and sacred energy centers.
          </p>

          {/* Quick Filter Pill Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {POPULAR_FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterVault(cat.vaultCategory)}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider border border-white/10 bg-white/5 hover:bg-amber-500/20 hover:border-amber-400/50 hover:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <cat.icon className="w-3 h-3 text-amber-400" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_FILTER_CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className={`p-6 rounded-2xl bg-gradient-to-b ${c.color} border ${c.border} group flex flex-col justify-between shadow-2xl relative transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl`}
                style={{
                  boxShadow: `0 16px 40px -12px ${c.glow}`,
                }}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 group-hover:scale-110 transition-transform shadow-inner">
                      <Icon className="w-5 h-5" style={{ color: c.accent }} />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-neutral-300 uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-medium">
                      {c.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-editorial font-bold text-2xl text-white group-hover:text-amber-200 transition">
                    {c.name}
                  </h3>
                  <p className="text-xs font-sans-ui font-semibold mt-1" style={{ color: c.accent }}>
                    {c.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs font-sans-ui text-neutral-300/90 mt-3 leading-relaxed">
                    {c.desc}
                  </p>

                  {/* Specimen Highlights */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase block font-semibold mb-1">
                      Key Specimens:
                    </span>
                    <p className="text-[11px] font-sans-ui text-neutral-300">
                      {c.specimens}
                    </p>
                  </div>
                </div>

                {/* Bottom Dual Action Links */}
                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleFilterVault(c.vaultCategory)}
                    className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition group/btn cursor-pointer"
                    title={`Filter live vault below for ${c.name}`}
                  >
                    <span>Filter Vault</span>
                    <ArrowDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
                  </button>

                  <Link
                    href={c.href}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-bold bg-amber-400/15 hover:bg-amber-400 hover:text-black text-amber-300 border border-amber-400/35 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span>Shop All</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LUXURY E-KART VAULT & SANCTUARY STORE */}
      <section id="sanctuary-vault" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d text-xs font-sans-ui uppercase tracking-wider text-amber-300 font-semibold mb-2.5">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>Sanctuary Collection &bull; Vault Store</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white text-3d-title">
              Curated Specimen Vault
            </h2>
            <p className="text-xs sm:text-sm font-sans-ui text-neutral-400 mt-2 max-w-xl">
              Individually consecrated museum treasures. Free insured courier dispatch on orders over ₹5,000.
            </p>
          </div>

          <button
            onClick={openDrawer}
            className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center gap-3 text-xs font-mono uppercase tracking-[0.16em] font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] cursor-pointer transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-black text-amber-300 font-bold text-[9px] flex items-center justify-center border border-amber-400">
                  {cartCount}
                </span>
              )}
            </div>
            <span>YOUR VAULT ({cartCount})</span>
            <span className="font-mono font-black">₹{cartTotalFormatted}</span>
          </button>
        </div>

        {/* Vault Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-6">
          {VAULT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-lg scale-105'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Vault Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl p-6 bg-[#0c0b12] border border-white/10 flex flex-col justify-between shadow-2xl animate-pulse space-y-4"
              >
                <div className="aspect-square w-full rounded-2xl bg-white/5 border border-white/5" />
                <div className="h-5 w-3/4 bg-white/10 rounded-full" />
                <div className="h-3.5 w-1/2 bg-white/5 rounded-full" />
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="h-6 w-20 bg-white/10 rounded-full" />
                  <div className="h-8 w-24 bg-amber-400/20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVaultProducts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#0c0b12] border border-white/10">
            <Gem className="w-12 h-12 text-amber-400/60 mx-auto mb-4" />
            <h3 className="font-editorial text-2xl font-bold text-white mb-2">
              No Specimens in this Vault Category
            </h3>
            <p className="text-xs sm:text-sm font-sans-ui text-neutral-400 max-w-md mx-auto mb-6">
              All live specimens are synchronized directly with our sacred Supabase vault. Select another category or browse all masterworks.
            </p>
            <button
              onClick={() => setSelectedCategory('All Masterworks')}
              className="px-6 py-2.5 rounded-full bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer"
            >
              Show All Masterworks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVaultProducts.map((p) => {
              const prodId = p.id || p._id;
              const prodSlug = p.slug || prodId;
              const prodImage = p.images?.[0] || p.heroImage || p.hero_image || p.image || 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80';
              const prodPrice = Number(p.price || p.sellingPrice || p.selling_price || p.basePrice || 0);
              const prodOrigPrice = Number(p.originalPrice || p.original_price || (prodPrice ? prodPrice * 1.25 : 0));
              const prodCategory = p.category || p.form || 'Masterwork';

              return (
                <div
                  key={prodId}
                  className="rounded-3xl p-6 bg-[#0c0b12] border border-white/10 hover:border-amber-400/40 transition-all duration-500 flex flex-col justify-between group shadow-2xl relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <Link
                      href={`/product/${prodSlug}`}
                      className="relative block aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10"
                    >
                      <Image
                        src={prodImage}
                        alt={p.name || 'Crystal Specimen'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-amber-300">
                        {prodCategory}
                      </div>
                    </Link>

                    <div>
                      <Link href={`/product/${prodSlug}`}>
                        <h3 className="font-editorial text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition line-clamp-1 cursor-pointer">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-xs font-sans-ui text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {p.shortDescription || p.short_description || p.description || 'Authentic certified high-frequency mineral specimen.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-xl font-bold text-white">
                        ₹{prodPrice.toLocaleString('en-IN')}
                      </span>
                      {prodOrigPrice > prodPrice && (
                        <span className="text-xs text-neutral-500 font-mono line-through ml-2">
                          ₹{prodOrigPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(p)}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold uppercase tracking-[0.14em] flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      {quickAddedId === prodId ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
