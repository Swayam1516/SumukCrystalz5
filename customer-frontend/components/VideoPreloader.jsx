'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * VideoPreloader Component
 * 
 * Flow:
 * 1. Stage 'playing': Video 1 plays full-screen as the cinematic preloader/loading screen.
 *    The title is completely hidden during this playback.
 * 2. Stage 'title_reveal': Triggers ONLY AFTER Video 1 finishes playing / preloader completes.
 *    The grand title "WELCOME TO SUMUK CRYSTALZ 5" is revealed with sacred aura & blessing quote.
 * 3. Stage 'fading_out': Dissolves seamlessly into the interactive storefront (Video 2).
 */
export default function VideoPreloader({
  videoSrc = '/videos/video1.mp4',
  altVideoSrc = '/videos/Video 1.mp4',
  mainTitle = 'WELCOME TO SUMUK CRYSTALZ 5',
  subtitle = 'SACRED ENERGY & INTENTIONAL HEALING STONES',
  onComplete,
}) {
  const [stage, setStage] = useState('playing'); // 'playing' | 'title_reveal' | 'fading_out' | 'hidden'
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const holdTimerRef = useRef(null);

  useEffect(() => {
    // Check if user has already seen preloader in this session
    const hasSeen =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('sumuk_has_seen_preloader_v3');
    if (hasSeen) {
      setStage('hidden');
      if (onComplete) onComplete();
      return;
    }

    // Lock background scroll during preloader
    document.body.style.overflow = 'hidden';

    // Track simulated loading progress for the loading bar
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Fallback timer in case video end event is delayed (e.g. 5.5s)
    fallbackTimerRef.current = setTimeout(() => {
      triggerTitleReveal();
    }, 5500);

    return () => {
      clearInterval(interval);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      document.body.style.overflow = '';
    };
  }, []);

  // Triggered strictly upon completion of Video 1 preloader
  const triggerTitleReveal = () => {
    setStage((currentStage) => {
      if (currentStage === 'title_reveal' || currentStage === 'fading_out' || currentStage === 'hidden') {
        return currentStage;
      }

      // Hold the title reveal for 2.6 seconds so the customer can appreciate the luxury branding
      holdTimerRef.current = setTimeout(() => {
        triggerExit();
      }, 2600);

      return 'title_reveal';
    });
  };

  const triggerExit = () => {
    setStage('fading_out');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sumuk_has_seen_preloader_v3', 'true');
    }

    setTimeout(() => {
      setStage('hidden');
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 1200);
  };

  const handleVideoEnded = () => {
    // Video 1 finished playing -> reveal the title now!
    triggerTitleReveal();
  };

  const handleVideoError = () => {
    triggerTitleReveal();
  };

  if (stage === 'hidden') return null;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[99999] w-screen h-screen bg-[#050505] overflow-hidden flex items-center justify-center transition-all duration-1200 ease-in-out select-none ${
        stage === 'fading_out'
          ? 'opacity-0 pointer-events-none scale-105 filter blur-sm'
          : 'opacity-100'
      }`}
      aria-hidden={stage === 'hidden'}
    >
      {/* Background Video 1 Curtain */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform scale-100 ${
          stage === 'title_reveal' ? 'brightness-[0.35] scale-105 blur-[3px]' : 'brightness-90'
        }`}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        {altVideoSrc && <source src={altVideoSrc} type="video/mp4" />}
      </video>

      {/* Cinematic Vignette & Obsidian Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

      {/* STAGE 1: Minimalist Preloader Indicator (Visible ONLY while Video 1 is playing) */}
      {stage === 'playing' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-none animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-200 uppercase font-bold">
              CONSECRATING SANCTUARY &bull; {loadProgress}%
            </span>
          </div>
        </div>
      )}

      {/* STAGE 2: Title Reveal Overlay (Comes strictly AFTER completion of Video 1 preloader) */}
      <div
        className={`relative z-30 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center transition-all duration-1000 transform ${
          stage === 'title_reveal'
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
        }`}
      >
        {/* Sacred Consecration Emblem */}
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-amber-400/50 bg-black/70 backdrop-blur-xl flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.5)] animate-pulse">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          {/* Radiant Aura Glow */}
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl animate-ping opacity-50 pointer-events-none" />
        </div>

        {/* Frequency Attunement Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 border border-amber-400/40 backdrop-blur-md mb-4 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-amber-200 font-bold">
            {subtitle}
          </span>
        </div>

        {/* Majestic Grand Title: WELCOME TO SUMUK CRYSTALZ */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-[0.06em] uppercase leading-[1.05] drop-shadow-[0_12px_40px_rgba(255,255,255,0.45)]">
          {mainTitle}
        </h1>

        {/* Ambient Gold Glowing Underline */}
        <div className="w-36 sm:w-56 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 shadow-[0_0_25px_#f59e0b]" />

        {/* Sacred Reiki Blessing Quote */}
        <p className="mt-5 text-sm sm:text-base md:text-lg font-sans-ui text-neutral-200/95 max-w-2xl leading-relaxed italic drop-shadow-md">
          &ldquo;Remember, you don&rsquo;t simply choose the crystal—the crystal chooses you. Every piece is cleansed, blessed, and infused with sacred Reiki energy before it begins its journey to the soul it was destined to meet.&rdquo;
        </p>

        {/* Stage Indicator Message */}
        <p className="mt-4 text-xs sm:text-sm font-sans-ui text-amber-300 tracking-widest uppercase font-mono font-bold opacity-90 animate-pulse">
          • Entering Sacred Sanctuary •
        </p>
      </div>

      {/* Manual Skip / Enter Action (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={triggerExit}
          className="group text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] text-white/90 hover:text-white bg-black/70 hover:bg-black/95 backdrop-blur-xl border border-white/25 hover:border-amber-400/70 rounded-full px-5 py-2.5 transition-all duration-300 shadow-2xl flex items-center gap-2.5 cursor-pointer"
        >
          <span>Enter Sanctuary</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
        </button>
      </div>

      {/* Bottom Cinematic Loading Filament */}
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10 z-40">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-200"
          style={{
            animation: 'curtain-progress 5.5s cubic-bezier(0.1, 0.5, 0.2, 1) forwards',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes curtain-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
