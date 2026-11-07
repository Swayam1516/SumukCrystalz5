'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Package,
  Truck,
  Heart,
} from 'lucide-react';
import { TOP_NAV_SHOP_MENU } from '../lib/discoveryTaxonomy';
import ShopMegaMenu from './ShopMegaMenu';

function FacetedCrystalLogo({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DEC69B" />
          <stop offset="50%" stopColor="#C8A65E" />
          <stop offset="100%" stopColor="#947434" />
        </linearGradient>
      </defs>
      {/* Top crystal pyramid */}
      <polygon points="16,2 6,9 16,13 26,9" stroke="url(#headerGoldGrad)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Middle vertical edges */}
      <line x1="6" y1="9" x2="6" y2="23" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
      <line x1="16" y1="13" x2="16" y2="29" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
      <line x1="26" y1="9" x2="26" y2="23" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
      {/* Bottom pyramid */}
      <polyline points="6,23 16,29 26,23" stroke="url(#headerGoldGrad)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Internal facet diagonals */}
      <line x1="6" y1="9" x2="16" y2="2" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
      <line x1="26" y1="9" x2="16" y2="2" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
      <polyline points="6,23 16,13 26,23" stroke="url(#headerGoldGrad)" strokeWidth="1.5" strokeLinejoin="round" />
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
  const megaMenuRef = useRef(null);

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
      if (
        shopDropdownOpen &&
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target) &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target)
      ) {
        setShopDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setShopDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shopDropdownOpen]);

  // Lock body scroll when shop mega menu is open
  useEffect(() => {
    if (shopDropdownOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [shopDropdownOpen]);

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

  const isHomepage = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all ${
          isHomepage
            ? 'bg-black/95 border-b border-white/10 text-white shadow-xl'
            : 'bg-[#F8F6F2]/90 border-b border-[#EAE2F2] text-[#29242D] shadow-[0_2px_12px_rgba(41,36,45,0.03)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between relative">
          {/* LEFT: Faceted Gold Wireframe Crystal Logo + Brand Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 whitespace-nowrap">
              <FacetedCrystalLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <span
                className={`font-serif text-sm sm:text-base md:text-lg font-bold tracking-[0.16em] uppercase whitespace-nowrap transition-colors ${
                  isHomepage
                    ? 'text-white group-hover:text-[#D4AF37]'
                    : 'text-[#29242D] group-hover:text-[#79539B]'
                }`}
              >
                SUMUK CRYSTALZ 5
              </span>
            </Link>
          </div>

          {/* CENTER / NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-xs lg:text-[13px] font-sans font-medium uppercase tracking-[0.14em]">
            {/* SHOP / STORE MEGAMENU DROPDOWN */}
            <div
              className="relative flex items-center"
              ref={shopDropdownRef}
            >
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className={`text-xs lg:text-[13px] font-sans font-semibold uppercase tracking-[0.14em] py-2.5 px-2 flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  shopDropdownOpen
                    ? 'text-[#D4AF37]'
                    : isHomepage
                    ? 'text-white hover:text-[#D4AF37]'
                    : 'text-[#29242D]/80 hover:text-[#79539B]'
                }`}
                aria-expanded={shopDropdownOpen}
                aria-label="Toggle Shop Category Mega Menu"
              >
                <span>SHOP</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
              </button>
            </div>

            <Link
              href="/services"
              className={`font-medium transition-all duration-200 ${
                isHomepage ? 'text-white hover:text-[#D4AF37]' : 'text-[#29242D]/80 hover:text-[#79539B]'
              }`}
            >
              SERVICES
            </Link>

            <Link
              href="/about"
              className={`font-medium transition-all duration-200 ${
                isHomepage ? 'text-white hover:text-[#D4AF37]' : 'text-[#29242D]/80 hover:text-[#79539B]'
              }`}
            >
              FOUNDER STORY
            </Link>

            <Link
              href="/account"
              className={`font-medium transition-all duration-200 ${
                isHomepage ? 'text-white hover:text-[#D4AF37]' : 'text-[#29242D]/80 hover:text-[#79539B]'
              }`}
            >
              MY ACCOUNT &amp; ORDERS
            </Link>

            {/* Auth / Account Profile or Sign In */}
            {currentUser ? (
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`px-4 py-1.5 rounded-full border transition-all flex items-center gap-2 font-semibold shadow-xs cursor-pointer ${
                    isHomepage
                      ? 'bg-black/60 border-white/20 text-white hover:border-[#D4AF37]'
                      : 'bg-white border-[#EAE2F2] hover:border-[#D8CBE4] text-[#29242D]'
                  }`}
                  aria-expanded={userDropdownOpen}
                  title="Patron Profile & Orders"
                >
                  {isCurrentAdmin ? (
                    <Crown className="w-3.5 h-3.5 text-[#C8A65E]" />
                  ) : (
                    <User className={`w-3.5 h-3.5 ${isHomepage ? 'text-[#D4AF37]' : 'text-[#79539B]'}`} />
                  )}
                  <span className="max-w-[110px] truncate">{currentUser.name?.split(' ')[0] || 'Patron'}</span>
                  <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 py-2 bg-white/95 border border-[#EAE2F2] rounded-2xl shadow-xl z-50 text-xs font-sans space-y-1 backdrop-blur-xl animate-fade-in text-[#29242D]">
                    <div className="px-4 py-2.5 border-b border-[#EAE2F2]">
                      <p className="font-bold text-[#29242D] truncate">{currentUser.name || 'Sacred Patron'}</p>
                      <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#F8F6F2] flex items-center gap-2.5 text-[#29242D] transition font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-[#79539B]" />
                      <span>Customer Dashboard</span>
                    </Link>

                    <Link
                      href="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#F8F6F2] flex items-center gap-2.5 text-[#29242D] transition font-medium"
                    >
                      <Package className="w-3.5 h-3.5 text-[#79539B]" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/account?tab=tracking"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#F8F6F2] flex items-center gap-2.5 text-[#29242D] transition font-medium"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Order Tracking</span>
                    </Link>

                    <Link
                      href="/account?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#F8F6F2] flex items-center gap-2.5 text-[#29242D] transition font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Saved Wishlist</span>
                    </Link>

                    {isCurrentAdmin && (
                      <Link
                        href="http://localhost:3001"
                        target="_blank"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#F8F6F2] flex items-center gap-2.5 text-[#79539B] font-semibold transition"
                      >
                        <Crown className="w-3.5 h-3.5 text-[#C8A65E]" />
                        <span>Founder Admin Sanctum</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-center gap-2.5 text-rose-700 font-semibold transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
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
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full border text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                    isHomepage
                      ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                      : 'border-[#EAE2F2] bg-white hover:bg-[#F8F6F2] text-[#29242D]'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${isHomepage ? 'text-white' : 'text-[#79539B]'}`} />
                  <span>Sign In</span>
                </button>

                {/* Sign Up Pill Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer ${
                    isHomepage
                      ? 'bg-white hover:bg-stone-100 text-stone-950 font-bold'
                      : 'bg-[#79539B] hover:bg-[#684587] text-white'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isHomepage ? 'text-[#C8A65E]' : 'text-[#C8A65E]'}`} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Cart Button with Counter */}
            <button
              type="button"
              onClick={openDrawer}
              className={`relative p-2 transition cursor-pointer ${
                isHomepage ? 'text-white hover:text-[#D4AF37]' : 'text-[#29242D] hover:text-[#79539B]'
              }`}
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              <span
                className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-sans font-bold flex items-center justify-center shadow-xs ${
                  isHomepage
                    ? 'bg-white text-stone-950 border border-white'
                    : 'bg-[#EAE2F2] border border-[#D8CBE4] text-[#79539B]'
                }`}
              >
                {cartCount}
              </span>
            </button>

            {/* Vertical Divider */}
            <div className={`h-6 w-px mx-1 hidden sm:block ${isHomepage ? 'bg-white/20' : 'bg-[#EAE2F2]'}`} />

            {/* Menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 sm:p-2 transition-colors cursor-pointer flex items-center justify-center ${
                isHomepage ? 'text-white hover:text-[#D4AF37]' : 'text-[#29242D] hover:text-[#79539B]'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[1.8]" />}
            </button>
          </div>
        </div>

        {/* Navigation Slide Drawer */}
        {mobileMenuOpen && (
          <div className="mt-2 max-w-7xl mx-auto rounded-2xl px-6 pt-5 pb-6 bg-white/95 backdrop-blur-2xl border border-[#EAE2F2] space-y-3 animate-fade-in shadow-xl text-[#29242D]">
            {isCurrentAdmin && (
              <Link
                href="http://localhost:3001"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-sans uppercase tracking-wider text-[#79539B] font-bold flex items-center gap-2 bg-[#EAE2F2]/60 px-3 rounded-xl border border-[#D8CBE4]"
              >
                <Crown className="w-4 h-4 text-[#C8A65E]" />
                <span>Founder Admin Dashboard</span>
              </Link>
            )}

            {/* Mobile SHOP Discovery Section */}
            <div className="rounded-xl bg-[#F8F6F2] border border-[#EAE2F2] overflow-hidden">
              <div className="flex items-center justify-between py-1 px-3">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs font-sans uppercase tracking-wider text-[#79539B] font-bold flex-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
                  <span>SHOP ALL CRYSTALS</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="p-2 text-[#79539B]"
                  aria-label="Toggle Category Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileShopOpen && (
                <div className="p-2 pt-0 grid grid-cols-2 gap-1.5 border-t border-[#EAE2F2]">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 p-2 rounded-lg bg-[#EAE2F2] text-[#79539B] text-xs font-bold font-sans text-center block"
                  >
                    View All Consecrated Crystals
                  </Link>
                  {TOP_NAV_SHOP_MENU.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-white text-[11px] font-sans text-[#5C5562] hover:text-[#79539B] block truncate"
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
              className="block py-2 text-xs font-sans uppercase tracking-wider text-[#29242D] hover:text-[#79539B]"
            >
              SERVICES BY SUMUK CRYSTALZ 5
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-sans uppercase tracking-wider text-[#29242D] hover:text-[#79539B]"
            >
              FOUNDER STORY
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-sans uppercase tracking-wider text-[#79539B] font-bold flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-[#79539B]" />
              <span>MY ACCOUNT &amp; ORDERS</span>
            </Link>

            <div className="pt-3 border-t border-[#EAE2F2] space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#EAE2F2] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-sans text-[#29242D] font-bold flex items-center gap-1.5">
                        {isCurrentAdmin ? <Crown className="w-3.5 h-3.5 text-[#C8A65E]" /> : <User className="w-3.5 h-3.5 text-[#79539B]" />}
                        {currentUser.name || 'Patron'}
                      </span>
                      <p className="text-[10px] text-[#5C5562] font-sans">{currentUser.email}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold font-sans bg-[#EAE2F2] text-[#79539B]">
                      {isCurrentAdmin ? 'Admin' : 'Patron'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out of Sanctuary</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-white border border-[#EAE2F2] text-[#29242D] font-bold text-xs tracking-wider uppercase font-sans shadow-xs"
                  >
                    SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-[#79539B] hover:bg-[#684587] text-white font-bold text-xs tracking-wider uppercase font-sans shadow-xs flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
                    <span>SIGN UP</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SHOP MEGA MENU FULL OVERLAY (PORTAL DIRECTLY TO BODY — NEVER CUT, CLIPPED OR HALF) */}
      {shopDropdownOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          ref={megaMenuRef}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain animate-fade-in flex justify-center items-start pt-16 sm:pt-20 md:pt-24 pb-16 px-3 sm:px-6"
          style={{ minHeight: '100vh', width: '100vw' }}
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0 -z-10 cursor-pointer"
            onClick={() => setShopDropdownOpen(false)}
            aria-hidden="true"
          />
          <ShopMegaMenu onClose={() => setShopDropdownOpen(false)} />
        </div>,
        document.body
      )}

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
