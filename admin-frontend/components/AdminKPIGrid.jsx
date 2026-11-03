'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  PackageCheck,
  PackageX,
  AlertTriangle,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  TrendingUp,
  Calendar,
  Users,
  Layers,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { CardCornerCrystal, MarblePedestalShowcase } from './CrystalArtwork';

// Animated Number Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '', isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 700; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.max(1, Math.round(duration / frameRate));
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 3);
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
    // ROW 1: 6 Cards
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: metrics.totalRevenue || 26771,
      isCurrency: true,
      change: '+14.2%',
      crystalType: 'citrine',
      icon: Coins,
      iconBg: 'bg-[#FEF3C7]/60 text-[#D97706]',
      pillStyle: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      tabTarget: 'analytics',
    },
    {
      id: 'month-revenue',
      label: "This Month's Revenue",
      value: metrics.thisMonthRevenue || 0,
      isCurrency: true,
      change: 'Active Month',
      crystalType: 'amethyst',
      icon: TrendingUp,
      iconBg: 'bg-[#DCFCE7]/70 text-[#16A34A]',
      pillStyle: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
      tabTarget: 'analytics',
    },
    {
      id: 'today-revenue',
      label: "Today's Revenue",
      value: metrics.todayRevenue || 0,
      isCurrency: true,
      change: '24h Window',
      crystalType: 'citrine',
      icon: Calendar,
      iconBg: 'bg-[#FEF3C7]/60 text-[#D97706]',
      pillStyle: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      tabTarget: 'analytics',
    },
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: metrics.totalOrders || 12,
      isCurrency: false,
      change: 'All Time',
      crystalType: 'amethyst',
      icon: ShoppingBag,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      pillStyle: 'bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]',
      tabTarget: 'orders',
    },
    {
      id: 'pending-orders',
      label: 'Pending Orders',
      value: metrics.pendingOrders || 9,
      isCurrency: false,
      change: 'Awaiting Action',
      crystalType: 'citrine',
      icon: Clock,
      iconBg: 'bg-[#FEF3C7]/60 text-[#D97706]',
      pillStyle: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      tabTarget: 'orders',
    },
    {
      id: 'processing-orders',
      label: 'Processing Orders',
      value: metrics.processingOrders || 3,
      isCurrency: false,
      change: 'In Progress',
      crystalType: 'celestite',
      icon: Layers,
      iconBg: 'bg-[#E0F2FE] text-[#0284C7]',
      pillStyle: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
      tabTarget: 'orders',
    },

    // ROW 2: 6 Cards
    {
      id: 'delivered-orders',
      label: 'Delivered Orders',
      value: metrics.deliveredOrders || 0,
      isCurrency: false,
      change: 'Completed',
      crystalType: 'emerald',
      icon: CheckCircle2,
      iconBg: 'bg-[#DCFCE7]/70 text-[#16A34A]',
      pillStyle: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
      tabTarget: 'orders',
    },
    {
      id: 'cancelled-orders',
      label: 'Cancelled Orders',
      value: metrics.cancelledOrders || 0,
      isCurrency: false,
      change: 'Voided',
      crystalType: 'rose',
      icon: XCircle,
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
      pillStyle: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
      tabTarget: 'orders',
    },
    {
      id: 'total-products',
      label: 'Total Products',
      value: metrics.totalProducts || 4,
      isCurrency: false,
      change: 'Masterworks',
      crystalType: 'citrine',
      icon: Package,
      iconBg: 'bg-[#FEF3C7]/60 text-[#D97706]',
      pillStyle: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      tabTarget: 'inventory',
    },
    {
      id: 'active-products',
      label: 'Active Products',
      value: metrics.activeProducts || 4,
      isCurrency: false,
      change: 'Published',
      crystalType: 'emerald',
      icon: PackageCheck,
      iconBg: 'bg-[#DCFCE7]/70 text-[#16A34A]',
      pillStyle: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
      tabTarget: 'inventory',
    },
    {
      id: 'low-stock',
      label: 'Low Stock Alert',
      value: metrics.lowStockCount || 0,
      isCurrency: false,
      change: '≤ 5 Units',
      crystalType: 'citrine',
      icon: AlertTriangle,
      iconBg: 'bg-[#FEF3C7]/60 text-[#D97706]',
      pillStyle: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      tabTarget: 'action-center',
    },
    {
      id: 'out-of-stock',
      label: 'Out of Stock',
      value: metrics.outOfStockCount || 0,
      isCurrency: false,
      change: '0 Inventory',
      crystalType: 'rose',
      icon: PackageX,
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
      pillStyle: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
      tabTarget: 'action-center',
    },
  ];

  // Card 13: Total Patrons (Row 3, Col 1)
  const patronCard = {
    id: 'total-customers',
    label: 'Total Patrons',
    value: metrics.totalCustomers || 16,
    isCurrency: false,
    change: 'Registered',
    crystalType: 'amethyst',
    icon: Users,
    iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
    pillStyle: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
    tabTarget: 'customers',
  };

  return (
    <section className="space-y-6 relative">
      {/* Background Subtle Crystal Clusters and Ethereal Aura in Top-Right */}
      <div className="absolute -top-10 right-0 sm:right-20 w-80 h-48 pointer-events-none opacity-30 select-none overflow-hidden">
        <svg viewBox="0 0 240 160" className="w-full h-full text-purple-300 fill-current opacity-70">
          <polygon points="120,160 145,40 170,70 155,160" opacity="0.6" />
          <polygon points="145,40 170,70 185,160 165,160" opacity="0.8" />
          <polygon points="90,160 115,70 135,95 125,160" opacity="0.5" />
          <polygon points="150,160 180,85 205,110 190,160" opacity="0.4" />
        </svg>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div>
          {/* Subtitle with Gold Line */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-semibold text-stone-500 tracking-[0.2em] uppercase">
              EXECUTIVE OVERVIEW
            </span>
            <div className="w-12 h-[1.5px] bg-gradient-to-r from-[#C8A65E] via-[#C8A65E]/70 to-transparent" />
          </div>

          {/* Luxury Serif Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold text-[#29242D] tracking-tight leading-tight">
            Real-Time Key Performance Indicators
          </h1>
        </div>

        {/* Status indicator on the right */}
        <div className="flex items-center gap-2 text-xs text-[#29242D]/60 self-start sm:self-auto pb-1">
          <span className="font-medium text-[#29242D]/80">Live Synced</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('analytics')}
            className="font-medium text-[#29242D] hover:text-[#79539B] flex items-center gap-1 transition-colors"
          >
            <span>13 Metrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 6-Column Grid for Rows 1 & 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => onNavigate && onNavigate(card.tabTarget)}
              className="group relative bg-white/85 backdrop-blur-md rounded-2xl border border-[#EAE2F2] hover:border-[#79539B]/40 shadow-[0_4px_20px_rgba(41,36,45,0.03)] hover:shadow-[0_10px_25px_rgba(121,83,155,0.08)] hover:-translate-y-1 transition-all duration-300 p-4 min-h-[148px] flex flex-col justify-between cursor-pointer overflow-hidden"
            >
              {/* Card Top: Icon & Trend Pill */}
              <div className="flex items-center justify-between gap-1.5 relative z-10">
                <div className={`p-2 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${card.pillStyle} flex items-center gap-0.5 tracking-tight whitespace-nowrap shadow-xs`}
                >
                  {card.change}
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-80" />
                </span>
              </div>

              {/* Card Center: Label & Big Metric Value */}
              <div className="mt-3 relative z-10">
                <div className="text-[11px] font-medium text-[#29242D]/60 truncate">
                  {card.label}
                </div>
                <div className="text-xl sm:text-[22px] font-sans font-bold tabular-nums text-[#29242D] tracking-tight mt-0.5">
                  <AnimatedCounter value={card.value} isCurrency={card.isCurrency} />
                </div>
              </div>

              {/* Card Bottom: View Details Link */}
              <div className="mt-2 pt-2 border-t border-[#EAE2F2]/60 flex items-center gap-1 text-[10px] font-medium text-[#29242D]/50 group-hover:text-[#79539B] transition-colors relative z-10">
                <span>View Details</span>
                <span className="transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>

              {/* Translucent Gemstone Artwork in bottom right corner */}
              <CardCornerCrystal type={card.crystalType} />
            </div>
          );
        })}
      </div>

      {/* Row 3: Card 13 (Total Patrons) on the left + Pedestal Showcase on the right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10 items-end">
        {/* Card 13: Total Patrons */}
        <div
          onClick={() => onNavigate && onNavigate(patronCard.tabTarget)}
          className="group relative bg-white/85 backdrop-blur-md rounded-2xl border border-[#EAE2F2] hover:border-[#79539B]/40 shadow-[0_4px_20px_rgba(41,36,45,0.03)] hover:shadow-[0_10px_25px_rgba(121,83,155,0.08)] hover:-translate-y-1 transition-all duration-300 p-4 min-h-[148px] flex flex-col justify-between cursor-pointer overflow-hidden col-span-1"
        >
          {/* Top: Icon & Trend Pill */}
          <div className="flex items-center justify-between gap-1.5 relative z-10">
            <div className={`p-2 rounded-xl ${patronCard.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${patronCard.pillStyle} flex items-center gap-0.5 tracking-tight whitespace-nowrap shadow-xs`}
            >
              {patronCard.change}
              <ArrowUpRight className="w-2.5 h-2.5 opacity-80" />
            </span>
          </div>

          {/* Center: Label & Big Metric Value */}
          <div className="mt-3 relative z-10">
            <div className="text-[11px] font-medium text-[#29242D]/60 truncate">
              {patronCard.label}
            </div>
            <div className="text-xl sm:text-[22px] font-sans font-bold tabular-nums text-[#29242D] tracking-tight mt-0.5">
              <AnimatedCounter value={patronCard.value} isCurrency={false} />
            </div>
          </div>

          {/* Bottom: View Details Link */}
          <div className="mt-2 pt-2 border-t border-[#EAE2F2]/60 flex items-center gap-1 text-[10px] font-medium text-[#29242D]/50 group-hover:text-[#79539B] transition-colors relative z-10">
            <span>View Details</span>
            <span className="transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>

          {/* Corner Gemstone */}
          <CardCornerCrystal type={patronCard.crystalType} />
        </div>

        {/* Showcase Area: 3D Marble Pedestal with Glowing Purple Amethyst Cluster */}
        <div className="hidden lg:flex lg:col-span-5 items-end justify-end pr-8 overflow-visible relative">
          {/* Gentle background ribbon curve */}
          <div className="absolute bottom-6 right-20 w-[480px] h-[70px] pointer-events-none opacity-40">
            <svg viewBox="0 0 480 70" fill="none" className="w-full h-full">
              <path
                d="M10 50 C120 10 240 65 470 15"
                stroke="url(#ribbonGold)"
                strokeWidth="1.5"
                fill="none"
              />
              <defs>
                <linearGradient id="ribbonGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C8A65E" stopOpacity="0" />
                  <stop offset="40%" stopColor="#C8A65E" stopOpacity="0.6" />
                  <stop offset="80%" stopColor="#E5CB90" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C8A65E" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 3D Pedestal Showcase */}
          <MarblePedestalShowcase className="w-96 -mb-4" />
        </div>
      </div>
    </section>
  );
}
