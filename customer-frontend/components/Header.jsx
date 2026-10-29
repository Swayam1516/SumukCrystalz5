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

function GoldenCrystalLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 sm:w-9 sm:h-9 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)] select-none"
      >
        <defs>
          <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3b8" />
            <stop offset="45%" stopColor="#dfaf37" />
            <stop offset="100%" stopColor="#875e11" />
          </linearGradient>
          <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde892" />
            <stop offset="55%" stopColor="#c5992a" />
            <stop offset="100%" stopColor="#5e410b" />
          </linearGradient>
          <linearGradient id="goldGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>

        {/* Left crystal point */}
        <polygon points="12,17 6,24 9,35 15,35 15,22" fill="url(#goldGrad2)" opacity="0.9" />
        <polygon points="12,17 15,22 15,35 12,35" fill="url(#goldGrad1)" opacity="0.8" />

        {/* Right crystal point */}
        <polygon points="28,17 34,24 31,35 25,35 25,22" fill="url(#goldGrad2)" opacity="0.9" />
        <polygon points="28,17 25,22 25,35 28,35" fill="url(#goldGrad1)" opacity="0.8" />

        {/* Center main crystal tower */}
        <polygon points="20,3 13,12 14,36 26,36 27,12" fill="url(#goldGrad1)" />
        <polygon points="20,3 20,36 26,36 27,12" fill="url(#goldGrad3)" opacity="0.55" />
        <polygon points="20,3 13,12 20,15" fill="#fff9e0" opacity="0.85" />
        <polygon points="20,3 27,12 20,15" fill="url(#goldGrad2)" opacity="0.9" />
        <polygon points="20,15 13,12 14,36 20,36" fill="url(#goldGrad2)" opacity="0.95" />

        {/* Small base crystal accents */}
        <polygon points="8,27 4,34 10,35" fill="url(#goldGrad1)" opacity="0.75" />
        <polygon points="32,27 36,34 30,35" fill="url(#goldGrad1)" opacity="0.75" />

        {/* Facet Edge Highlights */}
        <line x1="20" y1="3" x2="20" y2="36" stroke="#fff9e0" strokeWidth="0.75" opacity="0.7" />
        <line x1="20" y1="3" x2="13" y2="12" stroke="#fff9e0" strokeWidth="0.75" opacity="0.75" />
        <line x1="20" y1="3" x2="27" y2="12" stroke="#fff9e0" strokeWidth="0.75" opacity="0.75" />
      </svg>
    </div>
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
      <header className="sticky top-0 z-50 w-full transition-all duration-300 px-3 sm:px-6 pt-3 pb-2">
        {/* Subtle Ambient Twinkling Stars in Background */}
        <div className="absolute top-2 left-1/4 pointer-events-none opacity-40 animate-pulse">
          <SparkleStar className="w-3 h-3 text-amber-300" />
        </div>
        <div className="absolute top-8 right-1/4 pointer-events-none opacity-40 animate-pulse delay-500">
          <SparkleStar className="w-2.5 h-2.5 text-amber-200" />
        </div>

        {/* Translucent Floating Glass Header Bar (Light Luxury Theme Matching Image 2 & 4) */}
        <div className="max-w-7xl mx-auto rounded-2xl bg-white/92 backdrop-blur-xl border border-amber-300/40 shadow-[0_4px_24px_rgba(180,130,40,0.08)] px-3 sm:px-7 h-16 sm:h-20 flex items-center justify-between relative">
          {/* Subtle Golden Glow Line at top/bottom border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none rounded-t-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none rounded-b-2xl" />

          {/* LEFT: Crystal Logo + Brand Name + Sparkle Divider */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 whitespace-nowrap">
              <GoldenCrystalLogo />
              <span className="font-serif text-xs sm:text-sm md:text-base font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#8C6208] group-hover:text-amber-900 transition-colors uppercase whitespace-nowrap">
                SUMUK CRYSTALZ 5
              </span>
            </Link>
            <SparkleStar className="w-3.5 h-3.5 text-amber-500/80 hidden sm:block ml-0.5 flex-shrink-0" />
          </div>

          {/* CENTER / NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-3.5 lg:gap-5 xl:gap-6 text-[11px] lg:text-xs font-mono uppercase tracking-[0.14em]">
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
                className="text-[#8C6208] font-bold hover:text-amber-900 transition-all duration-200 py-2.5 px-2 flex items-center gap-1.5 cursor-pointer rounded-lg hover:bg-amber-50/60"
              >
                <span>SHOP</span>
              </Link>
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="p-1.5 text-amber-600 hover:text-amber-800 cursor-pointer outline-none rounded-md hover:bg-amber-50/60"
                aria-label="Toggle Shop Category Menu"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[520px] max-w-[92vw] z-50 animate-fade-in text-left pointer-events-auto">
                  <div className="p-4 bg-white/98 border border-amber-300/50 rounded-2xl shadow-[0_20px_50px_rgba(180,130,40,0.15)] backdrop-blur-2xl">
                    {/* Top Bar with All Store Link */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="font-serif text-xs font-bold text-amber-900 tracking-wider uppercase">
                          6-Pillar Discovery Vault
                        </span>
                      </div>
                      <Link
                        href="/shop"
                        onClick={() => setShopDropdownOpen(false)}
                        className="text-[11px] text-amber-700 hover:text-amber-900 font-mono font-bold flex items-center gap-1 transition"
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
                          className="p-2.5 rounded-xl hover:bg-amber-50/80 border border-transparent hover:border-amber-300/40 transition group block"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-800 group-hover:text-amber-800 transition">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-amber-600 group-hover:text-amber-800">&rarr;</span>
                          </div>
                          <p className="text-[10px] text-stone-500 group-hover:text-stone-700 truncate mt-0.5 font-sans">
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
              className="text-stone-700 hover:text-[#8C6208] font-bold transition-all duration-200"
            >
              SERVICES
            </Link>

            <Link
              href="/about"
              className="text-stone-700 hover:text-[#8C6208] font-bold transition-all duration-200"
            >
              FOUNDER STORY
            </Link>

            {/* Auth / Account Profile or Sign In */}
            {currentUser ? (
              <div className="relative flex items-center" ref={dropdownRef}>
                {/* User Profile Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-amber-500/35 text-white hover:text-[#e8c97c] transition-all flex items-center gap-2 font-bold shadow-sm cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  title="Patron Profile & Orders"
                >
                  {isCurrentAdmin ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#e8c97c]" />
                  )}
                  <span className="max-w-[110px] truncate">{currentUser.name?.split(' ')[0] || 'Patron'}</span>
                  <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 py-2 bg-white border border-amber-300/50 rounded-2xl shadow-2xl z-50 text-xs font-mono space-y-1 backdrop-blur-2xl animate-fade-in text-stone-800">
                    <div className="px-4 py-2.5 border-b border-stone-100 font-sans">
                      <p className="font-bold text-stone-900 truncate">{currentUser.name || 'Sacred Patron'}</p>
                      <p className="text-[10px] text-stone-500 truncate font-mono">{currentUser.email}</p>
                      <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-bold ${
                        isCurrentAdmin
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-purple-100 text-purple-900 border border-purple-300'
                      }`}>
                        {isCurrentAdmin ? '👑 Founder Admin' : '✨ Crystal Patron'}
                      </span>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-stone-800 transition"
                    >
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>My Account &amp; Orders</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-amber-800 font-bold transition"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Control Center</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuthModal('register');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-amber-700 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Create New Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-stone-600 transition"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>Switch Account</span>
                    </button>

                    <div className="border-t border-stone-100 my-1.5" />

                    {/* Prominent Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 bg-red-50 hover:bg-red-100 flex items-center gap-2.5 text-red-700 font-bold transition rounded-lg mx-auto"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 transition-all duration-200 text-xs font-semibold tracking-wider shadow-xs"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs tracking-wider shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {isCurrentAdmin && (
              <Link
                href="/admin"
                className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200 font-bold transition-all text-[10px] flex items-center gap-1 shadow-xs"
              >
                <Crown className="w-3 h-3 text-amber-700" />
                <span>ADMIN</span>
              </Link>
            )}
          </nav>

          {/* RIGHT: Golden Shopping Cart + Twinkles + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Auth Buttons matching Image 4 */}
            {!currentUser && (
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 py-1 rounded-full border border-stone-300 bg-white text-stone-800 text-[11px] font-semibold"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 text-stone-800 hover:text-amber-800 transition-all group flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 stroke-[1.9] group-hover:scale-105 transition-transform text-stone-800" />
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#D4AF37] text-stone-950 font-extrabold text-[10px] flex items-center justify-center shadow-md border-2 border-white">
                {cartCount}
              </span>
            </button>

            {/* Subtle Right Sparkle */}
            <div className="hidden sm:block pointer-events-none opacity-60">
              <SparkleStar className="w-3 h-3 text-amber-500" />
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl px-6 pt-4 pb-6 bg-white/98 backdrop-blur-2xl border border-amber-300/40 space-y-3 animate-fade-in shadow-2xl text-stone-900">
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
