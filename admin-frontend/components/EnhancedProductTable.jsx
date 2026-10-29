'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Layers,
  Sparkles,
  Star,
  CheckCircle2,
  AlertCircle,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  ShieldCheck,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { getSupabaseStoreFilters, saveSupabaseStoreFilters } from '../lib/supabase';
import { DISCOVERY_PILLARS } from '../lib/discoveryTaxonomy';

export default function EnhancedProductTable({
  products = [],
  onOpenCreateProduct,
  onEditProduct,
  onPreviewProduct,
  onDuplicateProduct,
  onToggleProductStatus,
  onDeleteProduct,
  onBulkAction,
  searchQuery,
  setSearchQuery,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('');
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Filter Assignment Modal State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterModalTargetIds, setFilterModalTargetIds] = useState([]);
  const [selectedFiltersForModal, setSelectedFiltersForModal] = useState([]);
  const [filterModalSearch, setFilterModalSearch] = useState('');
  const [filterModalMode, setFilterModalMode] = useState('merge'); // 'merge' | 'replace'
  const [storeFilters, setStoreFilters] = useState(DISCOVERY_PILLARS);
  const [newQuickFilterName, setNewQuickFilterName] = useState('');
  const [newQuickFilterCategory, setNewQuickFilterCategory] = useState('purpose');
  const [showQuickAddFilter, setShowQuickAddFilter] = useState(false);
  const [isAddingNewFilter, setIsAddingNewFilter] = useState(false);
  const [modalFeedback, setModalFeedback] = useState('');
  const [openModalAccordions, setOpenModalAccordions] = useState({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load dynamic store filters on mount
  const loadDynamicFilters = async () => {
    try {
      const data = await getSupabaseStoreFilters();
      const base = DISCOVERY_PILLARS.map((p) => ({ ...p, options: [...p.options] }));
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((cat) => {
          const matched = base.find(
            (b) => b.id === cat.id || b.id === cat.slug || b.name.toLowerCase() === (cat.name || '').toLowerCase()
          );
          if (matched) {
            (cat.options || []).forEach((opt) => {
              const optId = opt.id || `${matched.id}:${opt.value || opt.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              if (!matched.options.some((o) => o.id === optId || o.value === opt.value)) {
                matched.options.push({
                  id: optId,
                  label: opt.label,
                  value: opt.value || optId,
                  subGroup: 'Custom Added',
                });
              }
            });
          } else {
            base.push({
              id: cat.id || cat.slug,
              name: cat.name,
              subtitle: `Custom Filter Category (${(cat.options || []).length} options)`,
              badgeColor: 'from-[#D4AF37]/20 to-[#B8860B]/10 border-[#D4AF37]/40 text-[#D4AF37]',
              options: (cat.options || []).map((o) => ({
                id: o.id || `${cat.id}:${o.value || o.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                label: o.label,
                value: o.value,
                subGroup: 'Custom Added',
              })),
            });
          }
        });
      }
      setStoreFilters(base);
    } catch (err) {
      setStoreFilters(DISCOVERY_PILLARS);
    }
  };

  useEffect(() => {
    loadDynamicFilters();
  }, []);

  const handleOpenBulkFilterModal = () => {
    if (selectedIds.length === 0) return;
    setFilterModalTargetIds(selectedIds);
    const selectedProds = products.filter((p) => selectedIds.includes(p.id || p.slug));
    const allFilters = new Set();
    selectedProds.forEach((p) => {
      const tags = p.assigned_filters || p.assignedFilters || p.tags || [];
      tags.forEach((t) => allFilters.add(t));
    });
    setSelectedFiltersForModal(Array.from(allFilters));
    setFilterModalMode('merge');
    setFilterModalSearch('');
    setShowFilterModal(true);
  };

  const handleOpenSingleProductFilters = (prod) => {
    const targetId = prod.id || prod.slug;
    setFilterModalTargetIds([targetId]);
    const tags = prod.assigned_filters || prod.assignedFilters || prod.tags || [];
    setSelectedFiltersForModal([...tags]);
    setFilterModalMode('replace');
    setFilterModalSearch('');
    setShowFilterModal(true);
  };

  const handleQuickAddFilterInModal = async () => {
    if (!newQuickFilterName.trim()) return;
    setIsAddingNewFilter(true);
    setModalFeedback('');
    try {
      const cleanLabel = newQuickFilterName.trim();
      const cleanValue = cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newFilterId = `${newQuickFilterCategory}:${cleanValue}`;
      const newOption = {
        id: newFilterId,
        label: cleanLabel,
        value: cleanValue,
        subGroup: 'Custom Added',
      };

      setStoreFilters((prev) =>
        prev.map((cat) => {
          if (cat.id === newQuickFilterCategory) {
            if (cat.options.some((o) => o.id === newFilterId || o.value === cleanValue)) return cat;
            return { ...cat, options: [...cat.options, newOption] };
          }
          return cat;
        })
      );

      setSelectedFiltersForModal((prev) => Array.from(new Set([...prev, newFilterId])));

      const currentStoreFilters = await getSupabaseStoreFilters();
      let updatedStoreFilters = [...currentStoreFilters];
      const targetCategory = updatedStoreFilters.find(
        (c) => c.id === newQuickFilterCategory || c.slug === newQuickFilterCategory
      );
      if (targetCategory) {
        updatedStoreFilters = updatedStoreFilters.map((c) => {
          if (c.id === targetCategory.id) {
            const exists = (c.options || []).some((o) => o.id === newFilterId || o.value === cleanValue);
            return exists
              ? c
              : {
                  ...c,
                  options: [
                    ...(c.options || []),
                    { id: newFilterId, label: cleanLabel, value: cleanValue, count: 1, isActive: true },
                  ],
                };
          }
          return c;
        });
      } else {
        const catInfo = storeFilters.find((c) => c.id === newQuickFilterCategory);
        updatedStoreFilters.push({
          id: newQuickFilterCategory,
          name: catInfo?.name || newQuickFilterCategory.toUpperCase(),
          slug: newQuickFilterCategory,
          type: 'sidebar',
          options: [{ id: newFilterId, label: cleanLabel, value: cleanValue, count: 1, isActive: true }],
        });
      }
      await saveSupabaseStoreFilters(updatedStoreFilters);

      setModalFeedback(`✨ Added "${cleanLabel}" & checked in matrix!`);
      setNewQuickFilterName('');
      setShowQuickAddFilter(false);
      setTimeout(() => setModalFeedback(''), 4000);
    } catch (err) {
      console.warn('Error quick adding filter:', err);
    } finally {
      setIsAddingNewFilter(false);
    }
  };

  const handleApplyFilters = () => {
    if (onBulkAction) {
      onBulkAction({
        type: 'ASSIGN_FILTERS',
        ids: filterModalTargetIds,
        filters: selectedFiltersForModal,
        mode: filterModalMode,
      });
    }
    setShowFilterModal(false);
    if (filterModalTargetIds.length > 1) {
      setSelectedIds([]);
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.crystalType?.toLowerCase().includes(q) ||
          p.crystal_type?.toLowerCase().includes(q) ||
          p.chakra?.toLowerCase().includes(q) ||
          p.zodiac?.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter !== 'all') {
      list = list.filter((p) => (p.category || 'Energy Bands') === categoryFilter);
    }

    // Collection Filter
    if (collectionFilter !== 'all') {
      list = list.filter((p) => (p.collection || 'Masterworks Collection') === collectionFilter);
    }

    // Stock Status Filter
    if (stockFilter !== 'all') {
      list = list.filter((p) => {
        const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 15);
        if (stockFilter === 'instock') return stock > 5;
        if (stockFilter === 'lowstock') return stock > 0 && stock <= 5;
        if (stockFilter === 'outofstock') return stock <= 0;
        return true;
      });
    }

    // Badge Filter
    if (badgeFilter !== 'all') {
      list = list.filter((p) => {
        if (badgeFilter === 'new') return p.isNewArrival || p.new_arrival;
        if (badgeFilter === 'bestseller') return p.isBestSeller || p.bestseller;
        if (badgeFilter === 'limited') return p.isLimitedEdition || p.limited_edition;
        if (badgeFilter === 'featured') return p.isFeatured || p.featured;
        if (badgeFilter === 'premium') return p.isPremiumCollection || p.premium_collection;
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = Number(a.price || a.selling_price || 0);
      const priceB = Number(b.price || b.selling_price || 0);
      const stockA = a.stockCount !== undefined ? a.stockCount : (a.totalStock !== undefined ? a.totalStock : 15);
      const stockB = b.stockCount !== undefined ? b.stockCount : (b.totalStock !== undefined ? b.totalStock : 15);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'stock-desc') return stockB - stockA;
      if (sortBy === 'stock-asc') return stockA - stockB;
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      // default: newest
      return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
    });

    return list;
  }, [products, searchQuery, categoryFilter, collectionFilter, stockFilter, badgeFilter, sortBy]);

  // Paginated List
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedProducts.slice(start, start + pageSize);
  }, [filteredAndSortedProducts, currentPage, pageSize]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id || p.slug));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeBulkStatus = (activeStatus) => {
    if (onBulkAction) {
      onBulkAction({ type: 'STATUS', ids: selectedIds, value: activeStatus });
      setSelectedIds([]);
    }
  };

  const executeBulkDelete = () => {
    if (onBulkAction) {
      onBulkAction({ type: 'DELETE', ids: selectedIds });
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    }
  };

  const executeBulkFeature = (featureKey) => {
    if (onBulkAction) {
      onBulkAction({ type: 'FEATURE', ids: selectedIds, feature: featureKey });
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-950/80 border border-stone-800 space-y-4 shadow-xl backdrop-blur-xl">
        {/* Row 1: Search & Core Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by crystal name, SKU, crystal family, chakra..."
              className="w-full bg-stone-900 border border-stone-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-9 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Categories</option>
              <option value="Energy Bands">Energy Bands</option>
              <option value="Tumble Stones">Tumble Stones</option>
              <option value="Raw Geodes">Raw Geodes</option>
              <option value="Sacred Malas">Sacred Malas</option>
              <option value="Pendants & Talismans">Pendants</option>
              <option value="Crystal Spheres">Crystal Spheres</option>
              <option value="Energy Wands">Energy Wands</option>
              <option value="Masterwork Geodes">Masterworks</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Stock Statuses</option>
              <option value="instock">In Stock (&gt;5)</option>
              <option value="lowstock">Low Stock (1-5)</option>
              <option value="outofstock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Badge Filter */}
          <div className="md:col-span-2">
            <select
              value={badgeFilter}
              onChange={(e) => {
                setBadgeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Badges</option>
              <option value="new">✨ New Arrivals</option>
              <option value="bestseller">🔥 Best Sellers</option>
              <option value="limited">💎 Limited Edition</option>
              <option value="featured">⭐ Featured</option>
              <option value="premium">👑 Premium</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Meta & View Switcher */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800/80">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-[#F3E5AB]">{totalItems}</strong> crystal specimens
            </span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-semibold text-[11px]">
                {selectedIds.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl border transition-all ${
                viewMode === 'table'
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl border transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
              title="3D Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-24 z-20 p-3 rounded-2xl bg-stone-950/95 border border-[#D4AF37]/50 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-200 pl-2">
            <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
            <span>{selectedIds.length} Specimens Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => executeBulkStatus(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/80 transition-colors"
            >
              Bulk Activate
            </button>
            <button
              type="button"
              onClick={() => executeBulkStatus(false)}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Bulk Draft
            </button>
            <button
              type="button"
              onClick={() => executeBulkFeature('bestseller')}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold hover:bg-[#D4AF37]/30 transition-colors"
            >
              Mark Best Seller
            </button>
            <button
              type="button"
              onClick={() => executeBulkFeature('featured')}
              className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-semibold hover:bg-purple-900/80 transition-colors"
            >
              Mark Featured
            </button>
            <button
              type="button"
              onClick={handleOpenBulkFilterModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition-all shadow-md shadow-[#D4AF37]/20"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Assign Filters ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 text-xs font-semibold hover:bg-rose-900/80 transition-colors"
            >
              Bulk Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="border border-[#D4AF37]/25 rounded-3xl overflow-hidden bg-stone-900/40 backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-950/95 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === paginatedProducts.length}
                      onChange={handleSelectAll}
                      className="accent-[#D4AF37] rounded"
                    />
                  </th>
                  <th className="py-4 px-3 w-16">Specimen</th>
                  <th className="py-4 px-4 min-w-[240px]">Crystal Name &amp; SKU</th>
                  <th className="py-4 px-4 min-w-[140px]">Category &amp; Type</th>
                  <th className="py-4 px-4 min-w-[110px] text-center">Variants</th>
                  <th className="py-4 px-4 min-w-[120px]">Stock Status</th>
                  <th className="py-4 px-4 min-w-[120px]">Price</th>
                  <th className="py-4 px-4 w-24 text-center">Status</th>
                  <th className="py-4 px-4 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-stone-500">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <div className="text-sm font-semibold text-stone-400">No crystal specimens found</div>
                      <div className="text-xs text-stone-500 mt-1">Try adjusting your search criteria or create a new specimen.</div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const id = p.id || p.slug;
                    const isSelected = selectedIds.includes(id);
                    const primaryImg = p.images?.[0] || p.image || p.hero_image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=200&q=80';
                    const variantCount = p.variants?.length || p.product_variants?.length || 1;
                    const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 15);
                    const price = Number(p.price || p.selling_price || 699);
                    const originalPrice = Number(p.originalPrice || p.original_price || (price * 1.5));
                    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                    return (
                      <tr
                        key={id}
                        className={`transition-colors group ${
                          isSelected ? 'bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10' : 'hover:bg-stone-800/40'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(id)}
                            className="accent-[#D4AF37] rounded"
                          />
                        </td>

                        {/* Thumbnail */}
                        <td className="py-3 px-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 relative group-hover:border-[#D4AF37]/50 transition-colors shadow-md">
                            <img
                              src={primaryImg}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>

                        {/* Name & Badges */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-100 group-hover:text-[#F3E5AB] transition-colors flex items-center gap-1.5">
                            <span className="truncate max-w-xs">{p.name || p.title}</span>
                            {p.bestseller && (
                              <span className="px-1.5 py-0.2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded text-[9px] font-bold">
                                Best Seller
                              </span>
                            )}
                            {p.new_arrival && (
                              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[9px] font-bold">
                                New
                              </span>
                            )}
                            {p.limited_edition && (
                              <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded text-[9px] font-bold">
                                Limited
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 truncate max-w-xs">
                            {p.subtitle || p.shortDescription || p.short_description || 'Sacred luxury crystal'}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            SKU: {p.sku || `SKU-${p.slug?.toUpperCase().slice(0, 8)}`}
                          </div>
                        </td>

                        {/* Category & Type & Filters */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300 text-[11px] font-medium">
                            {p.category || 'Energy Bands'}
                          </span>
                          {p.crystalType || p.crystal_type ? (
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              {p.crystalType || p.crystal_type}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            {(p.assigned_filters || p.assignedFilters || p.tags || []).length > 0 ? (
                              <button
                                type="button"
                                onClick={() => handleOpenSingleProductFilters(p)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/35 text-[#F3E5AB] text-[10px] font-medium transition cursor-pointer"
                                title="Edit filters with checkboxes"
                              >
                                <Tag className="w-2.5 h-2.5 text-[#D4AF37]" />
                                <span>{(p.assigned_filters || p.assignedFilters || p.tags || []).length} filters</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenSingleProductFilters(p)}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-500 hover:text-stone-300 text-[10px] transition cursor-pointer"
                                title="Assign filters using checkboxes"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Add Filters</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Variants */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-[11px]">
                            <Layers className="w-3 h-3" /> {variantCount} vars
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          {stock <= 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/50 border border-rose-800 text-rose-400">
                              Out of Stock
                            </span>
                          ) : stock <= 5 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/50 border border-amber-800 text-amber-400">
                              Low ({stock} left)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 border border-emerald-800 text-emerald-400">
                              In Stock ({stock})
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#F3E5AB]">
                            ₹{price.toLocaleString('en-IN')}
                          </div>
                          {originalPrice > price && (
                            <div className="text-[10px] text-stone-500 line-through">
                              ₹{originalPrice.toLocaleString('en-IN')}
                              {discount > 0 && (
                                <span className="text-emerald-400 ml-1 font-semibold">
                                  ({discount}%)
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleProductStatus(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                              p.isActive !== false && p.active !== false
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}
                          >
                            {p.isActive !== false && p.active !== false ? 'Active' : 'Draft'}
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onPreviewProduct(p)}
                              title="Live Customer Simulator"
                              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditProduct(p)}
                              title="Edit in Workspace"
                              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDuplicateProduct(p)}
                              title="Duplicate Specimen"
                              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(p)}
                              title="Delete Specimen"
                              className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900 text-rose-400 hover:text-white border border-rose-900/50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3D CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedProducts.map((p) => {
            const primaryImg = p.images?.[0] || p.image || p.hero_image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80';
            const price = Number(p.price || p.selling_price || 699);
            const originalPrice = Number(p.originalPrice || p.original_price || (price * 1.5));
            const variantCount = p.variants?.length || p.product_variants?.length || 1;

            return (
              <div
                key={p.id || p.slug}
                className="group rounded-3xl bg-gradient-to-br from-stone-900/90 via-[#141210]/95 to-stone-950 border border-stone-800 hover:border-[#D4AF37]/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#D4AF37]/10 flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-stone-950 overflow-hidden">
                  <img
                    src={primaryImg}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-semibold">
                      {variantCount} vars
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                      <span>{p.category || 'Crystal Specimen'}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenSingleProductFilters(p)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3E5AB] hover:bg-[#D4AF37]/25 transition"
                      >
                        🏷️ {(p.assigned_filters || p.assignedFilters || p.tags || []).length} filters
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-100 mt-0.5 line-clamp-1 group-hover:text-[#F3E5AB]">
                      {p.name || p.title}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1 font-light">
                      {p.subtitle || p.shortDescription || p.short_description || p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#F3E5AB]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {originalPrice > price && (
                        <span className="text-xs text-stone-500 line-through ml-1.5">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPreviewProduct(p)}
                        className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-stone-400">
            Page <strong className="text-stone-200">{currentPage}</strong> of{' '}
            <strong className="text-stone-200">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Safety Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141210] border border-rose-800/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-100">
                Bulk Delete {selectedIds.length} Specimens?
              </h3>
              <p className="text-xs text-stone-400">
                Are you sure you want to delete these {selectedIds.length} selected crystal specimens? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeBulkDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30"
              >
                Confirm Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dynamic Filter Assignment Modal (Supports both Bulk and Single Product) */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#141210] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-950 via-[#161310] to-stone-950 border-b border-[#D4AF37]/25 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 flex-shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#F3E5AB] truncate">
                    Assign Filters to {filterModalTargetIds.length === 1 ? 'Specimen' : `${filterModalTargetIds.length} Selected Specimens`}
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate">
                    Check any filter options below to assign discovery pathways to the selected products.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Product(s) Strip */}
            <div className="px-5 py-3 bg-stone-950/70 border-b border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-[11px] font-mono uppercase text-stone-400 whitespace-nowrap font-semibold">
                Target Specimens ({filterModalTargetIds.length}):
              </span>
              {products
                .filter((p) => filterModalTargetIds.includes(p.id || p.slug))
                .slice(0, 5)
                .map((p) => (
                  <span
                    key={p.id || p.slug}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="truncate max-w-[140px]">{p.name || p.title}</span>
                  </span>
                ))}
              {filterModalTargetIds.length > 5 && (
                <span className="text-xs text-stone-500 whitespace-nowrap">
                  +{filterModalTargetIds.length - 5} more
                </span>
              )}
            </div>

            {/* Controls Toolbar: Mode Selection, Search, and Quick Add */}
            <div className="p-4 sm:p-5 bg-stone-950/40 border-b border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Assignment Mode (Merge vs Replace) */}
                <div className="flex items-center gap-2 bg-stone-900/90 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFilterModalMode('merge')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      filterModalMode === 'merge'
                        ? 'bg-[#D4AF37] text-black shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Merge with Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterModalMode('replace')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      filterModalMode === 'replace'
                        ? 'bg-[#D4AF37] text-black shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Replace All
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono font-bold">
                    {selectedFiltersForModal.length} Checked
                  </span>
                  {selectedFiltersForModal.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFiltersForModal([])}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-[11px] font-medium transition"
                    >
                      Uncheck All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowQuickAddFilter((prev) => !prev)}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{showQuickAddFilter ? 'Close' : '➕ Add Filter'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Add Filter Drawer */}
              {showQuickAddFilter && (
                <div className="p-4 rounded-xl bg-stone-950 border border-[#D4AF37]/40 shadow-xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Provision New Filter Tag
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      Saves to store matrix and checks it for these products
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        placeholder="Filter Name (e.g. Stress Relief, Aura Shield, Selenite Tower)..."
                        value={newQuickFilterName}
                        onChange={(e) => setNewQuickFilterName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleQuickAddFilterInModal();
                          }
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={newQuickFilterCategory}
                        onChange={(e) => setNewQuickFilterCategory(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                      >
                        {storeFilters.map((p) => (
                          <option key={p.id} value={p.id}>
                            Category: {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        disabled={!newQuickFilterName.trim() || isAddingNewFilter}
                        onClick={handleQuickAddFilterInModal}
                        className="w-full h-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        {isAddingNewFilter ? (
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>Save &amp; Check</span>
                      </button>
                    </div>
                  </div>
                  {modalFeedback && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{modalFeedback}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search any filter option (e.g. Wealth, Vastu, Mala, 8mm, Solar Plexus)..."
                  value={filterModalSearch}
                  onChange={(e) => setFilterModalSearch(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                />
                {filterModalSearch && (
                  <button
                    type="button"
                    onClick={() => setFilterModalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Matrix Categories with Checkboxes */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
              {storeFilters.map((cat) => {
                const filteredOptions = filterModalSearch.trim()
                  ? cat.options.filter(
                      (opt) =>
                        opt.label.toLowerCase().includes(filterModalSearch.toLowerCase()) ||
                        opt.id.toLowerCase().includes(filterModalSearch.toLowerCase()) ||
                        (opt.subGroup && opt.subGroup.toLowerCase().includes(filterModalSearch.toLowerCase()))
                    )
                  : cat.options;

                if (filteredOptions.length === 0) return null;

                const isOpen = openModalAccordions[cat.id] !== false;
                const catOptionIds = cat.options.map((o) => o.id);
                const selectedInCat = catOptionIds.filter((id) => selectedFiltersForModal.includes(id));
                const allCatSelected = catOptionIds.length > 0 && selectedInCat.length === catOptionIds.length;

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl bg-stone-900/60 border border-stone-800 overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="p-3.5 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenModalAccordions((prev) => ({
                            ...prev,
                            [cat.id]: !isOpen,
                          }))
                        }
                        className="flex items-center gap-2.5 text-left flex-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-serif text-stone-200 uppercase tracking-wider">
                              {cat.name}
                            </span>
                            {selectedInCat.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-[10px] font-mono font-bold">
                                {selectedInCat.length} selected
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {cat.subtitle || `${cat.options.length} discovery options`}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (allCatSelected) {
                              setSelectedFiltersForModal((prev) =>
                                prev.filter((id) => !catOptionIds.includes(id))
                              );
                            } else {
                              setSelectedFiltersForModal((prev) =>
                                Array.from(new Set([...prev, ...catOptionIds]))
                              );
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-semibold transition"
                        >
                          {allCatSelected ? 'Clear Pillar' : 'Select All'}
                        </button>
                      </div>
                    </div>

                    {/* Options Grid with Checkboxes */}
                    {isOpen && (
                      <div className="p-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {filteredOptions.map((opt) => {
                          const isChecked = selectedFiltersForModal.includes(opt.id);

                          return (
                            <label
                              key={opt.id}
                              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 select-none text-left relative ${
                                isChecked
                                  ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/30 text-[#F3E5AB]'
                                  : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFiltersForModal((prev) => [...prev, opt.id]);
                                  } else {
                                    setSelectedFiltersForModal((prev) =>
                                      prev.filter((id) => id !== opt.id)
                                    );
                                  }
                                }}
                                className="mt-0.5 accent-[#D4AF37] rounded"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium leading-snug break-words">
                                  {opt.label}
                                </div>
                                {opt.subGroup && (
                                  <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                                    {opt.subGroup}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
              <div className="text-xs text-stone-400">
                <strong className="text-[#F3E5AB] font-mono">{selectedFiltersForModal.length}</strong> filters checked to apply to{' '}
                <strong className="text-stone-200 font-mono">{filterModalTargetIds.length}</strong> specimen(s)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Apply Filters to Selected ({filterModalTargetIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
