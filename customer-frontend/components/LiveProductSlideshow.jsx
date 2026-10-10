'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../store/useCart';
import { getSupabaseProducts } from '../lib/supabase';
import { ENERGY_STONES_CATALOG } from '../data/energyStones';
import { formatProductMultiTags } from '../lib/discoveryTaxonomy';
import { crystalAudio } from '../utils/harmonicResonance';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  Eye,
  ArrowRight,
  Flame,
  Zap,
  Play,
  Pause,
} from 'lucide-react';

export default function LiveProductSlideshow({ className = '' }) {
  const [products, setProducts] = useState(ENERGY_STONES_CATALOG);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [itemsPerView, setItemsPerView] = useState(4);
  const { addItem, openDrawer } = useCartStore();
  const timerRef = useRef(null);

  // Responsive itemsPerView calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1.2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch live products from Supabase
  useEffect(() => {
    let isMounted = true;
    getSupabaseProducts(true)
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          setProducts(items);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const totalItems = products.length;
  const maxIndex = Math.max(0, Math.ceil(totalItems - (typeof itemsPerView === 'number' ? Math.floor(itemsPerView) : 1)));

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play slideshow (every 3.5s unless hovered or paused)
  useEffect(() => {
    if (isAutoPlaying && !isHovered && totalItems > 1) {
      timerRef.current = setInterval(handleNext, 3500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovered, totalItems, handleNext]);

  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const prodId = product.id || product._id;
    const price = Number(product.price || product.sellingPrice || product.selling_price || 699);
    const origPrice = Number(product.originalPrice || product.original_price || price * 1.3);
    const img = product.images?.[0] || product.heroImage || product.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80';

    addItem({
      productId: prodId,
      id: prodId,
      name: product.name,
      price: price,
      unitPrice: price,
      originalPrice: origPrice,
      quantity: 1,
      variantLabel: product.variants?.[0]?.name || product.beadSize || '8mm Regular Standard',
      image: img,
    });

    setQuickAddedId(prodId);
    try {
      crystalAudio?.playSingingBowl(528);
    } catch (_) {}
    setTimeout(() => setQuickAddedId(null), 1800);
    openDrawer();
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slideshow Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Consecrated Crystal Showcase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Curated Energy Specimen Slideshow
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-sans-ui">
            Handcrafted natural gemstones, Vedic energy bands, and rare collector geodes sliding live from our consecrated sanctuary vault.
          </p>
        </div>

        {/* Carousel Slide Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-neutral-300 hover:text-white transition shadow-sm"
            title={isAutoPlaying ? 'Pause Slideshow' : 'Resume Auto-Play'}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-neutral-300 hover:text-[#F3E5AB] transition active:scale-95 shadow-sm"
            title="Previous Specimen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-neutral-300 hover:text-[#F3E5AB] transition active:scale-95 shadow-sm"
            title="Next Specimen"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            href="/shop"
            className="ml-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition shadow-sm"
          >
            <span>View All ({totalItems})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Slideshow Track */}
      <div className="relative overflow-hidden w-full rounded-2xl">
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform gap-4 sm:gap-5"
          style={{
            transform: `translateX(-${currentIndex * (100 / (typeof itemsPerView === 'number' ? itemsPerView : 1))}%)`,
          }}
        >
          {products.map((prod, idx) => {
            const prodId = prod.id || prod._id || `item-${idx}`;
            const prodSlug = prod.slug || prodId;
            const prodImg = prod.images?.[0] || prod.heroImage || prod.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80';
            const price = Number(prod.price || prod.sellingPrice || prod.selling_price || 699);
            const origPrice = Number(prod.originalPrice || prod.original_price || price * 1.3);
            const discount = prod.discountPercent || (origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0);
            const badge = prod.badge || (prod.isNewArrival ? 'New Arrival' : prod.isBestSeller ? 'Best Seller' : 'Sacred Masterwork');
            const multiTags = formatProductMultiTags(prod, 4);

            return (
              <div
                key={prodId}
                className="flex-shrink-0 group flex flex-col justify-between rounded-2xl bg-[#0f0d1a]/90 hover:bg-[#151224] border border-amber-500/25 hover:border-amber-400/60 transition-all duration-300 overflow-hidden shadow-xl"
                style={{
                  width: `calc(${100 / (typeof itemsPerView === 'number' ? itemsPerView : 1)}% - ${((typeof itemsPerView === 'number' ? itemsPerView - 1 : 0) * 16) / (typeof itemsPerView === 'number' ? itemsPerView : 1)}px)`,
                }}
              >
                {/* Image Container with Hover Quick Add Overlay */}
                <Link href={`/product/${prodSlug}`} className="relative aspect-square w-full overflow-hidden block bg-black/40">
                  <Image
                    src={prodImg}
                    alt={prod.name || 'Consecrated Crystal Specimen'}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[9px] font-mono font-extrabold uppercase tracking-wider shadow-md">
                      {badge}
                    </span>
                    {(prod.beadSize || prod.category) && (
                      <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-amber-300 text-[9px] font-mono border border-amber-500/30">
                        {prod.beadSize || prod.category}
                      </span>
                    )}
                  </div>

                  {/* Discount Pill */}
                  {discount > 0 && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold shadow-md">
                      {discount}% OFF
                    </div>
                  )}

                  {/* Quick Add Slide-up Overlay */}
                  <div className="absolute inset-x-2 bottom-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xl transition active:scale-95"
                    >
                      {quickAddedId === prodId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Added to Vault!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-black" />
                          <span>Quick Add • ₹{price.toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>

                {/* Card Info Section */}
                <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3 bg-[#0d0b17]">
                  <div className="space-y-1.5">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-400">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-white">{prod.rating || 5.0}</span>
                      <span className="text-[10px] text-neutral-400">({prod.reviewsCount || 128})</span>
                    </div>

                    {/* Title */}
                    <Link href={`/product/${prodSlug}`}>
                      <h3 className="font-editorial text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1 leading-snug">
                        {prod.name}
                      </h3>
                    </Link>

                    {/* Subtitle */}
                    <p className="text-[11px] text-neutral-400 line-clamp-1 font-sans-ui">
                      {prod.subtitle || prod.shortDescription || prod.category || 'High-Vibrational Energy Specimen'}
                    </p>

                    {/* Multi-Discovery Tags underneath title */}
                    <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] font-sans-ui leading-tight text-amber-300/90">
                      {multiTags.map((tag, tIdx, tArr) => (
                        <React.Fragment key={tag}>
                          <span className="font-medium hover:text-white transition">
                            {tag}
                          </span>
                          {tIdx < tArr.length - 1 && (
                            <span className="text-neutral-500 font-bold">&middot;</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA Row */}
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-base sm:text-lg font-bold text-amber-300">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {origPrice > price && (
                          <span className="text-[11px] text-neutral-500 font-mono line-through">
                            ₹{origPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/product/${prodSlug}`}
                      className="p-2 rounded-lg bg-white/[0.08] hover:bg-amber-400 hover:text-black text-amber-300 transition flex items-center gap-1 text-[11px] font-mono font-bold"
                      title="Examine Specimen"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === dotIdx
                ? 'w-6 h-1.5 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
            title={`Slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
