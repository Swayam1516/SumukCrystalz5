'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'ganesha-sanctuary',
    badge: 'DIVINE BLESSINGS • AUTHENTIC NATURAL CRYSTALS',
    titleLine1: 'DIVINE ENERGY.',
    titleLine2: 'TIMELESS CRYSTALS.',
    subtitle: 'Blessed by the divine. Inspired by nature.',
    description:
      'Discover authentic natural crystals, thoughtfully curated to bring beauty, meaning and positive energy into your everyday spaces.',
    imageDesktop: '/images/ganesha-hero-sanctuary-desktop.jpg',
    imageMobile: '/images/ganesha-hero-sanctuary-mobile.jpg',
    ctaPrimary: {
      label: 'EXPLORE COLLECTION',
      href: '/shop',
      icon: Crown,
    },
    ctaSecondary: {
      label: 'DISCOVER YOUR CRYSTAL',
      href: '/shop',
      icon: Sparkles,
    },
    accentColor: '#D4AF37',
  },
  {
    id: 'bracelets-masterwork',
    badge: '100% NATURAL • CONSECRATED ENERGY BANDS',
    titleLine1: 'SACRED WRISTWEAR.',
    titleLine2: 'UNYIELDING HARMONY.',
    subtitle: 'Handcrafted 8mm AAA natural mineral gemstone bands.',
    description:
      'Tiger’s Eye, Golden Pyrite, Rose Quartz and Amethyst strung on durable elastic cord, attuned for daily protection, courage, and prosperity.',
    imageDesktop: '/assets/banners/bracelets-banner.jpg',
    imageMobile: '/assets/banners/bracelets-banner.jpg',
    ctaPrimary: {
      label: 'SHOP BRACELETS',
      href: '/shop?pillar=jewellery&filter=jewellery:bracelets',
      icon: ShoppingBag,
    },
    ctaSecondary: {
      label: 'EXPLORE SANCTUARY',
      href: '/shop',
      icon: Sparkles,
    },
    accentColor: '#E5C378',
  },
  {
    id: 'malas-meditation',
    badge: 'VEDIC ATTUNEMENT • 108 SACRED BEADS',
    titleLine1: 'CONSECRATED MALAS.',
    titleLine2: 'INNER STILLNESS.',
    subtitle: '108 authentic prayer beads for meditation & spiritual growth.',
    description:
      'Hand-knotted with silk tassels and guru beads, sound-cleansed with 432Hz Solfeggio bowls by Reiki Master Soumyaa Naveen.',
    imageDesktop: '/assets/banners/malas-banner.jpg',
    imageMobile: '/assets/banners/malas-banner.jpg',
    ctaPrimary: {
      label: 'SHOP MALAS',
      href: '/shop?filter=energy:chakras',
      icon: Crown,
    },
    ctaSecondary: {
      label: 'SACRED MEDITATION',
      href: '/shop',
      icon: Sparkles,
    },
    accentColor: '#D4AF37',
  },
  {
    id: 'stones-geodes',
    badge: 'ETHICALLY SOURCED • UNHEATED SPECIMENS',
    titleLine1: 'RAW MASTERWORKS.',
    titleLine2: 'EARTH’S PURE FORCE.',
    subtitle: 'Uncut Brazilian Amethyst, Peruvian Pyrite & Himalayan Quartz.',
    description:
      'Unheated, ethically sourced mineral clusters and geodes radiating unadulterated high vibrational frequency into your sanctuary.',
    imageDesktop: '/assets/banners/stones-banner.jpg',
    imageMobile: '/assets/banners/stones-banner.jpg',
    ctaPrimary: {
      label: 'SHOP RAW STONES',
      href: '/shop?filter=energy:numerology',
      icon: ShoppingBag,
    },
    ctaSecondary: {
      label: 'VIEW ALL SPECIMENS',
      href: '/shop',
      icon: Sparkles,
    },
    accentColor: '#FBBF24',
  },
  {
    id: 'trees-vastu',
    badge: 'VASTU COMPLIANT • 300+ GEMSTONE BEADS',
    titleLine1: 'VASTU BONSAI.',
    titleLine2: 'TREES OF PROSPERITY.',
    subtitle: '300+ natural gemstone wire-wrapped beads on geode bases.',
    description:
      'Sacred Feng Shui & Vastu home décor engineered to draw wealth, family peace, and uplifting vitality into every room.',
    imageDesktop: '/assets/banners/trees-banner.jpg',
    imageMobile: '/assets/banners/trees-banner.jpg',
    ctaPrimary: {
      label: 'SHOP GEMSTONE TREES',
      href: '/shop?filter=specimen:crystal-trees',
      icon: Crown,
    },
    ctaSecondary: {
      label: 'DISCOVER HOME DÉCOR',
      href: '/shop',
      icon: Sparkles,
    },
    accentColor: '#D4AF37',
  },
];

