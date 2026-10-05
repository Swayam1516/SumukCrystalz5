'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCw,
  Gift,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { formatProductMultiTags } from '../lib/discoveryTaxonomy';

export default function ProductPreviewModal({ product, onClose }) {
  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('healing'); // 'healing' | 'spiritual' | 'chakra' | 'care' | 'auth'

  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          name: 'Standard Edition',
          sizeOrWeight: '8mm Regular',
          price: product.price || 699,
          originalPrice: product.originalPrice || 1299,
          stock: product.stockCount || 15,
          isAvailable: true,
        },
      ];

  const currentVariant = variants[selectedVariantIndex] || variants[0];
  const currentPrice = currentVariant.price || product.price || 699;
  const currentOriginalPrice = currentVariant.originalPrice || product.originalPrice || 1299;
  const currentStock = currentVariant.stock !== undefined ? currentVariant.stock : (product.stockCount || 15);
  const discountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  // Stock status text & luxury badge
  const getStockStatus = () => {
    if (currentStock <= 0) {
      return { text: 'Out of Stock', color: 'text-rose-400 bg-rose-950/40 border-rose-800/50' };
    }
    if (currentStock <= 3) {
      return { text: `Only ${currentStock} Left in Sanctuary Vault`, color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' };
    }
    if (product.isLimitedEdition) {
      return { text: 'Limited Edition Specimen', color: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30' };
    }
    return { text: 'In Stock • Ready for Consecration', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' };
  };

  const stockBadge = getStockStatus();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#141210] border border-[#D4AF37]/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Preview Banner Header */}
        <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Customer Storefront Live Simulator
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">
              (Interactive customer-facing experience with live variant calculation)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800/60 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Main Product Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Gallery Experience */}
            <div className="space-y-4">
              {/* Hero Image with Zoom Hover */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out cursor-crosshair"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isNewArrival && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow">
                      New Arrival
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="px-2.5 py-1 rounded-md bg-[#B8860B] text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Best Seller
                    </span>
                  )}
                  {product.isLimitedEdition && (
                    <span className="px-2.5 py-1 rounded-md bg-purple-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow">
                      Limited Edition
                    </span>
                  )}
                </div>

                {/* Wishlist Icon Preview */}
                <button
                  type="button"
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-stone-300 hover:text-rose-400 border border-white/10 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-105'
                          : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details, Variants & Actions */}
            <div className="space-y-6">
              {/* Category & Title */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                  <span>{product.category || 'Luxury Crystal'}</span>
                  {product.collection && (
                    <>
                      <span>•</span>
                      <span>{product.collection}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-stone-100 tracking-tight">
                  {product.name || 'Untitled Crystal Specimen'}
                </h1>
                {product.subtitle && (
                  <p className="text-sm text-stone-400 mt-1 font-light italic">
                    {product.subtitle}
                  </p>
                )}

                {/* 6-Pillar Multi-Discovery Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-[#F3E5AB]">
                  {formatProductMultiTags(product, 6).map((tag, tIdx, tArr) => (
                    <React.Fragment key={tag}>
                      <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono font-medium">
                        {tag}
                      </span>
                      {tIdx < tArr.length - 1 && (
                        <span className="text-stone-600 font-bold">&middot;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Live Price Calculation Bar */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-bold text-[#E5D5BA]">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </span>
                    {currentOriginalPrice > currentPrice && (
                      <span className="text-sm text-stone-500 line-through">
                        ₹{currentOriginalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Inclusive of all taxes • Free Vedic energization
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${stockBadge.color}`}>
                    {stockBadge.text}
                  </span>
                </div>
              </div>

              {/* Variant Selector (Flipkart-Style) */}
              {variants.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium">
                      Select Variant / Size:{' '}
                      <strong className="text-[#D4AF37]">{currentVariant.name}</strong>
                    </span>
                    {currentVariant.sizeOrWeight && (
                      <span className="text-stone-400 font-mono text-[11px]">
                        Specification: {currentVariant.sizeOrWeight}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {variants.map((variant, vIdx) => {
                      const isSelected = selectedVariantIndex === vIdx;
                      return (
                        <button
                          key={variant.id || vIdx}
                          type="button"
                          disabled={!variant.isAvailable || variant.stock <= 0}
                          onClick={() => setSelectedVariantIndex(vIdx)}
                          className={`p-3 rounded-xl border text-left transition-all duration-200 relative ${
                            isSelected
                              ? 'bg-stone-900 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/10'
                              : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
                          } ${!variant.isAvailable || variant.stock <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-xs font-semibold text-stone-200 truncate">
                            {variant.name}
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="text-[#D4AF37] font-medium">
                              ₹{(variant.price || currentPrice).toLocaleString('en-IN')}
                            </span>
                            {variant.stock <= 3 && variant.stock > 0 && (
                              <span className="text-amber-400 text-[9px] font-bold">
                                {variant.stock} left
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[9px]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-xs text-stone-300 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Quantity & Add to Cart Button (Simulation) */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-stone-800 rounded-xl bg-stone-950 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-mono font-bold text-stone-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Sacred Cart
                </button>
              </div>

              {/* Metaphysical Quick Badges */}
              {(product.chakra || product.zodiac || product.crystalType) && (
                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex flex-wrap gap-4 text-xs">
                  {product.crystalType && (
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Crystal Family</span>
                      <span className="text-stone-200 font-medium">{product.crystalType}</span>
                    </div>
                  )}
                  {product.chakra && (
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Chakra Resonance</span>
                      <span className="text-[#D4AF37] font-medium">{product.chakra}</span>
                    </div>
                  )}
                  {product.zodiac && (
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Zodiac Affinity</span>
                      <span className="text-stone-200 font-medium">{product.zodiac}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Luxury Product Information Cards (Glassmorphism Trust Badges) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-4 border-t border-stone-800">
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <Award className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">100% Natural</div>
              <div className="text-[9px] text-stone-400">Earth-mined authentic</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <Zap className="w-5 h-5 text-amber-400 mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">Energy Cleansed</div>
              <div className="text-[9px] text-stone-400">528Hz sound attuned</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <Gift className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">Sacred Packaging</div>
              <div className="text-[9px] text-stone-400">Velvet luxury box</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <Truck className="w-5 h-5 text-emerald-400 mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">Secure Delivery</div>
              <div className="text-[9px] text-stone-400">Insured express transit</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <RotateCw className="w-5 h-5 text-sky-400 mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">Easy Returns</div>
              <div className="text-[9px] text-stone-400">7-day return guarantee</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/60 border border-[#D4AF37]/20 text-center space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <div className="text-[11px] font-semibold text-stone-200">Gift Ready</div>
              <div className="text-[9px] text-stone-400">Includes Vedic card</div>
            </div>
          </div>

          {/* Storytelling Accordion Sections */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-serif font-semibold text-[#E5D5BA] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Sacred Crystal Lore & Story
            </h3>

            {/* Healing Benefits Accordion */}
            <div className="rounded-xl border border-stone-800 bg-stone-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'healing' ? '' : 'healing')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-stone-200 hover:text-[#D4AF37] transition-colors"
              >
                <span>🌿 Healing & Metaphysical Benefits</span>
                {openAccordion === 'healing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'healing' && (
                <div className="p-4 pt-0 text-xs text-stone-300 border-t border-stone-800/60 leading-relaxed space-y-2">
                  <p>{product.healingBenefits || product.description || 'Harnesses high-vibrational terrestrial frequencies to dispel stagnant energies, activate vitality, and invite abundance into your personal energetic field.'}</p>
                </div>
              )}
            </div>

            {/* Spiritual Properties Accordion */}
            <div className="rounded-xl border border-stone-800 bg-stone-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'spiritual' ? '' : 'spiritual')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-stone-200 hover:text-[#D4AF37] transition-colors"
              >
                <span>✨ Spiritual Properties & Resonance</span>
                {openAccordion === 'spiritual' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'spiritual' && (
                <div className="p-4 pt-0 text-xs text-stone-300 border-t border-stone-800/60 leading-relaxed">
                  <p>{product.spiritualProperties || 'Acts as an energetic amplifier during meditation and sacred ritual. Purified according to traditional Vedic protocols by Founder Soumyaa Naveen.'}</p>
                </div>
              )}
            </div>

            {/* Care & Cleansing Accordion */}
            <div className="rounded-xl border border-stone-800 bg-stone-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-stone-200 hover:text-[#D4AF37] transition-colors"
              >
                <span>🌙 Cleansing & Care Rituals</span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'care' && (
                <div className="p-4 pt-0 text-xs text-stone-300 border-t border-stone-800/60 leading-relaxed space-y-1.5">
                  <p>{product.careInstructions || 'Cleanse under gentle moonlight or with sage / palo santo smoke every full moon. Avoid abrasive chemicals or prolonged direct exposure to high heat to maintain crystal luster.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
