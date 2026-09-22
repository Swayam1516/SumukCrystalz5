'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '../../store/useCart';
import DualTierFilterTicker, { DEFAULT_INTENTIONS, DEFAULT_MODALITIES } from '../../components/DualTierFilterTicker';
import {
  PURPOSES,
  BEAD_TYPES,
  BRACELET_SIZES,
} from '../../data/energyStones';
import { getSupabaseProducts } from '../../lib/supabase';
import {
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Grid,
  ShieldCheck,
  RotateCw,
  Truck,
  ArrowRight,
  Zap,
} from 'lucide-react';

function MasterworksShopContent() {
  const searchParams = useSearchParams();
  const initialPurpose = searchParams.get('purpose') || 'all';
  const initialBead = searchParams.get('beadType') || '';

  const [selectedPurpose, setSelectedPurpose] = useState(initialPurpose);
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedBeads, setSelectedBeads] = useState(initialBead ? [initialBead] : []);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('bestselling'); // 'bestselling' | 'price-low' | 'price-high' | 'rating'
  const [gridCols, setGridCols] = useState(4); // 4 or 2
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Accordion toggle states in sidebar
  const [openSections, setOpenSections] = useState({
    purpose: true,
    price: true,
    beads: true,
    size: true,
  });

  const { addItem, openDrawer } = useCartStore();

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBead = (bead) => {
    setSelectedBeads((prev) =>
      prev.includes(bead) ? prev.filter((b) => b !== bead) : [...prev, bead]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedPurpose('all');
    setSelectedModality('');
    setSelectedBeads([]);
    setSelectedSizes([]);
    setMinPrice(0);
    setMaxPrice(50000);
    setSearchQuery('');
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      try {
        // 1. Fetch live products from Supabase (Source of Truth)
        const supaItems = await getSupabaseProducts(true);

        if (supaItems && supaItems.length > 0) {
          if (isMounted) {
            setCatalog(supaItems);
          }
          return;
        }

        // 2. Fallback to Backend REST API if configured and Supabase returned 0 items
        if (API_BASE) {
          try {
            const res = await fetch(`${API_BASE}/api/products`);
            if (res.ok) {
              const data = await res.json();
              const backendItems = Array.isArray(data) ? data : (data.products || []);
              if (backendItems.length > 0 && isMounted) {
                setCatalog(backendItems);
                return;
              }
            }
          } catch (apiErr) {
            console.warn('Backend products endpoint unreachable:', apiErr.message);
          }
        }

        if (isMounted) {
          setCatalog(supaItems || []);
        }
      } catch (err) {
        console.error('Storefront live catalog fetch error:', err);
        if (isMounted) {
          setCatalog([]);
        }
      } finally {
        if (isMounted) setLoadingCatalog(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, [API_BASE]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...catalog];

    // Purpose filter
    if (selectedPurpose && selectedPurpose !== 'all') {
      const pLow = selectedPurpose.toLowerCase();
      list = list.filter((p) =>
        (p.purpose && p.purpose.toLowerCase().includes(pLow)) ||
        (p.category && p.category.toLowerCase().includes(pLow)) ||
        (p.collection && p.collection.toLowerCase().includes(pLow)) ||
        (p.chakra && (Array.isArray(p.chakra) ? p.chakra.some((c) => c.toLowerCase().includes(pLow)) : String(p.chakra).toLowerCase().includes(pLow)))
      );
    }

    // Modality filter
    if (selectedModality) {
      const mLow = selectedModality.toLowerCase();
      list = list.filter((p) =>
        (p.category && p.category.toLowerCase().includes(mLow)) ||
        (p.collection && p.collection.toLowerCase().includes(mLow)) ||
        (p.crystalType && p.crystalType.toLowerCase().includes(mLow)) ||
        (p.crystal_type && p.crystal_type.toLowerCase().includes(mLow))
      );
    }

    // Bead type filter
    if (selectedBeads.length > 0) {
      list = list.filter((p) =>
        selectedBeads.some((b) => {
          const bLow = b.toLowerCase();
          return (
            (p.beadType && p.beadType.toLowerCase().includes(bLow)) ||
            (p.crystalType && p.crystalType.toLowerCase().includes(bLow)) ||
            (p.crystal_type && p.crystal_type.toLowerCase().includes(bLow)) ||
            (p.name && p.name.toLowerCase().includes(bLow))
          );
        })
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        selectedSizes.some((s) => {
          const sLow = s.toLowerCase();
          return (
            (p.beadSize && p.beadSize.toLowerCase().includes(sLow)) ||
            (p.variants && p.variants.some((v) => (v.name && v.name.toLowerCase().includes(sLow)) || (v.sizeOrWeight && v.sizeOrWeight.toLowerCase().includes(sLow))))
          );
        })
      );
    }

    // Price range
    list = list.filter((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || p.basePrice || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.beadType?.toLowerCase().includes(q) ||
          p.crystalType?.toLowerCase().includes(q) ||
          p.crystal_type?.toLowerCase().includes(q) ||
          p.purposeLabel?.toLowerCase().includes(q) ||
          (Array.isArray(p.chakra) ? p.chakra.some((c) => c.toLowerCase().includes(q)) : String(p.chakra || '').toLowerCase().includes(q)) ||
          p.zodiac?.toLowerCase().includes(q)
      );
    }

    // Sort
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
  }, [catalog, selectedPurpose, selectedModality, selectedBeads, selectedSizes, minPrice, maxPrice, searchQuery, sortBy]);

  // Dynamically compute count of live products per purpose category
  const purposeCounts = useMemo(() => {
    const counts = { all: catalog.length };
    PURPOSES.forEach((p) => {
      if (p.id === 'all') return;
      const pLow = p.id.toLowerCase();
      counts[p.id] = catalog.filter((prod) =>
        (prod.purpose && prod.purpose.toLowerCase().includes(pLow)) ||
        (prod.category && prod.category.toLowerCase().includes(pLow)) ||
        (prod.collection && prod.collection.toLowerCase().includes(pLow)) ||
        (prod.chakra && (Array.isArray(prod.chakra) ? prod.chakra.some((c) => c.toLowerCase().includes(pLow)) : String(prod.chakra).toLowerCase().includes(pLow)))
      ).length;
    });
    return counts;
  }, [catalog]);

  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    addItem({
      productId: product.id,
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      variantLabel: product.beadSize || '8mm Regular',
      price: product.price,
      unitPrice: product.price,
      quantity: 1,
    });
    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2000);
    openDrawer();
  };

  const activeFiltersCount =
    (selectedPurpose !== 'all' ? 1 : 0) +
    (selectedModality ? 1 : 0) +
    selectedBeads.length +
    selectedSizes.length +
    (minPrice > 0 || maxPrice < 2500 ? 1 : 0) +
    (searchQuery ? 1 : 0);


  return (
    <div className="min-h-screen store-canvas-light text-[#1F1A15] pb-24 transition-colors duration-500">
      {/* 1. HERO & PURPOSE 3D QUICK-PILLS SECTION (LIGHT SPIRITUAL LUXURY) */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#EAE3D5] bg-gradient-to-b from-[#FDFBF7] via-[#F7F2E7] to-[#FCFAF6]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d-light text-[#8C6208] text-[11px] font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Sumuk Crystalz 5 &bull; Sacred Masterwork Treasury</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#1F1A15] tracking-tight text-3d-title-light">
            Energy Bands &amp; Sacred Stones <br />
            <span className="gold-gradient-text-light font-display">({filteredProducts.length} Consecrated Items)</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6357] max-w-2xl mx-auto leading-relaxed font-sans-ui font-normal">
            100% lab-certified natural crystals, metaphysical energy bands, and Vedic consecrated malas hand-strung by master artisans for maximum pranic vitality.
          </p>

        </div>

        {/* Dual-Tier Horizontal Ticker Register (Intentions & Modalities) */}
        <div className="mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <DualTierFilterTicker
            selectedIntention={selectedPurpose}
            onSelectIntention={(id) => setSelectedPurpose(id)}
            selectedModality={selectedModality}
            onSelectModality={(id) => setSelectedModality((prev) => (prev === id ? '' : id))}
            isMarquee={false}
          />
        </div>
      </section>


      {/* 2. FILTER & SORT CONTROL BAR (3D LIGHT THEME) */}
      <section className="sticky top-20 z-30 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#EAE3D5] py-3.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Filter Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl option-3d-light text-xs font-mono text-[#1F1A15]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="font-bold">{sidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#BA3C2A] text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl option-3d-light text-xs font-mono text-[#1F1A15]"
            >
              <Filter className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="font-bold">Filters ({activeFiltersCount})</span>
            </button>

            {/* Active applied filter tags */}
            <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
              {selectedPurpose !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF4E0] border border-[#D4AF37]/50 text-[#8C6208] text-[11px] font-mono font-bold shadow-sm">
                  <span>{DEFAULT_INTENTIONS.find((p) => p.id === selectedPurpose)?.label || selectedPurpose}</span>
                  <button onClick={() => setSelectedPurpose('all')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedModality && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAE8F5] border border-[#9333EA]/30 text-[#6B21A8] text-[11px] font-mono font-bold shadow-sm">
                  <span>{DEFAULT_MODALITIES.find((m) => m.id === selectedModality)?.label || selectedModality}</span>
                  <button onClick={() => setSelectedModality('')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}


              {selectedBeads.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F3EEE3] border border-[#DDD4C5] text-[#1F1A15] text-[11px] font-mono font-bold shadow-sm"
                >
                  <span>{b}</span>
                  <button onClick={() => toggleBead(b)} className="hover:text-[#BA3C2A]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] font-mono text-[#BA3C2A] hover:underline ml-1 font-bold"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Right: Search + Sort Dropdown & Grid View Switcher */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8C6208] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search stone (Pyrite, Citrine)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E0D7C7] text-xs text-[#1F1A15] placeholder:text-[#9E9589] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 font-sans-ui shadow-inner"
              />
            </div>

            {/* Sort Dropdown with 3D styling */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="hidden xl:inline text-[#6B6357] font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E0D7C7] text-[#1F1A15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37] font-option shadow-sm cursor-pointer"
              >
                <option value="bestselling">🔥 Best Selling</option>
                <option value="price-low">₹ Price: Low to High</option>
                <option value="price-high">₹ Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>
            </div>

            {/* View Switcher (4 cols vs 2 cols on desktop) */}
            <div className="hidden lg:flex items-center gap-1 p-1 bg-[#F4EFE6] border border-[#E0D7C7] rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition ${
                  gridCols === 4 ? 'bg-[#FFFFFF] text-[#8C6208] shadow-sm font-bold' : 'text-[#8C8377] hover:text-[#1F1A15]'
                }`}
                title="4 Columns View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(2)}
                className={`p-1.5 rounded-lg transition ${
                  gridCols === 2 ? 'bg-[#FFFFFF] text-[#8C6208] shadow-sm font-bold' : 'text-[#8C8377] hover:text-[#1F1A15]'
                }`}
                title="2 Columns View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN LAYOUT: SIDEBAR + PRODUCT GRID (LIGHT SPIRITUAL LUXURY) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR FILTERS (DESKTOP) */}
          {sidebarOpen && (
            <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 store-sidebar-light p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
                <span className="font-editorial text-base font-bold text-[#1F1A15] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#B8860B]" />
                  <span>Refine Vault</span>
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[11px] font-mono text-[#BA3C2A] hover:underline font-bold"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Accordion 1: Purpose Filter */}
              <div className="space-y-3 pb-4 border-b border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => toggleSection('purpose')}
                  className="w-full flex items-center justify-between text-xs font-option uppercase tracking-wider text-[#1F1A15] font-bold"
                >
                  <span>Purpose &amp; Intention</span>
                  {openSections.purpose ? <ChevronUp className="w-4 h-4 text-[#8C6208]" /> : <ChevronDown className="w-4 h-4 text-[#8C6208]" />}
                </button>

                {openSections.purpose && (
                  <div className="space-y-2 pt-1">
                    {PURPOSES.map((p) => {
                      const count = purposeCounts[p.id] ?? 0;
                      return (
                        <label
                          key={p.id}
                          className="flex items-center justify-between text-xs font-sans-ui text-[#4A4237] hover:text-[#1F1A15] cursor-pointer group py-1"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="purpose-radio"
                              checked={selectedPurpose === p.id}
                              onChange={() => setSelectedPurpose(p.id)}
                              className="accent-[#B8860B] w-3.5 h-3.5"
                            />
                            <span className={selectedPurpose === p.id ? 'text-[#8C6208] font-bold' : 'font-medium'}>
                              {p.label}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-[#9E9589] group-hover:text-[#6B6357]">
                            ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Price Slider */}
              <div className="space-y-3 pb-4 border-b border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between text-xs font-option uppercase tracking-wider text-[#1F1A15] font-bold"
                >
                  <span>Price Range (₹ INR)</span>
                  {openSections.price ? <ChevronUp className="w-4 h-4 text-[#8C6208]" /> : <ChevronDown className="w-4 h-4 text-[#8C6208]" />}
                </button>

                {openSections.price && (
                  <div className="space-y-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={2500}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#B8860B] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs font-mono text-[#6B6357]">
                      <span>₹0</span>
                      <span className="text-[#8C6208] font-bold">Max: ₹{maxPrice}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Bead / Gemstone Type with 3D Chips */}
              <div className="space-y-3 pb-4 border-b border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => toggleSection('beads')}
                  className="w-full flex items-center justify-between text-xs font-option uppercase tracking-wider text-[#1F1A15] font-bold"
                >
                  <span>Gemstone Specimen</span>
                  {openSections.beads ? <ChevronUp className="w-4 h-4 text-[#8C6208]" /> : <ChevronDown className="w-4 h-4 text-[#8C6208]" />}
                </button>

                {openSections.beads && (
                  <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
                    {BEAD_TYPES.map((bead) => {
                      const isSelected = selectedBeads.includes(bead);
                      return (
                        <label
                          key={bead}
                          className="flex items-center gap-2 text-xs font-sans-ui text-[#4A4237] hover:text-[#1F1A15] cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBead(bead)}
                            className="accent-[#B8860B] rounded w-3.5 h-3.5"
                          />
                          <span className={isSelected ? 'text-[#8C6208] font-bold' : 'font-medium'}>
                            {bead}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: Size */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleSection('size')}
                  className="w-full flex items-center justify-between text-xs font-option uppercase tracking-wider text-[#1F1A15] font-bold"
                >
                  <span>Wrist &amp; Bead Size</span>
                  {openSections.size ? <ChevronUp className="w-4 h-4 text-[#8C6208]" /> : <ChevronDown className="w-4 h-4 text-[#8C6208]" />}
                </button>

                {openSections.size && (
                  <div className="space-y-2 pt-1">
                    {BRACELET_SIZES.map((size) => (
                      <label
                        key={size.id}
                        className="flex items-start gap-2 text-xs font-sans-ui text-[#4A4237] hover:text-[#1F1A15] cursor-pointer py-1"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size.id)}
                          onChange={() => toggleSize(size.id)}
                          className="accent-[#B8860B] rounded w-3.5 h-3.5 mt-0.5"
                        />
                        <div>
                          <span className="block font-semibold text-[#1F1A15]">{size.label}</span>
                          <span className="text-[10px] text-[#8C8377] font-mono">{size.sub}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* MAIN PRODUCT GRID (3D LIGHT CARDS) */}
          <div className={`${sidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-8`}>
            {loadingCatalog ? (
              <div
                className={`grid grid-cols-2 ${
                  gridCols === 4 && !sidebarOpen
                    ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : gridCols === 4
                    ? 'sm:grid-cols-2 md:grid-cols-3'
                    : 'sm:grid-cols-2'
                } gap-4 sm:gap-6`}
              >
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="store-card-light p-4 space-y-3 animate-pulse bg-white rounded-2xl border border-[#EAE3D5]">
                    <div className="aspect-square w-full rounded-xl bg-[#F4EFE6]" />
                    <div className="h-4 w-3/4 bg-[#EDE5D6] rounded-full" />
                    <div className="h-3 w-1/2 bg-[#EDE5D6] rounded-full" />
                    <div className="pt-2 border-t border-[#EAE3D5] flex justify-between items-center">
                      <div className="h-5 w-20 bg-[#EDE5D6] rounded-full" />
                      <div className="h-7 w-20 bg-[#D4AF37]/20 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center store-card-light space-y-4">
                <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto animate-bounce" />
                <h3 className="font-editorial text-2xl font-bold text-[#1F1A15]">No Specimens Found in Vault</h3>
                <p className="text-xs text-[#6B6357] max-w-md mx-auto">
                  {catalog.length === 0
                    ? 'The vault is currently preparing consecrated masterworks. Please check back shortly.'
                    : 'Try adjusting your purpose or price filters to explore other consecrated gemstones in our vault.'}
                </p>
                {catalog.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="cta-3d-gold px-6 py-2.5 rounded-full text-xs font-bold"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 ${
                  gridCols === 4 && !sidebarOpen
                    ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : gridCols === 4
                    ? 'sm:grid-cols-2 md:grid-cols-3'
                    : 'sm:grid-cols-2'
                } gap-4 sm:gap-6`}
              >
                {filteredProducts.map((prod) => {
                  const prodId = prod.id || prod._id;
                  const prodSlug = prod.slug || prodId;
                  const prodImg = prod.images?.[0] || prod.heroImage || prod.hero_image || prod.image || 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80';
                  const prodPrice = Number(prod.price || prod.sellingPrice || prod.selling_price || prod.basePrice || 0);
                  const prodOrigPrice = Number(prod.originalPrice || prod.original_price || (prodPrice ? prodPrice * 1.25 : 0));
                  const prodDiscount = prod.discountPercent || prod.discountPercentage || (prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0);
                  const prodBadge = prod.badge || (prod.newArrival ? 'New Arrival' : prod.bestseller ? 'Best Seller' : prod.premiumCollection ? 'Masterwork' : null);

                  return (
                    <div
                      key={prodId}
                      className="store-card-light group flex flex-col justify-between overflow-hidden relative"
                    >
                      {/* Top Image Container */}
                      <Link href={`/product/${prodSlug}`} className="relative aspect-square w-full overflow-hidden block bg-[#F5EFE6]">
                        <Image
                          src={prodImg}
                          alt={prod.name || 'Consecrated Crystal'}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-108 transition-transform duration-500"
                        />

                        {/* Badge Overlays */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                          {prodBadge && (
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase shadow-md ${
                                prod.badgeColor || 'bg-[#B8860B] text-white'
                              }`}
                            >
                              {prodBadge}
                            </span>
                          )}
                          {(prod.beadSize || prod.category) && (
                            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#8C6208] text-[9px] font-mono uppercase tracking-wider border border-[#D4AF37]/40 shadow-sm font-bold">
                              {prod.beadSize || prod.category}
                            </span>
                          )}
                        </div>

                        {/* Savings pill top-right */}
                        {prodDiscount > 0 && (
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#BA3C2A] text-white text-[10px] font-mono font-extrabold shadow-md">
                            {prodDiscount}% OFF
                          </div>
                        )}

                        {/* Quick Add Slide-Up Overlay */}
                        <div className="absolute inset-x-2 bottom-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(prod, e)}
                            className="w-full cta-3d-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xl"
                          >
                            {quickAddedId === prodId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span className="text-white font-bold">Added to Vault!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                                <span className="text-white font-bold">Quick Add &bull; ₹{prodPrice.toLocaleString('en-IN')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </Link>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#FFFFFF]">
                      <div className="space-y-1.5">
                        {/* Star Rating & Verified Count */}
                        <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-sans-ui">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#1F1A15]">{prod.rating}</span>
                          <span className="text-[10px] text-[#8C8377]">({prod.reviewsCount})</span>
                        </div>

                        {/* Title */}
                        <Link href={`/product/${prodSlug}`}>
                          <h3 className="font-editorial text-sm sm:text-base font-bold text-[#1F1A15] group-hover:text-[#BA3C2A] transition line-clamp-2 leading-snug">
                            {prod.name}
                          </h3>
                        </Link>

                        {/* Subtitle / Gemstone breakdown */}
                        <p className="text-[11px] text-[#6B6357] line-clamp-1 font-sans-ui">
                          {prod.subtitle || prod.shortDescription || prod.category || 'High-Vibrational Energy Specimen'}
                        </p>
                      </div>

                      {/* Pricing Row & Instant Buy */}
                      <div className="pt-2 border-t border-[#EAE3D5] space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-lg sm:text-xl font-bold text-[#1F1A15]">
                              ₹{prodPrice.toLocaleString('en-IN')}
                            </span>
                            {prodOrigPrice > prodPrice && (
                              <span className="text-xs text-[#9E9589] font-mono line-through">
                                ₹{prodOrigPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          {prodOrigPrice > prodPrice && (
                            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Save ₹{(prodOrigPrice - prodPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Order Now (Terracotta Red High-Intent 3D CTA) */}
                        <Link
                          href={`/product/${prodSlug}`}
                          className="w-full py-2.5 px-3 rounded-xl cta-3d-red text-white font-option text-xs font-bold flex items-center justify-center gap-1.5 transition group/btn"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Acquire Specimen</span>
                          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. MOBILE FILTER MODAL / DRAWER (LIGHT THEME) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-full max-w-xs h-full bg-[#FFFFFF] p-6 overflow-y-auto space-y-6 border-l border-[#EAE3D5] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D5]">
              <span className="font-editorial text-lg font-bold text-[#1F1A15] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B8860B]" />
                <span>Filters</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-[#F4EFE6] text-[#1F1A15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Purpose Filter */}
            <div className="space-y-2">
              <span className="text-xs font-option uppercase text-[#8C6208] font-bold block">Purpose</span>
              {PURPOSES.map((p) => {
                const count = purposeCounts[p.id] ?? 0;
                return (
                  <label key={p.id} className="flex items-center justify-between text-xs text-[#4A4237] py-1.5">
                    <span className="font-medium">{p.label} ({count})</span>
                    <input
                      type="radio"
                      name="mobile-purpose"
                      checked={selectedPurpose === p.id}
                      onChange={() => setSelectedPurpose(p.id)}
                      className="accent-[#B8860B]"
                    />
                  </label>
                );
              })}
            </div>

            {/* Mobile Bead Types */}
            <div className="space-y-2 pt-3 border-t border-[#EAE3D5]">
              <span className="text-xs font-option uppercase text-[#8C6208] font-bold block">Gemstone Type</span>
              {BEAD_TYPES.map((b) => (
                <label key={b} className="flex items-center justify-between text-xs text-[#4A4237] py-1.5">
                  <span className="font-medium">{b}</span>
                  <input
                    type="checkbox"
                    checked={selectedBeads.includes(b)}
                    onChange={() => toggleBead(b)}
                    className="accent-[#B8860B] rounded"
                  />
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EAE3D5] flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 rounded-xl bg-[#F4EFE6] text-xs font-mono font-bold text-[#1F1A15]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 cta-3d-gold py-2.5 rounded-xl text-xs font-bold text-white"
              >
                Apply
              </button>
            </div>
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
        <div className="min-h-screen flex items-center justify-center text-xs font-mono text-[#8C6208] bg-[#FCFAF6]">
          Loading Sacred Masterwork Treasury...
        </div>
      }
    >
      <MasterworksShopContent />
    </Suspense>
  );
}
