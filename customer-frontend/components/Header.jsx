'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import { useAuthStore } from '../store/useAuth';
import AuthModal from './AuthModal';
import {
  ShoppingCart,
  Menu,
  X,
  Crown,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Layers,
  Zap,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { TOP_NAV_SHOP_MENU } from '../lib/discoveryTaxonomy';

function FacetedCrystalLogo({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top crystal pyramid */}
      <polygon points="16,2 6,9 16,13 26,9" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Middle vertical edges */}
      <line x1="6" y1="9" x2="6" y2="23" stroke="white" strokeWidth="1.5" />
      <line x1="16" y1="13" x2="16" y2="29" stroke="white" strokeWidth="1.5" />
      <line x1="26" y1="9" x2="26" y2="23" stroke="white" strokeWidth="1.5" />
      {/* Bottom pyramid */}
      <polyline points="6,23 16,29 26,23" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Internal facet diagonals */}
      <line x1="6" y1="9" x2="16" y2="2" stroke="white" strokeWidth="1.5" />
      <line x1="26" y1="9" x2="16" y2="2" stroke="white" strokeWidth="1.5" />
      <polyline points="6,23 16,13 26,23" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleStar({ className = 'w-4 h-4 text-amber-300' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { openDrawer, getTotalCount } = useCartStore();
  const { user, isAdmin, openAuthModal, logout, initAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const shopDropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Click outside to close user and shop dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = mounted ? getTotalCount() : 0;
  const currentUser = mounted ? user : null;
  const isCurrentAdmin = mounted ? isAdmin : false;

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  // On /shop, yield to the dedicated storefront header matching the mobile/app layout
  if (pathname === '/shop') {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0A070D] border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between relative">
          {/* LEFT: Faceted Wireframe Crystal Logo + Brand Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 whitespace-nowrap">
              <FacetedCrystalLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="font-sans text-xs sm:text-sm md:text-base font-bold tracking-[0.18em] text-white group-hover:text-stone-200 transition-colors uppercase whitespace-nowrap">
                SUMUK CRYSTALZ 5
              </span>
            </Link>
          </div>

          {/* CENTER / NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-[11px] lg:text-xs font-mono uppercase tracking-[0.16em]">
            {/* SHOP / STORE MEGAMENU DROPDOWN */}
            <div
              className="relative flex items-center"
              ref={shopDropdownRef}
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/shop"
                onClick={() => setShopDropdownOpen(false)}
                className="text-stone-300 font-bold hover:text-white transition-all duration-200 py-2.5 px-2 flex items-center gap-1.5 cursor-pointer"
              >
                <span>SHOP</span>
              </Link>
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer outline-none"
                aria-label="Toggle Shop Category Menu"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[520px] max-w-[92vw] z-50 animate-fade-in text-left pointer-events-auto">
                  <div className="p-4 bg-[#140E1B] border border-stone-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white">
                    {/* Top Bar with All Store Link */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-sans text-xs font-bold text-white tracking-wider uppercase">
                          6-Pillar Discovery Vault
                        </span>
                      </div>
                      <Link
                        href="/shop"
                        onClick={() => setShopDropdownOpen(false)}
                        className="text-[11px] text-[#E5C378] hover:text-white font-mono font-bold flex items-center gap-1 transition"
                      >
                        <span>Explore All Products</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* 2-Column Discovery Taxonomy Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {TOP_NAV_SHOP_MENU.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShopDropdownOpen(false)}
                          className="p-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition group block"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white group-hover:text-[#E5C378] transition">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-stone-400 group-hover:text-white">&rarr;</span>
                          </div>
                          <p className="text-[10px] text-stone-400 group-hover:text-stone-300 truncate mt-0.5 font-sans">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/services"
              className="text-stone-300 hover:text-white font-medium transition-all duration-200"
            >
              SERVICES
            </Link>

            <Link
              href="/about"
              className="text-stone-300 hover:text-white font-medium transition-all duration-200"
            >
              FOUNDER STORY
            </Link>

            {/* Auth / Account Profile or Sign In */}
            {currentUser ? (
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-stone-700 text-white transition-all flex items-center gap-2 font-bold shadow-sm cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  title="Patron Profile & Orders"
                >
                  {isCurrentAdmin ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-stone-300" />
                  )}
                  <span className="max-w-[110px] truncate">{currentUser.name?.split(' ')[0] || 'Patron'}</span>
                  <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 py-2 bg-[#140E1B] border border-stone-800 rounded-2xl shadow-2xl z-50 text-xs font-mono space-y-1 backdrop-blur-2xl animate-fade-in text-white">
                    <div className="px-4 py-2.5 border-b border-stone-800 font-sans">
                      <p className="font-bold text-white truncate">{currentUser.name || 'Sacred Patron'}</p>
                      <p className="text-[10px] text-stone-400 truncate font-mono">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 hover:bg-white/[0.06] flex items-center gap-2.5 text-stone-200 transition"
                    >
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>My Account &amp; Orders</span>
                    </Link>

                    {isCurrentAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 hover:bg-white/[0.06] flex items-center gap-2.5 text-[#E5C378] font-bold transition"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 bg-red-950/40 hover:bg-red-900/40 flex items-center gap-2.5 text-red-300 font-bold transition"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </nav>

          {/* RIGHT: Sign In + Sign Up + Cart + Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {!currentUser && (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Sign In Outline Pill */}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-600/80 bg-transparent hover:bg-white/[0.08] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-stone-300" />
                  <span>Sign In</span>
                </button>

                {/* Sign Up Solid White Pill */}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Cart Button with Counter */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 text-white hover:text-stone-300 transition cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-white stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-stone-800 border border-stone-600 text-[10px] font-mono font-bold text-white flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Vertical Divider & Menu Icon matching screenshot */}
            <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

            {/* Menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-white hover:text-stone-300 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white stroke-[1.8]" />}
            </button>
          </div>
        </div>

        {/* Navigation Slide Drawer */}
        {mobileMenuOpen && (
          <div className="mt-2 max-w-7xl mx-auto rounded-2xl px-6 pt-5 pb-6 bg-[#0E0A14]/95 backdrop-blur-2xl border border-white/10 space-y-3 animate-fade-in shadow-2xl text-white">
            {isCurrentAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2 bg-amber-500/20 px-3 rounded-lg border border-amber-500/30"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Founder Admin Dashboard</span>
              </Link>
            )}

            {/* Mobile SHOP Discovery Section */}
            <div className="rounded-xl bg-white/[0.04] border border-amber-500/25 overflow-hidden">
              <div className="flex items-center justify-between py-1 px-3">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs font-mono uppercase tracking-wider text-[#e8c97c] font-bold flex-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>SHOP ALL CRYSTALS</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="p-2 text-amber-400"
                  aria-label="Toggle Category Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileShopOpen && (
                <div className="p-2 pt-0 grid grid-cols-2 gap-1.5 border-t border-white/5">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-bold font-mono text-center block"
                  >
                    View All Consecrated Crystals
                  </Link>
                  {TOP_NAV_SHOP_MENU.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/10 text-[11px] font-mono text-neutral-300 hover:text-[#e8c97c] block truncate"
                    >
                      &bull; {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-mono uppercase tracking-wider text-white/90 hover:text-[#e8c97c]"
            >
              SERVICES BY SUMUK CRYSTALZ 5
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-mono uppercase tracking-wider text-white/90 hover:text-[#e8c97c]"
            >
              FOUNDER STORY
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>MY ACCOUNT &amp; ORDERS</span>
            </Link>

            <div className="pt-3 border-t border-white/10 space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        {isCurrentAdmin ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <User className="w-3.5 h-3.5 text-[#e8c97c]" />}
                        {currentUser.name || 'Patron'}
                      </span>
                      <p className="text-[10px] text-neutral-400 font-mono">{currentUser.email}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {isCurrentAdmin ? 'Admin' : 'Patron'}
                    </span>
                  </div>

                  {/* Prominent Full-Width Mobile Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-bold text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out of Sanctuary</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="w-full py-2 px-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] tracking-wider uppercase font-mono text-center flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>+ Sign Up</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full py-2 px-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-[11px] tracking-wider uppercase font-mono text-center"
                    >
                      Switch User
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs tracking-wider uppercase font-mono"
                  >
                    SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs tracking-wider uppercase font-mono shadow-lg flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>SIGN UP</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
