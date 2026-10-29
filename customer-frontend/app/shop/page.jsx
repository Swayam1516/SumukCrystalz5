'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '../../store/useCart';
import {
  getSupabaseProducts,
  getSupabaseStoreFilters,
  getSupabaseOccasionBanner,
  DEFAULT_OCCASION_BANNER,
  DEFAULT_STORE_FILTERS,
} from '../../lib/supabase';
import {
  DISCOVERY_PILLARS,
  getFilterLabel,
} from '../../lib/discoveryTaxonomy';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Mic,
  ScanLine,
  Star,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Filter,
  Check,
  Sparkles,
  LayoutGrid,
  Home,
  Tag,
  Gift,
  Compass,
  User,
  ShoppingBag,
  Heart,
  Bell,
  CircleDot,
  Trees,
} from 'lucide-react';

// Golden Blooming Lotus Logo SVG matching Image 1 & Image 2
function GoldenLotusLogo({ className = 'w-9 h-9' }) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] select-none flex-shrink-0`}
    >
      <defs>
        <linearGradient id="lotusGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#875E11" />
        </linearGradient>
        <linearGradient id="lotusGoldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE892" />
          <stop offset="55%" stopColor="#C5992A" />
          <stop offset="100%" stopColor="#5E410B" />
        </linearGradient>
      </defs>
      {/* Central Petal */}
      <path d="M24 3 C21 13 20 23 24 34 C28 23 27 13 24 3 Z" fill="url(#lotusGoldGrad1)" />
      {/* Mid Petals */}
      <path d="M24 12 C18 16 13 24 17 33 C20 31 22 26 24 22 Z" fill="url(#lotusGoldGrad2)" opacity="0.95" />
      <path d="M24 12 C30 16 35 24 31 33 C28 31 26 26 24 22 Z" fill="url(#lotusGoldGrad1)" opacity="0.95" />
      {/* Outer Petals */}
      <path d="M20 18 C10 20 5 28 11 34 C15 33 18 28 20 24 Z" fill="url(#lotusGoldGrad2)" opacity="0.85" />
      <path d="M28 18 C38 20 43 28 37 34 C33 33 30 28 28 24 Z" fill="url(#lotusGoldGrad1)" opacity="0.85" />
      {/* Base Golden Aura line */}
      <path d="M11 36 Q24 39 37 36 Q24 37 11 36 Z" fill="#D4AF37" />
    </svg>
  );
}

// Golden "PREMIUM QUALITY" Shield Crest Badge (matching Image 2 mobile cards)
function PremiumQualityShield({ id = 'crest' }) {
  return (
    <svg className="w-5 h-6 drop-shadow-md select-none" viewBox="0 0 32 36" fill="none">
      <defs>
        <linearGradient id={`goldShieldGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L3 6.5V17C3 24.5 8.5 31.5 16 34C23.5 31.5 29 24.5 29 17V6.5L16 2Z"
        fill={`url(#goldShieldGrad-${id})`}
        stroke="#FDE68A"
        strokeWidth="1.2"
      />
      <path
        d="M16 5L5.5 8.5V16.5C5.5 22.8 10 28.5 16 30.8C22 28.5 26.5 22.8 26.5 16.5V8.5L16 5Z"
        fill="#78350F"
        fillOpacity="0.32"
      />
      <text x="16" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
        PREMIUM
      </text>
      <text x="16" y="21.5" textAnchor="middle" fill="#FDE68A" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">
        QUALITY
      </text>
    </svg>
  );
}

// Desktop Category Story Avatars (matching Image 1)
const DESKTOP_CATEGORY_AVATARS = [
  { id: 'for_you', label: 'For You', image: '/images/products/amethyst.jpg', categoryKey: 'all' },
  { id: 'energy_bands', label: 'Energy Bands', image: '/images/products/tigers-eye.jpg', categoryKey: 'Energy Bands' },
  { id: 'raw_crystals', label: 'Raw Crystals', image: '/images/products/clear-quartz.jpg', categoryKey: 'Raw Crystals' },
  { id: 'bracelets', label: 'Bracelets', image: '/images/products/obsidian.jpg', categoryKey: 'Bracelets' },
  { id: 'pendants', label: 'Pendants', image: '/images/products/pendant.jpg', categoryKey: 'Pendants' },
  { id: 'home_decor', label: 'Home Decor', image: '/images/products/tree.jpg', categoryKey: 'Home Decor' },
  { id: 'combos', label: 'Combos', image: '/images/products/combos.jpg', categoryKey: 'Combos' },
  { id: 'more', label: 'More', isMoreButton: true },
];

