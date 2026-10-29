'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Compass,
  ArrowRight,
  Instagram,
  Heart,
  HelpCircle,
  Clock,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import ServicesBySoumya from '../../components/ServicesBySoumya';
import DualTierFilterTicker from '../../components/DualTierFilterTicker';

export default function ServicesPage() {

  const faqs = [
    {
      q: 'Do Distance / Remote Healing Sessions Work as Effectively as In-Person?',
      a: 'Yes, absolutely. In quantum energy mechanics and Usui Reiki principles, life force energy and consciousness transcend 3-dimensional physical distance. Remote sessions on Zoom or via focused time-attunement produce identical shifts in the biofield, verified through client feedback across India, the US, UK, and worldwide.',
    },
    {
      q: 'What Should I Prepare Before an Aura Checking or Reiki Session?',
      a: 'Wear comfortable, loose clothing and find a quiet, undisturbed sanctuary space where you can sit or lie down comfortably. Drink plenty of fresh water beforehand and keep an open, relaxed intention. We also recommend having your favorite Sumuk crystal nearby.',
    },
    {
      q: 'How Do I Request a Customized Crystal Order or Altar Grid?',
      a: 'You can select "Customized Crystal Orders" above and submit your birth details, intention, and preferred stone types. Soumyaa personally cross-references your astrological profile to curate, wire-wrap, and sacredly consecrate your bespoke crystal piece.',
    },
    {
      q: 'How Soon Will I Feel the Effects of Energy Healing or Cord-Cutting?',
      a: 'Most clients report an immediate feeling of physical lightness, emotional release, and clarity during or immediately following the session. In the 48–72 hours after, a gentle integration cycle occurs as your subtle energetic matrix settles into its higher vibrational baseline.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Intuitive Intake & Intention Setting',
      desc: 'We begin with an open discussion of your current life crossroads, physical/emotional fatigue, and specific healing or divination goals.',
    },
    {
      step: '02',
      title: 'Biofield & Chakra Scanning',
      desc: 'Soumyaa conducts a diagnostic scan of your 7 primary chakras, identifying energetic blockages, stagnant cords, or auric tears.',
    },
    {
      step: '03',
      title: 'Sacred Attunement & Healing',
      desc: 'Channeling high-frequency Usui Reiki, Solfeggio sound bowls, and master gemstone frequencies to transmute density and restore pranic flow.',
    },
    {
      step: '04',
      title: 'Integration & Personalized Crystal Shield',
      desc: 'You receive aftercare guidance, grounding breathwork instructions, and customized mineral recommendations for long-term protection.',
    },
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-10 left-1/3 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-mono tracking-widest uppercase font-bold">
              Sumuk Crystalz 5 &bull; Services by Soumyaa
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1F1A15] max-w-5xl mx-auto leading-[1.15]">
            Sacred Energy Healing &amp; <br />
            <span className="text-[#B45309]">Metaphysical Consultations.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5C5245] leading-relaxed max-w-3xl mx-auto font-sans-ui">
            Step into profound balance with personalized healing sessions, intuitive readings, and bespoke mineral curations guided by Usui Reiki Master &amp; Metaphysical Practitioner <strong className="text-[#1F1A15] font-semibold">Soumyaa Naveen</strong>.
          </p>

        </div>

        {/* Dual-Tier Horizontal Ticker Register (Intentions & Modalities) */}
        <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8">
          <DualTierFilterTicker
            isMarquee={false}
          />
        </div>
      </section>


      {/* 2. THE 9 MODALITIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesBySoumya showHeader={false} />
      </section>

      {/* 3. HOW A SESSION WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1A1124] to-[#120B1A] text-white p-8 sm:p-14 border border-white/10 relative overflow-hidden shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-mono uppercase tracking-widest font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>The Healing Protocol</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white tracking-tight">
              How Your Session Unfolds
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-sans-ui">
              A structured, compassionate sacred journey designed to honor your energetic sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-3">
                  <span className="font-mono text-3xl font-bold text-[#E5C378]/60 block">
                    {item.step}
                  </span>
                  <h3 className="font-editorial text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans-ui">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[11px] font-mono uppercase tracking-widest font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Clarity &amp; Guidance</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#1F1A15] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-2 hover:border-amber-300 transition"
            >
              <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1F1A15] flex items-center gap-2.5">
                <span className="text-[#B45309] font-mono text-sm">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5245] leading-relaxed pl-6 font-sans-ui">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA (IMAGE 1 REFERENCE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-3d p-8 sm:p-12 border border-gold-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white text-3d-title">
              Ready to Align Your Energy &amp; Sanctuary?
            </h2>
            <p className="text-xs sm:text-sm text-luxe-300 leading-relaxed">
              Connect directly with Soumyaa Naveen on Instagram or WhatsApp to book your private session or explore our high-vibration crystal vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-xs px-8 py-3.5 rounded-full flex items-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.45)]"
            >
              <Instagram className="w-4 h-4 text-black" />
              <span>CONNECT ON @SUMUKCRYSTALZ5</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </a>

            <Link
              href="/shop"
              className="btn-pill-secondary text-xs px-8 py-3.5 rounded-full flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BROWSE CONSECRATED CRYSTALS</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
