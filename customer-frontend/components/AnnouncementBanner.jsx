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

  const displayMessage = announcement?.is_active && announcement?.message?.trim()
    ? announcement.message
    : 'WELCOME TO SUMUK CRYSTALZ 5 — Consecrated by Usui Reiki Master Soumyaa Naveen';

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

  return (
    <div
      role="region"
      aria-label="Site Announcement"
      className="relative z-50 bg-gradient-to-r from-[#171207] via-[#2a1d08] to-[#171207] border-b border-[#D4AF37]/35 text-[#f6e6be] shadow-[0_4px_25px_rgba(212,175,55,0.15)] overflow-hidden transition-all duration-300"
    >
      {/* Ambient subtle shimmer lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd978]/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Banner Content */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ffd978] flex-shrink-0 animate-pulse">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-sans font-medium tracking-wide text-[#f7e8c3] leading-snug text-xs sm:text-[13px]">
            {displayMessage}
          </span>
          <button
            type="button"
            onClick={handleOpenBlessing}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/45 text-[#ffd978] text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer shadow-xs"
            title="Open Welcome Blessing Artwork"
          >
            <span>View Blessing</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg bg-black/30 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-stone-300 hover:text-[#ffd978] transition-colors flex-shrink-0 cursor-pointer"
          title="Dismiss Announcement"
          aria-label="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
