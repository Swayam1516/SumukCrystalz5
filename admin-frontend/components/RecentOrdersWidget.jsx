'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, AlertCircle, Eye, ExternalLink } from 'lucide-react';

export default function RecentOrdersWidget({
  orders = [],
  onNavigate,
  onOpenOrderStatus,
}) {
  const recentList = orders.slice(0, 6);

  return (
    <div className="p-6 rounded-3xl bg-stone-950/80 border border-stone-800 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider">
            Recent Patron Orders
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="text-xs font-mono text-[#D4AF37] hover:text-[#f7e7ce] flex items-center gap-1 transition-colors"
        >
          <span>View All ({orders.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-500">
          No patron orders recorded in database yet.
        </div>
      ) : (
        <div className="space-y-3">
          {recentList.map((ord, idx) => {
            const status = (ord.status || 'pending').toLowerCase();
            const dateStr = ord.created_at || ord.createdAt ? new Date(ord.created_at || ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
            const amount = Number(ord.total || ord.total_amount || ord.subtotal || 0);

            return (
              <div
                key={ord.id || ord.order_number || idx}
                className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-[#D4AF37]/30 transition-colors flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-stone-100 flex items-center gap-2">
                    <span>#{ord.order_number || ord.orderId || `ORD-${idx + 1}`}</span>
                    <span className="text-[10px] font-mono text-stone-500">• {dateStr}</span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {ord.buyer_name || ord.buyerName || 'Valued Patron'} ({ord.buyer_email || ord.buyerEmail})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-[#F3E5AB]">
                      ₹{amount.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider ${
                        status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ['processing', 'paid', 'confirmed', 'packed'].includes(status)
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : ['cancelled', 'refunded'].includes(status)
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ord.status || 'Pending'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenOrderStatus && onOpenOrderStatus(ord)}
                    className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
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
