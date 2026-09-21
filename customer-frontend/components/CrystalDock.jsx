'use client';

import React, { useEffect } from 'react';
import {
  RotateCw,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Compass,
  Layers,
} from 'lucide-react';
import { crystalAudio } from '../utils/harmonicResonance';

export default function CrystalDock({
  crystals = [],
  activeCrystal,
  onSelectCrystal,
  isInteractiveMode,
  setIsInteractiveMode,
  rotationAngle,
  setRotationAngle,
  showHotspots,
  setShowHotspots,
  lightingMode,
  setLightingMode,
  soundActive,
  setSoundActive,
}) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '1' && crystals[0]) onSelectCrystal(crystals[0]);
      if (e.key === '2' && crystals[1]) onSelectCrystal(crystals[1]);
      if (e.key === '3' && crystals[2]) onSelectCrystal(crystals[2]);
      if (e.key.toLowerCase() === 'h') setShowHotspots((prev) => !prev);
      if (e.key.toLowerCase() === 'm') {
        const nextSound = !soundActive;
        setSoundActive(nextSound);
        crystalAudio.setMuted(!nextSound);
        if (nextSound) crystalAudio.playSingingBowl(activeCrystal.freqValue || 528);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [crystals, onSelectCrystal, setShowHotspots, soundActive, setSoundActive, activeCrystal]);

  const handleSoundToggle = () => {
    const next = !soundActive;
    setSoundActive(next);
    crystalAudio.setMuted(!next);
    if (next) {
      crystalAudio.playSingingBowl(activeCrystal.freqValue || 528);
    }
  };

  const handleStoneClick = (c) => {
    onSelectCrystal(c);
    if (soundActive) {
      crystalAudio.playSingingBowl(c.freqValue || 528);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3.5">
      {/* 1. 3D Timeline Scrub Bar (Visible when in Interactive Scrub Mode) */}
      {isInteractiveMode && (
        <div className="w-full max-w-xl px-5 py-2.5 rounded-2xl glass-card-3d flex items-center gap-4 animate-fade-in border border-white/20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white min-w-[76px] bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 shadow-inner">
            <Compass className="w-4 h-4 animate-spin-slow" style={{ color: activeCrystal.colorAccent }} />
            <span>{String(rotationAngle).padStart(3, '0')}°</span>
          </div>

          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full h-2 bg-black/60 rounded-full cursor-ew-resize appearance-none shadow-inner border border-white/10"
              style={{
                accentColor: activeCrystal.colorAccent,
              }}
            />
          </div>

          <span className="text-[11px] font-sans-ui font-semibold uppercase tracking-wider text-luxe-300">
            Rotate 360°
          </span>
        </div>
      )}

      {/* 2. Main 3D Floating Control Dock */}
      <div className="dock-3d-bar px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-6 max-w-2xl w-full">
        {/* 3D Crystal Gemstone Selector Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {crystals.map((crystal, idx) => {
            const isSelected = activeCrystal.id === crystal.id;

            return (
              <button
                key={crystal.id}
                onClick={() => handleStoneClick(crystal)}
                className={`pill-3d-gem px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-sans-ui transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'pill-3d-gem-active text-white font-bold'
                    : 'bg-white/[0.04] text-luxe-300 hover:text-white border border-white/10'
                }`}
                style={{
                  borderColor: isSelected ? crystal.colorAccent : 'rgba(255,255,255,0.1)',
                }}
              >
                {/* 3D Faceted Glowing Gem Core */}
                <div
                  className={`w-3 h-3 rounded-full relative flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-125 shadow-lg' : 'opacity-80 group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: crystal.colorAccent,
                    boxShadow: isSelected
                      ? `0 0 12px ${crystal.colorAccent}, inset 0 1px 2px #ffffff`
                      : `0 0 4px ${crystal.colorAccent}`,
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-white/90" />
                </div>

                <span className="font-display font-semibold tracking-wide text-xs sm:text-sm text-3d-subtle">
                  {crystal.name}
                </span>

                {/* Keyboard Shortcut Badge */}
                <span className="hidden md:inline-block text-[10px] font-mono opacity-50 px-1 py-0.2 rounded bg-black/30 border border-white/5">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vertical 3D Divider */}
        <div className="h-7 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block" />

        {/* 3D Interactive Control Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher: Orbit vs 360 Scrub */}
          <button
            type="button"
            onClick={() => setIsInteractiveMode(!isInteractiveMode)}
            title={isInteractiveMode ? 'Switch to Auto Orbit Mode' : 'Switch to Interactive 360° Scrub Mode'}
            className={`btn-3d-action px-3 py-1.5 rounded-full text-xs font-sans-ui font-semibold transition flex items-center gap-1.5 border ${
              isInteractiveMode
                ? 'bg-gradient-to-b from-white/25 to-white/10 border-white/40 text-white shadow-md'
                : 'bg-white/[0.04] border-white/10 text-luxe-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isInteractiveMode ? (
              <>
                <Sliders className="w-3.5 h-3.5 text-white" />
                <span className="hidden md:inline text-[11px] uppercase tracking-wider">Scrub</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-white animate-spin-slow" />
                <span className="hidden md:inline text-[11px] uppercase tracking-wider">Orbit</span>
              </>
            )}
          </button>

          {/* Hotspots Toggle */}
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            title={showHotspots ? 'Hide Physical Hotspots' : 'Show Physical Hotspots'}
            className={`btn-3d-action p-2 rounded-full transition border ${
              showHotspots
                ? 'bg-gradient-to-b from-white/20 to-white/5 border-white/30 text-white'
                : 'bg-white/[0.04] border-white/10 text-luxe-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {showHotspots ? (
              <Eye className="w-4 h-4" style={{ color: activeCrystal.colorAccent }} />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Lighting Mode Selector */}
          <button
            type="button"
            onClick={() => {
              const modes = ['natural', 'luminescent', 'darkroom'];
              const next = modes[(modes.indexOf(lightingMode) + 1) % modes.length];
              setLightingMode(next);
            }}
            title={`Lighting Atmosphere: ${lightingMode.toUpperCase()}`}
            className="btn-3d-action p-2 rounded-full bg-white/[0.04] border border-white/10 text-luxe-300 hover:text-white hover:bg-white/10 transition"
          >
            {lightingMode === 'darkroom' ? (
              <Moon className="w-4 h-4 text-purple-300" />
            ) : lightingMode === 'luminescent' ? (
              <Sparkles className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-gold-300" />
            )}
          </button>

          {/* 528Hz Harmonic Sound Synthesizer */}
          <button
            type="button"
            onClick={handleSoundToggle}
            title={soundActive ? 'Mute 528Hz Sacred Singing Bowl' : 'Enable 528Hz Sacred Singing Bowl Harmonic'}
            className={`btn-3d-action p-2 rounded-full transition border ${
              soundActive
                ? 'bg-gradient-to-b from-white/30 to-white/10 border-white/50 text-white shadow-lg'
                : 'bg-white/[0.04] border-white/10 text-luxe-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
