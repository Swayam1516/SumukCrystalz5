'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../store/useCart';
import { useAuthStore } from '../store/useAuth';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check, User, LogOut } from 'lucide-react';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const { user, logout, openAuthModal } = useAuthStore();

  if (!isDrawerOpen) return null;

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-luxe-950 border-l border-white/15 flex flex-col shadow-2xl animate-slide-left">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Collection
              </h3>
              <span className="text-xs font-mono text-luxe-400">
                ({items.reduce((s, i) => s + i.quantity, 0)} specimens)
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-luxe-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patron Session Strip */}
          <div className="px-5 py-2 bg-[#0c0915] border-b border-white/5 flex items-center justify-between text-xs font-mono">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 truncate text-amber-300">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate max-w-[170px]">{user.name || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline ml-2"
                  title="Sign Out of Account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Guest Patron</span>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-amber-300 hover:text-white text-[11px] font-bold"
                >
                  Sign In / Register &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-luxe-900 px-5 py-3.5 border-b border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-luxe-200 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                {remainingForFree > 0
                  ? `Add ₹${Number(remainingForFree || 0).toLocaleString('en-IN')} more for free insured shipping`
                  : 'Complimentary Insured Shipping Unlocked'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-luxe-400">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-luxe-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-serif text-white font-medium text-lg">Your collection is empty</p>
                  <p className="text-xs text-luxe-400 mt-1 max-w-xs">
                    Explore our curated vault of museum-grade crystals, cathedral geodes, and talismanic stones.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="gold-3d-btn mt-2 px-6 py-2.5 rounded-full text-xs transition"
                >
                  Explore Masterworks
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantLabel || 'default'}`}
                  className="flex gap-3.5 p-3 rounded-2xl glass-card-3d border border-white/10 group hover:border-white/20 transition"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-luxe-900 flex-shrink-0 border border-white/10">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-luxe-500">
                        Crystal
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug || item.productId}`}
                          onClick={closeDrawer}
                          className="text-xs font-semibold text-white truncate hover:text-gold-300 transition"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.variantLabel)}
                          className="text-luxe-500 hover:text-rose-400 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantLabel && (
                        <p className="text-[10px] text-gold-400/80 font-mono mt-0.5">
                          {item.variantLabel}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center rounded-lg bg-white/5 border border-white/10 text-xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantLabel, item.quantity - 1)
                          }
                          className="p-1 px-2 text-luxe-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-white text-xs">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantLabel, item.quantity + 1)
                          }
                          className="p-1 px-2 text-luxe-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-serif text-sm font-semibold text-white">
                        ₹{Number((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-luxe-900/80 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-luxe-300">Total Subtotal</span>
                <span className="font-serif text-xl font-bold text-white">
                  ₹{Number(subtotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-[11px] text-luxe-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certificate & consecration included with every order</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="gold-3d-btn w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                <span>Proceed to Sacred Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
