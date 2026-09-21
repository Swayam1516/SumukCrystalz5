import React from 'react';

const chakraColors = {
  Root: {
    bg: 'bg-rose-950/60',
    border: 'border-rose-600/40',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
  },
  Sacral: {
    bg: 'bg-amber-950/60',
    border: 'border-amber-600/40',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
  },
  'Solar Plexus': {
    bg: 'bg-yellow-950/60',
    border: 'border-yellow-500/40',
    text: 'text-yellow-300',
    dot: 'bg-yellow-400',
  },
  Heart: {
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  Throat: {
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/40',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
  },
  'Third Eye': {
    bg: 'bg-indigo-950/60',
    border: 'border-indigo-500/40',
    text: 'text-indigo-300',
    dot: 'bg-indigo-400',
  },
  Crown: {
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/40',
    text: 'text-purple-300',
    dot: 'bg-purple-400',
  },
};

export default function ChakraBadge({ chakra, size = 'sm' }) {
  const style = chakraColors[chakra] || {
    bg: 'bg-luxe-800/60',
    border: 'border-white/10',
    text: 'text-luxe-300',
    dot: 'bg-luxe-400',
  };

  const sizeClasses =
    size === 'xs'
      ? 'text-[10px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-xs px-3.5 py-1.5 font-medium'
      : 'text-[11px] px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm ${style.bg} ${style.border} ${style.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span>{chakra} Chakra</span>
    </span>
  );
}
