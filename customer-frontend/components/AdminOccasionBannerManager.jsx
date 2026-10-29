'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCw,
  Save,
  Calendar,
  Tag,
  Link as LinkIcon,
  Flame,
  Crown,
  ArrowRight,
  Upload,
} from 'lucide-react';
import {
  getSupabaseOccasionBanner,
  updateSupabaseOccasionBanner,
  DEFAULT_OCCASION_BANNER,
} from '../lib/supabase';

const OCCASION_PRESETS = [
  {
    id: 'diwali',
    name: 'Diwali (Festival of Lights)',
    icon: '🪔',
    title: 'BIG SPIRITUAL DIWALI',
    subtitle: 'SALE STARTS 28TH OCT',
    discountBadge: 'FESTIVE SALE',
    linkUrl: '/shop?sale=diwali',
    imageUrl: '/images/diwali-sale-banner.jpg',
    gradientTheme: 'from-[#8B0000] via-[#C81E1E] to-[#FF8C00]',
    accentColor: '#FFD700',
  },
  {
    id: 'navratri',
    name: 'Navratri & Durga Shakti',
    icon: '🔱',
    title: 'SACRED NAVRATRI SHAKTI UTSAV',
    subtitle: 'DIVINE BLESSINGS & UP TO 35% OFF',
    discountBadge: 'SHAKTI OFFER',
    linkUrl: '/shop?sale=navratri',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1400&q=80',
    gradientTheme: 'from-[#4C1D95] via-[#7C3AED] to-[#D97706]',
    accentColor: '#F59E0B',
  },
  {
    id: 'akshaya_tritiya',
    name: 'Akshaya Tritiya (Eternal Abundance)',
    icon: '💰',
    title: 'AKSHAYA TRITIYA WEALTH UTSAV',
    subtitle: 'MAGNETIZE GOLDEN PROSPERITY & FORTUNE',
    discountBadge: 'WEALTH UTSAV',
    linkUrl: '/shop?sale=akshaya-tritiya',
    imageUrl: '/images/products/pyrite.jpg',
    gradientTheme: 'from-[#78350F] via-[#D97706] to-[#F59E0B]',
    accentColor: '#FBBF24',
  },
  {
    id: 'shivratri',
    name: 'Maha Shivratri (Cosmic Awakening)',
    icon: '🌙',
    title: 'MAHA SHIVRATRI MEDITATION SALE',
    subtitle: 'SACRED 5-MUKHI MALAS & CLEAR QUARTZ',
    discountBadge: 'SHIVA CONSECRATION',
    linkUrl: '/shop?sale=shivratri',
    imageUrl: '/images/products/clear-quartz.jpg',
    gradientTheme: 'from-[#0F172A] via-[#1E293B] to-[#38BDF8]',
    accentColor: '#38BDF8',
  },
  {
    id: 'new_year',
    name: 'New Year Manifestation',
    icon: '✨',
    title: 'NEW YEAR QUANTUM MANIFESTATION',
    subtitle: 'BEGIN YOUR HIGHER CONSCIOUSNESS JOURNEY',
    discountBadge: 'NEW YEAR OFFER',
    linkUrl: '/shop?sale=new-year',
    imageUrl: '/images/products/amethyst.jpg',
    gradientTheme: 'from-[#3B0764] via-[#6B21A8] to-[#EC4899]',
    accentColor: '#F472B6',
  },
];

