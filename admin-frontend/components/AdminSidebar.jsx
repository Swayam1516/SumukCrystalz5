'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  Megaphone,
  Sparkles,
  Truck,
  SlidersHorizontal,
  Settings,
  X,
  Crown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  Flame,
  ShieldCheck,
  Bot,
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
  metrics = {},
  onLogout,
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
      section: 'CORE',
    },
    {
      id: 'analytics',
      label: 'Real-Time Analytics',
      icon: TrendingUp,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      section: 'CORE',
    },
    {
      id: 'action-center',
      label: 'Action Center',
      icon: AlertTriangle,
      badge: (metrics.pendingOrders || 0) + (metrics.lowStockCount || 0) + (metrics.outOfStockCount || 0) || null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      section: 'CORE',
    },
    {
      id: 'inventory',
      label: 'Crystal Catalog & Variants',
      icon: Package,
      badge: metrics.totalProducts || null,
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30',
      section: 'MANAGEMENT',
    },
    {
      id: 'orders',
      label: 'Orders Sanctuary',
      icon: ShoppingBag,
      badge: metrics.pendingOrders ? `${metrics.pendingOrders} new` : null,
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      section: 'MANAGEMENT',
    },
    {
      id: 'customers',
      label: 'Patrons & Collectors',
      icon: Users,
      badge: metrics.totalCustomers || null,
      badgeColor: 'bg-stone-800 text-stone-300 border-stone-700',
      section: 'MANAGEMENT',
    },
    {
      id: 'services',
      label: 'Modalities & Services',
      icon: Sparkles,
      badge: '9 Modalities',
      badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-800/40',
      section: 'SANCTUARY',
    },
    {
      id: 'broadcast',
      label: 'Broadcast Announcement',
      icon: Megaphone,
      badge: null,
      section: 'SANCTUARY',
    },
    {
      id: 'shipping',
      label: 'Shipping & Distance Logistics',
      icon: Truck,
      badge: 'Pune Hub',
      badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
      section: 'SANCTUARY',
    },
    {
      id: 'filters',
      label: 'Dynamic Filter Matrix',
      icon: SlidersHorizontal,
      badge: null,
      section: 'SANCTUARY',
    },
    {
      id: 'chatbot',
      label: 'AI Assistant & FAQs',
      icon: Bot,
      badge: 'AI Active',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      section: 'SANCTUARY',
    },
    {
      id: 'settings',
      label: 'Vault Settings & Security',
      icon: Settings,
      badge: null,
      section: 'SYSTEM',
    },
  ];

  // Group items by section
  const sections = ['CORE', 'MANAGEMENT', 'SANCTUARY', 'SYSTEM'];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#100E0C]/95 backdrop-blur-2xl border-r border-[#D4AF37]/20 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Top Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#D4AF37]/15 bg-gradient-to-r from-stone-950 via-[#14110E] to-stone-950">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#C59B27] to-[#B8860B] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/25 flex-shrink-0 relative group">
              <Crown className="w-5 h-5" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate animate-in fade-in duration-200">
                <span className="font-serif font-bold text-sm text-[#F3E5AB] tracking-wide flex items-center gap-1.5">
                  Sumuk Crystalz 5
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Founder Sanctum
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-[#D4AF37] border border-stone-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
          {sections.map((sectionName) => {
            const items = navItems.filter((item) => item.section === sectionName);
            if (items.length === 0) return null;

            return (
              <div key={sectionName} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                    {sectionName}
                  </div>
                )}

                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent text-[#F3E5AB] border-l-4 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5 font-semibold'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/60'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:text-stone-200'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                            item.badgeColor || 'bg-stone-800 text-stone-300 border-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Active Indicator Glow */}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-l-full shadow-md shadow-[#D4AF37]" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Founder Profile Card */}
        <div className="p-3 border-t border-[#D4AF37]/15 bg-stone-950/80">
          <div
            className={`p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-2 ${
              isCollapsed ? 'flex-col justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9333EA] to-[#D4AF37] p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#100E0C] rounded-[10px] flex items-center justify-center text-[#F3E5AB] font-serif font-bold text-xs">
                  SN
                </div>
              </div>

              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-stone-200 truncate">Soumyaa Naveen</div>
                  <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Master Admin
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 border border-stone-700/60 hover:border-rose-800/60 transition-colors"
              title="Sign Out of Founder Vault"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
