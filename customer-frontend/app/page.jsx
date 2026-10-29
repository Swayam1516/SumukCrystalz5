'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import { getSupabaseProducts } from '../lib/supabase';
import Cinematic3DCrystalHero from '../components/Cinematic3DCrystalHero';
import CoverFlow3DSlideshow from '../components/CoverFlow3DSlideshow';

import DirectFounderContactSection from '../components/DirectFounderContactSection';
import DualTierFilterTicker from '../components/DualTierFilterTicker';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  ExternalLink,
  Crown,
  Trees,
  Gem,
  Compass,
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
  const router = useRouter();
  const { addItem, openDrawer } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Fetch real featured products from Supabase
  useEffect(() => {
    let isMounted = true;
    getSupabaseProducts(true)
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          setProducts(items.slice(0, 6));
        }
      })
      .catch((err) => console.warn('Supabase product sync note:', err.message))
      .finally(() => {
        if (isMounted) setLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const prodId = product.id || product._id;
    const price = Number(product.price || product.sellingPrice || product.selling_price || 699);
    const origPrice = Number(product.originalPrice || product.original_price || Math.round(price * 1.3));
    const img =
      product.images?.[0] ||
      product.heroImage ||
      product.image ||
      '/images/products/pyrite.jpg';

    addItem({
      productId: prodId,
      id: prodId,
      name: product.name,
      price: price,
      unitPrice: price,
      originalPrice: origPrice,
      quantity: 1,
      variantLabel: product.variants?.[0]?.name || product.beadSize || 'Natural Standard Specimen',
      image: img,
    });

    setQuickAddedId(prodId);
    setTimeout(() => setQuickAddedId(null), 1800);
    openDrawer();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A15] selection:bg-amber-400 selection:text-black overflow-x-hidden relative font-sans-ui w-full max-w-full">
      
      {/* ══════════════════════════════════════════════════════════
          1. CINEMATIC 3D CRYSTAL HERO
          Genuine Three.js / React Three Fiber interactive gemstone stage
         ══════════════════════════════════════════════════════════ */}
      <Cinematic3DCrystalHero />

      {/* ══════════════════════════════════════════════════════════
          SACRED SANCTUARY WELCOME BANNER
          Featuring Lord Ganesha Consecrated Welcome Artwork
         ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C0812] via-[#1A1224] to-[#0C0812] border border-[#D4AF37]/35 shadow-[0_15px_50px_rgba(212,175,55,0.15)] flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 gap-8">
          {/* Left Text */}
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C378] text-xs font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Consecrated Sanctuary Initiation</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF0C2] to-[#D4AF37]">Sumuk Crystalz 5</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              Every masterwork specimen in our vault is purified and consecrated with Vedic mantras under divine auspices, radiating harmonic peace, protection, and boundless manifestation into your sacred space.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-sacred-intro'));
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#c59e2f] hover:to-[#dfbe52] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>View Full Blessing Banner</span>
                <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              </button>
              <Link
                href="/shop"
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium uppercase tracking-wider transition-all"
              >
                <span>Explore Vault</span>
              </Link>
            </div>
          </div>

          {/* Right Image Container */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-sacred-intro'));
              }
            }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/14] rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group cursor-pointer flex-shrink-0"
          >
            <Image
              src="/images/ganesha-opening-mobile.jpg"
              alt="Welcome to Sumuk Crystalz 5 - Sacred Ganesha Blessing"
              fill
              sizes="(max-width: 768px) 280px, 320px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-[11px] font-mono text-amber-200 uppercase tracking-widest flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Tap to Expand Blessing</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. INTERACTIVE 3D FEATURED COLLECTION
          Perspective Cover-Flow Carousel (Tiger's Eye, Amethyst, Pyrite, etc.)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 my-8 sm:my-14">
        <CoverFlow3DSlideshow />
      </section>

      {/* ══════════════════════════════════════════════════════════
          DUAL-TIER HORIZONTAL DISCOVERY TICKER
         ══════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-20 my-6">
        <DualTierFilterTicker />
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. CURATED CRYSTAL CATEGORIES
          Editorial Luxury Layout (Clean photography, balanced typography)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#B45309] bg-amber-50 border border-amber-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Curation</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Curated by Form &amp; Intention
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-700 hover:text-[#B45309] font-bold transition-colors"
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
              className="group block rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200 font-bold block">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                <p className="text-xs text-stone-600 font-sans-ui leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-[#B45309] uppercase tracking-wider">
                  <span>View Collection</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FEATURED PRODUCTS WITH CLEAN SHOPPING CONTROLS
          Direct Supabase synchronisation with live prices and add-to-cart
         ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-stone-600 bg-stone-100 mb-2">
              <Gem className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Live Synchronized Vault</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Featured Sanctuary Masterworks
            </h2>
          </div>
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-sm"
          >
            <span>View Full Catalog</span>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-3xl p-6 bg-white border border-stone-200 animate-pulse space-y-4">
                <div className="aspect-square w-full rounded-2xl bg-stone-100" />
                <div className="h-4 w-3/4 bg-stone-100 rounded-full" />
                <div className="h-3 w-1/2 bg-stone-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((p) => {
              const prodId = p.id || p._id;
              const prodSlug = p.slug || prodId;
              const prodImage =
                p.images?.[0] ||
                p.heroImage ||
                p.image ||
                '/images/products/pyrite.jpg';
              const price = Number(p.price || p.sellingPrice || p.selling_price || 699);
              const origPrice = Number(p.originalPrice || p.original_price || Math.round(price * 1.3));

              return (
                <div
                  key={prodId}
                  className="rounded-3xl p-5 bg-white border border-stone-200/90 hover:border-amber-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <Link
                      href={`/product/${prodSlug}`}
                      className="relative block aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-100"
                    >
                      <Image
                        src={prodImage}
                        alt={p.name || 'Crystal Masterwork'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.category && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-800 font-bold">
                          {p.category}
                        </div>
                      )}
                    </Link>

                    <div>
                      <Link href={`/product/${prodSlug}`}>
                        <h3 className="font-editorial text-lg font-bold text-stone-900 group-hover:text-[#B45309] transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-500 font-sans-ui mt-1 line-clamp-2 leading-relaxed">
                        {p.shortDescription || p.description || 'Natural mineral specimen carefully selected and cleansed with sound bowl attunement.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-lg font-bold text-stone-900">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {origPrice > price && (
                        <span className="text-xs text-stone-400 font-mono line-through ml-2">
                          ₹{origPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] active:scale-95 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      {quickAddedId === prodId ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
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



      {/* ══════════════════════════════════════════════════════════
          6. HEALING & CONSULTATION SERVICES OVERVIEW
          Personalized guidance by Usui Reiki Master Soumyaa Naveen
         ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-stone-200">
        <div className="rounded-3xl bg-gradient-to-br from-[#1A1124] to-[#120B1A] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-mono uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SACRED MODALITIES BY SOUMYAA</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Energy Healing &amp; Metaphysical Guidance.
              </h2>

              <p className="text-sm sm:text-base text-stone-300 font-sans-ui leading-relaxed max-w-xl font-light">
                Consult with certified Usui Reiki Master Soumyaa Naveen to identify energetic imbalances, decode your vibrational numerology blueprint, or receive tailored gemstone recommendations for your sanctuary.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-stone-950 text-xs font-mono uppercase tracking-[0.18em] font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore All 9 Modalities</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919111716355?text=Hello%20Soumyaa%2C%20I%20would%20like%20to%20inquire%20about%20a%20personal%20healing%20session."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 border border-white/10 text-xs font-mono uppercase tracking-[0.16em] transition-all flex items-center gap-2"
                >
                  <span>Direct WhatsApp Booking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                <h4 className="font-editorial text-sm font-bold text-white">Numerology Blueprint</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">In-depth life path &amp; karmic cycle dossier.</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                <h4 className="font-editorial text-sm font-bold text-white">Usui Reiki Healing</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">Distance chakra alignment &amp; aura restoration.</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                <h4 className="font-editorial text-sm font-bold text-white">Vastu Mineral Grid</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">Curated gemstone layouts for home &amp; workspaces.</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                <h4 className="font-editorial text-sm font-bold text-white">Sound Attunement</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">Solfeggio singing bowl mineral charging.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. SIMPLIFIED DIRECT FOUNDER CONTACT SECTION
          Unified luxury layout with direct WhatsApp routing
         ══════════════════════════════════════════════════════════ */}
      <DirectFounderContactSection />

    </div>
  );
}
