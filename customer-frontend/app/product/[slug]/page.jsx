'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/useCart';
import { getSupabaseProductBySlug, getSupabaseDeliverySettings } from '../../../lib/supabase';
import { calculateDeliveryFee, DEFAULT_DELIVERY_SETTINGS } from '../../../lib/shippingEngine';
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
  const [isEnergizedAddon, setIsEnergizedAddon] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | '3d'
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | 'valid' | 'invalid'
  const [pincodeResult, setPincodeResult] = useState(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [addedNotice, setAddedNotice] = useState(false);

  // Load delivery settings from Supabase
  useEffect(() => {
    let isMounted = true;
    getSupabaseDeliverySettings()
      .then((settings) => {
        if (isMounted && settings) setDeliverySettings(settings);
      })
      .catch((err) => console.warn('Delivery settings fetch note:', err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState({
    benefits: true,
    care: false,
    shipping: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [selectedVariant, setSelectedVariant] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const loadProduct = async () => {
      setNotFound(false);
      // 1. Fetch live product directly from Supabase (Source of Truth)
      try {
        const supaProd = await getSupabaseProductBySlug(slug);
        if (supaProd && isMounted) {
          setProduct(supaProd);
          if (supaProd.variants && supaProd.variants.length > 0) {
            setSelectedVariant(supaProd.variants[0]);
            setSelectedSize(supaProd.variants[0].name || supaProd.variants[0].variant_name);
          }
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase product slug fetch note:', sbErr.message);
      }

      // 2. Fallback to Backend REST API if configured and Supabase did not locate
      if (API_BASE) {
        try {
          const res = await fetch(`${API_BASE}/api/products/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.product) {
              setProduct(data.product);
              if (data.product.variants && data.product.variants.length > 0) {
                setSelectedVariant(data.product.variants[0]);
                setSelectedSize(data.product.variants[0].name);
              }
              return;
            }
          }
        } catch (e) {
          console.warn('Backend product slug fetch note:', e.message);
        }
      }

      // If specimen is not in live database, set notFound to true
      if (isMounted) {
        setNotFound(true);
      }
    };

    loadProduct();
    return () => { isMounted = false; };
  }, [slug, API_BASE]);

  if (notFound) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-4 bg-[#FCFAF6]">
        <div className="w-16 h-16 rounded-full bg-[#FFF4E0] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-[#8C6208]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1F1A15]">
            Specimen Not Located in Vault
          </h2>
          <p className="text-xs sm:text-sm font-sans-ui text-[#6B6357] leading-relaxed">
            The requested crystal specimen may have been acquired or relocated in our sacred treasury.
          </p>
        </div>
        <Link
          href="/shop"
          className="cta-3d-gold px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <span>Explore Treasury Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

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

  // Dynamic price calculation directly adhering to Admin-saved values
  const basePrice = (selectedVariant && Number(selectedVariant.price) > 0)
    ? Number(selectedVariant.price)
    : Number(product.price || product.sellingPrice || product.selling_price || 0);

  const baseOriginalPrice = (selectedVariant && Number(selectedVariant.originalPrice) > 0)
    ? Number(selectedVariant.originalPrice)
    : Number(product.originalPrice || product.original_price || (basePrice > 0 ? Math.round(basePrice * 1.25) : 0));

  const addonCost = isEnergizedAddon ? (Number(product.energizedPrice) || 100) : 0;
  const unitPrice = basePrice + addonCost;
  const originalUnitPrice = baseOriginalPrice + addonCost;
  const totalPrice = unitPrice * quantity;
  const installmentPrice = Math.round(unitPrice / 3);
  const discountPercent =
    originalUnitPrice > unitPrice
      ? Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100)
      : Number(product.discountPercent || product.discount_percentage || 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      id: product.id,
      slug: product.slug,
      name: `${product.name} - ${selectedVariant?.name || selectedSize} ${isEnergizedAddon ? '(Vedic Energized)' : ''}`,
      image: product.images?.[0] || product.image,
      variantLabel: selectedVariant?.name || selectedSize,
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
      name: `${product.name} - ${selectedVariant?.name || selectedSize} ${isEnergizedAddon ? '(Vedic Energized)' : ''}`,
      image: product.images?.[0] || product.image,
      variantLabel: selectedVariant?.name || selectedSize,
      price: unitPrice,
      unitPrice,
      quantity,
    });
    router.push('/checkout');
  };

  const handleCheckPincode = async (e) => {
    if (e) e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length < 6) return;

    setIsCheckingPincode(true);
    try {
      const res = await calculateDeliveryFee(cleanPin, totalPrice, deliverySettings);
      setPincodeResult(res);
      setPincodeStatus(res.valid ? 'valid' : 'invalid');
    } catch (err) {
      console.warn('Pincode check error:', err);
    } finally {
      setIsCheckingPincode(false);
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

            {/* Dynamic Crystal Variant Selector (Flipkart-Style) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1F1A15] font-bold uppercase tracking-wider">
                  {product.variants && product.variants.length > 0 ? 'Select Specification / Variant:' : 'Select Bracelet Size:'}
                </span>
                <span className="text-[#8C6208] font-bold">{selectedVariant?.name || selectedSize}</span>
              </div>

              {product.variants && product.variants.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((v, idx) => {
                    const isSelected = selectedVariant?.id ? selectedVariant.id === v.id : selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.id || idx}
                        type="button"
                        disabled={v.isAvailable === false || v.stock <= 0}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize(v.name);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FFF9EE] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md text-[#1F1A15]'
                            : 'bg-white border-[#EDE6DA] hover:border-[#D4AF37]/60 text-[#6B6357]'
                        } ${v.isAvailable === false || v.stock <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="font-bold text-xs truncate">{v.name}</div>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-[#8C6208] font-bold">₹{v.price || product.price}</span>
                          {v.sizeOrWeight && (
                            <span className="text-[10px] text-[#8C8377] font-mono">{v.sizeOrWeight}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
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
              )}
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
                  {deliverySettings?.is_free_shipping_enabled
                    ? `Free Shipping over ₹${Number(deliverySettings.free_shipping_threshold || 5000).toLocaleString('en-IN')}`
                    : 'Insured Armored Transit'}
                </span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 411001, 560001)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E0D7C7] text-xs text-[#1F1A15] placeholder:text-[#9E9589] focus:outline-none focus:border-[#D4AF37] font-mono shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode || pincode.length < 6}
                  className="cta-3d-gold px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer disabled:opacity-50"
                >
                  {isCheckingPincode ? 'Checking…' : 'Check'}
                </button>
              </form>

              {pincodeStatus === 'valid' && pincodeResult && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 animate-fade-in font-sans-ui shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>
                        {pincodeResult.city ? `${pincodeResult.city}, ${pincodeResult.state}` : pincodeResult.state}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/60 font-bold text-emerald-800">
                      {pincodeResult.tierName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/60 text-emerald-800">
                    <span>
                      Est. Arrival: <strong>{pincodeResult.estimatedDays}</strong>
                    </span>
                    <span className="font-mono font-bold">
                      {pincodeResult.isFree ? (
                        <span className="text-emerald-700 font-bold">FREE DELIVERY</span>
                      ) : (
                        `₹${pincodeResult.fee} Delivery Fee`
                      )}
                    </span>
                  </div>
                </div>
              )}

              {pincodeStatus === 'invalid' && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-sans-ui">
                  <span className="font-semibold">Please enter a valid 6-digit Indian PIN code.</span>
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
