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
        <div className="w-screen max-w-md bg-[#F8F6F2] border-l border-[#EAE2F2] flex flex-col shadow-[0_0_60px_rgba(41,36,45,0.15)] text-[#29242D] relative overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Ambient Amethyst & Gold Glows */}
          <div className="absolute top-1/4 -right-12 w-64 h-64 bg-[#EAE2F2]/60 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/3 -left-12 w-64 h-64 bg-[#C8A65E]/10 rounded-full blur-[90px] pointer-events-none" />

          {/* 1. Header */}
          <div className="p-5 sm:p-6 border-b border-[#EAE2F2] bg-white/70 backdrop-blur-md relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAE2F2] border border-[#EAE2F2] flex items-center justify-center text-[#79539B] flex-shrink-0 shadow-xs mt-0.5">
                  <ShoppingBag className="w-5 h-5 text-[#79539B]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#29242D] font-serif">
                      Your Collection
                    </h3>
                    <span className="text-xs font-sans text-[#79539B] font-semibold">
                      ({totalSpecimens} {totalSpecimens === 1 ? 'specimen' : 'specimens'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-sans tracking-widest text-[#29242D]/60 uppercase font-semibold">
                      TIMELESS CRYSTALS, ENDLESS ENERGY
                    </span>
                    <div className="w-6 h-[1px] bg-[#C8A65E]" />
                  </div>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-[#EAE2F2] text-[#29242D]/60 hover:text-[#29242D] transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Patron Session Strip Card */}
          <div className="px-5 py-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EAE2F2] shadow-xs flex items-center justify-between text-xs">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#EAE2F2] border border-[#EAE2F2] flex items-center justify-center text-[#79539B] flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[#29242D] truncate">
                      {user.fullName || user.name || user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-xs text-[#79539B] hover:text-[#684587] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#29242D]/70 font-sans">
                    <User className="w-4 h-4 text-[#79539B]" />
                    <span>Guest Collector</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-semibold text-[#79539B] hover:text-[#684587] flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3.5 relative z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#29242D]/60 font-sans">
                <div className="w-16 h-16 rounded-full bg-white/80 border border-[#EAE2F2] flex items-center justify-center text-[#79539B] shadow-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-serif text-[#29242D] font-bold text-lg">Your collection is empty</p>
                  <p className="text-xs text-[#29242D]/70 mt-1 max-w-xs leading-relaxed">
                    Explore our consecrated vault of museum-grade crystals, cathedral geodes, and talismanic energy bands.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition"
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
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#29242D] truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#79539B] bg-[#EAE2F2] px-1.5 py-0.5 rounded border border-[#79539B]/30">
                          ID: {item.product_id || item.productId || (item.name?.toLowerCase().includes('mala') ? 'MA001' : (item.name?.toLowerCase().includes('amethyst') || item.name?.toLowerCase().includes('geode') ? 'HO001' : 'BR001'))}
                        </span>
                        <span className="text-[11px] font-sans text-[#C8A65E] font-semibold">
                          {item.variantLabel || '8mm Regular'}
                        </span>
                      </div>

                      {/* Pill Quantity Selector */}
                      <div className="inline-flex items-center gap-3 mt-2 px-2.5 py-1 rounded-full bg-[#F8F6F2] border border-[#EAE2F2] text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId || item.id, item.variantLabel, itemQty - 1)
                          }
                          className="text-[#29242D]/60 hover:text-[#29242D] transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-sans font-bold tabular-nums text-xs text-[#29242D]">{itemQty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId || item.id, item.variantLabel, itemQty + 1)
                          }
                          className="text-[#29242D]/60 hover:text-[#29242D] transition cursor-pointer"
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
                        className="text-[#29242D]/40 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove specimen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <span className="font-sans font-bold tabular-nums text-base sm:text-lg text-[#29242D]">
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
                <div className="text-[10px] font-sans tracking-widest text-[#29242D]/40 uppercase font-bold">
                  CRYSTALS FOR A BRIGHTER TOMORROW
                </div>
              </div>
            )}
          </div>

          {/* 5. Bottom Subtotal & Checkout Card */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#EAE2F2] bg-white/95 backdrop-blur-xl shadow-xl space-y-4 relative z-20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#29242D]">Total Subtotal</span>
                <span className="text-2xl font-bold text-[#29242D] font-sans tabular-nums tracking-tight">
                  ₹{Number(subtotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-[#79539B] bg-[#EAE2F2]/60 border border-[#EAE2F2] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 font-medium font-sans">
                  <span className="text-[#79539B] font-bold">📦 Note:</span>
                  <span>Compulsory unboxing video required for returns. Contact owner for assistance.</span>
                </div>
              </div>

              {/* Luminous Purple CTA Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-[#79539B]/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>PROCEED TO SACRED CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges Footer Row */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EAE2F2] text-center font-sans">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#EAE2F2] border border-[#EAE2F2] flex items-center justify-center text-[#C8A65E]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#29242D]/70">Authentic Crystals</span>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#EAE2F2] border border-[#EAE2F2] flex items-center justify-center text-[#79539B]">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#29242D]/70">Insured Shipping</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
