'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Save,
  Eye,
  Layers,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table as TableIcon,
  Quote,
  Star,
  Zap,
  SlidersHorizontal,
  Flame,
  Globe,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Search,
} from 'lucide-react';
import LuxuryImageUploader from './LuxuryImageUploader';
import LuxuryVariantBuilder from './LuxuryVariantBuilder';
import { supabase, saveProductToSupabase, getSupabaseStoreFilters, saveSupabaseStoreFilters } from '../lib/supabase';
import { useAuthStore } from '../store/useAuth';
import { DISCOVERY_PILLARS, formatProductMultiTags, getFilterLabel } from '../lib/discoveryTaxonomy';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

const CRYSTAL_CATEGORIES = [
  'Energy Bands',
  'Tumble Stones',
  'Raw Geodes',
  'Sacred Malas',
  'Pendants & Talismans',
  'Crystal Spheres',
  'Energy Wands',
  'Masterwork Geodes',
];

const CRYSTAL_COLLECTIONS = [
  'Masterworks Collection',
  'Celestial Sanctuary',
  'Earth Matrix Geodes',
  'Solfeggio Harmonic Attuned',
  'Vedic Heritage Talismans',
  'Founders Private Vault',
];

const CRYSTAL_TYPES = [
  'Pyrite',
  'Amethyst',
  'Clear Quartz',
  "Tiger's Eye",
  'Labradorite',
  'Citrine',
  'Moldavite',
  'Rose Quartz',
  'Black Tourmaline',
  'Emerald',
  'Carnelian',
  'Selenite',
  'Aquamarine',
  'Lapis Lazuli',
  'Malachite',
  'Green Jade',
  'Smoky Quartz',
  'Custom Specimen',
];

