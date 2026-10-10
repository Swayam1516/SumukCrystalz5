'use client';

import React from 'react';
import { ShieldCheck, Globe, Sparkles, Compass } from 'lucide-react';

export const PROVENANCE_FEATURES = [
  {
    title: 'Museum Provenance',
    description: 'Every crystal includes an individual gemological certificate of authenticity and origin.',
    icon: ShieldCheck,
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    title: 'Ethically Fair-Mined',
    description: 'Direct partnerships with artisanal lapidary cooperatives across Brazil, South Africa, and Madagascar.',
    icon: Globe,
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    title: 'Sacred Consecration',
    description: 'Cleansed with pure high-frequency Himalayan sound bowls and sandalwood prior to dispatch.',
    icon: Sparkles,
    iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  },
  {
    title: 'Armored Courier',
    description: 'Custom velvet-lined luxury packaging with zero-damage replacement guarantee.',
    icon: Compass,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
];

export default function ProvenanceTrustCards({ className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROVENANCE_FEATURES.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="provenance-card group cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md ${item.iconBg}`}
              >
                <IconComponent className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-sm font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11.5px] font-sans-ui text-luxe-300 leading-relaxed font-light">
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
