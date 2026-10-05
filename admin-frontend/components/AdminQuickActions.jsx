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
  TrendingUp,
  RefreshCw,
  ExternalLink,
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
      iconColor: 'text-black',
      bgGradient: 'from-[#D4AF37] via-[#C59B27] to-[#B8860B]',
      isPrimary: true,
      onClick: onOpenCreateProduct,
    },
    {
      id: 'manage-orders',
      title: 'Fulfill Patron Orders',
      description: 'Inspect status, dispatch & invoices',
      icon: ShoppingBag,
      iconColor: 'text-purple-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      onClick: () => onNavigate('orders'),
    },
    {
      id: 'manage-inventory',
      title: 'Restock Inventory',
      description: 'Audit quantities & SKU thresholds',
      icon: Package,
      iconColor: 'text-[#D4AF37]',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60',
      onClick: () => onNavigate('inventory'),
    },
    {
      id: 'broadcast-banner',
      title: 'Broadcast Announcement',
      description: 'Publish luxury top marquee ribbon',
      icon: Megaphone,
      iconColor: 'text-amber-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      onClick: () => onNavigate('broadcast'),
    },
    {
      id: 'shipping-rules',
      title: 'Adjust Shipping Fees',
      description: 'Pune radial distance tiers & limits',
      icon: Truck,
      iconColor: 'text-blue-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
      onClick: () => onNavigate('shipping'),
    },
    {
      id: 'dynamic-filters',
      title: 'Store Filter Matrix',
      description: 'Configure bead sizes, chakras & intentions',
      icon: SlidersHorizontal,
      iconColor: 'text-emerald-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      onClick: () => onNavigate('filters'),
    },
    {
      id: 'modalities-services',
      title: '9 Sacred Modalities',
      description: 'Toggle Reiki, Aura & Tarot availability',
      icon: Sparkles,
      iconColor: 'text-pink-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-pink-500/30 hover:border-pink-500/60',
      onClick: () => onNavigate('services'),
    },
    {
      id: 'view-patrons',
      title: 'Patrons & Collectors',
      description: 'View registered seeker directory',
      icon: Users,
      iconColor: 'text-cyan-400',
      bgGradient: 'from-stone-900 via-[#141210] to-stone-950',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      onClick: () => onNavigate('customers'),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold text-[#E5D5BA] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Quick Operational Shortcuts
        </h3>
        <span className="text-[10px] font-mono text-stone-500">1-Click Launch</span>
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
                className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 hover:-translate-y-1 transition-all duration-300 text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-black/15 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-bold font-serif tracking-wide">{act.title}</div>
                  <div className="text-[10px] text-black/80 mt-0.5 font-medium">{act.description}</div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`p-4 rounded-2xl bg-gradient-to-br ${act.bgGradient} border ${act.borderColor} hover:-translate-y-1 transition-all duration-300 text-left flex items-start gap-3 cursor-pointer group shadow-lg`}
            >
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 group-hover:scale-110 transition-transform flex-shrink-0">
                <Icon className={`w-4 h-4 ${act.iconColor}`} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-stone-100 group-hover:text-[#F3E5AB] transition-colors truncate">
                  {act.title}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 truncate">{act.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
