'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Compass,
  ArrowRight,
  Gem,
  Award,
  Flame,
  Moon,
  Instagram,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  MapPin,
  Navigation,
} from 'lucide-react';
import ServicesBySoumya from '../../components/ServicesBySoumya';
import ProvenanceTrustCards from '../../components/ProvenanceTrustCards';

export default function AboutPage() {
  const offerings = [
    {
      title: 'Rare Display Geodes',
      subtitle: 'Geological Centerpieces',
      desc: 'Dramatic cathedral formations, natural amethyst caves, and raw crystalline matrices that anchor awe and grounded beauty in your home or office.',
      icon: Gem,
    },
    {
      title: 'Healing Jewelry',
      subtitle: 'Talismanic Adornment',
      desc: 'Handcrafted gemstone pieces designed to carry harmonic energy, intention, and protective resonance with you wherever your journey leads.',
      icon: Sparkles,
    },
    {
      title: 'Energy-Balancing Sanctuary Stones',
      subtitle: 'Sacred Sanctuary Living',
      desc: 'Specially consecrated specimens selected for altars, meditation corners, and mindful sanctuaries to foster tranquility and inner stillness.',
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-amethyst-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-mono tracking-widest text-gold-300 uppercase">
              The Story Behind Sumuk Crystalz 5
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] text-3d-title">
            Where Beauty Meets <br />
            <span className="gold-gradient-text">Sacred Intention.</span>
          </h1>

          <p className="text-sm sm:text-base text-luxe-300 leading-relaxed max-w-2xl mx-auto">
            Discover the passion, holistic healing mastery, and conscious energy alignment behind <strong className="text-white">Sumuk Crystalz 5</strong> and founder <strong className="text-white">Soumyaa Naveen</strong>.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-3">
            <a
              href="#services"
              className="btn-pill-primary text-xs px-8 py-3.5 rounded-full flex items-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>EXPLORE SERVICES BY SOUMYAA</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </a>
            <Link
              href="/shop"
              className="btn-pill-secondary text-xs px-8 py-3.5 rounded-full flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BROWSE MASTERWORKS</span>
            </Link>
          </div>
        </div>


      </section>

      {/* 2. FOUNDER STORY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-3d p-8 sm:p-14 border border-gold-500/25 relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amethyst-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Founder Photo & Badge */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl group">
                <Image
                  src="/images/soumya-profile.jpeg"
                  alt="Soumyaa Naveen - Founder of Sumuk Crystalz 5"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-luxe-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase font-bold">
                    Reiki Master &amp; Mineral Curator
                  </span>
                  <p className="font-serif text-2xl font-bold text-white mt-0.5 text-3d-subtle">
                    Soumyaa Naveen
                  </p>
                  <p className="text-xs text-luxe-300 mt-1 flex items-center gap-2 font-mono">
                    <span>Sumuk Crystalz 5</span>
                    <span className="text-gold-300">@sumukcrystalz5</span>
                  </p>
                </div>
              </div>

              {/* Social Link */}
              <a
                href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
                target="_blank"
                rel="noopener noreferrer"
                className="option-pill-3d mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.04] border border-gold-500/30 text-gold-300 text-xs font-mono uppercase tracking-[0.16em] font-semibold transition group shadow-md hover:bg-white/[0.08]"
              >
                <Instagram className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                <span>JOIN COMMUNITY: @SUMUKCRYSTALZ5</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Right: The Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-3d text-gold-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Meet the Founder</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-snug text-3d-title">
                &ldquo;Every crystal tells an ancient story—mined from the Earth, chosen with intention.&rdquo;
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-luxe-200 leading-relaxed font-light">
                <p>
                  <strong className="text-white font-medium">Welcome to Sumuk Crystalz 5.</strong> I’m <strong className="text-white font-semibold">Soumyaa Naveen</strong>, an Usui Reiki Master, Aura Analyst, Numerologist, and intuitive practitioner dedicated to natural crystals and conscious energetic alignment.
                </p>

                <p>
                  Every crystal tells an ancient story—from the tranquil, intuitive depths of raw <strong className="text-amethyst-300 font-medium">Amethyst</strong> to the bold, protective warmth of <strong className="text-amber-300 font-medium">Tiger’s Eye</strong> and the gentle, heart-centered compassion of <strong className="text-rose-300 font-medium">Rose Quartz</strong>. What started as a personal passion for authentic minerals evolved into <strong className="text-gold-300 font-medium">@sumukcrystalz5</strong>, a sanctuary connecting collectors and seekers to genuine high-vibrational earth treasures and holistic healing modalities.
                </p>

                <p className="p-4 rounded-xl bg-white/[0.03] border border-gold-500/20 text-luxe-100 font-normal italic">
                  &ldquo;At Sumuk Crystalz 5, every piece is hand-selected with intention and sacredly consecrated. Beyond curating crystals, I offer private sessions in Reiki, Aura Scanning, Tarot, Numerology, Psychic Surgery, and Bespoke Crystal Creations to help you realign your energetic sovereign flow.&rdquo;
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <a
                  href="#services"
                  className="gold-3d-btn px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.16em] shadow-xl flex items-center gap-2"
                >
                  <span>VIEW SERVICES BY SOUMYAA</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/shop"
                  className="option-pill-3d px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-[0.16em] transition flex items-center gap-2 hover:bg-white/10 hover:border-amber-400/50"
                >
                  <Gem className="w-4 h-4 text-gold-400" />
                  <span>EXPLORE SOUMYAA&apos;S VAULT</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES BY SOUMYA (ALL 9 SACRED MODALITIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesBySoumya showHeader={true} />
      </section>

      {/* 4. THE 3 CORE OFFERINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="intention">
        <div className="glass-panel-3d p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d text-gold-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Curation Spectrum</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white text-3d-title">
              Curated for Your Mindful Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-luxe-400">
              Each offering is hand-selected by Soumyaa Naveen to fulfill specific energetic and spatial intentions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerings.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="card-3d-animatic p-6 rounded-2xl glass-card-3d border border-white/10 hover:border-gold-500/30 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white text-3d-subtle">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gold-300/80 font-bold">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-luxe-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. THE ETHICAL PROMISE & HAND-SELECTED COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d text-emerald-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>The Sumuk Crystalz 5 Standard</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight text-3d-title">
              Ethically Sourced. <br />
              <span className="gold-gradient-text">Genuinely Consecrated.</span>
            </h2>
            <p className="text-xs sm:text-sm text-luxe-300 leading-relaxed">
              We believe the energy of a crystal is deeply tied to how it was unearthed and handled. Soumyaa personally vets our mineral suppliers to ensure humane working conditions, fair wages, and natural integrity without synthetic treatments.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Hand-selected individual specimens evaluated for optical refraction and vitality',
                'Fair-trade partnerships with artisanal lapidary families',
                'Sound-cleansed with sacred Solfeggio singing bowls before dispatch',
                'Individual Certificate of Provenance included with every collector order',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-luxe-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right community callout card */}
          <div className="card-3d-animatic p-8 sm:p-10 rounded-3xl glass-panel-3d border border-gold-500/30 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-lg">
              <Instagram className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 block font-bold">
              Follow Our Daily Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white text-3d-title">
              Connect on @sumukcrystalz5
            </h3>
            <p className="text-xs text-luxe-300 max-w-md mx-auto leading-relaxed">
              Join Soumyaa Naveen on Instagram for unboxing live streams, crystal healing guidance, sanctuary styling tips, and new batch alerts.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
                target="_blank"
                rel="noopener noreferrer"
                className="gold-3d-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.16em] shadow-xl"
              >
                <span>FOLLOW @SUMUKCRYSTALZ5</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PHYSICAL SANCTUARY & OFFICE LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-3d p-8 sm:p-12 border border-gold-500/30 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-3d text-gold-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical Sanctuary &amp; Office</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white text-3d-title">
              Visit Our Sacred Space in Sus Gaon, Pune
            </h2>
            <p className="text-xs sm:text-sm text-luxe-300 leading-relaxed font-light">
              Experience the physical vault of museum-grade crystals, attend private in-person Reiki and sound attunement sessions, or consult directly with Soumyaa Naveen in Sus Gaon, Pune, Maharashtra.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href="https://share.google/ZlRBaN7xnl5EdHmIX"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-3d-btn w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.16em] shadow-xl flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>OPEN GOOGLE MAPS</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
