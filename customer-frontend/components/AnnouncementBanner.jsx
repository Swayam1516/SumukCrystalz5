'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Megaphone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getSupabaseAnnouncement } from '@/lib/supabase';

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    const loadAnnouncement = async () => {
      try {
        const data = await getSupabaseAnnouncement();
        if (isSubscribed && data) {
          setAnnouncement(data);
        }
      } catch (err) {
        console.warn('Announcement banner load notice:', err.message);
      }
    };

    loadAnnouncement();

    // Check if dismissed in session
    if (typeof window !== 'undefined') {
      try {
        const sessionDismiss = sessionStorage.getItem('sumuk_announcement_dismissed');
        if (sessionDismiss) {
          setDismissed(true);
        }
      } catch (_) {}
    }

    // Refresh every 60 seconds or on window focus
    const handleFocus = () => loadAnnouncement();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadAnnouncement, 60000);

    return () => {
      isSubscribed = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (pathname === '/shop') return null;
  if (!mounted || dismissed) return null;

  const rawMessage = announcement?.is_active && announcement?.message?.trim()
    ? announcement.message
    : 'Holy Navaratri Blessing: Complimentary Vedic 432Hz Sound Attunement on All Your Cart Orders with Code SUMUK108';
  const displayMessage = rawMessage.replace(/crystal vault/gi, 'Your Cart').replace(/vault/gi, 'Your Cart');

  const handleOpenBlessing = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-sacred-intro'));
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('sumuk_announcement_dismissed', 'true');
      } catch (_) {}
    }
  };

  const isHomepage = pathname === '/';

  return (
    <div
      role="region"
      aria-label="Site Announcement"
      className={`relative z-50 backdrop-blur-md border-b shadow-xs overflow-hidden transition-all duration-300 ${
        isHomepage
          ? 'bg-[#120B04]/90 border-[#D4AF37]/30 text-[#FFF1C5]'
          : 'bg-[#EAE2F2]/90 border-[#D8CBE4] text-[#29242D]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Banner Content */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          <div
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 shadow-xs ${
              isHomepage
                ? 'bg-black/50 border border-[#D4AF37]/40 text-[#E5C378]'
                : 'bg-white border border-[#D8CBE4] text-[#C8A65E]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
          </div>
          <span
            className={`font-sans font-medium tracking-wide leading-snug text-xs sm:text-[13px] ${
              isHomepage ? 'text-[#FFF1C5]' : 'text-[#29242D]'
            }`}
          >
            {displayMessage}
          </span>
          <button
            type="button"
            onClick={handleOpenBlessing}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs ${
              isHomepage
                ? 'bg-black/60 hover:bg-black/90 border border-[#D4AF37]/50 text-[#E5C378]'
                : 'bg-white hover:bg-[#F8F6F2] border border-[#D8CBE4] text-[#79539B]'
            }`}
            title="Open Welcome Blessing Artwork"
          >
            <span>View Blessing</span>
            <Sparkles className="w-2.5 h-2.5 text-[#C8A65E]" />
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className={`p-1 rounded-lg border transition-colors flex-shrink-0 cursor-pointer shadow-xs ${
            isHomepage
              ? 'bg-black/40 hover:bg-black/60 border-white/10 text-stone-300 hover:text-white'
              : 'bg-white/60 hover:bg-white border-[#D8CBE4] text-[#5C5562] hover:text-[#29242D]'
          }`}
          title="Dismiss Announcement"
          aria-label="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
