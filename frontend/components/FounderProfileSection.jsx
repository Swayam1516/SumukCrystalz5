'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Sparkles, 
  Instagram, 
  ShieldCheck, 
  ArrowUpRight, 
  Heart, 
  Gem, 
  CheckCircle2 
} from 'lucide-react';
import { getFounderImageUrl } from '../lib/dynamicProductsService';

export default function FounderProfileSection({
  storagePath = 'founder.jpg',
  customBlurb = null,
}) {
  const [founderImageUrl, setFounderImageUrl] = useState(
    '/images/soumya-profile.jpeg'
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  // Retrieve image from Supabase Storage 'brand-assets' bucket on mount
  useEffect(() => {
    const url = getFounderImageUrl(storagePath);
    if (url) {
      setFounderImageUrl(url);
    }
  }, [storagePath]);

  return (
    <section className="relative overflow-hidden py-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#181722]/90 via-[#121118]/80 to-[#0A0910]/95 border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-8 sm:p-12 overflow-hidden">
          {/* Subtle gold grid/corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/15 to-transparent rounded-bl-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* 1. Founder Photo Frame (Avatar Card) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl group">
                <Image
                  src={founderImageUrl}
                  alt="Soumyaa Naveen - Founder & Mineral Curator"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-90'
                  }`}
                  onLoadingComplete={() => setImageLoaded(true)}
                  priority
                />

                {/* Gradient overlay with credentials */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest font-bold w-fit mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Founder &amp; Mineral Curator</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                    Soumyaa Naveen
                  </h3>
                  <p className="text-xs font-mono text-gray-300 mt-0.5 flex items-center gap-2">
                    <span>Sumuk Crystalz 5</span>
                    <span className="text-[#D4AF37]">@sumukcrystalz5</span>
                  </p>
                </div>

                {/* Verified Founder Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono uppercase text-gray-200 tracking-wider">
                    Verified
                  </span>
                </div>
              </div>

              {/* Social Proof Link */}
              <a
                href="https://www.instagram.com/sumukcrystalz5"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-semibold transition group shadow-md hover:bg-white/[0.08]"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Join Community: @sumukcrystalz5</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2. Narrative & Brand Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono uppercase tracking-widest font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Meet the Visionary Behind the Consecration</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                &ldquo;Every crystal is a conduit of geological memory and sacred intention.&rdquo;
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                {customBlurb ? (
                  <p>{customBlurb}</p>
                ) : (
                  <>
                    <p>
                      <strong className="text-white font-medium">Welcome to Sumuk Crystalz 5.</strong> I&apos;m{' '}
                      <strong className="text-white font-semibold">Soumyaa Naveen</strong>, an Usui
                      Reiki Grandmaster, Aura Analyst, and intuitive mineralogist dedicated to sourcing
                      untouched, high-vibrational earth treasures.
                    </p>
                    <p>
                      Each specimen in our vault—from tranquil Brazilian Amethyst geodes to grounding Golden
                      Pyrite and heart-attuned Rose Quartz—undergoes individual sound cleansing at 528Hz and
                      Vedic sanctification before reaching your sacred space.
                    </p>
                  </>
                )}

                <div className="p-4 rounded-xl bg-white/[0.03] border border-[#D4AF37]/20 text-gray-200 font-normal italic text-xs sm:text-sm">
                  &ldquo;We don&apos;t simply supply crystals; we curate lifetime talismans tailored to your
                  astrological alignment, personal vibration, and energetic sanctuary.&rdquo;
                </div>
              </div>

              {/* Accreditations & Trust Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px] font-mono text-gray-300">Usui Reiki Master</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px] font-mono text-gray-300">100% Ethical Mines</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px] font-mono text-gray-300">528Hz Consecrated</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  href="/shop"
                  className="bg-[#D4AF37] hover:bg-[#c49f2e] text-black text-xs font-mono font-bold uppercase tracking-widest px-7 py-3.5 rounded-full transition shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <Gem className="w-4 h-4" />
                  <span>Explore Soumyaa&apos;s Vault</span>
                </Link>

                <Link
                  href="/about"
                  className="bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono font-medium uppercase tracking-widest px-6 py-3.5 rounded-full transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Learn Our Philosophy</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
