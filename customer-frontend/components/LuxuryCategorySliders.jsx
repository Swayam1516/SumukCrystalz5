'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../store/useCart';
import { getSupabaseProducts } from '../lib/supabase';
import { ENERGY_STONES_CATALOG } from '../data/energyStones';
import { crystalAudio } from '../utils/harmonicResonance';
import {
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Heart,
  Gem,
  Trees,
  Award,
  Eye,
  Gift,
  Flame,
} from 'lucide-react';

export const CATEGORY_DEFINITIONS = [
  {
    id: 'bracelets',
    title: 'Luxury Crystal Bracelets',
    subtitle: 'Calibrated Natural Gemstone Energy Bands',
    banner: '/assets/banners/bracelets-banner.jpg',
    filterKeywords: ['bracelet', 'bracelete', 'band'],
    icon: Gem,
    trustBadges: [
      { label: '100% Natural Crystals', desc: 'Sourced from Brazilian & African mines' },
      { label: 'Authentic & Premium', desc: 'Museum-grade natural minerals' },
      { label: 'Handcrafted Bracelets', desc: 'Tied on durable elastic sacred cords' },
      { label: 'Perfect for Gifting', desc: 'Presented in luxury velvet box' },
    ],
  },
  {
    id: 'malas',
    title: 'Luxury Crystal Malas',
    subtitle: 'For Meditation • Healing • Positivity • Spiritual Growth',
    banner: '/assets/banners/malas-banner.jpg',
    filterKeywords: ['mala', 'shiva', 'rudraksha', 'meditation'],
    icon: Award,
    trustBadges: [
      { label: '100% Natural Crystals', desc: '108 consecrated prayer beads' },
      { label: 'Authentic & Premium Quality', desc: 'Individually hand-knotted' },
      { label: 'Ideal for Meditation', desc: '432Hz Solfeggio sound attuned' },
      { label: 'Handcrafted with Care', desc: 'Traditional tassel & guru bead' },
      { label: 'Perfect for Gifting', desc: 'Sacred protective pouch included' },
    ],
  },
  {
    id: 'stones',
    title: 'Luxury Crystal Stones',
    subtitle: 'Raw Clusters • Pyrite Geodes • Scrying Spheres',
    banner: '/assets/banners/stones-banner.jpg',
    filterKeywords: ['pyrite', 'cluster', 'point', 'wand', 'plate', 'geode', 'stone'],
    icon: Sparkles,
    trustBadges: [
      { label: '100% Natural Crystals', desc: 'Unheated raw earth specimens' },
      { label: 'Authentic & Premium', desc: 'Vedic consecrated by Soumyaa Naveen' },
      { label: 'Ethically Sourced', desc: 'Zero synthetic dyes or heat treatments' },
      { label: 'Perfect for Healing', desc: 'Deep home & office energy balance' },
    ],
  },
  {
    id: 'trees',
    title: 'Gemstone Trees',
    subtitle: 'Bring Positivity, Balance & Prosperity into Your Space',
    banner: '/assets/banners/trees-banner.jpg',
    filterKeywords: ['tree', 'bonsai'],
    icon: Trees,
    trustBadges: [
      { label: '100% Natural Crystals', desc: '300+ authentic gemstone chips' },
      { label: 'Raw Geode Base', desc: 'Heavy unheated mineral foundation' },
      { label: 'Vastu & Feng Shui', desc: 'North & East prosperity anchor' },
      { label: 'Handcrafted Art', desc: 'Sacred twisted brass branches' },
    ],
  },
  {
    id: 'decor',
    title: 'Luxury Home Décor',
    subtitle: 'Vastu Charging Plates • Sacred Clusters • Altar Pyramids',
    banner: '/assets/banners/trees-banner.jpg',
    filterKeywords: ['plate', 'selenite', 'sphere', 'altar', 'decor', 'cluster', 'point', 'mirror'],
    icon: Flame,
    trustBadges: [
      { label: 'Consecrated Altarpieces', desc: 'Vedic blessed by Soumyaa Naveen' },
      { label: 'High Vibrational', desc: 'Continuous spatial energy cleansing' },
      { label: 'Museum Quality', desc: 'Natural untampered raw crystals' },
      { label: 'Safe Delivery', desc: 'Reinforced luxury protective vault box' },
    ],
  },
];

