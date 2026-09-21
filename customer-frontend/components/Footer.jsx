'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Leaf,
  ShieldCheck,
  Heart,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Zap,
  Users,
  MapPin,
  Navigation,
  ExternalLink,
} from 'lucide-react';

/* Golden Lotus & Crystal Geometric Crest matching Dark Luxury Obsidian Theme */
function GoldenLotusCrest() {
  return (
    <svg
      viewBox="0 0 100 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-11 text-[#d4af37] mx-auto lg:mx-0 filter drop-shadow-[0_2px_12px_rgba(212,175,55,0.6)] select-none"
    >
      <defs>
        <linearGradient id="goldLotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3b8" />
          <stop offset="45%" stopColor="#dfaf37" />
          <stop offset="100%" stopColor="#875e11" />
        </linearGradient>
      </defs>
      {/* Central Diamond Crystal Apex */}
      <polygon
        points="50,2 62,24 50,42 38,24"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2.4"
        fill="none"
      />
      <polygon
        points="50,2 50,42"
        stroke="url(#goldLotusGrad)"
        strokeWidth="1.6"
      />
      {/* Left Inner Petal */}
      <polygon
        points="38,24 18,30 32,48 50,42"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Right Inner Petal */}
      <polygon
        points="62,24 82,30 68,48 50,42"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Left Outer Wing Petal */}
      <polygon
        points="18,30 2,42 22,54 32,48"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2"
        fill="none"
      />
      {/* Right Outer Wing Petal */}
      <polygon
        points="82,30 98,42 78,54 68,48"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2"
        fill="none"
      />
      {/* Base Foundation Bar */}
      <line
        x1="22"
        y1="58"
        x2="78"
        y2="58"
        stroke="url(#goldLotusGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="63"
        x2="68"
        y2="63"
        stroke="url(#goldLotusGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* WhatsApp Icon */
function WhatsAppAppIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(37,211,102,0.35)] flex-shrink-0">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.564 5.713 5.864-1.539c1.701.927 3.655 1.459 5.736 1.459 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
      </svg>
    </div>
  );
}

/* Phone App Icon */
function PhoneAppIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0088cc] to-[#0055aa] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(0,136,204,0.35)] flex-shrink-0">
      <Phone className="w-6 h-6 stroke-[2.2]" />
    </div>
  );
}

/* Instagram App Icon */
function InstagramAppIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(220,39,67,0.35)] flex-shrink-0">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </div>
  );
}

/* Gmail App Icon */
function GmailAppIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-[#141022] border border-amber-500/30 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex-shrink-0">
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

/* Map / Sanctuary Location Icon */
function MapLocationAppIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#78350f] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(217,119,6,0.35)] flex-shrink-0">
      <MapPin className="w-6 h-6 text-amber-200 stroke-[2.2]" />
    </div>
  );
}

