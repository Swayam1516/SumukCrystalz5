'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Leaf,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import DirectFounderContactSection from './DirectFounderContactSection';

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-[#FAF7F2] text-[#1F1A15] border-t border-[#EAE3D5] select-none z-20">
      {/* Top Hairline Amber Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

      {/* Main Luxury Direct Founder Contact & Sanctuary Section */}
      <DirectFounderContactSection />

      {/* BOTTOM TRUST ROW (Light Luxury Champagne Theme) */}
      <div className="w-full border-t border-[#EAE3D5] bg-[#F7F3EB] py-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-[1540px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5C5245]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-[#1F1A15]">Worldwide Consultations</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-[#1F1A15]">Ethically Mined Crystals</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-[#1F1A15]">Authenticity Guaranteed</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span className="font-semibold text-[#1F1A15]">Positive Energy Always</span>
            </span>
          </div>

          <p className="text-[11px] text-[#6B6357] font-mono">
            &copy; {new Date().getFullYear()} Sumuk Crystalz 5. All rights reserved. Curated with devotion by Soumyaa Naveen.
          </p>
        </div>
      </div>

      {/* CREATED BY FOOTER TITLE */}
      <div className="w-full border-t border-[#EAE3D5] bg-[#ECE5D8] py-3.5 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs sm:text-sm font-mono tracking-wider font-bold text-[#8C6208]">
          createdby : SWAYAM A H work at:<a href="mailto:swayamh16@gmail.com" className="underline hover:text-black transition ml-1 font-extrabold">swayamh16@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
