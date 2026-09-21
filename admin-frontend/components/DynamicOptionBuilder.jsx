'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Sparkles, 
  Layers, 
  DollarSign, 
  Package, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { createProductWithOptions } from '../lib/dynamicProductsService';

export default function DynamicOptionBuilder({ onSuccess, onError }) {
  // Base Product State
  const [productDetails, setProductDetails] = useState({
    title: '',
    slug: '',
    description: '',
    base_price: 1499,
    currency: 'INR',
    total_stock: 25,
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    ],
    is_active: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Dynamic Options State
  const [options, setOptions] = useState([
    {
      id: 'opt_1',
      option_name: 'Bracelet Wrist Size',
      input_type: 'radio', // 'radio' | 'select' | 'text'
      is_required: true,
      values: [
        { id: 'val_1', label: '6.5 inches (Petite)', price_adjustment: 0, stock_quantity: 15 },
        { id: 'val_2', label: '7.0 inches (Standard)', price_adjustment: 0, stock_quantity: 20 },
        { id: 'val_3', label: '7.5 inches (Comfort + Extra Beads)', price_adjustment: 150, stock_quantity: 10 },
      ],
    },
    {
      id: 'opt_2',
      option_name: 'Crystal Consecration & Energization',
      input_type: 'select',
      is_required: false,
      values: [
        { id: 'val_4', label: 'Standard Raw Energy (No Charge)', price_adjustment: 0, stock_quantity: 50 },
        { id: 'val_5', label: 'Vedic Mantra Consecrated by Soumyaa Naveen', price_adjustment: 350, stock_quantity: 50 },
        { id: 'val_6', label: '528Hz Solfeggio Sound-Attuned + Custom Yantra', price_adjustment: 500, stock_quantity: 25 },
      ],
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');

  // Handlers for Base Details
  const handleBaseChange = (field, value) => {
    setProductDetails((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !prev.slug
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductDetails((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const removeImageUrl = (index) => {
    setProductDetails((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handlers for Dynamic Option Groups
  const addOptionGroup = () => {
    const newGroup = {
      id: `opt_${Date.now()}`,
      option_name: 'New Custom Attribute (e.g. Bead Quality)',
      input_type: 'select',
      is_required: true,
      values: [
        { id: `val_${Date.now()}_1`, label: 'Standard Choice', price_adjustment: 0, stock_quantity: 10 },
      ],
    };
    setOptions((prev) => [...prev, newGroup]);
  };

  const removeOptionGroup = (groupIndex) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== groupIndex));
  };

  const moveOptionGroup = (groupIndex, direction) => {
    if (
      (direction === 'up' && groupIndex === 0) ||
      (direction === 'down' && groupIndex === options.length - 1)
    ) {
      return;
    }
    const newOptions = [...options];
    const targetIndex = direction === 'up' ? groupIndex - 1 : groupIndex + 1;
    const temp = newOptions[groupIndex];
    newOptions[groupIndex] = newOptions[targetIndex];
    newOptions[targetIndex] = temp;
    setOptions(newOptions);
  };

  const updateOptionGroup = (groupIndex, field, value) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[groupIndex] = { ...copy[groupIndex], [field]: value };
      return copy;
    });
  };

  // Handlers for Option Values
  const addValueChoice = (groupIndex) => {
    setOptions((prev) => {
      const copy = [...prev];
      const targetGroup = { ...copy[groupIndex] };
      targetGroup.values = [
        ...targetGroup.values,
        {
          id: `val_${Date.now()}`,
          label: 'New Option Value',
          price_adjustment: 0,
          stock_quantity: 10,
        },
      ];
      copy[groupIndex] = targetGroup;
      return copy;
    });
  };

  const removeValueChoice = (groupIndex, valIndex) => {
    setOptions((prev) => {
      const copy = [...prev];
      const targetGroup = { ...copy[groupIndex] };
      targetGroup.values = targetGroup.values.filter((_, idx) => idx !== valIndex);
      copy[groupIndex] = targetGroup;
      return copy;
    });
  };

  const updateValueChoice = (groupIndex, valIndex, field, value) => {
    setOptions((prev) => {
      const copy = [...prev];
      const targetGroup = { ...copy[groupIndex] };
      const newValues = [...targetGroup.values];
      newValues[valIndex] = { ...newValues[valIndex], [field]: value };
      targetGroup.values = newValues;
      copy[groupIndex] = targetGroup;
      return copy;
    });
  };

  // Submit to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.title.trim()) {
      setSaveStatus('error');
      setStatusMessage('Please provide a valid product title.');
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    // Format options payload for API
    const formattedOptions = options.map((opt, optIdx) => ({
      option_name: opt.option_name.trim(),
      input_type: opt.input_type,
      is_required: Boolean(opt.is_required),
      sort_order: optIdx + 1,
      values: opt.values.map((val, valIdx) => ({
        label: val.label.trim(),
        price_adjustment: parseFloat(val.price_adjustment) || 0,
        stock_quantity: parseInt(val.stock_quantity, 10) || 0,
        sort_order: valIdx + 1,
      })),
    }));

    const result = await createProductWithOptions(productDetails, formattedOptions);

    setSaving(false);
    if (result.success) {
      setSaveStatus('success');
      setStatusMessage(`Product "${productDetails.title}" with ${options.length} dynamic attributes saved to Supabase!`);
      if (onSuccess) onSuccess(result);
    } else {
      setSaveStatus('error');
      setStatusMessage(result.error || 'Failed to save product with options to Supabase.');
      if (onError) onError(result.error);
    }
  };

  return (
    <div className="bg-[#121118] text-white rounded-2xl border border-[#D4AF37]/30 shadow-2xl p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-widest">
            <Sliders className="w-3.5 h-3.5" />
            <span>PostgreSQL / Supabase Schema Builder</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-2">
            Dynamic Product &amp; Attribute Studio
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Define arbitrary custom attributes (Size, Weight, Vedic Grade) on the fly without schema migrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addOptionGroup}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#D4AF37]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Attribute</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Product Base Details */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>1. Product Core Specification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={productDetails.title}
                onChange={(e) => handleBaseChange('title', e.target.value)}
                placeholder="e.g. Masterwork Natural Golden Pyrite Bracelet"
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={productDetails.slug}
                onChange={(e) => handleBaseChange('slug', e.target.value)}
                placeholder="masterwork-pyrite-bracelet"
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                  Base Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productDetails.base_price}
                    onChange={(e) => handleBaseChange('base_price', e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                  Default Base Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={productDetails.total_stock}
                  onChange={(e) => handleBaseChange('total_stock', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Publishing Status
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="is_active"
                    checked={productDetails.is_active === true}
                    onChange={() => handleBaseChange('is_active', true)}
                    className="accent-[#D4AF37]"
                  />
                  <span>Active &amp; Visible to Customers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                  <input
                    type="radio"
                    name="is_active"
                    checked={productDetails.is_active === false}
                    onChange={() => handleBaseChange('is_active', false)}
                    className="accent-[#D4AF37]"
                  />
                  <span>Draft / Hidden</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
              Description &amp; Consecration Lore
            </label>
            <textarea
              rows={3}
              value={productDetails.description}
              onChange={(e) => handleBaseChange('description', e.target.value)}
              placeholder="Describe the metaphysical resonance, origin mine, and material qualities..."
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
              Product Images (Supabase Storage / CDN URLs)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-medium transition"
              >
                + Add Image
              </button>
            </div>

            {productDetails.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {productDetails.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/20 bg-black"
                  >
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(idx)}
                      className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Dynamic Custom Attribute Builder */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>2. Customizable Options &amp; Attribute Variants ({options.length})</span>
            </h3>
            <span className="text-xs text-gray-400">
              Customers configure these options during checkout
            </span>
          </div>

          {options.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/20 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-gray-400">No custom attributes defined yet.</p>
              <button
                type="button"
                onClick={addOptionGroup}
                className="mt-3 inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Attribute (e.g. Wrist Size, Weight, Quality)</span>
              </button>
            </div>
          ) : (
            options.map((opt, groupIdx) => (
              <div
                key={opt.id}
                className="bg-[#181722] border border-[#D4AF37]/30 rounded-xl p-5 space-y-4 shadow-xl relative"
              >
                {/* Option Group Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                      #{groupIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt.option_name}
                      onChange={(e) => updateOptionGroup(groupIdx, 'option_name', e.target.value)}
                      placeholder="Attribute Name (e.g. Wrist Size, Crystal Weight, Bead Quality)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-semibold text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Input Type Selector */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400 font-mono text-[11px]">Type:</span>
                      <select
                        value={opt.input_type}
                        onChange={(e) => updateOptionGroup(groupIdx, 'input_type', e.target.value)}
                        className="px-2.5 py-1 rounded bg-black/70 border border-white/20 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="radio">Radio Buttons (Pills)</option>
                        <option value="select">Dropdown Menu</option>
                        <option value="text">Custom Text Field</option>
                      </select>
                    </div>

                    {/* Required Checkbox */}
                    <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={opt.is_required}
                        onChange={(e) => updateOptionGroup(groupIdx, 'is_required', e.target.checked)}
                        className="accent-[#D4AF37]"
                      />
                      <span>Required</span>
                    </label>

                    {/* Reordering & Delete */}
                    <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                      <button
                        type="button"
                        onClick={() => moveOptionGroup(groupIdx, 'up')}
                        disabled={groupIdx === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOptionGroup(groupIdx, 'down')}
                        disabled={groupIdx === options.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOptionGroup(groupIdx)}
                        className="p-1 text-red-400 hover:text-red-300 ml-1"
                        title="Delete Attribute Group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Values Repeater */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Choice Values &amp; Price Adjustments
                    </span>
                    <button
                      type="button"
                      onClick={() => addValueChoice(groupIdx)}
                      className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline font-mono"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Value Choice</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {opt.values.map((val, valIdx) => (
                      <div
                        key={val.id || valIdx}
                        className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-2.5 rounded-lg bg-black/40 border border-white/5"
                      >
                        {/* Choice Label */}
                        <div className="flex-1 min-w-[180px]">
                          <input
                            type="text"
                            value={val.label}
                            onChange={(e) => updateValueChoice(groupIdx, valIdx, 'label', e.target.value)}
                            placeholder="Choice Label (e.g. 500 grams, AAA Luster)"
                            className="w-full px-3 py-1.5 rounded bg-black/70 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        {/* Price Surcharge / Discount */}
                        <div className="w-36">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-[11px] text-gray-400">
                              +/- ₹
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={val.price_adjustment}
                              onChange={(e) => updateValueChoice(groupIdx, valIdx, 'price_adjustment', e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-9 pr-2 py-1.5 rounded bg-black/70 border border-white/10 text-white text-xs text-right font-mono focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        {/* Stock Count */}
                        <div className="w-28">
                          <input
                            type="number"
                            min="0"
                            value={val.stock_quantity}
                            onChange={(e) => updateValueChoice(groupIdx, valIdx, 'stock_quantity', e.target.value)}
                            placeholder="Stock"
                            className="w-full px-2.5 py-1.5 rounded bg-black/70 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        {/* Delete Choice */}
                        <button
                          type="button"
                          onClick={() => removeValueChoice(groupIdx, valIdx)}
                          className="p-1.5 text-gray-500 hover:text-red-400"
                          title="Remove Choice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Feedback Alert */}
        {saveStatus && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
              saveStatus === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/30 text-red-300'
            }`}
          >
            {saveStatus === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <p className="flex-1">{statusMessage}</p>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
          <div className="text-xs text-gray-400 font-mono">
            <span>Calculated Minimum Price: </span>
            <strong className="text-white">₹{productDetails.base_price}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition shadow-xl disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Publishing to Supabase...' : 'Save Product & Custom Options'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
