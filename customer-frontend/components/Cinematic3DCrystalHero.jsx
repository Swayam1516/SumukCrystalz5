'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { ProceduralCrystal } from './ProceduralCrystal';
import {
  ArrowRight,
  Sparkles,
  Crown,
  User,
  Heart,
  MapPin,
  Bell,
  Compass,
  RotateCw,
} from 'lucide-react';

const HERO_CRYSTALS = [
  { id: 'Amethyst', label: 'Amethyst', type: 'Peace & Intuition', color: '#8B5CF6' },
  { id: 'Pyrite', label: 'Pyrite', type: 'Abundance & Manifestation', color: '#D97706' },
  { id: "Tiger's Eye", label: "Tiger's Eye", type: 'Courage & Focus', color: '#B45309' },
  { id: 'Rose Quartz', label: 'Rose Quartz', type: 'Heart Harmony', color: '#EC4899' },
  { id: 'Clear Quartz', label: 'Clear Quartz', type: 'Master Amplifier', color: '#E2E8F0' },
  { id: 'Black Obsidian', label: 'Black Obsidian', type: 'Shielding & Grounding', color: '#475569' },
];

function CrystalScene({ activeCrystal }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFF8E7" castShadow />
      <directionalLight position={[-5, -4, -4]} intensity={0.8} color="#C4B5FD" />
      <pointLight position={[0, 4, 3]} intensity={1.4} color="#FDE68A" />

      <Center>
        <ProceduralCrystal crystalType={activeCrystal} scale={1.5} />
      </Center>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        dampingFactor={0.05}
      />
    </>
  );
}

export default function Cinematic3DCrystalHero() {
  const [activeCrystalIndex, setActiveCrystalIndex] = useState(0);
  const [show3DInteractive, setShow3DInteractive] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const activeCrystal = HERO_CRYSTALS[activeCrystalIndex];

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleOpenAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] bg-[#08060B] text-white overflow-hidden flex flex-col justify-between pt-10 sm:pt-16 pb-8 px-4 sm:px-8 lg:px-12 select-none">
      {/* Background Subtle Ambiance (Deep violet purple rim aura behind specimen) */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Responsive Hero Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 flex-1 my-auto">
        
        {/* LEFT COLUMN: Editorial Luxury Narrative */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge: Ethically Sourced Sus Gaon, Pune */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-stone-700/60 text-[#E5C378] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>ETHICALLY SOURCED &bull; SUS GAON, PUNE</span>
          </div>

          {/* Headline Matching Exact Screenshot */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-bold text-white tracking-tight leading-[1.02] uppercase font-sans">
            AUTHENTIC <br />
            HIGH-VIBRATIONAL <br />
            <span className="font-serif italic font-normal text-stone-200 lowercase first-letter:uppercase block leading-[1.08] mt-1">
              Natural Minerals.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl font-light">
            Each raw specimen and hand-crafted masterwork is personally curated by Usui Reiki Master{' '}
            <strong className="text-white font-medium">Soumyaa Naveen</strong> and cleansed with pure sound resonance
            to elevate your sanctuary.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Primary Solid White Pill */}
            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-stone-950 stroke-[2.2]" />
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.2]" />
            </Link>

            {/* Secondary Outline Pill */}
            <Link
              href="/services"
              className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/[0.08] border border-stone-600/80 text-white font-mono text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
            >
              <span>CONSULTATION SERVICES</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: The Glowing Amethyst Crystal Specimen on Dark Rock */}
        <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
          {show3DInteractive && hasWebGL ? (
            /* Interactive Three.js 3D Mode */
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-black/40 border border-white/10">
              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <CrystalScene activeCrystal={activeCrystal.id} />
                </Suspense>
              </Canvas>

              <div className="absolute top-3 right-3 z-20">
                <button
                  type="button"
                  onClick={() => setShow3DInteractive(false)}
                  className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono uppercase tracking-wider text-stone-300 hover:text-white transition"
                >
                  View Photo
                </button>
              </div>

              <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-stone-400 backdrop-blur-md">
                  <Compass className="w-3 h-3 text-[#D4AF37]" />
                  <span>Interactive 3D &bull; Drag to rotate</span>
                </span>
              </div>
            </div>
          ) : (
            /* Exact Specimen Visual Matching the Screenshot */
            <div className="relative w-full h-full flex items-center justify-center group">
              <div className="relative w-full h-full max-w-[480px] max-h-[460px] flex items-center justify-center">
                <Image
                  src="/images/hero-amethyst-crystal.jpg"
                  alt="Authentic Glowing Amethyst Natural Specimen - Sumuk Crystalz 5"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                  className="object-contain filter drop-shadow-[0_15px_35px_rgba(147,51,234,0.35)] transition-transform duration-700 group-hover:scale-102"
                />

                {/* 3D Spin Toggle Button */}
                {hasWebGL && (
                  <button
                    type="button"
                    onClick={() => setShow3DInteractive(true)}
                    className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-stone-300 hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                    title="Rotate 3D Crystal Model"
                  >
                    <RotateCw className="w-3 h-3 text-[#E5C378]" />
                    <span>3D Spin</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM REGISTER BAR & FLOATING ASSISTANT (Matching Screenshot Exactly) */}
      <div className="max-w-7xl mx-auto w-full pt-8 sm:pt-12 mt-6 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
        {/* Left Links: Collector Profile, Saved Wishlist, Saved Sanctuaries, Notifications */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-400 font-sans">
          <Link href="/account" className="flex items-center gap-2 hover:text-white transition">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>Collector Profile</span>
          </Link>

          <Link href="/shop" className="flex items-center gap-2 hover:text-white transition">
            <Heart className="w-3.5 h-3.5 text-stone-400" />
            <span>Saved Wish list</span>
          </Link>

          <Link href="/about" className="flex items-center gap-2 hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>Saved Sanctuaries</span>
          </Link>

          <span className="hidden sm:inline-block text-stone-600">|</span>

          <div className="flex items-center gap-2 text-stone-400">
            <Bell className="w-3.5 h-3.5 text-stone-400" />
            <span>Notifications &amp; Vedic Alerts</span>
          </div>
        </div>

        {/* Right: Floating Pill Widget for Sumuk Assistant */}
        <button
          type="button"
          onClick={handleOpenAssistant}
          className="self-end lg:self-auto px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-900 shadow-2xl flex items-center gap-3 border border-stone-200/50 hover:scale-[1.02] transition-transform cursor-pointer"
          aria-label="Open Sumuk Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-stone-900 font-mono">
              <span>SUMUK ASSISTANT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-stone-500 font-sans">
              Sacred Consecrated AI Guide
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-700 ml-1 stroke-[2.2]" />
        </button>
      </div>
    </section>
  );
}
