'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseServices } from '@/lib/supabase';
import { CANONICAL_SERVICES_DEFAULT, SERVICE_CATEGORIES } from '../data/servicesData';
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
  Layers,
  ChevronRight,
  BookmarkCheck,
  Tag,
} from 'lucide-react';

const ICON_MAP = {
  'tarot-reading': Moon,
  'numerology-analysis': Compass,
  'aura-checking': ShieldCheck,
  'crystal-consultation': Gem,
  'reiki-healing': Heart,
  'psychic-surgery': Zap,
  'mobile-numerology': Phone,
  'vehicle-numerology': Compass,
  'name-numerology': Sparkles,
};

export default function ServicesBySoumya({ showHeader = true, activeFilter = 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState(activeFilter);
  const [servicesList, setServicesList] = useState(CANONICAL_SERVICES_DEFAULT);
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState(null);
  const [servicesStatusMap, setServicesStatusMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchServicesData = async () => {
      try {
        const list = await getSupabaseServices();
        if (isMounted && list && list.length > 0) {
          setServicesList(list);
          const map = {};
          list.forEach((s) => {
            map[s.id] = s.status || 'available';
          });
          setServicesStatusMap(map);
        }
      } catch (err) {
        console.warn('Live services fetch notice:', err.message);
      }
    };

    fetchServicesData();
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
      ? servicesList
      : servicesList.filter((service) => service.category === selectedCategory);

  const handleOpenCommunication = (service) => {
    setActiveServiceModal(service);
    setSelectedTierIndex(0);
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

  const handleCopyTemplate = (service) => {
    const fields = (service.detailsRequired || []).map((req, i) => `${i + 1}. ${req}: `).join('\n');
    const template = `✨ *Consultation Booking Request — Sumuk Crystalz 5*\n*Service:* ${service.title}\n*Option / Tier:* ${service.pricingTiers?.[selectedTierIndex]?.name || service.priceDisplay || 'Standard'}\n*Price:* ${service.pricingTiers?.[selectedTierIndex]?.price || service.priceDisplay || ''}\n\n*My Details:*\n${fields}\n\n*Payment Confirmation:* Attached`;
    handleCopy(template, 'template');
  };

  const getWhatsAppLink = (service, tierIdx = selectedTierIndex) => {
    const currentTier = service?.pricingTiers?.[tierIdx];
    const status = servicesStatusMap[service?.id] || service?.status || 'available';
    const isWaitlist = status !== 'available';

    const selectedOptionText = currentTier
      ? `\n*Selected Option:* ${currentTier.name} (${currentTier.price})`
      : service?.priceDisplay ? `\n*Price:* ${service.priceDisplay}` : '';

    const requirementsPrompt = (service?.detailsRequired && service.detailsRequired.length > 0)
      ? `\n\n*Details for my session:*\n` + service.detailsRequired.map((r, i) => `${i + 1}. ${r}: `).join('\n')
      : '';

    const text = encodeURIComponent(
      isWaitlist
        ? `Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 to inquire about the priority waitlist for: *${service?.title || 'Metaphysical Consultation'}*.\nPlease notify me when appointments reopen.`
        : `Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 to book: *${service?.title || 'Metaphysical Consultation'}*${selectedOptionText}.${requirementsPrompt}\n\nLooking forward to your guidance!`
    );
    return `https://wa.me/919111716355?text=${text}`;
  };

  const getEmailLink = (service, tierIdx = selectedTierIndex) => {
    const currentTier = service?.pricingTiers?.[tierIdx];
    const status = servicesStatusMap[service?.id] || service?.status || 'available';
    const isWaitlist = status !== 'available';
    const subject = encodeURIComponent(
      isWaitlist
        ? `Waitlist Inquiry: ${service?.title || 'Metaphysical Service'} - Sumuk Crystalz 5`
        : `Booking Inquiry: ${service?.title || 'Metaphysical Service'} - Sumuk Crystalz 5`
    );
    const body = encodeURIComponent(
      `Hello Soumyaa,\n\nI would like to book a session for: ${service?.title || 'Service'}.\nSelected Option: ${currentTier?.name || 'Standard'} (${currentTier?.price || service?.priceDisplay || ''})\n\nPlease share your earliest available slot.\n\nThank you!`
    );
    return `mailto:sumukcrystalz5@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    const status = servicesStatusMap[activeServiceModal?.id] || activeServiceModal?.status || 'available';
    const currentTier = activeServiceModal?.pricingTiers?.[selectedTierIndex];
    const message = encodeURIComponent(
      `*Service Consultation Request* ✨\n\n*Service:* ${activeServiceModal?.title}\n*Option:* ${currentTier?.name || 'Standard'} (${currentTier?.price || activeServiceModal?.priceDisplay || ''})\n*Status:* ${status.toUpperCase()}\n*Name:* ${bookingFormData.name}\n*Gender:* ${bookingFormData.gender}\n*Date of Birth:* ${bookingFormData.dob || 'Not specified'}\n*Contact:* ${bookingFormData.contact}\n*Session Preference:* ${bookingFormData.sessionType}\n*Preferred Date/Time:* ${bookingFormData.preferredDate || 'Flexible'}\n*Note:* ${bookingFormData.message || 'Looking forward to connecting!'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919111716355?text=${message}`, '_blank');
    }, 1000);
  };

  return (
    <section id="services" className="relative space-y-12 scroll-mt-24">
      {/* Subtle Ambient Background Glows */}
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
            Experience authentic Vedic consultations, intuitive card readings, Biofield scanning, and sacred energy balancing guided by Usui Reiki Master <strong className="text-white">Soumyaa Naveen</strong>.
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 px-4 relative z-10">
        {SERVICE_CATEGORIES.map((cat) => {
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

      {/* Services Grid with Highlighted Key Words & Live Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 relative z-10">
        {filteredServices.map((service) => {
          const currentStatus = servicesStatusMap[service.id] || service.status || 'available';
          const isAvailable = currentStatus === 'available';
          const isUnavailable = currentStatus === 'currently unavailable';
          const isComingSoon = currentStatus === 'coming soon';
          const ServiceIcon = ICON_MAP[service.id] || Sparkles;

          return (
            <div
              key={service.id}
              onClick={() => handleOpenCommunication(service)}
              className={`rounded-[28px] bg-[#dedad2] hover:bg-[#e7e3db] border border-[#c6c1b6] p-7 sm:p-8 min-h-[440px] flex flex-col justify-between group shadow-[0_12px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative overflow-hidden select-none ${
                !isAvailable ? 'opacity-90 hover:opacity-100' : ''
              }`}
            >
              {/* Top Section: Status Pill + Pricing Pill */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Status Indicator Pill */}
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-900/15 text-emerald-800 border border-emerald-600/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Available
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-900/15 text-rose-800 border border-rose-600/30">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Unavailable
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-900/15 text-purple-800 border border-purple-600/30">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                      Coming Soon
                    </span>
                  )}

                  {/* Prominent Price Tag Highlight */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-[#11100e] text-[#f6d78a] shadow-sm">
                    <Tag className="w-3 h-3 text-gold-400" />
                    <span>{service.priceDisplay || `₹${service.price}`}</span>
                  </span>
                </div>

                {/* Modality Category Badge & Title */}
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#785b28] mb-1.5">
                    <ServiceIcon className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{service.badge || service.category?.toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#11100e] tracking-tight leading-snug font-serif group-hover:text-[#581c87] transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* HIGHLIGHTED MAIN KEY WORDS BADGES ROW */}
                {service.keywords && service.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.keywords.slice(0, 4).map((kw, kidx) => (
                      <span
                        key={kidx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-white/70 border border-[#b8a892]/60 text-[#2c2013] shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                        <span>{kw}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Concise Summary Description */}
                <p className="text-[13px] leading-relaxed text-[#2d2822] font-sans line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Lower Section: Format / Duration + Interactive Circular CTA */}
              <div className="relative z-10 pt-6 mt-4 border-t border-[#bfae9c]/40 flex items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-[#443c33] space-y-0.5">
                  <span className="block font-bold tracking-wider uppercase text-[#1a1816]">
                    {service.duration || '20–25 MIN'}
                  </span>
                  <span className="block text-[10px] text-[#554e44] truncate max-w-[190px]">
                    {service.format}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#11100e] text-[#f6d78a] group-hover:bg-[#b8860b] group-hover:text-black transition-all shadow-md">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    View Details
                  </span>
                  <CornerDownRight className="w-3.5 h-3.5 stroke-[2.4]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Founder Direct Communication Callout Banner */}
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
            Whether you need assistance choosing an intention-attuned crystal, scheduling an energy healing appointment, or exploring vehicle/name numerology, connect directly across your preferred channel.
          </p>

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
                  'Hello Soumyaa! ✨ I am reaching out from Sumuk Crystalz 5 to inquire about your sacred healing services, numerology analysis, and custom crystal curations.'
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

      {/* BROAD DESCRIPTION MODAL WITH HIGHLIGHTED KEY WORDS & TITLE */}
      {activeServiceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveServiceModal(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[28px] sm:rounded-[34px] border border-purple-200/80 relative shadow-[0_25px_90px_rgba(76,29,149,0.35)] text-[#1f1b2d] bg-[#faf7fd] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(254, 253, 255, 0.97) 0%, rgba(251, 248, 254, 0.94) 60%, rgba(248, 242, 254, 0.85) 100%)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#a855f7] to-[#d4af37] pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveServiceModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-md border border-purple-200 transition-all cursor-pointer z-30"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>

            {/* Modal Body Container */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-7">
              
              {/* 1. HEADER: BADGE + STATUS + TITLE + PRICE HIGHLIGHT */}
              <div className="space-y-3.5 pr-8 border-b border-purple-100/90 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200 text-[10.5px] sm:text-[11px] font-mono text-[#5b21b6] uppercase tracking-[0.2em] font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                    <span>SUMUK CRYSTALZ 5 &bull; {activeServiceModal.badge}</span>
                  </span>

                  {/* Status Indicator */}
                  {(() => {
                    const status = servicesStatusMap[activeServiceModal.id] || activeServiceModal.status || 'available';
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

                  {/* Highlighted Price Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-mono font-bold tracking-wider bg-[#151022] text-[#f6d78a] shadow-sm ml-auto">
                    <Tag className="w-3.5 h-3.5 text-gold-400" />
                    <span>{activeServiceModal.priceDisplay || `₹${activeServiceModal.price}`}</span>
                  </span>
                </div>

                {/* HIGHLIGHTED MAIN TITLE */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-[#151022]">
                  <span className="bg-gradient-to-r from-[#151022] via-[#5b21b6] to-[#b8860b] text-transparent bg-clip-text">
                    {activeServiceModal.title}
                  </span>
                </h3>

                {activeServiceModal.tagline && (
                  <p className="text-xs sm:text-[13px] font-sans font-medium text-[#4c3b68] italic">
                    {activeServiceModal.tagline}
                  </p>
                )}

                {/* HIGHLIGHTED MAIN KEY WORDS BAR */}
                {activeServiceModal.keywords && activeServiceModal.keywords.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold text-[#6b21a8] block mb-2">
                      KEY HIGHLIGHTS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeServiceModal.keywords.map((kw, kidx) => (
                        <span
                          key={kidx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#a855f7]/40 text-[#4a1d96] shadow-xs"
                        >
                          <Sparkles className="w-3 h-3 text-[#d97706]" />
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. BROAD DESCRIPTION & DETAILS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-100 shadow-sm space-y-3.5">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] font-bold text-[#6b21a8] flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>OVERVIEW &amp; PHILOSOPHY</span>
                </span>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#2d283e] leading-relaxed whitespace-pre-line font-normal">
                  {activeServiceModal.broadDescription || activeServiceModal.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-purple-100/90 text-[12px] text-[#4c3b68]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] flex-shrink-0 inline-block shadow-xs" />
                    <span><strong>Format:</strong> {activeServiceModal.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] flex-shrink-0 inline-block shadow-xs" />
                    <span><strong>Duration:</strong> {activeServiceModal.duration}</span>
                  </div>
                </div>
              </div>

              {/* 3. PRICING TIERS / OPTIONS (INTERACTIVE SELECTION) */}
              {activeServiceModal.pricingTiers && activeServiceModal.pricingTiers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[#151022] flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>PRICING OPTIONS &amp; TIERS (SELECT YOUR PREFERENCE)</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-[#6b21a8]">
                      Click an option to tailor booking
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {activeServiceModal.pricingTiers.map((tier, tidx) => {
                      const isSelected = selectedTierIndex === tidx;
                      return (
                        <div
                          key={tidx}
                          onClick={() => setSelectedTierIndex(tidx)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? 'bg-gradient-to-br from-purple-50 via-white to-amber-50/60 border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/30'
                              : 'bg-white/80 border-purple-100 hover:border-purple-300 shadow-xs'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#151022] leading-snug">
                                {tier.name}
                              </span>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-[#b8860b] text-white flex items-center justify-center flex-shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <span className="text-base font-serif font-bold text-[#b8860b] block">
                              {tier.price}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#4b435a] leading-relaxed">
                            {tier.details}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. TWO-COLUMN BREAKDOWN: WHAT WE ANALYSE & HOW IT WORKS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* WHAT WE ANALYSE / DISCUSS */}
                {activeServiceModal.whatWeAnalyse && activeServiceModal.whatWeAnalyse.length > 0 && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-purple-100 shadow-xs space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[#151022] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
                      <span>WHAT WE ANALYSE &amp; DISCUSS</span>
                    </span>
                    <ul className="space-y-2.5 pt-1">
                      {activeServiceModal.whatWeAnalyse.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2a2438] leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* HOW IT WORKS / SESSION PROTOCOL */}
                {activeServiceModal.howItWorks && activeServiceModal.howItWorks.length > 0 && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-purple-100 shadow-xs space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[#151022] flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>HOW THE PROCESS WORKS</span>
                    </span>
                    <ol className="space-y-2.5 pt-1">
                      {activeServiceModal.howItWorks.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2a2438] leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-[#151022] text-[#f6d78a] text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* 5. DETAILS REQUIRED FOR BOOKING + ONE-CLICK TEMPLATE COPY */}
              {activeServiceModal.detailsRequired && activeServiceModal.detailsRequired.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-amber-50/60 border border-purple-200/90 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-[#7c3aed]" />
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#151022]">
                        DETAILS REQUIRED FOR BOOKING
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyTemplate(activeServiceModal)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-[11px] font-mono font-bold text-[#5b21b6] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="Copy details checklist to clipboard"
                    >
                      {copiedChannel === 'template' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Checklist Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copy Template to WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#4b5563] leading-relaxed">
                    Please keep the following details ready when confirming your booking:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {activeServiceModal.detailsRequired.map((req, ridx) => (
                      <div
                        key={ridx}
                        className="p-2.5 rounded-xl bg-white/90 border border-purple-100 flex items-center gap-2 text-xs font-semibold text-[#1f1b2d]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#6d28d9] text-white flex items-center justify-center flex-shrink-0 text-[10px]">
                          ✓
                        </span>
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. IMPORTANT NOTE / SPIRITUAL WELLNESS DISCLAIMER */}
              {activeServiceModal.importantNote && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#78350f] text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-[#92400e]">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>IMPORTANT APPOINTMENT POLICY &amp; SPIRITUAL GUIDANCE</span>
                  </div>
                  <p className="text-[12px] leading-relaxed">
                    {activeServiceModal.importantNote}
                  </p>
                </div>
              )}

              {/* 7. COMMUNICATION CHANNELS & INSTANT ACTIONS */}
              <div className="space-y-4 pt-2 border-t border-purple-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#151022] font-mono font-bold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#059669]" />
                    <span>CONFIRM YOUR APPOINTMENT / BOOKING</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(!showInquiryForm)}
                    className="text-[11px] uppercase tracking-[0.16em] font-mono font-bold text-[#6d28d9] hover:text-[#5b21b6] underline cursor-pointer transition"
                  >
                    {showInquiryForm ? 'HIDE BOOKING FORM' : 'SUBMIT WEBSITE FORM INSTEAD'}
                  </button>
                </div>

                {/* WHATSAPP OFFICIAL BOOKING TILE */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border border-emerald-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                      <span className="text-xs uppercase tracking-[0.16em] font-bold text-emerald-950 font-mono">
                        CONFIRM ON WHATSAPP (DIRECT FOUNDER BOOKING)
                      </span>
                    </div>
                    <p className="text-xs text-[#2a2438]">
                      Click below to send your pre-filled consultation request directly to Reiki Master Soumyaa Naveen:
                    </p>
                    <span className="text-xs text-emerald-700 font-mono font-bold block pt-0.5">
                      wa.me/919111716355 (+91 91117 16355)
                    </span>
                  </div>

                  <a
                    href={getWhatsAppLink(activeServiceModal, selectedTierIndex)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] hover:opacity-95 active:scale-[0.98] text-white font-bold uppercase tracking-[0.16em] text-xs flex items-center justify-center gap-2 shadow-lg transition-all flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>CHAT &amp; CONFIRM ON WHATSAPP</span>
                  </a>
                </div>
              </div>

              {/* OPTIONAL INLINE WEBSITE FORM */}
              {showInquiryForm && (
                <div className="pt-6 border-t border-purple-200 animate-fade-in space-y-4">
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
                    <form onSubmit={handleSubmitInquiry} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#374151] mb-1 font-semibold">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Sharma"
                            value={bookingFormData.name}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs text-[#111827] focus:ring-2 focus:ring-[#7c3aed] outline-none shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#374151] mb-1 font-semibold">
                            Contact Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 XXXXX XXXXX"
                            value={bookingFormData.contact}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, contact: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs text-[#111827] focus:ring-2 focus:ring-[#7c3aed] outline-none shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#374151] mb-1 font-semibold">
                            Date of Birth (DD/MM/YYYY)
                          </label>
                          <input
                            type="text"
                            placeholder="DD/MM/YYYY"
                            value={bookingFormData.dob}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, dob: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs text-[#111827] focus:ring-2 focus:ring-[#7c3aed] outline-none shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#374151] mb-1 font-semibold">
                            Preferred Session Date
                          </label>
                          <input
                            type="date"
                            value={bookingFormData.preferredDate}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs text-[#111827] focus:ring-2 focus:ring-[#7c3aed] outline-none shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#374151] mb-1 font-semibold">
                          Questions, Intentions or Concerns
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Briefly describe what you would like to explore or heal..."
                          value={bookingFormData.message}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, message: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs text-[#111827] focus:ring-2 focus:ring-[#7c3aed] outline-none shadow-xs resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#b8860b] text-white font-bold uppercase tracking-[0.16em] text-xs shadow-md hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit &amp; Open WhatsApp Confirmation</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
