'use client';

import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  RotateCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Tag,
  Hash,
  Compass,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import {
  getSupabaseStoreFilters,
  saveSupabaseStoreFilters,
  resetDefaultStoreFilters,
  DEFAULT_STORE_FILTERS,
} from '../lib/supabase';

export default function AdminFilterManager({ onToast }) {
  const [filters, setFilters] = useState(DEFAULT_STORE_FILTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Category State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatType, setNewCatType] = useState('sidebar'); // 'ticker_row1' | 'ticker_row2' | 'sidebar'

  // New Option State (keyed by category ID)
  const [activeAddOptionCatId, setActiveAddOptionCatId] = useState(null);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionCount, setNewOptionCount] = useState('');

  // Load Filters on Mount
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    setLoading(true);
    try {
      const data = await getSupabaseStoreFilters();
      if (data && Array.isArray(data)) {
        setFilters(data);
      }
    } catch (err) {
      console.error('Failed to load store filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedFilters) => {
    setSaving(true);
    try {
      const target = updatedFilters || filters;
      await saveSupabaseStoreFilters(target);
      setFilters(target);
      if (onToast) onToast('Filter matrix synchronized successfully!', 'success');
    } catch (err) {
      if (onToast) onToast('Failed to save filters: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add Category Handler
  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      if (onToast) onToast('Please enter a category name.', 'error');
      return;
    }

    const slug = (newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    const newCategory = {
      id: slug || `cat_${Date.now()}`,
      name: newCatName.trim(),
      slug: slug || `cat_${Date.now()}`,
      type: newCatType,
      isActive: true,
      options: [],
    };

    const next = [...filters, newCategory];
    setFilters(next);
    handleSaveAll(next);

    setNewCatName('');
    setNewCatSlug('');
    setShowAddCategoryModal(false);
    if (onToast) onToast(`Created filter category "${newCategory.name}"!`, 'success');
  };

  // Delete Category Handler
  const handleDeleteCategory = (catId) => {
    const cat = filters.find((f) => f.id === catId);
    if (confirm(`Are you sure you want to remove the entire "${cat?.name || catId}" filter category?`)) {
      const next = filters.filter((f) => f.id !== catId);
      setFilters(next);
      handleSaveAll(next);
      if (onToast) onToast(`Removed filter category "${cat?.name || catId}".`, 'info');
    }
  };

  // Toggle Category Active
  const handleToggleCategoryActive = (catId) => {
    const next = filters.map((cat) => (cat.id === catId ? { ...cat, isActive: !cat.isActive } : cat));
    setFilters(next);
    handleSaveAll(next);
  };

  // Add Option to Category Handler
  const handleAddOption = (catId) => {
    if (!newOptionLabel.trim()) {
      if (onToast) onToast('Please enter an option label.', 'error');
      return;
    }

    const val = (newOptionValue.trim() || newOptionLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    const newOpt = {
      id: val || `opt_${Date.now()}`,
      label: newOptionLabel.trim(),
      value: val,
      count: newOptionCount ? Number(newOptionCount) : undefined,
      isActive: true,
    };

    const next = filters.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          options: [...(cat.options || []), newOpt],
        };
      }
      return cat;
    });

    setFilters(next);
    handleSaveAll(next);

    setNewOptionLabel('');
    setNewOptionValue('');
    setNewOptionCount('');
    setActiveAddOptionCatId(null);
    if (onToast) onToast(`Added "${newOpt.label}" to filter category!`, 'success');
  };

  // Delete Option Handler
  const handleDeleteOption = (catId, optId) => {
    const next = filters.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          options: (cat.options || []).filter((opt) => opt.id !== optId),
        };
      }
      return cat;
    });

    setFilters(next);
    handleSaveAll(next);
    if (onToast) onToast('Removed filter option.', 'info');
  };

  // Toggle Option Active
  const handleToggleOptionActive = (catId, optId) => {
    const next = filters.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          options: (cat.options || []).map((opt) =>
            opt.id === optId ? { ...opt, isActive: !opt.isActive } : opt
          ),
        };
      }
      return cat;
    });

    setFilters(next);
    handleSaveAll(next);
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (confirm('Reset all filters to canonical default Energy Intentions, Modalities, Bead Sizes, and Chakras?')) {
      const resetData = await resetDefaultStoreFilters();
      setFilters(resetData.filters || DEFAULT_STORE_FILTERS);
      if (onToast) onToast('Store filters reset to default sacred collection.', 'info');
    }
  };

  // Filter categories by search query
  const displayedFilters = filters.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.options || []).some((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#141210]/90 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-semibold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Storefront Dynamic Filter Matrix</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#E5D5BA]">
            Specimen Filters &amp; Sacred Attributes
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            Add, edit, remove, and reorganize product filters across the customer storefront.
            Changes immediately synchronize with the top dual-tier scrolling ticker, category tags, and the shop sidebar facets.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-rose-300 hover:border-rose-800/60 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCategoryModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Filter Category</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filter categories or option values…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950/70 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <span>{filters.length} Categories</span>
          <span className="text-stone-600">•</span>
          <span>{filters.reduce((sum, f) => sum + (f.options?.length || 0), 0)} Total Options</span>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#D4AF37] animate-spin" />
          <span>Loading dynamic store filters…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFilters.map((category) => (
            <div
              key={category.id}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                category.isActive
                  ? 'bg-stone-950/70 border-[#D4AF37]/20 shadow-xl'
                  : 'bg-stone-950/30 border-stone-800/40 opacity-70'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-100">{category.name}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        category.type === 'ticker_row1'
                          ? 'bg-purple-950/50 text-purple-300 border-purple-800/40'
                          : category.type === 'ticker_row2'
                          ? 'bg-blue-950/50 text-blue-300 border-blue-800/40'
                          : 'bg-amber-950/50 text-amber-300 border-amber-800/40'
                      }`}
                    >
                      {category.type === 'ticker_row1'
                        ? 'Ticker Row 1 (Intentions)'
                        : category.type === 'ticker_row2'
                        ? 'Ticker Row 2 (Modalities)'
                        : 'Shop Sidebar Facet'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-stone-500 mt-1">
                    Slug: <span className="text-stone-400">{category.slug || category.id}</span> •{' '}
                    {category.options?.length || 0} active options
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleCategoryActive(category.id)}
                    title={category.isActive ? 'Disable Category' : 'Enable Category'}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      category.isActive
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'bg-stone-900 border-stone-800 text-stone-500'
                    }`}
                  >
                    {category.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Delete Category"
                    className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-500 hover:text-rose-400 hover:border-rose-800/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options Pills List */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Filter Options &amp; Values:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveAddOptionCatId(activeAddOptionCatId === category.id ? null : category.id)
                    }
                    className="text-[11px] font-bold text-[#D4AF37] hover:text-[#E5D5BA] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Option</span>
                  </button>
                </div>

                {/* Inline Add Option Form */}
                {activeAddOptionCatId === category.id && (
                  <div className="p-3.5 rounded-2xl bg-[#1c1917] border border-[#D4AF37]/40 space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add New Filter Option to {category.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Option Label (e.g. 14mm Jumbo)*"
                        value={newOptionLabel}
                        onChange={(e) => {
                          setNewOptionLabel(e.target.value);
                          if (!newOptionValue) {
                            setNewOptionValue(
                              e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                            );
                          }
                        }}
                        className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="Value / Slug (e.g. 14mm)"
                        value={newOptionValue}
                        onChange={(e) => setNewOptionValue(e.target.value)}
                        className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="number"
                        placeholder="Specimen Count (Optional)"
                        value={newOptionCount}
                        onChange={(e) => setNewOptionCount(e.target.value)}
                        className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveAddOptionCatId(null)}
                        className="px-3 py-1 rounded-xl bg-stone-900 text-stone-400 text-xs hover:text-stone-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddOption(category.id)}
                        className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Option</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Options Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(category.options || []).length === 0 ? (
                    <div className="text-xs text-stone-500 italic py-2">
                      No options defined yet. Click &quot;Add Option&quot; above to create one.
                    </div>
                  ) : (
                    category.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          opt.isActive !== false
                            ? 'bg-stone-900/90 border-stone-700/80 text-stone-200 hover:border-[#D4AF37]/50'
                            : 'bg-stone-950/40 border-stone-800 text-stone-600 line-through'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {typeof opt.count === 'number' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-800 text-[#D4AF37]">
                            {opt.count}
                          </span>
                        )}

                        <div className="flex items-center gap-1 pl-1 border-l border-stone-700/60">
                          <button
                            type="button"
                            onClick={() => handleToggleOptionActive(category.id, opt.id)}
                            title={opt.isActive !== false ? 'Hide Option' : 'Show Option'}
                            className="text-stone-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
                          >
                            {opt.isActive !== false ? (
                              <Eye className="w-3 h-3" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteOption(category.id, opt.id)}
                            title="Remove Option"
                            className="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Filter Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141210] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5 text-[#D4AF37]">
                <Plus className="w-5 h-5" />
                <h3 className="font-serif text-xl font-bold text-[#E5D5BA]">
                  Add New Filter Category
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Category Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sacred Crystal Shapes, Vedic Astrological Signs"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Slug / Unique Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. sacred_shapes"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Display Location on Customer Storefront
                </label>
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="sidebar">Shop Sidebar Facet &amp; Accordion</option>
                  <option value="ticker_row1">Dual-Tier Ticker Row 1 (Primary Intentions)</option>
                  <option value="ticker_row2">Dual-Tier Ticker Row 2 (Healing Modalities)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 text-xs hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
