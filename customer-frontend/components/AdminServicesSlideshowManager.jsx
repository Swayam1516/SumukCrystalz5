'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DEFAULT_SERVICES_SLIDESHOW } from '../data/servicesSlideshowData';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Tag,
  Clock,
  ShieldCheck,
  Save,
  AlertCircle,
} from 'lucide-react';

const PRESET_IMAGE_OPTIONS = [
  { label: 'Crystal Therapy & Attunement', path: '/assets/services/crystal-therapy.png' },
  { label: 'Bespoke Crystal Curation', path: '/assets/services/bespoke-crystal-curation.png' },
  { label: 'Energy Healing & Blockage Removal', path: '/assets/services/energy-healing.png' },
  { label: 'Sacred Numerology & Blueprint', path: '/assets/services/sacred-numerology.png' },
  { label: 'Psychic Surgery & Cord Cutting', path: '/assets/services/psychic-surgery.png' },
  { label: 'Reiki-Infused Crystal Products', path: '/assets/services/reiki-crystal-products.png' },
  { label: 'Reiki Mastership & Attunement', path: '/assets/services/reiki-mastership.png' },
  { label: 'Intuitive Tarot Readings', path: '/assets/services/tarot-readings.png' },
  { label: 'Aura Checking & Biofield Scanning', path: '/assets/services/aura-biofield-scanning.png' },
];

