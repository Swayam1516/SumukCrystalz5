'use client';

import React from 'react';
import { Package, ArrowRight, Edit } from 'lucide-react';

export default function RecentProductsWidget({
  products = [],
  onNavigate,
  onEditProduct,
  onPreviewProduct,
}) {
  const recentList = products.slice(0, 6);

  return (
    <div className="p-6 rounded-2xl bg-white/95 border border-stone-200/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider">
            Recently Added / Updated Specimens
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('inventory')}
          className="text-xs font-sans font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
        >
          <span>Catalog ({products.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-400">
          No crystal specimens in database yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentList.map((p) => {
            const primaryImg = p.images?.[0] || p.image || p.hero_image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=200&q=80';
            const price = Number(p.price || p.selling_price || 699);
            const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 15);

            return (
              <div
                key={p.id || p.slug}
                className="p-3 rounded-xl bg-stone-50/70 hover:bg-stone-50 border border-stone-100 hover:border-purple-200 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0 shadow-xs">
                    <img src={primaryImg} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="truncate">
                    <div className="font-semibold text-stone-900 truncate flex items-center gap-1.5">
                      {p.name || p.title}
                    </div>
                    <div className="text-[10px] font-sans text-stone-500">
                      {p.category || 'Sacred Gemstone'} • Stock: {stock}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-serif font-bold text-stone-900">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[9px] font-sans font-semibold uppercase ${
                        p.isActive !== false && p.active !== false
                          ? 'text-emerald-700'
                          : 'text-stone-400'
                      }`}
                    >
                      {p.isActive !== false && p.active !== false ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditProduct && onEditProduct(p)}
                    className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-stone-500 hover:text-purple-700 border border-stone-200 hover:border-purple-200 transition-colors shadow-xs"
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
