'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '../../store/useCart';
import DualTierFilterTicker, { DEFAULT_INTENTIONS, DEFAULT_MODALITIES } from '../../components/DualTierFilterTicker';
import { getSupabaseProducts, getSupabaseStoreFilters, DEFAULT_STORE_FILTERS } from '../../lib/supabase';
import {
  DISCOVERY_PILLARS,
  formatProductMultiTags,
  getFilterLabel,
  TOP_NAV_SHOP_MENU,
  productMatchesFilters,
} from '../../lib/discoveryTaxonomy';
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
  Tag,
  Layers,
  Crown,
} from 'lucide-react';

function MasterworksShopContent() {
  const searchParams = useSearchParams();
  const initialPurpose = searchParams.get('purpose') || 'all';
  const initialFilter = searchParams.get('filter') || '';
  const initialPillar = searchParams.get('pillar') || '';
  const initialSort = searchParams.get('sort') || 'bestselling';

  const [selectedPurpose, setSelectedPurpose] = useState(initialPurpose);
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedDiscoveryFilters, setSelectedDiscoveryFilters] = useState(
    initialFilter ? [initialFilter] : []
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(initialSort === 'new_arrival' ? 'newest' : 'bestselling');
  const [gridCols, setGridCols] = useState(4); // 4 or 2
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [storeFilters, setStoreFilters] = useState(DEFAULT_STORE_FILTERS);

  // Accordion toggle states in sidebar for the 6 pillars + price
  const [openSections, setOpenSections] = useState({
    purpose: true,
    energy_system: true,
    crystal_specimen: true,
    jewellery: true,
    bead_size: true,
    home_space: true,
    price: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDiscoveryFilter = (filterId) => {
    setSelectedDiscoveryFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedPurpose('all');
    setSelectedModality('');
    setSelectedDiscoveryFilters([]);
    setMinPrice(0);
    setMaxPrice(50000);
    setSearchQuery('');
  };

  // Dynamic filter lists loaded from admin/database
  const dynamicIntentions = useMemo(() => {
    const group = storeFilters.find((f) => f.id === 'purpose' || f.id === 'intentions' || f.type === 'ticker_row1');
    const opts = group?.options?.filter((o) => o.isActive !== false);
    return opts && opts.length > 0 ? opts : DEFAULT_INTENTIONS;
  }, [storeFilters]);

  const dynamicModalities = useMemo(() => {
    const group = storeFilters.find((f) => f.id === 'energy_system' || f.id === 'modalities' || f.type === 'ticker_row2');
    const opts = group?.options?.filter((o) => o.isActive !== false);
    return opts && opts.length > 0 ? opts : DEFAULT_MODALITIES;
  }, [storeFilters]);

  useEffect(() => {
    let isMounted = true;
    getSupabaseStoreFilters()
      .then((data) => {
        if (isMounted && data && Array.isArray(data)) setStoreFilters(data);
      })
      .catch((err) => console.warn('Store filters load note:', err.message));

    const handleFilterUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) setStoreFilters(e.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sumuk_filters_updated', handleFilterUpdate);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('sumuk_filters_updated', handleFilterUpdate);
      }
    };
  }, []);

  // Sync with initial URL filter if changes
  useEffect(() => {
    if (initialFilter && !selectedDiscoveryFilters.includes(initialFilter)) {
      setSelectedDiscoveryFilters([initialFilter]);
    }
  }, [initialFilter]);

  const { addItem, openDrawer } = useCartStore();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const supaItems = await getSupabaseProducts(true);

        if (supaItems && supaItems.length > 0) {
          if (isMounted) setCatalog(supaItems);
          return;
        }

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

        if (isMounted) setCatalog(supaItems || []);
      } catch (err) {
        console.error('Storefront live catalog fetch error:', err);
        if (isMounted) setCatalog([]);
      } finally {
        if (isMounted) setLoadingCatalog(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, [API_BASE]);

  // Dynamic Product Filter Logic (Supports all 6 Pillars simultaneously)
  const filteredProducts = useMemo(() => {
    let list = [...catalog];

    // 1. Discovery Multi-Tag Filters across 6 Pillars
    if (selectedDiscoveryFilters.length > 0) {
      list = list.filter((p) => {
        return selectedDiscoveryFilters.some((fId) => {
          const assigned = Array.isArray(p.assignedFilters)
            ? p.assignedFilters
            : (Array.isArray(p.assigned_filters) ? p.assigned_filters : (Array.isArray(p.tags) ? p.tags : []));

          if (assigned.includes(fId)) return true;

          // Soft matching for fallback attributes
          const tagLabel = getFilterLabel(fId).toLowerCase();
          const pText = [
            p.name || '',
            p.subtitle || '',
            p.category || '',
            p.collection || '',
            p.crystalType || p.crystal_type || '',
            p.zodiac || '',
            Array.isArray(p.chakra) ? p.chakra.join(' ') : (p.chakra || ''),
            p.beadSize || p.bead_size || '',
            p.purpose || '',
          ].join(' ').toLowerCase();

          return pText.includes(tagLabel);
        });
      });
    }

    // 2. Purpose Ticker Filter
    if (selectedPurpose && selectedPurpose !== 'all') {
      const pLow = selectedPurpose.toLowerCase();
      list = list.filter((p) => {
        const assigned = Array.isArray(p.assignedFilters)
          ? p.assignedFilters
          : (Array.isArray(p.assigned_filters) ? p.assigned_filters : (Array.isArray(p.tags) ? p.tags : []));
        if (assigned.some((f) => f.toLowerCase().includes(pLow))) return true;

        return (
          (p.purpose && p.purpose.toLowerCase().includes(pLow)) ||
          (p.category && p.category.toLowerCase().includes(pLow)) ||
          (p.collection && p.collection.toLowerCase().includes(pLow)) ||
          (p.chakra && (Array.isArray(p.chakra) ? p.chakra.some((c) => c.toLowerCase().includes(pLow)) : String(p.chakra).toLowerCase().includes(pLow)))
        );
      });
    }

    // 3. Modality / Energy Ticker Filter
    if (selectedModality) {
      const mLow = selectedModality.toLowerCase();
      list = list.filter((p) => {
        const assigned = Array.isArray(p.assignedFilters)
          ? p.assignedFilters
          : (Array.isArray(p.assigned_filters) ? p.assigned_filters : (Array.isArray(p.tags) ? p.tags : []));
        if (assigned.some((f) => f.toLowerCase().includes(mLow))) return true;

        return (
          (p.category && p.category.toLowerCase().includes(mLow)) ||
          (p.collection && p.collection.toLowerCase().includes(mLow)) ||
          (p.crystalType && p.crystalType.toLowerCase().includes(mLow)) ||
          (p.crystal_type && p.crystal_type.toLowerCase().includes(mLow))
        );
      });
    }

    // 4. Price range
    list = list.filter((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || p.basePrice || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // 5. Search query
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

    // 6. Sort
    if (sortBy === 'bestselling') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival || b.new_arrival ? 1 : 0) - (a.isNewArrival || a.new_arrival ? 1 : 0));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || a.sellingPrice || 0) - (b.price || b.sellingPrice || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || b.sellingPrice || 0) - (a.price || a.sellingPrice || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [catalog, selectedDiscoveryFilters, selectedPurpose, selectedModality, minPrice, maxPrice, searchQuery, sortBy]);

  // Compute live product counts for every option in the 6 Discovery Pillars
  const discoveryCounts = useMemo(() => {
    const map = {};
    DISCOVERY_PILLARS.forEach((pillar) => {
      pillar.options.forEach((opt) => {
        const optIdLow = opt.id.toLowerCase();
        const optValLow = opt.value.toLowerCase();
        const optLblLow = opt.label.toLowerCase();

        const count = catalog.filter((p) => {
          const assigned = Array.isArray(p.assignedFilters)
            ? p.assignedFilters
            : (Array.isArray(p.assigned_filters) ? p.assigned_filters : (Array.isArray(p.tags) ? p.tags : []));

          if (assigned.some((f) => f.toLowerCase() === optIdLow || f.toLowerCase() === optValLow)) return true;

          const pText = [
            p.name || '',
            p.subtitle || '',
            p.category || '',
            p.collection || '',
            p.crystalType || p.crystal_type || '',
            p.zodiac || '',
            Array.isArray(p.chakra) ? p.chakra.join(' ') : (p.chakra || ''),
            p.beadSize || p.bead_size || '',
            p.purpose || '',
          ].join(' ').toLowerCase();

          return pText.includes(optLblLow) || pText.includes(optValLow);
        }).length;

        map[opt.id] = count;
      });
    });
    return map;
  }, [catalog]);

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
    setTimeout(() => setQuickAddedId(null), 1800);
    openDrawer();
  };

  const activeFiltersCount =
    (selectedPurpose !== 'all' ? 1 : 0) +
    (selectedModality ? 1 : 0) +
    selectedDiscoveryFilters.length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F1A15] pb-24 font-sans-ui">
      {/* 1. HERO HEADER SECTION */}
      <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[#EAE3D5] bg-gradient-to-b from-[#F7F3EB] to-[#FDFBF7]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4E0] border border-[#D4AF37]/50 shadow-sm text-xs font-mono tracking-widest uppercase text-[#8C6208]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
            <span>Masterworks Discovery Sanctuary</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F1A15]">
            Vedic Consecrated Crystal Vault
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6357] max-w-2xl mx-auto leading-relaxed font-sans-ui font-normal">
            100% lab-certified natural crystals, metaphysical energy bands, and Vedic consecrated malas hand-strung by master artisans for maximum pranic vitality.
          </p>
        </div>

        {/* Dual-Tier Horizontal Ticker Register (Purpose & Energy System) */}
        <div className="mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <DualTierFilterTicker
            intentions={dynamicIntentions}
            modalities={dynamicModalities}
            selectedIntention={selectedPurpose}
            onSelectIntention={(id) => setSelectedPurpose(id)}
            selectedModality={selectedModality}
            onSelectModality={(id) => setSelectedModality((prev) => (prev === id ? '' : id))}
            isMarquee={false}
          />
        </div>
      </section>

      {/* 2. FILTER & SORT CONTROL BAR */}
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
              <span className="font-bold">{sidebarOpen ? 'Hide Filters' : 'Show 6-Pillar Filters'}</span>
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
                  <span>{getFilterLabel(selectedPurpose) || selectedPurpose}</span>
                  <button onClick={() => setSelectedPurpose('all')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedModality && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAE8F5] border border-[#9333EA]/30 text-[#6B21A8] text-[11px] font-mono font-bold shadow-sm">
                  <span>{getFilterLabel(selectedModality) || selectedModality}</span>
                  <button onClick={() => setSelectedModality('')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedDiscoveryFilters.map((fId) => (
                <span
                  key={fId}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F3EEE3] border border-[#DDD4C5] text-[#1F1A15] text-[11px] font-mono font-bold shadow-sm"
                >
                  <span>{getFilterLabel(fId)}</span>
                  <button onClick={() => toggleDiscoveryFilter(fId)} className="hover:text-[#BA3C2A]">
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

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="hidden xl:inline text-[#6B6357] font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E0D7C7] text-[#1F1A15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37] font-option shadow-sm cursor-pointer"
              >
                <option value="bestselling">🔥 Best Selling</option>
                <option value="newest">✨ New Arrivals</option>
                <option value="price-low">₹ Price: Low to High</option>
                <option value="price-high">₹ Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>
            </div>

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

      {/* 3. MAIN LAYOUT: 6-PILLAR SIDEBAR + PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR FILTERS (DESKTOP) */}
          {sidebarOpen && (
            <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 store-sidebar-light p-6 max-h-[85vh] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
                <span className="font-editorial text-base font-bold text-[#1F1A15] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#B8860B]" />
                  <span>Discovery Filters</span>
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

              {/* 6 DISCOVERY PILLARS ACCORDIONS */}
              {DISCOVERY_PILLARS.map((pillar) => {
                const isOpen = openSections[pillar.id] !== false;
                const isEnergyPillar = pillar.id === 'energy_system';
                const isHomePillar = pillar.id === 'home_space';

                return (
                  <div key={pillar.id} className="space-y-3 pb-4 border-b border-[#EAE3D5]">
                    <button
                      type="button"
                      onClick={() => toggleSection(pillar.id)}
                      className="w-full flex items-center justify-between text-xs font-option uppercase tracking-wider text-[#1F1A15] font-bold text-left"
                    >
                      <span>{pillar.name}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#8C6208]" /> : <ChevronDown className="w-4 h-4 text-[#8C6208]" />}
                    </button>

                    {isOpen && (
                      <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                        {pillar.options.map((opt) => {
                          const isSelected = selectedDiscoveryFilters.includes(opt.id);
                          const count = discoveryCounts[opt.id] ?? opt.count ?? 0;
                          const isVastu = opt.id.includes('vastu');

                          return (
                            <label
                              key={opt.id}
                              className="flex items-center justify-between text-xs font-sans-ui text-[#4A4237] hover:text-[#1F1A15] cursor-pointer group py-1"
                            >
                              <span className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleDiscoveryFilter(opt.id)}
                                  className="accent-[#B8860B] rounded w-3.5 h-3.5"
                                />
                                <span className={isSelected ? 'text-[#8C6208] font-bold' : 'font-medium'}>
                                  {opt.label}
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
                );
              })}

              {/* Price Slider */}
              <div className="space-y-3 pb-2">
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
                      max={15000}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#B8860B] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs font-mono text-[#6B6357]">
                      <span>₹0</span>
                      <span className="text-[#8C6208] font-bold">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* MAIN PRODUCT GRID */}
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
                    : 'Try adjusting your discovery filters to explore other consecrated gemstones in our vault.'}
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
                  const prodBadge = prod.badge || (prod.newArrival || prod.isNewArrival ? 'New Arrival' : prod.bestseller || prod.isBestSeller ? 'Best Seller' : prod.premiumCollection || prod.isPremiumCollection ? 'Masterwork' : null);
                  const multiTags = formatProductMultiTags(prod, 5);

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
                            <span className="text-[11px] font-bold text-[#1F1A15]">{prod.rating || 5.0}</span>
                            <span className="text-[10px] text-[#8C8377]">({prod.reviewsCount || 108})</span>
                          </div>

                          {/* Title */}
                          <Link href={`/product/${prodSlug}`}>
                            <h3 className="font-editorial text-sm sm:text-base font-bold text-[#1F1A15] group-hover:text-[#BA3C2A] transition line-clamp-2 leading-snug">
                              {prod.name}
                            </h3>
                          </Link>

                          {/* Subtitle */}
                          <p className="text-[11px] text-[#6B6357] line-clamp-1 font-sans-ui">
                            {prod.subtitle || prod.shortDescription || prod.category || 'Consecrated Energy Masterwork'}
                          </p>

                          {/* ⭐ 6-Pillar Multi-Discovery Tags underneath Product */}
                          <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] font-sans-ui leading-tight text-[#8C6208]">
                            {multiTags.map((tag, tIdx, tArr) => (
                              <React.Fragment key={tag}>
                                <span className="font-semibold hover:text-[#B8860B] transition">
                                  {tag}
                                </span>
                                {tIdx < tArr.length - 1 && (
                                  <span className="text-neutral-400 font-bold">&middot;</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
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

                          <Link
                            href={`/product/${prodSlug}`}
                            className="w-full cta-3d-red py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <span>Explore Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
            <div className="p-4 border-b border-[#EAE3D5] flex items-center justify-between">
              <span className="font-editorial text-base font-bold text-[#1F1A15] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B8860B]" />
                <span>Discovery Filters</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#8C8377] hover:text-[#1F1A15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              {/* 6 DISCOVERY PILLARS IN MOBILE DRAWER */}
              {DISCOVERY_PILLARS.map((pillar) => (
                <div key={pillar.id} className="space-y-2 border-b border-[#EAE3D5] pb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1A15]">
                    {pillar.name}
                  </h4>
                  <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                    {pillar.options.map((opt) => {
                      const isSelected = selectedDiscoveryFilters.includes(opt.id);
                      const count = discoveryCounts[opt.id] ?? opt.count ?? 0;
                      return (
                        <label
                          key={opt.id}
                          className="flex items-center justify-between text-xs text-[#4A4237] py-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDiscoveryFilter(opt.id)}
                              className="accent-[#B8860B] rounded w-3.5 h-3.5"
                            />
                            <span className={isSelected ? 'text-[#8C6208] font-bold' : ''}>
                              {opt.label}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-[#9E9589]">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Price Filter Mobile */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1A15]">Price Range</h4>
                <input
                  type="range"
                  min={0}
                  max={15000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B8860B]"
                />
                <div className="flex justify-between text-xs font-mono text-[#6B6357]">
                  <span>₹0</span>
                  <span className="font-bold text-[#8C6208]">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAE3D5] flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 rounded-xl border border-[#D4AF37] text-xs font-bold text-[#8C6208]"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 cta-3d-gold py-2.5 rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MasterworksShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    }>
      <MasterworksShopContent />
    </Suspense>
  );
}
