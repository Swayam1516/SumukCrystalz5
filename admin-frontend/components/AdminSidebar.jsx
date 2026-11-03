'use client';

import React from 'react';
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Bell,
  Megaphone,
  Sparkles,
  Truck,
  Calendar,
  SlidersHorizontal,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { LotusLogo } from './CrystalArtwork';

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
      icon: LayoutGrid,
      badge: null,
      section: 'CORE',
    },
    {
      id: 'analytics',
      label: 'Real-Time Analytics',
      icon: TrendingUp,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      section: 'CORE',
    },
    {
      id: 'action-center',
      label: 'Action Center',
      icon: Bell,
      badge: (metrics.pendingOrders || 0) + (metrics.lowStockCount || 0) + (metrics.outOfStockCount || 0) || '9',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      section: 'CORE',
    },
    {
      id: 'inventory',
      label: 'Crystal Catalog & Variants',
      icon: Package,
      badge: metrics.totalProducts || '4',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      section: 'MANAGEMENT',
    },
    {
      id: 'orders',
      label: 'Orders Sanctuary',
      icon: ShoppingBag,
      badge: metrics.pendingOrders ? `${metrics.pendingOrders} new` : '9 new',
      badgeColor: 'bg-[#EAE2F2] text-[#79539B] border-[#D8CBE4]',
      section: 'MANAGEMENT',
    },
    {
      id: 'customers',
      label: 'Patrons & Collectors',
      icon: Users,
      badge: metrics.totalCustomers || '16',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      section: 'MANAGEMENT',
    },
    {
      id: 'services',
      label: 'Modalities & Services',
      icon: Sparkles,
      badge: '9',
      badgeColor: 'bg-[#EAE2F2] text-[#79539B] border-[#D8CBE4]',
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
      label: 'Shipping & Distance',
      icon: Truck,
      badge: 'Pune Hub',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      section: 'SANCTUARY',
    },
    {
      id: 'occasion-banners',
      label: 'Occasion & Festivals',
      icon: Calendar,
      badge: 'Diwali Active',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
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
      badge: 'Active',
      badgeColor: 'bg-[#EAE2F2] text-[#79539B] border-[#D8CBE4]',
      section: 'SANCTUARY',
    },
    {
      id: 'settings',
      label: 'Vault Settings',
      icon: Settings,
      badge: null,
      section: 'SYSTEM',
    },
  ];

  // Distinct sections matching design
  const sections = ['CORE', 'MANAGEMENT', 'SANCTUARY'];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#29242D]/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#F8F6F2]/95 backdrop-blur-2xl border-r border-[#EAE2F2] flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(41,36,45,0.02)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#EAE2F2] bg-white/40">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Golden Lotus Icon */}
            <div className="flex-shrink-0">
              <LotusLogo className="w-8 h-8" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif font-bold text-xs text-[#29242D] tracking-wider uppercase">
                  SUMUK CRYSTALZ 5
                </span>
                <span className="text-[9px] font-sans font-semibold text-[#5C5562] uppercase tracking-[0.22em]">
                  FOUNDER SANCTUM
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-full bg-white border border-[#EAE2F2] hover:border-[#D8CBE4] text-[#5C5562] hover:text-[#29242D] items-center justify-center transition-all shadow-xs cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl bg-white border border-[#EAE2F2] text-[#5C5562] hover:text-[#29242D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-stone-200">
          {sections.map((sectionName) => {
            const items = navItems.filter((item) => item.section === sectionName);
            if (items.length === 0) return null;

            return (
              <div key={sectionName} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 pb-1.5 text-[10px] font-sans uppercase tracking-[0.16em] text-[#5C5562] font-bold">
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
                      className={`w-full group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#79539B] text-white shadow-sm shadow-[#79539B]/25 font-semibold'
                          : 'text-[#29242D]/80 hover:text-[#79539B] hover:bg-[#EAE2F2]/60'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                          isActive ? 'text-white' : 'text-[#79539B] group-hover:scale-110'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor || 'bg-[#EAE2F2] text-[#79539B] border-[#D8CBE4]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Profile Card */}
        <div className="p-3 border-t border-[#EAE2F2] bg-white/40">
          <div
            className={`p-2.5 rounded-2xl bg-white/90 border border-[#EAE2F2] shadow-xs flex items-center justify-between gap-2.5 ${
              isCollapsed ? 'flex-col justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Lavender Avatar SN */}
              <div className="w-9 h-9 rounded-full bg-[#EAE2F2] text-[#79539B] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#D8CBE4] shadow-xs">
                SN
              </div>

              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-[#29242D] truncate">
                    Soumyaa Naveen
                  </div>
                  <div className="text-[10px] font-sans text-[#C8A65E] flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-[#C8A65E]" />
                    Master Admin
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#5C5562] hover:text-rose-600 border border-[#EAE2F2] hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign Out of Founder Vault"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
