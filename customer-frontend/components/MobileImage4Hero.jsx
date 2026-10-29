'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCart';
import { useAuthStore } from '../store/useAuth';
import {
  Search,
  Mic,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Volume2,
} from 'lucide-react';

export default function MobileImage4Hero() {
  const router = useRouter();
  const { openDrawer, getTotalCount } = useCartStore();
  const { user, openAuthModal } = useAuthStore();
  const [greeting, setGreeting] = useState('Good Morning ☀️');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const cartCount = getTotalCount();

  // Dynamic greeting based on current local client time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning ☀️');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon ☀️');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening 🌙');
      } else {
        setGreeting('Good Night ✨');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  // Microphone Voice Search using Web Speech API
  const handleMicClick = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please type your search query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          router.push(`/shop?q=${encodeURIComponent(transcript)}`);
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#1F1A15] border-b border-[#EAE3D5]">
      {/* ── Background Hero Image (Rose Quartz in soft sunlight matching Image 4) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/mobile-rose-quartz-hero.jpg"
          alt="Rose Quartz Crystal Radiating Positive Facets"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center filter brightness-[1.03] contrast-[1.02]"
        />
        {/* Soft Warm Radial Vignette to keep typography crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/90 via-[#FDFBF7]/40 to-[#FAF7F2]/95" />
      </div>

      {/* ── Main Mobile Hero Content ── */}
      <div className="relative z-10 px-5 pt-8 pb-10 flex flex-col justify-between min-h-[580px] max-w-lg mx-auto">
        
        {/* Top Text Header */}
        <div className="space-y-3 pt-2">
          {/* Time-based Greeting */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans-ui font-semibold text-[#8C6208] tracking-wide">
            <span>{greeting}</span>
          </div>

          {/* Main Title: ROSE QUARTZ in Editorial Luxury Serif */}
          <h1 className="font-editorial text-4xl sm:text-5xl font-extrabold text-[#1F1A15] tracking-[0.04em] uppercase leading-[1.05]">
            ROSE<br />QUARTZ
          </h1>

          {/* Exact Subtitle line from Image 4 */}
          <div className="pt-1">
            <div className="w-14 h-[2px] bg-[#B45309] mb-2" />
            <p className="font-serif text-sm sm:text-base text-[#4A3E31] font-medium tracking-wide">
              Crystal Radiating Positive Facets
            </p>
          </div>
        </div>

        {/* Central / Bottom Interactive Search & Action Controls */}
        <div className="space-y-4 pt-16">
          
          {/* Synchronized Pill Search Bar with Microphone */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full bg-white/95 backdrop-blur-xl rounded-full border border-amber-300/60 shadow-[0_8px_25px_rgba(180,130,40,0.14)] p-1.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/30"
          >
            <div className="pl-3.5 pr-2 text-stone-500">
              <Search className="w-5 h-5 text-amber-700/80" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crystals, bracelets, malas..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#1F1A15] placeholder-stone-500 focus:outline-none font-sans-ui"
            />

            {/* Mic Voice Search Button */}
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-900 shadow-sm'
              }`}
              title="Voice Search"
              aria-label="Search with voice"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>

          {/* Primary Action Button: EXPLORE SANCTUARY SHOP > */}
          <Link
            href="/shop"
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#F5B041] via-[#E59866] to-[#D4AC0D] hover:from-[#E59866] hover:to-[#B7950B] text-stone-950 font-mono font-extrabold text-xs tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(212,175,55,0.4)] transition-all active:scale-[0.98]"
          >
            <span>EXPLORE SANCTUARY SHOP</span>
            <ChevronRight className="w-4 h-4 text-stone-950" />
          </Link>

          {/* Secondary Action Button: ✨ ACQUIRE BLESSINGS > */}
          <Link
            href="/shop?filter=energy:numerology"
            className="w-full py-3 px-6 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#B45309]/60 text-[#8C6208] hover:text-[#5B3E03] font-mono font-bold text-xs tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-[#B45309]" />
            <span>ACQUIRE BLESSINGS</span>
            <ChevronRight className="w-4 h-4 text-[#B45309]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