export default function AdvancedProductWorkspace({
  isOpen,
  onClose,
  initialProduct = null,
  onSaveSuccess,
  existingProducts = [],
}) {
  if (!isOpen) return null;

  const { token } = useAuthStore();

  // Active Tab State (10 Tabs)
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'media' | 'pricing' | 'inventory' | 'variants' | 'attributes' | 'filters' | 'features' | 'seo' | 'preview'

  // Master Product Form State
  const [productData, setProductData] = useState({
    name: '',
    subtitle: '',
    category: 'Energy Bands',
    collection: 'Masterworks Collection',
    crystalType: 'Pyrite',
    zodiac: 'Leo, Sagittarius, Aries',
    chakra: 'Solar Plexus & Sacral',
    element: 'Earth & Fire',
    shortDescription: '',
    description: '',
    healingBenefits: '',
    careInstructions: '',
    authenticityNote: 'Authentic Natural Crystal & Consecrated by Founder Soumyaa Naveen.',
    price: 699,
    originalPrice: 1299,
    costPrice: 350,
    energizedPrice: 100,
    stockCount: 20,
    lowStockThreshold: 5,
    sku: `SKU-CRYS-${Math.floor(1000 + Math.random() * 9000)}`,
    isActive: true,
    isNewArrival: false,
    isBestSeller: false,
    isLimitedEdition: false,
    isPremiumCollection: false,
    isFeatured: false,
    isOnSale: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [],
    customAttributes: [
      {
        id: 'opt_1',
        name: 'Wrist Fit Size',
        type: 'select',
        values: ['Small (6.5")', 'Medium (7.0")', 'Large (7.5")'],
      },
    ],
    assignedFilters: ['purpose:money-abundance', 'energy:chakra-solar-plexus', 'jewellery:bracelets', 'bead:8mm'],
  });

  const [filterSearch, setFilterSearch] = useState('');
  const [openPillarAccordions, setOpenPillarAccordions] = useState({
    purpose: true,
    energy_system: true,
    crystal_specimen: true,
    jewellery: true,
    bead_size: true,
    home_space: true,
  });

  // Dynamic filter state
  const [pillars, setPillars] = useState(DISCOVERY_PILLARS);
  const [showAddFilterCard, setShowAddFilterCard] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [newFilterPillarId, setNewFilterPillarId] = useState('purpose');
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [filterSuccessMsg, setFilterSuccessMsg] = useState('');

  // Fetch store filters and merge with discovery taxonomy
  useEffect(() => {
    let isMounted = true;
    const loadDynamicFilters = async () => {
      try {
        const storeFilters = await getSupabaseStoreFilters();
        if (storeFilters && Array.isArray(storeFilters) && storeFilters.length > 0 && isMounted) {
          setPillars((prevPillars) => {
            const merged = prevPillars.map((p) => ({ ...p, options: [...p.options] }));
            storeFilters.forEach((cat) => {
              const matchedPillar = merged.find(
                (p) => p.id === cat.id || p.id === cat.slug || p.name.toLowerCase() === (cat.name || '').toLowerCase()
              );
              if (matchedPillar) {
                (cat.options || []).forEach((opt) => {
                  const optId = opt.id || `${matchedPillar.id}:${opt.value || opt.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                  if (!matchedPillar.options.some((o) => o.id === optId || o.value === opt.value)) {
                    matchedPillar.options.push({
                      id: optId,
                      label: opt.label,
                      value: opt.value || optId,
                      subGroup: 'Custom Added',
                    });
                  }
                });
              } else {
                merged.push({
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
            return merged;
          });
        }
      } catch (err) {
        console.warn('Failed to merge dynamic store filters:', err);
      }
    };
    loadDynamicFilters();
    return () => { isMounted = false; };
  }, []);

  // Quick Add Filter Handler
  const handleAddFilter = async () => {
    if (!newFilterName.trim()) return;
    setIsAddingFilter(true);
    setFilterSuccessMsg('');
    try {
      const cleanLabel = newFilterName.trim();
      const cleanValue = cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newFilterId = `${newFilterPillarId}:${cleanValue}`;
      
      const newOption = {
        id: newFilterId,
        label: cleanLabel,
        value: cleanValue,
        subGroup: 'Custom Added',
      };

      // Add to pillars
      setPillars((prev) =>
        prev.map((p) => {
          if (p.id === newFilterPillarId) {
            if (p.options.some((o) => o.id === newFilterId || o.value === cleanValue)) return p;
            return { ...p, options: [...p.options, newOption] };
          }
          return p;
        })
      );

      // Automatically assign new filter to this specimen
      if (!productData.assignedFilters.includes(newFilterId)) {
        handleFieldChange('assignedFilters', [...productData.assignedFilters, newFilterId]);
      }

      // Persist to store_filters in Supabase & local storage
      const currentStoreFilters = await getSupabaseStoreFilters();
      let updatedStoreFilters = [...currentStoreFilters];
      const targetCategory = updatedStoreFilters.find((c) => c.id === newFilterPillarId || c.slug === newFilterPillarId);
      if (targetCategory) {
        updatedStoreFilters = updatedStoreFilters.map((c) => {
          if (c.id === targetCategory.id) {
            const exists = (c.options || []).some((o) => o.id === newFilterId || o.value === cleanValue);
            return exists ? c : { ...c, options: [...(c.options || []), { id: newFilterId, label: cleanLabel, value: cleanValue, count: 1, isActive: true }] };
          }
          return c;
        });
      } else {
        const pillarInfo = pillars.find((p) => p.id === newFilterPillarId);
        updatedStoreFilters.push({
          id: newFilterPillarId,
          name: pillarInfo?.name || newFilterPillarId.toUpperCase(),
          slug: newFilterPillarId,
          type: 'sidebar',
          options: [{ id: newFilterId, label: cleanLabel, value: cleanValue, count: 1, isActive: true }],
        });
      }
      await saveSupabaseStoreFilters(updatedStoreFilters);

      setFilterSuccessMsg(`✨ Added "${cleanLabel}" & checked for this specimen!`);
      setNewFilterName('');
      setTimeout(() => setFilterSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Error adding filter:', err);
    } finally {
      setIsAddingFilter(false);
    }
  };

  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');

  // Hydrate on mount/change of initialProduct
  useEffect(() => {
    if (initialProduct) {
      const initialAssigned = Array.isArray(initialProduct.assignedFilters) && initialProduct.assignedFilters.length > 0
        ? initialProduct.assignedFilters
        : (Array.isArray(initialProduct.assigned_filters) && initialProduct.assigned_filters.length > 0
            ? initialProduct.assigned_filters
            : (Array.isArray(initialProduct.tags) ? initialProduct.tags : []));

      setProductData({
        id: initialProduct.id,
        slug: initialProduct.slug,
        name: initialProduct.name || initialProduct.title || '',
        subtitle: initialProduct.subtitle || initialProduct.short_description || initialProduct.shortDescription || '',
        category: initialProduct.category || 'Energy Bands',
        collection: initialProduct.collection || 'Masterworks Collection',
        crystalType: initialProduct.crystalType || initialProduct.crystal_type || 'Pyrite',
        zodiac: initialProduct.zodiac || 'Leo, Sagittarius, Aries',
        chakra: initialProduct.chakra || 'Solar Plexus & Sacral',
        element: initialProduct.element || 'Earth & Fire',
        shortDescription: initialProduct.shortDescription || initialProduct.short_description || '',
        description: initialProduct.description || '',
        healingBenefits: initialProduct.healingBenefits || initialProduct.healing_benefits || '',
        careInstructions: initialProduct.careInstructions || initialProduct.care_instructions || '',
        authenticityNote: initialProduct.authenticityNote || initialProduct.authenticity_info || 'Authentic Natural Crystal & Consecrated by Founder Soumyaa Naveen.',
        price: Number(initialProduct.price || initialProduct.selling_price || 699),
        originalPrice: Number(initialProduct.originalPrice || initialProduct.original_price || 1299),
        costPrice: Number(initialProduct.costPrice || initialProduct.cost_price || 350),
        energizedPrice: Number(initialProduct.energizedPrice || 100),
        stockCount: initialProduct.stockCount !== undefined ? Number(initialProduct.stockCount) : 20,
        lowStockThreshold: Number(initialProduct.lowStockThreshold || 5),
        sku: initialProduct.sku || `SKU-CRYS-${Math.floor(1000 + Math.random() * 9000)}`,
        isActive: initialProduct.isActive !== undefined ? Boolean(initialProduct.isActive) : (initialProduct.active !== undefined ? Boolean(initialProduct.active) : true),
        isNewArrival: Boolean(initialProduct.isNewArrival || initialProduct.new_arrival),
        isBestSeller: Boolean(initialProduct.isBestSeller || initialProduct.bestseller),
        isLimitedEdition: Boolean(initialProduct.isLimitedEdition || initialProduct.limited_edition),
        isPremiumCollection: Boolean(initialProduct.isPremiumCollection || initialProduct.premium_collection),
        isFeatured: Boolean(initialProduct.isFeatured || initialProduct.featured),
        isOnSale: Boolean(initialProduct.isOnSale || initialProduct.discount_percentage > 0),
        seoTitle: initialProduct.seoTitle || initialProduct.name || '',
        seoDescription: initialProduct.seoDescription || initialProduct.short_description || '',
        seoKeywords: initialProduct.seoKeywords || `${initialProduct.crystal_type || 'Crystal'}, Healing, Meditation`,
        images: Array.isArray(initialProduct.images) && initialProduct.images.length > 0
          ? initialProduct.images
          : (initialProduct.image || initialProduct.hero_image ? [initialProduct.image || initialProduct.hero_image] : []),
        variants: initialProduct.variants || initialProduct.product_variants || [],
        customAttributes: initialProduct.customAttributes || [],
        assignedFilters: initialAssigned,
      });
      setIsDirty(false);
    }
  }, [initialProduct]);

  // Compute discount percentage
  const discountPercent =
    productData.originalPrice > productData.price
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
      : 0;

  // Field change handler
  const handleFieldChange = (field, value) => {
    setProductData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && (!prev.sku || prev.sku.startsWith('SKU-CRYS-'))) {
        const slugPart = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'CRYS';
        updated.sku = `SKU-${slugPart}-${Math.floor(100 + Math.random() * 900)}`;
      }
      return updated;
    });
    setIsDirty(true);
    setValidationError('');
  };

  // Rich text markdown helper
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('rich-description-input');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    handleFieldChange('description', newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  // Validation
  const validateForm = () => {
    if (!productData.name.trim()) {
      setValidationError('Crystal Specimen Name is mandatory.');
      setActiveTab('general');
      return false;
    }

    if (!productData.images || productData.images.length === 0) {
      setValidationError('At least one high-resolution photograph is required.');
      setActiveTab('media');
      return false;
    }

    if (!productData.price || parseFloat(productData.price) <= 0) {
      setValidationError('Selling price must be greater than ₹0.');
      setActiveTab('pricing');
      return false;
    }

    if (parseInt(productData.stockCount, 10) < 0) {
      setValidationError('Total stock count cannot be negative.');
      setActiveTab('inventory');
      return false;
    }

    // Check SKU duplicate (excluding self if editing)
    if (productData.sku) {
      const isDuplicate = existingProducts.some(
        (p) =>
          p.sku &&
          p.sku.toLowerCase() === productData.sku.toLowerCase() &&
          p.id !== (initialProduct?.id || null)
      );
      if (isDuplicate) {
        setValidationError(`SKU "${productData.sku}" is already in use by another specimen. Please assign a unique SKU.`);
        setActiveTab('inventory');
        return false;
      }
    }

    return true;
  };

  // Save handler (persists to Supabase and syncs with backend)
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setValidationError('');

    try {
      const slug =
        productData.slug ||
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const isEditing = !!(initialProduct?.id || initialProduct?.slug);
      const targetId = initialProduct?.id || initialProduct?.slug;

      const productPayload = {
        ...productData,
        id: initialProduct?.id || undefined,
        slug,
        title: productData.name,
        name: productData.name,
        price: parseFloat(productData.price),
        selling_price: parseFloat(productData.price),
        originalPrice: parseFloat(productData.originalPrice || productData.price),
        original_price: parseFloat(productData.originalPrice || productData.price),
        stockCount: parseInt(productData.stockCount, 10) || 0,
        totalStock: parseInt(productData.stockCount, 10) || 0,
        images: productData.images,
        image: productData.images[0],
        variants: productData.variants || [],
        assigned_filters: productData.assignedFilters || [],
        assignedFilters: productData.assignedFilters || [],
        tags: productData.assignedFilters || [],
        featured: Boolean(productData.isFeatured),
        bestseller: Boolean(productData.isBestSeller),
        new_arrival: Boolean(productData.isNewArrival),
        premium_collection: Boolean(productData.isPremiumCollection),
        limited_edition: Boolean(productData.isLimitedEdition),
        active: Boolean(productData.isActive),
        updated_at: new Date().toISOString(),
      };

      // 1. Save directly to Supabase & Local Sanctuary Vault
      let savedProduct = productPayload;
      try {
        const supabaseResult = await saveProductToSupabase(productPayload);
        if (supabaseResult?.product) {
          savedProduct = supabaseResult.product;
        }
      } catch (supaErr) {
        console.warn('Supabase save notice:', supaErr.message);
      }

      // 2. Also sync to backend API if available
      if (API_BASE) {
        try {
          const endpoint = isEditing
            ? `${API_BASE}/api/admin/products/${targetId}`
            : `${API_BASE}/api/admin/products`;
          const method = isEditing ? 'PUT' : 'POST';
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          await fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify(productPayload),
          }).catch(() => {});
        } catch (e) {}
      }

      setIsDirty(false);
      if (onSaveSuccess) {
        onSaveSuccess(savedProduct || productPayload);
      }
      onClose();
    } catch (err) {
      console.error('Error saving crystal product:', err);
      // Fallback: gracefully save locally and close
      if (onSaveSuccess) onSaveSuccess(productPayload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes in this crystal specimen. Discard changes?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const tabs = [
    { id: 'general', label: '1. General Info & Lore', icon: FileText },
    { id: 'media', label: `2. Media (${productData.images.length})`, icon: ImageIcon },
    { id: 'pricing', label: '3. Pricing & Margins', icon: DollarSign },
    { id: 'inventory', label: '4. Inventory & SKU', icon: Tag },
    { id: 'variants', label: `5. Variants (${productData.variants.length})`, icon: Layers },
    { id: 'attributes', label: '6. Custom Attributes', icon: SlidersHorizontal },
    { id: 'filters', label: '7. Dynamic Filters', icon: Sparkles },
    { id: 'features', label: '8. Features & Badges', icon: Star },
    { id: 'seo', label: '9. SEO & Metadata', icon: Globe },
    { id: 'preview', label: '10. Live Simulator', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#141210] border border-[#D4AF37]/35 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Workspace Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-950 via-[#161310] to-stone-950 border-b border-[#D4AF37]/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#F3E5AB] flex items-center gap-2 truncate">
                {initialProduct ? `Edit Specimen: ${productData.name || 'Masterwork'}` : 'Create Luxury Crystal Specimen'}
              </h2>
              <p className="text-[11px] text-stone-400 truncate">
                Comprehensive 10-Tab Product Workspace • Real-time DB Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#D4AF37] hover:text-[#f7e7ce] text-xs font-semibold flex items-center gap-1.5 border border-[#D4AF37]/25 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Simulator</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 10-Tab Navigation Bar */}
        <div className="flex border-b border-stone-800 bg-stone-950/80 px-4 sm:px-6 gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-stone-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#D4AF37] text-[#F3E5AB] font-semibold bg-[#D4AF37]/10'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-stone-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error Notification Banner */}
        {validationError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
          {/* TAB 1: GENERAL INFO & LORE */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Crystal Specimen Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Natural Peruvian Pyrite Wealth Cluster"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Sanctum Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={productData.subtitle}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    placeholder="e.g. Peruvian Hydrothermal Matrix for Pure Abundance"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Category</label>
                  <select
                    value={productData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CRYSTAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Collection</label>
                  <select
                    value={productData.collection}
                    onChange={(e) => handleFieldChange('collection', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CRYSTAL_COLLECTIONS.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Crystal Family</label>
                  <select
                    value={productData.crystalType}
                    onChange={(e) => handleFieldChange('crystalType', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CRYSTAL_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metaphysical Alignments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-900/40 border border-stone-800/80">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4AF37]">Zodiac Compatibility</label>
                  <input
                    type="text"
                    value={productData.zodiac}
                    onChange={(e) => handleFieldChange('zodiac', e.target.value)}
                    placeholder="e.g. Leo, Sagittarius, Aries"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4AF37]">Chakra Resonance</label>
                  <input
                    type="text"
                    value={productData.chakra}
                    onChange={(e) => handleFieldChange('chakra', e.target.value)}
                    placeholder="e.g. Solar Plexus & Root"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4AF37]">Elemental Force</label>
                  <input
                    type="text"
                    value={productData.element}
                    onChange={(e) => handleFieldChange('element', e.target.value)}
                    placeholder="e.g. Earth & Fire"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Short Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Storefront Teaser Summary (1-2 sentences)
                </label>
                <input
                  type="text"
                  value={productData.shortDescription}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  placeholder="e.g. Peruvian Pyrite specimen radiating pure solar plexus manifestation frequencies."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Rich Markdown Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-300">
                    Detailed Story &amp; Lore (Rich Formatted)
                  </label>
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      title="Bold"
                      className="p-1 rounded hover:bg-stone-800 text-stone-300"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      title="Italic"
                      className="p-1 rounded hover:bg-stone-800 text-stone-300"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      title="Heading 2"
                      className="p-1 rounded hover:bg-stone-800 text-stone-300"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      title="Bullet List"
                      className="p-1 rounded hover:bg-stone-800 text-stone-300"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n| Spec | Detail |\n|---|---|\n| Origin | Peru |\n')}
                      title="Spec Table"
                      className="p-1 rounded hover:bg-stone-800 text-stone-300"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="rich-description-input"
                  rows={5}
                  value={productData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Enter detailed lore, origin details, and sound attunement specifications..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] font-mono leading-relaxed"
                />
              </div>

              {/* Vedic Benefits & Care Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    🌿 Healing &amp; Metaphysical Benefits
                  </label>
                  <textarea
                    rows={3}
                    value={productData.healingBenefits}
                    onChange={(e) => handleFieldChange('healingBenefits', e.target.value)}
                    placeholder="e.g. Amplifies financial intentions, provides energetic boundary shielding..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    🌙 Cleansing &amp; Care Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={productData.careInstructions}
                    onChange={(e) => handleFieldChange('careInstructions', e.target.value)}
                    placeholder="e.g. Sound bowl cleansing, full moonlight charging. Avoid harsh water..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & HIGH-RES PHOTOGRAPHY */}
          {activeTab === 'media' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <LuxuryImageUploader
                images={productData.images}
                onChange={(imgs) => handleFieldChange('images', imgs)}
                onError={(err) => setValidationError(err)}
                maxImages={12}
              />
            </div>
          )}

          {/* TAB 3: PRICING & MARGINS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-[#D4AF37]/20 space-y-4">
                <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Selling Price &amp; Discount Mechanics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Selling Price (₹) <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={productData.price}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-[#D4AF37] font-bold focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Original / Compare-At (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={productData.originalPrice}
                        onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-stone-400 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Vedic Energized Add-On (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={productData.energizedPrice}
                        onChange={(e) => handleFieldChange('energizedPrice', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-purple-300 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Computed Discount %
                    </label>
                    <div className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Discount:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & SKU */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#D4AF37]" /> Stock Quantities &amp; SKU Identifier
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Total Base Stock <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productData.stockCount}
                      onChange={(e) => handleFieldChange('stockCount', e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Low Stock Threshold Alert
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={productData.lowStockThreshold}
                      onChange={(e) => handleFieldChange('lowStockThreshold', e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Unique Specimen SKU
                    </label>
                    <input
                      type="text"
                      value={productData.sku}
                      onChange={(e) => handleFieldChange('sku', e.target.value)}
                      placeholder="SKU-PYR-8MM"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-300 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Visibility Status
                    </label>
                    <select
                      value={productData.isActive ? 'active' : 'draft'}
                      onChange={(e) => handleFieldChange('isActive', e.target.value === 'active')}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="active">🟢 Active &amp; Published to Storefront</option>
                      <option value="draft">🟡 Draft / Hidden in Vault</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VARIANTS MATRIX */}
          {activeTab === 'variants' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <LuxuryVariantBuilder
                variants={productData.variants}
                basePrice={productData.price}
                baseOriginalPrice={productData.originalPrice}
                baseSku={productData.sku}
                onChange={(updatedVariants) => handleFieldChange('variants', updatedVariants)}
                onTotalStockChange={(total) => handleFieldChange('stockCount', total)}
              />
            </div>
          )}

          {/* TAB 6: CUSTOM ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" /> Dynamic Attributes &amp; Options
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Attribute Name (e.g. Origin Cave)"
                    value={newAttrKey}
                    onChange={(e) => setNewAttrKey(e.target.value)}
                    className="bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Huaron Hydrothermal Mines)"
                    value={newAttrVal}
                    onChange={(e) => setNewAttrVal(e.target.value)}
                    className="bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAttrKey.trim() && newAttrVal.trim()) {
                        handleFieldChange('customAttributes', [
                          ...productData.customAttributes,
                          { id: Date.now(), name: newAttrKey.trim(), values: [newAttrVal.trim()] },
                        ]);
                        setNewAttrKey('');
                        setNewAttrVal('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-[#D4AF37]"
                  >
                    Add Attribute
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {productData.customAttributes.map((attr, idx) => (
                    <div
                      key={attr.id || idx}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-stone-200">{attr.name}: </span>
                        <span className="text-stone-400">{attr.values?.join(', ')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleFieldChange(
                            'customAttributes',
                            productData.customAttributes.filter((_, i) => i !== idx)
                          )
                        }
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 6-PILLAR DYNAMIC FILTERS & DISCOVERY TAXONOMY */}
          {activeTab === 'filters' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Discovery Header & Live Tag Preview Bar */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900/90 via-[#181512] to-stone-900/90 border border-[#D4AF37]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> 6-Pillar Multi-Discovery Taxonomy
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Customers discover this specimen through multiple independent pathways simultaneously.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFilterCard((prev) => !prev)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition shadow"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{showAddFilterCard ? 'Close' : '➕ Add Filter'}</span>
                    </button>
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono font-bold">
                      {productData.assignedFilters.length} Filters Assigned
                    </span>
                    {productData.assignedFilters.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange('assignedFilters', [])}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-[11px] font-medium transition"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Provision New Filter Bar */}
                {showAddFilterCard && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-[#D4AF37]/40 shadow-xl space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Add New Filter for Products
                      </h4>
                      <span className="text-[10px] text-stone-400">
                        Creates filter in store taxonomy and assigns it to this specimen
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-6">
                        <input
                          type="text"
                          placeholder="Filter Name (e.g. Stress Relief, Aura Shield, Selenite Tower)..."
                          value={newFilterName}
                          onChange={(e) => setNewFilterName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFilter();
                            }
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <select
                          value={newFilterPillarId}
                          onChange={(e) => setNewFilterPillarId(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                        >
                          {pillars.map((p) => (
                            <option key={p.id} value={p.id}>
                              Category: {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          disabled={!newFilterName.trim() || isAddingFilter}
                          onClick={handleAddFilter}
                          className="w-full h-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-xs font-bold hover:brightness-110 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          {isAddingFilter ? (
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>Save &amp; Check</span>
                        </button>
                      </div>
                    </div>
                    {filterSuccessMsg && (
                      <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{filterSuccessMsg}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Bar Across All 6 Pillars */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search any filter tag (e.g. Vastu, 8mm, Love, Zodiac, Solar Plexus, Geode)..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {filterSearch && (
                    <button
                      type="button"
                      onClick={() => setFilterSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Live Multi-Tag Preview on Product Card */}
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800/80 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-[#D4AF37]" /> Storefront Product Card Multi-Tag Display Preview:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#EAE3D5]">
                    <span className="font-semibold text-white">{productData.name || 'Pyrite Wealth Bracelet'} – {productData.variants?.[0]?.beadSize || '8mm'}</span>
                    <span className="text-stone-600">&bull;</span>
                    {formatProductMultiTags(productData, 6).length > 0 ? (
                      formatProductMultiTags(productData, 6).map((tag, idx, arr) => (
                        <React.Fragment key={tag}>
                          <span className="text-[#D4AF37] font-medium">{tag}</span>
                          {idx < arr.length - 1 && <span className="text-stone-600 font-bold">&middot;</span>}
                        </React.Fragment>
                      ))
                    ) : (
                      <span className="text-stone-500 italic text-[11px]">No tags assigned yet — select below</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 6 PILLAR ACCORDIONS & OPTION MATRICES */}
              <div className="space-y-4">
                {pillars.map((pillar) => {
                  const filteredOptions = filterSearch.trim()
                    ? pillar.options.filter(
                        (opt) =>
                          opt.label.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          opt.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          (opt.subGroup && opt.subGroup.toLowerCase().includes(filterSearch.toLowerCase()))
                      )
                    : pillar.options;

                  if (filteredOptions.length === 0) return null;

                  const isOpen = openPillarAccordions[pillar.id] !== false;
                  const selectedInPillar = pillar.options.filter((o) =>
                    productData.assignedFilters.includes(o.id)
                  );

                  return (
                    <div
                      key={pillar.id}
                      className="rounded-2xl bg-stone-900/60 border border-stone-800/80 overflow-hidden transition-all duration-200"
                    >
                      {/* Pillar Header */}
                      <div className="p-4 bg-stone-950/60 border-b border-stone-800/60 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenPillarAccordions((prev) => ({
                              ...prev,
                              [pillar.id]: !isOpen,
                            }))
                          }
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${pillar.badgeColor} border`}>
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold font-serif text-stone-200 uppercase tracking-wider">
                                {pillar.name}
                              </h4>
                              {selectedInPillar.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-[10px] font-mono font-bold">
                                  {selectedInPillar.length} selected
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-400 mt-0.5">{pillar.subtitle}</p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const pillarIds = pillar.options.map((o) => o.id);
                              const allSelected = pillarIds.every((id) =>
                                productData.assignedFilters.includes(id)
                              );
                              const next = allSelected
                                ? productData.assignedFilters.filter((id) => !pillarIds.includes(id))
                                : Array.from(new Set([...productData.assignedFilters, ...pillarIds]));
                              handleFieldChange('assignedFilters', next);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-semibold transition"
                          >
                            {pillar.options.every((o) => productData.assignedFilters.includes(o.id))
                              ? 'Clear Pillar'
                              : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {/* Options Grid */}
                      {isOpen && (
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                          {filteredOptions.map((opt) => {
                            const isSelected = productData.assignedFilters.includes(opt.id);
                            const isVastuOption = opt.id.includes('vastu');

                            return (
                              <label
                                key={opt.id}
                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none text-left relative group ${
                                  isSelected
                                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/30 text-[#F3E5AB]'
                                    : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...productData.assignedFilters, opt.id]
                                      : productData.assignedFilters.filter((f) => f !== opt.id);
                                    handleFieldChange('assignedFilters', next);
                                  }}
                                  className="mt-0.5 accent-[#D4AF37] rounded"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-medium leading-snug break-words">
                                    {opt.label}
                                  </div>
                                  {isVastuOption && (
                                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                      ⭐ Dual Discovery
                                    </span>
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
            </div>
          )}

          {/* TAB 8: FEATURES & BADGES */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#D4AF37]" /> Feature Badges &amp; Storefront Highlights
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'isNewArrival', label: '✨ New Arrival', desc: 'Displays green New tag on cards' },
                    { key: 'isBestSeller', label: '🔥 Best Seller', desc: 'Golden popular ribbon' },
                    { key: 'isLimitedEdition', label: '💎 Limited Edition', desc: 'Purple rarity indicator' },
                    { key: 'isPremiumCollection', label: '👑 Premium Masterwork', desc: 'Founders vault seal tag' },
                    { key: 'isFeatured', label: '⭐ Featured Showcase', desc: 'Hero carousel spotlight' },
                    { key: 'isOnSale', label: '🏷️ On Sale / Special Privilege', desc: 'Highlight discount tag' },
                  ].map((badge) => (
                    <label
                      key={badge.key}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                        productData[badge.key]
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                          : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!productData[badge.key]}
                        onChange={(e) => handleFieldChange(badge.key, e.target.checked)}
                        className="mt-0.5 accent-[#D4AF37]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-stone-200">{badge.label}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{badge.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SEO & METADATA */}
          {activeTab === 'seo' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#D4AF37]" /> Search Engine Optimization &amp; Social Snippet
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Meta Title Tag</label>
                    <input
                      type="text"
                      value={productData.seoTitle}
                      onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                      placeholder={`${productData.name || 'Crystal'} | Sumuk Crystalz 5`}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Meta Description</label>
                    <textarea
                      rows={2}
                      value={productData.seoDescription}
                      onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                      placeholder="Enter compelling meta description for Google search ranking..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      value={productData.seoKeywords}
                      onChange={(e) => handleFieldChange('seoKeywords', e.target.value)}
                      placeholder="pyrite, energy band, abundance crystal, reiki consecrated"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: LIVE CUSTOMER SIMULATOR */}
          {activeTab === 'preview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-6 rounded-2xl bg-stone-950 border border-[#D4AF37]/30 max-w-2xl mx-auto shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Live Customer Storefront Simulator
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    Real-Time Sync
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <div className="w-48 h-48 rounded-2xl bg-stone-900 overflow-hidden flex-shrink-0 border border-stone-800">
                    <img
                      src={productData.images[0] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80'}
                      alt={productData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="text-[10px] font-mono uppercase text-[#D4AF37]">
                      {productData.category} • {productData.collection}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-100">
                      {productData.name || 'Untitled Crystal Specimen'}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2">
                      {productData.shortDescription || productData.subtitle || 'Sacred luxury crystal specimen.'}
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-bold text-[#F3E5AB]">
                        ₹{productData.price.toLocaleString('en-IN')}
                      </span>
                      {productData.originalPrice > productData.price && (
                        <span className="text-xs text-stone-500 line-through">
                          ₹{productData.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-400">
                          ({discountPercent}% OFF)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Footer Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500 hidden sm:block">
            <span className="text-[#D4AF37] font-semibold">{productData.variants.length}</span> variants •{' '}
            <span className="text-emerald-400 font-semibold">{productData.images.length}</span> photos •{' '}
            <span className="text-purple-400 font-semibold">{productData.stockCount}</span> units in stock
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Synchronizing Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save &amp; Synchronize Specimen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
