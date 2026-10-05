'use client';

import React, { useState } from 'react';
import { X, Package, Save, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { saveProductToSupabase } from '../lib/supabase';

export default function RestockModal({
  product = null,
  onClose,
  onSaveSuccess,
}) {
  if (!product) return null;

  const currentStock = product.stockCount !== undefined ? product.stockCount : (product.totalStock !== undefined ? product.totalStock : 0);
  const [stock, setStock] = useState(currentStock);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...product,
        stockCount: parseInt(stock, 10),
        totalStock: parseInt(stock, 10),
        active: parseInt(stock, 10) > 0 ? (product.isActive !== false) : false,
        isActive: parseInt(stock, 10) > 0 ? (product.isActive !== false) : false,
      };

      const res = await saveProductToSupabase(payload);
      if (!res.success) throw new Error(res.error || 'Failed to update stock');

      onSaveSuccess(res.product || payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Error updating stock.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141210] border border-[#D4AF37]/40 rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#F3E5AB]">Quick Restock Specimen</h3>
              <p className="text-[11px] text-stone-400 truncate max-w-xs">{product.name || product.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 block">
              Adjust Vault Inventory Quantity
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStock((s) => Math.max(0, Number(s) - 5))}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-bold"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setStock((s) => Math.max(0, Number(s) - 1))}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-bold"
              >
                -1
              </button>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-center text-lg font-mono font-bold text-[#F3E5AB] focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setStock((s) => Number(s) + 1)}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-bold"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setStock((s) => Number(s) + 10)}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-bold"
              >
                +10
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Save Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
