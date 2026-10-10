'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import { useAuthStore } from '../store/useAuth';
import { getSupabaseDeliverySettings } from '../lib/supabase';
import { DEFAULT_DELIVERY_SETTINGS } from '../lib/shippingEngine';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  LogOut,
  Lock,
  Truck,
  Award,
  LogIn,
} from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const { user, logout, openAuthModal, isAuthenticated } = useAuthStore();
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    getSupabaseDeliverySettings()
      .then((settings) => {
        if (isMounted && settings) setDeliverySettings(settings);
      })
      .catch((err) => console.warn('CartDrawer delivery settings note:', err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isDrawerOpen) return null;

  const subtotal = getTotalPrice();
  const freeShippingThreshold = Number(deliverySettings?.free_shipping_threshold || 5000);
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const totalSpecimens = items.reduce((s, i) => s + (Number(i.quantity) || 1), 0);

  const handleProceedToCheckout = () => {
    closeDrawer();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#FAF7FD] via-[#F5EDFB] to-[#FAF8FC] border-l border-purple-200/80 flex flex-col shadow-[0_0_60px_rgba(124,58,237,0.2)] text-[#1E1B4B] relative overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Ambient Amethyst Crystal Glows in Background */}
          <div className="absolute top-1/4 -right-12 w-64 h-64 bg-purple-300/25 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/3 -left-12 w-64 h-64 bg-indigo-300/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Amethyst Crystal Decorative Vector Silhouette */}
          <div className="absolute right-0 bottom-36 w-44 pointer-events-none opacity-30 select-none z-0">
            <svg viewBox="0 0 120 180" className="w-full h-auto text-purple-600 drop-shadow-[0_10px_20px_rgba(147,51,234,0.15)]">
              <polygon points="20,170 50,15 80,170" fill="url(#cartAmethystGrad1)" opacity="0.85" />
              <polygon points="5,175 35,55 65,175" fill="url(#cartAmethystGrad2)" opacity="0.7" />
              <polygon points="45,180 70,35 95,180" fill="url(#cartAmethystGrad1)" opacity="0.6" />
              <polygon points="50,15 35,80 20,170" fill="#E9D5FF" opacity="0.4" />
              <defs>
                <linearGradient id="cartAmethystGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="50%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#581C87" />
                </linearGradient>
                <linearGradient id="cartAmethystGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E9D5FF" />
                  <stop offset="60%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#6B21A8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 1. Header (Matching Reference Image 1) */}
          <div className="p-5 sm:p-6 border-b border-purple-100/90 bg-white/60 backdrop-blur-md relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6208] flex-shrink-0 shadow-xs mt-0.5">
                  <ShoppingBag className="w-5 h-5 text-[#8C6208]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#110D23] font-serif">
                      Your Collection
                    </h3>
                    <span className="text-xs font-mono text-purple-600 font-semibold">
                      ({totalSpecimens} {totalSpecimens === 1 ? 'specimen' : 'specimens'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#6B7280] uppercase font-semibold">
                      TIMELESS CRYSTALS, ENDLESS ENERGY
                    </span>
                    <div className="w-6 h-[1px] bg-[#D4AF37]" />
                  </div>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-purple-100/70 text-[#6B7280] hover:text-[#110D23] transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Patron Session Strip Card (Matching Reference Image 1) */}
          <div className="px-5 py-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-purple-100/90 shadow-xs flex items-center justify-between text-xs">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[#1E1B4B] truncate">
                      {user.fullName || user.name || user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Guest Collector</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Free Shipping Progress Meter (Matching Reference Image 1) */}
          <div className="px-5 pb-3 relative z-10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#1E1B4B] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {remainingForFree > 0
                  ? `Add ₹${Number(remainingForFree || 0).toLocaleString('en-IN')} more for free insured shipping`
                  : '✨ Complimentary Insured Shipping Unlocked!'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-purple-100/90 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#9333EA] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* 4. Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3.5 relative z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#6B7280]">
                <div className="w-16 h-16 rounded-full bg-white/80 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-serif text-[#1E1B4B] font-bold text-lg">Your collection is empty</p>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-xs leading-relaxed">
                    Explore our consecrated vault of museum-grade crystals, cathedral geodes, and talismanic energy bands.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition"
                >
                  Explore Masterworks
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = Number(item.price || item.unitPrice || 0);
                const itemQty = Number(item.quantity || 1);
                const itemTotal = unitPrice * itemQty;

                return (
                  <div
                    key={`${item.productId || item.id}-${item.variantLabel || 'std'}`}
                    className="p-4 rounded-[24px] bg-white/95 border border-purple-100/90 shadow-md shadow-purple-950/5 flex items-center justify-between gap-3 relative group"
                  >
                    {/* Left: Specimen Image */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-purple-50 border border-purple-200/80 flex-shrink-0 shadow-inner">
                      <Image
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {/* Gold Star Specimen Badge Accent */}
                      <div className="absolute top-1 left-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37] drop-shadow" />
                      </div>
                    </div>

                    {/* Center: Details & Quantity Selector */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#110D23] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-mono text-[#B8860B] font-semibold mt-0.5">
                        {item.variantLabel || '8mm Regular'}
                      </p>

                      {/* Pill Quantity Selector (Matching Reference Image 1) */}
                      <div className="inline-flex items-center gap-3 mt-2 px-2.5 py-1 rounded-full bg-[#FAF7FD] border border-purple-200/70 text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId || item.id, item.variantLabel, itemQty - 1)
                          }
                          className="text-[#6B7280] hover:text-[#110D23] transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs text-[#110D23]">{itemQty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId || item.id, item.variantLabel, itemQty + 1)
                          }
                          className="text-[#6B7280] hover:text-[#110D23] transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Trash Icon at Top & Bold Price at Bottom */}
                    <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId || item.id, item.variantLabel)}
                        className="text-purple-600 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove specimen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <span className="font-extrabold text-base sm:text-lg text-[#110D23] font-mono">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Ambient Watermark inside scroll area */}
            {items.length > 0 && (
              <div className="pt-6 pb-2 pl-1 space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-[#9CA3AF] uppercase font-bold">
                  CRYSTALS
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#9CA3AF] uppercase font-bold">
                  FOR A BRIGHTER
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#9CA3AF] uppercase font-bold flex items-center gap-2">
                  <span>TOMORROW</span>
                  <div className="w-6 h-[1px] bg-[#D4AF37]" />
                </div>
              </div>
            )}
          </div>

          {/* 5. Bottom Subtotal & Checkout Card (Matching Reference Image 1) */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-purple-100/90 bg-white/95 backdrop-blur-xl shadow-xl space-y-4 relative z-20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1E1B4B]">Total Subtotal</span>
                <span className="text-2xl font-extrabold text-[#110D23] font-mono tracking-tight">
                  ₹{Number(subtotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs text-[#6B7280] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
                  <span>Certificate &amp; consecration included with every order</span>
                </div>
                <div className="text-[11px] text-purple-900 bg-purple-50/90 border border-purple-200/80 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 font-medium">
                  <span className="text-purple-600 font-bold">📦 Note:</span>
                  <span>Compulsory unboxing video required for returns. Contact owner for assistance.</span>
                </div>
              </div>

              {/* Luminous Celestial Purple CTA Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-extrabold text-xs uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO SACRED CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 3 Trust Badges Footer Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-100 text-center">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#6B7280]">256-bit Encryption</span>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#6B7280]">Authentic Crystals</span>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B]">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#6B7280]">Insured Shipping</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
