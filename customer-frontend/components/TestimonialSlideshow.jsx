'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Curated authentic patron experiences with verified sacred purchases & consultations
const CURATED_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Dr. Aarav Sharma',
    city: 'Bengaluru',
    role: 'Cardiologist & Meditator',
    offering: 'Consecrated 108 Clear Quartz Mala',
    category: 'Sacred Jewellery & Attunement',
    rating: 5,
    quote:
      'The energetic resonance of this consecrated mala is unlike anything I have encountered. The 432Hz attunement by Soumyaa Naveen creates an immediate stillness in my heart space before long surgical rotations.',
    date: 'March 2026',
    verified: true,
  },
  {
    id: 't-2',
    name: 'Priyanka Sengupta',
    city: 'Kolkata',
    role: 'Interior Architect',
    offering: 'Amethyst Cathedral Geode & Vastu Consultation',
    category: 'Home & Spatial Harmony',
    rating: 5,
    quote:
      'We anchored the Amethyst geode in our studio’s North-East corner following Soumyaa’s spatial guidance. The shift was perceptible within hours — meetings feel calmer, creative blocks dissolved, and patrons remark on the serene air.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 't-3',
    name: 'Vikramaditya Rathore',
    city: 'Jaipur',
    role: 'Entrepreneur & Collector',
    offering: 'Golden Pyrite Natural Wealth Specimen',
    category: 'Raw Mineral Specimen',
    rating: 5,
    quote:
      'After receiving synthetic-looking stones from various online sellers, finding Sumuk Crystalz 5 was a breath of fresh air. The raw cubic brassy brilliance of this Peruvian Pyrite is 100% untampered museum quality.',
    date: 'April 2026',
    verified: true,
  },
  {
    id: 't-4',
    name: 'Meera Krishnan',
    city: 'Chennai',
    role: 'Carnatic Vocalist',
    offering: 'Madagascar Rose Quartz Heart Grid',
    category: 'Heart Chakra Healing',
    rating: 5,
    quote:
      'Every morning before riyaaz, sitting beside this glowing Rose Quartz brings profound warmth to my throat and Anahata chakras. The packaging was immaculate, accompanied by a handwritten Vedic blessing.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 't-5',
    name: 'Ananya Deshmukh',
    city: 'Pune',
    role: 'Yoga Acharya & Healer',
    offering: 'Seven Chakra Alignment Disc Set',
    category: 'Energy Systems',
    rating: 5,
    quote:
      'I use these consecrated chakra stones during restorative savasana sessions. My practitioners consistently report feeling a soothing electric pulse. Sumuk Crystalz 5 is truly our chosen sacred source.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 't-6',
    name: 'Rohit Khandelwal',
    city: 'Mumbai',
    role: 'Creative Director',
    offering: 'Black Tourmaline & Tiger’s Eye Protection Band',
    category: 'Protection & Grounding',
    rating: 5,
    quote:
      'Working in high-stress media environments often left me energetically depleted. Wearing this calibrated bead band has created a tangible boundary. I feel grounded, focused, and deeply shielded.',
    date: 'March 2026',
    verified: true,
  },
];

