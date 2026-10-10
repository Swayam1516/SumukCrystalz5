'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseServices } from '@/lib/supabase';
import {
  Sparkles,
  Zap,
  Heart,
  ShieldCheck,
  Compass,
  Gem,
  Award,
  Flame,
  Moon,
  Instagram,
  CheckCircle2,
  ArrowRight,
  Clock,
  Globe,
  MessageCircle,
  X,
  Send,
  Calendar,
  Mail,
  Phone,
  Copy,
  Check,
  CornerDownRight,
  ExternalLink,
  MapPin,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const SOUMYA_SERVICES = [
  {
    id: 'reiki-master',
    title: 'Reiki Mastership & Energy Attunement',
    shortTitle: 'Reiki Master',
    badge: 'Core Modality',
    category: 'energy',
    icon: Sparkles,
    metaLabel: 'CORE MODALITY • 60–75 MIN',
    accentColor: 'from-amber-500/20 via-gold-500/10 to-transparent',
    borderColor: 'border-gold-500/30',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    iconColor: 'text-gold-400',
    tagline: 'Universal Life-Force Attunement & Pranic Vitality Flow',
    description:
      'Experience deep energetic restorative healing channeled by Usui Reiki Master Soumyaa Naveen. This high-frequency attunement cleanses the meridians, revitalizes depleted chakras, and aligns mind, body, and spirit into divine equilibrium.',
    benefits: [
      'Comprehensive 7-Chakra balancing & vibrational attunement',
      'Accelerates natural physical, mental, and emotional recovery',
      'Dissolves accumulated chronic stress, fatigue, and nervous exhaustion',
      'Distance Reiki sessions with identical quantum resonance worldwide',
    ],
    format: 'Remote Zoom / Sanctuary In-Person',
    duration: '60 – 75 Minutes',
    idealFor: 'Anyone seeking profound inner peace, emotional equilibrium, or energetic rejuvenation.',
  },
  {
    id: 'aura-checking',
    title: 'Aura Checking & Biofield Scanning',
    shortTitle: 'Aura Checking',
    badge: 'Diagnostic & Cleansing',
    category: 'readings',
    icon: ShieldCheck,
    metaLabel: 'DIAGNOSTIC SCAN • 45 MIN',
    accentColor: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    iconColor: 'text-purple-400',
    tagline: '7-Layer Subtle Body Analysis & Electromagnetic Cleansing',
    description:
      'An intuitive diagnostic scanning of your auric biofield layers. Soumyaa identifies energetic tears, heavy static accumulations, stagnant emotional debris, and external energetic leaks before performing a deep auric sealing.',
    benefits: [
      'Detailed diagnostic breakdown of your current auric dominant colors',
      'Identification of etheric leaks, energy drains, and boundary fissures',
      'Energetic smudge, sound-bath alignment, and auric protective seal',
      'Actionable crystal & frequency recommendations for long-term shielding',
    ],
    format: 'Remote Photo Analysis + Live Voice Consult',
    duration: '45 Minutes',
    idealFor: 'Empaths, healers, or individuals feeling drained, scattered, or susceptible to external vibes.',
  },
  {
    id: 'numerology',
    title: 'Sacred Numerology & Destiny Blueprint',
    shortTitle: 'Numerology',
    badge: 'Cosmic Blueprint',
    category: 'readings',
    icon: Compass,
    metaLabel: 'COSMIC BLUEPRINT • DOSSIER',
    accentColor: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    iconColor: 'text-cyan-400',
    tagline: 'Life Path, Soul Urge & Karmic Destiny Guidance',
    description:
      'Decode the vibrational mathematics of your birth date and sacred name. Uncover your inherent Soul Urge, Destiny Number, karmic cycles, and auspicious timing windows for career, wealth, and spiritual growth.',
    benefits: [
      'Comprehensive Life Path, Expression & Soul Urge calculation',
      'Current Personal Year cycle forecasting & auspicious transition dates',
      'Name vibration harmonization & resonance alignment',
      'Custom gemstone & frequency pairings tuned to your core numbers',
    ],
    format: 'Detailed Personalized PDF Dossier + Voice Note Consultation',
    duration: 'In-Depth Dossier + 30 Min Q&A',
    idealFor: 'Individuals navigating major life decisions, career pivots, or seeking profound self-knowledge.',
  },
  {
    id: 'tarot-readings',
    title: 'Intuitive Tarot Readings & Guidance',
    shortTitle: 'Tarot Readings',
    badge: 'Spiritual Clarity',
    category: 'readings',
    icon: Moon,
    metaLabel: 'SPIRITUAL CLARITY • 45–60 MIN',
    accentColor: 'from-indigo-500/20 via-violet-500/10 to-transparent',
    borderColor: 'border-indigo-500/30',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    iconColor: 'text-indigo-400',
    tagline: 'Archetypal Wisdom, Intuitive Foresight & Life Alignment',
    description:
      'Connect with higher spiritual guidance through sacred intuitive tarot spreads. Soumyaa channels lucid insights into love, purpose, relationships, and upcoming crossroads with compassionate accuracy.',
    benefits: [
      'Multi-card Celtic Cross, Chakra, or bespoke inquiry spreads',
      'Direct clarity on recurring karmic patterns and hidden opportunities',
      'Empowering guidance focused on sovereign free will and alignment',
      'High-resolution photo spread provided alongside session recording',
    ],
    format: '1-on-1 Video Session / Voice Memo + Photo Spread',
    duration: '45 – 60 Minutes',
    idealFor: 'Anyone seeking immediate perspective on crossroads, relationship questions, or life transitions.',
  },
  {
    id: 'crystal-therapy',
    title: 'Crystal Therapy & Resonant Attunement',
    shortTitle: 'Crystal Therapy',
    badge: 'Mineral Medicine',
    category: 'crystals',
    icon: Gem,
    metaLabel: 'MINERAL MEDICINE • 60 MIN',
    accentColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    iconColor: 'text-emerald-400',
    tagline: 'Piezo-Electric Harmonic Frequencies for Cellular Balance',
    description:
      'Harness the natural electromagnetic oscillation of master crystals placed upon the body’s key energetic vortices. This therapy balances biological frequencies, releases trapped trauma, and infuses your auric matrix with harmonic stillness.',
    benefits: [
      'Precision gemstone placement according to individual chakra imbalances',
      'Infusion of high-frequency crystalline piezoelectric vibrations',
      'Deep parasympathetic nervous system relaxation and stress dissolution',
      'Synergistic pairing with Solfeggio sound bowls and sacred herbs',
    ],
    format: 'Sanctuary In-Person / Quantum Crystal Grid Distance Session',
    duration: '60 Minutes',
    idealFor: 'Those with physical tension, chakra imbalances, or seeking immersive mineral attunement.',
  },
  {
    id: 'psychic-surgery',
    title: 'Psychic Surgery & Etheric Cord Cutting',
    shortTitle: 'Psychic Surgery',
    badge: 'Advanced Etheric Care',
    category: 'energy',
    icon: Zap,
    metaLabel: 'ETHERIC EXTRACTION • 60–75 MIN',
    accentColor: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderColor: 'border-rose-500/30',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    iconColor: 'text-rose-400',
    tagline: 'Energetic Extraction & Toxic Attachment Severing',
    description:
      'A powerful non-invasive etheric intervention designed to extract deep-seated emotional toxins, calcified blockages, and toxic cords of attachment. Soumyaa gently removes stagnant energetic implants and seals the etheric body.',
    benefits: [
      'Surgical severing of energy-draining cords from past relationships or trauma',
      'Etheric extraction of stagnant emotional cysts and energetic debris',
      'Golden light sealing and auric membrane reinforcement',
      'Rapid sensation of lightness, unburdened clarity, and restored sovereignty',
    ],
    format: 'High-Frequency Distance / Sanctuary In-Person',
    duration: '60 – 75 Minutes',
    idealFor: 'Individuals feeling bound by past relationships, unexplained heavy fatigue, or deep psychic baggage.',
  },
  {
    id: 'energy-healing',
    title: 'Energy Healing & Blockage Removal',
    shortTitle: 'Energy Healing & Blockages',
    badge: 'Vitality Reset',
    category: 'energy',
    icon: Heart,
    metaLabel: 'VITALITY RESET • 60 MIN',
    accentColor: 'from-emerald-500/20 via-amber-500/10 to-transparent',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    iconColor: 'text-emerald-300',
    tagline: 'Pranic Unblocking, Meridian Flow & Somatic Release',
    description:
      'Clear stagnant emotional and energetic dams across your subtle anatomy. By dissolving subconscious blockages, this modality restores natural life-force circulation (prana/chi) and re-ignites your vibrant enthusiasm.',
    benefits: [
      'Gentle yet profound clearing of energetic stagnation in key meridians',
      'Releases unexpressed emotional grief, anger, and anxiety stored somatically',
      'Restores optimal prana circulation throughout the entire endocrine matrix',
      'Includes grounding aftercare protocol and breathwork exercises',
    ],
    format: 'Remote Live Session / In-Person Sanctuary',
    duration: '60 Minutes',
    idealFor: 'People feeling stuck, stagnant in career or creativity, or experiencing prolonged emotional heaviness.',
  },
  {
    id: 'reiki-infused-products',
    title: 'Reiki-Infused Crystal Products',
    shortTitle: 'Reiki-Infused Products',
    badge: 'Consecrated Talismans',
    category: 'crystals',
    icon: Award,
    metaLabel: 'CONSECRATED TALISMANS • WORLDWIDE',
    accentColor: 'from-gold-500/20 via-purple-500/10 to-transparent',
    borderColor: 'border-gold-500/30',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    iconColor: 'text-gold-300',
    tagline: 'Personally Charged & Sound-Attuned Minerals',
    description:
      'Every crystal specimen, gemstone bracelet, and altar geode offered under this collection is personally cleansed, consecrated, and infused with Usui Reiki intention by Soumyaa Naveen before dispatch.',
    benefits: [
      'Sound-cleansed with Himalayan singing bowls and white sage/sandalwood',
      'Infused with customized healing intentions (Protection, Wealth, Harmony, Intuition)',
      'Accompanied by a signed Consecration Certificate and activation ritual guide',
      'Ready to place immediately in your altar or wear as an energetic shield',
    ],
    format: 'Insured Luxury Delivery Worldwide',
    duration: 'Immediate Dispatch from Vault',
    idealFor: 'Collectors, seekers, and gift-givers wanting crystals with alive, positive, high-vibration energy.',
  },
  {
    id: 'customized-crystal-orders',
    title: 'Customized Crystal Orders & Bespoke Curation',
    shortTitle: 'Customized Crystal Orders',
    badge: 'Bespoke Curation',
    category: 'crystals',
    icon: Flame,
    metaLabel: 'BESPOKE CURATION • TAILORED',
    accentColor: 'from-amber-500/20 via-rose-500/10 to-transparent',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    iconColor: 'text-amber-400',
    tagline: 'Personalized Altar Grids, Bespoke Jewelry & Space Attunement',
    description:
      'Collaborate directly with Soumyaa Naveen to curate a tailored crystal collection, customized gemstone jewelry piece, or sacred geometric grid designed exclusively for your astrological chart, home sanctuary, or office.',
    benefits: [
      '1-on-1 crystal matchmaking tailored to your astrological birth chart and intentions',
      'Custom handcrafted wire-wrapped gemstone pendants and intention bracelets',
      'Architectural geode selection for luxury homes, studios, and corporate lobbies',
      'Complete energetic blueprint and geometric layout instructions included',
    ],
    format: 'Private Consultation + Bespoke Crafting',
    duration: 'Tailored Timeline & Worldwide Shipping',
    idealFor: 'Anyone desiring bespoke gemstone jewelry, rare collector specimens, or home energy grid setups.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'ALL 9 SACRED MODALITIES' },
  { id: 'energy', label: 'ENERGY & REIKI HEALING' },
  { id: 'readings', label: 'INTUITIVE & AURA READINGS' },
  { id: 'crystals', label: 'CRYSTALS & BESPOKE ORDERS' },
];

export default function ServicesBySoumya({ showHeader = true, activeFilter = 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState(activeFilter);
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState(null);
  const [servicesStatusMap, setServicesStatusMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchStatuses = async () => {
      try {
        const list = await getSupabaseServices();
        if (isMounted && list && list.length > 0) {
          const map = {};
          list.forEach((s) => {
            map[s.id] = s.status || 'available';
          });
          setServicesStatusMap(map);
        }
      } catch (err) {
        console.warn('Live service status fetch notice:', err.message);
      }
    };

    fetchStatuses();
    return () => {
      isMounted = false;
    };
  }, []);

  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    gender: 'Female',
    dob: '',
    contact: '',
    preferredDate: '',
    sessionType: 'Remote Online (Zoom / Video)',
    message: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredServices =
    selectedCategory === 'all'
      ? SOUMYA_SERVICES
      : SOUMYA_SERVICES.filter((service) => service.category === selectedCategory);

  const handleOpenCommunication = (service) => {
    setActiveServiceModal(service);
    setShowInquiryForm(false);
    setBookingSuccess(false);
    setCopiedChannel(null);
  };

  const handleCopy = (text, channelKey) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channelKey);
    setTimeout(() => {
      setCopiedChannel(null);
    }, 2000);
  };

  const getWhatsAppLink = (service) => {
    const status = servicesStatusMap[service?.id] || 'available';
    const isWaitlist = status !== 'available';
    const text = encodeURIComponent(
      isWaitlist
        ? `Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 to inquire about the priority waitlist for: *${service?.title || 'Metaphysical Consultation'}*. Please notify me when appointments reopen.`
        : `Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 regarding: *${service?.title || 'Metaphysical Consultation'}*.\n\nI would love to learn more and book a consultation/session.`
    );
    return `https://wa.me/919111716355?text=${text}`;
  };

  const getEmailLink = (service) => {
    const status = servicesStatusMap[service?.id] || 'available';
    const isWaitlist = status !== 'available';
    const subject = encodeURIComponent(
      isWaitlist
        ? `Waitlist Inquiry: ${service?.title || 'Metaphysical Consultation'} - Sumuk Crystalz 5`
        : `Inquiry: ${service?.title || 'Metaphysical Consultation'} - Sumuk Crystalz 5`
    );
    const body = encodeURIComponent(
      isWaitlist
        ? `Hello Soumyaa,\n\nI would like to be added to the priority waitlist for the ${service?.title || 'session'}.\n\nPlease notify me when booking slots become available.\n\nThank you!`
        : `Hello Soumyaa,\n\nI would like to inquire about the ${service?.title || 'session'}.\n\nPlease share the available appointment slots, format details, and investment exchange.\n\nThank you!`
    );
    return `mailto:sumukcrystalz5@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    const status = servicesStatusMap[activeServiceModal?.id] || 'available';
    const isWaitlist = status !== 'available';
    const message = encodeURIComponent(
      `*${isWaitlist ? 'Service Waitlist Request' : 'New Service Consultation Request'}* ✨\n\n*Service:* ${activeServiceModal?.title}\n*Status:* ${status.toUpperCase()}\n*Name:* ${bookingFormData.name}\n*Gender:* ${bookingFormData.gender}\n*Date of Birth:* ${bookingFormData.dob || 'Not specified'}\n*Contact:* ${bookingFormData.contact}\n*Session Preference:* ${bookingFormData.sessionType}\n*Preferred Date/Time:* ${bookingFormData.preferredDate || 'Flexible'}\n*Note:* ${bookingFormData.message || 'Looking forward to connecting!'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919111716355?text=${message}`, '_blank');
    }, 1000);
  };

  return (
    <section id="services" className="relative space-y-12 scroll-mt-24">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {showHeader && (
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-3d">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#e8c97c] uppercase font-semibold">
              SUMUK CRYSTALZ 5 &bull; SACRED MODALITIES
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight text-3d-title">
            Holistic Healing &amp; Metaphysical <br />
            <span className="gold-gradient-text">Services by Soumyaa Naveen</span>
          </h2>

          <p className="text-xs sm:text-sm text-luxe-300 leading-relaxed max-w-2xl mx-auto">
            Beyond offering ethically mined master crystals, founder <strong className="text-white">Soumyaa Naveen</strong> is a certified Reiki Master, intuitive aura analyst, and metaphysical counselor dedicated to restoring your vital equilibrium and spiritual clarity.
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 px-4 relative z-10">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.16em] transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-gold-500/25 to-amber-500/20 border border-amber-400/80 text-[#f6d78a] shadow-[0_0_20px_rgba(212,175,55,0.25)] font-bold scale-105'
                  : 'bg-[#090812]/80 backdrop-blur-xl border border-amber-500/25 text-white/80 hover:text-[#e8c97c] hover:border-amber-400/50 hover:bg-white/[0.05] font-medium'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid with Live Availability Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 relative z-10">
        {filteredServices.map((service) => {
          const currentStatus = servicesStatusMap[service.id] || 'available';
          const isAvailable = currentStatus === 'available';
          const isUnavailable = currentStatus === 'currently unavailable';
          const isComingSoon = currentStatus === 'coming soon';

          return (
            <div
              key={service.id}
              onClick={() => handleOpenCommunication(service)}
              className={`rounded-[28px] bg-[#dedad2] hover:bg-[#e7e3db] border border-[#c6c1b6] p-7 sm:p-9 min-h-[420px] sm:min-h-[450px] flex flex-col justify-between group shadow-[0_12px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative overflow-hidden select-none ${
                !isAvailable ? 'opacity-90 hover:opacity-100' : ''
              }`}
            >
              {/* Top Section: Status Pill + Narrative Description Text */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  {/* Status Indicator Pill */}
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-900/15 text-emerald-800 border border-emerald-600/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Available for Booking
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-900/15 text-rose-800 border border-rose-600/30">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Currently Unavailable
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-900/15 text-purple-800 border border-purple-600/30">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#22201e] font-sans-ui font-normal">
                  {service.description}
                </p>
              </div>

              {/* Lower Section: Large Bold Editorial Title + Bottom Metadata Row */}
              <div className="relative z-10 pt-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[31px] font-bold text-[#11100e] tracking-tight leading-[1.08] font-sans-ui mb-7 group-hover:text-black transition-colors">
                  {service.title}
                </h3>

                <div className="flex items-center justify-between gap-4 pt-1">
                  {/* Bottom Left: Tag / Category Metadata */}
                  <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-[#1a1816]">
                    {service.metaLabel || `${service.badge.toUpperCase()}`}
                  </span>

                  {/* Bottom Right: Circular Action Button with Arrow */}
                  <div
                    aria-label={`Inquire about ${service.title}`}
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md flex-shrink-0 ${
                      isAvailable
                        ? 'bg-[#11100e] text-white group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-black'
                        : 'bg-[#4b5563] text-stone-200 group-hover:scale-110 group-hover:bg-[#11100e]'
                    }`}
                  >
                    <CornerDownRight className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Founder Direct Communication Callout Banner - Styled with Image 1 Gold Glassmorphism */}
      <div className="rounded-3xl bg-[#090812]/90 backdrop-blur-2xl border border-amber-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <Link
              href="/about"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.4)] group block"
              title="Learn more about Founder Soumyaa Naveen"
            >
              <Image
                src="/images/soumya-profile.jpeg"
                alt="Soumyaa Naveen - Founder of Sumuk Crystalz 5"
                fill
                sizes="96px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full badge-3d text-[#e8c97c] text-[11px] font-mono uppercase tracking-[0.2em] font-semibold">
              <Instagram className="w-3.5 h-3.5" />
              <span>DIRECT FOUNDER CONSULTATION</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white text-3d-title">
            Have a Specific Question for Soumyaa Naveen?
          </h3>

          <p className="text-xs sm:text-sm text-luxe-300 max-w-xl mx-auto leading-relaxed">
            Whether you need assistance choosing an intention-attuned crystal, scheduling an emergency cord-cutting session, or ordering bespoke altar pieces, connect directly across your preferred channel.
          </p>

          {/* Action Buttons Styled with Image 1 Aesthetic (No chunky monospace font, refined uppercase tracking) */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold uppercase tracking-[0.16em] text-xs px-8 py-3.5 rounded-full shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:scale-105 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>DM ON INSTAGRAM @SUMUKCRYSTALZ5</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(
                  'Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 to inquire about your sacred healing services and custom crystal orders.'
                );
                window.open(`https://wa.me/919111716355?text=${text}`, '_blank');
              }}
              className="bg-[#090812]/80 backdrop-blur-xl border border-amber-500/35 text-white/90 hover:text-[#f6d78a] hover:border-amber-400/60 uppercase tracking-[0.16em] text-xs font-semibold px-8 py-3.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:bg-white/[0.05]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WHATSAPP INSTANT MESSAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Channel Interactive Communication Modal (Transformed to Ethereal Light Luxury Crystal Aesthetic matching Image 2) */}
      {activeServiceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/65 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveServiceModal(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[28px] sm:rounded-[34px] border border-purple-200/80 relative shadow-[0_25px_90px_rgba(76,29,149,0.3)] text-[#1f1b2d] bg-[#faf7fd] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(254, 253, 255, 0.96) 0%, rgba(251, 248, 254, 0.92) 55%, rgba(248, 242, 254, 0.45) 100%), url('/images/service-modal-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7]/60 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveServiceModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black shadow-sm border border-purple-100/80 transition-all cursor-pointer z-30"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>

            {/* Modal Body Container */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              {/* Main Grid: Left side (Details & Channels) + Right side (Important Note & Aesthetic Display) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                
                {/* LEFT COLUMN: Header, Description, Communication Options */}
                <div className="lg:col-span-7 xl:col-span-7 space-y-5">
                  
                  {/* Badge, Status & Title */}
                  <div className="space-y-2.5 pr-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200/80 text-[10.5px] sm:text-[11px] font-mono text-[#5b21b6] uppercase tracking-[0.2em] font-bold shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                        <span>SUMUK CRYSTALZ 5 &bull; {activeServiceModal.badge}</span>
                      </div>

                      {/* Modal Live Status Indicator */}
                      {(() => {
                        const status = servicesStatusMap[activeServiceModal.id] || 'available';
                        if (status === 'available') {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              Available for Booking
                            </span>
                          );
                        }
                        if (status === 'currently unavailable') {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-800 border border-rose-500/30">
                              <span className="w-2 h-2 rounded-full bg-rose-600" />
                              Currently Unavailable
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-800 border border-purple-500/30">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                            Coming Soon
                          </span>
                        );
                      })()}
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold leading-[1.15] tracking-tight text-[#151022]">
                      {activeServiceModal.title.includes('&') ? (
                        <>
                          <span>{activeServiceModal.title.split('&')[0]}&amp; </span>
                          <span className="bg-gradient-to-r from-[#6b21a8] via-[#7c3aed] to-[#9333ea] text-transparent bg-clip-text">
                            {activeServiceModal.title.split('&').slice(1).join('&')}
                          </span>
                        </>
                      ) : (
                        <span className="bg-gradient-to-r from-[#151022] via-[#6b21a8] to-[#7c3aed] text-transparent bg-clip-text">
                          {activeServiceModal.title}
                        </span>
                      )}
                    </h3>

                    <p className="text-[11px] sm:text-[12px] font-mono font-bold uppercase tracking-[0.22em] text-[#4c3b68]">
                      {activeServiceModal.tagline}
                    </p>
                  </div>

                  {/* Unavailable / Coming Soon Notice Banner */}
                  {(() => {
                    const status = servicesStatusMap[activeServiceModal.id] || 'available';
                    if (status === 'currently unavailable') {
                      return (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#92400e] text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Appointments Temporarily Paused</span>
                          </div>
                          <p className="text-[11.5px] text-[#78350f] leading-relaxed">
                            Soumyaa Naveen is currently fulfilling ongoing patron sessions. Reach out via WhatsApp or Instagram to join the priority waitlist and get notified the moment slots reopen.
                          </p>
                        </div>
                      );
                    }
                    if (status === 'coming soon') {
                      return (
                        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-[#581c87] text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-purple-600" />
                            <span>New Modality Launching Soon</span>
                          </div>
                          <p className="text-[11.5px] text-[#6b21a8] leading-relaxed">
                            This metaphysical offering is currently in preparation. Connect on WhatsApp or Instagram to be among the first consecrated participants.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Service Description Box with Format & Duration */}
                  <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-purple-100/90 shadow-[0_4px_20px_rgba(124,58,237,0.04)] space-y-3.5">
                    <p className="text-[13px] sm:text-[13.5px] text-[#2d283e] leading-relaxed font-normal">
                      {activeServiceModal.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-purple-100/80 text-[12px] text-[#4c3b68]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] flex-shrink-0 inline-block shadow-sm" />
                        <span><strong>Format:</strong> {activeServiceModal.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] flex-shrink-0 inline-block shadow-sm" />
                        <span><strong>Duration:</strong> {activeServiceModal.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* SELECT HOW YOU WANT TO COMMUNICATE Header */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#2c2340] font-mono font-bold flex items-center gap-2">
                        <span>SELECT HOW YOU WANT TO COMMUNICATE</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowInquiryForm(!showInquiryForm)}
                        className="text-[11px] uppercase tracking-[0.16em] font-mono font-bold text-[#6d28d9] hover:text-[#5b21b6] underline cursor-pointer transition"
                      >
                        {showInquiryForm ? 'HIDE BOOKING FORM' : 'LEAVE BOOKING DETAILS'}
                      </button>
                    </div>

                    {/* 4 COMMUNICATION CHANNELS (Instagram, WhatsApp, Email, Phone Number) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* 1. INSTAGRAM DM */}
                      <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group">
                        <div>
                          <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#151022] block font-mono">
                            INSTAGRAM DM
                          </span>
                          <span className="text-xs text-[#7c3aed] font-mono mt-0.5 block">
                            @sumukcrystalz5
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#8b5cf6] hover:opacity-95 active:scale-[0.98] text-white font-bold uppercase tracking-[0.14em] text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <span>OPEN DM</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy('https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn', 'instagram')}
                            className="py-2.5 px-3 rounded-xl bg-white border border-purple-200/90 hover:bg-purple-50 text-[#3b354d] text-[10.5px] uppercase font-bold tracking-wider font-mono flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                            title="Copy Instagram link"
                          >
                            {copiedChannel === 'instagram' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 2. WHATSAPP */}
                      <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group">
                        <div>
                          <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#151022] block font-mono">
                            WHATSAPP
                          </span>
                          <span className="text-xs text-[#059669] font-mono font-medium mt-0.5 block truncate">
                            wa.me/c/919111716355
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={getWhatsAppLink(activeServiceModal)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] hover:opacity-95 active:scale-[0.98] text-white font-bold uppercase tracking-[0.14em] text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>CHAT ON WHATSAPP</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy('https://wa.me/c/919111716355', 'whatsapp')}
                            className="py-2.5 px-3 rounded-xl bg-white border border-purple-200/90 hover:bg-purple-50 text-[#3b354d] text-[10.5px] uppercase font-bold tracking-wider font-mono flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                            title="Copy WhatsApp link"
                          >
                            {copiedChannel === 'whatsapp' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3. EMAIL */}
                      <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group">
                        <div>
                          <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#151022] block font-mono">
                            EMAIL
                          </span>
                          <span className="text-xs text-[#b45309] font-mono mt-0.5 block truncate max-w-[190px]">
                            sumukcrystalz5@gmail.com
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={getEmailLink(activeServiceModal)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:opacity-95 active:scale-[0.98] text-white font-bold uppercase tracking-[0.14em] text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>SEND EMAIL</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy('sumukcrystalz5@gmail.com', 'email')}
                            className="py-2.5 px-3 rounded-xl bg-white border border-purple-200/90 hover:bg-purple-50 text-[#3b354d] text-[10.5px] uppercase font-bold tracking-wider font-mono flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                            title="Copy Email address"
                          >
                            {copiedChannel === 'email' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 4. PHONE NUMBER */}
                      <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group">
                        <div>
                          <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#151022] block font-mono">
                            CONTACT NUMBER
                          </span>
                          <span className="text-xs text-[#2563eb] font-mono font-medium mt-0.5 block">
                            +91-9111716355
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="tel:+919111716355"
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:opacity-95 active:scale-[0.98] text-white font-bold uppercase tracking-[0.14em] text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>DIRECT CALL</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy('+91-9111716355', 'phone')}
                            className="py-2.5 px-3 rounded-xl bg-white border border-purple-200/90 hover:bg-purple-50 text-[#3b354d] text-[10.5px] uppercase font-bold tracking-wider font-mono flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                            title="Copy phone number"
                          >
                            {copiedChannel === 'phone' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Important Note Box & Amethyst Crystal Sanctuary Background */}
                <div className="lg:col-span-5 xl:col-span-5 space-y-5 flex flex-col justify-between">
                  
                  {/* IMPORTANT NOTE Card */}
                  <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/90 shadow-[0_8px_30px_rgba(124,58,237,0.08)] space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#7c3aed]" />
                      <h5 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#151022]">
                        IMPORTANT NOTE
                      </h5>
                    </div>

                    <p className="text-xs text-[#4b5563] leading-relaxed">
                      While booking, please mention the following details for a smooth consultation:
                    </p>

                    <ul className="space-y-2.5 pt-1">
                      {['Full Name', 'Gender', 'Date of Birth', 'Contact Number'].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-[#1f1b2d]">
                          <span className="w-4 h-4 rounded-full bg-[#6d28d9] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="font-serif italic text-xs sm:text-[13px] text-[#6b5c82] pt-3 leading-relaxed border-t border-purple-100/80">
                      This helps us provide you with a more accurate and personalized analysis. &#9825;
                    </p>

                    {/* Office & Sanctuary Physical Location */}
                    <div className="pt-3 border-t border-purple-100/80 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#5b21b6]">
                        <MapPin className="w-3.5 h-3.5 text-[#7c3aed]" />
                        <span>Sanctuary &amp; Office Location:</span>
                      </div>
                      <p className="text-xs text-[#2d283e] font-medium">Sus Gaon, Pune, Maharashtra</p>
                      <a
                        href="https://share.google/ZlRBaN7xnl5EdHmIX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#7c3aed] hover:text-[#5b21b6] hover:underline font-mono font-bold inline-flex items-center gap-1 mt-1"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Visual Space for Desktop where background crystal artwork displays */}
                  <div className="hidden lg:block h-32" />
                </div>
              </div>

              {/* Optional Scheduling Form (Smooth light glass theme) */}
              {showInquiryForm && (
                <div className="pt-6 border-t border-purple-200/60 animate-fade-in space-y-4">
                  {bookingSuccess ? (
                    <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2.5">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="font-serif text-lg font-bold text-[#065f46]">
                        Consultation Request Ready!
                      </h4>
                      <p className="text-xs text-[#047857]">
                        Opening your direct WhatsApp thread with Soumyaa Naveen to confirm appointment availability.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-[0.18em] font-mono text-[#151022] font-bold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#7c3aed]" />
                          <span>Leave Your Appointment Request</span>
                        </h5>
                        <span className="text-[11px] text-[#6b5c82] font-mono">Direct Founder Routing</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Radhika Sharma"
                            value={bookingFormData.name}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Gender</label>
                          <select
                            value={bookingFormData.gender}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, gender: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Non-Binary / Other">Non-Binary / Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Date of Birth</label>
                          <input
                            type="text"
                            placeholder="e.g. 14 Aug 1994"
                            value={bookingFormData.dob}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, dob: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Contact (WhatsApp / Phone) *</label>
                          <input
                            type="text"
                            required
                            placeholder="+91 98765 43210"
                            value={bookingFormData.contact}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, contact: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Session Mode</label>
                          <select
                            value={bookingFormData.sessionType}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, sessionType: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          >
                            <option value="Remote Online (Zoom / Video)">Remote Online (Zoom / Video)</option>
                            <option value="In-Person Sanctuary (Sus Gaon, Pune, Maharashtra)">In-Person Sanctuary (Sus Gaon, Pune, Maharashtra)</option>
                            <option value="Detailed Offline Report / Voice Note">Detailed Offline Report / Voice Note</option>
                            <option value="Custom Order Shipping">Custom Order Shipping</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">Preferred Date / Timing</label>
                          <input
                            type="text"
                            placeholder="e.g. This weekend / Next Tuesday morning"
                            value={bookingFormData.preferredDate}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] transition shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-mono text-[#4b5563] mb-1 font-semibold">
                          Your Intentions, Questions or Life Crossroads (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Describe any particular emotional blocks, crossroads, or goals for your session..."
                          value={bookingFormData.message}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, message: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-[#1f1b2d] text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] transition resize-none shadow-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#7c3aed] via-[#9333ea] to-[#c026d3] text-white font-bold uppercase tracking-[0.16em] text-xs py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Booking Request via WhatsApp</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Modal Footer Row Matching Image 2 */}
              <div className="pt-4 border-t border-purple-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[10.5px] font-mono tracking-[0.2em] uppercase text-[#6b5c82] font-semibold">
                <div className="flex items-center gap-2">
                  <span>— CRYSTALS</span>
                  <span>|</span>
                  <span>WELLNESS</span>
                  <span>|</span>
                  <span>POSITIVE ENERGY</span>
                  <span>|</span>
                  <span>BRIGHTER YOU</span>
                </div>
                <div>
                  <span>SUMUK CRYSTALZ 5 &bull; CONNECTING ENERGY &bull; EMPOWERING LIVES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
