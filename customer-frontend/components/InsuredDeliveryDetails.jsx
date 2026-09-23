'use client';

import React from 'react';
import Image from 'next/image';
import {
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Building2,
  Map,
  Globe,
  ChevronDown,
  ShieldCheck,
  Gem,
  ArrowRight,
  X,
} from 'lucide-react';

export default function InsuredDeliveryDetails({
  formData,
  onChange,
  onSubmit,
  onClose,
  shippingCalculation = null,
  isSubmitting = false,
  submitLabel = 'Submit Delivery Details',
  showClose = true,
  className = '',
}) {
  return (
    <div
      className={`w-full rounded-[28px] sm:rounded-[36px] bg-[#FAF8FD] border border-purple-200/90 shadow-[0_25px_90px_rgba(76,29,149,0.18)] text-[#1E1B4B] overflow-hidden relative ${className}`}
    >
      {/* Outer subtle purple ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="p-6 sm:p-8 lg:p-9 relative z-10">
        {/* Header Matching Reference Image 2 */}
        <div className="flex items-start justify-between pb-6 border-b border-purple-100/90">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-100/70 border border-purple-200/80 flex items-center justify-center text-[#5B21B6] flex-shrink-0 shadow-xs">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#110D23] tracking-tight leading-none">
                Insured Armored{' '}
                <span className="bg-gradient-to-r from-[#6B21A8] via-[#7C3AED] to-[#9333EA] text-transparent bg-clip-text">
                  Delivery Details
                </span>
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#6B5C82] uppercase font-semibold mt-1.5">
                SAFE. SECURE. STILL BEAUTIFUL.
              </p>
            </div>
          </div>

          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-purple-100/70 text-[#5B21B6] hover:text-black transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* 2-Column Split Grid Matching Reference Image 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 pt-6">
          {/* Left Column: Form Fields & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Recipient Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Recipient Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter recipient's full name"
                    value={formData?.fullName || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Email for Certificate PDF */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Email for Certificate PDF *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter email address"
                    value={formData?.email || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Phone (For Courier Tracking) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Phone (for Courier Tracking) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter phone number"
                    value={formData?.phone || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Delivery Address Line 1 */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Delivery Address Line 1 *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="line1"
                    required
                    placeholder="House / Building / Street"
                    value={formData?.line1 || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Address Line 2 (Suite / Estate) */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Address Line 2 (Suite / Estate)
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="line2"
                    placeholder="Apartment, Suite, Estate (Optional)"
                    value={formData?.line2 || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  City *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Enter city"
                    value={formData?.city || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* State / Province */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  State / Province *
                </label>
                <div className="relative">
                  <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Enter state or province"
                    value={formData?.state || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Postal Code *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="Enter postal code"
                    value={formData?.postalCode || ''}
                    onChange={onChange}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] placeholder:text-[#9E95AB] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-[#110D23]">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#110D23]" />
                  <select
                    name="country"
                    value={formData?.country || 'India'}
                    onChange={onChange}
                    className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl bg-white border border-purple-200/90 text-xs text-[#110D23] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-xs appearance-none cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E95AB] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dynamic Pincode Delivery Tier Display */}
            {shippingCalculation?.valid && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 via-purple-100/60 to-purple-50 border border-purple-200 text-xs text-[#2B174F] flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-[#110D23] flex items-center gap-1.5">
                      <span>
                        {shippingCalculation.city
                          ? `${shippingCalculation.city}, ${shippingCalculation.state}`
                          : shippingCalculation.state}
                      </span>
                      {shippingCalculation.distanceKm ? (
                        <span className="text-[10px] font-mono text-[#6B5C82]">
                          ({shippingCalculation.distanceKm} km)
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[#6B5C82] text-[10px] font-mono">
                      {shippingCalculation.tierName}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold font-mono text-xs text-[#7C3AED]">
                    {shippingCalculation.isFree ? 'FREE DELIVERY' : `₹${shippingCalculation.fee}`}
                  </span>
                  <span className="block text-[10px] text-[#6B5C82] font-mono">
                    {shippingCalculation.estimatedDays}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {onSubmit && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#181124] via-[#2A1840] to-[#181124] hover:from-[#2A1840] hover:to-[#381F54] text-white font-extrabold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Securing Transaction…' : submitLabel}</span>
                  <div className="w-5 h-5 rounded-full border border-white/25 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                </button>
              </div>
            )}

            {/* Bottom Reassurance Badges matching Reference Image 2 */}
            <div className="pt-4 border-t border-purple-100/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-[#6B5887]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6D28D9]" />
                  <span>Insured</span>
                </span>
                <span className="text-purple-200">|</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6D28D9]" />
                  <span>Tracked</span>
                </span>
                <span className="text-purple-200">|</span>
                <span className="flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-[#6D28D9]" />
                  <span>Handled with Care</span>
                </span>
              </div>

              <div className="text-[10px] font-mono tracking-widest text-[#8A7A9E] uppercase font-semibold text-right leading-tight">
                <div>PURE CRYSTALS</div>
                <div>LASTING CONNECTIONS</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Artwork Card matching Reference Image 2 */}
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#F5EFFA] to-[#EBE1F5] border border-purple-200/80 min-h-[420px] lg:min-h-full flex flex-col justify-between p-6 shadow-md group">
            {/* Background 3D Render Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/safe_delivery_vault.jpg"
                alt="Safe Delivery Vault with Amethyst Crystals"
                fill
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B0E2B]/40 via-transparent to-white/20 pointer-events-none" />
            </div>

            {/* Top Calligraphic Script Note */}
            <div className="relative z-10">
              <span className="font-serif italic text-lg sm:text-xl text-[#3B1B63] drop-shadow-sm font-semibold tracking-wide block">
                From Our Store
              </span>
              <span className="font-serif italic text-lg sm:text-xl text-[#3B1B63] drop-shadow-sm font-semibold tracking-wide block">
                to Your World ♡
              </span>
            </div>

            {/* Bottom Frosted Glass Emblem */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-xl text-center space-y-0.5">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] font-extrabold text-[#3B1B63]">
                SAFE DELIVERY
              </p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B5887] font-semibold">
                PRECIOUS THINGS REACH FURTHER
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
