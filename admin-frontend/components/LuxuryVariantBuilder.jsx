'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Sparkles,
  Layers,
  DollarSign,
  Package,
  Tag,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';

// Preset variant matrices for luxury crystals
const VARIANT_PRESETS = [
  {
    name: 'Bead Sizes (6mm, 8mm, 10mm, 12mm)',
    category: 'Bracelet / Mala',
    variants: [
      { name: '6mm Delicate Beads', sizeOrWeight: '6mm', price: 499, originalPrice: 999, stock: 20, skuSuffix: '6MM', isAvailable: true },
      { name: '8mm Classic Regular', sizeOrWeight: '8mm', price: 699, originalPrice: 1299, stock: 18, skuSuffix: '8MM', isAvailable: true },
      { name: '10mm Masterwork Heavier', sizeOrWeight: '10mm', price: 999, originalPrice: 1699, stock: 12, skuSuffix: '10MM', isAvailable: true },
      { name: '12mm High-Resonance Statement', sizeOrWeight: '12mm', price: 1499, originalPrice: 2499, stock: 8, skuSuffix: '12MM', isAvailable: true },
    ],
  },
  {
    name: 'Tumble Stones Weight (50g, 100g, 250g, 500g)',
    category: 'Tumbles / Raw Specimen',
    variants: [
      { name: '50g Pocket Energy Pack', sizeOrWeight: '50g', price: 249, originalPrice: 499, stock: 35, skuSuffix: '50G', isAvailable: true },
      { name: '100g Altar Sanctuary Bundle', sizeOrWeight: '100g', price: 449, originalPrice: 799, stock: 25, skuSuffix: '100G', isAvailable: true },
      { name: '250g Meditation Grid Master', sizeOrWeight: '250g', price: 899, originalPrice: 1499, stock: 15, skuSuffix: '250G', isAvailable: true },
      { name: '500g Temple Sacred Collector', sizeOrWeight: '500g', price: 1599, originalPrice: 2699, stock: 10, skuSuffix: '500G', isAvailable: true },
    ],
  },
  {
    name: 'Bracelet Wrist Sizes (Small, Medium, Large)',
    category: 'Custom Wrist Fit',
    variants: [
      { name: 'Small (6.5 inches - Petite Wrist)', sizeOrWeight: '6.5"', price: 699, originalPrice: 1299, stock: 15, skuSuffix: 'S', isAvailable: true },
      { name: 'Medium (7.0 inches - Universal Fit)', sizeOrWeight: '7.0"', price: 699, originalPrice: 1299, stock: 30, skuSuffix: 'M', isAvailable: true },
      { name: 'Large (7.5 inches - Comfort Fit)', sizeOrWeight: '7.5"', price: 799, originalPrice: 1399, stock: 12, skuSuffix: 'L', isAvailable: true },
      { name: 'Extra Large (8.0 inches - Statement)', sizeOrWeight: '8.0"', price: 899, originalPrice: 1599, stock: 8, skuSuffix: 'XL', isAvailable: true },
    ],
  },
  {
    name: 'Vedic Consecration & Energization Tiers',
    category: 'Spiritual Attunement',
    variants: [
      { name: 'Raw Natural Crystal (Standard Energy)', sizeOrWeight: 'Natural', price: 699, originalPrice: 1199, stock: 50, skuSuffix: 'RAW', isAvailable: true },
      { name: 'Vedic Consecrated by Soumyaa Naveen', sizeOrWeight: 'Vedic Consecrated', price: 1049, originalPrice: 1799, stock: 30, skuSuffix: 'VEDIC', isAvailable: true },
      { name: '528Hz Solfeggio Sound-Attuned + Sacred Yantra', sizeOrWeight: '528Hz Attuned', price: 1299, originalPrice: 2199, stock: 20, skuSuffix: '528HZ', isAvailable: true },
    ],
  },
];

