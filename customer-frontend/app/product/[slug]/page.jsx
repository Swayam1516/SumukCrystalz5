'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/useCart';
import { ENERGY_STONES_CATALOG } from '../../../data/energyStones';
import { CRYSTAL_CATALOG } from '../../../data/crystals';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Compass,
  Heart,
  RotateCw,
  ShoppingBag,
  Check,
  ArrowRight,
  Star,
  Truck,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Share2,
} from 'lucide-react';

const CrystalShowcase = dynamic(() => import('../../../components/CrystalShowcase'), {
  ssr: false,
  loading: () => (
    <div className="aspect-square w-full rounded-3xl bg-[#F5EFE6] border border-[#EDE6DA] flex items-center justify-center text-xs text-[#8C8377]">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem, openDrawer } = useCartStore();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('8mm Regular');
  const [isEnergizedAddon, setIsEnergizedAddon] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | '3d'
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | 'valid'
  const [addedNotice, setAddedNotice] = useState(false);

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState({
    benefits: true,
    care: false,
    shipping: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!slug) return;
    // 1. Search in ENERGY_STONES_CATALOG
    const foundEnergy = ENERGY_STONES_CATALOG.find((p) => p.slug === slug || p.id === slug);
    if (foundEnergy) {
      setProduct(foundEnergy);
      return;
    }

    // 2. Fallback to raw crystal catalog
    const foundRaw = CRYSTAL_CATALOG.find((p) => p.id === slug || p.specimenCode?.includes(slug));
    if (foundRaw) {
      setProduct({
        id: foundRaw.id,
        slug: foundRaw.id,
        name: foundRaw.name,
        subtitle: foundRaw.subtitle,
        description: foundRaw.description,
        shortDescription: foundRaw.subtitle,
        price: foundRaw.price,
        originalPrice: foundRaw.originalPrice,
        discountPercent: Math.round(((foundRaw.originalPrice - foundRaw.price) / foundRaw.originalPrice) * 100),
        badge: 'MASTERWORK',
        badgeColor: 'bg-[#B8860B] text-white',
        rating: 5.0,
        reviewsCount: 420,
        beadSize: 'Museum Geode Matrix',
        images: [
          'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80',
        ],
        vedicBenefits: [
          '528Hz Solfeggio frequency sound-consecrated',
          'Ethically mined with zero synthetic heating',
          'Includes certificate of origin and mineral provenance',
        ],
      });
      return;
    }

    // 3. Fallback default
    setProduct(ENERGY_STONES_CATALOG[0]);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 bg-[#FCFAF6]">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-[#8C6208] uppercase tracking-widest font-bold">
          Attuning to sacred specimen matrix…
        </p>
      </div>
    );
  }

  // Dynamic price calculation with Energized Pran Pratishta Addon (+₹100)
  const addonCost = isEnergizedAddon ? 100 : 0;
  const unitPrice = product.price + addonCost;
  const originalUnitPrice = product.originalPrice + addonCost;
  const totalPrice = unitPrice * quantity;
  const installmentPrice = Math.round(unitPrice / 3);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      id: product.id,
      slug: product.slug,
      name: `${product.name} ${isEnergizedAddon ? '(Vedic Energized)' : ''}`,
      image: product.images[0],
      variantLabel: selectedSize,
      price: unitPrice,
      unitPrice,
      quantity,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
    openDrawer();
  };

  const handleInstantBuy = () => {
    addItem({
      productId: product.id,
      id: product.id,
      slug: product.slug,
      name: `${product.name} ${isEnergizedAddon ? '(Vedic Energized)' : ''}`,
      image: product.images[0],
      variantLabel: selectedSize,
      price: unitPrice,
      unitPrice,
      quantity,
    });
    router.push('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus('valid');
    }
  };

  return (
    <div className="min-h-screen store-canvas-light text-[#1F1A15] pb-28 transition-colors duration-500">
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 text-xs font-sans-ui text-[#8C8377]">
          <Link href="/" className="hover:text-[#1F1A15] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1F1A15] transition">
            Store
          </Link>
          <span>/</span>
          <Link href={`/shop?purpose=${product.purpose || 'all'}`} className="hover:text-[#1F1A15] transition font-medium">
            {product.purposeLabel || 'Energy Bands'}
          </Link>
          <span>/</span>
          <span className="text-[#8C6208] font-bold truncate max-w-[220px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN PDP LAYOUT (LIGHT SPIRITUAL LUXURY) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: PRODUCT MEDIA GALLERY */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
            {/* Media Mode Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('gallery')}
                  className={`px-4 py-2 rounded-full text-xs font-option transition-all flex items-center gap-1.5 ${
                    activeMediaTab === 'gallery'
                      ? 'option-3d-light-active-gold text-black'
                      : 'option-3d-light'
                  }`}
                >
                  <span>Gallery Views</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('3d')}
                  className={`px-4 py-2 rounded-full text-xs font-option transition-all flex items-center gap-1.5 ${
                    activeMediaTab === '3d'
                      ? 'option-3d-light-active-gold text-black'
                      : 'option-3d-light'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                  <span>3D Refraction Matrix</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Lab Certified Authentic</span>
              </span>
            </div>

            {/* Main Image / 3D Canvas */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#EDE6DA] shadow-xl group">
              {activeMediaTab === '3d' ? (
                <CrystalShowcase activeCrystalId={slug} />
              ) : (
                <>
                  <Image
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />

                  {/* Floating Bead / Dimension Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#8C6208] text-xs font-mono font-bold tracking-wider border border-[#D4AF37]/50 shadow-md">
                      {selectedSize} &bull; Certified Stones
                    </span>
                  </div>

                  {/* Discount Tag Top-Right */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#BA3C2A] text-white text-xs font-mono font-bold shadow-lg">
                    {product.discountPercent}% OFF
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setActiveMediaTab('gallery');
                    }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx && activeMediaTab === 'gallery'
                        ? 'border-[#D4AF37] scale-105 shadow-md ring-2 ring-[#D4AF37]/30'
                        : 'border-[#EDE6DA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: HIGH-CONVERTING 3D PURCHASE ENGINE */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header: Discount Badge, Title, Ratings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#BA3C2A]/10 border border-[#BA3C2A]/30 text-[#BA3C2A] text-[11px] font-mono font-bold uppercase tracking-wider">
                  {product.discountPercent}% OFF &bull; BESTSELLER
                </span>
                <span className="text-[11px] font-mono text-[#8C6208] uppercase tracking-wider font-bold">
                  {product.purposeLabel || 'Vedic Prosperity'}
                </span>
              </div>

              <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1A15] leading-tight text-3d-title-light">
                {product.name}
              </h1>

              <p className="text-xs text-[#6B6357] font-sans-ui leading-relaxed">
                {product.subtitle}
              </p>

              {/* Star Rating & Verified Review count */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#D4AF37] font-sans-ui">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="font-bold text-[#1F1A15] text-sm">{product.rating}</span>
                <span className="text-[#8C8377]">({product.reviewsCount} verified collectors)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="p-5 rounded-2xl store-card-light space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[#1F1A15]">
                  ₹{unitPrice}
                </span>
                <span className="text-base text-[#9E9589] font-mono line-through">
                  ₹{originalUnitPrice}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                  Save ₹{originalUnitPrice - unitPrice}
                </span>
              </div>

              {/* Installments & COD callout */}
              <p className="text-xs text-[#6B6357] font-sans-ui flex items-center gap-1.5">
                <span>or 3 interest-free payments of</span>
                <strong className="text-[#1F1A15] font-mono">₹{installmentPrice}</strong>
                <span>with UPI / Debit / Credit Cards</span>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EDE6DA] flex items-start gap-2.5 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-editorial text-[#1F1A15] font-bold text-xs">100% Certified</h4>
                  <p className="text-[10px] text-[#6B6357] mt-0.5 leading-tight">
                    Authentic natural stones verified by lab test
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EDE6DA] flex items-start gap-2.5 shadow-sm">
                <RotateCw className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-editorial text-[#1F1A15] font-bold text-xs">6-Month Warranty</h4>
                  <p className="text-[10px] text-[#6B6357] mt-0.5 leading-tight">
                    Free string replacement &amp; sound re-attunement
                  </p>
                </div>
              </div>
            </div>

            {/* 3D Size Selector Pills */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1F1A15] font-bold uppercase tracking-wider">Select Bracelet Size:</span>
                <span className="text-[#8C6208] font-bold">{selectedSize}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['8mm Regular', '6mm Slim'].map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-xl text-xs font-option transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'option-3d-light-active-gold text-black scale-102'
                          : 'option-3d-light'
                      }`}
                    >
                      <span className="font-bold">{size.toUpperCase()}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-black/70' : 'text-[#8C8377]'}`}>
                        {size === '8mm Regular' ? 'Standard Wrist (6.5"-7.5")' : 'Slim Wrist (5.5"-6.5")'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spiritual Upsell Add-on Box: Vedic Consecration Ceremony (+₹100) */}
            <div
              onClick={() => setIsEnergizedAddon(!isEnergizedAddon)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 select-none ${
                isEnergizedAddon
                  ? 'bg-gradient-to-r from-[#FFF9EE] via-[#FFF3D6] to-[#FFFFFF] border-[#D4AF37] shadow-md'
                  : 'bg-[#FFFFFF] border-[#EDE6DA] hover:border-[#D4AF37]/50'
              }`}
            >
              <input
                type="checkbox"
                checked={isEnergizedAddon}
                onChange={() => setIsEnergizedAddon(!isEnergizedAddon)}
                className="accent-[#B8860B] w-4 h-4 rounded mt-0.5 cursor-pointer"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-editorial text-xs font-bold text-[#1F1A15] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                    <span>Get Vedic Energized / Pran Pratishta (+₹100)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF0CE] text-[#8C6208] font-bold border border-[#D4AF37]/40">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6357] leading-relaxed font-sans-ui">
                  Individually consecrated with Vedic Surya mantras &amp; 528Hz Solfeggio sound bowls by Reiki Master Soumyaa Naveen prior to dispatch.
                </p>
              </div>
            </div>

            {/* Action Buttons: Stepper + Add to Cart + Terracotta Red "Order Now - COD" */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* 3D Quantity Stepper */}
                <div className="flex items-center border border-[#E0D7C7] rounded-xl bg-[#FFFFFF] p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1F1A15] hover:bg-[#F4EFE6] text-sm font-bold transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-[#1F1A15]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1F1A15] hover:bg-[#F4EFE6] text-sm font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* 3D Add to Vault Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-4 rounded-xl cta-3d-gold text-white font-option text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Vault!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO VAULT &bull; ₹{totalPrice}</span>
                    </>
                  )}
                </button>
              </div>

              {/* High-Intent Instant Express Checkout 3D Button */}
              <button
                type="button"
                onClick={handleInstantBuy}
                className="w-full py-4 px-6 rounded-2xl cta-3d-red text-white font-option text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all transform hover:scale-101 active:scale-99"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>EXPRESS CHECKOUT &bull; INSTANT BUY (PREPAID)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery & Pincode Checker */}
            <div className="p-4 rounded-2xl store-card-light space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-option uppercase text-[#1F1A15] font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#B8860B]" />
                  <span>Check Express Delivery Date</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Free Shipping
                </span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 560001)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E0D7C7] text-xs text-[#1F1A15] placeholder:text-[#9E9589] focus:outline-none focus:border-[#D4AF37] font-mono shadow-inner"
                />
                <button
                  type="submit"
                  className="cta-3d-gold px-5 py-2 rounded-xl text-xs font-bold text-white"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === 'valid' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-sans-ui">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    ✓ Express delivery to <strong>{pincode}</strong> in <strong>3–5 business days</strong> with Free Transit Insurance.
                  </span>
                </div>
              )}
            </div>

            {/* Expandable Accordions: Benefits, Care */}
            <div className="space-y-3 pt-2">
              {/* Accordion 1: Vedic Spiritual Benefits */}
              <div className="rounded-2xl store-card-light overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('benefits')}
                  className="w-full p-4 flex items-center justify-between text-xs font-editorial font-bold text-[#1F1A15] hover:bg-[#FDFBF7]"
                >
                  <span>Spiritual Healing &amp; Astrological Properties</span>
                  {openAccordions.benefits ? <ChevronUp className="w-4 h-4 text-[#B8860B]" /> : <ChevronDown className="w-4 h-4 text-[#B8860B]" />}
                </button>
                {openAccordions.benefits && (
                  <div className="p-4 pt-0 text-xs text-[#6B6357] space-y-2 border-t border-[#EDE6DA] font-sans-ui leading-relaxed">
                    <p>{product.description}</p>
                    {product.vedicBenefits && (
                      <ul className="space-y-1.5 pt-2">
                        {product.vedicBenefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#4A4237]">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: How to Cleanse & Wear */}
              <div className="rounded-2xl store-card-light overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full p-4 flex items-center justify-between text-xs font-editorial font-bold text-[#1F1A15] hover:bg-[#FDFBF7]"
                >
                  <span>How to Cleanse &amp; Which Hand to Wear</span>
                  {openAccordions.care ? <ChevronUp className="w-4 h-4 text-[#B8860B]" /> : <ChevronDown className="w-4 h-4 text-[#B8860B]" />}
                </button>
                {openAccordions.care && (
                  <div className="p-4 pt-0 text-xs text-[#6B6357] space-y-2 border-t border-[#EDE6DA] font-sans-ui leading-relaxed">
                    <p>
                      <strong>Which Hand to Wear:</strong> Wear on your <strong>dominant wrist</strong> (usually right hand) to project wealth and manifest intentions into the world. Wear on your non-dominant hand (left wrist) to absorb inner emotional tranquility and protective shielding.
                    </p>
                    <p>
                      <strong>Cleansing:</strong> Re-charge on Selenite charging plates or under full moonlight once every month. Avoid submerging in harsh chemical soaps.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FFFFFF]/95 backdrop-blur-2xl border-t border-[#EDE6DA] p-3.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-[#8C8377] block truncate max-w-[130px]">
            {product.name}
          </span>
          <span className="font-display text-lg font-bold text-[#1F1A15]">
            ₹{unitPrice}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-[#F4EFE6] text-[#1F1A15] border border-[#E0D7C7]"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleInstantBuy}
            className="py-2.5 px-4 rounded-xl cta-3d-red text-white font-option text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg flex-1"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>ORDER NOW - COD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
