'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { DEFAULT_SERVICES_SLIDESHOW } from '../data/servicesSlideshowData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
  X,
  Copy,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  Info,
} from 'lucide-react';

export default function Services3DCoverFlow({ className = '', onSelectService = null }) {
  const [services, setServices] = useState(DEFAULT_SERVICES_SLIDESHOW);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Active Service Modal State (Comprehensive consultation booking modal)
  const [activeModalService, setActiveModalService] = useState(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
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

  // Responsive check for mobile tuning
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync with localStorage / custom admin updates
  const loadServicesData = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem('sumuk_services_slideshow_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter for services marked to display in slideshow
          const activeOnly = parsed.filter((s) => s.showInSlideshow !== false);
          if (activeOnly.length > 0) {
            setServices(activeOnly);
            return;
          }
        }
      }
      setServices(DEFAULT_SERVICES_SLIDESHOW);
    } catch (_) {
      setServices(DEFAULT_SERVICES_SLIDESHOW);
    }
  }, []);

  useEffect(() => {
    loadServicesData();

    // Listen to admin update event
    const handleAdminUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        const activeOnly = e.detail.filter((s) => s.showInSlideshow !== false);
        if (activeOnly.length > 0) {
          setServices(activeOnly);
        }
      } else {
        loadServicesData();
      }
    };

    window.addEventListener('sumuk-services-slideshow-updated', handleAdminUpdate);
    return () => window.removeEventListener('sumuk-services-slideshow-updated', handleAdminUpdate);
  }, [loadServicesData]);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Pause when tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const total = services.length;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    if (total <= 1) return;
    setCurrentIndex((idx + total) % total);
  };

  // 4. Automatic rotation: switch to next service every 4000ms
  const timerRef = useRef(null);
  useEffect(() => {
    if (
      !isAutoPlaying ||
      isHovered ||
      isDragging ||
      isTabHidden ||
      prefersReducedMotion ||
      total <= 1 ||
      activeModalService !== null
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovered, isDragging, isTabHidden, prefersReducedMotion, total, currentIndex, activeModalService]);

  // Keyboard Navigation
  const containerRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModalService) {
        if (e.key === 'Escape') setActiveModalService(null);
        return;
      }
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeModalService]);

  // Touch Swipe for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const hasMoved = useRef(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
      hasMoved.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!hasMoved.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
  };

  // Mouse Drag for desktop
  const mouseStartX = useRef(0);
  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    setIsDragging(true);
    hasMoved.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 10) {
      hasMoved.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && hasMoved.current) {
      const deltaX = e.clientX - mouseStartX.current;
      if (deltaX > 50) {
        handlePrev();
      } else if (deltaX < -50) {
        handleNext();
      }
    }
    setIsDragging(false);
  };

  // Open Service details and booking modal
  const handleExploreService = (service, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onSelectService) {
      onSelectService(service);
    }
    setActiveModalService(service);
    setSelectedTierIndex(0);
    setShowInquiryForm(false);
    setBookingSuccess(false);
    setCopiedKey(null);
  };

  // WhatsApp Link Builder
  const getWhatsAppBookingLink = (service, tierIdx = selectedTierIndex) => {
    const tier = service?.pricingTiers?.[tierIdx];
    const tierText = tier ? `\n*Selected Option:* ${tier.name} (${tier.price})` : service?.priceDisplay ? `\n*Price:* ${service.priceDisplay}` : '';
    const reqPrompt =
      service?.detailsRequired && service.detailsRequired.length > 0
        ? `\n\n*My Session Details:*\n` + service.detailsRequired.map((r, i) => `${i + 1}. ${r}: `).join('\n')
        : '';

    const text = encodeURIComponent(
      `Hello Soumyaa! ✨ I would like to book a consultation for:\n*${service?.title || 'Metaphysical Service'}*${tierText}.${reqPrompt}\n\nKindly share the next available appointment slot. Thank you!`
    );
    return `https://wa.me/919111716355?text=${text}`;
  };

  // Copy Template Handler
  const handleCopyChecklist = (service) => {
    const fields = (service.detailsRequired || []).map((req, i) => `${i + 1}. ${req}: `).join('\n');
    const template = `✨ *Consultation Booking Request — Sumuk Crystalz 5*\n*Service:* ${service.title}\n*Option / Tier:* ${service.pricingTiers?.[selectedTierIndex]?.name || service.priceDisplay || 'Standard'}\n*Price:* ${service.pricingTiers?.[selectedTierIndex]?.price || service.priceDisplay || ''}\n\n*My Details:*\n${fields}\n\n*Payment Confirmation:* Attached`;
    navigator.clipboard.writeText(template);
    setCopiedKey('checklist');
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Form submit -> WhatsApp redirect
  const handleSubmitInquiryForm = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    const tier = activeModalService?.pricingTiers?.[selectedTierIndex];
    const message = encodeURIComponent(
      `*Service Consultation Request* ✨\n\n*Service:* ${activeModalService?.title}\n*Option:* ${tier?.name || 'Standard'} (${tier?.price || activeModalService?.priceDisplay || ''})\n*Name:* ${bookingFormData.name}\n*Gender:* ${bookingFormData.gender}\n*Date of Birth:* ${bookingFormData.dob || 'Not specified'}\n*Contact:* ${bookingFormData.contact}\n*Session Preference:* ${bookingFormData.sessionType}\n*Preferred Date:* ${bookingFormData.preferredDate || 'Flexible'}\n*Note:* ${bookingFormData.message || 'Looking forward to connecting!'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919111716355?text=${message}`, '_blank');
    }, 1000);
  };

  return (
    <section
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      aria-label="Sumuk Crystalz 3D Cover Flow Services Slideshow"
    >
      {/* ── Section Header matching luxury product slideshow typography ── */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold">
            Interactive 3D Sanctuary Cover Flow
          </span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1A15] tracking-tight leading-tight">
          Sacred Metaphysical &amp; <br />
          <span className="text-[#B45309]">Holistic Healing Services.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#5C5245] leading-relaxed max-w-2xl mx-auto font-sans-ui">
          Browse through our sacred consultations and sound-attuned therapies in genuine 3D perspective.
          Click any card to center it or explore complete session details.
        </p>
      </div>

      {/* ── 3D Cover Flow Stage ── */}
      <div
        className="relative w-full py-4 overflow-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Navigation Arrow: Previous (Left) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous service slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-amber-400 active:scale-95 text-[#1F1A15] border border-amber-300 shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Navigation Arrow: Next (Right) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next service slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-amber-400 active:scale-95 text-[#1F1A15] border border-amber-300 shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Carousel 3D Viewport Track */}
        <div
          className="relative w-full h-[570px] sm:h-[620px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {services.map((service, idx) => {
            // Circular offset relative to currentIndex (-total/2 to +total/2)
            let diff = (idx - currentIndex + total) % total;
            if (diff > total / 2) diff -= total;

            const isCenter = diff === 0;
            const isPrev = diff === -1;
            const isNext = diff === 1;
            const isFarPrev = diff === -2;
            const isFarNext = diff === 2;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // 3D Cover Flow Transform Calculations (replicated from Tiger's Eye product slideshow)
            let translateX = 0;
            let translateZ = -300;
            let rotateY = 0;
            let scale = 0.7;
            let opacity = 0;
            let zIndex = 5;

            if (isCenter) {
              translateX = 0;
              translateZ = isMobile ? 20 : 40;
              rotateY = 0;
              scale = isMobile ? 1.02 : 1.05;
              opacity = 1;
              zIndex = 30;
            } else if (isNext) {
              translateX = isMobile ? 48 : 62; // percentage
              translateZ = isMobile ? -80 : -120;
              rotateY = isMobile ? -20 : -28; // tilted right
              scale = isMobile ? 0.84 : 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (isPrev) {
              translateX = isMobile ? -48 : -62; // percentage
              translateZ = isMobile ? -80 : -120;
              rotateY = isMobile ? 20 : 28; // tilted left
              scale = isMobile ? 0.84 : 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (isFarNext) {
              translateX = isMobile ? 90 : 108;
              translateZ = isMobile ? -160 : -240;
              rotateY = isMobile ? -30 : -42;
              scale = isMobile ? 0.70 : 0.74;
              opacity = isMobile ? 0.2 : 0.45;
              zIndex = 10;
            } else if (isFarPrev) {
              translateX = isMobile ? -90 : -108;
              translateZ = isMobile ? -160 : -240;
              rotateY = isMobile ? 30 : 42;
              scale = isMobile ? 0.70 : 0.74;
              opacity = isMobile ? 0.2 : 0.45;
              zIndex = 10;
            }

            const servId = service.id || `serv-${idx}`;
            const servImg = service.image || '/assets/services/crystal-therapy.png';
            const servTitle = service.title || service.name;
            const servDesc = service.shortDescription || service.description;
            const servBadge = service.badge || 'HOLISTIC HEALING';
            const servPrice = service.priceDisplay || (service.price ? `₹${service.price}` : 'Consultation');

            return (
              <div
                key={servId}
                onClick={() => {
                  if (!isCenter) goToSlide(idx);
                }}
                className={`absolute w-[295px] sm:w-[350px] md:w-[375px] rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
                  isCenter ? 'cursor-default' : 'cursor-pointer hover:opacity-95'
                }`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow: isCenter
                    ? '0 25px 60px -15px rgba(180, 130, 40, 0.28), 0 0 0 1px rgba(212, 175, 55, 0.45)'
                    : '0 15px 35px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.2)',
                }}
              >
                {/* ── Premium Light Luxury Card Container ── */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#EAE3D5] flex flex-col justify-between h-[500px] sm:h-[530px] shadow-lg">
                  
                  {/* Top Image Box */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-gradient-to-b from-[#F7F3EB] to-[#ECE5D8] flex-shrink-0">
                    <Image
                      src={servImg}
                      alt={servTitle}
                      fill
                      sizes="(max-width: 640px) 295px, 375px"
                      priority={isCenter}
                      className={`object-cover transition-transform duration-700 ${
                        isCenter ? 'hover:scale-105' : ''
                      }`}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-md">
                        {servBadge}
                      </span>
                    </div>

                    {/* Online / Remote indicator */}
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/40 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ONLINE &amp; DISTANT</span>
                    </div>

                    {/* Verified Usui Reiki Master Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>USUI REIKI MASTER</span>
                    </div>
                  </div>

                  {/* Bottom Card Information */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white space-y-2.5">
                    <div className="space-y-2">
                      {/* Rating & Modality */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-500">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-stone-800">5.0</span>
                        </div>

                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          VEDIC SANCTUARY
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3
                        onClick={(e) => isCenter && handleExploreService(service, e)}
                        className={`font-editorial text-base sm:text-lg font-bold text-[#1F1A15] leading-snug line-clamp-1 ${
                          isCenter ? 'hover:text-[#B45309] transition-colors cursor-pointer' : ''
                        }`}
                        title={servTitle}
                      >
                        {servTitle}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-[#5C5245] leading-relaxed line-clamp-2 font-sans-ui">
                        {servDesc}
                      </p>
                    </div>

                    {/* Price and Action Row */}
                    <div className="pt-3.5 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 block uppercase tracking-wider">
                          Consultation
                        </span>
                        <span className="font-serif text-sm sm:text-base font-bold text-amber-800">
                          {servPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleExploreService(service, e)}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-stone-950 font-bold font-mono text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title="Explore full service details and booking options"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>EXPLORE SERVICE</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pagination Dots (All Services) ── */}
      <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Slideshow pagination">
        {services.map((s, dotIdx) => (
          <button
            key={s.id || dotIdx}
            type="button"
            onClick={() => goToSlide(dotIdx)}
            role="tab"
            aria-selected={currentIndex === dotIdx}
            aria-label={`Go to slide ${dotIdx + 1}: ${s.title}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === dotIdx
                ? 'w-8 h-2 bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_2px_8px_rgba(212,175,55,0.6)]'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ── COMPREHENSIVE SERVICE EXPLORE & BOOKING MODAL ── */}
      {/* ========================================================================= */}
      {activeModalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-text"
          onClick={() => setActiveModalService(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer z-10"
              aria-label="Close service modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Image and Title */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                <Image
                  src={activeModalService.image || '/assets/services/crystal-therapy.png'}
                  alt={activeModalService.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                  {activeModalService.badge || 'EXCLUSIVE'}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Sacred Practitioner &bull; Soumyaa Naveen</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {activeModalService.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-sans-ui leading-relaxed">
                  {activeModalService.description}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    {activeModalService.priceDisplay || 'Inquire for Booking'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Tiers Selection (if available) */}
            {activeModalService.pricingTiers && activeModalService.pricingTiers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Session Option / Tier</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalService.pricingTiers.map((tier, tidx) => {
                    const isSelected = selectedTierIndex === tidx;
                    return (
                      <div
                        key={tidx}
                        onClick={() => setSelectedTierIndex(tidx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-editorial text-sm font-bold text-stone-900">
                            {tier.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                            {tier.price}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {tier.details}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* What We Analyse / Session Focus */}
            {activeModalService.whatWeAnalyse && activeModalService.whatWeAnalyse.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] space-y-2.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F1A15] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>What We Focus On &amp; Align</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeModalService.whatWeAnalyse.map((point, pidx) => (
                    <div key={pidx} className="flex items-start gap-2 text-xs text-[#5C5245]">
                      <span className="text-amber-600 font-bold mt-0.5">&bull;</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Required for Booking + Template Copy */}
            {activeModalService.detailsRequired && activeModalService.detailsRequired.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                      Details Required For Booking
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyChecklist(activeModalService)}
                    className="px-3 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-[11px] font-mono font-bold text-amber-900 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedKey === 'checklist' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copy Checklist</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalService.detailsRequired.map((req, ridx) => (
                    <div
                      key={ridx}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 flex items-center gap-2"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spiritual Wellness Disclaimer / Important Note */}
            {activeModalService.importantNote && (
              <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{activeModalService.importantNote}</span>
              </div>
            )}

            {/* Direct Booking Actions (WhatsApp + Optional Inline Form) */}
            <div className="space-y-4 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
                  Ready to Confirm Your Session?
                </span>
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(!showInquiryForm)}
                  className="text-xs font-mono font-bold text-amber-700 underline cursor-pointer hover:text-amber-800"
                >
                  {showInquiryForm ? 'Hide Booking Form' : 'Fill Website Form Instead'}
                </button>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-950">
                      Direct WhatsApp Booking (Reiki Master Soumyaa)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Click to send your pre-filled inquiry to +91 91117 16355 for appointment scheduling.
                  </p>
                </div>
                <a
                  href={getWhatsAppBookingLink(activeModalService, selectedTierIndex)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95 flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Optional Inline Form */}
              {showInquiryForm && (
                <div className="pt-4 border-t border-stone-200">
                  {bookingSuccess ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-sm font-bold text-emerald-900">
                        Opening WhatsApp with your consultation details...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiryForm} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={bookingFormData.name}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp / Phone Number *"
                          value={bookingFormData.contact}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, contact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Date of Birth (DD/MM/YYYY)"
                          value={bookingFormData.dob}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, dob: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="date"
                          placeholder="Preferred Session Date"
                          value={bookingFormData.preferredDate}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Brief notes or questions for Soumyaa..."
                        value={bookingFormData.message}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
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