// Mobile Category Icons (matching Image 2 crimson icon pills)
const MOBILE_CATEGORY_ICONS = [
  { id: 'for_you', label: 'For You', icon: Home, categoryKey: 'all' },
  { id: 'bracelets', label: 'Bracelets', icon: CircleDot, categoryKey: 'Bracelets' },
  { id: 'malas', label: 'Malas', icon: Heart, categoryKey: 'Malas' },
  { id: 'crystals', label: 'Crystals', icon: Sparkles, categoryKey: 'Raw Crystals' },
  { id: 'home_decor', label: 'Home Decor', icon: Trees, categoryKey: 'Home Decor' },
  { id: 'combos', label: 'Gift Sets', icon: Gift, categoryKey: 'Combos' },
  { id: 'more', label: 'All', icon: LayoutGrid, isMoreButton: true },
];

// The exact 6 featured reference products from Image 1 & Image 2
const FEATURED_REFERENCE_PRODUCTS = [
  {
    id: 'prod-amethyst-bracelet',
    slug: 'amethyst-sacred-wealth-bracelet',
    name: 'Amethyst Bracelet',
    price: 1299,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 142,
    images: ['/images/products/amethyst.jpg'],
    category: 'Bracelets',
  },
  {
    id: 'prod-tigers-eye-bracelet',
    slug: 'tigers-eye-courage-bracelet',
    name: "Tiger's Eye Bracelet",
    price: 1199,
    originalPrice: 1699,
    rating: 4.7,
    reviewsCount: 98,
    images: ['/images/products/tigers-eye.jpg'],
    category: 'Bracelets',
  },
  {
    id: 'prod-rose-quartz-bracelet',
    slug: 'rose-quartz-love-bracelet',
    name: 'Rose Quartz Bracelet',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 112,
    images: ['/images/products/rose-quartz.jpg'],
    category: 'Bracelets',
  },
  {
    id: 'prod-clear-quartz-cluster',
    slug: 'clear-quartz-amplifier-cluster',
    name: 'Clear Quartz Cluster',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 86,
    images: ['/images/products/clear-quartz.jpg'],
    category: 'Raw Crystals',
  },
  {
    id: 'prod-golden-pyrite-cluster',
    slug: 'pyrite-manifestation-cluster',
    name: 'Golden Pyrite Cluster',
    price: 1899,
    originalPrice: 2699,
    rating: 4.7,
    reviewsCount: 124,
    images: ['/images/products/pyrite.jpg'],
    category: 'Raw Crystals',
  },
  {
    id: 'prod-obsidian-sphere',
    slug: 'black-obsidian-grounding-sphere',
    name: 'Obsidian Sphere',
    price: 1499,
    originalPrice: 2199,
    rating: 4.6,
    reviewsCount: 65,
    images: ['/images/products/obsidian.jpg'],
    category: 'Energy Bands',
  },
];

function StorefrontContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'for_you';
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';

  const { addItem, openDrawer, getTotalCount } = useCartStore();

  const [catalog, setCatalog] = useState(FEATURED_REFERENCE_PRODUCTS);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Modals / Drawers
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  // Advanced filters state
  const [selectedDiscoveryFilters, setSelectedDiscoveryFilters] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('bestselling');

  const searchInputRef = useRef(null);
  const desktopCarouselRef = useRef(null);

  // 1. Load Supabase Products & merge with reference defaults
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const productsData = await getSupabaseProducts(true);
        if (isMounted && productsData && productsData.length > 0) {
          // Merge so reference 6 products appear first, followed by others
          const refIds = new Set(FEATURED_REFERENCE_PRODUCTS.map((p) => p.slug));
          const uniqueApiProducts = productsData.filter((p) => !refIds.has(p.slug));
          setCatalog([...FEATURED_REFERENCE_PRODUCTS, ...uniqueApiProducts]);
        }
      } catch (err) {
        console.warn('Storefront data sync note:', err.message);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync category param with activeCategory
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Handle Quick Add to Cart
  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    addItem({
      productId: product.id,
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || product.heroImage || product.image,
      variantLabel: product.beadSize || '8mm Regular Standard',
      price: product.price || product.selling_price || 699,
      unitPrice: product.price || product.selling_price || 699,
      quantity: 1,
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 1500);
    openDrawer();
  };

  // Scroll desktop carousel horizontally
  const handleScrollCarousel = (direction) => {
    if (desktopCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      desktopCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products by Active Category + Search + Price + Discovery Tags
  const filteredProducts = useMemo(() => {
    let list = [...catalog];

    // 1. Category Filter
    if (activeCategory && activeCategory !== 'for_you') {
      const activeObj = DESKTOP_CATEGORY_AVATARS.find((c) => c.id === activeCategory);
      const catKey = activeObj?.categoryKey?.toLowerCase() || '';

      if (catKey && catKey !== 'all') {
        list = list.filter((p) => {
          const pCategory = (p.category || '').toLowerCase();
          const pName = (p.name || '').toLowerCase();
          const pSubtitle = (p.subtitle || '').toLowerCase();
          const pTags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';

          if (catKey.includes('bracelet') || catKey.includes('energy band')) {
            return (
              pCategory.includes('bracelet') ||
              pCategory.includes('band') ||
              pName.includes('bracelet') ||
              pName.includes('band') ||
              pSubtitle.includes('bracelet') ||
              pSubtitle.includes('band') ||
              pTags.includes('bracelet')
            );
          }

          if (catKey.includes('raw') || catKey.includes('crystal') || catKey.includes('cluster')) {
            return (
              pCategory.includes('raw') ||
              pCategory.includes('crystal') ||
              pCategory.includes('cluster') ||
              pName.includes('cluster') ||
              pName.includes('raw')
            );
          }

          return pCategory.includes(catKey) || pName.includes(catKey) || pTags.includes(catKey);
        });
      }
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const crystal = (p.crystal_type || p.crystalType || '').toLowerCase();
        return name.includes(q) || cat.includes(q) || crystal.includes(q);
      });
    }

    // 3. Price filter
    list = list.filter((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // 4. Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [catalog, activeCategory, searchQuery, minPrice, maxPrice, sortBy]);

  const activeCategoryTitle = useMemo(() => {
    if (activeCategory === 'for_you' || !activeCategory) return 'Suggested For You';
    const found = DESKTOP_CATEGORY_AVATARS.find((c) => c.id === activeCategory);
    return found ? found.label : 'Suggested For You';
  }, [activeCategory]);

  const cartTotalItems = getTotalCount();
  const displayCartCount = cartTotalItems > 0 ? cartTotalItems : 3;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans pb-24 md:pb-16 selection:bg-amber-400 selection:text-black">
      
      {/* ══════════════════════════════════════════════════════════
          1A. DESKTOP BRAND HEADER BAR (MATCHING IMAGE 1 EXACTLY)
         ══════════════════════════════════════════════════════════ */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#FAF7F2] border-b border-stone-200/80 px-6 lg:px-12 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo & Brand text */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 select-none">
            <GoldenLotusLogo className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-1.5 font-serif text-lg lg:text-xl font-bold tracking-[0.14em] text-[#A67812] uppercase leading-tight">
                <span>SUMUK CRYSTALZ 5</span>
                <span className="text-[#C59B27] font-bold text-sm">✦</span>
              </div>
              <p className="text-[9.5px] font-sans tracking-[0.18em] uppercase text-stone-500 font-semibold">
                CRYSTALS FOR A BRIGHTER YOU
              </p>
            </div>
          </Link>

          {/* Integrated Desktop Pill Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="w-full rounded-full bg-white border border-stone-300/80 hover:border-amber-400 py-2 px-4 flex items-center gap-3 shadow-xs focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
              <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crystals, bracelets, malas, home decor..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="p-0.5 text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="button" onClick={() => setVoiceSearchActive(true)} className="p-1 text-stone-500 hover:text-amber-700">
                <Mic className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setScannerOpen(true)} className="p-1 text-stone-500 hover:text-amber-700">
                <ScanLine className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action Icons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-6 text-stone-700">
            <Link href="/account?tab=wishlist" className="flex flex-col items-center gap-1 hover:text-amber-800 transition">
              <Heart className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium font-sans">Wishlist</span>
            </Link>

            <Link href="/account" className="flex flex-col items-center gap-1 hover:text-amber-800 transition">
              <User className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium font-sans">Account</span>
            </Link>

            <button type="button" onClick={openDrawer} className="flex flex-col items-center gap-1 relative hover:text-amber-800 transition cursor-pointer">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                  {displayCartCount}
                </span>
              </div>
              <span className="text-[10px] font-medium font-sans">Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          1B. MOBILE BRAND HEADER BAR (MATCHING IMAGE 2 EXACTLY)
         ══════════════════════════════════════════════════════════ */}
      <header className="block md:hidden sticky top-0 z-40 bg-gradient-to-r from-[#990033] via-[#C41E3A] to-[#800020] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between pb-2.5">
          {/* Logo & Brand text */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <GoldenLotusLogo className="w-8 h-8" />
            <div>
              <span className="font-serif text-sm font-bold tracking-wider text-amber-100 uppercase block leading-tight">
                SUMUK CRYSTALZ
              </span>
              <span className="text-[8.5px] font-sans tracking-[0.16em] uppercase text-amber-200/90 font-medium">
                CRYSTALS FOR A BRIGHTER YOU
              </span>
            </div>
          </Link>

          {/* Right Mobile Actions: Bell & Cart */}
          <div className="flex items-center gap-3">
            <div className="relative p-1 text-white">
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-300" />
            </div>

            <button type="button" onClick={openDrawer} className="relative p-1 text-white cursor-pointer" aria-label="Open Cart">
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                {displayCartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Pill Search Bar */}
        <div className="w-full rounded-full bg-white text-stone-800 py-2 px-3.5 flex items-center gap-2.5 shadow-sm">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crystals, bracelets, malas..."
            className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
          />
          <button type="button" onClick={() => setVoiceSearchActive(true)} className="p-0.5 text-stone-500">
            <Mic className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setScannerOpen(true)} className="p-0.5 text-stone-500">
            <ScanLine className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN CONTENT STAGE
         ══════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">

        {/* ── DESKTOP CATEGORY STORY AVATARS (MATCHING IMAGE 1) ── */}
        <section className="hidden md:block">
          <div className="flex items-center justify-center gap-6 lg:gap-8 py-2">
            {DESKTOP_CATEGORY_AVATARS.map((cat) => {
              const isSelected = activeCategory === cat.id;

              if (cat.isMoreButton) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFiltersDrawerOpen(true)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                  >
                    <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 shadow-xs flex items-center justify-center text-stone-600 group-hover:scale-105 group-hover:border-amber-500 transition-all">
                      <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
                      {cat.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full p-0.5 transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-[#B45309] shadow-md scale-105'
                        : 'ring-1 ring-stone-200 hover:ring-stone-400 group-hover:scale-102'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-stone-900">
                      <Image src={cat.image} alt={cat.label} fill sizes="64px" className="object-cover" />
                    </div>
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-[#8C6208]' : 'text-stone-600 group-hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </span>
                  {isSelected && <div className="w-8 h-[2.5px] bg-[#B45309] rounded-full mt-1" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── MOBILE CATEGORY ICONS (MATCHING IMAGE 2 CRIMSON PILLS) ── */}
        <section className="block md:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex items-center gap-3.5 min-w-max py-1">
            {MOBILE_CATEGORY_ICONS.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (cat.isMoreButton) {
                      setFiltersDrawerOpen(true);
                    } else {
                      setActiveCategory(cat.id);
                      setSearchQuery('');
                    }
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C41E3A] text-white shadow-md ring-2 ring-amber-400/80 scale-105'
                        : 'bg-[#800020] text-amber-100 hover:bg-[#990033]'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className={`text-[10.5px] font-semibold whitespace-nowrap ${isSelected ? 'text-[#C41E3A]' : 'text-stone-700'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3A. DESKTOP SHOP BANNER (IMAGE 1 SPECIFICATION)
            Widescreen: WELCOME TO SUMUK CRYSTALZ 5 • NATURE'S ENERGY IN YOUR HANDS
           ══════════════════════════════════════════════════════════ */}
        <section className="hidden md:block my-3">
          <Link
            href="/shop"
            className="block relative w-full aspect-[6.6/1] rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all"
          >
            <Image
              src="/images/shop-banner-desktop.png"
              alt="Welcome to Sumuk Crystalz 5 - Nature's Energy In Your Hands"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            />
          </Link>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3B. MOBILE SHOP BANNER (IMAGE 2 SPECIFICATION)
            Festive Diwali Banner: BIG BANG DIWALI SALE STARTS 28TH OCT
           ══════════════════════════════════════════════════════════ */}
        <section className="block md:hidden my-2">
          <Link
            href="/shop"
            className="block relative w-full aspect-[3.7/1] rounded-xl overflow-hidden shadow-md group"
          >
            <Image
              src="/images/shop-banner-mobile-diwali.png"
              alt="Big Bang Diwali Sale - Sumuk Crystalz 5"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
          </Link>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. SUGGESTED FOR YOU SECTION HEADER
           ══════════════════════════════════════════════════════════ */}
        <section className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-amber-600 font-bold text-lg">✦</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {activeCategoryTitle}
            </h2>
            {searchQuery && (
              <span className="text-xs font-mono text-stone-500 bg-stone-200/70 px-2.5 py-0.5 rounded-full">
                matching &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {/* Desktop Right Actions: Explore All + Carousel Controls (< and >) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/shop"
              className="text-xs font-mono font-bold text-stone-600 hover:text-amber-800 uppercase tracking-wider flex items-center gap-1 transition"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => handleScrollCarousel('left')}
                className="w-8 h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center transition shadow-xs cursor-pointer"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollCarousel('right')}
                className="w-8 h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center transition shadow-xs cursor-pointer"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Right Action: Black Circle Arrow Button (matching Image 2) */}
          <div className="block md:hidden">
            <Link
              href="/shop"
              className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xs"
              aria-label="View All Suggested Items"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5A. DESKTOP PRODUCT SHOWCASE (MATCHING IMAGE 1 ROW/GRID)
           ══════════════════════════════════════════════════════════ */}
        <section className="hidden md:block pb-6">
          <div
            ref={desktopCarouselRef}
            className="grid grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {filteredProducts.map((prod) => {
              const prodId = prod.id || prod.slug;
              const prodSlug = prod.slug || prodId;
              const prodImg = prod.images?.[0] || prod.heroImage || '/images/products/amethyst.jpg';
              const prodPrice = Number(prod.price || prod.selling_price || 999);

              return (
                <article
                  key={prodId}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-3 group relative"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
                    <Link href={`/product/${prodSlug}`} className="block relative w-full h-full">
                      <Image
                        src={prodImg}
                        alt={prod.name}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Top-Right Heart Wishlist */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-600 hover:text-red-500 transition shadow-xs cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className="w-3.5 h-3.5 stroke-[2]" />
                    </button>

                    {/* Bottom-Left Rating Pill: ⭐ 4.8 */}
                    <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold text-stone-900 shadow-xs flex items-center gap-1 border border-stone-100">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      <span>{prod.rating || 4.8}</span>
                    </div>
                  </div>

                  {/* Body: Title & Price */}
                  <div className="pt-2.5 flex items-end justify-between gap-1.5">
                    <div className="min-w-0">
                      <Link href={`/product/${prodSlug}`}>
                        <h3 className="font-semibold text-stone-900 text-xs truncate group-hover:text-amber-800 transition-colors">
                          {prod.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-extrabold text-stone-950 font-sans mt-0.5">
                        ₹{prodPrice.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Golden Round Add to Cart Button (Matching Image 1) */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(prod, e)}
                      aria-label={`Add ${prod.name} to cart`}
                      className="w-8 h-8 rounded-full bg-[#E6BF48] hover:bg-[#D4AF37] text-stone-950 flex items-center justify-center shadow-xs transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      {quickAddedId === prodId ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5B. MOBILE PRODUCT GRID (MATCHING IMAGE 2 - 3 COLUMNS)
           ══════════════════════════════════════════════════════════ */}
        <section className="block md:hidden pb-4">
          <div className="grid grid-cols-3 gap-2">
            {filteredProducts.map((prod) => {
              const prodId = prod.id || prod.slug;
              const prodSlug = prod.slug || prodId;
              const prodImg = prod.images?.[0] || prod.heroImage || '/images/products/amethyst.jpg';
              const prodPrice = Number(prod.price || prod.selling_price || 999);

              return (
                <article
                  key={prodId}
                  className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between p-1.5 group relative"
                >
                  {/* Media Container */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100">
                    <Link href={`/product/${prodSlug}`} className="block relative w-full h-full">
                      <Image
                        src={prodImg}
                        alt={prod.name}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    </Link>

                    {/* Top-Right Heart Wishlist */}
                    <button
                      type="button"
                      className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-white/70 flex items-center justify-center text-stone-700"
                    >
                      <Heart className="w-3 h-3 stroke-[2]" />
                    </button>

                    {/* Bottom-Left Rating Pill: ⭐ 4.8 */}
                    <div className="absolute bottom-1 left-1 z-10 bg-white/95 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-stone-900 shadow-xs flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                      <span>{prod.rating || 4.8}</span>
                    </div>

                    {/* Bottom-Right Golden Premium Quality Shield Badge */}
                    <div className="absolute bottom-1 right-1 z-10">
                      <PremiumQualityShield id={prodId} />
                    </div>
                  </div>

                  {/* Body: Title & Price */}
                  <div className="pt-1.5">
                    <Link href={`/product/${prodSlug}`}>
                      <h3 className="font-bold text-stone-900 text-[10.5px] leading-tight line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-xs font-black text-stone-950 font-sans mt-0.5">
                      ₹{prodPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. MOBILE "IN THE SPOTLIGHT" BANNER (MATCHING IMAGE 2)
           ══════════════════════════════════════════════════════════ */}
        <section className="block md:hidden my-2">
          <Link
            href="/shop"
            className="block relative w-full aspect-[3.7/1] rounded-xl overflow-hidden shadow-md group"
          >
            <Image
              src="/images/shop-banner-mobile-spotlight.png"
              alt="In The Spotlight - Premium Crystals for Positive Energy"
              fill
              sizes="100vw"
              className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
          </Link>
        </section>

      </main>

      {/* ══════════════════════════════════════════════════════════
          7. SLIDE-OUT FILTER DRAWER
         ══════════════════════════════════════════════════════════ */}
      {filtersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-amber-700" />
                  <span className="font-bold text-base text-stone-900">Storefront Filters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersDrawerOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Discovery Pillar Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DESKTOP_CATEGORY_AVATARS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setFiltersDrawerOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                        activeCategory === cat.id
                          ? 'bg-amber-100/70 border-amber-500 text-amber-900 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">Price Ceiling</h4>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-800">
                  <span>₹0</span>
                  <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(50000);
                  setActiveCategory('for_you');
                  setFiltersDrawerOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          8. MOBILE BOTTOM NAVIGATION (MATCHING IMAGE 2 EXACTLY)
         ══════════════════════════════════════════════════════════ */}
      <nav
        className="block md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200 py-1.5 px-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-4 items-center text-center">
          <Link href="/shop" className="flex flex-col items-center py-1 text-[#C41E3A] font-bold">
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-0.5">Shop</span>
          </Link>

          <Link href="/services" className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium">
            <Sparkles className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">Services</span>
          </Link>

          <Link href="/about" className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium">
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">Founder Story</span>
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                {displayCartCount}
              </span>
            </div>
            <span className="text-[10px] mt-0.5">Cart</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

export default function StorefrontPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StorefrontContent />
    </Suspense>
  );
}
