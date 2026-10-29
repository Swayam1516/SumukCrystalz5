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
  SlidersHorizontal,
  Filter,
  Check,
  Sparkles,
  LayoutGrid,
  RotateCw,
  Flame,
  Home,
  Tag,
  Gift,
  Compass,
  User,
  ShoppingBag,
} from 'lucide-react';

// Golden Crystal Pyramid Logo SVG matching brand identity
function GoldenPyramidLogo({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] select-none flex-shrink-0`}
    >
      <defs>
        <linearGradient id="pyrGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B8" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#875E11" />
        </linearGradient>
        <linearGradient id="pyrGold2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE892" />
          <stop offset="55%" stopColor="#C5992A" />
          <stop offset="100%" stopColor="#5E410B" />
        </linearGradient>
      </defs>
      {/* Side facets */}
      <polygon points="12,18 6,24 9,35 15,35 15,22" fill="url(#pyrGold2)" opacity="0.9" />
      <polygon points="28,18 34,24 31,35 25,35 25,22" fill="url(#pyrGold2)" opacity="0.9" />
      {/* Central crystal pyramid tower */}
      <polygon points="20,4 13,13 14,36 26,36 27,13" fill="url(#pyrGold1)" />
      <polygon points="20,4 13,13 20,16" fill="#FFF9E0" opacity="0.85" />
      <polygon points="20,4 27,13 20,16" fill="url(#pyrGold2)" opacity="0.9" />
      <polygon points="20,16 13,13 14,36 20,36" fill="url(#pyrGold2)" opacity="0.95" />
      {/* Edge reflections */}
      <line x1="20" y1="4" x2="20" y2="36" stroke="#FFF9E0" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

// 100% Natural Shield Crest Badge SVG (Authentic Natural Mineral)
function NaturalShieldCrest({ id = 'crest' }) {
  return (
    <svg className="w-6 h-7 sm:w-7 sm:h-8 drop-shadow-md select-none" viewBox="0 0 32 36" fill="none">
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
      <text x="16" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">
        100%
      </text>
      <text x="16" y="21.5" textAnchor="middle" fill="#FDE68A" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">
        NATURAL
      </text>
    </svg>
  );
}

// Category Story Avatars matching the reference image exactly
const CATEGORY_AVATARS = [
  {
    id: 'for_you',
    label: 'For You',
    image: '/images/products/amethyst.jpg',
    categoryKey: 'all',
  },
  {
    id: 'energy_bands',
    label: 'Energy Bands',
    image: '/images/products/tigers-eye.jpg',
    categoryKey: 'Energy Bands',
  },
  {
    id: 'raw_crystals',
    label: 'Raw Crystals',
    image: '/images/products/clear-quartz.jpg',
    categoryKey: 'Raw Crystals',
  },
  {
    id: 'bracelets',
    label: 'Bracelets',
    image: '/images/products/obsidian.jpg',
    categoryKey: 'Bracelets',
  },
  {
    id: 'pendants',
    label: 'Pendants',
    image: '/images/products/pendant.jpg',
    categoryKey: 'Pendants',
  },
  {
    id: 'home_decor',
    label: 'Home Decor',
    image: '/images/products/tree.jpg',
    categoryKey: 'Home Decor',
  },
  {
    id: 'combos',
    label: 'Combos',
    image: '/images/products/combos.jpg',
    categoryKey: 'Combos',
  },
  {
    id: 'more',
    label: 'More',
    isMoreButton: true,
  },
];

function StorefrontContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'for_you';
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';

  const { addItem, openDrawer, getTotalCount } = useCartStore();

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [occasionBanner, setOccasionBanner] = useState(DEFAULT_OCCASION_BANNER);
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

  // 1. Load Products & Occasion Banner
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoadingCatalog(true);
      try {
        const [productsData, bannerData] = await Promise.all([
          getSupabaseProducts(true),
          getSupabaseOccasionBanner(),
        ]);

        if (isMounted) {
          if (productsData && productsData.length > 0) {
            setCatalog(productsData);
          }
          if (bannerData) {
            setOccasionBanner(bannerData);
          }
        }
      } catch (err) {
        console.warn('Storefront data load notice:', err.message);
      } finally {
        if (isMounted) setLoadingCatalog(false);
      }
    }

    loadData();

    // Listen for live Occasion Banner updates from Admin Panel
    const handleBannerUpdate = (e) => {
      if (e.detail) {
        setOccasionBanner(e.detail);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sumuk_occasion_banner_updated', handleBannerUpdate);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('sumuk_occasion_banner_updated', handleBannerUpdate);
      }
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

  // Filter products by Active Category + Search + Price + Discovery Tags
  const filteredProducts = useMemo(() => {
    let list = [...catalog];

    // 1. Category Filter
    if (activeCategory && activeCategory !== 'for_you') {
      const activeObj = CATEGORY_AVATARS.find((c) => c.id === activeCategory);
      const catKey = activeObj?.categoryKey?.toLowerCase() || '';

      if (catKey && catKey !== 'all') {
        list = list.filter((p) => {
          const pCategory = (p.category || '').toLowerCase();
          const pName = (p.name || '').toLowerCase();
          const pSubtitle = (p.subtitle || '').toLowerCase();
          const pTags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
          const pAssigned = Array.isArray(p.assignedFilters) ? p.assignedFilters.join(' ').toLowerCase() : '';

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
              pCategory.includes('geode') ||
              pName.includes('cluster') ||
              pName.includes('raw') ||
              pName.includes('quartz') ||
              pTags.includes('cluster')
            );
          }

          if (catKey.includes('pendant')) {
            return pCategory.includes('pendant') || pName.includes('pendant') || pTags.includes('pendant');
          }

          if (catKey.includes('decor') || catKey.includes('tree')) {
            return (
              pCategory.includes('decor') ||
              pCategory.includes('home') ||
              pName.includes('tree') ||
              pName.includes('plate') ||
              pTags.includes('home')
            );
          }

          if (catKey.includes('combo')) {
            return pCategory.includes('combo') || pName.includes('fusion') || pName.includes('combo') || pName.includes('set');
          }

          return pCategory.includes(catKey) || pName.includes(catKey) || pAssigned.includes(catKey);
        });
      }
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const text = [
          p.name || '',
          p.subtitle || '',
          p.category || '',
          p.crystalType || '',
          p.crystal_type || '',
          p.beadType || '',
          p.purpose || '',
          p.chakra || '',
        ].join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    // 3. Price filter
    list = list.filter((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // 4. Discovery pillar tags
    if (selectedDiscoveryFilters.length > 0) {
      list = list.filter((p) => {
        const assigned = Array.isArray(p.assignedFilters)
          ? p.assignedFilters
          : (Array.isArray(p.assigned_filters) ? p.assigned_filters : (Array.isArray(p.tags) ? p.tags : []));
        return selectedDiscoveryFilters.some((f) => assigned.includes(f));
      });
    }

    // 5. Sorting
    if (sortBy === 'bestselling') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || a.sellingPrice || 0) - (b.price || b.sellingPrice || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || b.sellingPrice || 0) - (a.price || a.sellingPrice || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [catalog, activeCategory, searchQuery, minPrice, maxPrice, selectedDiscoveryFilters, sortBy]);

  // Section title based on category
  const activeCategoryTitle = useMemo(() => {
    if (activeCategory === 'for_you' || !activeCategory) return 'Suggested For You';
    const found = CATEGORY_AVATARS.find((c) => c.id === activeCategory);
    return found ? found.label : 'Suggested For You';
  }, [activeCategory]);

  const cartTotalItems = getTotalCount();
  const displayCartCount = cartTotalItems > 0 ? cartTotalItems : 3;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans pb-20">
      {/* ========================================================================= */}
      {/* 1. TOP BRAND HEADER BAR (MATCHING THE REFERENCE IMAGE EXACTLY)            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/60 px-4 py-3 sm:py-3.5 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* LEFT: Golden Crystal Pyramid Logo + Brand Title + Four-pointed Star */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group select-none">
            <GoldenPyramidLogo />
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-[0.14em] text-[#9A6B0A] group-hover:text-amber-800 transition-colors uppercase">
                SUMUK CRYSTALZ 5
              </span>
              <span className="text-amber-600 font-bold text-sm sm:text-base leading-none">✦</span>
            </div>
          </Link>

          {/* RIGHT: Search icon, Cart with Red Count Badge, Hamburger Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search trigger icon */}
            <button
              type="button"
              onClick={() => {
                searchInputRef.current?.focus();
                searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              aria-label="Search items"
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>

            {/* Shopping Cart with Red Notification Badge */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label="View Shopping Cart"
              className="relative p-1.5 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                {displayCartCount}
              </span>
            </button>

            {/* Hamburger Menu Icon */}
            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SHOPPING CONTENT CONTAINER                                        */}
      {/* ========================================================================= */}
      <main className="max-w-4xl mx-auto px-4 pt-3 space-y-4 sm:space-y-5">
        {/* ======================================================================= */}
        {/* 2A. PILL SEARCH BAR WITH MIC AND SCANNER ICONS                          */}
        {/* ======================================================================= */}
        <div className="relative w-full">
          <div className="w-full rounded-full bg-stone-100/80 hover:bg-stone-100 border border-stone-200 py-2.5 px-4 flex items-center gap-3 shadow-inner transition-colors focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
            {/* Search Glass Icon */}
            <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />

            {/* Input field */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crystals, bracelets, energy bands..."
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none font-sans"
            />

            {/* Clear button if input has text */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Right Action: Voice Mic Icon */}
            <button
              type="button"
              onClick={() => setVoiceSearchActive(true)}
              title="Voice Search"
              className="text-stone-500 hover:text-amber-700 transition-colors flex-shrink-0 p-0.5"
            >
              <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Right Action: Barcode/Scan Icon */}
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              title="Scan QR or Stone Barcode"
              className="text-stone-500 hover:text-amber-700 transition-colors flex-shrink-0 p-0.5"
            >
              <ScanLine className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2B. CATEGORY STORY AVATARS (CIRCULAR ROW)                               */}
        {/* ======================================================================= */}
        <section className="relative -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex items-start gap-4 sm:gap-5 min-w-max py-1.5">
            {CATEGORY_AVATARS.map((cat) => {
              const isSelected = activeCategory === cat.id;

              if (cat.isMoreButton) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFiltersDrawerOpen(true)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-stone-100 border border-stone-200/90 shadow-sm flex items-center justify-center text-stone-700 group-hover:scale-105 group-hover:border-amber-500 transition-all">
                      <LayoutGrid className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
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
                  {/* Circular Avatar with slate/mineral photo */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-[#B45309] shadow-md scale-105'
                        : 'ring-1 ring-stone-200 hover:ring-stone-400 group-hover:scale-102'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-stone-900">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-[#8C6208]' : 'text-stone-700 group-hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </span>

                  {/* Golden Underline Indicator for Active Selection */}
                  {isSelected && (
                    <div className="w-8 h-[2.5px] bg-[#B45309] rounded-full mt-1 animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 2C. OCCASION / FESTIVE SALE BANNER (ADMIN DYNAMIC PROVISION)            */}
        {/* ======================================================================= */}
        {occasionBanner && occasionBanner.is_active !== false && (
          <section className="relative rounded-2xl overflow-hidden shadow-md my-2 group transition-transform hover:scale-[1.008]">
            <Link
              href={occasionBanner.link_url || '/shop?category=for_you'}
              className="block relative w-full h-32 sm:h-36 md:h-40 overflow-hidden"
            >
              {/* High-Resolution Occasion Banner (Diwali Sale) */}
              <Image
                src={occasionBanner.image_url || '/images/diwali-sale-banner.jpg'}
                alt={occasionBanner.title || 'Diwali Festive Sale'}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />

              {/* Right Action Button: White Circle with Black Arrow */}
              <div className="absolute right-3.5 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-stone-950 flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all z-20">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
            </Link>
          </section>
        )}

        {/* ======================================================================= */}
        {/* 2D. SECTION TITLE HEADER: "Suggested For You" + CIRCLE ARROW BUTTON     */}
        {/* ======================================================================= */}
        <section className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {activeCategoryTitle}
            </h1>
            {searchQuery && (
              <span className="text-xs font-mono text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                matching &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {/* Circular Arrow Button */}
          <button
            type="button"
            onClick={() => {
              setActiveCategory('for_you');
              setSearchQuery('');
            }}
            title="Browse all collections"
            className="w-8 h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors shadow-xs"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </section>

        {/* ======================================================================= */}
        {/* 2E. PRODUCT CARDS GRID (3 COLUMNS DESKTOP/TABLET, 2 COLUMNS MOBILE)    */}
        {/* ======================================================================= */}
        <section className="pb-8">
          {loadingCatalog ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-3 space-y-2.5 animate-pulse">
                  <div className="aspect-square w-full rounded-xl bg-stone-200" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-5 bg-stone-200 rounded w-16" />
                    <div className="w-9 h-9 bg-amber-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3 shadow-xs">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-stone-800">No Gemstone Specimens Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No items match your active filters. Try searching for other sacred stones or reset the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('for_you');
                  setSearchQuery('');
                  setSelectedDiscoveryFilters([]);
                  setMinPrice(0);
                  setMaxPrice(50000);
                }}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-sm transition-all"
              >
                Reset Store Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => {
                const prodId = prod.id || prod.slug;
                const prodSlug = prod.slug || prodId;
                const prodImg =
                  prod.images?.[0] ||
                  prod.heroImage ||
                  prod.hero_image ||
                  prod.image ||
                  '/images/products/pyrite.jpg';

                const prodPrice = Number(prod.price || prod.sellingPrice || prod.selling_price || 699);
                const prodOrigPrice = Number(prod.originalPrice || prod.original_price || Math.round(prodPrice * 1.5));
                const bankOfferPrice = Math.round(prodPrice * 0.9); // 10% instant card discount formula matching image

                return (
                  <article
                    key={prodId}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between p-2.5 sm:p-3 group relative"
                  >
                    {/* Top Media Container */}
                    <div className="relative">
                      {/* Top-Left Rating Pill: "4.5 ★" (White pill with Emerald star) */}
                      <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-stone-900 shadow-xs flex items-center gap-1 border border-stone-100">
                        <span>{prod.rating || 4.5}</span>
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      </div>

                      {/* Top-Right Authentic Quality Crest: Golden Shield Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <NaturalShieldCrest id={prodId} />
                      </div>

                      {/* High-Resolution Specimen Image on Slate Rock Background */}
                      <Link
                        href={`/product/${prodSlug}`}
                        className="relative aspect-square w-full rounded-xl overflow-hidden block bg-[#18181B]"
                      >
                        <Image
                          src={prodImg}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover group-hover:scale-104 transition-transform duration-300"
                        />
                      </Link>
                    </div>

                    {/* Card Body: Title */}
                    <div className="mt-2">
                      <Link href={`/product/${prodSlug}`}>
                        <h2 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 group-hover:text-amber-800 transition-colors">
                          {prod.name}
                        </h2>
                      </Link>
                    </div>

                    {/* Card Footer: Prices, Blue Bank Offer & Yellow Add-to-Cart Button */}
                    <div className="flex items-end justify-between gap-1.5 pt-2 mt-auto">
                      {/* Pricing Column */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          {prodOrigPrice > prodPrice && (
                            <span className="text-[11px] sm:text-xs text-stone-400 line-through font-mono">
                              ₹{prodOrigPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-sm sm:text-base font-extrabold text-stone-900 font-sans">
                            ₹{prodPrice.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Blue Bank Offer Highlight */}
                        <p className="text-[10px] sm:text-[11.5px] text-blue-600 font-medium leading-tight line-clamp-1 mt-0.5">
                          ₹{bankOfferPrice.toLocaleString('en-IN')} with Bank offer + more
                        </p>
                      </div>

                      {/* Golden-Yellow Square Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(prod, e)}
                        aria-label={`Add ${prod.name} to cart`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] active:scale-95 text-stone-900 flex items-center justify-center shadow-xs transition-all flex-shrink-0 cursor-pointer"
                      >
                        {quickAddedId === prodId ? (
                          <Check className="w-5 h-5 text-stone-900 stroke-[2.5]" />
                        ) : (
                          <ShoppingCart className="w-5 h-5 text-stone-900 stroke-[2.2]" />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 3. SLIDE-OUT NAVIGATION MENU DRAWER                                       */}
      {/* ========================================================================= */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <GoldenPyramidLogo className="w-6 h-6" />
                  <span className="font-serif font-bold text-sm tracking-wider text-amber-800 uppercase">
                    SUMUK CRYSTALZ 5
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 font-semibold text-sm text-stone-800"
                >
                  <span className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-amber-600" />
                    <span>Home Sanctuary</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 font-bold text-sm"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>Crystal Storefront</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </Link>

                <Link
                  href="/services"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 font-semibold text-sm text-stone-800"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Vedic Modalities &amp; Readings</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 font-semibold text-sm text-stone-800"
                >
                  <span className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Founder Story &amp; Consecration</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/account"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 font-semibold text-sm text-stone-800"
                >
                  <span className="flex items-center gap-3">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>My Account &amp; Orders</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-100/60 font-semibold text-sm text-amber-800 border border-amber-200/60 mt-4"
                >
                  <span className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Admin Vault &amp; Occasion Banners</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </Link>
              </nav>
            </div>

            {/* Quick Contact & Footer Info */}
            <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 space-y-2">
              <p className="font-semibold text-stone-700">Sumuk Crystalz 5 &bull; Pune Hub</p>
              <p>Authentic Natural Minerals &bull; Vedic Consecration</p>
              <button
                type="button"
                onClick={() => {
                  setMenuDrawerOpen(false);
                  openDrawer();
                }}
                className="w-full mt-3 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Open Cart ({cartTotalItems} items)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DISCOVERY FILTERS DRAWER (OPENED VIA "MORE" BUTTON)                     */}
      {/* ========================================================================= */}
      {filtersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-base text-stone-900">Discovery Filters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersDrawerOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort By Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Sort Specimens
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800"
                >
                  <option value="bestselling">🔥 Best Selling</option>
                  <option value="price-low">₹ Price: Low to High</option>
                  <option value="price-high">₹ Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                  <span>Price Range</span>
                  <span className="text-amber-700">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* 6 Discovery Pillars Checkboxes */}
              <div className="space-y-4 pt-2">
                {DISCOVERY_PILLARS.slice(0, 3).map((pillar) => (
                  <div key={pillar.id} className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      {pillar.name}
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {pillar.options.map((opt) => {
                        const isChecked = selectedDiscoveryFilters.includes(opt.id);
                        return (
                          <label
                            key={opt.id}
                            className="flex items-center justify-between text-xs text-stone-700 hover:text-stone-900 cursor-pointer py-0.5"
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setSelectedDiscoveryFilters((prev) =>
                                    prev.includes(opt.id)
                                      ? prev.filter((i) => i !== opt.id)
                                      : [...prev, opt.id]
                                  );
                                }}
                                className="accent-amber-600 rounded"
                              />
                              <span className={isChecked ? 'font-bold text-amber-800' : ''}>
                                {opt.label}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedDiscoveryFilters([]);
                  setMaxPrice(50000);
                  setSortBy('bestselling');
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SIMULATORS (MIC & SCANNER)                                  */}
      {/* ========================================================================= */}
      {voiceSearchActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-amber-200">
            <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 mx-auto flex items-center justify-center text-amber-700 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Voice Specimen Search</h3>
              <p className="text-xs text-stone-500 mt-1">
                Say &quot;Tiger&apos;s Eye&quot;, &quot;Pyrite&quot;, or &quot;Amethyst&quot; to discover sacred specimens.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center pt-2">
              {["Tiger's Eye", 'Pyrite', 'Amethyst', 'Clear Quartz'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setSearchQuery(sample);
                    setVoiceSearchActive(false);
                  }}
                  className="px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-xs font-medium border border-stone-200 transition-colors"
                >
                  &quot;{sample}&quot;
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setVoiceSearchActive(false)}
              className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-stone-200">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border-2 border-dashed border-amber-500 mx-auto flex items-center justify-center text-stone-700">
              <ScanLine className="w-8 h-8 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Stone Authenticity &amp; QR Scanner</h3>
              <p className="text-xs text-stone-500 mt-1">
                Scan the sacred QR code printed on your Sumuk Crystalz packaging to view certificate and Vedic energization details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScannerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StorefrontContent />
    </Suspense>
  );
}
