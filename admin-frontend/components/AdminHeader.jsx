'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Plus,
  RefreshCw,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ShoppingBag,
  Package,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';

export default function AdminHeader({
  setSidebarOpen,
  onOpenCreateProduct,
  onRefreshData,
  loadingData,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  metrics = {},
  products = [],
  orders = [],
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalAlerts = (metrics.pendingOrders || 0) + (metrics.lowStockCount || 0) + (metrics.outOfStockCount || 0);

  return (
    <>
      <header className="sticky top-0 z-30 h-20 bg-[#100E0C]/90 backdrop-blur-2xl border-b border-[#D4AF37]/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all shadow-md">
        {/* Left: Mobile Menu & Live Sanctum Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-[#D4AF37]/50 transition-colors"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Supabase Synchronized</span>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-stone-500 group-hover:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crystal specimens, SKUs, patrons, orders... (Ctrl + K)"
              className="w-full bg-stone-900/90 hover:bg-stone-900 border border-stone-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-12 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700 pointer-events-none">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Action, Refresh, Notifications, Storefront Link */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={onRefreshData}
            disabled={loadingData}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#D4AF37]/50 text-stone-300 hover:text-[#D4AF37] transition-all disabled:opacity-50"
            title="Refresh Real-Time Database"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>

          {/* Notifications / Action Center Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl border transition-all relative ${
                totalAlerts > 0
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
              }`}
              title="Action Center Alerts"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#100E0C] animate-pulse">
                  {totalAlerts > 9 ? '9+' : totalAlerts}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#141210] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-serif font-bold text-[#F3E5AB]">Action Center Alerts</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {totalAlerts} Pending
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-stone-800">
                  {metrics.pendingOrders > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab('orders');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-purple-600/60 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" /> {metrics.pendingOrders} Orders Awaiting Processing
                        </span>
                        <span className="text-[9px] font-mono bg-purple-900/60 px-1.5 py-0.2 rounded text-purple-200">
                          URGENT
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Patrons placed orders waiting for packing, dispatch, or confirmation.
                      </p>
                    </div>
                  )}

                  {metrics.lowStockCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab('inventory');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 hover:border-amber-600/60 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" /> {metrics.lowStockCount} Specimens Low in Stock
                        </span>
                        <span className="text-[9px] font-mono bg-amber-900/60 px-1.5 py-0.2 rounded text-amber-200">
                          RESTOCK
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Inventory has dropped below threshold (&le; 5 units).
                      </p>
                    </div>
                  )}

                  {metrics.outOfStockCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab('inventory');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 hover:border-rose-600/60 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> {metrics.outOfStockCount} Specimens Out of Stock
                        </span>
                        <span className="text-[9px] font-mono bg-rose-900/60 px-1.5 py-0.2 rounded text-rose-200">
                          SOLD OUT
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Specimens currently have 0 stock in vault.
                      </p>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="py-6 text-center text-stone-400 text-xs space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto opacity-70" />
                      <div>All systems balanced. No urgent alerts!</div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('action-center');
                      setShowNotifications(false);
                    }}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#D4AF37] text-xs font-semibold text-center transition-colors block"
                  >
                    Open Full Action Center
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Create Specimen Button */}
          <button
            type="button"
            onClick={onOpenCreateProduct}
            className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Create Specimen</span>
          </button>

          {/* View Customer Storefront External Link */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-colors"
            title="Open Live Customer Sanctuary"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </a>
        </div>
      </header>
    </>
  );
}
