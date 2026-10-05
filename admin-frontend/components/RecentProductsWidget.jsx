'use client';

import React from 'react';
import { Package, ArrowRight, Edit, Eye, Sparkles } from 'lucide-react';

export default function RecentProductsWidget({
  products = [],
  onNavigate,
  onEditProduct,
  onPreviewProduct,
}) {
  const recentList = products.slice(0, 6);

  return (
    <div className="p-6 rounded-3xl bg-stone-950/80 border border-stone-800 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider">
            Recently Added / Updated Specimens
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('inventory')}
          className="text-xs font-mono text-[#D4AF37] hover:text-[#f7e7ce] flex items-center gap-1 transition-colors"
        >
          <span>Catalog ({products.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-500">
          No crystal specimens in database yet.
        </div>
      ) : (
        <div className="space-y-3">
          {recentList.map((p) => {
            const primaryImg = p.images?.[0] || p.image || p.hero_image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=200&q=80';
            const price = Number(p.price || p.selling_price || 699);
            const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 15);

            return (
              <div
                key={p.id || p.slug}
                className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-[#D4AF37]/30 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex-shrink-0">
                    <img src={primaryImg} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="truncate">
                    <div className="font-semibold text-stone-100 truncate flex items-center gap-1.5">
                      {p.name || p.title}
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {p.category || 'Energy Bands'} • Stock: {stock}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-[#F3E5AB]">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[9px] font-mono font-semibold uppercase ${
                        p.isActive !== false && p.active !== false
                          ? 'text-emerald-400'
                          : 'text-stone-500'
                      }`}
                    >
                      {p.isActive !== false && p.active !== false ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditProduct && onEditProduct(p)}
                    className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
                    title="Edit Specimen"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
