'use client';

import React from 'react';

/**
 * Floating3DSpheres
 * Renders ethereal floating 3D crystal spheres with photorealistic specular highlights,
 * translucent glass refraction, Fresnel edge rim lighting, and ambient depth drop-shadows.
 * Perfectly calibrated for light Ivory (#F8F6F2) backgrounds.
 */
export default function Floating3DSpheres({ variant = 'ambient' }) {
  // Sphere specifications with distinct crystal colors, sizes, positions, and animation delays
  const spheres = [
    // Top-left hero sphere: Translucent Amethyst / Lavender
    {
      id: 'sphere-1',
      size: 'w-44 h-44 sm:w-56 sm:h-56',
      pos: '-top-12 -left-12 sm:top-6 sm:left-12',
      grad: 'from-white via-[#EAE2F2] to-[#79539B]/70',
      rim: 'border-[#79539B]/30',
      glow: 'shadow-[0_20px_50px_rgba(121,83,155,0.22)]',
      specular: 'from-white/90 via-white/40 to-transparent',
      innerGlow: 'inset 0 0 35px rgba(234,226,242,0.85), inset -10px -15px 30px rgba(121,83,155,0.45)',
      animation: 'animate-float-slow',
      delay: '0s',
      blur: 'blur-0',
      opacity: 'opacity-90',
      shadowSize: 'w-36 sm:w-44 h-6',
    },
    // Top-right sphere: Golden Citrine / Sunstone
    {
      id: 'sphere-2',
      size: 'w-32 h-32 sm:w-40 sm:h-40',
      pos: 'top-10 -right-8 sm:top-14 sm:right-16',
      grad: 'from-white via-[#FBF5E6] to-[#C8A65E]/75',
      rim: 'border-[#C8A65E]/30',
      glow: 'shadow-[0_15px_45px_rgba(200,166,94,0.25)]',
      specular: 'from-white/95 via-white/50 to-transparent',
      innerGlow: 'inset 0 0 25px rgba(251,245,230,0.85), inset -8px -12px 25px rgba(200,166,94,0.5)',
      animation: 'animate-float-reverse',
      delay: '1.5s',
      blur: 'blur-0',
      opacity: 'opacity-95',
      shadowSize: 'w-28 sm:w-32 h-5',
    },
    // Bottom-left sphere: Rose Quartz / Pink Tourmaline
    {
      id: 'sphere-3',
      size: 'w-28 h-28 sm:w-36 sm:h-36',
      pos: 'bottom-20 -left-6 sm:bottom-28 sm:left-24',
      grad: 'from-white via-[#FDF2F4] to-[#E5989B]/70',
      rim: 'border-[#E5989B]/30',
      glow: 'shadow-[0_15px_35px_rgba(229,152,155,0.25)]',
      specular: 'from-white/90 via-white/40 to-transparent',
      innerGlow: 'inset 0 0 25px rgba(253,242,244,0.85), inset -8px -10px 20px rgba(229,152,155,0.45)',
      animation: 'animate-float-medium',
      delay: '3s',
      blur: 'blur-0',
      opacity: 'opacity-85',
      shadowSize: 'w-24 sm:w-28 h-4',
    },
    // Bottom-right hero sphere: Deep Amethyst Crystal Sphere
    {
      id: 'sphere-4',
      size: 'w-48 h-48 sm:w-60 sm:h-60',
      pos: '-bottom-12 -right-12 sm:bottom-8 sm:right-20',
      grad: 'from-white via-[#EAE2F2] to-[#684587]/80',
      rim: 'border-[#79539B]/35',
      glow: 'shadow-[0_25px_60px_rgba(104,69,135,0.28)]',
      specular: 'from-white/95 via-white/40 to-transparent',
      innerGlow: 'inset 0 0 40px rgba(234,226,242,0.9), inset -12px -18px 35px rgba(104,69,135,0.55)',
      animation: 'animate-float-slow',
      delay: '4.5s',
      blur: 'blur-0',
      opacity: 'opacity-90',
      shadowSize: 'w-40 sm:w-48 h-6',
    },
    // Center floating droplet 1: Clear Quartz Selenite
    {
      id: 'sphere-5',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      pos: 'top-1/3 left-4 sm:left-1/4',
      grad: 'from-white via-[#F8F6F2] to-[#D8CBE4]/60',
      rim: 'border-white/60',
      glow: 'shadow-[0_8px_25px_rgba(41,36,45,0.08)]',
      specular: 'from-white via-white/60 to-transparent',
      innerGlow: 'inset 0 0 15px rgba(255,255,255,0.9), inset -4px -6px 12px rgba(121,83,155,0.3)',
      animation: 'animate-float-fast',
      delay: '2s',
      blur: 'blur-0',
      opacity: 'opacity-80',
      shadowSize: 'w-12 h-3',
    },
    // Center floating droplet 2: Citrine Sparkle Sphere
    {
      id: 'sphere-6',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      pos: 'bottom-1/3 right-8 sm:right-1/4',
      grad: 'from-white via-[#FAF5E6] to-[#C8A65E]/60',
      rim: 'border-[#C8A65E]/20',
      glow: 'shadow-[0_8px_20px_rgba(200,166,94,0.18)]',
      specular: 'from-white via-white/50 to-transparent',
      innerGlow: 'inset 0 0 12px rgba(255,255,255,0.85), inset -3px -5px 10px rgba(200,166,94,0.4)',
      animation: 'animate-float-medium',
      delay: '5s',
      blur: 'blur-0',
      opacity: 'opacity-75',
      shadowSize: 'w-10 h-2.5',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Ambient background soft color wash */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#EAE2F2]/50 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#C8A65E]/15 rounded-full blur-[130px]" />

      {spheres.map((s) => (
        <div
          key={s.id}
          className={`absolute ${s.pos} flex flex-col items-center justify-center transition-all duration-700`}
          style={{ animationDelay: s.delay }}
        >
          {/* 3D Sphere Body with multi-layered specular highlights & caustics */}
          <div
            className={`relative ${s.size} rounded-full bg-gradient-to-br ${s.grad} ${s.glow} border ${s.rim} ${s.opacity} backdrop-blur-md overflow-hidden transform hover:scale-105 transition-transform duration-500`}
            style={{
              boxShadow: s.innerGlow,
              animation: `${
                s.animation === 'animate-float-slow'
                  ? 'sphereFloatSlow 7s ease-in-out infinite'
                  : s.animation === 'animate-float-reverse'
                  ? 'sphereFloatReverse 8s ease-in-out infinite'
                  : s.animation === 'animate-float-fast'
                  ? 'sphereFloatFast 5s ease-in-out infinite'
                  : 'sphereFloatMedium 6s ease-in-out infinite'
              }`,
              animationDelay: s.delay,
            }}
          >
            {/* Primary Specular Highlight (Top-Left 3D Glint) */}
            <div className="absolute top-3 left-4 w-1/3 h-1/4 rounded-full bg-gradient-to-br from-white via-white/80 to-transparent blur-[1px] transform -rotate-25 opacity-90" />
            
            {/* Secondary Sharp Specular Pinpoint Spot */}
            <div className="absolute top-5 left-7 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />

            {/* Bottom Subsurface Fresnel Edge Reflection */}
            <div className="absolute bottom-2 right-4 w-1/2 h-1/3 rounded-full bg-gradient-to-t from-white/40 via-white/10 to-transparent blur-sm transform rotate-12" />

            {/* Ethereal Sacred Radial Sheen */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-white/20 pointer-events-none" />
          </div>

          {/* Ambient Ground/Floor Drop-Shadow that expands and fades with bobbing motion */}
          <div
            className={`mt-3 ${s.shadowSize} rounded-full bg-[#29242D]/[0.07] blur-md transform scale-y-50 pointer-events-none`}
            style={{
              animation: 'sphereShadow 7s ease-in-out infinite',
              animationDelay: s.delay,
            }}
          />
        </div>
      ))}

      {/* Embedded CSS Keyframes for smooth 60fps floating motion */}
      <style jsx>{`
        @keyframes sphereFloatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-22px) rotate(3deg);
          }
        }
        @keyframes sphereFloatReverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(18px) rotate(-3deg);
          }
        }
        @keyframes sphereFloatMedium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(2deg);
          }
        }
        @keyframes sphereFloatFast {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.03);
          }
        }
        @keyframes sphereShadow {
          0%, 100% {
            transform: scale(1) scaleY(0.5);
            opacity: 0.15;
          }
          50% {
            transform: scale(0.85) scaleY(0.4);
            opacity: 0.07;
          }
        }
      `}</style>
    </div>
  );
}

