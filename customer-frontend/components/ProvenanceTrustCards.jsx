'use client';

import React from 'react';
import { ShieldCheck, Globe, Sparkles, PackageCheck } from 'lucide-react';

export const PROVENANCE_FEATURES = [
  {
    title: '100% Natural Minerals',
    description: 'Authentic untreated gemstones and crystals sourced from proven geological deposits.',
    icon: ShieldCheck,
  },
  {
    title: 'Artisan Partnerships',
    description: 'Direct ethical partnerships with lapidary stonecutters in Brazil, Madagascar, and India.',
    icon: Globe,
  },
  {
    title: 'Sound Cleansed',
    description: 'Mindfully cleansed with traditional singing bowls and sandalwood prior to dispatch.',
    icon: Sparkles,
  },
  {
    title: 'Protective Packaging',
    description: 'Reinforced cushioned packaging with a guaranteed transit damage replacement policy.',
    icon: PackageCheck,
  },
];

export default function ProvenanceTrustCards({ className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6 border-y border-stone-200/80 bg-white/60 backdrop-blur-md rounded-2xl">
        {PROVENANCE_FEATURES.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 sm:p-4 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center flex-shrink-0 text-[#B45309] shadow-xs">
                <IconComponent className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="space-y-1">
                <h4 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 tracking-wide">
                  {item.title}
                </h4>
                <p className="text-[11.5px] font-sans-ui text-stone-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
