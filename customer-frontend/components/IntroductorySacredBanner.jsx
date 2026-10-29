'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, X, Volume2 } from 'lucide-react';

/**
 * Cinematic 3D Ganesha Opening Experience
 * Sumuk Crystalz 5 — Sacred Sanctuary Consecration & Opening Experience
 * 
 * Features:
 * - Full-screen immersive 2.5D cinematic opening scene
 * - Lord Ganesha blessing the luxury amethyst, clear quartz, rose quartz, and pyrite cluster
 * - Ornate golden temple background with radiant halo, volumetric light rays, and brass diyas
 * - 5-second choreographed cinematic camera push-in, floating golden dust & lotus petals
 * - Golden typography illumination for "Welcome to SUMUK CRYSTALZ"
 * - Responsive 16:9 desktop & 9:16 portrait mobile masterwork assets
 * - Accessible Skip option & auto-transition to homepage
 * - Session-level storage policy so it never obstructs product, cart, or checkout routes
 */
export default function IntroductorySacredBanner() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0); // 0: dark/reveal, 1: zoom/halo, 2: text shimmer, 3: hold/exit
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Initialize and check session policy
  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    // Check if user has already entered in this browser session
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('sumuk_ganesha_intro_seen') === 'true';
    } catch (_) {}

    // Check query param for explicit forced display: ?welcome=1 or ?intro=1
    const searchParams = new URLSearchParams(window.location.search);
    const forceShow = searchParams.get('welcome') === '1' || searchParams.get('intro') === '1';

    // Only auto-trigger on the root homepage '/' if not seen yet, or if forced
    const isHomepage = pathname === '/' || pathname === '';

    if ((isHomepage && !alreadySeen) || forceShow) {
      setIsOpen(true);
    }

    // Listen for custom event to re-open the sacred blessing at any time
    const handleReopen = () => {
      setIsDismissing(false);
      setStage(0);
      setProgress(0);
      setIsOpen(true);
    };

    window.addEventListener('open-sacred-intro', handleReopen);
    return () => {
      window.removeEventListener('open-sacred-intro', handleReopen);
    };
  }, [pathname]);

  // Choreographed 5.0 Second Animation Timeline
  useEffect(() => {
    if (!isOpen || isDismissing) return;

    // Timeline duration in ms
    const totalDuration = isReducedMotion ? 2500 : 5000;
    const intervalTime = 50;
    const step = (intervalTime / totalDuration) * 100;

    // Stage progression
    // 0.0 - 0.8s: Stage 0 (Fade in temple & initial light)
    // 0.8 - 2.0s: Stage 1 (Camera push-in, halo brightens, floating petals)
    // 2.0 - 3.5s: Stage 2 (Reveal "Welcome to SUMUK CRYSTALZ" with gold shimmer)
    // 3.5 - 5.0s: Stage 3 (Hold complete composition, soft glow, transition)
    const stage1Time = isReducedMotion ? 400 : 800;
    const stage2Time = isReducedMotion ? 1000 : 2000;
    const stage3Time = isReducedMotion ? 1800 : 3500;

    const t1 = setTimeout(() => setStage(1), stage1Time);
    const t2 = setTimeout(() => setStage(2), stage2Time);
    const t3 = setTimeout(() => setStage(3), stage3Time);

    // Progress bar update
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalTime);

    // Auto-transition to website after total duration
    timerRef.current = setTimeout(() => {
      handleEnterSanctuary();
    }, totalDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(timerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isDismissing, isReducedMotion]);

  const handleEnterSanctuary = () => {
    setIsDismissing(true);
    try {
      sessionStorage.setItem('sumuk_ganesha_intro_seen', 'true');
    } catch (_) {}

    // Smooth luxury fade-out transition into the homepage
    setTimeout(() => {
      setIsOpen(false);
      setIsDismissing(false);
    }, 700);
  };

  // Keyboard navigation listener (ESC or Enter to dismiss)
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
      aria-label="Welcome to Sumuk Crystalz 5 - Cinematic Sacred Opening"
      className={`fixed inset-0 z-[999999] w-screen h-screen overflow-hidden bg-[#05020A] select-none transition-all duration-700 ease-out ${
        isDismissing ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ══════════════════════════════════════════════════════════
          1. 2.5D CINEMATIC CAMERA PUSH-IN STAGE CONTAINER
          ══════════════════════════════════════════════════════════ */}
      <div
        className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-transform ease-out ${
          isReducedMotion
            ? 'scale-100 duration-500'
            : stage >= 1
            ? 'scale-[1.06] duration-[4200ms]'
            : 'scale-100 duration-1000'
        }`}
      >
        {/* DESKTOP 16:9 CINEMATIC MASTERWORK IMAGE */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image
            src="/images/ganesha-opening-desktop.jpg"
            alt="Lord Ganesha blessing luxury crystals in sacred golden temple - Sumuk Crystalz"
            fill
            priority
            quality={98}
            sizes="100vw"
            className="object-cover object-center filter brightness-105"
          />
        </div>

        {/* MOBILE 9:16 PORTRAIT MASTERWORK IMAGE */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          <Image
            src="/images/ganesha-opening-mobile.jpg"
            alt="Lord Ganesha blessing luxury crystals in sacred golden temple - Sumuk Crystalz 5"
            fill
            priority
            quality={98}
            sizes="100vw"
            className="object-cover object-center filter brightness-105"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. SACRED ATMOSPHERIC LIGHTING & 2.5D DEPTH LAYERS
            ══════════════════════════════════════════════════════════ */}
        {/* Deep Temple Perimeter Vignette (seamless blend into borders) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,2,10,0.65)_80%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

        {/* Radiant Golden Halo Glow behind Lord Ganesha */}
        <div
          className={`absolute pointer-events-none transition-all duration-1000 rounded-full blur-[90px] ${
            stage >= 1 ? 'opacity-70 scale-110' : 'opacity-30 scale-90'
          } ${
            // Centered behind Ganesha: desktop vs mobile
            'top-[28%] md:top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[460px] md:w-[560px] h-[320px] sm:h-[460px] md:h-[560px] bg-gradient-to-tr from-amber-400/40 via-yellow-300/35 to-amber-600/20'
          }`}
        />

        {/* Volumetric Warm Golden Light Beams (upper temple arches down to altar) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1500 ${
            stage >= 1 ? 'opacity-40' : 'opacity-10'
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.35) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 75%)',
          }}
        />

        {/* Central Crystal Cluster Ambient Violet/Magenta Radiance */}
        <div
          className={`absolute pointer-events-none rounded-full blur-[80px] transition-all duration-1000 ${
            stage >= 1 ? 'opacity-80 scale-105' : 'opacity-40 scale-95'
          } top-[60%] md:top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[420px] h-[220px] md:h-[280px] bg-gradient-to-tr from-purple-600/35 via-fuchsia-500/25 to-amber-400/20`}
        />

        {/* Shimmering Crystal Specular Flare (Active at stage 2) */}
        {stage >= 2 && (
          <div className="absolute top-[52%] md:top-[56%] left-[49%] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse">
            <div className="w-16 h-16 rounded-full bg-white/40 blur-md" />
            <Sparkles className="w-8 h-8 text-amber-200/90 -mt-12 ml-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            3. FLOATING SACRED GOLDEN DUST & LOTUS PETAL PARTICLES
            ══════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Drifting Golden Energy Particles */}
          {[
            { top: '25%', left: '18%', size: 'w-2 h-2', delay: '0s', dur: '4.5s' },
            { top: '35%', left: '78%', size: 'w-2.5 h-2.5', delay: '0.4s', dur: '5.2s' },
            { top: '65%', left: '14%', size: 'w-1.5 h-1.5', delay: '0.8s', dur: '4.8s' },
            { top: '70%', left: '85%', size: 'w-2 h-2', delay: '0.2s', dur: '5.0s' },
            { top: '48%', left: '26%', size: 'w-1.5 h-1.5', delay: '1.2s', dur: '4.2s' },
            { top: '55%', left: '72%', size: 'w-2 h-2', delay: '0.6s', dur: '4.6s' },
            { top: '80%', left: '42%', size: 'w-2.5 h-2.5', delay: '1.0s', dur: '5.5s' },
            { top: '20%', left: '60%', size: 'w-1.5 h-1.5', delay: '1.4s', dur: '4.0s' },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_8px_rgba(251,191,36,0.8)] ${p.size} animate-pulse`}
              style={{
                top: p.top,
                left: p.left,
                animationDuration: p.dur,
                animationDelay: p.delay,
                opacity: stage >= 1 ? 0.75 : 0.2,
                transition: 'opacity 1s ease-in',
              }}
            />
          ))}

          {/* Drifting Sacred Pink Lotus Petals */}
          {[
            { top: '40%', left: '12%', size: 'w-3 h-2', rot: 'rotate-45', delay: '0.2s' },
            { top: '75%', left: '22%', size: 'w-3.5 h-2.5', rot: '-rotate-12', delay: '0.7s' },
            { top: '72%', left: '76%', size: 'w-3 h-2', rot: 'rotate-30', delay: '0.4s' },
            { top: '30%', left: '84%', size: 'w-2.5 h-2', rot: '-rotate-45', delay: '1.1s' },
          ].map((petal, i) => (
            <div
              key={`petal-${i}`}
              className={`absolute rounded-full bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400/80 blur-[0.4px] ${petal.size} ${petal.rot} shadow-[0_0_6px_rgba(244,114,182,0.6)]`}
              style={{
                top: petal.top,
                left: petal.left,
                animation: `floatPetal 6s ease-in-out infinite`,
                animationDelay: petal.delay,
                opacity: stage >= 1 ? 0.8 : 0,
                transition: 'opacity 1.2s ease-in',
              }}
            />
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            4. GOLDEN BRAND TYPOGRAPHY ILLUMINATION OVERLAY
            "Welcome to SUMUK CRYSTALZ" Shimmer (Active Stage 2 & 3)
            ══════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-x-0 bottom-[14%] sm:bottom-[16%] md:bottom-[12%] flex flex-col items-center justify-center pointer-events-none transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Subtle golden halo glow behind text */}
          <div className="w-[320px] sm:w-[500px] md:w-[650px] h-20 bg-amber-400/20 rounded-full blur-[45px] pointer-events-none" />
          
          {/* Divine Solfeggio / Consecration Micro-Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-[#D4AF37]/50 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#FDE68A] shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-2 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Divine Vedic Consecration &bull; Sus Gaon, Pune</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          5. TOP CONTROLS & PROGRESS BAR
          ══════════════════════════════════════════════════════════ */}
      {/* Golden Hairline Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-black/40 z-30">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF0C2] to-[#D4AF37] transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(212,175,55,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Header Controls: Title & Skip Intro */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto">
        {/* Left: Consecration Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-amber-400/30 backdrop-blur-md text-[11px] font-mono tracking-widest text-amber-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="hidden sm:inline">SACRED BLESSING</span>
          <span className="sm:hidden">BLESSING</span>
        </div>

        {/* Right: Skip Intro Button */}
        <button
          type="button"
          onClick={handleEnterSanctuary}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-white text-xs font-mono uppercase tracking-[0.18em] backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 cursor-pointer"
          title="Skip opening experience and enter sanctuary"
          aria-label="Skip to sanctuary"
        >
          <span>Skip Intro</span>
          <X className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          6. BOTTOM CONTROLS: "ENTER SANCTUARY" CTA PILL
          ══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-4 flex flex-col items-center justify-center gap-2 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={handleEnterSanctuary}
          className="group px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF0C2] to-[#D4AF37] hover:from-[#c59e2f] hover:to-[#dfbe52] text-stone-950 font-mono font-extrabold text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,175,55,0.45)] hover:shadow-[0_12px_45px_rgba(212,175,55,0.7)] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-stone-950 stroke-[2.2]" />
          <span>ENTER SANCTUARY</span>
          <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2] group-hover:translate-x-1 transition-transform" />
        </button>

        <span className="text-[10px] text-stone-400 font-mono tracking-wider">
          Auto-entering in {Math.max(1, Math.ceil((100 - progress) / 20))}s &bull; Click to proceed
        </span>
      </div>

      {/* Scoped CSS Animations for Floating Petals and Sacred Dust */}
      <style jsx>{`
        @keyframes floatPetal {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-24px) translateX(8px) rotate(16deg) scale(1.08);
          }
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
