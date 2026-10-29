'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, X, Volume2, ShieldCheck } from 'lucide-react';

/**
 * IntroductorySacredBanner
 * Displays the sacred Lord Ganesha "WELCOME TO SUMUK CRYSTALZ 5" introductory banner
 * before starting the UI, with smooth entrance, auto-dismiss option, and re-open capability.
 */
export default function IntroductorySacredBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    setMounted(true);

    // Check if user has already entered in this browser session
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('sumuk_sacred_intro_seen') === 'true';
    } catch (_) {}

    // Check query param for explicit forced display: ?welcome=1 or ?intro=1
    const searchParams = new URLSearchParams(window.location.search);
    const forceShow = searchParams.get('welcome') === '1' || searchParams.get('intro') === '1';

    if (!alreadySeen || forceShow) {
      setIsOpen(true);
    }

    // Listen for custom event to re-open the sacred blessing at any time
    const handleOpen = () => {
      setIsDismissing(false);
      setIsOpen(true);
    };

    window.addEventListener('open-sacred-intro', handleOpen);
    return () => {
      window.removeEventListener('open-sacred-intro', handleOpen);
    };
  }, []);

  // Countdown timer for automatic soft entrance
  useEffect(() => {
    if (!isOpen || isDismissing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleEnterSanctuary();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isDismissing]);

  const handleEnterSanctuary = () => {
    setIsDismissing(true);
    try {
      sessionStorage.setItem('sumuk_sacred_intro_seen', 'true');
    } catch (_) {}

    // Allow smooth fade-out before unmounting
    setTimeout(() => {
      setIsOpen(false);
      setIsDismissing(false);
    }, 600);
  };

  // Keyboard escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleEnterSanctuary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Sumuk Crystalz 5 Sacred Blessing"
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-2xl transition-all duration-700 ${
        isDismissing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Ambient Spiritual Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-purple-700/20 to-amber-500/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Main Banner Card */}
      <div className="relative max-w-sm sm:max-w-md w-full bg-[#0C0812] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(212,175,55,0.25)] flex flex-col my-auto animate-fade-in">
        
        {/* Top Header Bar with Close / Skip */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E5C378] font-bold">
              Sacred Sanctuary Blessing
            </span>
          </div>

          <button
            type="button"
            onClick={handleEnterSanctuary}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px] font-mono px-2.5"
            title="Skip to Sanctuary"
            aria-label="Skip to Sanctuary"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The Welcome Ganesha Artwork */}
        <div className="relative w-full aspect-[9/16] max-h-[68vh] sm:max-h-[72vh] overflow-hidden bg-black flex items-center justify-center">
          <Image
            src="/images/welcome-ganesha-intro.jpg"
            alt="Welcome to Sumuk Crystalz 5 - Sacred Lord Ganesha Blessing and Consecrated Crystals"
            fill
            priority
            sizes="(max-width: 640px) 95vw, 480px"
            className="object-cover sm:object-contain object-center transition-transform duration-1000 hover:scale-102"
          />

          {/* Soft Bottom Vignette for seamless button contrast */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C0812] via-[#0C0812]/80 to-transparent pointer-events-none" />
        </div>

        {/* Action Controls & Enter Button */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#0C0812] to-[#07050A] border-t border-white/[0.08] text-center space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs text-[#E5C378] font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Consecrated by Usui Reiki Master Soumyaa Naveen</span>
          </div>

          <p className="text-[11px] text-stone-400 font-sans max-w-xs mx-auto leading-relaxed">
            High-Vibrational Natural Gemstones &bull; Sound Attuned &bull; Ethical Sourcing
          </p>

          {/* Primary Call-to-Action to Enter the Sanctuary */}
          <button
            type="button"
            onClick={handleEnterSanctuary}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:from-[#c59e2f] hover:to-[#dfbe52] text-stone-950 font-mono font-extrabold text-xs uppercase tracking-[0.18em] shadow-[0_8px_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-950 stroke-[2.2]" />
            <span>ENTER SANCTUARY</span>
            <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2]" />
          </button>

          {/* Auto-enter status indicator */}
          <div className="text-[10px] text-stone-500 font-mono flex items-center justify-center gap-1.5 pt-1">
            <span>Entering in {countdown}s</span>
            <span>&bull;</span>
            <button
              type="button"
              onClick={handleEnterSanctuary}
              className="hover:text-stone-300 underline cursor-pointer"
            >
              Click anywhere to proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