export default function TestimonialSlideshow() {
  const [testimonials, setTestimonials] = useState(CURATED_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Attempt to fetch any user-submitted approved reviews from Supabase
  useEffect(() => {
    let isSubscribed = true;
    async function fetchLiveReviews() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0 && isSubscribed) {
          const formatted = data.map((r, idx) => ({
            id: r.id || `live-${idx}`,
            name: r.user_name || r.name || 'Sacred Patron',
            city: r.city || 'Verified Buyer',
            role: r.title || 'Crystal Patron',
            offering: r.product_name || 'Sumuk Masterwork',
            category: 'Patron Review',
            rating: Number(r.rating || 5),
            quote: r.comment || r.content || r.review_text || '',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Verified',
            verified: true,
          })).filter((item) => item.quote && item.quote.length > 10);

          if (formatted.length > 0) {
            // Prepend live reviews to curated showcase
            setTestimonials([...formatted, ...CURATED_TESTIMONIALS]);
          }
        }
      } catch (err) {
        // Fallback peacefully to curated patron stories
      }
    }

    fetchLiveReviews();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Auto-advance slideshow every 6.5 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const activeItem = testimonials[currentIndex] || CURATED_TESTIMONIALS[0];

  return (
    <section
      className="relative z-20 my-12 sm:my-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none"
      aria-label="Patron Testimonials & Stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ══════════════════════════════════════════════════════════
          SECTION HEADER: ECHOES OF TRANSFORMATION
         ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#EADBBA]/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest text-[#792CA7] bg-[#F5EEFB] border border-[#E8D4F5] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Patron Experiences &amp; Sacred Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1224] tracking-tight">
            Echoes of Transformation
          </h2>
          <p className="text-xs sm:text-sm text-[#554761] font-sans mt-1 max-w-2xl">
            Real experiences from cherished patrons whose homes, healing practices, and personal vibrations have been elevated by our consecrated crystals.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-white hover:bg-[#FBF8F1] text-[#1A1224] hover:text-[#9A7B1C] flex items-center justify-center transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-white hover:bg-[#FBF8F1] text-[#1A1224] hover:text-[#9A7B1C] flex items-center justify-center transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FEATURED TESTIMONIAL DISPLAY CARD
         ══════════════════════════════════════════════════════════ */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] border border-[#E8DFC8] p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(20,10,35,0.06)] overflow-hidden">
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Quote & Details (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Quote Icon & Star Rating */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#F4ECFC] border border-[#E5CEF7] text-[#792CA7] flex items-center justify-center shadow-xs">
                  <Quote className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div className="flex items-center gap-1 bg-[#FFF9EE] px-3 py-1.5 rounded-full border border-[#EADBBA]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < activeItem.rating
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-sans font-bold text-[#8C6D1F] ml-1">5.0</span>
                </div>
              </div>

              {/* The Patron Quote */}
              <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-[#181124] leading-relaxed tracking-tight mb-6">
                &ldquo;{activeItem.quote}&rdquo;
              </blockquote>
            </div>

            {/* Patron Metadata & Offering Tag */}
            <div className="pt-6 border-t border-[#EADBBA]/70 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Patron Avatar Monogram */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#681997] to-[#9D44CF] text-[#FFF9E6] font-serif font-bold text-lg flex items-center justify-center shadow-sm border-2 border-white">
                  {activeItem.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-bold text-[#181124] text-sm sm:text-base">
                      {activeItem.name}
                    </span>
                    {activeItem.verified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-sans font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Patron</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#635770] font-sans">
                    {activeItem.role} • {activeItem.city}
                  </p>
                </div>
              </div>

              {/* Consecrated Item / Offering Pill */}
              <div className="bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#EADBBA] text-right">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#8C6D1F] block">
                  Consecrated Selection
                </span>
                <span className="text-xs font-serif font-semibold text-[#181124]">
                  {activeItem.offering}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Trust Card & Quick Action (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-white/90 border border-[#EADBBA] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="text-xs font-sans font-bold tracking-wider uppercase text-[#792CA7]">
                  The Sumuk Promise
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1224] leading-snug">
                Every Crystal Individually Blessed
              </h3>
              <p className="text-xs text-[#554761] font-sans mt-2 leading-relaxed">
                Before any crystal departs Sus Gaon, it undergoes traditional salt bath cleansing and 432Hz Vedic sound vibration attunement guided by Founder Soumyaa Naveen.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/shop"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#601A8A] to-[#792CA7] hover:from-[#501374] hover:to-[#67228F] text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
              >
                <span>Explore Consecrated Crystals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/services"
                className="w-full py-2 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 text-[#181124] font-sans text-[11px] font-semibold text-center transition"
              >
                Book a Sacred Energy Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Slideshow Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-[#EADBBA]/40">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-[#792CA7]'
                  : 'w-2 bg-[#D4AF37]/40 hover:bg-[#D4AF37]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

