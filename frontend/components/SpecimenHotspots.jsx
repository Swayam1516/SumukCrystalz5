'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { crystalAudio } from '../utils/harmonicResonance';

export default function SpecimenHotspots({
  hotspots = [],
  activeCrystal,
  visible = true,
  onSelectFeature,
}) {
  const [activeHotspotId, setActiveHotspotId] = useState(null);

  if (!visible || !hotspots || hotspots.length === 0) return null;

  const handleHotspotClick = (spot) => {
    if (activeHotspotId === spot.id) {
      setActiveHotspotId(null);
    } else {
      setActiveHotspotId(spot.id);
      crystalAudio.playChime(1200);
      if (onSelectFeature) onSelectFeature(spot);
    }
  };

  const activeSpot = hotspots.find((h) => h.id === activeHotspotId);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 3D Hotspot Pins */}
      {hotspots.map((spot, index) => {
        const isActive = activeHotspotId === spot.id;

        return (
          <div
            key={spot.id}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => handleHotspotClick(spot)}
              onMouseEnter={() => crystalAudio.playChime(1600 + index * 100)}
              aria-label={`Inspect ${spot.title}`}
              className="relative group p-2 focus:outline-none"
            >
              {/* Pulsing Aura Halo */}
              <span
                className="absolute inset-0 rounded-full animate-hotspot pointer-events-none"
                style={{
                  '--crystal-glow': activeCrystal.colorGlow || 'rgba(192, 132, 252, 0.5)',
                }}
              />

              {/* 3D Tactile Pin Core */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border ${
                  isActive
                    ? 'scale-125 border-white bg-white text-black shadow-2xl'
                    : 'border-white/50 bg-black/70 text-white hover:scale-115 hover:border-white'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 0 28px ${activeCrystal.colorAccent}, 0 6px 16px rgba(0,0,0,0.8), inset 0 1px 2px #ffffff`
                    : `0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4)`,
                }}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isActive ? 'bg-black' : 'bg-white group-hover:scale-125'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#000000' : activeCrystal.colorAccent,
                    boxShadow: isActive ? undefined : `0 0 8px ${activeCrystal.colorAccent}`,
                  }}
                />
              </div>

              {/* 3D Minimal Label Pill (Desktop Hover) */}
              <div
                className={`hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-ui font-semibold whitespace-nowrap backdrop-blur-2xl border border-white/20 bg-black/85 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl ${
                  isActive ? '!opacity-100 border-white/40 scale-105' : ''
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: activeCrystal.colorAccent }}
                />
                <span className="tracking-wide text-3d-subtle">{spot.title}</span>
              </div>
            </button>
          </div>
        );
      })}

      {/* 3D Active Hotspot Dossier Popover */}
      {activeSpot && (
        <div className="absolute bottom-28 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 pointer-events-auto z-30 animate-fade-in">
          <div className="glass-panel-3d p-6 relative shadow-2xl border border-white/25">
            {/* Close Button */}
            <button
              onClick={() => setActiveHotspotId(null)}
              className="btn-3d-action absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-luxe-300 hover:text-white transition"
              aria-label="Close Feature Details"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full badge-3d font-bold"
                style={{ color: activeCrystal.colorAccent }}
              >
                {activeSpot.category || 'Morphology'}
              </span>
              <span className="text-[10px] font-mono text-luxe-400">
                FEATURE {hotspots.findIndex((h) => h.id === activeSpot.id) + 1} OF {hotspots.length}
              </span>
            </div>

            {/* Title with Display Font */}
            <h4 className="font-display text-xl font-bold text-white mb-2 tracking-wide text-3d-title">
              {activeSpot.title}
            </h4>

            {/* Clear, understandable description */}
            <p className="text-xs sm:text-sm font-sans-ui text-luxe-200 leading-relaxed mb-4">
              {activeSpot.desc}
            </p>

            {/* Spec Tag with 3D Depth */}
            {activeSpot.spec && (
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-luxe-200 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4" style={{ color: activeCrystal.colorAccent }} />
                  <span>{activeSpot.spec}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
