'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Tag,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  AlertTriangle,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export default function AdminServiceEditorModal({
  service,
  isOpen,
  onClose,
  onSave,
  isSaving,
}) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        id: service.id || `service-${Date.now()}`,
        name: service.name || service.title || '',
        title: service.title || service.name || '',
        shortTitle: service.shortTitle || service.short_title || service.name || '',
        badge: service.badge || 'Sacred Modality',
        category: service.category || 'readings',
        price: Number(service.price || 0),
        priceDisplay: service.priceDisplay || service.price_display || `₹${service.price || 0}`,
        status: service.status || 'available',
        duration: service.duration || '20–25 Minutes',
        format: service.format || 'WhatsApp Audio / Video Call',
        tagline: service.tagline || '',
        description: service.description || '',
        broadDescription: service.broadDescription || service.broad_description || service.description || '',
        keywordsText: (service.keywords || []).join(', '),
        pricingTiers: Array.isArray(service.pricingTiers) ? [...service.pricingTiers] : [],
        whatWeAnalyseText: (service.whatWeAnalyse || []).join('\n'),
        howItWorksText: (service.howItWorks || []).join('\n'),
        detailsRequiredText: (service.detailsRequired || []).join('\n'),
        importantNote: service.importantNote || service.important_note || '',
      });
    }
  }, [service]);

  if (!isOpen || !formData) return null;

  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        { name: 'New Option / Tier', price: '₹999', details: 'Description of what this option covers...' },
      ],
    }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData((prev) => {
      const nextTiers = [...prev.pricingTiers];
      nextTiers[index] = { ...nextTiers[index], [field]: value };
      return { ...prev, pricingTiers: nextTiers };
    });
  };

  const handleRemoveTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a service name/title.');
      return;
    }

    // Convert raw strings back to clean arrays
    const keywords = formData.keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const whatWeAnalyse = formData.whatWeAnalyseText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const howItWorks = formData.howItWorksText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const detailsRequired = formData.detailsRequiredText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      title: formData.name.trim(),
      keywords,
      whatWeAnalyse,
      howItWorks,
      detailsRequired,
    };

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-stone-950 border border-stone-800 text-stone-100 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 sm:p-6 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F3E5AB]">
                {formData.id.startsWith('service-') ? 'Add New Sacred Modality' : 'Edit Metaphysical Modality'}
              </h3>
              <p className="text-xs text-stone-400">
                Modify full broad descriptions, pricing tiers, keywords, and booking criteria.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-7 flex-1">
          {/* SECTION 1: CORE IDENTITY */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>1. Modality Identity &amp; Classification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Service Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                  placeholder="e.g. Tarot Card Reading"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Short Title (Navbar / Pills)
                </label>
                <input
                  type="text"
                  value={formData.shortTitle}
                  onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                  placeholder="e.g. Tarot Reading"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Badge / Meta Tag
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Intuitive Guidance"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Category Filter
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
                >
                  <option value="readings">Intuitive &amp; Numerology Readings</option>
                  <option value="energy">Energy &amp; Reiki Healing</option>
                  <option value="crystals">Crystals &amp; Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Availability Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
                >
                  <option value="available">Active (Available for Booking)</option>
                  <option value="currently unavailable">Paused (Currently Unavailable)</option>
                  <option value="coming soon">Coming Soon</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & TIERS */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>2. Pricing Structure &amp; Multiple Options / Tiers</span>
              </h4>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-mono text-[#D4AF37] flex items-center gap-1.5 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier / Option</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Starting Price (₹ Number)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="199"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Display Price Tag (e.g. &quot;₹199 per Question&quot;, &quot;Offline: ₹777 • Live: ₹999&quot;)
                </label>
                <input
                  type="text"
                  value={formData.priceDisplay}
                  onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                  placeholder="e.g. ₹199 per Question"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>
            </div>

            {/* Dynamic Tiers List */}
            {formData.pricingTiers.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-stone-400 block">
                  Configured Pricing Options (patrons can select these when inquiring):
                </span>
                {formData.pricingTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div className="w-full sm:w-1/3">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                        placeholder="Option Name (e.g. Offline Aura Checking)"
                        className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 outline-none focus:border-stone-600"
                      />
                    </div>
                    <div className="w-full sm:w-1/4">
                      <input
                        type="text"
                        value={tier.price}
                        onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                        placeholder="Price (e.g. ₹777)"
                        className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-[#D4AF37] font-bold outline-none focus:border-stone-600"
                      />
                    </div>
                    <div className="w-full sm:flex-1">
                      <input
                        type="text"
                        value={tier.details}
                        onChange={(e) => handleTierChange(idx, 'details', e.target.value)}
                        placeholder="Brief details / inclusions..."
                        className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-300 outline-none focus:border-stone-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition self-end sm:self-center"
                      title="Remove tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: HIGHLIGHTED KEY WORDS & CARD SUMMARY */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>3. Highlighted Keywords &amp; Card Teaser</span>
            </h4>

            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                Main Highlighted Keywords (comma-separated, shown as glowing badges)
              </label>
              <input
                type="text"
                value={formData.keywordsText}
                onChange={(e) => setFormData({ ...formData, keywordsText: e.target.value })}
                placeholder="e.g. ₹199 per Question, Personalized Voice Notes, WhatsApp Delivery, Intuitive Selection"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                These keywords are highlighted in bold chips both on the card and inside the broad description modal.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Intuitive, personalized reading providing clarity..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Duration &amp; Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 20–25 Minutes"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    placeholder="e.g. WhatsApp Audio / Video"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                Card Short Description (shown on grid card)
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short summary displayed on the card..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] outline-none resize-none"
              />
            </div>
          </div>

          {/* SECTION 4: BROAD DESCRIPTION & PROTOCOL */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>4. Full Broad Description &amp; Content Breakdown</span>
            </h4>

            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                Full Broad Description (shown when patron clicks on the service) *
              </label>
              <textarea
                rows={5}
                required
                value={formData.broadDescription}
                onChange={(e) => setFormData({ ...formData, broadDescription: e.target.value })}
                placeholder="Write the full comprehensive explanation of this modality..."
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  What We Analyse / What is Discussed (1 bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.whatWeAnalyseText}
                  onChange={(e) => setFormData({ ...formData, whatWeAnalyseText: e.target.value })}
                  placeholder="Your Date of Birth and Name&#10;Key personality traits and characteristics&#10;Strengths and weaker areas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  How The Process Works (1 step per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.howItWorksText}
                  onChange={(e) => setFormData({ ...formData, howItWorksText: e.target.value })}
                  placeholder="1. Book by making pre-payment&#10;2. Share your details on WhatsApp&#10;3. Your reading is delivered offline..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Details Required for Booking (1 item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.detailsRequiredText}
                  onChange={(e) => setFormData({ ...formData, detailsRequiredText: e.target.value })}
                  placeholder="Full Name&#10;Date of Birth (DD/MM/YYYY)&#10;Recent Photograph..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-1.5 font-semibold">
                  Important Notes &amp; Spiritual Disclaimer
                </label>
                <textarea
                  rows={3}
                  value={formData.importantNote}
                  onChange={(e) => setFormData({ ...formData, importantNote: e.target.value })}
                  placeholder="Appointment policy, spiritual guidance disclosure..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-8 sm:-mb-8 p-5 sm:p-6 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 flex items-center justify-end gap-3 z-20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:opacity-95 text-black text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish Modality</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
