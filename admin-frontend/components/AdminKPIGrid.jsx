'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  PackageCheck,
  PackageX,
  AlertTriangle,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Sparkles,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

// Animated Number Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '', isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 800; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      // Ease out quad
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(target * easeOut);

      setDisplayValue(current);

      if (currentFrame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(target);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [value]);

  if (isCurrency) {
    return (
      <span>
        {prefix}₹{displayValue.toLocaleString('en-IN')}{suffix}
      </span>
    );
  }

  return (
    <span>
      {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function AdminKPIGrid({ metrics = {}, onNavigate }) {
  const cards = [
    // REVENUE GROUP
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: metrics.totalRevenue || 0,
      isCurrency: true,
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      iconColor: 'text-[#D4AF37]',
      bgGlow: 'from-[#D4AF37]/15 to-transparent',
      borderColor: 'border-[#D4AF37]/40',
      badgeColor: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
      tabTarget: 'analytics',
    },
    {
      id: 'month-revenue',
      label: "This Month's Revenue",
      value: metrics.thisMonthRevenue || 0,
      isCurrency: true,
      change: 'Active Month',
      isPositive: true,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 to-transparent',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tabTarget: 'analytics',
    },
    {
      id: 'today-revenue',
      label: "Today's Revenue",
      value: metrics.todayRevenue || 0,
      isCurrency: true,
      change: '24h Window',
      isPositive: true,
      icon: Calendar,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/15 to-transparent',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      tabTarget: 'analytics',
    },

    // ORDERS GROUP
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: metrics.totalOrders || 0,
      isCurrency: false,
      change: 'All Time',
      isPositive: true,
      icon: ShoppingBag,
      iconColor: 'text-purple-400',
      bgGlow: 'from-purple-500/15 to-transparent',
      borderColor: 'border-purple-500/30',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      tabTarget: 'orders',
    },
    {
      id: 'pending-orders',
      label: 'Pending Orders',
      value: metrics.pendingOrders || 0,
      isCurrency: false,
      change: 'Awaiting Action',
      isPositive: metrics.pendingOrders === 0,
      icon: Clock,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/15 to-transparent',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      tabTarget: 'orders',
    },
    {
      id: 'processing-orders',
      label: 'Processing Orders',
      value: metrics.processingOrders || 0,
      isCurrency: false,
      change: 'In Progress',
      isPositive: true,
      icon: Layers,
      iconColor: 'text-blue-400',
      bgGlow: 'from-blue-500/15 to-transparent',
      borderColor: 'border-blue-500/30',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      tabTarget: 'orders',
    },
    {
      id: 'delivered-orders',
      label: 'Delivered Orders',
      value: metrics.deliveredOrders || 0,
      isCurrency: false,
      change: 'Completed',
      isPositive: true,
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 to-transparent',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tabTarget: 'orders',
    },
    {
      id: 'cancelled-orders',
      label: 'Cancelled Orders',
      value: metrics.cancelledOrders || 0,
      isCurrency: false,
      change: 'Voided',
      isPositive: metrics.cancelledOrders === 0,
      icon: XCircle,
      iconColor: 'text-rose-400',
      bgGlow: 'from-rose-500/15 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      tabTarget: 'orders',
    },

    // PRODUCTS & INVENTORY GROUP
    {
      id: 'total-products',
      label: 'Total Products',
      value: metrics.totalProducts || 0,
      isCurrency: false,
      change: 'Masterworks',
      isPositive: true,
      icon: Package,
      iconColor: 'text-[#D4AF37]',
      bgGlow: 'from-[#D4AF37]/15 to-transparent',
      borderColor: 'border-[#D4AF37]/30',
      badgeColor: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
      tabTarget: 'inventory',
    },
    {
      id: 'active-products',
      label: 'Active Products',
      value: metrics.activeProducts || 0,
      isCurrency: false,
      change: 'Published',
      isPositive: true,
      icon: PackageCheck,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 to-transparent',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tabTarget: 'inventory',
    },
    {
      id: 'low-stock',
      label: 'Low Stock Alert',
      value: metrics.lowStockCount || 0,
      isCurrency: false,
      change: '≤ 5 Units',
      isPositive: metrics.lowStockCount === 0,
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/15 to-transparent',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      tabTarget: 'action-center',
    },
    {
      id: 'out-of-stock',
      label: 'Out of Stock',
      value: metrics.outOfStockCount || 0,
      isCurrency: false,
      change: '0 Inventory',
      isPositive: metrics.outOfStockCount === 0,
      icon: PackageX,
      iconColor: 'text-rose-400',
      bgGlow: 'from-rose-500/15 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      tabTarget: 'action-center',
    },

    // CUSTOMERS GROUP
    {
      id: 'total-customers',
      label: 'Total Patrons',
      value: metrics.totalCustomers || 0,
      isCurrency: false,
      change: 'Registered',
      isPositive: true,
      icon: Users,
      iconColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/15 to-transparent',
      borderColor: 'border-cyan-500/30',
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      tabTarget: 'customers',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <h2 className="text-sm font-serif font-bold text-[#E5D5BA] uppercase tracking-wider">
            Real-Time Key Performance Indicators
          </h2>
        </div>
        <span className="text-[11px] font-mono text-stone-500">
          Live Synced • 13 Metrics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => onNavigate && onNavigate(card.tabTarget)}
              className={`group relative p-4 rounded-2xl bg-gradient-to-br from-stone-900/90 via-[#141210]/95 to-stone-950 border ${card.borderColor} backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#D4AF37]/10 cursor-pointer overflow-hidden flex flex-col justify-between`}
            >
              {/* Top ambient radial glow */}
              <div
                className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${card.bgGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
              />

              {/* Card Header: Icon & Trend Pill */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 shadow-inner group-hover:scale-110 group-hover:border-[#D4AF37]/40 transition-all duration-300">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${card.badgeColor} flex items-center gap-1`}
                >
                  {card.change}
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                </span>
              </div>

              {/* Card Body: Label & Value */}
              <div className="mt-4 space-y-1 relative z-10">
                <div className="text-[11px] font-medium text-stone-400 group-hover:text-stone-300 transition-colors truncate">
                  {card.label}
                </div>
                <div className="text-lg sm:text-xl font-serif font-bold text-stone-100 tracking-tight group-hover:text-[#F3E5AB] transition-colors">
                  <AnimatedCounter value={card.value} isCurrency={card.isCurrency} />
                </div>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="mt-3 pt-2 border-t border-stone-800/50 flex items-center justify-between text-[10px] font-mono text-stone-500">
                <span>View Details</span>
                <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                  &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
