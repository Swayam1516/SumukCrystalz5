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
    <section className="w-full relative overflow-hidden bg-[#F8F6F2] text-[#29242D] py-16 sm:py-20 select-none border-t border-[#EAE2F2]">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#EAE2F2]/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-[#C8A65E]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Founder Biography & Brand Philosophy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE2F2] border border-[#EAE2F2] text-[#79539B] text-[11px] font-sans font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A65E]" />
              <span>DIRECT FOUNDER SANCTUARY</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#C8A65E]/40 shadow-md flex-shrink-0">
                  <Image
                    src="/images/soumya-profile.jpeg"
                    alt="Soumyaa Naveen - Founder of Sumuk Crystalz 5"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#29242D] tracking-wide">
                    Soumyaa Naveen
                  </h3>
                  <p className="text-xs font-sans uppercase tracking-widest text-[#C8A65E] mt-0.5 font-bold">
                    Usui Reiki Master &bull; Mineral Curator
                  </p>
                  <p className="text-[11px] text-[#29242D]/60 font-sans mt-1">
                    Sus Gaon, Pune, Maharashtra
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-[15px] text-[#1E1924] font-medium font-sans leading-relaxed">
                Every natural mineral, bracelet, and geode at Sumuk Crystalz 5 is personally inspected for natural authenticity, cleansed with traditional sound vibrations, and packaged with care. Whether you are seeking a specific vibration or bespoke guidance, our sanctuary is here to assist.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#79539B] hover:text-[#684587] transition-colors font-bold"
                >
                  <span>Read Full Founder Story &amp; Philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sacred Quote Card */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-2">
              <p className="font-serif text-sm italic text-[#29242D] leading-relaxed">
                &ldquo;Crystals are bridges between ancient geological memory and our present intentional consciousness.&rdquo;
              </p>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#C8A65E] font-semibold block">
                &mdash; Soumyaa Naveen
              </span>
            </div>
          </div>

          {/* Right Column: Unified Luxury Contact Channels */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2F2]">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#29242D]">
                Official Communication Channels
              </h4>
              <div className="inline-flex items-center gap-2 text-[10.5px] font-sans text-emerald-700 font-bold tracking-wider">
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
                        ? 'bg-gradient-to-r from-emerald-50/80 to-[#EAE2F2]/60 border-emerald-400/50 shadow-sm'
                        : 'bg-white/80 hover:bg-white backdrop-blur-md border-[#EAE2F2] hover:border-[#79539B]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.isPrimary
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#EAE2F2] text-[#79539B] border border-[#EAE2F2]'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 stroke-[1.8]" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="font-serif text-base font-bold text-[#29242D] tracking-wide">
                              {item.title}
                            </h5>
                            {item.isPrimary && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-sans font-bold uppercase tracking-wider">
                                Direct Routing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#29242D]/70 font-sans">
                            {item.subtitle}
                          </p>
                          <span className="font-sans text-xs text-[#C8A65E] font-bold block pt-0.5">
                            {item.value}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.value, item.key)}
                          className="px-3 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#EAE2F2] text-[#29242D] text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer border border-[#EAE2F2]"
                          title="Copy details"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                            item.isPrimary
                              ? 'bg-[#79539B] hover:bg-[#684587] text-white'
                              : 'bg-[#EAE2F2] hover:bg-[#79539B] hover:text-white text-[#29242D] border border-[#EAE2F2]'
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
