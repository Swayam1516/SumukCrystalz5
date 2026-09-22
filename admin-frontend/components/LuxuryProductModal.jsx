'use client';

import React, { useState, useEffect } from 'react';
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
  Link as LinkIcon,
  Table as TableIcon,
  Quote,
  Flame,
  Star,
  Zap,
  Info
} from 'lucide-react';
import LuxuryImageUploader from './LuxuryImageUploader';
import LuxuryVariantBuilder from './LuxuryVariantBuilder';
import ProductPreviewModal from './ProductPreviewModal';
import { supabase, saveProductToSupabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuth';

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
  'Solfeggio 528Hz Attuned',
  'Vedic Heritage Talismans',
  'Founders Private Vault',
];

const CRYSTAL_TYPES = [
  'Pyrite',
  'Amethyst',
  'Clear Quartz',
  'Tiger\'s Eye',
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

export default function LuxuryProductModal({
  isOpen,
  onClose,
  initialProduct = null,
  onSaveSuccess,
  existingProducts = [],
}) {
  if (!isOpen) return null;

  const { token } = useAuthStore();

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'pricing' | 'variants' | 'images' | 'story'

  // Form State
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
    spiritualProperties: '',
    careInstructions: '',
    authenticityNote: '100% Earth-mined authentic natural crystal specimen, cleansed and consecrated with Vedic mantras by Founder Soumyaa Naveen.',
    price: 699,
    originalPrice: 1299,
    energizedPrice: 100,
    stockCount: 20,
    sku: `SKU-CRYS-${Math.floor(1000 + Math.random() * 9000)}`,
    isActive: true,
    isNewArrival: false,
    isBestSeller: false,
    isLimitedEdition: false,
    isPremiumCollection: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [],
  });

  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Initialize or hydrate with existing product if editing
  useEffect(() => {
    if (initialProduct) {
      setProductData({
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
        spiritualProperties: initialProduct.spiritualProperties || initialProduct.spiritual_properties || '',
        careInstructions: initialProduct.careInstructions || initialProduct.care_instructions || '',
        authenticityNote: initialProduct.authenticityNote || initialProduct.authenticity_info || '100% Earth-mined authentic natural crystal specimen, cleansed and consecrated with Vedic mantras by Founder Soumyaa Naveen.',
        price: Number(initialProduct.price || initialProduct.selling_price || 699),
        originalPrice: Number(initialProduct.originalPrice || initialProduct.original_price || 1299),
        energizedPrice: Number(initialProduct.energizedPrice || 100),
        stockCount: initialProduct.stockCount !== undefined ? Number(initialProduct.stockCount) : 20,
        sku: initialProduct.sku || `SKU-CRYS-${Math.floor(1000 + Math.random() * 9000)}`,
        isActive: initialProduct.isActive !== undefined ? Boolean(initialProduct.isActive) : (initialProduct.active !== undefined ? Boolean(initialProduct.active) : true),
        isNewArrival: Boolean(initialProduct.isNewArrival || initialProduct.new_arrival),
        isBestSeller: Boolean(initialProduct.isBestSeller || initialProduct.bestseller),
        isLimitedEdition: Boolean(initialProduct.isLimitedEdition || initialProduct.limited_edition),
        isPremiumCollection: Boolean(initialProduct.isPremiumCollection || initialProduct.premium_collection),
        isFeatured: Boolean(initialProduct.isFeatured || initialProduct.featured),
        images: Array.isArray(initialProduct.images) && initialProduct.images.length > 0
          ? initialProduct.images
          : (initialProduct.image || initialProduct.hero_image ? [initialProduct.image || initialProduct.hero_image] : []),
        variants: initialProduct.variants || initialProduct.product_variants || [],
      });
    }
  }, [initialProduct]);

  // Compute discount percentage
  const discountPercent =
    productData.originalPrice > productData.price
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
      : 0;

  // Form Field Change Handler
  const handleFieldChange = (field, value) => {
    setProductData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate SKU when name changes if default
      if (field === 'name' && (!prev.sku || prev.sku.startsWith('SKU-CRYS-'))) {
        const slugPart = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'CRYS';
        updated.sku = `SKU-${slugPart}-${Math.floor(100 + Math.random() * 900)}`;
      }
      return updated;
    });
    setValidationError('');
  };

  // Rich Text Editor Helpers
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
      setValidationError('Crystal Name is mandatory.');
      setActiveTab('basic');
      return false;
    }

    if (!productData.images || productData.images.length === 0) {
      setValidationError('At least one crystal image is required.');
      setActiveTab('images');
      return false;
    }

    if (!productData.price || parseFloat(productData.price) <= 0) {
      setValidationError('Selling price must be greater than ₹0.');
      setActiveTab('pricing');
      return false;
    }

    if (parseInt(productData.stockCount, 10) < 0) {
      setValidationError('Total stock count cannot be negative.');
      setActiveTab('pricing');
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
        setValidationError(`SKU "${productData.sku}" is already in use by another crystal. Please use a unique SKU.`);
        setActiveTab('pricing');
        return false;
      }
    }

    return true;
  };

  // Save Crystal Handler via Backend REST API (Permanent DB Storage)
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
        originalPrice: parseFloat(productData.originalPrice || productData.price),
        stockCount: parseInt(productData.stockCount, 10) || 0,
        totalStock: parseInt(productData.stockCount, 10) || 0,
        images: productData.images,
        image: productData.images[0],
        variants: productData.variants || [],
        updated_at: new Date().toISOString(),
      };

      let savedProduct = null;

      // 1. Direct and guaranteed Supabase PostgreSQL persistence
      const supabaseResult = await saveProductToSupabase(productPayload);
      if (!supabaseResult.success) {
        throw new Error(supabaseResult.error || 'Failed to save product to Supabase.');
      }
      savedProduct = supabaseResult.product;

      // 2. Also sync to Backend REST API if online and configured
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

      const finalSaved = savedProduct || productPayload;

      onSaveSuccess(finalSaved);
      onClose();
    } catch (err) {
      console.error('Error saving crystal product:', err);
      setValidationError(err.message || 'Failed to save crystal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl bg-[#141210] border border-[#D4AF37]/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
                  {initialProduct ? 'Edit Crystal Masterwork' : 'Create Luxury Crystal Specimen'}
                </h2>
                <p className="text-xs text-stone-400">
                  Configure high-resolution photography, Flipkart-style variants, pricing & Vedic storytelling.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLivePreview(true)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-[#D4AF37] hover:text-[#f7e7ce] text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#D4AF37]/20"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Simulator</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-stone-800/60 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 gap-1 overflow-x-auto">
            {[
              { id: 'basic', label: '1. Basic Details & Story', icon: FileText },
              { id: 'pricing', label: '2. Pricing & Badges', icon: DollarSign },
              { id: 'variants', label: `3. Variants (${productData.variants.length})`, icon: Layers },
              { id: 'images', label: `4. Photography (${productData.images.length})`, icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-[#D4AF37] text-[#D4AF37] font-semibold bg-[#D4AF37]/5'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {validationError && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1">
            {/* TAB 1: BASIC DETAILS & STORY */}
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Name & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Crystal Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      value={productData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Natural Peruvian Pyrite Energy Band"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Subtitle / Sanctum Tagline
                    </label>
                    <input
                      type="text"
                      value={productData.subtitle}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      placeholder="e.g. Pure Golden Abundance & Magnetic Shielding"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Category, Collection & Crystal Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Category</label>
                    <select
                      value={productData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {CRYSTAL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
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
                        <option key={col} value={col}>
                          {col}
                        </option>
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
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Metaphysical Alignments: Zodiac, Chakra, Element */}
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
                      placeholder="e.g. Solar Plexus & Sacral"
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

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Short Storefront Summary
                  </label>
                  <input
                    type="text"
                    value={productData.shortDescription}
                    onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                    placeholder="Brief 1-2 sentence teaser for catalog and cards"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Rich Formatted Detailed Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-300">
                      Detailed Story & Lore (Rich Formatted)
                    </label>
                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        title="Bold"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        title="Italic"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ')}
                        title="Heading 2"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ')}
                        title="Heading 3"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <Heading3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ')}
                        title="Bullet List"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('1. ')}
                        title="Numbered List"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n| Spec | Value |\n|---|---|\n| Origin | Peru |\n')}
                        title="Table"
                        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                      >
                        <TableIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="rich-description-input"
                    rows={4}
                    value={productData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Enter formatted detailed description with Markdown headings, lists, tables or storytelling lore..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] font-mono leading-relaxed"
                  />
                </div>

                {/* Accordion Lore Fields: Healing Benefits, Spiritual Properties, Care Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      🌿 Healing & Metaphysical Benefits
                    </label>
                    <textarea
                      rows={3}
                      value={productData.healingBenefits}
                      onChange={(e) => handleFieldChange('healingBenefits', e.target.value)}
                      placeholder="e.g. Attracts prosperity, balances solar plexus chakra, protects from EMF radiation..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      🌙 Cleansing & Care Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={productData.careInstructions}
                      onChange={(e) => handleFieldChange('careInstructions', e.target.value)}
                      placeholder="e.g. Moonlight charging on full moon, sage smudging. Avoid prolonged water exposure..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRICING, INVENTORY & SPECIAL BADGES */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Pricing Block */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-[#D4AF37]/20 space-y-4">
                  <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Pricing Structure & Discount
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        Original / Compare At Price (₹)
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
                        Computed Discount
                      </label>
                      <div className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs flex items-center justify-between">
                        <span className="text-stone-400 font-medium">Automatic %:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory & SKU Block */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#D4AF37]" /> Inventory, SKU & Publication Status
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-300">
                        Total Base Stock Count <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={productData.stockCount}
                        onChange={(e) => handleFieldChange('stockCount', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-300">
                        Product SKU / Identifier
                      </label>
                      <input
                        type="text"
                        value={productData.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value)}
                        placeholder="SKU-CRYS-101"
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
                        <option value="active">🟢 Active & Published to Storefront</option>
                        <option value="draft">🟡 Draft / Hidden in Vault</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Labels / Badges Checkboxes */}
                <div className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
                  <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#D4AF37]" /> Special Storefront Badges & Labels
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { key: 'isNewArrival', label: '✨ New Arrival', desc: 'Displays green New tag' },
                      { key: 'isBestSeller', label: '🔥 Best Seller', desc: 'Golden popular badge' },
                      { key: 'isLimitedEdition', label: '💎 Limited Edition', desc: 'Purple rarity indicator' },
                      { key: 'isPremiumCollection', label: '👑 Premium Masterwork', desc: 'Founders seal tag' },
                      { key: 'isFeatured', label: '⭐ Featured Showcase', desc: 'Hero carousel spotlight' },
                    ].map((badge) => (
                      <label
                        key={badge.key}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                          productData[badge.key]
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!productData[badge.key]}
                          onChange={(e) => handleFieldChange(badge.key, e.target.checked)}
                          className="mt-0.5 accent-[#D4AF37] rounded"
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

            {/* TAB 3: LUXURY VARIANTS MATRIX */}
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

            {/* TAB 4: HIGH-RES CRYSTAL PHOTOGRAPHY */}
            {activeTab === 'images' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <LuxuryImageUploader
                  images={productData.images}
                  onChange={(imgs) => handleFieldChange('images', imgs)}
                  onError={(err) => setValidationError(err)}
                  maxImages={10}
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-500">
              <span className="text-[#D4AF37] font-semibold">{productData.variants.length}</span> variants •{' '}
              <span className="text-emerald-400 font-semibold">{productData.images.length}</span> photos
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Synchronizing Sanctuary...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save & Synchronize Crystal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Storefront Simulator Modal */}
      {showLivePreview && (
        <ProductPreviewModal
          product={productData}
          onClose={() => setShowLivePreview(false)}
        />
      )}
    </>
  );
}
