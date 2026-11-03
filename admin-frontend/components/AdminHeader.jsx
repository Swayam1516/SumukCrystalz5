'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Plus,
  RefreshCw,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  ShoppingBag,
  Package,
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
      <header className="sticky top-0 z-30 h-20 bg-[#F8F6F2]/90 backdrop-blur-xl border-b border-[#EAE2F2] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all shadow-[0_2px_12px_rgba(41,36,45,0.03)]">
        {/* Left: Mobile Menu & Live Sanctum Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white border border-[#EAE2F2] text-[#29242D]/70 hover:text-[#29242D] transition-colors shadow-xs"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Supabase Synchronized Pill Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-sans font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Supabase Synchronized</span>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-[#29242D]/40 group-hover:text-[#79539B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crystal specimens, SKUs, patrons, orders... (⌘K)"
              className="w-full bg-white hover:bg-white border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-10 pr-12 py-2 text-xs text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#29242D]/40 hover:text-[#29242D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-sans text-[#29242D]/40 bg-[#F8F6F2] px-1.5 py-0.5 rounded border border-[#EAE2F2] pointer-events-none font-medium">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Action, Refresh, Notifications, Storefront Link */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={onRefreshData}
            disabled={loadingData}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE2F2] hover:border-[#79539B]/40 text-[#29242D]/70 hover:text-[#29242D] transition-all disabled:opacity-50 flex items-center justify-center shadow-xs"
            title="Refresh Real-Time Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-[#79539B]' : ''}`} />
          </button>

          {/* Notifications Button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE2F2] hover:border-[#79539B]/40 text-[#29242D]/70 hover:text-[#29242D] transition-all flex items-center justify-center shadow-xs relative"
              title="Action Center Alerts"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  {totalAlerts > 9 ? '9+' : totalAlerts}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#EAE2F2] rounded-2xl shadow-xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-[#EAE2F2]/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8A65E]" />
                    <span className="text-xs font-serif font-bold text-[#29242D]">Action Center Alerts</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {totalAlerts} Pending
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#EAE2F2]">
                  {metrics.pendingOrders > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab('orders');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-[#EAE2F2]/40 border border-[#EAE2F2] hover:border-[#79539B]/50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#79539B]">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#79539B]" /> {metrics.pendingOrders} Orders Awaiting Action
                        </span>
                        <span className="text-[9px] font-bold bg-[#EAE2F2] text-[#79539B] px-1.5 py-0.2 rounded">
                          PENDING
                        </span>
                      </div>
                      <p className="text-[11px] text-[#29242D]/70">
                        Patron orders waiting for packaging and fulfillment.
                      </p>
                    </div>
                  )}

                  {metrics.lowStockCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab('inventory');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 hover:border-amber-400 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-600" /> {metrics.lowStockCount} Specimens Low in Stock
                        </span>
                        <span className="text-[9px] font-bold bg-amber-200/70 text-amber-800 px-1.5 py-0.2 rounded">
                          LOW STOCK
                        </span>
                      </div>
                      <p className="text-[11px] text-[#29242D]/70">
                        Inventory has reached 5 or fewer specimens in vault.
                      </p>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="py-6 text-center text-[#29242D]/60 text-xs space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                      <div>All systems balanced. No urgent items!</div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#EAE2F2]/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('action-center');
                      setShowNotifications(false);
                    }}
                    className="w-full py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#EAE2F2]/60 text-[#79539B] text-xs font-semibold text-center transition-colors block"
                  >
                    Open Action Center
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Create Specimen Button (Purple Gradient Pill) */}
          <button
            type="button"
            onClick={onOpenCreateProduct}
            className="px-4 py-2 bg-gradient-to-r from-[#79539B] to-[#684587] hover:brightness-105 text-white font-semibold text-xs tracking-wider uppercase rounded-full shadow-md shadow-[#79539B]/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CREATE SPECIMEN</span>
          </button>

          {/* Storefront Link Button */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-full bg-white hover:bg-[#F8F6F2] text-[#29242D] hover:text-[#79539B] border border-[#EAE2F2] text-xs font-medium transition-colors shadow-xs"
            title="Open Live Customer Sanctuary"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3 text-[#29242D]/40" />
          </a>
        </div>
      </header>
    </>
  );
}
