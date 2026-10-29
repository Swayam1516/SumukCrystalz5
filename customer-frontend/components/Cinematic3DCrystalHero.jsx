'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Sparkles } from '@react-three/drei';
import { ProceduralCrystal } from './ProceduralCrystal';
import { ArrowRight, Sparkles as SparklesIcon, Compass, ShieldCheck } from 'lucide-react';

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
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFF8E7" castShadow />
      <directionalLight position={[-5, -4, -4]} intensity={0.6} color="#C4B5FD" />
      <pointLight position={[0, 4, 3]} intensity={1.2} color="#FDE68A" />

      <Center>
        <ProceduralCrystal crystalType={activeCrystal} scale={1.4} />
      </Center>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        dampingFactor={0.05}
      />
    </>
  );
}

export default function Cinematic3DCrystalHero() {
  const [activeCrystalIndex, setActiveCrystalIndex] = useState(0);
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

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen bg-gradient-to-b from-[#140C1D] via-[#1B1226] to-[#0F0D15] text-[#FAF8F5] overflow-hidden flex flex-col justify-between py-12 lg:py-20 select-none">
      {/* Subtle atmospheric ambient backdrops (no gaudy neon radial splashes) */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 flex-1 my-auto">
        {/* Left Column: Editorial Luxury Headline & Narrative */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Subtle Verified Origin Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-mono uppercase tracking-[0.22em] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>ETHICALLY SOURCED &bull; SUS GAON, PUNE</span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Authentic High-Vibrational{' '}
            <span className="italic font-serif text-[#E5C378] block">Natural Minerals.</span>
          </h1>

          {/* Concise, Grounded Description (No pseudo-scientific hyperbole) */}
          <p className="text-sm sm:text-base text-stone-300 font-sans-ui max-w-xl leading-relaxed font-light">
            Each raw specimen and hand-crafted masterwork is personally curated by Usui Reiki Master{' '}
            <strong className="text-white font-medium">Soumyaa Naveen</strong> and cleansed with pure sound resonance
            to elevate your sanctuary.
          </p>

          {/* Primary Action Button (Single dominant CTA) */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#DFBF58] to-[#C59B27] hover:brightness-110 active:scale-98 text-stone-950 font-bold text-xs uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(212,175,55,0.25)] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.5]" />
            </Link>

            <Link
              href="/services"
              className="px-6 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-stone-200 border border-white/10 text-xs font-mono uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <span>Consultation Services</span>
            </Link>
          </div>

          {/* Interactive Crystal Selector Badges */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
              Explore 3D Facets:
            </span>
            <div className="flex flex-wrap gap-2">
              {HERO_CRYSTALS.map((c, idx) => {
                const isActive = activeCrystalIndex === idx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCrystalIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#D4AF37] text-stone-950 font-bold shadow-md scale-105'
                        : 'bg-white/[0.04] text-stone-300 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Genuine 3D Crystal Interactive Stage */}
        <div className="lg:col-span-6 relative w-full h-[360px] sm:h-[440px] lg:h-[540px] flex items-center justify-center">
          {hasWebGL ? (
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
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

              {/* Interaction Hint Overlay */}
              <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-stone-400 backdrop-blur-md">
                  <Compass className="w-3 h-3 text-[#D4AF37]" />
                  <span>Interactive 3D &bull; Drag to rotate</span>
                </span>
              </div>
            </div>
          ) : (
            /* Graceful Fallback if WebGL unavailable */
            <div className="w-full h-full rounded-3xl bg-black/40 border border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-48 h-48 rounded-full bg-purple-900/40 border border-[#D4AF37]/30 flex items-center justify-center shadow-2xl">
                <SparklesIcon className="w-16 h-16 text-[#D4AF37]" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white">{activeCrystal.label}</h3>
              <p className="text-xs text-stone-400">{activeCrystal.type}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