export default function AdminServicesSlideshowManager({ onToast }) {
  const [servicesList, setServicesList] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    name: '',
    badge: 'HOLISTIC WELLNESS',
    priceDisplay: 'Starting ₹777',
    price: 777,
    image: '/assets/services/crystal-therapy.png',
    customImageUrl: '',
    shortDescription: '',
    description: '',
    broadDescription: '',
    detailsRequired: 'Full Name, Date of Birth, Primary Intention, Payment Screenshot',
    status: 'available',
    showInSlideshow: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    try {
      const saved = localStorage.getItem('sumuk_services_slideshow_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServicesList(parsed);
          return;
        }
      }
      setServicesList(DEFAULT_SERVICES_SLIDESHOW);
      localStorage.setItem('sumuk_services_slideshow_list', JSON.stringify(DEFAULT_SERVICES_SLIDESHOW));
    } catch (_) {
      setServicesList(DEFAULT_SERVICES_SLIDESHOW);
    }
  };

  const persistServices = (newList, message = 'Services 3D slideshow updated successfully!') => {
    setServicesList(newList);
    try {
      localStorage.setItem('sumuk_services_slideshow_list', JSON.stringify(newList));
      // Dispatch real-time custom event so storefront 3D Cover Flow updates live
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sumuk-services-slideshow-updated', { detail: newList }));
      }
      if (onToast) onToast(message, 'success');
    } catch (e) {
      if (onToast) onToast('Failed to save to local storage: ' + e.message, 'error');
    }
  };

  // Reorder Up
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const updated = [...servicesList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // Update order keys
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });
    persistServices(updated, `Moved "${temp.title}" up in slideshow sequence.`);
  };

  // Reorder Down
  const handleMoveDown = (index) => {
    if (index >= servicesList.length - 1) return;
    const updated = [...servicesList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });
    persistServices(updated, `Moved "${temp.title}" down in slideshow sequence.`);
  };

  // Toggle Visibility in 3D Slideshow
  const handleToggleVisibility = (id) => {
    const updated = servicesList.map((s) => {
      if (s.id === id) {
        const nextState = s.showInSlideshow === false ? true : false;
        return { ...s, showInSlideshow: nextState };
      }
      return s;
    });
    const target = updated.find((s) => s.id === id);
    persistServices(
      updated,
      target.showInSlideshow
        ? `"${target.title}" is now ACTIVE in 3D Slideshow.`
        : `"${target.title}" is now HIDDEN from 3D Slideshow.`
    );
  };

  // Delete Service
  const handleDeleteService = (id) => {
    const target = servicesList.find((s) => s.id === id);
    if (!confirm(`Are you sure you want to remove "${target?.title || 'this service'}" from the 3D Slideshow?`)) {
      return;
    }
    const updated = servicesList.filter((s) => s.id !== id);
    persistServices(updated, `Service "${target?.title}" removed from 3D Slideshow.`);
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (confirm('Reset the 3D Slideshow to the 9 default canonical services? Any custom additions will be restored.')) {
      persistServices(DEFAULT_SERVICES_SLIDESHOW, 'Restored all 9 default canonical services to 3D Slideshow.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      title: service.title || service.name,
      name: service.title || service.name,
      badge: service.badge || 'HOLISTIC WELLNESS',
      priceDisplay: service.priceDisplay || (service.price ? `₹${service.price}` : 'Starting ₹777'),
      price: service.price || 777,
      image: service.image || '/assets/services/crystal-therapy.png',
      customImageUrl: service.image?.startsWith('http') ? service.image : '',
      shortDescription: service.shortDescription || service.description || '',
      description: service.description || service.shortDescription || '',
      broadDescription: service.broadDescription || service.description || '',
      detailsRequired: Array.isArray(service.detailsRequired)
        ? service.detailsRequired.join(', ')
        : service.detailsRequired || 'Full Name, Date of Birth, Intention',
      status: service.status || 'available',
      showInSlideshow: service.showInSlideshow !== false,
    });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      id: `service-${Date.now()}`,
      title: '',
      name: '',
      badge: 'SACRED WELLNESS',
      priceDisplay: 'Starting ₹777',
      price: 777,
      image: '/assets/services/crystal-therapy.png',
      customImageUrl: '',
      shortDescription: '',
      description: '',
      broadDescription: '',
      detailsRequired: 'Full Name, Date of Birth, Primary Intention, Payment Screenshot',
      status: 'available',
      showInSlideshow: true,
    });
    setShowAddModal(true);
  };

  // Submit Save (Add or Edit)
  const handleSaveServiceForm = (e) => {
    e.preventDefault();
    const finalImage = formData.customImageUrl.trim() ? formData.customImageUrl.trim() : formData.image;

    const formattedDetails = formData.detailsRequired
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const servicePayload = {
      id: formData.id || `service-${Date.now()}`,
      title: formData.title.trim(),
      name: formData.title.trim(),
      badge: formData.badge.trim().toUpperCase(),
      priceDisplay: formData.priceDisplay.trim(),
      price: Number(formData.price) || 777,
      image: finalImage,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim() || formData.shortDescription.trim(),
      broadDescription: formData.broadDescription.trim() || formData.shortDescription.trim(),
      detailsRequired: formattedDetails.length > 0 ? formattedDetails : ['Full Name', 'Date of Birth', 'Intention'],
      status: formData.status,
      showInSlideshow: formData.showInSlideshow,
      order: editingService ? editingService.order : servicesList.length + 1,
      pricingTiers: editingService?.pricingTiers || [
        { name: 'Standard Session', price: formData.priceDisplay, details: 'Personalized sacred session.' },
      ],
      whatWeAnalyse: editingService?.whatWeAnalyse || [
        'Biofield energetic alignment',
        'Harmonization of personal vibrations',
      ],
      importantNote:
        editingService?.importantNote ||
        '✨ Spiritual Wellness Note: Offered as a complementary holistic practice for relaxation and inner calm.',
    };

    let updatedList = [];
    if (editingService) {
      updatedList = servicesList.map((s) => (s.id === editingService.id ? servicePayload : s));
      persistServices(updatedList, `Updated service "${servicePayload.title}" successfully!`);
      setEditingService(null);
    } else {
      updatedList = [...servicesList, servicePayload];
      persistServices(updatedList, `New service "${servicePayload.title}" added to 3D Slideshow!`);
      setShowAddModal(false);
    }
  };

  const activeInSlideshowCount = servicesList.filter((s) => s.showInSlideshow !== false).length;

  return (
    <div className="space-y-6">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#140e22] border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">
              Services 3D Cover Flow Slideshow Manager
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage, add, reorder, and configure all services featured in the interactive 3D Cover Flow slideshow.
            Changes persist and update the storefront in realtime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition cursor-pointer"
            title="Reset to 9 canonical services"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Service to Slideshow</span>
          </button>
        </div>
      </div>

      {/* ── Status KPI Counter ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#100b1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Total Services Configured</p>
            <p className="text-2xl font-mono font-bold text-white mt-0.5">{servicesList.length}</p>
          </div>
          <Layers className="w-8 h-8 text-amber-400/40" />
        </div>

        <div className="bg-[#100b1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Active in 3D Slideshow</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">{activeInSlideshowCount}</p>
          </div>
          <Eye className="w-8 h-8 text-emerald-400/40" />
        </div>

        <div className="bg-[#100b1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Hidden from Slideshow</p>
            <p className="text-2xl font-mono font-bold text-zinc-500 mt-0.5">
              {servicesList.length - activeInSlideshowCount}
            </p>
          </div>
          <EyeOff className="w-8 h-8 text-zinc-600" />
        </div>
      </div>

      {/* ── Services Slideshow Table / Card List ── */}
      <div className="space-y-3">
        {servicesList.map((service, index) => {
          const isVisible = service.showInSlideshow !== false;
          return (
            <div
              key={service.id || index}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isVisible
                  ? 'bg-[#100b1d]/90 border-amber-500/25 hover:border-amber-400/50'
                  : 'bg-black/40 border-zinc-800 opacity-60'
              }`}
            >
              {/* Left Column: Image thumbnail + Reorder buttons + Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 items-center justify-center pr-2 border-r border-zinc-800">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1 rounded bg-zinc-800 hover:bg-amber-400 hover:text-black text-zinc-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Move up in slideshow"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    disabled={index === servicesList.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1 rounded bg-zinc-800 hover:bg-amber-400 hover:text-black text-zinc-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Move down in slideshow"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Service Photo Preview */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/30 flex-shrink-0">
                  <Image
                    src={service.image || '/assets/services/crystal-therapy.png'}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Service Details */}
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {service.badge || 'SERVICES'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-200">
                      {service.priceDisplay || `₹${service.price}`}
                    </span>
                    {service.status && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {service.status}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {service.shortDescription || service.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions (Toggle Visibility, Edit, Delete) */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(service.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    isVisible
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900/60'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                  }`}
                  title={isVisible ? 'Hide from 3D slideshow' : 'Show in 3D slideshow'}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isVisible ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(service)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition cursor-pointer"
                  title="Edit service details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 rounded-xl text-xs font-mono font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition cursor-pointer"
                  title="Remove from slideshow"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ── MODAL: ADD / EDIT SERVICE IN 3D SLIDESHOW ── */}
      {/* ========================================================================= */}
      {(showAddModal || editingService) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setShowAddModal(false);
            setEditingService(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#100b1d] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingService(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D Cover Flow Management</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service to 3D Slideshow'}
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveServiceForm} className="space-y-4">
              {/* Service Title */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Checking & Biofield Scanning"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* Badge & Price Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Gold Category Badge *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIOFIELD SCANNING"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-amber-400 outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Consultation Price Display *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Offline ₹777 • Live ₹999"
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Image Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Service Photo (Preset Asset or Custom URL) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Select from Built-in Assets:</span>
                    <select
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value, customImageUrl: '' })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-amber-400 outline-none"
                    >
                      {PRESET_IMAGE_OPTIONS.map((opt) => (
                        <option key={opt.path} value={opt.path}>
                          {opt.label} ({opt.path.split('/').pop()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Or Enter Custom Image URL:</span>
                    <input
                      type="url"
                      placeholder="https://... /assets/..."
                      value={formData.customImageUrl}
                      onChange={(e) => setFormData({ ...formData, customImageUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Image Live Preview */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image
                      src={formData.customImageUrl.trim() ? formData.customImageUrl.trim() : formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="text-white font-mono font-bold block">Selected Asset:</span>
                    <span className="text-[11px] text-amber-300 font-mono break-all">
                      {formData.customImageUrl.trim() ? formData.customImageUrl.trim() : formData.image}
                    </span>
                  </div>
                </div>
              </div>

              {/* Short Description (Shown on 3D Card) */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Short Description (Displayed on 3D Card) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Explore guided energy-balancing sessions designed to support relaxation and emotional well-being."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-amber-400 outline-none resize-none"
                />
              </div>

              {/* Full Description (Shown in Detailed Explore Modal) */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Full Detailed Description (Displayed in Explore Modal)
                </label>
                <textarea
                  rows={3}
                  placeholder="Full background on the spiritual modality, methods, and aftercare..."
                  value={formData.broadDescription}
                  onChange={(e) => setFormData({ ...formData, broadDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-amber-400 outline-none resize-none"
                />
              </div>

              {/* Details Required for Booking (comma-separated) */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Booking Details Required (Comma-separated checklist)
                </label>
                <input
                  type="text"
                  placeholder="Full Name, Date of Birth, Primary Intention, Payment Screenshot"
                  value={formData.detailsRequired}
                  onChange={(e) => setFormData({ ...formData, detailsRequired: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* Status and Active in Slideshow Checkbox */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Booking Status:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="currently unavailable">Currently Unavailable</option>
                    <option value="coming soon">Coming Soon</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInSlideshow}
                    onChange={(e) => setFormData({ ...formData, showInSlideshow: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Active in 3D Slideshow</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Save Service Changes' : 'Add to 3D Slideshow'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
