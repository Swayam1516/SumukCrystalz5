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

const DEFAULT_FEATURED_PRODUCTS = [
  {
    _id: 'prod-amethyst-1',
    name: 'Royal Amethyst Cathedral Geode',
    form: 'Cathedral Geodes',
    price: 14500,
    originalPrice: 18900,
    chakra: ['Crown', 'Third Eye'],
    rating: 5.0,
    reviewsCount: 38,
    stock: 3,
    images: ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Deep Brazilian purple crystal terminations encased in a 130 Ma volcanic basalt rind.',
  },
  {
    _id: 'prod-bracelet-1',
    name: 'Consecrated Aura Crystal Bracelet',
    form: 'Chatoyant Minerals',
    price: 3499,
    originalPrice: 4999,
    chakra: ['Aura', 'Solar Plexus'],
    rating: 5.0,
    reviewsCount: 47,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Serves as a wearable conduit to keep the specific metaphysical energies connected to your personal aura.',
  },
  {
    _id: 'prod-rose-1',
    name: 'Translucent Rose Quartz Lotus Matrix',
    form: 'Heart & Crown Quartz',
    price: 11200,
    originalPrice: 14000,
    chakra: ['Heart'],
    rating: 5.0,
    reviewsCount: 42,
    stock: 2,
    images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'The stone of universal love, fostering emotional healing, compassion, and deeper harmony.',
  },
  {
    _id: 'prod-aventurine-1',
    name: 'Green Aventurine Opportunity Cluster',
    form: 'Sacred Energy Crystals',
    price: 9600,
    originalPrice: 12800,
    chakra: ['Heart', 'Solar Plexus'],
    rating: 4.9,
    reviewsCount: 31,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Stone of opportunity that attracts good luck, wealth, and abundance.',
  },
  {
    _id: 'prod-tiger-1',
    name: 'Chatoyant Tiger’s Eye Polished Monolith',
    form: 'Chatoyant Minerals',
    price: 9800,
    originalPrice: 12500,
    chakra: ['Solar Plexus', 'Root'],
    rating: 4.9,
    reviewsCount: 29,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'A grounding stone of courage and protection that boosts self-confidence, willpower, and focus.',
  },
  {
    _id: 'prod-citrine-1',
    name: 'Natural Sunset Citrine Cathedral Point',
    form: 'Sacred Energy Crystals',
    price: 13400,
    originalPrice: 16800,
    chakra: ['Solar Plexus', 'Sacral'],
    rating: 4.9,
    reviewsCount: 22,
    stock: 2,
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Unheated honey-amber quartz crystal point radiating warm sovereign vitality.',
  },
];

export default function HomePage() {
  const router = useRouter();
  
  // Active crystal index: Starts on Video 2 (Index 0 in CRYSTAL_CATALOG: Amethyst)
  const [activeCrystalIndex, setActiveCrystalIndex] = useState(0);
  const activeCrystal = CRYSTAL_CATALOG[activeCrystalIndex] || CRYSTAL_CATALOG[0];

  // Cart store
  const { addItem, openDrawer, getTotalCount, getTotalPrice } = useCartStore();
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Masterworks');

  // Featured masterworks state - initialized with rich masterworks catalog for instant zero-flicker loading
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);

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
    addItem({
      productId: product._id,
      id: product._id,
      name: product.name,
      price: product.price,
      unitPrice: product.price,
      quantity: 1,
      variantLabel: product.form || 'Curated Specimen',
      chakra: product.chakra || [],
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    });
    setQuickAddedId(product._id);
    crystalAudio.playSingingBowl(528);
    setTimeout(() => setQuickAddedId(null), 2000);
  };

  // Filtered vault products
  const filteredVaultProducts = featuredProducts.filter((p) => {
    if (selectedCategory === 'All Masterworks') return true;
    return p.form === selectedCategory || p.chakra?.includes(selectedCategory);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVaultProducts.map((p) => (
            <div
              key={p._id}
              className="rounded-3xl p-6 bg-[#0c0b12] border border-white/10 hover:border-amber-400/40 transition-all duration-500 flex flex-col justify-between group shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                  <Image
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80'}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-amber-300">
                    {p.form}
                  </div>
                </div>

                <div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs font-sans-ui text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-xl font-bold text-white">
                    ₹{Number(p.price || 0).toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice ? (
                    <span className="text-xs text-neutral-500 font-mono line-through ml-2">
                      ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono line-through ml-2">
                      ₹{Number((p.price || 0) * 1.25).toFixed(0)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAdd(p)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold uppercase tracking-[0.14em] flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  {quickAddedId === p._id ? (
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
          ))}
        </div>
      </section>
    </div>
  );
}
