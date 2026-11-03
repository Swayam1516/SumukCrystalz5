'use client';

import React from 'react';
import Image from 'next/image';

/**
 * High-fidelity Sacred Crystal Artworks
 * Renders faceted crystal clusters and translucent gemstones
 * matching the Sumuk Crystalz Founder Sanctum aesthetic.
 */

// Golden Lotus Logo matching the screenshot header
export function LotusLogo({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D7BE" />
          <stop offset="40%" stopColor="#C8A65E" />
          <stop offset="80%" stopColor="#B69247" />
          <stop offset="100%" stopColor="#725723" />
        </linearGradient>
        <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#C8A65E" floodOpacity="0.3" />
        </filter>
      </defs>
      <g stroke="url(#lotusGoldGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#goldShine)">
        {/* Central Core Petal */}
        <path d="M50 18 C46 32 44 48 50 68 C56 48 54 32 50 18 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.12" />
        {/* Inner Left Petal */}
        <path d="M50 68 C40 54 32 38 40 26 C46 38 48 54 50 68 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.08" />
        {/* Inner Right Petal */}
        <path d="M50 68 C60 54 68 38 60 26 C54 38 52 54 50 68 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.08" />
        {/* Outer Left Petal */}
        <path d="M50 68 C32 58 20 45 28 36 C36 44 44 58 50 68 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.05" />
        {/* Outer Right Petal */}
        <path d="M50 68 C68 58 80 45 72 36 C64 44 56 58 50 68 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.05" />
        {/* Base Lotus Base Petals */}
        <path d="M22 64 C30 72 42 74 50 74 C58 74 70 72 78 64 C68 69 58 70 50 70 C42 70 32 69 22 64 Z" fill="url(#lotusGoldGrad)" fillOpacity="0.2" />
        {/* Base Crescent Rim */}
        <path d="M30 74 C40 78 60 78 70 74" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Corner Crystal Artwork rendered in the bottom right of each KPI card
export function CardCornerCrystal({ type = 'citrine', className = '' }) {
  // Palettes per crystal archetype
  const palettes = {
    citrine: {
      light: '#FDE68A',
      mid: '#F59E0B',
      dark: '#B45309',
      glow: 'rgba(245, 158, 11, 0.25)',
      points: [
        { path: 'M40 70 L55 25 L68 35 L62 70 Z', fill: '#FBBF24', opacity: 0.85 },
        { path: 'M62 70 L68 35 L78 48 L72 70 Z', fill: '#D97706', opacity: 0.9 },
        { path: 'M40 70 L55 25 L45 35 L32 70 Z', fill: '#FDE68A', opacity: 0.75 },
        { path: 'M25 70 L35 42 L45 48 L40 70 Z', fill: '#F59E0B', opacity: 0.7 },
        { path: 'M62 70 L72 48 L82 54 L76 70 Z', fill: '#92400E', opacity: 0.65 },
      ],
    },
    amethyst: {
      light: '#E9D5FF',
      mid: '#A855F7',
      dark: '#6B21A8',
      glow: 'rgba(168, 85, 247, 0.25)',
      points: [
        { path: 'M40 70 L52 20 L66 32 L60 70 Z', fill: '#C084FC', opacity: 0.85 },
        { path: 'M60 70 L66 32 L78 45 L70 70 Z', fill: '#9333EA', opacity: 0.9 },
        { path: 'M40 70 L52 20 L42 32 L30 70 Z', fill: '#E9D5FF', opacity: 0.75 },
        { path: 'M24 70 L34 40 L44 46 L38 70 Z', fill: '#A855F7', opacity: 0.7 },
        { path: 'M60 70 L70 45 L80 52 L74 70 Z', fill: '#581C87', opacity: 0.65 },
      ],
    },
    celestite: {
      light: '#BAE6FD',
      mid: '#38BDF8',
      dark: '#0369A1',
      glow: 'rgba(56, 189, 248, 0.25)',
      points: [
        { path: 'M40 70 L54 22 L66 34 L62 70 Z', fill: '#7DD3FC', opacity: 0.85 },
        { path: 'M62 70 L66 34 L76 46 L70 70 Z', fill: '#0284C7', opacity: 0.9 },
        { path: 'M40 70 L54 22 L44 32 L32 70 Z', fill: '#E0F2FE', opacity: 0.75 },
        { path: 'M26 70 L36 40 L46 47 L40 70 Z', fill: '#38BDF8', opacity: 0.7 },
        { path: 'M62 70 L70 46 L80 54 L74 70 Z', fill: '#075985', opacity: 0.65 },
      ],
    },
    emerald: {
      light: '#A7F3D0',
      mid: '#10B981',
      dark: '#047857',
      glow: 'rgba(16, 185, 129, 0.25)',
      points: [
        { path: 'M40 70 L54 24 L66 36 L62 70 Z', fill: '#34D399', opacity: 0.85 },
        { path: 'M62 70 L66 36 L76 48 L70 70 Z', fill: '#059669', opacity: 0.9 },
        { path: 'M40 70 L54 24 L44 34 L32 70 Z', fill: '#D1FAE5', opacity: 0.75 },
        { path: 'M26 70 L36 42 L46 48 L40 70 Z', fill: '#10B981', opacity: 0.7 },
        { path: 'M62 70 L70 48 L80 56 L74 70 Z', fill: '#065F46', opacity: 0.65 },
      ],
    },
    rose: {
      light: '#FECDD3',
      mid: '#FB7185',
      dark: '#BE123C',
      glow: 'rgba(251, 113, 133, 0.25)',
      points: [
        { path: 'M40 70 L53 23 L65 35 L61 70 Z', fill: '#FDA4AF', opacity: 0.85 },
        { path: 'M61 70 L65 35 L75 47 L70 70 Z', fill: '#E11D48', opacity: 0.9 },
        { path: 'M40 70 L53 23 L43 33 L32 70 Z', fill: '#FFE4E6', opacity: 0.75 },
        { path: 'M26 70 L36 41 L45 47 L40 70 Z', fill: '#FB7185', opacity: 0.7 },
        { path: 'M61 70 L70 47 L80 55 L74 70 Z', fill: '#9F1239', opacity: 0.65 },
      ],
    },
  };

  const current = palettes[type] || palettes.citrine;

  return (
    <div
      className={`absolute bottom-0 right-0 w-20 h-20 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${className}`}
      style={{ filter: `drop-shadow(0 4px 12px ${current.glow})` }}
    >
      <svg viewBox="0 0 90 75" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id={`glow-${type}`} cx="60%" cy="50%" r="50%">
            <stop offset="0%" stopColor={current.light} stopOpacity="0.4" />
            <stop offset="100%" stopColor={current.dark} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Back Glow */}
        <ellipse cx="55" cy="50" rx="28" ry="20" fill={`url(#glow-${type})`} />

        {/* Faceted Crystal Points */}
        {current.points.map((pt, idx) => (
          <path
            key={idx}
            d={pt.path}
            fill={pt.fill}
            opacity={pt.opacity}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        ))}

        {/* Sparkle Highlights */}
        <circle cx="53" cy="24" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="67" cy="34" r="1.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="36" cy="41" r="1" fill="#FFFFFF" opacity="0.7" />
      </svg>
    </div>
  );
}

// 3D Marble Pedestal with Glowing Purple Amethyst Cluster (Bottom Right Sanctuary Showcase)
export function MarblePedestalShowcase({ className = '' }) {
  return (
    <div className={`relative flex items-end justify-center pointer-events-none select-none ${className}`}>
      {/* Background Soft Aura & Ribbon Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500/10 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* SVG Detailed Pedestal + Glowing Amethyst Formation */}
        <svg
          viewBox="0 0 400 240"
          className="w-full h-auto drop-shadow-[0_20px_35px_rgba(107,33,168,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Marble Base Gradient */}
            <linearGradient id="marbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F5F3EF" />
              <stop offset="70%" stopColor="#EAE5DC" />
              <stop offset="100%" stopColor="#D8D1C5" />
            </linearGradient>

            {/* Gold Rim Gradient */}
            <linearGradient id="goldRimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#725723" />
              <stop offset="25%" stopColor="#DEC69B" />
              <stop offset="50%" stopColor="#C8A65E" />
              <stop offset="75%" stopColor="#DEC69B" />
              <stop offset="100%" stopColor="#725723" />
            </linearGradient>

            {/* Amethyst Violet Facet Gradient */}
            <linearGradient id="amethystCore" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FAF8FC" />
              <stop offset="25%" stopColor="#EAE2F2" />
              <stop offset="50%" stopColor="#9B79BE" />
              <stop offset="75%" stopColor="#79539B" />
              <stop offset="100%" stopColor="#422A57" />
            </linearGradient>

            <linearGradient id="amethystDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#79539B" />
              <stop offset="50%" stopColor="#55376F" />
              <stop offset="100%" stopColor="#2F1E3F" />
            </linearGradient>

            <linearGradient id="quartzShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.3" />
            </linearGradient>

            {/* Drop shadow */}
            <filter id="pedestalShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1C1917" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Pedestal Ground Reflection Shadow */}
          <ellipse cx="200" cy="225" rx="160" ry="14" fill="#000000" opacity="0.08" filter="blur(8px)" />

          {/* 1. Pedestal Base Lower Tier (Marble Cylinder) */}
          <path
            d="M50 200 C50 216 117 228 200 228 C283 228 350 216 350 200 L350 210 C350 226 283 238 200 238 C117 238 50 226 50 210 Z"
            fill="url(#marbleGradient)"
            filter="url(#pedestalShadow)"
          />

          {/* 2. Gold Rim Layer */}
          <path
            d="M48 198 C48 214 116 226 200 226 C284 226 352 214 352 198 L352 203 C352 219 284 231 200 231 C116 231 48 219 48 203 Z"
            fill="url(#goldRimGradient)"
          />

          {/* 3. Pedestal Top Surface (Polished White Italian Marble Ellipse) */}
          <ellipse cx="200" cy="198" rx="150" ry="24" fill="url(#marbleGradient)" stroke="url(#goldRimGradient)" strokeWidth="1.5" />

          {/* Marble subtle veins */}
          <path d="M120 192 C145 196 170 190 210 202 C240 210 270 204 310 196" stroke="#D1C7B7" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" fill="none" />
          <path d="M90 200 C130 194 180 204 220 196 C260 192 290 200 320 202" stroke="#E2DBD0" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" fill="none" />

          {/* Pedestal Surface Radial Inner Glow */}
          <ellipse cx="200" cy="198" rx="110" ry="16" fill="url(#quartzShine)" opacity="0.35" />

          {/* 4. CRYSTAL CLUSTER: Tall Glowing Amethyst & Quartz Obelisks */}
          <g transform="translate(0, -10)">
            {/* Ambient Purple Light Flare */}
            <circle cx="200" cy="140" r="70" fill="#9333EA" opacity="0.16" filter="blur(20px)" />
            <circle cx="170" cy="130" r="45" fill="#C084FC" opacity="0.22" filter="blur(16px)" />

            {/* Left Obelisk 1 (Medium Quartz point) */}
            <g>
              <polygon points="120,190 142,110 162,130 148,194" fill="#C084FC" opacity="0.85" stroke="#FFFFFF" strokeWidth="0.75" />
              <polygon points="142,110 162,130 174,196 160,195" fill="#7E22CE" opacity="0.9" stroke="#E9D5FF" strokeWidth="0.75" />
              <polygon points="120,190 142,110 128,124 112,192" fill="#E9D5FF" opacity="0.75" stroke="#FFFFFF" strokeWidth="0.75" />
            </g>

            {/* Left Giant Obelisk 2 (Dark Amethyst Point) */}
            <g>
              <polygon points="140,194 165,75 195,105 178,198" fill="url(#amethystCore)" opacity="0.95" stroke="#FFFFFF" strokeWidth="0.75" />
              <polygon points="165,75 195,105 210,198 188,198" fill="url(#amethystDark)" opacity="0.95" stroke="#DDD6FE" strokeWidth="0.75" />
              <polygon points="140,194 165,75 148,92 128,194" fill="#F3E8FF" opacity="0.85" stroke="#FFFFFF" strokeWidth="0.75" />
              {/* Highlight facet */}
              <polygon points="165,75 175,100 155,98" fill="#FFFFFF" opacity="0.6" />
            </g>

            {/* Center Majestic Obelisk 3 (The Crown Amethyst Point) */}
            <g>
              <polygon points="175,198 205,50 235,85 215,200" fill="url(#amethystCore)" opacity="0.98" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="205,50 235,85 250,200 225,200" fill="url(#amethystDark)" opacity="0.95" stroke="#E9D5FF" strokeWidth="0.75" />
              <polygon points="175,198 205,50 188,72 165,196" fill="#EDE9FE" opacity="0.9" stroke="#FFFFFF" strokeWidth="0.75" />
              {/* Facet Reflection */}
              <polygon points="205,50 218,80 195,76" fill="#FFFFFF" opacity="0.75" />
            </g>

            {/* Right Obelisk 4 (Clear Quartz Obelisk) */}
            <g>
              <polygon points="220,198 248,82 278,112 258,200" fill="url(#quartzShine)" opacity="0.92" stroke="#FFFFFF" strokeWidth="0.85" />
              <polygon points="248,82 278,112 290,198 268,200" fill="#A855F7" opacity="0.88" stroke="#DDD6FE" strokeWidth="0.75" />
              <polygon points="220,198 248,82 235,100 215,198" fill="#FFFFFF" opacity="0.8" stroke="#FFFFFF" strokeWidth="0.75" />
              {/* Top Facet */}
              <polygon points="248,82 260,105 242,102" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Right Obelisk 5 (Smaller Point) */}
            <g>
              <polygon points="255,198 280,120 302,145 285,198" fill="#C084FC" opacity="0.85" stroke="#FFFFFF" strokeWidth="0.75" />
              <polygon points="280,120 302,145 315,196 295,198" fill="#6B21A8" opacity="0.9" stroke="#E9D5FF" strokeWidth="0.75" />
              <polygon points="255,198 280,120 268,135 248,198" fill="#F3E8FF" opacity="0.75" stroke="#FFFFFF" strokeWidth="0.75" />
            </g>

            {/* Base Sparkle / Clusters and Small Crystals around perimeter */}
            <polygon points="105,196 115,165 125,178 118,196" fill="#E9D5FF" opacity="0.7" stroke="#FFF" strokeWidth="0.5" />
            <polygon points="295,196 308,168 318,180 310,196" fill="#DDD6FE" opacity="0.7" stroke="#FFF" strokeWidth="0.5" />
            <polygon points="190,202 198,185 208,192 202,202" fill="#F5D47A" opacity="0.8" stroke="#FFF" strokeWidth="0.5" />

            {/* Glowing Stars / Sparkles */}
            <circle cx="205" cy="50" r="2.5" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FFFFFF)" />
            <circle cx="165" cy="75" r="2" fill="#FFFFFF" filter="drop-shadow(0 0 3px #FFFFFF)" />
            <circle cx="248" cy="82" r="2" fill="#FFFFFF" filter="drop-shadow(0 0 3px #FFFFFF)" />
            <circle cx="142" cy="110" r="1.5" fill="#FFFFFF" />
            <circle cx="280" cy="120" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Marble Reflection of Amethyst Crystals on Polished Top */}
          <ellipse cx="205" cy="204" rx="75" ry="8" fill="#A855F7" opacity="0.25" filter="blur(6px)" />
        </svg>
      </div>
    </div>
  );
}

