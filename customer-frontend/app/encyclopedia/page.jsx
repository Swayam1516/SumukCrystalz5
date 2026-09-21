'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ChakraBadge from '../../components/ChakraBadge';
import { BookOpen, Sparkles, Compass, ShieldCheck, Sun, Moon, Wind, Flame, ArrowRight } from 'lucide-react';

const chakraGuides = [
  {
    name: 'Crown (Sahasrara)',
    frequency: '963 Hz',
    element: 'Pure Cosmic Light',
    crystal: 'Amethyst & Clear Quartz',
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    description:
      'The crown chakra is the gateway to higher spiritual consciousness, transcendental wisdom, and cosmic unity. Placed at the crown of the skull.',
    stones: ['Amethyst Cathedral Geode', 'Optical Clear Quartz', 'Satin-Spar Selenite'],
    rituals: 'Hold clear quartz at the apex of the head during sunrise meditation to amplify higher intuitive downloads.',
  },
  {
    name: 'Third Eye (Ajna)',
    frequency: '852 Hz',
    element: 'Photonic Ether',
    crystal: 'Spectrolite Labradorite',
    color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
    description:
      'Governs clairvoyance, esoteric insight, intuition, and dreaming consciousness. Positioned between the eyebrows.',
    stones: ['Spectrolite Labradorite', 'Sodalite', 'Fluorite Octahedrons'],
    rituals: 'Rest a polished Labradorite freeform over the brow while resting to facilitate lucid dreaming and vision integration.',
  },
  {
    name: 'Throat (Vishuddha)',
    frequency: '741 Hz',
    element: 'Sound / Vibration',
    crystal: 'Aquamarine & Lapis Lazuli',
    color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    description:
      'The center of authentic vocal expression, sovereign truth, and artistic eloquence. Situated in the throat hollow.',
    stones: ['Spectrolite Labradorite', 'Blue Kyanite', 'Celestite'],
    rituals: 'Wear high-grade jewelry over the thyroid or speak intention aloud while holding consecrated blue minerals.',
  },
  {
    name: 'Heart (Anahata)',
    frequency: '639 Hz / 528 Hz',
    element: 'Air',
    crystal: 'Madagascar Rose Quartz & Malachite',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    description:
      'The harmonic bridge between physical and spiritual realms. Calibrates unconditional love, grief release, and empathy.',
    stones: ['Rose Quartz Monolith', 'Congolese Malachite', 'Green Aventurine'],
    rituals: 'Place a raw rose quartz monolith over the chest while breathing 4-7-8 cycles under full moonlight.',
  },
  {
    name: 'Solar Plexus (Manipura)',
    frequency: '528 Hz',
    element: 'Fire',
    crystal: 'Golden Pyrite & Sunset Citrine',
    color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300',
    description:
      'The solar dynamo of sovereign willpower, leadership, executive manifestation, and metabolic vitality.',
    stones: ['Imperial Pyrite Cube', 'Sunset Citrine Cathedral', 'Golden Healer Quartz'],
    rituals: 'Position isometric pyrite on the work desk to shield against energy drain and solidify commercial manifestos.',
  },
  {
    name: 'Sacral (Svadhisthana)',
    frequency: '417 Hz',
    element: 'Water',
    crystal: 'Carnelian & Citrine',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    description:
      'The emotional epicenter of passion, creative fertility, sensual celebration, and fluid adaptation.',
    stones: ['Sunset Citrine', 'Carnelian Flame', 'Peach Moonstone'],
    rituals: 'Keep warm-toned crystals near creative studio spaces to dissolve creative blocks.',
  },
  {
    name: 'Root (Muladhara)',
    frequency: '396 Hz',
    element: 'Earth',
    crystal: 'Black Obsidian & Tourmaline',
    color: 'border-rose-600/40 bg-rose-950/20 text-rose-300',
    description:
      'The foundational anchor into Gaia. Anchors stability, nervous system safety, and deep electromagnetic grounding.',
    stones: ['Obsidian Scrying Mirror', 'Black Tourmaline Shield', 'Smoky Quartz'],
    rituals: 'Place obsidian at the entrance of living quarters to transmute chaotic incoming frequencies.',
  },
];

export default function EncyclopediaPage() {
  const [selectedChakraIndex, setSelectedChakraIndex] = useState(0);
  const active = chakraGuides[selectedChakraIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-3d text-gold-300 text-xs font-sans-ui uppercase tracking-wider font-semibold">
          <BookOpen className="w-4 h-4 text-gold-400" />
          <span>Crystalline Metaphysical Archive</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-bold text-white text-3d-title">
          The Sacred Mineral Encyclopedia
        </h1>
        <p className="text-xs sm:text-sm font-sans-ui text-luxe-200 leading-relaxed max-w-xl mx-auto">
          An authoritative reference mapping geological crystal lattices to bio-energetic frequencies, chakra vortexes, and traditional lapidary lore.
        </p>
      </div>

      {/* Interactive 3D Chakra Energy Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left selector menu */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider mb-3 px-2 text-3d-subtle">
            Chakra Vortexes
          </h3>
          {chakraGuides.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelectedChakraIndex(i)}
              className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                selectedChakraIndex === i
                  ? 'btn-3d-action bg-gradient-to-b from-white/20 to-white/5 border-white/40 text-white shadow-xl scale-[1.02]'
                  : 'glass-card-3d text-luxe-300 hover:text-white border-white/10'
              }`}
            >
              <div>
                <p className="text-sm font-display font-bold text-white">{c.name}</p>
                <p className="text-xs font-mono text-gold-300 mt-0.5">{c.frequency}</p>
              </div>
              <span className="text-[11px] font-sans-ui text-luxe-400 px-2 py-0.5 rounded-md bg-black/40 border border-white/5">
                {c.element}
              </span>
            </button>
          ))}
        </div>

        {/* Right Active Details Panel */}
        <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl glass-panel-3d border border-white/20 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-sans-ui uppercase tracking-widest text-gold-400 font-bold block">
                Frequency Resonance • {active.frequency}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1 text-3d-title">
                {active.name}
              </h2>
            </div>
            <div className="px-4 py-1.5 rounded-full badge-3d text-xs font-sans-ui text-luxe-200 font-semibold">
              Element: {active.element}
            </div>
          </div>

          <p className="text-sm sm:text-base font-sans-ui text-luxe-200 leading-relaxed">{active.description}</p>

          {/* Key Specimens */}
          <div className="space-y-3 pt-2">
            <h4 className="font-display text-sm uppercase tracking-wider font-bold text-white text-3d-subtle">
              Primary Harmonic Gemstones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {active.stones.map((stone, idx) => (
                <div key={idx} className="p-4 rounded-2xl glass-card-3d">
                  <p className="text-xs font-sans-ui font-bold text-gold-300">{stone}</p>
                  <p className="text-[10px] font-sans-ui text-luxe-400 mt-0.5">Museum Specimen</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cleansing & Integration Ritual */}
          <div className="p-6 rounded-2xl glass-card-3d border border-purple-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-sans-ui uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Recommended Integration Ritual</span>
            </div>
            <p className="text-xs sm:text-sm font-sans-ui text-luxe-200 leading-relaxed">{active.rituals}</p>
          </div>

          <div className="pt-4">
            <Link
              href={`/shop?chakra=${encodeURIComponent(active.name.split(' ')[0])}`}
              className="btn-3d-action inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-gold-300 transition shadow-xl"
            >
              <span>Explore {active.name.split(' ')[0]} Masterworks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
