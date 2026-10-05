'use client';

import React from 'react';
import {
  AlertTriangle,
  Clock,
  Package,
  PackageX,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Truck,
  Megaphone,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function AdminActionCenter({
  metrics = {},
  orders = [],
  products = [],
  services = [],
  onNavigate,
  onQuickRestock,
}) {
  const pendingOrders = orders.filter((o) => ['pending', 'created'].includes((o.status || '').toLowerCase()));
  const lowStockProds = metrics.lowStockProducts || [];
  const outOfStockProds = metrics.outOfStockProducts || [];
  const pausedServices = services.filter((s) => s.status === 'currently unavailable');

  const actionItems = [];

  // 1. Pending Orders
  if (pendingOrders.length > 0) {
    actionItems.push({
      id: 'pending-orders-alert',
      priority: 'HIGH',
      priorityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShoppingBag,
      iconColor: 'text-rose-400',
      title: `${pendingOrders.length} Orders Awaiting Processing`,
      description: `Patrons have placed orders with pending packing or fulfillment status. Total value: ₹${pendingOrders.reduce((acc, o) => acc + Number(o.total || o.total_amount || 0), 0).toLocaleString('en-IN')}.`,
      actionLabel: 'View Orders',
      actionTab: 'orders',
      timestamp: 'Immediate Attention Required',
    });
  }

  // 2. Out of Stock Specimens
  if (outOfStockProds.length > 0) {
    actionItems.push({
      id: 'out-of-stock-alert',
      priority: 'CRITICAL',
      priorityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: PackageX,
      iconColor: 'text-rose-400',
      title: `${outOfStockProds.length} Crystal Specimens Sold Out`,
      description: `${outOfStockProds.map((p) => p.name).slice(0, 3).join(', ')}${outOfStockProds.length > 3 ? ` and ${outOfStockProds.length - 3} more` : ''} currently have zero vault inventory.`,
      actionLabel: 'Restock Inventory',
      actionTab: 'inventory',
      onActionClick: () => onQuickRestock && onQuickRestock(outOfStockProds[0]),
      timestamp: 'Storefront Availability Impacted',
    });
  }

  // 3. Low Stock Specimens
  if (lowStockProds.length > 0) {
    actionItems.push({
      id: 'low-stock-alert',
      priority: 'MEDIUM',
      priorityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      title: `${lowStockProds.length} Specimens Low in Stock (≤ 5 units)`,
      description: `${lowStockProds.map((p) => `${p.name} (${p.stockCount || p.totalStock} left)`).slice(0, 2).join(', ')} nearing zero stock.`,
      actionLabel: 'Manage Inventory',
      actionTab: 'inventory',
      onActionClick: () => onQuickRestock && onQuickRestock(lowStockProds[0]),
      timestamp: 'Restock Recommended',
    });
  }

  // 4. Paused Modalities
  if (pausedServices.length > 0) {
    actionItems.push({
      id: 'paused-services-alert',
      priority: 'LOW',
      priorityColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      title: `${pausedServices.length} Metaphysical Modalities Currently Paused`,
      description: `${pausedServices.map((s) => s.name || s.id).slice(0, 3).join(', ')} marked unavailable for patron bookings.`,
      actionLabel: 'Manage Modalities',
      actionTab: 'services',
      timestamp: 'Sanctuary Availability Status',
    });
  }

  return (
    <section className="p-6 rounded-3xl bg-gradient-to-br from-[#17130F]/90 via-[#120F0D]/90 to-stone-950 border border-[#D4AF37]/30 backdrop-blur-2xl shadow-2xl space-y-5">
      {/* Action Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
              Action Center &amp; Founder Priorities
              {actionItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {actionItems.length} Urgent Items
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-400">
              Immediate operational tasks, order processing queues, and stock replenishment requirements.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="self-start sm:self-auto text-xs font-mono text-[#D4AF37] hover:text-[#f7e7ce] flex items-center gap-1 transition-colors"
        >
          <span>All Systems Normal</span>
        </button>
      </div>

      {/* Action Items List */}
      {actionItems.length === 0 ? (
        <div className="py-8 px-4 rounded-2xl bg-stone-950/60 border border-stone-800/60 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-stone-200">
            Vault Equilibrium Achieved
          </h4>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            All orders are fulfilled, stock levels are abundant across all crystal masterworks, and sacred modalities are active.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between space-y-3 group shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-100 group-hover:text-[#F3E5AB] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.priorityColor} flex-shrink-0`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.onActionClick) {
                        item.onActionClick();
                      } else {
                        onNavigate(item.actionTab);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
