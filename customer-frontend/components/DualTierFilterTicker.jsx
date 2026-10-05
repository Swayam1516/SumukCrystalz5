'use client';

import React, { useRef, useEffect } from 'react';

// Exact dataset preserved from existing records
export const DEFAULT_INTENTIONS = [
  { id: 'all', label: 'All Energy Stones', count: 118 },
  { id: 'purpose:love-relationships', label: 'Love & Relationships', count: 26 },
  { id: 'purpose:money-abundance', label: 'Money & Abundance', count: 34 },
  { id: 'purpose:protection', label: 'Protection & Shielding', count: 28 },
  { id: 'purpose:peace-relaxation', label: 'Peace & Relaxation', count: 18 },
  { id: 'purpose:focus-studies', label: 'Focus & Studies', count: 14 },
  { id: 'purpose:confidence', label: 'Confidence', count: 16 },
  { id: 'purpose:career-business', label: 'Career & Business', count: 22 },
  { id: 'purpose:manifestation', label: 'Manifestation', count: 20 },
  { id: 'purpose:spiritual-growth', label: 'Spiritual Growth', count: 25 },
  { id: 'purpose:healing-wellness', label: 'Healing & Wellness', count: 30 },
];

export const DEFAULT_MODALITIES = [
  { id: 'energy:7-chakras', label: '7 Chakras' },
  { id: 'energy:zodiac', label: 'Zodiac' },
  { id: 'energy:numerology', label: 'Numerology / Numbers' },
  { id: 'energy:planetary', label: 'Planetary Energy' },
  { id: 'energy:aura-energy', label: 'Aura & Energy' },
  { id: 'energy:vastu', label: 'Vastu Remedy' },
];

