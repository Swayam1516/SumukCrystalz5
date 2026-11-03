'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';

export default function RecentOrdersWidget({
  orders = [],
  onNavigate,
  onOpenOrderStatus,
}) {
  const recentList = orders.slice(0, 6);

  return (
    <div className="p-6 rounded-2xl bg-white/95 border border-stone-200/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider">
            Recent Patron Orders
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="text-xs font-sans font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
        >
          <span>View All ({orders.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-400">
          No patron orders recorded in database yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentList.map((ord, idx) => {
            const status = (ord.status || 'pending').toLowerCase();
            const dateStr = ord.created_at || ord.createdAt ? new Date(ord.created_at || ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
            const amount = Number(ord.total || ord.total_amount || ord.subtotal || 0);

            return (
              <div
                key={ord.id || ord.order_number || idx}
                className="p-3 rounded-xl bg-stone-50/70 hover:bg-stone-50 border border-stone-100 hover:border-purple-200 transition-all flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span>#{ord.order_number || ord.orderId || `ORD-${idx + 1}`}</span>
                    <span className="text-[10px] font-sans text-stone-400">• {dateStr}</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {ord.buyer_name || ord.buyerName || 'Valued Patron'} ({ord.buyer_email || ord.buyerEmail})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-serif font-bold text-stone-900">
                      ₹{amount.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-wider ${
                        status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ['processing', 'paid', 'confirmed', 'packed'].includes(status)
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : ['cancelled', 'refunded'].includes(status)
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.status || 'Pending'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenOrderStatus && onOpenOrderStatus(ord)}
                    className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-stone-500 hover:text-purple-700 border border-stone-200 hover:border-purple-200 transition-colors shadow-xs"
                    title="Update Status"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
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
