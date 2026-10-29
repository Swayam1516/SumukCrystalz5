'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../store/useCart';
import { getSupabaseProducts } from '../lib/supabase';
import { ENERGY_STONES_CATALOG } from '../data/energyStones';
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
  ShieldCheck,
  Play,
  Pause,
} from 'lucide-react';

// The 6 Flagship Crystal Products specified in the Master Prompt
const FLAGSHIP_PRODUCT_IDS = [
  'tigers-eye-bracelet',
  'amethyst-bracelet',
  'golden-pyrite-bracelet',
  'clear-quartz-cluster',
  'obsidian-bracelet',
  'rose-quartz-bracelet',
];

export default function CoverFlow3DSlideshow({ className = '' }) {
  // Initial fallback to catalog's 6 flagship products
  const initialFlagships = ENERGY_STONES_CATALOG.filter((p) =>
    FLAGSHIP_PRODUCT_IDS.includes(p.id) || FLAGSHIP_PRODUCT_IDS.includes(p.slug)
  ).slice(0, 6);

  const [products, setProducts] = useState(
    initialFlagships.length === 6 ? initialFlagships : ENERGY_STONES_CATALOG.slice(0, 6)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check for mobile viewport tuning
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { addItem, openDrawer } = useCartStore();
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mouseStartX = useRef(0);
  const hasMoved = useRef(false);

  // 1. Fetch live products from Supabase and filter for the 6 flagship items
  useEffect(() => {
    let isMounted = true;
    getSupabaseProducts(true)
      .then((items) => {
        if (!isMounted || !items || items.length === 0) return;
        // Find the 6 flagship items from Supabase
        const matched = [];
        for (const targetId of FLAGSHIP_PRODUCT_IDS) {
          const found = items.find((p) => {
            const pId = (p.id || '').toLowerCase();
            const pSlug = (p.slug || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            return (
              pId.includes(targetId) ||
              pSlug.includes(targetId) ||
              pName.includes(targetId.replace(/-/g, ' '))
            );
          });
          if (found) matched.push(found);
        }

        if (matched.length >= 4) {
          setProducts(matched.slice(0, 6));
        } else {
          // If fewer than 4 matched in DB, complement with catalog
          const combined = [...matched];
          for (const catProd of initialFlagships) {
            if (!combined.some((c) => c.slug === catProd.slug || c.id === catProd.id)) {
              combined.push(catProd);
            }
          }
          setProducts(combined.slice(0, 6));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // 3. Pause when browser tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const total = products.length;

  // Navigation handlers (reset auto timer on call)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex((idx + total) % total);
  };

  // 4. Automatic rotation: switch to next product every 3000ms
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isDragging || isTabHidden || prefersReducedMotion || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovered, isDragging, isTabHidden, prefersReducedMotion, total, currentIndex]);

  // 5. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // 6. Touch Swipe for mobile (allows vertical scroll, catches horizontal swipe)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
      hasMoved.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!hasMoved.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
  };

  // 7. Mouse Drag for desktop
  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    setIsDragging(true);
    hasMoved.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 10) {
      hasMoved.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && hasMoved.current) {
      const deltaX = e.clientX - mouseStartX.current;
      if (deltaX > 50) {
        handlePrev();
      } else if (deltaX < -50) {
        handleNext();
      }
    }
    setIsDragging(false);
  };

  // 8. Add to Cart integration with useCartStore
  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const prodId = product.id || product._id;
    const price = Number(product.price || product.sellingPrice || product.selling_price || 699);
    const origPrice = Number(product.originalPrice || product.original_price || Math.round(price * 1.3));
    const img =
      product.images?.[0] ||
      product.heroImage ||
      product.image ||
      '/images/products/pyrite.jpg';

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
    <section
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      aria-label="Sumuk Crystalz 3D Cover Flow Product Slideshow"
    >
      {/* ── Header: Light Luxury Ivory & Champagne Gold ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#EAE3D5]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Consecrated Crystal Showcase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1A15] tracking-tight">
            Curated Energy Specimen Slideshow
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5245] max-w-xl font-sans-ui leading-relaxed">
            Handcrafted natural gemstones, Vedic energy bands, and rare collector geodes sliding live from our consecrated sanctuary vault.
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200/80 text-amber-800 transition shadow-sm cursor-pointer"
            title={isAutoPlaying ? 'Pause 3-second Auto Rotation' : 'Resume Auto Rotation'}
            aria-label={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Prev Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 transition active:scale-95 shadow-sm cursor-pointer"
            title="Previous Specimen"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 transition active:scale-95 shadow-sm cursor-pointer"
            title="Next Specimen"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* View All Store Link */}
          <Link
            href="/shop"
            className="ml-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-stone-900 hover:text-black text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition shadow-[0_4px_14px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            <span>View All ({total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 3D Cover Flow Stage ── */}
      <div
        className="relative w-full py-8 overflow-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Carousel 3D Viewport Track */}
        <div
          className="relative w-full h-[480px] sm:h-[520px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {products.map((product, idx) => {
            // Circular offset relative to currentIndex (-total/2 to +total/2)
            let diff = (idx - currentIndex + total) % total;
            if (diff > total / 2) diff -= total;

            const isCenter = diff === 0;
            const isPrev = diff === -1;
            const isNext = diff === 1;
            const isFarPrev = diff === -2;
            const isFarNext = diff === 2;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // 3D Cover Flow Transform Calculations
            let translateX = 0;
            let translateZ = -300;
            let rotateY = 0;
            let scale = 0.7;
            let opacity = 0;
            let zIndex = 5;

            if (isCenter) {
              translateX = 0;
              translateZ = isMobile ? 20 : 40;
              rotateY = 0;
              scale = isMobile ? 1.02 : 1.05;
              opacity = 1;
              zIndex = 30;
            } else if (isNext) {
              translateX = isMobile ? 48 : 62; // percentage
              translateZ = isMobile ? -80 : -120;
              rotateY = isMobile ? -20 : -28; // tilted right
              scale = isMobile ? 0.84 : 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (isPrev) {
              translateX = isMobile ? -48 : -62; // percentage
              translateZ = isMobile ? -80 : -120;
              rotateY = isMobile ? 20 : 28; // tilted left
              scale = isMobile ? 0.84 : 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (isFarNext) {
              translateX = isMobile ? 90 : 108;
              translateZ = isMobile ? -160 : -240;
              rotateY = isMobile ? -30 : -42;
              scale = isMobile ? 0.70 : 0.74;
              opacity = isMobile ? 0.2 : 0.45;
              zIndex = 10;
            } else if (isFarPrev) {
              translateX = isMobile ? -90 : -108;
              translateZ = isMobile ? -160 : -240;
              rotateY = isMobile ? 30 : 42;
              scale = isMobile ? 0.70 : 0.74;
              opacity = isMobile ? 0.2 : 0.45;
              zIndex = 10;
            }

            const prodId = product.id || product._id || `item-${idx}`;
            const prodSlug = product.slug || prodId;
            const prodImg =
              product.images?.[0] ||
              product.heroImage ||
              product.image ||
              '/images/products/pyrite.jpg';
            const price = Number(product.price || product.sellingPrice || product.selling_price || 699);
            const origPrice = Number(product.originalPrice || product.original_price || Math.round(price * 1.3));
            const discount =
              product.discountPercent ||
              (origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0);
            const badge =
              product.badge ||
              (product.isNewArrival
                ? 'NEW ARRIVAL'
                : product.isBestSeller
                ? 'BESTSELLER'
                : '100% NATURAL');
            const inStock = product.inStock !== false && (product.stockCount === undefined || product.stockCount > 0);

            return (
              <div
                key={prodId}
                onClick={() => {
                  if (!isCenter) goToSlide(idx);
                }}
                className={`absolute w-[290px] sm:w-[340px] md:w-[360px] rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
                  isCenter ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow: isCenter
                    ? '0 25px 60px -15px rgba(180, 130, 40, 0.28), 0 0 0 1px rgba(212, 175, 55, 0.45)'
                    : '0 15px 35px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.2)',
                }}
              >
                {/* ── Premium Light Luxury Card Container ── */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#EAE3D5] flex flex-col justify-between h-full">
                  
                  {/* Top Image Box */}
                  <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#F7F3EB] to-[#ECE5D8]">
                    <Image
                      src={prodImg}
                      alt={product.name || 'Consecrated Crystal Specimen'}
                      fill
                      sizes="(max-width: 640px) 290px, 360px"
                      priority={isCenter}
                      className={`object-cover transition-transform duration-700 ${
                        isCenter ? 'hover:scale-105' : ''
                      }`}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-md">
                        {badge}
                      </span>
                      {product.beadSize && (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#5C5245] text-[10px] font-mono font-semibold border border-amber-200 shadow-sm">
                          {product.beadSize}
                        </span>
                      )}
                    </div>

                    {/* Discount Pill */}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-mono font-extrabold shadow-md">
                        {discount}% OFF
                      </div>
                    )}

                    {/* 100% Natural Gemstone Crest Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>100% NATURAL</span>
                    </div>

                    {/* Quick Add Overlay on Center card */}
                    {isCenter && (
                      <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-300 z-20">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-stone-950 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xl transition active:scale-95 cursor-pointer"
                        >
                          {quickAddedId === prodId ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Vault!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Quick Add • ₹{price.toLocaleString('en-IN')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Card Information */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white space-y-3">
                    <div className="space-y-1.5">
                      {/* Rating & Stock */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-500">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-stone-800">{product.rating || 5.0}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                            inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {inStock ? 'IN STOCK' : 'PRE-ORDER'}
                        </span>
                      </div>

                      {/* Product Name */}
                      <Link href={`/product/${prodSlug}`}>
                        <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1F1A15] hover:text-amber-700 transition line-clamp-1 leading-snug cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Subtitle / Description */}
                      <p className="text-xs text-[#5C5245] line-clamp-1 font-sans-ui">
                        {product.subtitle || product.shortDescription || 'High-Vibrational Energy Specimen'}
                      </p>
                    </div>

                    {/* Price and Action Row */}
                    <div className="pt-3 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-lg sm:text-xl font-bold text-amber-700">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          {origPrice > price && (
                            <span className="text-xs text-stone-400 font-mono line-through">
                              ₹{origPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${prodSlug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                          title="View Specimen Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition shadow-sm cursor-pointer active:scale-95"
                          title="Add to Vault"
                        >
                          {quickAddedId === prodId ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6 Pagination Dots ── */}
      <div className="flex items-center justify-center gap-2 mt-4" role="tablist">
        {products.map((p, dotIdx) => (
          <button
            key={p.id || dotIdx}
            type="button"
            onClick={() => goToSlide(dotIdx)}
            role="tab"
            aria-selected={currentIndex === dotIdx}
            aria-label={`Slide ${dotIdx + 1}: ${p.name}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === dotIdx
                ? 'w-8 h-2 bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_2px_8px_rgba(212,175,55,0.6)]'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
