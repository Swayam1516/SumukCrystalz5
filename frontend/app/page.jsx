'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import DynamicVideoEngine from '../components/DynamicVideoEngine';
import SpecimenDossier from '../components/SpecimenDossier';
import VideoPreloader from '../components/VideoPreloader';
import DualTierFilterTicker from '../components/DualTierFilterTicker';
import ProvenanceTrustCards from '../components/ProvenanceTrustCards';
import { CRYSTAL_CATALOG } from '../data/crystals';
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
} from 'lucide-react';

const CHAKRA_ALIGNMENT = [
  { name: 'Crown', crystal: 'Amethyst', hz: '528 Hz', color: 'from-purple-900/60 to-black', border: 'border-purple-500/50', accent: '#c084fc', glow: 'rgba(168, 85, 247, 0.45)', desc: 'Spiritual Attunement & Conscious Clarity' },
  { name: 'Third Eye', crystal: 'Labradorite', hz: '852 Hz', color: 'from-indigo-900/60 to-black', border: 'border-indigo-500/50', accent: '#818cf8', glow: 'rgba(99, 102, 241, 0.45)', desc: 'Intuitive Vision & Lucid Perception' },
  { name: 'Throat', crystal: 'Aquamarine', hz: '741 Hz', color: 'from-cyan-900/60 to-black', border: 'border-cyan-500/50', accent: '#22d3ee', glow: 'rgba(6, 182, 212, 0.45)', desc: 'Authentic Expression & Sovereign Truth' },
  { name: 'Heart', crystal: 'Rose Quartz', hz: '639 Hz', color: 'from-pink-900/60 to-black', border: 'border-pink-500/50', accent: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', desc: 'Unconditional Love & Auric Healing' },
  { name: 'Solar Plexus', crystal: "Tiger's Eye", hz: '320 Hz', color: 'from-amber-900/60 to-black', border: 'border-amber-500/50', accent: '#f5d47a', glow: 'rgba(245, 212, 122, 0.45)', desc: 'Sovereign Will & Grounded Power' },
  { name: 'Sacral', crystal: 'Carnelian', hz: '417 Hz', color: 'from-orange-900/60 to-black', border: 'border-orange-500/50', accent: '#fb923c', glow: 'rgba(251, 146, 60, 0.45)', desc: 'Creative Genesis & Emotional Vitality' },
  { name: 'Root', crystal: 'Black Tourmaline', hz: '396 Hz', color: 'from-rose-950/70 to-black', border: 'border-rose-800/50', accent: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)', desc: 'Deep Earth Grounding & Shielding' },
];

const VAULT_CATEGORIES = [
  'All Masterworks',
  'Cathedral Geodes',
  'Chatoyant Minerals',
  'Heart & Crown Quartz',
  'Sacred Energy Crystals',
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

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

  // Fetch live products from backend Supabase API
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.products || []);
          if (isMounted) {
            setFeaturedProducts(items);
          }
        }
      } catch (err) {
        console.warn('Customer storefront live products fetch notice:', err.message);
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

  // Filtered vault products from live Supabase data
  const filteredVaultProducts = featuredProducts.filter((p) => {
    if (selectedCategory === 'All Masterworks') return true;
    const cat = p.category || p.form || '';
    const col = p.collection || '';
    const chk = Array.isArray(p.chakra) ? p.chakra.join(' ') : (p.chakra || '');
    return (
      cat.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      col.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      chk.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-white selection:text-black overflow-x-hidden relative font-sans-ui">
      
      {/* 0. CINEMATIC FULL-SCREEN VIDEO PRELOADER (Plays Video 1 intro, reveals "WELCOME TO SUMUK CRYSTALZ 5", then transitions) */}
      <VideoPreloader
        videoSrc="/videos/video1.mp4"
        altVideoSrc="/videos/Video 1.mp4"
        mainTitle="WELCOME TO SUMUK CRYSTALZ 5"
        subtitle="SACRED ENERGY & INTENTIONAL HEALING STONES"
        onComplete={() => {}}
      />

      {/* 1. IMMERSIVE FULL-SCREEN CINEMATIC HERO VIDEO STAGE */}
      <section className="relative w-screen h-screen min-h-screen flex flex-col justify-between overflow-hidden">
        
        {/* Full-Screen Dual-Layer Video Engine (Object-Fit Cover, 100vw, 100vh) */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <DynamicVideoEngine
            activeCrystal={activeCrystal}
            onAutoAdvance={handleAutoAdvance}
            lightingMode="natural"
          />
        </div>

        {/* Minimal Frosted-Glass Top HUD Overlay */}
        <header className="relative z-30 pt-6 sm:pt-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
          
          {/* Empty spacer for header layout balance */}
          <div className="hidden sm:block" />

          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={openDrawer}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Vault ({cartCount})</span>
            </button>
          </div>
        </header>

        {/* Hero Central / Bottom Typography & Interactive Glass Segment Selector */}
        <div className="relative z-30 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col items-start justify-end gap-6 pb-12 pointer-events-none">
          
          <div className="space-y-4 max-w-3xl pointer-events-auto">

            {/* Specimen Main Title */}
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
              {activeCrystal.title}
            </h1>

            {/* Exact User-Specified Specimen Description */}
            <p className="text-base sm:text-xl font-sans-ui text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-normal">
              {activeCrystal.description}
            </p>

            {/* Call to Action Bar (Matching Image 1 Pill Styles) */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#specimen-dossier"
                className="btn-pill-primary text-xs px-8 py-3.5 rounded-full flex items-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.45)]"
              >
                <span>EXAMINE SPECIMEN</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </a>

              <a
                href="#sanctuary-vault"
                className="btn-pill-secondary text-xs px-8 py-3.5 rounded-full flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ACQUIRE FROM VAULT</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROVENANCE TRUST REGISTER (Matching Image 3) */}
      <section className="relative z-20 -mt-6 sm:-mt-8 mb-4">
        <ProvenanceTrustCards />
      </section>

      {/* 3. DUAL-TIER HORIZONTAL TICKER (Intentions & Modalities) */}
      <div className="w-full relative z-20">
        <DualTierFilterTicker />
      </div>

      {/* 4. SPECIMEN DOSSIER (Detailed Metaphysical Analysis & Direct Acquisition) */}
      <div id="specimen-dossier">
        <SpecimenDossier activeCrystal={activeCrystal} />
      </div>

      {/* 4. 3D CHAKRA ALIGNMENT OPTIONS TILES */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d text-xs font-sans-ui uppercase tracking-wider text-amber-300 font-semibold">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Harmonic Energetic Architecture</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white text-3d-title">
            Curated by Chakra Alignment
          </h2>
          <p className="text-xs sm:text-sm font-sans-ui text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Select a sacred energy center to explore authentic crystals calibrated to balance and elevate specific conscious frequencies.
          </p>
        </div>

        {/* 3D Animatic Chakra Option Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {CHAKRA_ALIGNMENT.map((c) => (
            <Link
              key={c.name}
              href={`/shop?chakra=${encodeURIComponent(c.name)}`}
              className={`chakra-option-3d p-5 rounded-2xl bg-gradient-to-b ${c.color} border ${c.border} group flex flex-col justify-between shadow-2xl relative overflow-hidden`}
              style={{
                boxShadow: `0 14px 35px -10px ${c.glow}`,
              }}
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block font-bold">
                  {c.hz}
                </span>
                <p className="font-editorial font-bold text-lg text-white mt-1 group-hover:text-amber-200 transition text-3d-subtle">
                  {c.name}
                </p>
                <p className="text-xs font-sans-ui font-semibold mt-1" style={{ color: c.accent }}>
                  {c.crystal}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/15">
                <p className="text-[11px] font-sans-ui text-neutral-300 line-clamp-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </Link>
          ))}
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
