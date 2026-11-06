'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import LuxuryInvoiceModal from '@/components/LuxuryInvoiceModal';
import ProductReviewModal from '@/components/ProductReviewModal';
import { useAuthStore } from '@/store/useAuth';
import { useCartStore } from '@/store/useCart';
import { getSupabaseOrdersByUser, getSupabaseOrderTracking, subscribeToOrderTracking, STAGE_CONFIGS } from '@/lib/supabase';
import {
  LayoutGrid,
  ShoppingBag,
  Truck,
  Heart,
  MapPin,
  User,
  ShieldCheck,
  HelpCircle,
  Lock,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  ChevronRight,
  Check,
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  Star,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Printer,
  KeyRound,
  Shield,
  Smartphone,
  Compass,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');
  const orderIdParam = searchParams?.get('orderId');

  const { user, token, isAuthenticated, logout, openAuthModal, updateUser } = useAuthStore();
  const { addItem, openDrawer } = useCartStore();

  const [mounted, setMounted] = useState(false);
  
  // 8 Recommended Dashboard Tabs:
  // 'overview' | 'orders' | 'tracking' | 'wishlist' | 'addresses' | 'profile' | 'security' | 'support'
  const [activeTab, setActiveTab] = useState(tabParam || (orderIdParam ? 'tracking' : 'overview'));

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(null);

  // Active tracking order selection
  const [activeTrackingIndex, setActiveTrackingIndex] = useState(0);
  const [orderTrackingEvents, setOrderTrackingEvents] = useState([]);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Review Modal State
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [selectedReviewOrderId, setSelectedReviewOrderId] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.fullName || 'Swayam A H',
    email: user?.email || 'swayamh16@gmail.com',
    phone: user?.phone || '+91 91117 16355',
    dob: user?.dob || '2000-08-15',
    zodiac: user?.zodiac || 'Leo',
    spiritualIntent: user?.spiritualIntent || 'Wealth & Abundance',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState('');

  // Wishlist State (persisted in localStorage with fallback specimens)
  const [wishlist, setWishlist] = useState([
    {
      id: 'wish-1',
      productId: 'pyrite-abundance-cluster',
      name: 'High-Density Golden Pyrite Specimen',
      subtitle: 'Natural Fool’s Gold Manifestation Cluster',
      category: 'Wealth & Commercial Fortune',
      price: 1899,
      originalPrice: 2499,
      image: '/images/products/pyrite.jpg',
      inStock: true,
      consecrated: true,
    },
    {
      id: 'wish-2',
      productId: 'amethyst-cathedral-geode',
      name: 'Uruguayan Deep Violet Amethyst Geode',
      subtitle: '432Hz Sound-Cleansed Meditation Geode',
      category: 'Intuition & Inner Peace',
      price: 3499,
      originalPrice: 4299,
      image: '/images/products/amethyst.jpg',
      inStock: true,
      consecrated: true,
    },
    {
      id: 'wish-3',
      productId: 'tigers-eye-consecrated-bracelet',
      name: 'AAA Golden Tiger’s Eye Talisman Bracelet',
      subtitle: '10mm Micro-Polished Solar Plexus Beads',
      category: 'Courage & Energetic Shielding',
      price: 899,
      originalPrice: 1299,
      image: '/images/products/pendant.jpg',
      inStock: true,
      consecrated: true,
    },
  ]);

  // Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Primary Sanctuary',
      name: 'Swayam A H',
      phone: '+91 91117 16355',
      address: 'Villa 14, Lotus Serenity, Sus Gaon',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411021',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Studio & Office',
      name: 'Swayam A H',
      phone: '+91 91117 16355',
      address: 'Suite 402, High-Street Sanctum, Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      isDefault: false,
    },
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Primary Sanctuary',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [securityToast, setSecurityToast] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows PC (Chrome 124)',
      location: 'Pune, Maharashtra, India',
      ip: '103.211.***.***',
      activeNow: true,
      lastActive: 'Active Now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro (Safari)',
      location: 'Mumbai, Maharashtra, India',
      ip: '49.36.***.***',
      activeNow: false,
      lastActive: 'Yesterday, 8:42 PM',
    },
  ]);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch or populate orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        let remoteOrders = [];

        // 1. Fetch from Supabase
        if (user) {
          const supabaseOrders = await getSupabaseOrdersByUser(user.id || user._id, user.email);
          if (supabaseOrders && supabaseOrders.length > 0) {
            remoteOrders = supabaseOrders;
          }
        }

        // 2. Fetch from Backend API
        if (token && remoteOrders.length === 0) {
          try {
            const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                remoteOrders = data;
              }
            }
          } catch (e) {}
        }

        // 3. Fallback / Default Demo Orders
        if (remoteOrders.length === 0) {
          remoteOrders = [
            {
              id: 'ord-live-1',
              order_number: 'ORD-100284',
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
              status: 'in_transit',
              awb_number: 'BLUEDART-889210459',
              courier: 'Blue Dart Express',
              estimated_delivery: 'Tomorrow by 4:00 PM',
              total_amount: 3499,
              order_items: [
                {
                  product_name: 'Uruguayan Deep Violet Amethyst Geode',
                  quantity: 1,
                  price: 3499,
                  product_image: '/images/products/amethyst.jpg',
                  bead_size: 'Cathedral Cut (1.2 kg)',
                  selected_energization: true,
                },
              ],
            },
            {
              id: 'ord-live-2',
              order_number: 'ORD-100192',
              created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
              status: 'delivered',
              awb_number: 'SHIPR-449102831',
              courier: 'Shiprocket Air Express',
              estimated_delivery: 'Delivered safely',
              total_amount: 2798,
              order_items: [
                {
                  product_name: 'High-Density Golden Pyrite Specimen',
                  quantity: 1,
                  price: 1899,
                  product_image: '/images/products/pyrite.jpg',
                  bead_size: 'Natural Cluster (350g)',
                  selected_energization: true,
                },
                {
                  product_name: 'AAA Golden Tiger’s Eye Talisman Bracelet',
                  quantity: 1,
                  price: 899,
                  product_image: '/images/products/pendant.jpg',
                  bead_size: '10mm Regular Elastic',
                  selected_energization: true,
                },
              ],
            },
          ];
        }

        const formatted = remoteOrders.map((ord, idx) => ({
          ...ord,
          _id: ord.id || ord._id || `ORD-${idx + 1}`,
          id: ord.id || ord._id || ord.order_number,
          orderNumber: ord.order_number || ord.orderNumber || `SC5-2026-${String(idx + 1).padStart(6, '0')}`,
          createdAt: ord.created_at || ord.createdAt || new Date().toISOString(),
          status: ord.order_status || ord.status || 'confirmed',
          paymentStatus: ord.payment_status || (ord.status === 'paid' ? 'verified' : 'verified'),
          paymentMethod: ord.payment_method || 'Razorpay',
          currentStage: ord.current_stage || 'order_confirmed',
          awbNumber: ord.tracking_number || ord.awb_code || ord.awb_number || ord.awbNumber || null,
          courier: ord.delivery_partner_name || ord.carrier || ord.courier || null,
          trackingUrl: ord.tracking_url || null,
          estimatedDelivery: ord.estimated_delivery_text || (ord.estimated_delivery_at ? new Date(ord.estimated_delivery_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null),
          shippingFee: Number(ord.shipping_fee ?? ord.shipping_charge ?? 0),
          subtotal: Number(ord.subtotal || ord.total_amount || 0),
          total: Number(ord.total_amount || ord.total || 0),
          items: (ord.order_items || ord.items || []).map((it) => ({
            ...it,
            productId: it.product_id || it.productId || it.product_sku || '',
            product_id: it.product_id || it.productId || it.product_sku || '',
            name: it.product_name || it.name || 'Consecrated Crystal Specimen',
            quantity: it.quantity || 1,
            price: Number(it.price || it.unit_price || 1899),
            image: it.product_image || it.image || '/images/products/pyrite.jpg',
            beadSize: it.bead_size || it.beadSize || 'Natural Specimen',
            selectedEnergization: it.selected_energization ?? true,
          })),
        }));

        setOrders(formatted);

        // If orderIdParam was in URL, select that index
        if (orderIdParam) {
          const targetIdx = formatted.findIndex(
            (o) => o.orderNumber === orderIdParam || o.id === orderIdParam || o._id === orderIdParam
          );
          if (targetIdx !== -1) {
            setActiveTrackingIndex(targetIdx);
          }
        }
      } catch (err) {
        console.warn('Order loading note:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token, user, orderIdParam]);

  // Live tracking milestones loader & Realtime subscription
  useEffect(() => {
    const activeOrder = orders[activeTrackingIndex] || orders[0];
    if (!activeOrder) return;

    let isMounted = true;
    setLoadingTracking(true);

    const loadTracking = async () => {
      try {
        const events = await getSupabaseOrderTracking(activeOrder.id || activeOrder.orderNumber);
        if (isMounted && events && events.length > 0) {
          setOrderTrackingEvents(events);
        }
      } catch (e) {
        console.warn('Notice loading order tracking milestones:', e.message);
      } finally {
        if (isMounted) setLoadingTracking(false);
      }
    };

    loadTracking();

    const unsubscribe = subscribeToOrderTracking(activeOrder.id || activeOrder.orderNumber, () => {
      loadTracking();
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [activeTrackingIndex, orders]);

  const handleCopyAwb = (awb) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileToast('');

    setTimeout(() => {
      setSavingProfile(false);
      setIsEditingProfile(false);
      setProfileToast('Personal details updated and saved.');
      setTimeout(() => setProfileToast(''), 3000);
    }, 600);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setSecurityToast('');
    if (!currentPassword || !newPassword) {
      setSecurityToast('Please fill all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setSecurityToast('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSecurityToast('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSecurityToast('Account password updated successfully.');
      setTimeout(() => setSecurityToast(''), 3000);
    }, 700);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.address || !addressForm.city || !addressForm.pincode) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: addressForm.label || 'Sanctuary',
      name: addressForm.name || profileData.name,
      phone: addressForm.phone || profileData.phone,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state || 'Maharashtra',
      pincode: addressForm.pincode,
      isDefault: addressForm.isDefault,
    };

    let updated = [...addresses];
    if (newAddr.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated.push(newAddr);
    setAddresses(updated);
    setShowAddressModal(false);
    setAddressForm({
      label: 'Sanctuary',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleMoveWishlistToCart = (item) => {
    addItem({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      variantLabel: 'Consecrated Specimen',
      quantity: 1,
    });
    openDrawer();
  };

  const handleRemoveWishlist = (id) => {
    setWishlist(wishlist.filter((w) => w.id !== id));
  };

  const handleRevokeOtherSessions = () => {
    setSessions(sessions.filter((s) => s.activeNow));
    setSecurityToast('All secondary sessions have been revoked.');
    setTimeout(() => setSecurityToast(''), 3000);
  };

  if (!mounted) return null;

  const displayName = profileData.name || 'Swayam A H';
  const displayEmail = profileData.email || 'swayamh16@gmail.com';
  const currentTrackingOrder = orders[activeTrackingIndex] || orders[0] || null;

  // Navigation tab definitions
  const DASHBOARD_TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, count: null },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
    { id: 'tracking', label: 'Order Tracking', icon: Truck, livePulse: true },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: addresses.length },
    { id: 'profile', label: 'Personal Details', icon: User, count: null },
    { id: 'security', label: 'Account Security', icon: ShieldCheck, count: null },
    { id: 'support', label: 'Support', icon: HelpCircle, count: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#29242D] flex flex-col selection:bg-[#EAE2F2] selection:text-[#79539B] font-sans relative overflow-x-hidden">
      
      {/* Soft Ambient Ethereal Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#EAE2F2]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#C8A65E]/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-8">
        
        {/* ══════════════════════════════════════════════════════════
            TOP PATRON PROFILE HEADER BANNER
           ══════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-[0_12px_40px_rgba(41,36,45,0.04)] p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Avatar & Identity Details */}
          <div className="flex items-center gap-4 sm:gap-5 z-10">
            {/* Soft Rounded Lavender Avatar Square */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EAE2F2] border-2 border-[#D8CBE4] flex items-center justify-center text-[#79539B] shadow-inner flex-shrink-0">
              <User className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-0.5">
              {/* Verified Patron Account Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE2F2] border border-[#D8CBE4] text-[11px] font-sans font-semibold text-[#79539B] shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Verified Patron Sanctum</span>
              </div>

              {/* User Full Name */}
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#29242D] tracking-tight uppercase">
                {displayName}
              </h1>

              {/* User Email & Spiritual Intention */}
              <p className="text-xs sm:text-sm text-[#29242D]/70 font-sans flex flex-wrap items-center gap-2">
                <span>{displayEmail}</span>
                <span>•</span>
                <span className="text-[#C8A65E] font-medium">{profileData.spiritualIntent} ({profileData.zodiac})</span>
              </p>
            </div>
          </div>

          {/* Right Action: Sign Out & Status */}
          <div className="flex items-center gap-3 z-10 self-end md:self-center">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="px-4 py-2 rounded-full bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-[#29242D]/70 hover:text-rose-600 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span>Sign In to Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            8-TAB DASHBOARD NAVIGATION PILLS
           ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EAE2F2]">
          {DASHBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-[#79539B] text-white shadow-md shadow-[#79539B]/20'
                    : 'bg-white hover:bg-[#EAE2F2] text-[#29242D]/80 border border-[#EAE2F2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#EAE2F2] text-[#79539B]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.livePulse && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════
            TAB 1: OVERVIEW SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Orders */}
              <div
                onClick={() => setActiveTab('orders')}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm hover:shadow-md hover:border-[#79539B]/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans text-[#29242D]/60 font-medium">Total Orders</span>
                  <div className="text-2xl font-sans font-bold tabular-nums text-[#29242D]">
                    {orders.length}
                  </div>
                  <span className="text-[11px] text-[#79539B] font-semibold group-hover:underline flex items-center gap-1">
                    <span>View all orders</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAE2F2] text-[#79539B] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: In-Transit Packages */}
              <div
                onClick={() => setActiveTab('tracking')}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm hover:shadow-md hover:border-[#79539B]/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans text-[#29242D]/60 font-medium">In Transit</span>
                  <div className="text-2xl font-sans font-bold tabular-nums text-[#29242D]">
                    {orders.filter((o) => o.status === 'in_transit' || o.status === 'processing').length || 1}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Tracking</span>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Saved Wishlist */}
              <div
                onClick={() => setActiveTab('wishlist')}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm hover:shadow-md hover:border-[#79539B]/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans text-[#29242D]/60 font-medium">Saved Specimens</span>
                  <div className="text-2xl font-sans font-bold tabular-nums text-[#29242D]">
                    {wishlist.length}
                  </div>
                  <span className="text-[11px] text-[#79539B] font-semibold group-hover:underline flex items-center gap-1">
                    <span>Manage wishlist</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAE2F2] text-rose-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
              </div>

              {/* Card 4: Sanctuary Addresses */}
              <div
                onClick={() => setActiveTab('addresses')}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm hover:shadow-md hover:border-[#79539B]/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans text-[#29242D]/60 font-medium">Sanctuary Addresses</span>
                  <div className="text-2xl font-sans font-bold tabular-nums text-[#29242D]">
                    {addresses.length}
                  </div>
                  <span className="text-[11px] text-[#79539B] font-semibold group-hover:underline flex items-center gap-1">
                    <span>Manage sanctuaries</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAE2F2] text-[#C8A65E] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Spotlight Card: Latest In-Transit Shipment */}
            {currentTrackingOrder && (
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2F2]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#EAE2F2] text-[#79539B]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C8A65E]">
                        ACTIVE SHIPMENT SPOTLIGHT
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#29242D]">
                        Order #{currentTrackingOrder.orderNumber}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{currentTrackingOrder.estimatedDelivery}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tracking')}
                      className="px-4 py-2 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Track Full Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#F8F6F2] border border-[#EAE2F2] flex-shrink-0">
                      <Image
                        src={currentTrackingOrder.items?.[0]?.image || '/images/products/amethyst.jpg'}
                        alt="Specimen thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#29242D]">
                        {currentTrackingOrder.items?.[0]?.name}
                      </h4>
                      <p className="text-xs text-[#29242D]/60 mt-0.5">
                        Courier: {currentTrackingOrder.courier} • AWB: {currentTrackingOrder.awbNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right self-start sm:self-auto">
                    <span className="text-xs text-[#29242D]/50 block">Amount Paid</span>
                    <span className="text-lg font-sans font-bold tabular-nums text-[#29242D]">
                      ₹{currentTrackingOrder.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Sanctuary Actions & Astrological Harmony Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Astrological Crystal Guidance */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EAE2F2] text-[#C8A65E]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#29242D]">
                      Consecrated Guidance & Attunement
                    </h3>
                    <p className="text-xs text-[#29242D]/60">
                      Tailored for your sun sign: <strong className="text-[#29242D]">{profileData.zodiac}</strong>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#29242D]/75 leading-relaxed">
                  Your current sanctuary intention is focused on <strong className="text-[#79539B]">{profileData.spiritualIntent}</strong>. Soumyaa Naveen recommends placing Golden Pyrite in the North-East corner of your study and wearing an Amethyst band during meditation.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/shop"
                    className="px-4 py-2 rounded-full bg-[#EAE2F2] hover:bg-[#79539B] hover:text-white text-[#79539B] text-xs font-semibold transition-colors shadow-xs"
                  >
                    Explore Attuned Collection
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className="text-xs text-[#29242D]/70 hover:text-[#79539B] font-semibold underline"
                  >
                    Consult Soumyaa Naveen
                  </button>
                </div>
              </div>

              {/* Box 2: Quick Collection Actions */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EAE2F2] text-[#79539B]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#29242D]">
                      Sanctuary Shortcuts
                    </h3>
                    <p className="text-xs text-[#29242D]/60">
                      Quick navigation across your patron portal
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="p-3 rounded-2xl bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#29242D] block">Past Invoices</span>
                    <span className="text-[10px] text-[#29242D]/60">Download official receipts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('tracking')}
                    className="p-3 rounded-2xl bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#29242D] block">Live Tracking</span>
                    <span className="text-[10px] text-[#29242D]/60">Courier milestones</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className="p-3 rounded-2xl bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#29242D] block">Account Key</span>
                    <span className="text-[10px] text-[#29242D]/60">Password & 2FA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className="p-3 rounded-2xl bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#29242D] block">Sanctuary Line</span>
                    <span className="text-[10px] text-[#29242D]/60">WhatsApp Founder</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: MY ORDERS SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  My Consecrated Orders
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  View past crystal acquisitions, download official tax invoices, and request re-consecration.
                </p>
              </div>

              <span className="text-xs font-semibold text-[#79539B] bg-[#EAE2F2] px-3 py-1 rounded-full border border-[#EAE2F2]">
                {orders.length} Specimens Ordered
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/80 border border-[#EAE2F2] space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#29242D]/30 mx-auto" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#29242D]">No orders recorded</h3>
                  <p className="text-xs text-[#29242D]/60 mt-1">
                    Your collection sanctuary is currently empty. Explore authentic consecrated crystals in our shop.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#79539B]/20 transition-all"
                >
                  <span>Explore Masterworks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord, idx) => (
                  <div
                    key={ord._id || idx}
                    className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-4 hover:border-[#79539B]/40 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2F2]/60 pb-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#29242D]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-xs text-[#29242D]/50 font-sans">
                            • {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#29242D]/60 font-sans block">
                          Insured Delivery via {ord.courier}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-[#EAE2F2] text-[#79539B] border border-[#EAE2F2]'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>

                        <span className="font-sans font-bold text-base tabular-nums text-[#29242D] pl-2">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {ord.items.map((it, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#F8F6F2] border border-[#EAE2F2] flex-shrink-0">
                              <Image
                                src={it.image}
                                alt={it.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#29242D]">
                                {it.name}
                              </h4>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-[#EAE2F2] border border-[#79539B]/30 text-[10px] font-mono font-bold text-[#79539B]">
                                  ID: {it.productId || it.product_id || (it.name?.toLowerCase().includes('mala') ? 'MA001' : (it.name?.toLowerCase().includes('decor') || it.name?.toLowerCase().includes('geode') ? 'HO001' : 'BR001'))}
                                </span>
                                <span className="text-xs text-[#29242D]/60">
                                  {it.beadSize} • Qty: {it.quantity}
                                </span>
                              </div>
                              {it.selectedEnergization && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#C8A65E] font-medium pt-0.5">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Consecrated with 432Hz Sound</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-sans font-semibold text-sm tabular-nums text-[#29242D]">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-3 border-t border-[#EAE2F2]/60 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTrackingIndex(idx);
                            setActiveTab('tracking');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#EAE2F2] hover:bg-[#79539B] hover:text-white text-[#79539B] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Package</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoiceOrder(ord);
                            setIsInvoiceOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-[#29242D] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#29242D]/60" />
                          <span>Download Tax Invoice</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReviewItem(ord.items[0]);
                            setSelectedReviewOrderId(ord._id);
                            setIsReviewModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F8F6F2] border border-[#EAE2F2] text-[#29242D] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 text-[#C8A65E]" />
                          <span>Write Review</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            addItem({
                              id: ord.items[0].productId || ord.items[0].id || 'crystal',
                              name: ord.items[0].name,
                              price: ord.items[0].price,
                              image: ord.items[0].image,
                              variantLabel: ord.items[0].beadSize,
                              quantity: 1,
                            });
                            openDrawer();
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3: ORDER TRACKING SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Live Consecrated Order Tracking
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Track insured transit milestones from Pune hub directly to your door.
                </p>
              </div>

              {/* Order selector dropdown if multiple orders exist */}
              {orders.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#29242D]/60">Select Order:</span>
                  <select
                    value={activeTrackingIndex}
                    onChange={(e) => setActiveTrackingIndex(Number(e.target.value))}
                    className="bg-white border border-[#EAE2F2] rounded-full px-3 py-1.5 text-xs text-[#29242D] font-semibold focus:outline-none focus:border-[#79539B]"
                  >
                    {orders.map((o, i) => (
                      <option key={i} value={i}>
                        #{o.orderNumber} ({o.items?.[0]?.name?.slice(0, 20)}...)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {currentTrackingOrder && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm space-y-8">
                
                {/* Tracking Meta Box */}
                {currentTrackingOrder.courier || currentTrackingOrder.awbNumber ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F6F2] border border-[#EAE2F2]">
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C8A65E]">
                        PACKAGE TRACKING &amp; COURIER ALLOCATION
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-base sm:text-lg text-[#29242D] tabular-nums">
                          {currentTrackingOrder.awbNumber || 'Allocated'}
                        </span>
                        {currentTrackingOrder.awbNumber && (
                          <button
                            type="button"
                            onClick={() => handleCopyAwb(currentTrackingOrder.awbNumber)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE2F2] hover:bg-[#EAE2F2] text-[#79539B] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy AWB number"
                          >
                            {copiedAwb === currentTrackingOrder.awbNumber ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                        {currentTrackingOrder.trackingUrl && (
                          <a
                            href={currentTrackingOrder.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-[#79539B]/10 hover:bg-[#79539B]/20 text-[#79539B] text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <span>Live Courier Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-[#29242D]/60">
                        Carrier Partner: <strong>{currentTrackingOrder.courier || 'Assigned Courier'}</strong>
                      </p>
                    </div>

                    <div className="space-y-1 md:text-right">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-700">
                        ESTIMATED ARRIVAL
                      </span>
                      <div className="font-serif font-bold text-lg text-[#29242D]">
                        {currentTrackingOrder.estimatedDelivery || 'To be updated upon dispatch'}
                      </div>
                      <span className="text-xs text-[#79539B] font-semibold flex items-center md:justify-end gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Sound-Consecration Verified</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900">
                    <Truck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm text-[#29242D] mb-0.5">
                        Courier Partner Allocation
                      </span>
                      <p className="text-[11px] leading-relaxed text-[#29242D]/75">
                        Delivery partner allocation and tracking details will be available once your order is processed and dispatched.
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual Progress Stepper (6 Milestones) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#29242D]">
                      Journey Milestones
                    </h3>
                    {loadingTracking && (
                      <span className="text-xs text-[#79539B] animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Syncing live milestones...</span>
                      </span>
                    )}
                  </div>

                  <div className="relative pl-6 sm:pl-8 border-l-2 border-[#EAE2F2] space-y-8 ml-3">
                    {(orderTrackingEvents.length > 0 ? orderTrackingEvents : STAGE_CONFIGS.map((cfg) => ({
                      milestone_key: cfg.key,
                      stage_number: cfg.stageNumber,
                      title: cfg.title,
                      description: cfg.description,
                      location: cfg.location,
                      status: cfg.key === 'order_confirmed' ? 'completed' : 'pending',
                      completed_at: cfg.key === 'order_confirmed' ? currentTrackingOrder.createdAt : null,
                    }))).map((milestone, mIdx) => {
                      const isCompleted = milestone.status === 'completed';
                      const isInProgress = milestone.status === 'in_progress';
                      const isPending = !isCompleted && !isInProgress;

                      return (
                        <div key={mIdx} className={`relative transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
                          {/* Dot / Icon */}
                          <div className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isInProgress
                              ? 'bg-[#79539B] text-white ring-4 ring-[#EAE2F2] animate-pulse'
                              : 'bg-[#EAE2F2] border border-[#D8CBE4] text-[#29242D]/40'
                          }`}>
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isInProgress ? (
                              <Truck className="w-3.5 h-3.5" />
                            ) : (
                              <span className="text-[10px] font-bold">{milestone.stage_number || mIdx + 1}</span>
                            )}
                          </div>

                          {/* Details */}
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className={`font-semibold text-xs ${
                                isInProgress ? 'text-[#79539B]' : 'text-[#29242D]'
                              }`}>
                                {milestone.title}
                              </h4>
                              {isCompleted && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                                  Completed
                                </span>
                              )}
                              {isInProgress && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                                  <span>In Progress</span>
                                </span>
                              )}
                              {isPending && (
                                <span className="px-2 py-0.5 rounded-full bg-[#F8F6F2] text-[#29242D]/40 text-[10px] font-bold uppercase tracking-wider">
                                  Pending
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#29242D]/70 mt-1 leading-relaxed">
                              {milestone.description}
                            </p>

                            {/* Meta & Remarks */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-[#29242D]/50 font-mono">
                              {milestone.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#C8A65E]" />
                                  <span>{milestone.location}</span>
                                </span>
                              )}
                              {milestone.completed_at && (
                                <span>
                                  • {new Date(milestone.completed_at).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                              {milestone.milestone_key === 'vault_packaging' && currentTrackingOrder.courier && (
                                <span className="text-[#79539B] font-semibold">
                                  • Allocated Partner: {currentTrackingOrder.courier}
                                </span>
                              )}
                              {milestone.milestone_key === 'in_transit' && currentTrackingOrder.awbNumber && (
                                <span className="text-[#79539B] font-semibold">
                                  • AWB: {currentTrackingOrder.awbNumber}
                                </span>
                              )}
                            </div>

                            {milestone.admin_remarks && (
                              <div className="mt-2 p-2.5 rounded-xl bg-[#F8F6F2] border border-[#EAE2F2] text-[11px] text-[#29242D]/80 italic">
                                <strong className="not-italic text-[#79539B] font-sans font-bold">Sanctuary Update: </strong>
                                {milestone.admin_remarks}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compulsory Unboxing Video Notice Box */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block">
                      Mandatory Return Policy: 360° Unboxing Video
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                      Due to the delicate geological nature of natural crystal specimens, claims for transit damage or missing items require an uncut, continuous 360-degree video recording starting from the sealed outer package to inner unboxing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4: WISHLIST SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Sacred Wishlist
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Saved specimens and consecrated minerals chosen for future acquisition.
                </p>
              </div>

              <span className="text-xs font-semibold text-[#79539B] bg-[#EAE2F2] px-3 py-1 rounded-full border border-[#EAE2F2]">
                {wishlist.length} Items Saved
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/80 border border-[#EAE2F2] space-y-4">
                <Heart className="w-12 h-12 text-[#29242D]/30 mx-auto" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#29242D]">Your wishlist is clear</h3>
                  <p className="text-xs text-[#29242D]/60 mt-1">
                    Browse our gemstone cathedral geodes, crystal malas, and intention trees to save favorites.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all"
                >
                  <span>Browse Collections</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm hover:shadow-lg hover:border-[#79539B]/40 transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Image Container with Remove Button */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F6F2]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-md backdrop-blur-md transition-all cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EAE2F2] text-[#79539B] text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-md border border-[#EAE2F2]">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-1.5">
                        <h4 className="font-serif font-bold text-base text-[#29242D] group-hover:text-[#79539B] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#29242D]/60 font-sans line-clamp-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Price & Add to Bag CTA */}
                    <div className="p-5 pt-0 border-t border-[#EAE2F2]/60 mt-3 flex items-center justify-between">
                      <div>
                        <span className="font-sans font-bold text-lg tabular-nums text-[#29242D]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-[#29242D]/40 font-sans tabular-nums line-through ml-2">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMoveWishlistToCart(item)}
                        className="px-4 py-2 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 5: ADDRESSES SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Sanctuary Addresses
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Manage delivery sanctuaries for swift, insured dispatch of your consecrated crystals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sanctuary</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-6 rounded-3xl bg-white/90 backdrop-blur-md border ${
                    addr.isDefault ? 'border-[#79539B]/60 shadow-md' : 'border-[#EAE2F2] shadow-sm'
                  } space-y-4 flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#79539B]" />
                        <h4 className="font-serif font-bold text-base text-[#29242D]">
                          {addr.label}
                        </h4>
                      </div>

                      {addr.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EAE2F2] text-[#79539B] text-[10px] font-sans font-bold uppercase tracking-wider">
                          Primary Sanctuary
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#29242D]/80 space-y-1 font-sans">
                      <p className="font-semibold text-[#29242D]">{addr.name}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} - <strong className="text-[#29242D]">{addr.pincode}</strong></p>
                      <p className="text-[#29242D]/60 pt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAE2F2]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[#C8A65E] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified PIN Hub</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-[#EAE2F2]">
                  <div className="flex items-center justify-between border-b border-[#EAE2F2] pb-3">
                    <h3 className="font-serif font-bold text-xl text-[#29242D]">
                      Add New Sanctuary Address
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="text-[#29242D]/50 hover:text-[#29242D]"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#29242D]">Sanctuary Label (e.g. Home, Office, Villa)</label>
                      <input
                        type="text"
                        required
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                        placeholder="Home Sanctuary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-[#29242D]">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                          placeholder="Swayam A H"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-[#29242D]">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                          placeholder="+91 91117 16355"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#29242D]">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                        placeholder="Flat / Villa, Street, Landmark"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-[#29242D]">City</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                          placeholder="Pune"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-[#29242D]">State</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-[#29242D]">Pincode</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full rounded-xl border border-[#EAE2F2] p-2.5 text-xs focus:border-[#79539B] focus:outline-none"
                          placeholder="411021"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="accent-[#79539B]"
                      />
                      <label htmlFor="isDefault" className="text-xs text-[#29242D]">Set as Primary Sanctuary Address</label>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAE2F2]">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2 rounded-full border border-[#EAE2F2] text-xs font-semibold text-[#29242D]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold shadow-sm"
                      >
                        Save Sanctuary
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 6: PERSONAL DETAILS SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Personal Details & Spiritual Identity
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Update your contact details and astrological indicators for bespoke crystal recommendations.
                </p>
              </div>

              {profileToast && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {profileToast}
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Email Address (Verified)
                    </label>
                    <input
                      type="email"
                      required
                      value={profileData.email}
                      disabled
                      className="w-full bg-stone-100 border border-[#EAE2F2] rounded-full px-4 py-3 text-xs text-[#29242D]/60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone & Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Contact Phone (+91)
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Date of Birth (Planetary Attunement)
                    </label>
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Spiritual Intention & Zodiac Sun Sign */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Primary Spiritual Intention
                    </label>
                    <select
                      value={profileData.spiritualIntent}
                      onChange={(e) => setProfileData({ ...profileData, spiritualIntent: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    >
                      <option value="Wealth & Abundance">Wealth & Commercial Abundance</option>
                      <option value="Peace & Inner Stillness">Peace & Emotional Stillness</option>
                      <option value="Shielding & Deep Grounding">Shielding & Deep Grounding</option>
                      <option value="Heart & Auric Harmony">Heart & Auric Harmony</option>
                      <option value="Spiritual Intuition">Spiritual Intuition & Third Eye</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">
                      Zodiac Sun Sign
                    </label>
                    <select
                      value={profileData.zodiac}
                      onChange={(e) => setProfileData({ ...profileData, zodiac: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    >
                      <option value="Aries">Aries (Mesha)</option>
                      <option value="Taurus">Taurus (Vrishabha)</option>
                      <option value="Gemini">Gemini (Mithuna)</option>
                      <option value="Cancer">Cancer (Karka)</option>
                      <option value="Leo">Leo (Simha)</option>
                      <option value="Virgo">Virgo (Kanya)</option>
                      <option value="Libra">Libra (Tula)</option>
                      <option value="Scorpio">Scorpio (Vrishchika)</option>
                      <option value="Sagittarius">Sagittarius (Dhanu)</option>
                      <option value="Capricorn">Capricorn (Makara)</option>
                      <option value="Aquarius">Aquarius (Kumbha)</option>
                      <option value="Pisces">Pisces (Meena)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE2F2] flex items-center justify-between">
                  <span className="text-[11px] text-[#29242D]/50">
                    Encrypted &bull; Handled according to Vedic consecration privacy standards
                  </span>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#79539B]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 7: ACCOUNT SECURITY SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'security' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Account Security & Access Keys
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Protect your patron account, manage confidential passwords, and audit active sessions.
                </p>
              </div>

              {securityToast && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {securityToast}
                </span>
              )}
            </div>

            {/* Change Password Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EAE2F2] text-[#79539B]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#29242D]">
                    Change Sanctuary Password
                  </h3>
                  <p className="text-xs text-[#29242D]/60">
                    Ensure your account is protected with a secure password of 6+ characters.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29242D]/80 pl-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full bg-[#F8F6F2] border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full px-4 py-3 text-xs text-[#29242D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-2.5 rounded-full bg-[#79539B] hover:bg-[#684587] text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#79539B]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* 2FA Toggle Box */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#29242D]">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-xs text-[#29242D]/60 mt-0.5">
                    Requires SMS or email authentication verification for high-value crystal orders.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  twoFactorEnabled ? 'bg-[#79539B]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Active Sessions Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE2F2]/60 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#79539B]" />
                  <h3 className="font-serif font-bold text-base text-[#29242D]">
                    Active Login Sessions
                  </h3>
                </div>

                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRevokeOtherSessions}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Revoke Other Sessions
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#EAE2F2] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#29242D]">{s.device}</span>
                        {s.activeNow && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#29242D]/60 mt-0.5">
                        {s.location} • IP: {s.ip}
                      </p>
                    </div>

                    <span className="text-[11px] font-medium text-[#29242D]/50 font-mono">
                      {s.lastActive}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 8: SUPPORT & CONCIERGE SECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'support' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2F2]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#29242D]">
                  Sanctuary Concierge & Founder Support
                </h2>
                <p className="text-xs text-[#29242D]/60 mt-0.5">
                  Direct personal communication with Founder Soumyaa Naveen and the curation team.
                </p>
              </div>

              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sanctuary Line Open</span>
              </span>
            </div>

            {/* 3 Contact Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Channel 1: WhatsApp Founder */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#29242D]">
                    WhatsApp Founder Routing
                  </h3>
                  <p className="text-xs text-[#29242D]/70 font-sans leading-relaxed">
                    Fastest personal response for crystal attunement queries, bespoke curation, and order assistance.
                  </p>
                  <p className="text-sm font-bold text-emerald-800 font-mono pt-1">
                    +91 91117 16355
                  </p>
                </div>

                <a
                  href="https://wa.me/919111716355?text=Hello%20Soumyaa%2C%20I%20am%20inquirying%20from%20my%20customer%20dashboard%20regarding%20my%20crystal%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Channel 2: Telephone Line */}
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAE2F2] text-[#79539B] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#29242D]">
                    Telephone Sanctuary Line
                  </h3>
                  <p className="text-xs text-[#29242D]/70 font-sans leading-relaxed">
                    Speak directly with our studio curators during sanctuary operating hours (9:00 AM &ndash; 9:00 PM IST).
                  </p>
                  <p className="text-sm font-bold text-[#79539B] font-mono pt-1">
                    +91 91117 16355
                  </p>
                </div>

                <a
                  href="tel:+919111716355"
                  className="w-full py-2.5 rounded-full bg-[#EAE2F2] hover:bg-[#79539B] hover:text-white text-[#79539B] font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Call Sanctuary</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Channel 3: Official Inquiries */}
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAE2F2] shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF5E6] text-[#C8A65E] border border-[#C8A65E]/30 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#29242D]">
                    Official Email Desk
                  </h3>
                  <p className="text-xs text-[#29242D]/70 font-sans leading-relaxed">
                    For corporate gifting, consecrated altar commissions, and bespoke interior installations.
                  </p>
                  <p className="text-xs font-bold text-[#29242D] font-mono pt-1 truncate">
                    sumukcrystalz@gmail.com
                  </p>
                </div>

                <a
                  href="mailto:sumukcrystalz@gmail.com"
                  className="w-full py-2.5 rounded-full bg-[#F8F6F2] hover:bg-[#EAE2F2] border border-[#EAE2F2] text-[#29242D] font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Compose Email</span>
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE2F2] shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-[#EAE2F2] pb-3">
                <HelpCircle className="w-5 h-5 text-[#79539B]" />
                <h3 className="font-serif font-bold text-lg text-[#29242D]">
                  Frequently Addressed Sanctuary Questions
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How are crystals cleansed & energized before dispatch?',
                    a: 'Every natural mineral, bracelet, and geode is cleansed using traditional sound vibrations (432Hz Tibetan Singing Bowls) and consecrated in our Pune sanctuary by Usui Reiki Master Soumyaa Naveen before being sealed.',
                  },
                  {
                    q: 'What is the mandatory 360-degree unboxing video requirement?',
                    a: 'Due to the fragile geological nature of natural crystal specimens, all damage or discrepancy claims must include a continuous, uncut 360-degree unboxing video recorded from the sealed outer box label to specimen removal.',
                  },
                  {
                    q: 'How long does express insured shipping take?',
                    a: 'Orders are dispatched within 24–48 hours from our Pune hub. Transit takes 2–4 business days via Blue Dart or Shiprocket express courier across India.',
                  },
                  {
                    q: 'How do I care for and re-energize my crystals at home?',
                    a: 'Place your crystals under gentle morning sunlight or full moonlight for 2–3 hours. You may also rest them on raw Selenite plates or smudge them with sacred incense.',
                  },
                ].map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-[#EAE2F2] bg-[#F8F6F2]/60 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full p-4 text-left font-serif font-bold text-sm text-[#29242D] flex items-center justify-between gap-4 cursor-pointer hover:text-[#79539B] transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#79539B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs text-[#29242D]/75 font-sans leading-relaxed border-t border-[#EAE2F2]/60">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Luxury Invoice Modal */}
      {isInvoiceOpen && selectedInvoiceOrder && (
        <LuxuryInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoiceOrder(null);
          }}
          order={selectedInvoiceOrder}
        />
      )}

      {/* Product Review Modal */}
      {isReviewModalOpen && selectedReviewItem && (
        <ProductReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedReviewItem(null);
            setSelectedReviewOrderId(null);
          }}
          item={selectedReviewItem}
          orderId={selectedReviewOrderId}
        />
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center text-[#79539B] font-sans">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#79539B] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase">Loading Sanctuary Portal...</span>
          </div>
        </div>
      }
    >
      <AccountPageContent />
    </React.Suspense>
  );
}
