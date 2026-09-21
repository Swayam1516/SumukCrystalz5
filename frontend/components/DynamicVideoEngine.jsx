'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

/**
 * DynamicVideoEngine
 * Dual-Layer Hardware-Accelerated Seamless Video Engine.
 * Features zero-stutter cross-fade between active specimens,
 * specular pointer tracking, robust fallback handling, and infallible synchronization.
 */
export default function DynamicVideoEngine({
  activeCrystal,
  onAutoAdvance,
  lightingMode = 'natural',
  onVideoReady,
}) {
  const containerRef = useRef(null);

  // Dual video element references
  const videoARef = useRef(null);
  const videoBRef = useRef(null);

  // Track active layer ('A' or 'B') in a ref for callbacks and in state for styling
  const activeLayerRef = useRef('A');
  const [activeLayerState, setActiveLayerState] = useState('A');
  const [layerAOpacity, setLayerAOpacity] = useState(1);
  const [layerBOpacity, setLayerBOpacity] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const isTransitioningRef = useRef(false);
  const currentLoadedIdRef = useRef(null);
  const autoAdvanceDebounceRef = useRef(false);

  // Helper to load candidate video sources into a video element safely
  const loadVideoSource = useCallback((videoElem, sources) => {
    if (!videoElem || !sources || sources.length === 0) return;

    let sourceIndex = 0;
    const trySource = () => {
      if (sourceIndex >= sources.length) return;
      videoElem.src = sources[sourceIndex];
      videoElem.load();
    };

    videoElem.onerror = () => {
      sourceIndex++;
      if (sourceIndex < sources.length) {
        trySource();
      }
    };

    trySource();
  }, []);

  // Main transition & playback controller
  useEffect(() => {
    if (!activeCrystal) return;
    if (currentLoadedIdRef.current === activeCrystal.id) return;
    currentLoadedIdRef.current = activeCrystal.id;

    // Collect candidate sources for current crystal
    const candidateSources = [
      activeCrystal.videoSrc,
      activeCrystal.altVideoSrc,
      activeCrystal.videoSrc?.replace(' ', '%20'),
      activeCrystal.videoSrc?.replace('/videos/Video ', '/videos/video'),
      activeCrystal.videoSrc?.replace('/videos/video', '/videos/Video '),
    ].filter(Boolean);

    const currentLayer = activeLayerRef.current;
    const incomingLayer = currentLayer === 'A' ? 'B' : 'A';
    const incomingVideo = incomingLayer === 'A' ? videoARef.current : videoBRef.current;
    const outgoingVideo = incomingLayer === 'A' ? videoBRef.current : videoARef.current;

    if (!incomingVideo) return;

    isTransitioningRef.current = true;
    loadVideoSource(incomingVideo, candidateSources);

    let hasSwitched = false;
    const executeSwitch = () => {
      if (hasSwitched) return;
      hasSwitched = true;

      incomingVideo.play().catch(() => {});
      setIsVideoPlaying(true);

      if (incomingLayer === 'A') {
        setLayerAOpacity(1);
        setLayerBOpacity(0);
      } else {
        setLayerBOpacity(1);
        setLayerAOpacity(0);
      }

      activeLayerRef.current = incomingLayer;
      setActiveLayerState(incomingLayer);

      // Re-enable transition triggers after smooth 1.2s crossfade
      setTimeout(() => {
        isTransitioningRef.current = false;
        autoAdvanceDebounceRef.current = false;
        if (outgoingVideo) {
          try {
            outgoingVideo.pause();
          } catch {}
        }
        if (onVideoReady) onVideoReady();
      }, 1200);
    };

    if (incomingVideo.readyState >= 3) {
      executeSwitch();
    } else {
      incomingVideo.oncanplay = () => {
        incomingVideo.oncanplay = null;
        executeSwitch();
      };
      // Guaranteed fallback: switch after 600ms even if canplay event is delayed
      setTimeout(() => {
        executeSwitch();
      }, 600);
    }
  }, [activeCrystal, loadVideoSource, onVideoReady]);

  // Initial video initialization on mount
  useEffect(() => {
    const vA = videoARef.current;
    if (vA && activeCrystal) {
      const initialSources = [
        activeCrystal.videoSrc,
        activeCrystal.altVideoSrc,
        '/videos/video2.mp4',
        '/videos/Video 2.mp4',
      ].filter(Boolean);

      loadVideoSource(vA, initialSources);
      vA.play()
        .then(() => {
          setIsVideoPlaying(true);
          setLayerAOpacity(1);
          setLayerBOpacity(0);
        })
        .catch(() => {
          setIsVideoPlaying(true);
        });
    }
  }, []);

  // Timeupdate handler for auto-advancing 1.5s before end
  const handleTimeUpdate = useCallback(
    (layerName) => (e) => {
      if (activeLayerRef.current !== layerName) return;
      if (autoAdvanceDebounceRef.current || isTransitioningRef.current) return;

      const video = e.currentTarget;
      if (!video || !video.duration || isNaN(video.duration)) return;

      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= 1.5 && timeLeft > 0) {
        autoAdvanceDebounceRef.current = true;
        if (onAutoAdvance) {
          onAutoAdvance();
        }
      }
    },
    [onAutoAdvance]
  );

  // Video ended handler fallback
  const handleEnded = useCallback(
    (layerName) => () => {
      if (activeLayerRef.current !== layerName) return;
      if (autoAdvanceDebounceRef.current || isTransitioningRef.current) return;

      autoAdvanceDebounceRef.current = true;
      if (onAutoAdvance) {
        onAutoAdvance();
      }
    },
    [onAutoAdvance]
  );

  // Specular Pointer tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    document.documentElement.style.setProperty('--pointer-x', `${x}%`);
    document.documentElement.style.setProperty('--pointer-y', `${y}%`);
  }, []);

  const fallbackImg =
    activeCrystal?.image ||
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1920&q=85';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full select-none overflow-hidden bg-[#050508] pointer-events-none"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Specular Ambient Glow */}
      <div className="specular-layer absolute inset-0 z-20 pointer-events-none" />

      {/* Dynamic Aura Glow behind current crystal */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] h-[80vw] max-h-[900px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: `radial-gradient(circle, ${activeCrystal?.colorGlow || 'rgba(168, 85, 247, 0.5)'} 0%, rgba(0,0,0,0) 70%)`,
          opacity: 0.75,
        }}
      />

      {/* Fallback Image Layer */}
      <div
        className={`absolute inset-0 z-5 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out ${
          isVideoPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={fallbackImg}
          alt={activeCrystal?.title || 'Sumuk Crystal'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-90"
        />
      </div>

      {/* LAYER A Video */}
      <video
        ref={videoARef}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onTimeUpdate={handleTimeUpdate('A')}
        onEnded={handleEnded('A')}
        onPlaying={() => setIsVideoPlaying(true)}
        onError={() => {}}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-[1200ms] ease-in-out"
        style={{
          opacity: layerAOpacity,
          zIndex: activeLayerState === 'A' ? 10 : 8,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'high-quality',
        }}
      />

      {/* LAYER B Video */}
      <video
        ref={videoBRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onTimeUpdate={handleTimeUpdate('B')}
        onEnded={handleEnded('B')}
        onPlaying={() => setIsVideoPlaying(true)}
        onError={() => {}}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-[1200ms] ease-in-out"
        style={{
          opacity: layerBOpacity,
          zIndex: activeLayerState === 'B' ? 10 : 8,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'high-quality',
        }}
      />

      {/* Vignette & Obsidian Contrast Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06050a] via-black/25 to-black/70 pointer-events-none z-15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(6,5,10,0.85)_100%)] pointer-events-none z-15" />
    </div>
  );
}