export default function Footer() {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <footer
      className="w-full relative overflow-hidden bg-[#07060d] text-[#f3f2fa] border-t border-amber-500/25 select-none z-20"
    >
      {/* Top Hairline Amber Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      {/* Ambient Background Glow Highlights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10 flex flex-col lg:flex-row items-stretch gap-6">
        
        {/* FAR-LEFT VERTICAL ACCENT RIBBON */}
        <div className="hidden xl:flex items-center justify-center pr-3 border-r border-white/10 select-none">
          <span className="[writing-mode:vertical-lr] rotate-180 text-[9.5px] font-mono font-bold tracking-[0.35em] text-amber-300/60 uppercase opacity-75">
            AUTHENTIC MINERALS &bull; SACRED INTENTION &bull; GLOBAL REACH
          </span>
        </div>

        {/* MAIN 2-COLUMN SECTION */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Brand Identity, Soumyaa Story & Quote */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 text-center lg:text-left flex flex-col justify-between">
            
            {/* Logo Crest + Brand Title */}
            <div className="space-y-1.5">
              <GoldenLotusCrest />
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.16em] text-[#e8c97c] uppercase">
                SUMUK CRYSTALZ 5
              </h3>
              <p className="text-[10px] font-mono tracking-[0.28em] text-amber-300/80 uppercase font-bold">
                CRYSTALS &bull; HEALING &bull; HIGHER YOU
              </p>
              <div className="w-16 h-[1.5px] bg-gradient-to-r from-amber-400 to-amber-600/40 mx-auto lg:mx-0 my-2" />
            </div>

            {/* Founder Bio with Official Profile Avatar */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/about"
                  className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0 group block"
                  title="View Soumyaa Naveen Profile & Sanctuary Story"
                >
                  <Image
                    src="/images/soumya-profile.jpeg"
                    alt="Soumyaa Naveen - Founder & Reiki Master"
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <div className="text-left">
                  <p className="text-base sm:text-lg text-white leading-tight">
                    <span
                      style={{ fontFamily: "'Dancing Script', cursive, serif" }}
                      className="text-2xl font-bold text-amber-300 mr-2"
                    >
                      Founded by
                    </span>
                    <strong className="font-serif font-bold text-lg text-white">Soumyaa Naveen</strong>
                  </p>
                  <p className="text-[10px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold mt-0.5">
                    Reiki Master &amp; Aura Analyst
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-[12px] text-luxe-300 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
                Certified Usui Reiki Master, Intuitive Aura Analyst, Sacred Numerologist, and Metaphysical Counselor. Connecting seekers worldwide with ethically mined master crystals and quantum energy healing.
              </p>
            </div>

            {/* Quote Mantra */}
            <div className="pt-2">
              <p className="text-[10px] sm:text-[10.5px] font-mono tracking-[0.20em] uppercase text-amber-300/80 font-bold">
                &mdash; &ldquo;CRYSTALS ARE A BRIDGE FROM EARTH TO A HIGHER YOU&rdquo; &mdash;
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Information Header & 5 Dark Frosted Glass Cards */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4 flex flex-col justify-between">
            
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono text-xs sm:text-[12.5px] font-bold uppercase tracking-[0.2em] text-[#e8c97c]">
                  DIRECT FOUNDER CONTACT &amp; SANCTUARY INFORMATION
                </h4>
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 text-[10.5px] font-mono text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE &bull; USUALLY REPLIES SOON</span>
                </div>

                <div className="hidden xl:block text-right">
                  <span
                    style={{ fontFamily: "'Dancing Script', cursive, serif" }}
                    className="text-2xl text-amber-300 font-bold block leading-none"
                  >
                    Let&apos;s Connect &#9825;
                  </span>
                  <span className="text-[8.5px] font-mono tracking-[0.2em] uppercase text-amber-300/70 font-bold">
                    WORLDWIDE CONSULTATIONS &amp; ORDERS
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Cards Grid (Dark Luxury Obsidian Theme with Office Map Card) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* CARD 1: WHATSAPP */}
              <div className="rounded-[20px] sm:rounded-2xl bg-[#0e0b1a]/85 backdrop-blur-xl border border-emerald-500/25 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-emerald-400 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <WhatsAppAppIcon />
                    <div>
                      <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                        WHATSAPP CATALOG &amp; CHAT
                      </h5>
                      <p className="text-[11px] text-luxe-300 line-clamp-1 mt-0.5 font-light">
                        Explore crystals, get guidance and place orders directly.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Fastest Response</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-white truncate">
                      wa.me/919111716355
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('https://wa.me/c/919111716355', 'whatsapp')}
                      className="p-1 rounded-md hover:bg-white/10 text-luxe-300 hover:text-white transition cursor-pointer"
                      title="Copy WhatsApp link"
                    >
                      {copiedKey === 'whatsapp' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="https://wa.me/c/919111716355"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00c853] to-[#00b0ff] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Chat Now</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* CARD 2: CONTACT NUMBER */}
              <div className="rounded-[20px] sm:rounded-2xl bg-[#0e0b1a]/85 backdrop-blur-xl border border-blue-500/25 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <PhoneAppIcon />
                    <div>
                      <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                        CONTACT NUMBER
                      </h5>
                      <p className="text-[11px] text-luxe-300 line-clamp-1 mt-0.5 font-light">
                        Speak directly with Soumyaa for consultations or orders.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>Available 10 AM - 8 PM</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-white truncate">
                      +91 91117 16355
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('+91-9111716355', 'phone')}
                      className="p-1 rounded-md hover:bg-white/10 text-luxe-300 hover:text-white transition cursor-pointer"
                      title="Copy phone number"
                    >
                      {copiedKey === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="tel:+919111716355"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0084ff] to-[#0055ff] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Call Now</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* CARD 3: INSTAGRAM */}
              <div className="rounded-[20px] sm:rounded-2xl bg-[#0e0b1a]/85 backdrop-blur-xl border border-pink-500/25 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-pink-400 hover:shadow-[0_12px_40px_rgba(236,72,153,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InstagramAppIcon />
                    <div>
                      <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                        INSTAGRAM PROFILE
                      </h5>
                      <p className="text-[11px] text-luxe-300 line-clamp-1 mt-0.5 font-light">
                        Daily crystal updates, new arrivals, healing tips and more.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                    <Users className="w-3 h-3 text-pink-400" />
                    <span>Join Our Community</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-white truncate">
                      @sumukcrystalz5
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn', 'instagram')}
                      className="p-1 rounded-md hover:bg-white/10 text-luxe-300 hover:text-white transition cursor-pointer"
                      title="Copy Instagram link"
                    >
                      {copiedKey === 'instagram' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#e11d48] to-[#c026d3] hover:brightness-110 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition flex items-center gap-1 flex-shrink-0"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* CARD 4: EMAIL */}
              <div className="rounded-[20px] sm:rounded-2xl bg-[#0e0b1a]/85 backdrop-blur-xl border border-amber-500/25 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GmailAppIcon />
                    <div>
                      <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                        OFFICIAL EMAIL
                      </h5>
                      <p className="text-[11px] text-luxe-300 line-clamp-1 mt-0.5 font-light">
                        For detailed queries, collaborations and custom orders.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>We reply within 24 hrs</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-white truncate max-w-[180px]">
                      sumukcrystalz5@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('sumukcrystalz5@gmail.com', 'email')}
                      className="p-1 rounded-md hover:bg-white/10 text-luxe-300 hover:text-white transition cursor-pointer"
                      title="Copy email address"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="mailto:sumukcrystalz5@gmail.com"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Send Email</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* CARD 5: OFFICE & SANCTUARY LOCATION */}
              <div className="md:col-span-2 rounded-[20px] sm:rounded-2xl bg-[#0e0b1a]/85 backdrop-blur-xl border border-amber-500/30 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.18)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MapLocationAppIcon />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                          OFFICE LOCATION &amp; SANCTUARY
                        </h5>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9.5px] font-mono font-bold">
                          Pune, Maharashtra
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-white font-serif font-bold mt-0.5">
                        Sus Gaon, Pune, Maharashtra
                      </p>
                      <p className="text-[11px] text-luxe-300 font-light mt-0.5">
                        Sacred mineral vault, personalized Vedic consultations &amp; order dispatch station.
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9.5px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                    <Navigation className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>Official Map Verified</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-medium text-amber-300 truncate">
                      Sus Gaon, Pune, Maharashtra
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Sus Gaon, Pune, Maharashtra', 'location')}
                      className="p-1 rounded-md hover:bg-white/10 text-luxe-300 hover:text-white transition cursor-pointer flex-shrink-0"
                      title="Copy office address"
                    >
                      {copiedKey === 'location' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('https://share.google/ZlRBaN7xnl5EdHmIX', 'maplink')}
                      className="text-[10.5px] font-mono text-luxe-400 hover:text-amber-300 underline cursor-pointer pl-1 whitespace-nowrap"
                      title="Copy Google Map link"
                    >
                      {copiedKey === 'maplink' ? 'Map Link Copied!' : 'Copy Link'}
                    </button>
                  </div>

                  <a
                    href="https://share.google/ZlRBaN7xnl5EdHmIX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM TRUST ROW (Dark Luxury Obsidian Theme) */}
      <div className="w-full border-t border-white/10 bg-[#050409]/90 py-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-luxe-300">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white/90">Worldwide Consultations</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white/90">Ethically Mined Crystals</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white/90">Authenticity Guaranteed</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-white/90">Positive Energy Always</span>
            </span>
          </div>

          <p className="text-[11px] text-luxe-400 font-mono">
            &copy; {new Date().getFullYear()} Sumuk Crystalz 5. All rights reserved. Curated with devotion by Soumyaa Naveen.
          </p>
        </div>
      </div>

      {/* CREATED BY FOOTER TITLE */}
      <div className="w-full border-t border-amber-500/25 bg-[#030206] py-3.5 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-300">
          createdby : SWAYAM A H work at:<a href="mailto:swayamh16@gmail.com" className="underline hover:text-white transition ml-1">swayamh16@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
