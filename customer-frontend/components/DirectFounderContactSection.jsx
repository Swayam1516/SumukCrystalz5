'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  Clock,
  Zap,
  Users,
  Mail,
  MapPin,
  Navigation,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   FACETED GOLDEN CRYSTAL CROWN LOGO CREST
   Matches the faceted geometric crystal crown in the reference
   ───────────────────────────────────────────────────────────── */
export function GoldenCrystalCrownLogo({ className = 'w-16 h-12' }) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_2px_16px_rgba(212,175,55,0.75)] select-none`}
    >
      <defs>
        <linearGradient id="goldCrownLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="40%" stopColor="#f3ca65" />
          <stop offset="70%" stopColor="#c59828" />
          <stop offset="100%" stopColor="#7a540d" />
        </linearGradient>
        <linearGradient id="goldCrownFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffae6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Central Majestic Diamond Apex */}
      <polygon
        points="60,2 74,26 60,48 46,26"
        stroke="url(#goldCrownLight)"
        strokeWidth="2.4"
        fill="url(#goldCrownFacet)"
      />
      <line x1="60" y1="2" x2="60" y2="48" stroke="url(#goldCrownLight)" strokeWidth="1.6" />

      {/* Intermediate Left Crystal Spire */}
      <polygon
        points="46,26 22,32 38,54 60,48"
        stroke="url(#goldCrownLight)"
        strokeWidth="2.2"
        fill="url(#goldCrownFacet)"
      />
      {/* Intermediate Right Crystal Spire */}
      <polygon
        points="74,26 98,32 82,54 60,48"
        stroke="url(#goldCrownLight)"
        strokeWidth="2.2"
        fill="url(#goldCrownFacet)"
      />

      {/* Far Left Wing Tip */}
      <polygon
        points="22,32 2,42 24,60 38,54"
        stroke="url(#goldCrownLight)"
        strokeWidth="2"
        fill="url(#goldCrownFacet)"
      />
      {/* Far Right Wing Tip */}
      <polygon
        points="98,32 118,42 96,60 82,54"
        stroke="url(#goldCrownLight)"
        strokeWidth="2"
        fill="url(#goldCrownFacet)"
      />

      {/* Internal Facet Connectors */}
      <line x1="46" y1="26" x2="38" y2="54" stroke="url(#goldCrownLight)" strokeWidth="1.2" strokeOpacity="0.75" />
      <line x1="74" y1="26" x2="82" y2="54" stroke="url(#goldCrownLight)" strokeWidth="1.2" strokeOpacity="0.75" />

      {/* Bottom Foundation Bars */}
      <line x1="24" y1="64" x2="96" y2="64" stroke="url(#goldCrownLight)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="36" y1="69" x2="84" y2="69" stroke="url(#goldCrownLight)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP ICONS FOR THE 5 CONTACT CARDS
   ───────────────────────────────────────────────────────────── */
function WhatsAppAppIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E676] to-[#00b0ff] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,230,118,0.45)] flex-shrink-0">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.564 5.713 5.864-1.539c1.701.927 3.655 1.459 5.736 1.459 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
      </svg>
    </div>
  );
}

function PhoneAppIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0088ff] to-[#0055ff] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,136,255,0.45)] flex-shrink-0">
      <Phone className="w-6 h-6 stroke-[2.4]" />
    </div>
  );
}

function InstagramAppIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,39,67,0.45)] flex-shrink-0">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </div>
  );
}

function GmailAppIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-[#151221] border border-amber-500/30 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.25)] flex-shrink-0">
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M1.5 5.5v13a2 2 0 0 0 2 2h3.5v-9L1.5 7.5z" />
        <path fill="#34A853" d="M17 20.5h3.5a2 2 0 0 0 2-2v-13L17 11.5v9z" />
        <path fill="#EA4335" d="M17 11.5 12 7.75 7 11.5V3.5h10v8z" />
        <path fill="#FBBC04" d="M1.5 7.5 7 11.5V3.5a2 2 0 0 0-2.5 1.8z" />
        <path fill="#C5221F" d="M17 11.5l5.5-4a2 2 0 0 0-2.5-4l-3 2.25v5.75z" />
      </svg>
    </div>
  );
}

function MapLocationAppIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ea580c] via-[#d97706] to-[#b45309] flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.45)] flex-shrink-0">
      <MapPin className="w-6 h-6 text-white stroke-[2.4]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN DIRECT FOUNDER CONTACT & SANCTUARY SECTION
   ───────────────────────────────────────────────────────────── */
export default function DirectFounderContactSection() {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <section className="w-full relative overflow-hidden bg-[#06050b] text-[#f3f2fa] py-10 sm:py-14 lg:py-16 select-none z-20">
      
      {/* ── ATMOSPHERIC CRYSTAL BACKGROUND LAYER (Matching Left Reference Graphic) ── */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
        <Image
          src="/images/footer-sanctuary-bg.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-left filter brightness-90 contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06050b]/60 to-[#06050b]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06050b] via-transparent to-[#06050b]" />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        
        {/* ── FAR-LEFT VERTICAL ACCENT RIBBON ── */}
        <div className="hidden xl:flex items-center justify-center pr-3 border-r border-[#d4af37]/35 select-none">
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-mono font-bold tracking-[0.40em] text-[#d4af37]/80 uppercase">
            NATURAL CRYSTALS &nbsp;|&nbsp; SACRED INTENTION &nbsp;|&nbsp; HIGHER LIVING
          </span>
        </div>

        {/* ── MAIN 2-COLUMN SECTION ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Logo, Soumyaa Story, Bio & Sacred Quote
             ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between space-y-6 text-center lg:text-left relative">
            
            {/* Top: Geometric Crystal Crown Logo + Title */}
            <div className="space-y-2">
              <GoldenCrystalCrownLogo className="w-20 h-14 mx-auto lg:mx-0" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.16em] text-[#e8c97c] uppercase">
                SUMUK CRYSTALZ 5
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-amber-300/85 uppercase font-bold">
                CRYSTALS &bull; HEALING &bull; HIGHER YOU
              </p>
              <div className="w-20 h-[1.5px] bg-gradient-to-r from-amber-400 via-amber-500 to-transparent mx-auto lg:mx-0 my-2" />
            </div>

            {/* Middle: Founder Avatar & Credentials */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/about"
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.45)] shrink-0 group block"
                  title="View Soumyaa Naveen Profile & Sanctuary Story"
                >
                  <Image
                    src="/images/soumya-profile.jpeg"
                    alt="Soumyaa Naveen - Founder"
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <div className="text-left">
                  <p className="text-base sm:text-lg text-white leading-tight">
                    <span
                      style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive, serif" }}
                      className="text-2xl sm:text-3xl font-bold text-[#e8c97c] mr-2"
                    >
                      Founded by
                    </span>
                    <strong className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
                      Soumyaa Naveen
                    </strong>
                  </p>
                  <p className="text-[10.5px] font-mono tracking-[0.2em] text-[#d4af37] uppercase font-bold mt-1">
                    REIKI MASTER &bull; MBA ANALYST
                  </p>
                </div>
              </div>

              {/* Bio Paragraph matching the screenshot */}
              <p className="text-xs sm:text-[12.5px] text-neutral-300/90 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
                Certified Kundalini Master, Intuitive Aura Analyst, Sacred Numerologist, and Money Mindset Coach. With a compassionate and ethical approach, I help individuals manifest crystal-clear goals and quantum energy healing.
              </p>
            </div>

            {/* Bottom: Luminous Sacred Intention Quote */}
            <div className="pt-2">
              <div className="flex items-center gap-2 sm:gap-3 w-full justify-center lg:justify-start">
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#d4af37]/70" />
                <p className="text-[10px] sm:text-[10.5px] font-mono tracking-[0.22em] uppercase text-[#e8c97c] font-bold text-center lg:text-left whitespace-nowrap">
                  &ldquo;CRYSTALS ARE A BRIDGE FROM EARTH TO A HIGHER YOU&rdquo;
                </p>
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#d4af37]/70" />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: Header Bar + 5 Glowing Neon Cards
             ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between space-y-4">
            
            {/* ── Top Header Status Bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              
              {/* Left Title with Gold Star / Sparkle */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#e8c97c]">
                  DIRECT FOUNDER CONTACT &amp; SANCTUARY INFORMATION
                </h3>
              </div>

              {/* Live Status Indicator & Cursive Let's Connect */}
              <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                <div className="inline-flex items-center gap-2 text-[10.5px] font-mono text-[#00E676] font-bold tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
                  <span>ONLINE &bull; USUALLY REPLIES SOON</span>
                </div>

                <div className="text-right">
                  <span
                    style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive, serif" }}
                    className="text-2xl sm:text-3xl text-amber-300 font-bold block leading-none"
                  >
                    Let&apos;s Connect &#9825;
                  </span>
                  <span className="text-[8.5px] font-mono tracking-[0.22em] uppercase text-amber-300/80 font-bold mt-0.5 block">
                    WHOLESALER &bull; CONSULTATIONS &bull; WORKSHOPS
                  </span>
                </div>
              </div>

            </div>

            {/* ── 5 Interactive Contact & Sanctuary Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* ─────────────────────────────────────────────────────────────
                  CARD 1: WHATSAPP CATALOG & CHAT (Emerald Glow)
                 ───────────────────────────────────────────────────────────── */}
              <div
                className="rounded-2xl bg-[#0c1512]/90 backdrop-blur-xl border border-[#00E676]/60 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: '0 0 25px rgba(0, 230, 118, 0.22), inset 0 0 15px rgba(0, 230, 118, 0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <WhatsAppAppIcon />
                    <div>
                      <h4 className="font-mono text-xs sm:text-[12.5px] font-bold uppercase text-white tracking-wider">
                        WHATSAPP CATALOG &amp; CHAT
                      </h4>
                      <p className="text-[11px] text-neutral-300/80 line-clamp-1 mt-0.5 font-light">
                        Explore crystals, get personalized advice...
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                    <span>FASTEST RESPONSE</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-white truncate tracking-wider">
                      +91 9111718355
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('+919111718355', 'whatsapp')}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy WhatsApp Number"
                    >
                      {copiedKey === 'whatsapp' ? (
                        <Check className="w-3.5 h-3.5 text-[#00E676]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedKey === 'whatsapp' && (
                      <span className="text-[10px] font-mono text-[#00E676] font-bold">Copied!</span>
                    )}
                  </div>

                  <a
                    href="https://wa.me/919111718355"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00E676] to-[#00c853] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-[0_0_15px_rgba(0,230,118,0.5)] transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>CHAT NOW</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                  </a>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 2: CONTACT NUMBER (Celestial Electric Blue Glow)
                 ───────────────────────────────────────────────────────────── */}
              <div
                className="rounded-2xl bg-[#091224]/90 backdrop-blur-xl border border-[#0088ff]/60 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: '0 0 25px rgba(0, 136, 255, 0.22), inset 0 0 15px rgba(0, 136, 255, 0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <PhoneAppIcon />
                    <div>
                      <h4 className="font-mono text-xs sm:text-[12.5px] font-bold uppercase text-white tracking-wider">
                        CONTACT NUMBER
                      </h4>
                      <p className="text-[11px] text-neutral-300/80 line-clamp-1 mt-0.5 font-light">
                        Speak directly with Soumyaa for...
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#0088ff]/15 border border-[#0088ff]/40 text-[#60a5fa] text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <Clock className="w-3 h-3 text-[#60a5fa]" />
                    <span>Available 10 AM &ndash; 8 PM</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-white truncate tracking-wider">
                      +91 91117 18355
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('+919111718355', 'phone')}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy Phone Number"
                    >
                      {copiedKey === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-[#60a5fa]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedKey === 'phone' && (
                      <span className="text-[10px] font-mono text-[#60a5fa] font-bold">Copied!</span>
                    )}
                  </div>

                  <a
                    href="tel:+919111718355"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#0070f3] to-[#0055ff] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-[0_0_15px_rgba(0,112,243,0.5)] transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>CALL NOW</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                  </a>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 3: INSTAGRAM PROFILE (Magenta Gradient Glow)
                 ───────────────────────────────────────────────────────────── */}
              <div
                className="rounded-2xl bg-[#170b1e]/90 backdrop-blur-xl border border-[#d946ef]/60 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: '0 0 25px rgba(217, 70, 239, 0.22), inset 0 0 15px rgba(217, 70, 239, 0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InstagramAppIcon />
                    <div>
                      <h4 className="font-mono text-xs sm:text-[12.5px] font-bold uppercase text-white tracking-wider">
                        INSTAGRAM PROFILE
                      </h4>
                      <p className="text-[11px] text-neutral-300/80 line-clamp-1 mt-0.5 font-light">
                        Daily crystal updates, new arrivals...
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#d946ef]/15 border border-[#d946ef]/40 text-[#f0abfc] text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <Users className="w-3 h-3 text-[#f0abfc]" />
                    <span>Join Our Community</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-white truncate tracking-wider">
                      @sumukcrystalz5
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('@sumukcrystalz5', 'instagram')}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy Instagram Handle"
                    >
                      {copiedKey === 'instagram' ? (
                        <Check className="w-3.5 h-3.5 text-[#f0abfc]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedKey === 'instagram' && (
                      <span className="text-[10px] font-mono text-[#f0abfc] font-bold">Copied!</span>
                    )}
                  </div>

                  <a
                    href="https://instagram.com/sumukcrystalz5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d946ef] to-[#c026d3] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-[0_0_15px_rgba(217,70,239,0.5)] transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>VIEW PROFILE</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                  </a>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 4: OFFICIAL EMAIL (Amber Gold Glow)
                 ───────────────────────────────────────────────────────────── */}
              <div
                className="rounded-2xl bg-[#1c1208]/90 backdrop-blur-xl border border-[#f59e0b]/60 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.22), inset 0 0 15px rgba(245, 158, 11, 0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GmailAppIcon />
                    <div>
                      <h4 className="font-mono text-xs sm:text-[12.5px] font-bold uppercase text-white tracking-wider">
                        OFFICIAL EMAIL
                      </h4>
                      <p className="text-[11px] text-neutral-300/80 line-clamp-1 mt-0.5 font-light">
                        For detailed queries, collaborations...
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#fbbf24] text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <Mail className="w-3 h-3 text-[#fbbf24]" />
                    <span>We reply within 24 hrs</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-white truncate max-w-[190px]">
                      sumukcrystalz5@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('sumukcrystalz5@gmail.com', 'email')}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy Email Address"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-[#fbbf24]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedKey === 'email' && (
                      <span className="text-[10px] font-mono text-[#fbbf24] font-bold">Copied!</span>
                    )}
                  </div>

                  <a
                    href="mailto:sumukcrystalz5@gmail.com"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:brightness-110 active:scale-95 text-black font-mono font-extrabold text-xs uppercase tracking-[0.14em] shadow-[0_0_15px_rgba(245,158,11,0.5)] transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>SEND EMAIL</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                  </a>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 5: OFFICE LOCATION & SANCTUARY (Full-Width Card)
                 ───────────────────────────────────────────────────────────── */}
              <div
                className="md:col-span-2 rounded-2xl bg-[#181109]/90 backdrop-blur-xl border border-[#d4af37]/70 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.28), inset 0 0 20px rgba(212, 175, 55, 0.05)',
                }}
              >
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MapLocationAppIcon />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono text-xs sm:text-[13px] font-bold uppercase text-white tracking-wider">
                          OFFICE LOCATION &amp; SANCTUARY
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5be46] text-[9.5px] font-mono font-bold tracking-wider uppercase">
                          PUNE, MAHARASHTRA
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] text-white font-serif font-bold mt-0.5">
                        Sau Goon, Pune, Maharashtra
                      </p>
                      <p className="text-[11px] text-neutral-300/80 font-light mt-0.5">
                        Sacred mineral retail, personalized Vedic consultations &amp; order dispatch station.
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5be46] text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <Navigation className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>Official Map Verified</span>
                  </span>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-[13px] font-mono font-medium text-amber-300 truncate">
                      Sau Goon, Pune, Maharashtra
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Sau Goon, Pune, Maharashtra', 'location')}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy Address"
                    >
                      {copiedKey === 'location' ? (
                        <Check className="w-3.5 h-3.5 text-[#00E676]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedKey === 'location' && (
                      <span className="text-[10px] font-mono text-[#00E676] font-bold">Copied!</span>
                    )}

                    <a
                      href="https://share.google/ZlRBaN7xnl5EdHmIX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-neutral-400 hover:text-amber-300 underline cursor-pointer pl-1.5 whitespace-nowrap transition"
                      title="Open Google Maps link"
                    >
                      Open Link
                    </a>
                  </div>

                  <a
                    href="https://share.google/ZlRBaN7xnl5EdHmIX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:brightness-110 active:scale-95 text-black font-mono font-extrabold text-xs uppercase tracking-[0.14em] shadow-[0_0_20px_rgba(245,158,11,0.55)] transition flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5 fill-black stroke-black" />
                    <span>OPEN IN GOOGLE MAPS</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