export default function DualTierFilterTicker({
  intentions = DEFAULT_INTENTIONS,
  modalities = DEFAULT_MODALITIES,
  selectedIntention = 'all',
  onSelectIntention,
  selectedModality = '',
  onSelectModality,
  isMarquee = false,
  className = '',
}) {
  const row1ScrollRef = useRef(null);
  const row2ScrollRef = useRef(null);

  // Enable seamless mouse wheel horizontal scrolling
  useEffect(() => {
    const handleWheel = (el) => (e) => {
      if (!el || isMarquee) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    const el1 = row1ScrollRef.current;
    const el2 = row2ScrollRef.current;

    const wheel1 = handleWheel(el1);
    const wheel2 = handleWheel(el2);

    if (el1) el1.addEventListener('wheel', wheel1, { passive: false });
    if (el2) el2.addEventListener('wheel', wheel2, { passive: false });

    return () => {
      if (el1) el1.removeEventListener('wheel', wheel1);
      if (el2) el2.removeEventListener('wheel', wheel2);
    };
  }, [isMarquee]);

  return (
    <div
      className={`w-full bg-[#050505] border-y border-white/[0.08] select-none ${className}`}
    >
      {/* =========================================================================
          ROW 1: "intentions" (Primary Categories)
          ========================================================================= */}
      <div className="flex w-full items-stretch border-b border-white/[0.08] min-h-[52px]">
        {/* Far-Left Rotated Vertical Label */}
        <div className="w-12 sm:w-14 flex-shrink-0 flex items-center justify-center border-r border-white/10 bg-black/40">
          <span
            className="text-[11px] font-medium text-[#6B7280] font-sans lowercase select-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '0.2em',
            }}
          >
            intentions
          </span>
        </div>

        {/* Scrollable / Marquee Register Line */}
        <div className="relative flex-1 min-w-0 overflow-hidden flex items-center">
          {/* Subtle edge fade masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10" />

          <div
            ref={row1ScrollRef}
            className={`w-full overflow-x-auto no-scrollbar py-3.5 px-6 ${
              isMarquee ? 'flex' : 'flex items-center'
            }`}
          >
            <div
              className={`flex items-center gap-8 sm:gap-12 whitespace-nowrap ${
                isMarquee ? 'animate-ticker-marquee pr-12' : ''
              }`}
            >
              {intentions.map((item) => {
                const isActive = selectedIntention === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectIntention && onSelectIntention(item.id)}
                    className="group inline-flex items-center cursor-pointer transition-all duration-200 outline-none"
                  >
                    <span
                      className={`text-[13.5px] tracking-normal transition-colors duration-200 ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-[#D1D5DB] font-medium group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    {typeof item.count === 'number' && (
                      <span
                        className={`text-[11px] font-mono ml-2 px-2 py-0.5 rounded-full transition-colors duration-200 ${
                          isActive
                            ? 'text-neutral-300 bg-white/[0.12]'
                            : 'text-neutral-500 bg-white/[0.06] group-hover:text-neutral-300 group-hover:bg-white/[0.10]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Seamless duplicate row for infinite marquee effect when enabled */}
            {isMarquee && (
              <div
                aria-hidden="true"
                className="flex items-center gap-8 sm:gap-12 whitespace-nowrap animate-ticker-marquee pr-12"
              >
                {intentions.map((item) => {
                  const isActive = selectedIntention === item.id;
                  return (
                    <button
                      key={`dup-${item.id}`}
                      type="button"
                      onClick={() => onSelectIntention && onSelectIntention(item.id)}
                      className="group inline-flex items-center cursor-pointer transition-all duration-200 outline-none"
                    >
                      <span
                        className={`text-[13.5px] tracking-normal transition-colors duration-200 ${
                          isActive
                            ? 'text-white font-semibold'
                            : 'text-[#D1D5DB] font-medium group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                      {typeof item.count === 'number' && (
                        <span
                          className={`text-[11px] font-mono ml-2 px-2 py-0.5 rounded-full transition-colors duration-200 ${
                            isActive
                              ? 'text-neutral-300 bg-white/[0.12]'
                              : 'text-neutral-500 bg-white/[0.06] group-hover:text-neutral-300 group-hover:bg-white/[0.10]'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: "modalities" (Secondary Attributes)
          ========================================================================= */}
      <div className="flex w-full items-stretch min-h-[46px]">
        {/* Far-Left Rotated Vertical Label */}
        <div className="w-12 sm:w-14 flex-shrink-0 flex items-center justify-center border-r border-white/10 bg-black/40">
          <span
            className="text-[11px] font-medium text-[#6B7280] font-sans lowercase select-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '0.2em',
            }}
          >
            energy
          </span>
        </div>

        {/* Scrollable / Marquee Register Line */}
        <div className="relative flex-1 min-w-0 overflow-hidden flex items-center">
          {/* Subtle edge fade masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10" />

          <div
            ref={row2ScrollRef}
            className={`w-full overflow-x-auto no-scrollbar py-3 px-6 ${
              isMarquee ? 'flex' : 'flex items-center'
            }`}
          >
            <div
              className={`flex items-center gap-8 sm:gap-10 whitespace-nowrap ${
                isMarquee ? 'animate-ticker-marquee pr-10' : ''
              }`}
            >
              {modalities.map((item) => {
                const isActive = selectedModality === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectModality && onSelectModality(item.id)}
                    className="group inline-flex items-center cursor-pointer transition-all duration-200 outline-none relative"
                  >
                    <span
                      className={`text-[13px] tracking-[-0.01em] transition-all duration-200 ${
                        isActive
                          ? 'text-white font-medium underline underline-offset-8 decoration-white/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                          : 'text-[#9CA3AF] font-normal group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Seamless duplicate row for infinite marquee effect when enabled */}
            {isMarquee && (
              <div
                aria-hidden="true"
                className="flex items-center gap-8 sm:gap-10 whitespace-nowrap animate-ticker-marquee pr-10"
              >
                {modalities.map((item) => {
                  const isActive = selectedModality === item.id;
                  return (
                    <button
                      key={`dup-${item.id}`}
                      type="button"
                      onClick={() => onSelectModality && onSelectModality(item.id)}
                      className="group inline-flex items-center cursor-pointer transition-all duration-200 outline-none relative"
                    >
                      <span
                        className={`text-[13px] tracking-[-0.01em] transition-all duration-200 ${
                          isActive
                            ? 'text-white font-medium underline underline-offset-8 decoration-white/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                            : 'text-[#9CA3AF] font-normal group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