export default function LuxuryVariantBuilder({
  variants = [],
  basePrice = 699,
  baseOriginalPrice = 1299,
  baseSku = 'SKU-CRYS-01',
  onChange,
  onTotalStockChange,
}) {
  const [activePresetIndex, setActivePresetIndex] = useState(null);

  // Apply a quick preset
  const handleApplyPreset = (preset) => {
    const generated = preset.variants.map((v, index) => ({
      id: `var_${Date.now()}_${index}`,
      name: v.name,
      sizeOrWeight: v.sizeOrWeight,
      price: v.price || basePrice,
      originalPrice: v.originalPrice || baseOriginalPrice,
      stock: v.stock || 15,
      sku: `${baseSku || 'CRYS'}-${v.skuSuffix || index + 1}`,
      isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
    }));
    onChange(generated);
    recalcTotalStock(generated);
  };

  // Add a blank custom variant
  const handleAddVariant = () => {
    const newVariant = {
      id: `var_${Date.now()}_${variants.length}`,
      name: `Custom Variant ${variants.length + 1}`,
      sizeOrWeight: '8mm / 100g',
      price: basePrice,
      originalPrice: baseOriginalPrice,
      stock: 15,
      sku: `${baseSku || 'CRYS'}-V${variants.length + 1}`,
      isAvailable: true,
    };
    const updated = [...variants, newVariant];
    onChange(updated);
    recalcTotalStock(updated);
  };

  // Update a single variant field
  const handleVariantFieldChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' || field === 'originalPrice' || field === 'stock'
        ? Math.max(0, parseFloat(value) || 0)
        : value,
    };
    onChange(updated);
    if (field === 'stock') {
      recalcTotalStock(updated);
    }
  };

  // Delete variant
  const handleDeleteVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
    recalcTotalStock(updated);
  };

  // Duplicate variant
  const handleDuplicateVariant = (index) => {
    const source = variants[index];
    const clone = {
      ...source,
      id: `var_${Date.now()}`,
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY`,
    };
    const updated = [...variants.slice(0, index + 1), clone, ...variants.slice(index + 1)];
    onChange(updated);
    recalcTotalStock(updated);
  };

  // Move Up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const copy = [...variants];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Move Down
  const handleMoveDown = (index) => {
    if (index === variants.length - 1) return;
    const copy = [...variants];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Recalculate and update parent total stock
  const recalcTotalStock = (variantList) => {
    if (onTotalStockChange) {
      const sum = variantList.reduce((acc, v) => acc + (parseInt(v.stock, 10) || 0), 0);
      onTotalStockChange(sum);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Preset Bar */}
      <div className="bg-stone-900/60 border border-[#D4AF37]/20 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#E5D5BA] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Luxury Variant Generator & Presets
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Select a luxury crystal template or add unlimited bespoke variants with individual pricing & stock.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddVariant}
            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#D4AF37]/10"
          >
            <Plus className="w-4 h-4" /> Add Bespoke Variant
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-4 pt-4 border-t border-stone-800/80 flex flex-wrap gap-2">
          <span className="text-[11px] font-semibold text-stone-400 self-center uppercase tracking-wider mr-1">
            ⚡ Quick Presets:
          </span>
          {VARIANT_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-stone-950 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-200 hover:text-[#D4AF37] text-xs font-medium transition-all flex items-center gap-1.5 group"
            >
              <Zap className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Variants Table */}
      {variants.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-stone-800 rounded-2xl bg-stone-950/40">
          <Layers className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-300">No variants created yet</p>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Create bead size (4mm, 6mm, 8mm, 10mm), stone weight (50g, 100g, 250g), or wrist fit options using the quick presets above or by clicking &quot;Add Bespoke Variant&quot;.
          </p>
          <button
            type="button"
            onClick={handleAddVariant}
            className="mt-4 px-4 py-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl text-xs font-medium transition-all"
          >
            + Create First Variant
          </button>
        </div>
      ) : (
        <div className="border border-[#D4AF37]/20 rounded-2xl overflow-hidden bg-stone-900/40 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Variant Name / Title</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Size / Weight</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Price (₹)</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Original (₹)</th>
                  <th className="py-3.5 px-4 min-w-[100px]">Stock Count</th>
                  <th className="py-3.5 px-4 min-w-[130px]">SKU</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {variants.map((variant, index) => {
                  const discountPercent =
                    variant.originalPrice > variant.price
                      ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
                      : 0;

                  return (
                    <tr
                      key={variant.id || index}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Index & Reorder Handle */}
                      <td className="py-3 px-3 text-center text-stone-500 font-mono">
                        <div className="flex items-center justify-center gap-1">
                          <span>{index + 1}</span>
                        </div>
                      </td>

                      {/* Variant Name */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleVariantFieldChange(index, 'name', e.target.value)}
                          placeholder="e.g. 8mm Regular Bead Size"
                          className="w-full bg-stone-950/80 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-[#D4AF37] font-medium"
                        />
                      </td>

                      {/* Size / Weight / Finish */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={variant.sizeOrWeight || ''}
                          onChange={(e) => handleVariantFieldChange(index, 'sizeOrWeight', e.target.value)}
                          placeholder="8mm / 100g"
                          className="w-full bg-stone-950/80 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={variant.price}
                            onChange={(e) => handleVariantFieldChange(index, 'price', e.target.value)}
                            className="w-full bg-stone-950/80 border border-stone-800 rounded-lg pl-6 pr-2 py-1.5 text-[#D4AF37] font-semibold focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </td>

                      {/* Original Price */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={variant.originalPrice}
                            onChange={(e) => handleVariantFieldChange(index, 'originalPrice', e.target.value)}
                            className="w-full bg-stone-950/80 border border-stone-800 rounded-lg pl-6 pr-2 py-1.5 text-stone-400 focus:outline-none focus:border-[#D4AF37]"
                          />
                          {discountPercent > 0 && (
                            <span className="absolute -top-2 right-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Count */}
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => handleVariantFieldChange(index, 'stock', e.target.value)}
                          className={`w-full bg-stone-950/80 border rounded-lg px-2.5 py-1.5 font-mono font-medium focus:outline-none focus:border-[#D4AF37] ${
                            variant.stock <= 0
                              ? 'border-rose-900 text-rose-400 bg-rose-950/20'
                              : variant.stock <= 5
                              ? 'border-amber-900 text-amber-400 bg-amber-950/20'
                              : 'border-stone-800 text-stone-200'
                          }`}
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => handleVariantFieldChange(index, 'sku', e.target.value)}
                          placeholder="SKU-8MM"
                          className="w-full bg-stone-950/80 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-400 font-mono text-[11px] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleVariantFieldChange(index, 'isAvailable', !variant.isAvailable)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                            variant.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {variant.isAvailable ? 'Available' : 'Disabled'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                            title="Move Up"
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 disabled:opacity-30 transition-colors"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === variants.length - 1}
                            onClick={() => handleMoveDown(index)}
                            title="Move Down"
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 disabled:opacity-30 transition-colors"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateVariant(index)}
                            title="Duplicate"
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(index)}
                            title="Delete"
                            className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Variants Footer Summary */}
          <div className="p-4 bg-stone-950/90 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-stone-400">
              <span>
                Total Variants: <strong className="text-[#D4AF37]">{variants.length}</strong>
              </span>
              <span>
                Combined Variant Stock:{' '}
                <strong className="text-emerald-400">
                  {variants.reduce((acc, v) => acc + (parseInt(v.stock, 10) || 0), 0)} units
                </strong>
              </span>
            </div>

            <div className="text-[11px] text-stone-500">
              * Customers will select these options directly on the product detail page with instant price updates.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