export default function Cinematic3DCrystalHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const autoPlayTimer = useRef(null);

  const totalSlides = HERO_SLIDES.length;

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay every 5.5 seconds
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      handleNext();
    }, 5500);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, prefersReducedMotion, handleNext, currentSlide]);

  // Mouse Parallax
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 16;
    const y = (clientY / height - 0.5) * 16;
    setParallaxOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
    setIsPaused(false);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const active = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full min-h-[82vh] sm:min-h-[86vh] lg:min-h-[88vh] xl:min-h-[90vh] bg-[#05020A] text-white overflow-hidden flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Sumuk Crystalz 5 Cinematic Hero Slider"
    >
      {/* ══════════════════════════════════════════════════════════
          1. 4K CINEMATIC SLIDESHOW BACKGROUNDS (Zoom, Fade & Parallax)
         ══════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
          animate={{
            opacity: 1,
            scale: prefersReducedMotion ? 1 : 1,
            x: prefersReducedMotion ? 0 : parallaxOffset.x * -0.5,
            y: prefersReducedMotion ? 0 : parallaxOffset.y * -0.5,
          }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
          transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Desktop 16:9 Asset */}
          <div className="hidden sm:block absolute inset-0 w-full h-full">
            <Image
              src={active.imageDesktop}
              alt={active.titleLine1}
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-center lg:object-[80%_center] filter brightness-[1.03] contrast-[1.02] transform transition-transform duration-[6000ms] ease-out scale-[1.02]"
            />
          </div>

          {/* Mobile Asset */}
          <div className="block sm:hidden absolute inset-0 w-full h-full">
            <Image
              src={active.imageMobile}
              alt={active.titleLine1}
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-center filter brightness-[1.03] contrast-[1.02]"
            />
          </div>

          {/* Directional Luxury Scrims */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 via-35% sm:via-black/40 sm:via-48% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          2. FLOATING NAVIGATION ARROWS
         ══════════════════════════════════════════════════════════ */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-white hover:text-amber-300 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-white hover:text-amber-300 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* ══════════════════════════════════════════════════════════
          3. MAIN HERO CONTENT CONTAINER (Aligned Typography & CTAs)
         ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-2xl space-y-5 text-left">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id + '-content'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/50 border border-[#D4AF37]/50 backdrop-blur-md shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                <span className="text-[#E5C378] text-[10.5px] sm:text-xs font-sans uppercase tracking-[0.2em] font-bold">
                  {active.badge}
                </span>
              </div>

              {/* Two-Tone Headline */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[74px] font-black uppercase tracking-tight leading-[1.0] font-sans">
                  <span className="block text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                    {active.titleLine1}
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF1C5] to-[#C99D2A] drop-shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
                    {active.titleLine2}
                  </span>
                </h1>

                {/* Subtitle in Cormorant / Playfair Italic Serif */}
                <p className="font-serif italic text-white/95 text-lg sm:text-2xl md:text-3xl lg:text-[30px] pt-1 sm:pt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-normal">
                  {active.subtitle}
                </p>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm md:text-base text-stone-200/90 font-sans leading-relaxed max-w-lg font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {active.description}
              </p>

              {/* Call-to-Action Buttons */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* 1. Solid White Pill: Primary CTA */}
                <Link
                  href={active.ctaPrimary.href}
                  className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 shadow-[0_10px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_10px_35px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-sans"
                >
                  <active.ctaPrimary.icon className="w-4 h-4 text-stone-950 stroke-[2.2]" />
                  <span>{active.ctaPrimary.label}</span>
                  <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2]" />
                </Link>

                {/* 2. Gold Outlined Pill: Secondary CTA */}
                <Link
                  href={active.ctaSecondary.href}
                  className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black/40 hover:bg-black/60 border border-[#D4AF37]/80 hover:border-[#D4AF37] text-[#E5C378] hover:text-[#FFF1C5] font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-sans shadow-md"
                >
                  <active.ctaSecondary.icon className="w-4 h-4 text-[#E5C378]" />
                  <span>{active.ctaSecondary.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#E5C378]" />
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. PAGINATION INDICATORS (Slide Bars)
         ══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === idx
                ? 'w-8 h-2 bg-gradient-to-r from-[#D4AF37] to-[#FFF1C5] shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
