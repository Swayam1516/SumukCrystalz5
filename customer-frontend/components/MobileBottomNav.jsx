'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import {
  Home,
  ShoppingBag,
  Flower2,
  BookOpen,
  Vault,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openDrawer, getTotalCount } = useCartStore();
  const cartCount = getTotalCount();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Shop',
      href: '/shop',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/shop') || pathname.startsWith('/product'),
    },
    {
      label: 'Services',
      href: '/services',
      icon: Flower2,
      isActive: pathname.startsWith('/services'),
    },
    {
      label: 'Founder Story',
      href: '/about',
      icon: BookOpen,
      isActive: pathname.startsWith('/about'),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#EAE3D5] shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 safe-bottom"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                item.isActive ? 'text-[#B45309]' : 'text-[#6B6357] hover:text-[#1F1A15]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive ? 'bg-amber-100/80 text-[#B45309]' : 'text-stone-500'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={item.isActive ? 2.4 : 1.8} />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 font-sans-ui ${
                  item.isActive ? 'font-bold text-[#B45309]' : 'font-medium text-stone-600'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Vault / Cart Button */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center py-1 transition-all text-[#6B6357] hover:text-[#1F1A15] cursor-pointer"
          aria-label="Open Vault Cart"
        >
          <div className="relative p-1 rounded-xl text-stone-500">
            <Vault className="w-5 h-5" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-mono font-extrabold text-[9px] flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-sans-ui font-medium text-stone-600">
            Vault
          </span>
        </button>
      </div>
    </nav>
  );
}
