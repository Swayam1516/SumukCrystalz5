'use client';

import React from 'react';
import {
  Plus,
  Package,
  ShoppingBag,
  Users,
  SlidersHorizontal,
  Truck,
  Megaphone,
  Sparkles,
} from 'lucide-react';

export default function AdminQuickActions({
  onOpenCreateProduct,
  onNavigate,
  onRefreshData,
  loadingData,
}) {
  const actions = [
    {
      id: 'create-product',
      title: 'Add Crystal Specimen',
      description: 'Create masterwork with variants & 3D photos',
      icon: Plus,
      iconColor: 'text-white',
      bgStyle: 'bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#5B21B6] text-white shadow-md shadow-purple-500/25',
      isPrimary: true,
      onClick: onOpenCreateProduct,
    },
    {
      id: 'manage-orders',
      title: 'Fulfill Patron Orders',
      description: 'Inspect status, dispatch & invoices',
      icon: ShoppingBag,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      onClick: () => onNavigate('orders'),
    },
    {
      id: 'manage-inventory',
      title: 'Restock Inventory',
      description: 'Audit quantities & SKU thresholds',
      icon: Package,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      onClick: () => onNavigate('inventory'),
    },
    {
      id: 'broadcast-banner',
      title: 'Broadcast Announcement',
      description: 'Publish luxury top marquee ribbon',
      icon: Megaphone,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      onClick: () => onNavigate('broadcast'),
    },
    {
      id: 'shipping-rules',
      title: 'Adjust Shipping Fees',
      description: 'Pune radial distance tiers & limits',
      icon: Truck,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      onClick: () => onNavigate('shipping'),
    },
    {
      id: 'dynamic-filters',
      title: 'Store Filter Matrix',
      description: 'Configure bead sizes, chakras & intentions',
      icon: SlidersHorizontal,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      onClick: () => onNavigate('filters'),
    },
    {
      id: 'modalities-services',
      title: '9 Sacred Modalities',
      description: 'Toggle Reiki, Aura & Tarot availability',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      onClick: () => onNavigate('services'),
    },
    {
      id: 'view-patrons',
      title: 'Patrons & Collectors',
      description: 'View registered seeker directory',
      icon: Users,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      onClick: () => onNavigate('customers'),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Quick Operational Shortcuts
        </h3>
        <span className="text-[10px] font-sans text-stone-400 font-medium">1-Click Launch</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;

          if (act.isPrimary) {
            return (
              <button
                key={act.id}
                type="button"
                onClick={act.onClick}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#5B21B6] text-white shadow-md shadow-purple-500/25 hover:brightness-105 hover:-translate-y-1 transition-all duration-300 text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-white/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-bold font-serif tracking-wide">{act.title}</div>
                  <div className="text-[10px] text-white/80 mt-0.5 font-medium">{act.description}</div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="p-4 rounded-2xl bg-white/95 border border-stone-200/80 hover:border-purple-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left flex items-start gap-3 cursor-pointer group shadow-xs"
            >
              <div className={`p-2.5 rounded-xl ${act.iconBg} border border-stone-200/50 group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${act.iconColor}`} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-stone-900 group-hover:text-purple-700 transition-colors truncate">
                  {act.title}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">{act.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
