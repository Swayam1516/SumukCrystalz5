'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

                        {/* Category & Type */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300 text-[11px] font-medium">
                            {p.category || 'Energy Bands'}
                          </span>
                          {p.crystalType || p.crystal_type ? (
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              {p.crystalType || p.crystal_type}
                            </div>
                          ) : null}
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
                    <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                      {p.category || 'Crystal Specimen'}
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
    </div>
  );
}
