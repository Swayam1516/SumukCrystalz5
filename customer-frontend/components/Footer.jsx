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
    <footer className="w-full relative overflow-hidden bg-[#F8F6F2] text-[#29242D] border-t border-[#EAE2F2] select-none z-20 font-sans">
      {/* Top Hairline Gold Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A65E]/60 to-transparent pointer-events-none" />

      {/* Main Luxury Direct Founder Contact & Sanctuary Section */}
      <DirectFounderContactSection />

      {/* BOTTOM TRUST ROW (Light Luxury Ivory/Lavender Theme) */}
      <div className="w-full border-t border-[#EAE2F2] bg-white/70 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-[1540px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#29242D]/80">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C8A65E]" />
              <span className="font-semibold text-[#29242D]">Worldwide Consultations</span>
            </span>
            <span className="text-[#EAE2F2]">|</span>
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-[#29242D]">Ethically Mined Crystals</span>
            </span>
            <span className="text-[#EAE2F2]">|</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#79539B]" />
              <span className="font-semibold text-[#29242D]">Authenticity Guaranteed</span>
            </span>
            <span className="text-[#EAE2F2]">|</span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span className="font-semibold text-[#29242D]">Positive Energy Always</span>
            </span>
          </div>

          <p className="text-[11px] text-[#29242D]/60 font-sans">
            &copy; {new Date().getFullYear()} Sumuk Crystalz 5. All rights reserved. Curated with devotion by Soumyaa Naveen.
          </p>
        </div>
      </div>

      {/* CREATED BY FOOTER TITLE */}
      <div className="w-full border-t border-[#EAE2F2] bg-[#EAE2F2]/40 py-3 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs sm:text-sm tracking-wider font-semibold text-[#79539B]">
          createdby : SWAYAM A H &bull; work at: <a href="mailto:swayamh16@gmail.com" className="underline hover:text-[#29242D] transition ml-1 font-bold">swayamh16@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
