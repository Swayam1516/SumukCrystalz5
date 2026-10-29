'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LuxuryInvoiceModal from '@/components/LuxuryInvoiceModal';
import ProductReviewModal from '@/components/ProductReviewModal';
import { useAuthStore } from '@/store/useAuth';
import { useCartStore } from '@/store/useCart';
import { getSupabaseOrdersByUser } from '@/lib/supabase';
import {
  Sparkles,
  Package,
  User,
  Heart,
  MapPin,
  Bell,
  Printer,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  Shield,
  ChevronRight,
  LogOut,
  Edit3,
  Save,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
  Award,
  Crown,
  Star
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout, openAuthModal, initAuth, updateUser } = useAuthStore();
  const { addItem, openDrawer } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'wishlist' | 'addresses' | 'notifications'
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [copiedAwb, setCopiedAwb] = useState(null);

  // Product Review Modal State
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [selectedReviewOrderId, setSelectedReviewOrderId] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    zodiac: 'Leo',
    spiritualIntent: 'Wealth & Abundance',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Wishlist State (persisted in localStorage)
  const [wishlist, setWishlist] = useState([]);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Primary Sanctuary',
    name: '',
    phone: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    isDefault: true,
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    whatsappShipment: true,
    whatsappOffers: false,
    emailInvoice: true,
    emailAstrology: true,
  });

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Sync profile when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        zodiac: user.zodiac || 'Leo',
        spiritualIntent: user.spiritualIntent || 'Wealth & Abundance',
      });
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sumuk_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Fetch orders from Supabase & API & Local Storage
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        let remoteOrders = [];

        // 1. Fetch from Supabase directly
        if (user) {
          const supabaseOrders = await getSupabaseOrdersByUser(user.id || user._id, user.email);
          if (supabaseOrders && supabaseOrders.length > 0) {
            remoteOrders = supabaseOrders;
          }
        }

        // 2. Fetch from Backend API if available
        if (token && remoteOrders.length === 0) {
          try {
            const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              const apiOrders = Array.isArray(data) ? data : data.orders || [];
              if (apiOrders.length > 0) {
                remoteOrders = apiOrders;
              }
            }
          } catch (e) {}
        }

        // 3. Fallback to Local Storage
        let localOrders = [];
        try {
          const savedRaw = localStorage.getItem('sumuk_recent_orders');
          if (savedRaw) {
            localOrders = JSON.parse(savedRaw);
          }
        } catch (e) {}

        // Merge & deduplicate orders by id / orderNumber
        const combined = [...remoteOrders];
        localOrders.forEach((loc) => {
          const exists = combined.some(
            (c) =>
              (c.id && (c.id === loc.id || c.id === loc._id)) ||
              (c._id && (c._id === loc.id || c._id === loc._id)) ||
              (c.order_number && (c.order_number === loc.order_number || c.order_number === loc.orderId)) ||
              (c.orderNumber && (c.orderNumber === loc.orderNumber || c.orderNumber === loc.orderId))
          );
          if (!exists) {
            combined.push(loc);
          }
        });

        // Ensure order_items or items array is populated for each order
        const formatted = combined.map((ord) => {
          const rawItems = ord.items || ord.order_items || [];
          return {
            ...ord,
            items: rawItems.map((it) => ({
              id: it.id || it._id,
              name: it.product_name || it.name || 'Sacred Crystal Specimen',
              image: it.product_image || it.image || it.images?.[0] || '',
              price: Number(it.price || it.unitPrice || 699),
              quantity: Number(it.quantity || 1),
              is_reviewed: it.is_reviewed || false,
              selectedEnergization: it.selectedEnergization || false,
            })),
          };
        });

        setOrders(formatted);
      } catch (err) {
        console.warn('Could not fetch remote orders, using local store:', err);
        try {
          const savedRaw = localStorage.getItem('sumuk_recent_orders');
          if (savedRaw) setOrders(JSON.parse(savedRaw));
        } catch (e) {}
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  const handleCopyAwb = (awb) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');

    try {
      if (token) {
        await fetch(`${API_BASE}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
      }

      if (updateUser) {
        updateUser(profileData);
      }

      setProfileMessage('✨ Your Sanctuary Profile has been preserved.');
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMessage('Profile saved locally.');
      setIsEditingProfile(false);
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMessage(''), 4000);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => (item.id || item._id) !== productId);
    setWishlist(updated);
    localStorage.setItem('sumuk_wishlist', JSON.stringify(updated));
  };

  const handleMoveToCart = (item) => {
    addItem({
      ...item,
      quantity: 1,
      selectedEnergization: true,
      energizedPrice: item.energizedPrice || 100,
    });
    handleRemoveFromWishlist(item.id || item._id);
    openDrawer();
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    let updated;
    if (editingAddressIndex !== null) {
      updated = [...addresses];
      updated[editingAddressIndex] = addressForm;
    } else {
      updated = [...addresses, addressForm];
    }
    setAddresses(updated);
    setShowAddressModal(false);
    setEditingAddressIndex(null);
    setAddressForm({
      label: 'Sacred Sanctuary',
      name: '',
      phone: '',
      address: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '',
      isDefault: false,
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#140C1D] text-[#FAF8F5] flex flex-col selection:bg-amber-400 selection:text-black">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Luxury Top Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1A1226] via-[#150E20] to-[#1C122B] border border-[#D4AF37]/30 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/40 flex items-center justify-center shadow-md">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#E5C378]" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-[10px] font-mono font-bold text-[#E5C378] uppercase tracking-widest mb-1">
                  <span>Verified Patron Account</span>
                </div>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {user ? user.name || 'Crystal Patron' : 'Patron Account'}
                </h1>
                <p className="text-xs text-stone-400 font-mono mt-0.5">
                  {user ? user.email : 'Sign in to access your orders, invoices, and saved addresses.'}
                </p>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/40 text-stone-300 hover:text-red-300 text-xs font-mono transition flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-110 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Not Logged In Prompt */}
        {!user && (
          <div className="my-12 text-center py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#E5C378]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-editorial text-2xl font-bold text-white">Patron Account Portal</h2>
              <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
                Sign in to review your orders, track courier dispatches, access official invoices, and update your delivery addresses.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-7 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Authenticated Dashboard Content */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1 space-y-2">
              {/* Mobile Horizontal Pill Bar / Desktop Vertical Menu */}
              <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-2 space-y-1 shadow-lg flex lg:flex-col overflow-x-auto no-scrollbar gap-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-amber-500/15 text-[#E5C378] border border-[#D4AF37]/40'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Orders &amp; Tracking</span>
                  </div>
                  {orders.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-[#E5C378] text-[10px]">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-amber-500/15 text-[#E5C378] border border-[#D4AF37]/40'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Profile Details</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500 hidden lg:block" />
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeTab === 'wishlist'
                      ? 'bg-amber-500/15 text-[#E5C378] border border-[#D4AF37]/40'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-amber-500/15 text-[#E5C378] border border-[#D4AF37]/40'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Saved Addresses</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500 hidden lg:block" />
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeTab === 'notifications'
                      ? 'bg-amber-500/15 text-[#E5C378] border border-[#D4AF37]/40'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500 hidden lg:block" />
                </button>
              </div>
            </aside>

            {/* Main Content Pane */}
            <div className="lg:col-span-3 space-y-6">
              {/* ============================================================== */}
              {/* TAB 1: ORDERS & TRACKING                                        */}
              {/* ============================================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        Your Consecrated Orders
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Track live courier progress, download tax invoices, and view attunement certificates.
                      </p>
                    </div>

                    <Link
                      href="/shop"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 hover:text-white transition"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {loadingOrders ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-8 h-8 mx-auto border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono text-neutral-400">Loading your sacred vault records...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-16 text-center rounded-3xl bg-[#0e0a19] border border-white/10 p-8 space-y-4">
                      <Package className="w-12 h-12 text-neutral-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-serif text-lg font-bold text-white">No Orders Yet</p>
                        <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto">
                          You have not placed any orders yet. Discover our rare crystals and personalized energization rituals.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="btn-pill-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                      >
                        <ShoppingBag className="w-4 h-4 text-black" />
                        <span>Visit Sacred Store</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order, idx) => {
                        const orderNum = order.orderNumber || order.order_number || order.razorpayOrderId || `ORD-${(order._id || order.id || idx).toString().slice(-6)}`;
                        const orderDate = new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        });
                        const items = order.items || [];
                        const status = order.status || 'paid';
                        const awbNumber = order.awbNumber || order.shipping?.awb_code || order.shipping_address?.awb;

                        // Timeline Step Calculation
                        const steps = [
                          { label: 'Order Confirmed', completed: true },
                          { label: 'Vedic Consecration', completed: ['consecrated', 'shipped', 'delivered'].includes(status) },
                          { label: 'Velvet Packaging', completed: ['shipped', 'delivered'].includes(status) },
                          { label: 'In Transit', completed: ['shipped', 'delivered'].includes(status) },
                          { label: 'Delivered', completed: status === 'delivered' },
                        ];

                        return (
                          <div
                            key={order._id || order.id || idx}
                            className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl transition hover:border-amber-500/40"
                          >
                            {/* Card Header */}
                            <div className="p-5 sm:p-6 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                                    {orderNum}
                                  </span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                    status === 'delivered'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                      : status === 'shipped'
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 font-mono">
                                  Placed on {orderDate} &bull; Total: <span className="text-amber-300 font-bold">₹{Number(order.total || 699).toLocaleString('en-IN')}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                  onClick={() => {
                                    setSelectedInvoiceOrder(order);
                                    setIsInvoiceOpen(true);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Invoice &amp; Certificate</span>
                                </button>
                              </div>
                            </div>

                            {/* Tracking Timeline Bar */}
                            <div className="p-5 sm:p-6 bg-[#090712] border-b border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                                  <Truck className="w-4 h-4 text-cyan-400" />
                                  <span>Courier Logistics (Shiprocket Verified)</span>
                                </div>
                                {awbNumber && (
                                  <div className="flex items-center gap-2 text-[11px] font-mono">
                                    <span className="text-neutral-400">AWB:</span>
                                    <span className="text-cyan-300 font-bold">{awbNumber}</span>
                                    <button
                                      onClick={() => handleCopyAwb(awbNumber)}
                                      className="p-1 text-neutral-400 hover:text-white"
                                      title="Copy AWB Tracking Code"
                                    >
                                      {copiedAwb === awbNumber ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Progress Stepper */}
                              <div className="grid grid-cols-5 gap-2 text-center">
                                {steps.map((step, sIdx) => (
                                  <div key={sIdx} className="space-y-1.5">
                                    <div className={`h-1.5 rounded-full ${
                                      step.completed ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-white/10'
                                    }`} />
                                    <p className={`text-[10px] font-mono leading-tight ${
                                      step.completed ? 'text-amber-300 font-bold' : 'text-neutral-500'
                                    }`}>
                                      {step.label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Itemized List */}
                            <div className="p-5 sm:p-6 space-y-4">
                              <div className="divide-y divide-white/5">
                                {items.map((item, itIdx) => (
                                  <div key={itIdx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative flex-shrink-0">
                                        {item.image || item.images?.[0] ? (
                                          <Image
                                            src={item.image || item.images?.[0]}
                                            alt={item.name || 'Crystal'}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                                        )}
                                      </div>

                                      <div>
                                        <h4 className="font-serif text-sm font-bold text-white">
                                          {item.name || 'Masterwork Crystal'}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mt-0.5">
                                          <span>Qty: {item.quantity || 1}</span>
                                          {item.selectedEnergization && (
                                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                                              <Sparkles className="w-2.5 h-2.5" />
                                              Vedic Consecrated
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-right">
                                      <div className="font-mono">
                                        <span className="text-sm font-bold text-amber-300">
                                          ₹{(Number(item.price || 699) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                                        </span>
                                      </div>

                                      {status === 'delivered' && (
                                        item.is_reviewed ? (
                                          <button
                                            disabled
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 cursor-default opacity-80"
                                          >
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                            <span>Reviewed</span>
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => {
                                              setSelectedReviewItem({
                                                id: item.id || item._id || `${order._id || order.id}-${itIdx}`,
                                                product_id: item.productId || item.product_id || item._id,
                                                product_name: item.name || item.product_name || 'Sacred Crystal',
                                                product_image: item.image || item.images?.[0] || item.product_image,
                                                price: item.price || 699,
                                              });
                                              setSelectedReviewOrderId(order._id || order.id);
                                              setIsReviewModalOpen(true);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-gradient-to-r from-amber-400 to-amber-300 text-black hover:brightness-110 active:scale-95 transition shadow-sm"
                                          >
                                            <Star className="w-3 h-3 fill-black" />
                                            <span>Write Review</span>
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: COLLECTOR PROFILE                                        */}
              {/* ============================================================== */}
              {activeTab === 'profile' && (
                <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        Collector Profile &amp; Spiritual Alignment
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Manage your spiritual archetype and personalized ritual preferences.
                      </p>
                    </div>

                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>

                  {profileMessage && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                      {profileMessage}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-neutral-400 font-mono opacity-60 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          Phone Number (for WhatsApp Dispatch)
                        </label>
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          Zodiac Sign / Moon Rashi
                        </label>
                        <select
                          disabled={!isEditingProfile}
                          value={profileData.zodiac}
                          onChange={(e) => setProfileData({ ...profileData, zodiac: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                        >
                          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((z) => (
                            <option key={z} value={z}>{z}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          Primary Spiritual Intention
                        </label>
                        <select
                          disabled={!isEditingProfile}
                          value={profileData.spiritualIntent}
                          onChange={(e) => setProfileData({ ...profileData, spiritualIntent: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Wealth & Abundance">Wealth &amp; Abundance (Kuber &amp; Lakshmi Attunement)</option>
                          <option value="Protection & Evil Eye">Shielding &amp; Evil Eye Removal (Black Tourmaline &amp; Obsidian)</option>
                          <option value="Healing & Peace">Deep Healing &amp; Stress Relief (Amethyst &amp; Clear Quartz)</option>
                          <option value="Love & Relationships">Love, Compassion &amp; Harmony (Rose Quartz)</option>
                          <option value="Spiritual Intuition & Focus">Third Eye Awakening &amp; Clarity (Lapis Lazuli &amp; Sodalite)</option>
                        </select>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex items-center gap-3 justify-end pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-xs font-mono text-neutral-400 hover:text-white transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="btn-pill-primary px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <Save className="w-4 h-4 text-black" />
                          <span>{savingProfile ? 'Preserving...' : 'Save Sanctuary Profile'}</span>
                        </button>
                      </div>
                    )}

                    {!isEditingProfile && (
                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-mono text-neutral-300 font-bold">Session &amp; Security</p>
                          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            Signed in as {user.email}. Disconnecting will preserve your sacred order vault securely.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            router.push('/');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Sign Out of Sanctuary</span>
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: SACRED WISHLIST                                          */}
              {/* ============================================================== */}
              {activeTab === 'wishlist' && (
                <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-5">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Sacred Wishlist
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Specimens saved for future consecration and personal meditation.
                    </p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-serif text-lg font-bold text-white">Your Wishlist is Empty</p>
                        <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto">
                          Tap the heart icon on any crystal specimen in our catalog to save it here.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="btn-pill-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                      >
                        <span>Explore Specimen Vault</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id || item._id}
                          className="p-4 rounded-2xl bg-[#090712] border border-white/10 flex items-center gap-4 group"
                        >
                          <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden flex-shrink-0">
                            {item.images?.[0] ? (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">💎</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-serif text-sm font-bold text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-amber-300 font-mono font-bold">
                              ₹{(item.price || 699).toLocaleString('en-IN')}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleMoveToCart(item)}
                                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold transition flex items-center gap-1"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Move to Cart</span>
                              </button>
                              <button
                                onClick={() => handleRemoveFromWishlist(item.id || item._id)}
                                className="px-2 py-1 rounded-lg text-neutral-400 hover:text-red-400 text-[10px] font-mono transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: SAVED SANCTUARIES (ADDRESSES)                            */}
              {/* ============================================================== */}
              {activeTab === 'addresses' && (
                <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        Saved Sanctuaries &amp; Addresses
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Manage delivery addresses for seamless checkout and insured courier dispatch.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingAddressIndex(null);
                        setAddressForm({
                          label: 'Home Sanctuary',
                          name: user.name || '',
                          phone: user.phone || '',
                          address: '',
                          city: 'Bengaluru',
                          state: 'Karnataka',
                          pincode: '',
                          isDefault: addresses.length === 0,
                        });
                        setShowAddressModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
                    >
                      <span>+ Add New Address</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="py-12 text-center text-neutral-400 font-mono text-xs space-y-2">
                      <MapPin className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p>No saved addresses yet. Add your address for faster 1-click checkout.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-[#090712] border border-white/10 space-y-2 relative"
                        >
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-mono font-bold uppercase">
                              Primary Sanctuary
                            </span>
                          )}
                          <h4 className="font-serif text-sm font-bold text-white">{addr.label || 'Delivery Address'}</h4>
                          <p className="text-xs font-mono text-neutral-300 font-bold">{addr.name} &bull; {addr.phone}</p>
                          <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                            {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Address Modal */}
                  {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="bg-[#0e0a19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
                        <h3 className="font-serif text-xl font-bold text-white">Add Delivery Sanctuary</h3>
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                          <input
                            type="text"
                            placeholder="Address Label (e.g. Home, Office, Meditation Studio)"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Recipient Name"
                              value={addressForm.name}
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              required
                              className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                            />
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              required
                              className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Street Address / House / Apartment"
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              required
                              className="px-3 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              required
                              className="px-3 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                            />
                            <input
                              type="text"
                              placeholder="PIN Code"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              required
                              maxLength={6}
                              className="px-3 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:border-amber-400"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                              type="button"
                              onClick={() => setShowAddressModal(false)}
                              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-mono text-neutral-400"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn-pill-primary px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider"
                            >
                              Save Address
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: NOTIFICATIONS & VEDIC PREFERENCES                        */}
              {/* ============================================================== */}
              {activeTab === 'notifications' && (
                <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-5">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Sacred Notifications &amp; Alerts
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Configure instant WhatsApp dispatch notifications and Vedic astrology newsletters.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090712] border border-white/10">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white">WhatsApp Shipment &amp; Live AWB Tracking</h4>
                        <p className="text-xs font-mono text-neutral-400">
                          Receive real-time courier updates on WhatsApp when your consecrated crystal is dispatched.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappShipment}
                        onChange={(e) => setNotifications({ ...notifications, whatsappShipment: e.target.checked })}
                        className="w-5 h-5 accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090712] border border-white/10">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white">Email Tax Invoices &amp; Authenticity Certificates</h4>
                        <p className="text-xs font-mono text-neutral-400">
                          Automatic PDF delivery of official gemological certificates upon order fulfillment.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailInvoice}
                        onChange={(e) => setNotifications({ ...notifications, emailInvoice: e.target.checked })}
                        className="w-5 h-5 accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090712] border border-white/10">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white">Astrological Transit &amp; Gem Recommendations</h4>
                        <p className="text-xs font-mono text-neutral-400">
                          Weekly celestial energy insights curated by Founder Soumyaa Naveen for your Moon Rashi.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailAstrology}
                        onChange={(e) => setNotifications({ ...notifications, emailAstrology: e.target.checked })}
                        className="w-5 h-5 accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Official Luxury Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <LuxuryInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoiceOrder(null);
          }}
        />
      )}

      {/* Verified Product Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReviewItem(null);
          setSelectedReviewOrderId(null);
        }}
        productItem={selectedReviewItem}
        orderId={selectedReviewOrderId}
        userId={user?.id || user?._id}
        onReviewSuccess={(orderItemId, reviewData) => {
          setOrders((prev) =>
            prev.map((ord) => {
              if ((ord.id === selectedReviewOrderId) || (ord._id === selectedReviewOrderId)) {
                return {
                  ...ord,
                  items: (ord.items || []).map((it) =>
                    (it.id === orderItemId || it._id === orderItemId || `${ord._id || ord.id}`.includes(orderItemId))
                      ? { ...it, is_reviewed: true }
                      : it
                  ),
                };
              }
              return ord;
            })
          );
        }}
      />
    </div>
  );
}