export default function LuxuryCategorySliders() {
  const { addItem, openDrawer } = useCartStore();
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState(ENERGY_STONES_CATALOG);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const sliderRefs = useRef({});

  // Fetch real live products from Supabase and merge with catalog
  useEffect(() => {
    let isMounted = true;
    getSupabaseProducts(true)
      .then((items) => {
        if (!isMounted || !items || items.length === 0) return;
        // Merge Supabase products with catalog, avoiding duplicates by slug/id
        const merged = [...items];
        for (const catProd of ENERGY_STONES_CATALOG) {
          if (!merged.some((m) => m.slug === catProd.slug || m.id === catProd.id)) {
            merged.push(catProd);
          }
        }
        setProducts(merged);
      })
      .catch((err) => {
        console.warn('Luxury Category Sliders load note:', err.message);
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
    try {
      crystalAudio?.playSingingBowl(528);
    } catch (_) {}
    setTimeout(() => setQuickAddedId(null), 1800);
    openDrawer();
  };

  const scrollSlider = (catId, direction) => {
    const el = sliderRefs.current[catId];
    if (!el) return;
    const amount = direction === 'left' ? -360 : 360;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Filter products for a specific category definition
  const getCategoryProducts = (catDef) => {
    return products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || p.shortDescription || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const slug = (p.slug || '').toLowerCase();

      if (catDef.id === 'trees') {
        return name.includes('tree') || desc.includes('tree') || cat.includes('tree') || slug.includes('tree');
      }

      if (catDef.id === 'decor') {
        const isDecor = catDef.filterKeywords.some((kw) =>
          name.includes(kw) || desc.includes(kw) || cat.includes(kw) || slug.includes(kw)
        );
        const isWearable = name.includes('bracelet') || slug.includes('bracelet') || name.includes('mala');
        return isDecor && !isWearable && !name.includes('tree');
      }

      if (catDef.id === 'stones') {
        const isStone = catDef.filterKeywords.some((kw) =>
          name.includes(kw) || desc.includes(kw) || cat.includes(kw) || slug.includes(kw)
        );
        const isWearable = name.includes('bracelet') || slug.includes('bracelet') || name.includes('mala');
        return isStone && !isWearable && !name.includes('tree');
      }

      if (catDef.id === 'malas') {
        return catDef.filterKeywords.some((kw) =>
          name.includes(kw) || desc.includes(kw) || cat.includes(kw) || slug.includes(kw)
        ) && !name.includes('tree');
      }

      return catDef.filterKeywords.some((kw) =>
        name.includes(kw) || desc.includes(kw) || cat.includes(kw) || slug.includes(kw)
      );
    });
  };

  const visibleCategories =
    activeTab === 'all'
      ? CATEGORY_DEFINITIONS
      : CATEGORY_DEFINITIONS.filter((c) => c.id === activeTab);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 select-none font-sans-ui">
      
      {/* ══════════════════════════════════════════════════════════
          1. SECTION HEADER & LUXURY CATEGORY SELECTOR TABS
         ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EAE2F2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans uppercase tracking-widest text-[#79539B] bg-[#EAE2F2] border border-[#EAE2F2] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
            <span>Masterwork Sanctuary Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29242D] tracking-tight">
            Curated Crystal Categories
          </h2>
          <p className="text-sm text-[#29242D]/70 mt-1 max-w-xl font-sans">
            Explore authentic consecrated crystals, sacred prayer malas, raw mineral specimens, and gemstone home décor.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#79539B] text-white shadow-md'
                : 'bg-white hover:bg-[#EAE2F2] text-[#29242D] border border-[#EAE2F2]'
            }`}
          >
            All Collections
          </button>

          {CATEGORY_DEFINITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveTab(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === c.id
                  ? 'bg-[#79539B] text-white shadow-md'
                  : 'bg-white hover:bg-[#EAE2F2] text-[#29242D] border border-[#EAE2F2]'
              }`}
            >
              {c.title.replace('Luxury ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. CATEGORY COLLECTION SLIDERS
         ══════════════════════════════════════════════════════════ */}
      {visibleCategories.map((catDef) => {
        const catProducts = getCategoryProducts(catDef);

        return (
          <div key={catDef.id} className="space-y-6 pt-4">
            
            {/* ── A. Masterwork Cinematic Artwork Banner ── */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] rounded-3xl overflow-hidden shadow-xl border border-[#EEDBBA] bg-stone-950 group">
              <Image
                src={catDef.banner}
                alt={catDef.title}
                fill
                sizes="100vw"
                priority
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 filter brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Banner Floating Overlay Bar */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold block drop-shadow-md">
                    Sumuk Crystalz 5 &bull; Sacred Sanctuary
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {catDef.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 font-sans drop-shadow-md">
                    {catDef.subtitle}
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <span>Explore Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </Link>
              </div>
            </div>

            {/* ── B. Horizontal Touch-Friendly Product Slider ── */}
            <div className="relative group/slider">
              
              {/* Left Arrow Controller */}
              <button
                type="button"
                onClick={() => scrollSlider(catDef.id, 'left')}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-stone-800 hover:text-amber-700 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/slider:opacity-100"
                aria-label={`Scroll ${catDef.title} left`}
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Right Arrow Controller */}
              <button
                type="button"
                onClick={() => scrollSlider(catDef.id, 'right')}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-stone-800 hover:text-amber-700 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/slider:opacity-100"
                aria-label={`Scroll ${catDef.title} right`}
              >
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Scrollable Track */}
              <div
                ref={(el) => (sliderRefs.current[catDef.id] = el)}
                className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {catProducts.map((p) => {
                  const prodId = p.id || p._id;
                  const prodSlug = p.slug || prodId;
                  const prodImg =
                    p.images?.[0] ||
                    p.heroImage ||
                    p.image ||
                    '/images/products/pyrite.jpg';
                  const price = Number(p.price || p.sellingPrice || p.selling_price || 699);
                  const origPrice = Number(p.originalPrice || p.original_price || Math.round(price * 1.3));
                  const discount =
                    p.discountPercent ||
                    (origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0);

                  return (
                    <div
                      key={prodId}
                      className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0 rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] hover:border-[#79539B]/40 shadow-[0_4px_20px_rgba(41,36,45,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Product Thumbnail Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F6F2]">
                        <Link href={`/product/${prodSlug}`} className="block w-full h-full">
                          <Image
                            src={prodImg}
                            alt={p.name || 'Crystal Specimen'}
                            fill
                            sizes="300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EAE2F2]/90 text-[#79539B] text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-md border border-[#EAE2F2] shadow-xs">
                            {p.badge || 'CONSECRATED'}
                          </span>
                        </div>

                        {discount > 0 && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-sans font-bold shadow-sm">
                            {discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-transparent space-y-3">
                        <div className="space-y-1">
                          {/* Rating */}
                          <div className="flex items-center gap-1 text-[#C8A65E] text-xs">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-3 h-3 fill-[#C8A65E] text-[#C8A65E]" />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-[#29242D]/80">{p.rating || 5.0}</span>
                          </div>

                          <Link href={`/product/${prodSlug}`}>
                            <h4 className="font-serif text-base font-bold text-[#29242D] group-hover:text-[#79539B] transition line-clamp-1 leading-snug">
                              {p.name}
                            </h4>
                          </Link>

                          <p className="text-xs text-[#29242D]/70 line-clamp-1 font-sans">
                            {p.subtitle || p.shortDescription || 'Natural gemstone cleansed with sound attunement.'}
                          </p>
                        </div>

                        {/* Price & Quick Add Button (Prices: clean, highly readable sans-serif) */}
                        <div className="pt-3 border-t border-[#EAE2F2]/60 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-sans text-lg font-bold tabular-nums text-[#29242D]">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                            {origPrice > price && (
                              <span className="text-xs text-[#29242D]/40 font-sans tabular-nums line-through ml-1.5">
                                ₹{origPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(p, e)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#79539B] hover:bg-[#684587] active:scale-95 text-white text-xs font-sans font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── C. Category Trust Strip ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-stone-50 to-amber-50/70 border border-amber-200/60 shadow-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {catDef.trustBadges.slice(0, 4).map((badge, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 text-[#B45309] flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {badge.label}
                      </p>
                      <p className="text-[10.5px] text-stone-500 truncate">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })}

    </section>
  );
}