export default function AdminOccasionBannerManager({ onToast }) {
  const [banner, setBanner] = useState(DEFAULT_OCCASION_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('diwali');

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    setLoading(true);
    try {
      const data = await getSupabaseOccasionBanner();
      if (data) {
        setBanner(data);
        const matched = OCCASION_PRESETS.find((p) => p.title === data.title);
        if (matched) setSelectedPresetId(matched.id);
      }
    } catch (err) {
      console.warn('Failed to load occasion banner:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setBanner((prev) => ({
      ...prev,
      occasion_name: preset.name,
      title: preset.title,
      subtitle: preset.subtitle,
      discount_badge: preset.discountBadge,
      link_url: preset.linkUrl,
      image_url: preset.imageUrl,
      gradient_theme: preset.gradientTheme,
    }));
    if (onToast) onToast(`Loaded ${preset.name} template!`, 'info');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSupabaseOccasionBanner(banner);
      if (res.success) {
        setBanner(res.banner);
        if (onToast) onToast('✨ Occasion Sale Banner published & synchronized with Shop Page!', 'success');
      } else {
        throw new Error(res.error || 'Failed to update banner');
      }
    } catch (err) {
      if (onToast) onToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-stone-950/80 border border-[#D4AF37]/30 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
              Occasion &amp; Festival Sale Banner Provision
            </h2>
            <p className="text-xs text-stone-400">
              Customize the prominent festive promotion banner on the Shop page for Diwali and major sacred occasions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadBanner}
            className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#D4AF37]/40 text-stone-300 hover:text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Publish Banner</span>
          </button>
        </div>
      </div>

      {/* Live Storefront Simulator Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141210] border border-stone-800 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
            <Eye className="w-4 h-4" /> Live Shop Page Banner Preview
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                banner.is_active
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-stone-900 text-stone-500 border-stone-800'
              }`}
            >
              {banner.is_active ? '🟢 Visible on Storefront' : '⚪ Hidden / Inactive'}
            </span>
          </div>
        </div>

        {/* The Exact Visual Banner Component */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group">
          <div className="relative min-h-[120px] sm:min-h-[140px] md:min-h-[160px] w-full flex items-center justify-between p-4 sm:p-6 overflow-hidden">
            {/* Background image / gradient */}
            {banner.image_url ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-red-900/60 to-transparent" />
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient_theme || 'from-[#8B0000] via-[#C81E1E] to-[#FF8C00]'}`} />
            )}

            {/* Glowing sparkles overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

            {/* Left Content: Brand Logo & Title */}
            <div className="relative z-10 flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FFE58F] to-[#D4AF37] p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#3B0707] rounded-[14px] flex flex-col items-center justify-center text-center p-1">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-[7px] font-bold font-mono text-[#F3E5AB] leading-tight">SUMUK</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#FFDF79] uppercase drop-shadow">
                  SUMUK CRYSTALZ ✦ {banner.occasion_name || 'DIWALI'}
                </span>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-serif text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-0.5">
                  {banner.title || 'BIG SPIRITUAL DIWALI'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-amber-200 mt-0.5 flex items-center gap-1.5 drop-shadow">
                  <span>{banner.subtitle || 'SALE STARTS 28TH OCT'}</span>
                  {banner.discount_badge && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-bold">
                      {banner.discount_badge}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right Content: Action Button */}
            <div className="relative z-10 flex-shrink-0 pl-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Occasions Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141210] border border-stone-800 space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Quick Festive Presets (Click to Load)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {OCCASION_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/40 text-[#F3E5AB]'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <div className="text-2xl">{preset.icon}</div>
                <div>
                  <div className="text-xs font-bold truncate text-stone-200">{preset.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">{preset.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141210] border border-stone-800 space-y-5">
        <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4" /> Banner Configuration &amp; Image Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Occasion Name</label>
            <input
              type="text"
              value={banner.occasion_name || ''}
              onChange={(e) => setBanner({ ...banner, occasion_name: e.target.value })}
              placeholder="e.g. Diwali, Navratri, Akshaya Tritiya"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Main Headline Title</label>
            <input
              type="text"
              value={banner.title || ''}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              placeholder="e.g. BIG SPIRITUAL DIWALI"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Subtitle / Date Announcement</label>
            <input
              type="text"
              value={banner.subtitle || ''}
              onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
              placeholder="e.g. SALE STARTS 28TH OCT"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Discount Pill / Badge</label>
            <input
              type="text"
              value={banner.discount_badge || ''}
              onChange={(e) => setBanner({ ...banner, discount_badge: e.target.value })}
              placeholder="e.g. FLAT 40% OFF"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Banner Background Image (URL or Local Asset)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={banner.image_url || ''}
                onChange={(e) => setBanner({ ...banner, image_url: e.target.value })}
                placeholder="e.g. /images/diwali-sale-banner.jpg or https://images.unsplash.com/..."
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setBanner({ ...banner, image_url: '/images/diwali-sale-banner.jpg' })}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
              >
                Use Diwali Banner
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              The high-resolution Diwali sale banner is ready at <code className="text-[#D4AF37]">/images/diwali-sale-banner.jpg</code>.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Target Click URL</label>
            <input
              type="text"
              value={banner.link_url || ''}
              onChange={(e) => setBanner({ ...banner, link_url: e.target.value })}
              placeholder="/shop?sale=diwali"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Banner Visibility</label>
            <select
              value={banner.is_active ? 'active' : 'inactive'}
              onChange={(e) => setBanner({ ...banner, is_active: e.target.value === 'active' })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="active">🟢 Active &amp; Published to Shop Page</option>
              <option value="inactive">⚪ Inactive / Hidden from Customers</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Save Occasion Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
