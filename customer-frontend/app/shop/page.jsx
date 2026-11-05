'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '../../store/useCart';
import {
  getSupabaseProducts,
} from '../../lib/supabase';
import {
  DISCOVERY_PILLARS,
  getFilterLabel,
  getPillarForFilter,
  formatProductMultiTags,
  productMatchesDiscoveryFilters,
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
  ChevronDown,
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
  Crown,
  Layers,
  Zap,
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
      <path d="M24 3 C21 13 20 23 24 34 C28 23 27 13 24 3 Z" fill="url(#lotusGoldGrad1)" />
      <path d="M24 12 C18 16 13 24 17 33 C20 31 22 26 24 22 Z" fill="url(#lotusGoldGrad2)" opacity="0.95" />
      <path d="M24 12 C30 16 35 24 31 33 C28 31 26 26 24 22 Z" fill="url(#lotusGoldGrad1)" opacity="0.95" />
      <path d="M20 18 C10 20 5 28 11 34 C15 33 18 28 20 24 Z" fill="url(#lotusGoldGrad2)" opacity="0.85" />
      <path d="M28 18 C38 20 43 28 37 34 C33 33 30 28 28 24 Z" fill="url(#lotusGoldGrad1)" opacity="0.85" />
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

// Desktop Category Story Avatars with authentic category photography
const DESKTOP_CATEGORY_AVATARS = [
  { id: 'for_you', label: 'All Vault', image: '/images/categories/category-stones.jpg', filterId: null },
  { id: 'bracelets', label: 'Bracelets', image: '/images/categories/category-bracelets.jpg', filterId: 'jewellery:bracelets' },
  { id: 'malas', label: 'Malas', image: '/images/categories/category-malas.jpg', filterId: 'jewellery:malas' },
  { id: 'raw_crystals', label: 'Raw Crystals', image: '/images/categories/category-stones.jpg', filterId: 'specimen:raw-stones' },
  { id: 'home_decor', label: 'Gemstone Trees', image: '/images/categories/category-trees.jpg', filterId: 'home:crystal-trees' },
  { id: 'energy_bands', label: '7 Chakras', image: '/images/categories/category-chakras-clean.jpg', filterId: 'energy:root-chakra' },
  { id: 'combos', label: 'Towers & Points', image: '/images/categories/category-towers-clean.jpg', filterId: 'specimen:towers-points' },
  { id: 'more', label: 'All Filters', isMoreButton: true },
];

// Mobile Category Icons (matching Image 2 crimson icon pills)
const MOBILE_CATEGORY_ICONS = [
  { id: 'for_you', label: 'For You', icon: Home, filterId: null },
  { id: 'bracelets', label: 'Bracelets', icon: CircleDot, filterId: 'jewellery:bracelets' },
  { id: 'malas', label: 'Malas', icon: Heart, filterId: 'jewellery:malas' },
  { id: 'crystals', label: 'Crystals', icon: Sparkles, filterId: 'specimen:raw-stones' },
  { id: 'home_decor', label: 'Home Decor', icon: Trees, filterId: 'home:crystal-trees' },
  { id: 'chakras', label: 'Chakras', icon: Zap, filterId: 'energy:root-chakra' },
  { id: 'more', label: 'All Filters', icon: LayoutGrid, isMoreButton: true },
];

function StorefrontContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { addItem, openDrawer, getTotalCount } = useCartStore();

  // Strict Admin-Only Catalog (Zero Mock Products)
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Filter States
  const [selectedDiscoveryFilters, setSelectedDiscoveryFilters] = useState([]);
  const [activeCategory, setActiveCategory] = useState('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('bestselling');
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Drawers & Modals
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [expandedPillars, setExpandedPillars] = useState({
    purpose: true,
    energy_system: true,
    crystal_specimen: true,
    jewellery: true,
    bead_size: true,
    home_space: false,
  });

  const searchInputRef = useRef(null);
  const desktopCarouselRef = useRef(null);

  // 1. Fetch live products from Supabase (Strictly admin-uploaded items)
  useEffect(() => {
    let isMounted = true;
    setLoadingCatalog(true);

    getSupabaseProducts(true)
      .then((items) => {
        if (!isMounted) return;
        setCatalog(items || []);
        setLoadingCatalog(false);
      })
      .catch((err) => {
        console.warn('Could not sync live products:', err.message);
        if (isMounted) {
          setCatalog([]);
          setLoadingCatalog(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Parse URL parameters into discovery filters
  useEffect(() => {
    const filtersFromUrl = [];

    // Direct filter tag parameter: ?filter=purpose:money-abundance
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      filterParam.split(',').forEach((f) => {
        if (f.trim() && !filtersFromUrl.includes(f.trim())) {
          filtersFromUrl.push(f.trim());
        }
      });
    }

    // Specific dimension parameters: ?purpose=money-abundance
    const purposeParam = searchParams.get('purpose');
    if (purposeParam) {
      const tag = purposeParam.startsWith('purpose:') ? purposeParam : `purpose:${purposeParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    const energyParam = searchParams.get('energy') || searchParams.get('energy_system');
    if (energyParam) {
      const tag = energyParam.startsWith('energy:') ? energyParam : `energy:${energyParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    const crystalParam = searchParams.get('crystal') || searchParams.get('crystal_specimen');
    if (crystalParam) {
      const tag = crystalParam.startsWith('crystal:') || crystalParam.startsWith('specimen:')
        ? crystalParam
        : `crystal:${crystalParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    const jewelleryParam = searchParams.get('jewellery');
    if (jewelleryParam) {
      const tag = jewelleryParam.startsWith('jewellery:') ? jewelleryParam : `jewellery:${jewelleryParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    const beadParam = searchParams.get('bead') || searchParams.get('bead_size');
    if (beadParam) {
      const tag = beadParam.startsWith('bead:') ? beadParam : `bead:${beadParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    const homeParam = searchParams.get('home') || searchParams.get('home_space');
    if (homeParam) {
      const tag = homeParam.startsWith('home:') ? homeParam : `home:${homeParam}`;
      if (!filtersFromUrl.includes(tag)) filtersFromUrl.push(tag);
    }

    // Search query
    const q = searchParams.get('q') || searchParams.get('search');
    if (q) setSearchQuery(q);

    // Pillar navigation: ?pillar=purpose -> expand that pillar in drawer
    const pillarParam = searchParams.get('pillar');
    if (pillarParam) {
      setExpandedPillars((prev) => ({ ...prev, [pillarParam]: true }));
      setFiltersDrawerOpen(true);
    }

    // Category avatar
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);

    if (filtersFromUrl.length > 0) {
      setSelectedDiscoveryFilters(filtersFromUrl);
    }
  }, [searchParams]);

  // Toggle filter in active filters set
  const toggleFilter = (filterId) => {
    setSelectedDiscoveryFilters((prev) => {
      const exists = prev.includes(filterId);
      const next = exists ? prev.filter((id) => id !== filterId) : [...prev, filterId];

      // Update URL query string
      const params = new URLSearchParams(window.location.search);
      if (next.length > 0) {
        params.set('filter', next.join(','));
      } else {
        params.delete('filter');
        params.delete('purpose');
        params.delete('energy');
        params.delete('crystal');
        params.delete('jewellery');
        params.delete('bead');
        params.delete('home');
      }
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState(null, '', newUrl);

      return next;
    });
  };

  // Remove specific filter chip
  const removeFilter = (filterId) => {
    toggleFilter(filterId);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedDiscoveryFilters([]);
    setActiveCategory('for_you');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(50000);
    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  // Toggle accordion expand
  const togglePillarExpand = (pillarId) => {
    setExpandedPillars((prev) => ({ ...prev, [pillarId]: !prev[pillarId] }));
  };

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
      variantLabel: product.variants?.[0]?.name || product.beadSize || 'Standard Sanctum Calibrated',
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
      const scrollAmount = direction === 'left' ? -340 : 340;
      desktopCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products across all 6 dimensions with strict OR within dimension and AND across dimensions
  const filteredProducts = useMemo(() => {
    let list = [...catalog];

    // 1. Multi-Dimensional Discovery Filters (The 6 Pillars)
    if (selectedDiscoveryFilters.length > 0) {
      list = list.filter((p) => productMatchesDiscoveryFilters(p, selectedDiscoveryFilters));
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const crystal = (p.crystal_type || p.crystal || '').toLowerCase();
        const pid = (p.product_id || p.productId || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(q) || cat.includes(q) || crystal.includes(q) || pid.includes(q) || desc.includes(q);
      });
    }

    // 3. Price filter
    list = list.filter((p) => {
      const price = Number(p.price || p.selling_price || 0);
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
  }, [catalog, selectedDiscoveryFilters, searchQuery, minPrice, maxPrice, sortBy]);

  const activeCategoryTitle = useMemo(() => {
    if (selectedDiscoveryFilters.length > 0) {
      return `Filtered Specimens (${filteredProducts.length})`;
    }
    if (activeCategory === 'for_you' || !activeCategory) return 'All Sanctuary Specimens';
    const found = DESKTOP_CATEGORY_AVATARS.find((c) => c.id === activeCategory);
    return found ? found.label : 'All Sanctuary Specimens';
  }, [selectedDiscoveryFilters, filteredProducts.length, activeCategory]);

  const cartTotalItems = getTotalCount();
  const displayCartCount = cartTotalItems > 0 ? cartTotalItems : 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans pb-24 md:pb-16 selection:bg-[#EAE2F2] selection:text-[#79539B]">
      
      {/* ══════════════════════════════════════════════════════════
          1A. DESKTOP BRAND HEADER BAR
         ══════════════════════════════════════════════════════════ */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#FAF7F2] border-b border-stone-200/80 px-6 lg:px-12 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo & Brand text */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 select-none">
            <GoldenLotusLogo className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-1.5 font-serif text-lg lg:text-xl font-bold tracking-[0.14em] text-[#79539B] uppercase leading-tight">
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
            <div className="w-full rounded-full bg-white border border-stone-300/80 hover:border-[#79539B] py-2 px-4 flex items-center gap-3 shadow-xs focus-within:ring-2 focus-within:ring-[#79539B]/20 focus-within:border-[#79539B] transition-all">
              <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crystals, bracelets, malas, home decor, intentions..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="p-0.5 text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons: Filter Button, Wishlist, Account, Cart */}
          <div className="flex items-center gap-5 text-stone-700">
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#79539B]/30 bg-[#EAE2F2]/60 hover:bg-[#EAE2F2] text-[#79539B] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({selectedDiscoveryFilters.length})</span>
            </button>

            <Link href="/account?tab=wishlist" className="flex flex-col items-center gap-1 hover:text-[#79539B] transition">
              <Heart className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium font-sans">Wishlist</span>
            </Link>

            <Link href="/account" className="flex flex-col items-center gap-1 hover:text-[#79539B] transition">
              <User className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium font-sans">Account</span>
            </Link>

            <button type="button" onClick={openDrawer} className="flex flex-col items-center gap-1 relative hover:text-[#79539B] transition cursor-pointer">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
                {displayCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#79539B] text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                    {displayCartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium font-sans">Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          1B. MOBILE BRAND HEADER BAR
         ══════════════════════════════════════════════════════════ */}
      <header className="block md:hidden sticky top-0 z-40 bg-gradient-to-r from-[#2A153A] via-[#4A2066] to-[#1E0F2B] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between pb-2.5">
          <Link href="/" className="flex items-center gap-2 select-none">
            <GoldenLotusLogo className="w-8 h-8" />
            <div>
              <span className="font-serif text-sm font-bold tracking-wider text-amber-100 uppercase block leading-tight">
                SUMUK CRYSTALZ 5
              </span>
              <span className="text-[8.5px] font-sans tracking-[0.16em] uppercase text-amber-200/90 font-medium">
                SACRED SANCTUARY STORE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{selectedDiscoveryFilters.length > 0 ? selectedDiscoveryFilters.length : 'Filter'}</span>
            </button>

            <button type="button" onClick={openDrawer} className="relative p-1 text-white cursor-pointer" aria-label="Open Cart">
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-stone-950 text-[10px] font-bold flex items-center justify-center border border-white">
                  {displayCartCount}
                </span>
              )}
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
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="p-0.5 text-stone-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN CONTENT STAGE
         ══════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">

        {/* ── DESKTOP CATEGORY STORY AVATARS ── */}
        <section className="hidden md:block">
          <div className="flex items-center justify-center gap-6 lg:gap-8 py-2">
            {DESKTOP_CATEGORY_AVATARS.map((cat) => {
              const isSelected = cat.filterId
                ? selectedDiscoveryFilters.includes(cat.filterId)
                : selectedDiscoveryFilters.length === 0 && activeCategory === cat.id;

              if (cat.isMoreButton) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFiltersDrawerOpen(true)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#EAE2F2]/60 border border-[#79539B]/30 shadow-xs flex items-center justify-center text-[#79539B] group-hover:scale-105 group-hover:border-[#79539B] transition-all">
                      <SlidersHorizontal className="w-5 h-5 stroke-[1.8]" />
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
                    if (cat.filterId) {
                      toggleFilter(cat.filterId);
                    } else {
                      clearAllFilters();
                    }
                    setActiveCategory(cat.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full p-0.5 transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-[#79539B] shadow-md scale-105'
                        : 'ring-1 ring-stone-200 hover:ring-[#79539B]/50 group-hover:scale-102'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-stone-900">
                      <Image src={cat.image} alt={cat.label} fill sizes="64px" className="object-cover" />
                    </div>
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-[#79539B]' : 'text-stone-600 group-hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </span>
                  {isSelected && <div className="w-8 h-[2.5px] bg-[#79539B] rounded-full mt-1" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── MOBILE CATEGORY ICONS ── */}
        <section className="block md:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex items-center gap-3 min-w-max py-1">
            {MOBILE_CATEGORY_ICONS.map((cat) => {
              const isSelected = cat.filterId
                ? selectedDiscoveryFilters.includes(cat.filterId)
                : selectedDiscoveryFilters.length === 0 && activeCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (cat.isMoreButton) {
                      setFiltersDrawerOpen(true);
                    } else if (cat.filterId) {
                      toggleFilter(cat.filterId);
                      setActiveCategory(cat.id);
                    } else {
                      clearAllFilters();
                    }
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#79539B] text-white shadow-md ring-2 ring-amber-400 scale-105'
                        : 'bg-stone-200 text-stone-700 hover:bg-[#EAE2F2]'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${isSelected ? 'text-[#79539B]' : 'text-stone-700'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. ACTIVE FILTER CHIPS SUMMARY BAR
           ══════════════════════════════════════════════════════════ */}
        {selectedDiscoveryFilters.length > 0 && (
          <section className="bg-white rounded-2xl border border-stone-200/90 p-3.5 shadow-xs animate-fade-in flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
                Active Discovery Filters:
              </span>
              {selectedDiscoveryFilters.map((fid) => (
                <button
                  key={fid}
                  type="button"
                  onClick={() => removeFilter(fid)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE2F2] hover:bg-[#D8CBE4] text-[#79539B] border border-[#79539B]/30 transition-all cursor-pointer group"
                  title="Click to remove filter"
                >
                  <span>{getFilterLabel(fid)}</span>
                  <X className="w-3.5 h-3.5 text-[#79539B] group-hover:scale-115 transition-transform" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition underline cursor-pointer"
            >
              Clear All ({selectedDiscoveryFilters.length})
            </button>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            4. SECTION HEADER & RESULTS COUNT
           ══════════════════════════════════════════════════════════ */}
        <section className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[#C8A65E] font-bold text-lg">✦</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-900 font-serif">
              {activeCategoryTitle}
            </h2>
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'specimen' : 'specimens'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-sans font-semibold rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-stone-700 focus:outline-none focus:border-[#79539B] cursor-pointer"
            >
              <option value="bestselling">Sort: Bestselling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#79539B] text-white hover:bg-[#684587] transition shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discovery Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. PRODUCT GRID (LIVE ADMIN UPLOADED SPECIMENS)
           ══════════════════════════════════════════════════════════ */}
        {loadingCatalog ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-[#79539B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-500 font-mono">Connecting to Sacred Sanctuary Vault...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* ── ELEGANT SANCTUARY EMPTY STATE ── */
          <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-stone-200/90 shadow-sm animate-fade-in my-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAE2F2] border border-[#79539B]/30 flex items-center justify-center text-[#79539B] shadow-inner">
              <Sparkles className="w-8 h-8 text-[#79539B]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">No Matching Specimens</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              No products in our current consecrated collection match all of your selected energy dimensions.
              Try clearing some filter tags or exploring by physical specimen.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
              >
                Clear All Filters &amp; View Vault
              </button>
            </div>
          </div>
        ) : (
          /* ── PRODUCT GRID ── */
          <section className="pb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => {
                const prodId = prod.id || prod.slug;
                const prodSlug = prod.slug || prodId;
                const prodImg = prod.images?.[0] || prod.heroImage || '/images/products/amethyst.jpg';
                const prodPrice = Number(prod.price || prod.selling_price || 999);
                const originalPrice = Number(prod.original_price || prod.originalPrice || prodPrice * 1.3);
                const multiTags = formatProductMultiTags(prod, 2);

                return (
                  <article
                    key={prodId}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between p-2.5 sm:p-3 group relative"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
                      <Link href={`/product/${prodSlug}`} className="block relative w-full h-full">
                        <Image
                          src={prodImg}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Top-Right Heart Wishlist */}
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-stone-600 hover:text-red-500 transition shadow-xs cursor-pointer"
                        title="Save to Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5 stroke-[2]" />
                      </button>

                      {/* Bottom-Left Rating Pill */}
                      <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-stone-900 shadow-xs flex items-center gap-1 border border-stone-100">
                        <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                        <span>{prod.rating || 5.0}</span>
                      </div>

                      {/* Bottom-Right Golden Shield Badge */}
                      <div className="absolute bottom-1 right-1 z-10">
                        <PremiumQualityShield id={prodId} />
                      </div>
                    </div>

                    {/* Product Body */}
                    <div className="pt-2 flex flex-col justify-between flex-1">
                      <div>
                        {/* Multi-Discovery Filter Tags Preview */}
                        <div className="flex flex-wrap gap-1 mb-1">
                          {multiTags.map((t) => (
                            <span
                              key={t.id}
                              className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border font-semibold truncate max-w-[120px] ${t.colorClass}`}
                            >
                              {t.label}
                            </span>
                          ))}
                        </div>

                        <Link href={`/product/${prodSlug}`}>
                          <h3 className="font-semibold text-stone-900 text-xs sm:text-[13px] line-clamp-2 leading-tight group-hover:text-[#79539B] transition-colors">
                            {prod.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9.5px] font-mono font-bold text-[#79539B] bg-[#EAE2F2] px-1.5 py-0.5 rounded border border-[#79539B]/30">
                            {prod.product_id || prod.productId || 'SC5'}
                          </span>
                          <span className="text-[10px] text-stone-500 font-sans truncate">
                            {prod.category || 'Sacred Gem'}
                          </span>
                        </div>
                      </div>

                      {/* Price & Quick Add Button */}
                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs sm:text-sm font-extrabold text-stone-950 font-sans">
                              ₹{prodPrice.toLocaleString('en-IN')}
                            </span>
                            {originalPrice > prodPrice && (
                              <span className="text-[10px] text-stone-400 line-through font-mono">
                                ₹{originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          aria-label={`Add ${prod.name} to vault`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAE2F2] hover:bg-[#79539B] text-[#79539B] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
                          title="Quick Add to Cart"
                        >
                          {quickAddedId === prodId ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════
          6. COMPREHENSIVE 6-DIMENSION FILTER DRAWER
         ══════════════════════════════════════════════════════════ */}
      {filtersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in select-none">
          <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAE2F2] border border-[#79539B]/30 flex items-center justify-center text-[#79539B]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-tight">
                    Discovery Dimensions
                  </h3>
                  <p className="text-[11px] text-stone-500 font-sans">
                    6 independent filters calibrated for spiritual energy
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer"
                aria-label="Close filters drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Scrollable 6 Dimensions) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 divide-y divide-stone-100">
              
              {/* Active Filters Summary in Drawer */}
              {selectedDiscoveryFilters.length > 0 && (
                <div className="pb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 font-sans">
                    {selectedDiscoveryFilters.length} Active {selectedDiscoveryFilters.length === 1 ? 'Filter' : 'Filters'}
                  </span>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* The 6 Pillars */}
              {DISCOVERY_PILLARS.map((pillar) => {
                const isExpanded = !!expandedPillars[pillar.id];
                const activeCountInPillar = pillar.options.filter((o) =>
                  selectedDiscoveryFilters.includes(o.id)
                ).length;

                return (
                  <div key={pillar.id} className="pt-4 first:pt-0">
                    {/* Pillar Title Toggle */}
                    <button
                      type="button"
                      onClick={() => togglePillarExpand(pillar.id)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer py-1"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#79539B] transition-colors">
                          {pillar.name}
                        </h4>
                        {activeCountInPillar > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#79539B] text-white text-[10px] font-bold flex items-center justify-center">
                            {activeCountInPillar}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#79539B]' : ''
                        }`}
                      />
                    </button>
                    <p className="text-[11px] text-stone-500 font-sans mt-0.5 mb-2.5">
                      {pillar.subtitle}
                    </p>

                    {/* Pillar Options */}
                    {isExpanded && (
                      <div className="space-y-3 pt-1 animate-fade-in">
                        {/* Subgroups rendering (for Energy System & Crystal / Specimen) */}
                        {pillar.subGroups ? (
                          pillar.subGroups.map((sg) => (
                            <div key={sg.id} className="space-y-1.5 pl-2 border-l-2 border-stone-200">
                              <span className="text-[10.5px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                                {sg.title}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {sg.options.map((opt) => {
                                  const isSelected = selectedDiscoveryFilters.includes(opt.id);
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => toggleFilter(opt.id)}
                                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#79539B] text-white font-bold shadow-xs'
                                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                                      <span>{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Flat Options (Purpose, Jewellery, Bead Size, Home & Space) */
                          <div className="flex flex-wrap gap-1.5">
                            {pillar.options.map((opt) => {
                              const isSelected = selectedDiscoveryFilters.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => toggleFilter(opt.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#79539B] text-white font-bold shadow-xs'
                                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Price Range Filter */}
              <div className="pt-4 space-y-3">
                <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                  Price Filter
                </h4>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-800">
                  <span>₹0</span>
                  <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#79539B] cursor-pointer"
                />
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-stone-200 bg-[#FAF7F2] flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#79539B] hover:bg-[#684587] text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          7. MOBILE BOTTOM NAVIGATION
         ══════════════════════════════════════════════════════════ */}
      <nav
        className="block md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200 py-1.5 px-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-4 items-center text-center">
          <Link href="/shop" className="flex flex-col items-center py-1 text-[#79539B] font-bold">
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-0.5">Shop</span>
          </Link>

          <Link href="/services" className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium">
            <Sparkles className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">Services</span>
          </Link>

          <Link href="/about" className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium">
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">Founder</span>
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            className="flex flex-col items-center py-1 text-stone-600 hover:text-stone-900 font-medium relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#79539B] text-white font-extrabold text-[9px] flex items-center justify-center">
                  {displayCartCount}
                </span>
              )}
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
          <div className="w-10 h-10 border-2 border-[#79539B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StorefrontContent />
    </Suspense>
  );
}
