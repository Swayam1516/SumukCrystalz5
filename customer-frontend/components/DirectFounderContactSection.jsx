'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

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

  const CONTACT_CHANNELS = [
    {
      key: 'whatsapp',
      title: 'WhatsApp Founder Routing',
      subtitle: 'Fastest response for crystal curation & bookings',
      value: '+91 91117 16355',
      href: 'https://wa.me/919111716355?text=Hello%20Soumyaa%2C%20I%20would%20like%20to%20inquire%20about%20your%20crystals%20and%20consultations.',
      actionLabel: 'Chat on WhatsApp',
      icon: MessageCircle,
      isPrimary: true,
    },
    {
      key: 'phone',
      title: 'Telephone Consultation',
      subtitle: 'Direct telephone line during sanctuary hours (9 AM - 9 PM)',
      value: '+91 91117 16355',
      href: 'tel:+919111716355',
      actionLabel: 'Call Now',
      icon: Phone,
    },
    {
      key: 'instagram',
      title: 'Instagram Sanctuary',
      subtitle: 'Daily crystal reveals, specimen videos & live showcases',
      value: '@sumukcrystalz5',
      href: 'https://www.instagram.com/sumukcrystalz5/',
      actionLabel: 'Visit Profile',
      icon: Instagram,
    },
    {
      key: 'email',
      title: 'Official Inquiries',
      subtitle: 'For wholesale, bespoke curations, and corporate gifting',
      value: 'sumukcrystalz@gmail.com',
      href: 'mailto:sumukcrystalz@gmail.com',
      actionLabel: 'Send Email',
      icon: Mail,
    },
    {
      key: 'location',
      title: 'Sanctuary & Studio',
      subtitle: 'Sus Gaon, Pune, Maharashtra 411021',
      value: 'Sus Gaon, Pune, Maharashtra',
      href: 'https://maps.app.goo.gl/ZlRBaN7xnl5EdHmIX',
      actionLabel: 'Open Google Maps',
      icon: MapPin,
    },
  ];

  return (
    <section className="w-full relative overflow-hidden bg-[#140C1D] text-[#FAF8F5] py-16 sm:py-20 select-none border-t border-white/5">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Founder Biography & Brand Philosophy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-mono uppercase tracking-[0.2em] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>DIRECT FOUNDER SANCTUARY</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl flex-shrink-0">
                  <Image
                    src="/images/soumya-profile.jpeg"
                    alt="Soumyaa Naveen - Founder of Sumuk Crystalz 5"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-white tracking-wide">
                    Soumyaa Naveen
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#E5C378] mt-0.5 font-bold">
                    Usui Reiki Master &bull; Mineral Curator
                  </p>
                  <p className="text-[11px] text-stone-400 font-sans-ui mt-1">
                    Sus Gaon, Pune, Maharashtra
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-300 font-sans-ui leading-relaxed font-light">
                Every natural mineral, bracelet, and geode at Sumuk Crystalz 5 is personally inspected for natural authenticity, cleansed with traditional sound vibrations, and packaged with care. Whether you are seeking a specific vibration or bespoke guidance, our sanctuary is here to assist.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E5C378] hover:text-[#F3E2B8] transition-colors font-bold"
                >
                  <span>Read Full Founder Story &amp; Philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sacred Quote Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <p className="font-editorial text-xs italic text-stone-300 leading-relaxed">
                &ldquo;Crystals are bridges between ancient geological memory and our present intentional consciousness.&rdquo;
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378] block">
                &mdash; Soumyaa Naveen
              </span>
            </div>
          </div>

          {/* Right Column: Unified Luxury Contact Channels */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-stone-300">
                Official Communication Channels
              </h4>
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono text-emerald-400 font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE &bull; 9 AM &ndash; 9 PM IST</span>
              </div>
            </div>

            <div className="space-y-3">
              {CONTACT_CHANNELS.map((item) => {
                const IconComponent = item.icon;
                const isCopied = copiedKey === item.key;

                return (
                  <div
                    key={item.key}
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      item.isPrimary
                        ? 'bg-gradient-to-r from-emerald-950/30 to-purple-950/20 border-emerald-500/40 hover:border-emerald-400 shadow-md'
                        : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.isPrimary
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-stone-300 border border-white/10'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 stroke-[1.8]" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="font-editorial text-sm font-bold text-white tracking-wide">
                              {item.title}
                            </h5>
                            {item.isPrimary && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                                Direct Routing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 font-sans-ui">
                            {item.subtitle}
                          </p>
                          <span className="font-mono text-xs text-[#E5C378] font-bold block pt-0.5">
                            {item.value}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.value, item.key)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                          title="Copy details"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                            item.isPrimary
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                          }`}
                        >
                          <span>{item.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
