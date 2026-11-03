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
  CheckCircle2,
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
      priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShoppingBag,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
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
      priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: PackageX,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
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
      priorityColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
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
      priorityColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      title: `${pausedServices.length} Metaphysical Modalities Currently Paused`,
      description: `${pausedServices.map((s) => s.name || s.id).slice(0, 3).join(', ')} marked unavailable for patron bookings.`,
      actionLabel: 'Manage Modalities',
      actionTab: 'services',
      timestamp: 'Sanctuary Availability Status',
    });
  }

  return (
    <section className="p-6 rounded-2xl bg-white/95 border border-stone-200/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
      {/* Action Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              Action Center &amp; Founder Priorities
              {actionItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-sans font-bold">
                  {actionItems.length} Urgent Items
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500">
              Immediate operational tasks, order processing queues, and stock replenishment requirements.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="self-start sm:self-auto text-xs font-sans font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
        >
          <span>All Systems Normal</span>
        </button>
      </div>

      {/* Action Items List */}
      {actionItems.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-stone-50 border border-stone-100 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-semibold text-stone-900">
            Vault Equilibrium Achieved
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
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
                className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between space-y-3 group shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${item.iconBg} border border-stone-200/50 group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold border ${item.priorityColor} flex-shrink-0`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-sans text-stone-400 flex items-center gap-1">
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
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-purple-600 text-purple-700 hover:text-white font-semibold text-xs border border-purple-200 hover:border-purple-600 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
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
