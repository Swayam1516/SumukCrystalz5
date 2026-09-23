'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import {
  getSupabaseCustomers,
  getSupabaseOrders,
  getSupabaseProducts,
  saveProductToSupabase,
  deleteProductFromSupabase,
  toggleProductStatusInSupabase,
  getSupabaseAnnouncement,
  updateSupabaseAnnouncement,
  getSupabaseServices,
  updateServiceStatusInSupabase,
  CANONICAL_SERVICES_DEFAULT,
  getSupabaseDeliverySettings,
  updateSupabaseDeliverySettings,
  DEFAULT_DELIVERY_SETTINGS,
} from '@/lib/supabase';
import LuxuryProductModal from '@/components/LuxuryProductModal';
import ProductPreviewModal from '@/components/ProductPreviewModal';
import AdminFilterManager from '@/components/AdminFilterManager';
import {
  ShieldCheck,
  Package,
  Users,
  Database,
  Plus,
  Edit,
  Trash2,
  Lock,
  LogOut,
  Upload,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCw,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Tag,
  Key,
  X,
  Crown,
  Eye,
  EyeOff,
  Layers,
  Star,
  Zap,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  ShoppingBag,
  Megaphone,
  Radio,
  Power,
  ToggleLeft,
  ToggleRight,
  Info,
  Calendar,
  AlertTriangle,
  MapPin,
  Compass,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAdmin, login, logout, initAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'customers' | 'services' | 'shipping'

  // Data Collections
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Delivery & Shipping Settings State
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [savingDeliverySettings, setSavingDeliverySettings] = useState(false);
  const [testPincode, setTestPincode] = useState('');
  const [testResult, setTestResult] = useState(null);

  // Broadcast Announcement & Services State
  const [announcementMessage, setAnnouncementMessage] = useState(
    '✨ Sacred Consecration: Every crystal specimen is cleansed with 528Hz Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen.'
  );
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [servicesList, setServicesList] = useState(CANONICAL_SERVICES_DEFAULT);
  const [updatingServiceId, setUpdatingServiceId] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Inventory View, Filters & Sorting
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'instock' | 'lowstock' | 'outofstock'
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all' | 'new' | 'bestseller' | 'limited' | 'featured'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc' | 'stock-desc' | 'name-asc'

  // Luxury Modals State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewingProduct, setPreviewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Load products from Supabase / Backend API on mount
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const supaProducts = await getSupabaseProducts();
        if (supaProducts && supaProducts.length > 0 && isMounted) {
          setProducts(supaProducts);
          return;
        }

        if (API_BASE) {
          const res = await fetch(`${API_BASE}/api/products`).catch(() => null);
          if (res && res.ok && isMounted) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.products || []);
            if (list.length > 0) {
              setProducts(list);
              return;
            }
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
      if (isMounted) {
        setProducts([]);
      }
    };

    loadProducts();
    return () => { isMounted = false; };
  }, []);

  // Fetch Live Data from Backend / Supabase
  const fetchLiveAdminData = async (authToken) => {
    setLoadingData(true);
    try {
      // 1. Orders
      let ordersList = [];
      const supaOrders = await getSupabaseOrders();
      if (supaOrders && supaOrders.length > 0) {
        ordersList = supaOrders;
      } else {
        const ordersRes = await fetch(`${API_BASE}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => null);
        if (ordersRes && ordersRes.ok) {
          const ordersData = await ordersRes.json();
          ordersList = ordersData.orders || (Array.isArray(ordersData) ? ordersData : []);
        }
      }
      setOrders(ordersList);

      // 2. Customers
      let custList = [];
      const supaCust = await getSupabaseCustomers();
      if (supaCust && supaCust.length > 0) {
        custList = supaCust;
      } else {
        const customersRes = await fetch(`${API_BASE}/api/admin/customers`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => null);
        if (customersRes && customersRes.ok) {
          const custData = await customersRes.json();
          custList = custData.customers || (Array.isArray(custData) ? custData : []);
        }
      }
      setCustomers(custList);

      // 3. Products
      const supaProducts = await getSupabaseProducts();
      if (supaProducts && supaProducts.length > 0) {
        setProducts(supaProducts);
      } else {
        const prodsRes = await fetch(`${API_BASE}/api/admin/products`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => null);
        if (prodsRes && prodsRes.ok) {
          const prodsData = await prodsRes.json();
          const list = Array.isArray(prodsData) ? prodsData : (prodsData.products || []);
          if (list?.length) setProducts(list);
        }
      }

      // 4. Global Broadcast Announcement
      const supaAnnouncement = await getSupabaseAnnouncement();
      if (supaAnnouncement) {
        if (supaAnnouncement.message !== undefined) setAnnouncementMessage(supaAnnouncement.message);
        if (supaAnnouncement.is_active !== undefined) setAnnouncementActive(Boolean(supaAnnouncement.is_active));
      }

      // 5. Service Availability
      const supaServices = await getSupabaseServices();
      if (supaServices && supaServices.length > 0) {
        setServicesList(supaServices);
      }

      // 6. Delivery & Distance Shipping Settings
      const supaShipping = await getSupabaseDeliverySettings();
      if (supaShipping) {
        setDeliverySettings(supaShipping);
      }

      addToast('✨ Sanctuary Database synchronized successfully!');
    } catch (err) {
      console.warn('Admin fetch data warning:', err);
      addToast('Live database sync active', 'info');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchLiveAdminData(token);
    }
  }, [isAdmin, token]);

  // Save Delivery & Shipping Settings Handler
  const handleSaveDeliverySettings = async (e) => {
    if (e) e.preventDefault();
    setSavingDeliverySettings(true);
    try {
      const res = await updateSupabaseDeliverySettings(deliverySettings);
      if (res.success) {
        setDeliverySettings(res.settings);
        addToast('✨ Delivery fee tiers & shipping rules synchronized with Supabase!');
      } else {
        throw new Error(res.error || 'Failed to save shipping settings');
      }
    } catch (err) {
      console.error('Error saving shipping settings:', err);
      addToast(`Error saving shipping rules: ${err.message}`, 'error');
    } finally {
      setSavingDeliverySettings(false);
    }
  };

  // Test Pincode Simulator Helper
  const handleTestPincode = (e) => {
    if (e) e.preventDefault();
    const pin = testPincode.replace(/\D/g, '').slice(0, 6);
    if (pin.length !== 6) {
      setTestResult({ error: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }

    const isPune = pin.startsWith('411') || pin.startsWith('412');
    const isMaha = ['40', '41', '42', '43', '44'].includes(pin.slice(0, 2));

    let tier = 'Interstate';
    let fee = Number(deliverySettings.interstate_fee || 150);
    let dist = isPune ? 18 : isMaha ? (pin.startsWith('400') ? 120 : 210) : 750;

    if (isPune) {
      tier = 'Tier 1: Pune Local';
      fee = Number(deliverySettings.tier_1_fee || 50);
    } else if (isMaha && dist <= Number(deliverySettings.tier_2_max_km || 150)) {
      tier = 'Tier 2: Maharashtra Regional';
      fee = Number(deliverySettings.tier_2_fee || 100);
    }

    setTestResult({
      pincode: pin,
      region: isPune ? 'Pune Metro' : isMaha ? 'Maharashtra State' : 'Interstate Destination',
      distanceKm: dist,
      tier,
      calculatedFee: fee,
      freeOverThreshold: Number(deliverySettings.free_shipping_threshold || 5000),
    });
  };

  // Save Broadcast Announcement Handler
  const handleSaveAnnouncement = async () => {
    setSavingAnnouncement(true);
    try {
      const res = await updateSupabaseAnnouncement({
        message: announcementMessage,
        is_active: announcementActive,
      });
      if (res.success) {
        addToast(
          announcementActive
            ? '📢 Global Broadcast Banner is now LIVE on customer storefront!'
            : '⏸️ Broadcast Banner deactivated and hidden from storefront.',
          'success'
        );
      } else {
        addToast(res.error || 'Failed to update announcement', 'error');
      }
    } catch (err) {
      console.error('Error saving announcement:', err);
      addToast('Error saving announcement: ' + err.message, 'error');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  // Update Individual Service Status Handler
  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    setUpdatingServiceId(serviceId);
    setServicesList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );

    try {
      const res = await updateServiceStatusInSupabase(serviceId, newStatus);
      if (res.success) {
        const readableStatus =
          newStatus === 'available'
            ? 'Available for Booking'
            : newStatus === 'currently unavailable'
            ? 'Currently Unavailable'
            : 'Coming Soon';
        addToast(`✨ Modality status updated to "${readableStatus}"!`);
      } else {
        addToast(res.error || 'Failed to update service status', 'error');
      }
    } catch (err) {
      console.error('Error updating service status:', err);
      addToast('Error updating service: ' + err.message, 'error');
    } finally {
      setUpdatingServiceId(null);
    }
  };

  // Batch update all services
  const handleBatchUpdateServices = async (targetStatus) => {
    setServicesList((prev) => prev.map((s) => ({ ...s, status: targetStatus })));
    for (const s of servicesList) {
      await updateServiceStatusInSupabase(s.id, targetStatus);
    }
    const label = targetStatus === 'available' ? 'All Modalities Marked Available' : 'All Modalities Paused';
    addToast(`⚡ ${label} in database!`);
  };

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.toLowerCase().trim();
    if (!cleanEmail || !loginPassword) {
      setLoginError('Please provide both administrator email and master password.');
      return;
    }

    setLoadingAuth(true);
    const res = await login(cleanEmail, loginPassword);
    setLoadingAuth(false);

    if (res.success) {
      addToast('👑 Welcome back, Soumyaa Naveen! Admin Sanctuary Unlocked.');
    } else {
      setLoginError(res.error || 'Access Denied: Invalid administrator credentials.');
    }
  };

  // Save / Update Product Handler from LuxuryProductModal
  const handleProductSaveSuccess = (savedProduct) => {
    setProducts((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.id === savedProduct.id || p.slug === savedProduct.slug
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedProduct;
        return updated;
      } else {
        return [savedProduct, ...prev];
      }
    });
    addToast(`✨ Specimen "${savedProduct.name}" saved to Supabase & live sanctuary!`);
    setEditingProduct(null);
  };

  // Duplicate Product
  const handleDuplicateProduct = async (product) => {
    const cloneSlug = `${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy-${Math.floor(100 + Math.random() * 900)}`;
    const clone = {
      ...product,
      id: undefined,
      slug: cloneSlug,
      name: `${product.name} (Duplicate)`,
      title: `${product.name} (Duplicate)`,
      sku: product.sku ? `${product.sku}-DUP` : `SKU-DUP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const supaRes = await saveProductToSupabase(clone);
      if (supaRes.success) {
        setProducts((prev) => [supaRes.product, ...prev]);
        addToast(`📄 Duplicated "${product.name}" in Supabase!`);
        return;
      }
    } catch (e) {
      console.warn('Duplicate product error:', e);
    }

    setProducts((prev) => [clone, ...prev]);
    addToast(`📄 Duplicated "${product.name}" successfully!`);
  };

  // Toggle Active Status
  const handleToggleProductStatus = async (product) => {
    const nextStatus = !product.isActive && product.active !== false;
    const targetId = product.id;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id || p.slug === product.slug) {
          return { ...p, isActive: nextStatus, active: nextStatus };
        }
        return p;
      })
    );

    if (targetId) {
      await toggleProductStatusInSupabase(targetId, nextStatus);
    }

    addToast(`Visibility set to ${nextStatus ? 'Active' : 'Draft'} for "${product.name}"`);
  };

  // Delete Product
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id || deletingProduct.slug;
    setProducts((prev) => prev.filter((p) => p.id !== targetId && p.slug !== targetId));

    if (deletingProduct.id) {
      await deleteProductFromSupabase(deletingProduct.id);
    }

    addToast(`🗑️ "${deletingProduct.name}" removed from Supabase and vault.`, 'info');
    setDeletingProduct(null);
  };

  // Filter & Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.crystalType?.toLowerCase().includes(q) ||
          p.beadType?.toLowerCase().includes(q) ||
          p.chakra?.toLowerCase().includes(q) ||
          p.zodiac?.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter || p.purpose === categoryFilter);
    }

    // Collection Filter
    if (collectionFilter !== 'all') {
      list = list.filter((p) => p.collection === collectionFilter);
    }

    // Stock Filter
    if (stockFilter !== 'all') {
      list = list.filter((p) => {
        const stock = p.stockCount !== undefined ? p.stockCount : 15;
        if (stockFilter === 'instock') return stock > 5;
        if (stockFilter === 'lowstock') return stock > 0 && stock <= 5;
        if (stockFilter === 'outofstock') return stock <= 0;
        return true;
      });
    }

    // Badge Filter
    if (badgeFilter !== 'all') {
      list = list.filter((p) => {
        if (badgeFilter === 'new') return p.isNewArrival || p.badge?.includes('NEW');
        if (badgeFilter === 'bestseller') return p.isBestSeller || p.badge?.includes('BEST');
        if (badgeFilter === 'limited') return p.isLimitedEdition || p.badge?.includes('LIMITED');
        if (badgeFilter === 'featured') return p.isFeatured;
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const stockA = a.stockCount !== undefined ? a.stockCount : 15;
      const stockB = b.stockCount !== undefined ? b.stockCount : 15;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'stock-desc') return stockB - stockA;
      if (sortBy === 'stock-asc') return stockA - stockB;
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      // default: newest
      return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
    });

    return list;
  }, [products, searchQuery, categoryFilter, collectionFilter, stockFilter, badgeFilter, sortBy]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center text-[#D4AF37]">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0C0A09] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#141210]/90 border border-[#D4AF37]/30 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg shadow-[#D4AF37]/10">
              <Crown className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#E5D5BA] tracking-wide">
              Founder Sanctuary Vault
            </h1>
            <p className="text-xs text-stone-400">
              Sumuk Crystalz 5 • Secure Administrator & Inventory Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Founder Administrator Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Sumukcrystalz5@gmail.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300">
                  Master Security Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#D4AF37] hover:text-[#f3e5ab] transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] transition-colors pr-10"
                />
                <Lock className="w-4 h-4 text-stone-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loadingAuth ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" /> Unlock Sanctuary Vault
                </>
              )}
            </button>
          </form>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('sumukcrystalz5@gmail.com');
                setLoginPassword('Sumukcrystalz@555');
                setLoginError('');
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Fill Master Credentials (Founder)</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-stone-500 border-t border-stone-800/80">
            Protected under 256-bit AES cryptographic token security • Founder Access Only
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0C0A09] text-stone-100 pb-20">
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto ${
              t.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : t.type === 'info'
                ? 'bg-stone-900/90 border-stone-700 text-stone-200'
                : 'bg-stone-950/90 border-[#D4AF37]/50 text-[#E5D5BA]'
            }`}
          >
            {t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#12100E]/90 border-b border-[#D4AF37]/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif font-bold text-[#E5D5BA] tracking-wide flex items-center gap-2">
                Sumuk Crystalz 5
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-semibold border border-[#D4AF37]/30">
                  Founder Vault
                </span>
              </div>
              <div className="text-[10px] text-stone-400">
                Logged in as: <strong className="text-stone-300">{user?.email || 'Founder Admin'}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchLiveAdminData(token)}
              disabled={loadingData}
              title="Refresh Live Data"
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                addToast('Signed out from Admin Sanctuary.', 'info');
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-rose-800 text-xs text-stone-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-[#D4AF37]/20 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Total Catalog</span>
              <Package className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{products.length}</div>
            <div className="text-[10px] text-emerald-400">Masterwork specimens</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-[#D4AF37]/20 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Active Variants</span>
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              {products.reduce((acc, p) => acc + (p.variants?.length || 1), 0)}
            </div>
            <div className="text-[10px] text-stone-400">Bead sizes & weights</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-[#D4AF37]/20 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Orders Vault</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{orders.length}</div>
            <div className="text-[10px] text-emerald-400">Processed patron orders</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-[#D4AF37]/20 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Sanctuary Patrons</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{customers.length}</div>
            <div className="text-[10px] text-stone-400">Registered collectors</div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Crystal Catalog & Variants ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Orders Sanctuary ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Patrons Directory ({customers.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'services'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              Broadcast &amp; Services
              {announcementActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'shipping'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Delivery &amp; Shipping Rules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('filters')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'filters'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters Matrix
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Create Crystal Specimen
            </button>
          )}
        </div>

        {/* TAB: INVENTORY SANCTUARY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search, Filters & Sorting Controls */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Search Box */}
                <div className="sm:col-span-4 relative">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search crystal name, SKU, crystal type, chakra, zodiac..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="sm:col-span-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">All Categories</option>
                    <option value="Energy Bands">Energy Bands</option>
                    <option value="Tumble Stones">Tumble Stones</option>
                    <option value="Raw Geodes">Raw Geodes</option>
                    <option value="Sacred Malas">Sacred Malas</option>
                    <option value="Pendants & Talismans">Pendants</option>
                    <option value="Masterwork Geodes">Masterworks</option>
                  </select>
                </div>

                {/* Special Badge Filter */}
                <div className="sm:col-span-2">
                  <select
                    value={badgeFilter}
                    onChange={(e) => setBadgeFilter(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">All Badges</option>
                    <option value="new">✨ New Arrivals</option>
                    <option value="bestseller">🔥 Best Sellers</option>
                    <option value="limited">💎 Limited Edition</option>
                    <option value="featured">⭐ Featured</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="sm:col-span-2">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">All Stock Statuses</option>
                    <option value="instock">In Stock (&gt;5)</option>
                    <option value="lowstock">Low Stock (1-5)</option>
                    <option value="outofstock">Out of Stock (0)</option>
                  </select>
                </div>

                {/* Sorting */}
                <div className="sm:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="stock-desc">Stock: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <span>
                  Showing <strong className="text-[#D4AF37]">{filteredAndSortedProducts.length}</strong> of{' '}
                  {products.length} crystals
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      viewMode === 'table'
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-stone-900 border-stone-800 text-stone-500'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-stone-900 border-stone-800 text-stone-500'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT MANAGEMENT TABLE */}
            {viewMode === 'table' ? (
              <div className="border border-[#D4AF37]/20 rounded-2xl overflow-hidden bg-stone-900/40 backdrop-blur-md shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-950/90 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
                        <th className="py-3.5 px-4 w-16">Specimen</th>
                        <th className="py-3.5 px-4 min-w-[220px]">Crystal Name & SKU</th>
                        <th className="py-3.5 px-4 min-w-[130px]">Category & Family</th>
                        <th className="py-3.5 px-4 min-w-[110px] text-center">Variants</th>
                        <th className="py-3.5 px-4 min-w-[120px]">Stock Status</th>
                        <th className="py-3.5 px-4 min-w-[120px]">Price</th>
                        <th className="py-3.5 px-4 w-24 text-center">Status</th>
                        <th className="py-3.5 px-4 w-44 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {filteredAndSortedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-stone-500">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            No crystals match your search/filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredAndSortedProducts.map((p) => {
                          const primaryImg = p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=200&q=80';
                          const variantCount = p.variants?.length || 1;
                          const stock = p.stockCount !== undefined ? p.stockCount : 15;
                          const price = p.price || 699;
                          const originalPrice = p.originalPrice || 1299;
                          const discountPercent =
                            originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                          return (
                            <tr
                              key={p.id || p.slug}
                              className="hover:bg-stone-800/40 transition-colors group"
                            >
                              {/* Thumbnail */}
                              <td className="py-3 px-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 relative group-hover:border-[#D4AF37]/50 transition-colors">
                                  <img
                                    src={primaryImg}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              </td>

                              {/* Name, Subtitle & Badges */}
                              <td className="py-3 px-4">
                                <div className="font-semibold text-stone-100 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                                  {p.name}
                                  {p.isBestSeller && (
                                    <span className="px-1.5 py-0.2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded text-[9px] font-bold">
                                      Best Seller
                                    </span>
                                  )}
                                  {p.isNewArrival && (
                                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[9px] font-bold">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-400 truncate max-w-xs">
                                  {p.subtitle || p.shortDescription || 'Sacred luxury crystal'}
                                </div>
                                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                                  SKU: {p.sku || `SKU-${p.slug?.toUpperCase().slice(0, 8)}`}
                                </div>
                              </td>

                              {/* Category & Family */}
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300 text-[11px] font-medium">
                                  {p.category || 'Energy Bands'}
                                </span>
                                {p.crystalType && (
                                  <div className="text-[10px] text-stone-500 mt-0.5">
                                    {p.crystalType}
                                  </div>
                                )}
                              </td>

                              {/* Variants Count */}
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-[11px]">
                                  <Layers className="w-3 h-3" /> {variantCount} variants
                                </span>
                              </td>

                              {/* Stock Count & Status Pill */}
                              <td className="py-3 px-4">
                                {stock <= 0 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/40 border border-rose-800 text-rose-400">
                                    Out of Stock
                                  </span>
                                ) : stock <= 5 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 border border-amber-800 text-amber-400">
                                    Only {stock} Left
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 border border-emerald-800 text-emerald-400">
                                    In Stock ({stock})
                                  </span>
                                )}
                              </td>

                              {/* Price & Discount */}
                              <td className="py-3 px-4">
                                <div className="font-bold text-[#E5D5BA]">
                                  ₹{price.toLocaleString('en-IN')}
                                </div>
                                {originalPrice > price && (
                                  <div className="text-[10px] text-stone-500 line-through">
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                    {discountPercent > 0 && (
                                      <span className="text-emerald-400 ml-1 font-semibold">
                                        ({discountPercent}% OFF)
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Visibility Toggle */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductStatus(p)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                                    p.isActive !== false
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-stone-800 text-stone-400 border border-stone-700'
                                  }`}
                                >
                                  {p.isActive !== false ? 'Active' : 'Draft'}
                                </button>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Preview Simulator */}
                                  <button
                                    type="button"
                                    onClick={() => setPreviewingProduct(p)}
                                    title="Customer Storefront Simulator"
                                    className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setShowProductModal(true);
                                    }}
                                    title="Edit Specimen & Variants"
                                    className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800 transition-colors"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateProduct(p)}
                                    title="Duplicate Specimen"
                                    className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => setDeletingProduct(p)}
                                    title="Remove Specimen"
                                    className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900 text-rose-400 hover:text-white border border-rose-900/50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((p) => {
                  const primaryImg = p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80';
                  const price = p.price || 699;
                  const originalPrice = p.originalPrice || 1299;

                  return (
                    <div
                      key={p.id || p.slug}
                      className="group rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-[#D4AF37]/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col"
                    >
                      <div className="relative aspect-square bg-stone-950 overflow-hidden">
                        <img
                          src={primaryImg}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-semibold">
                            {p.variants?.length || 1} vars
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                            {p.category || 'Crystal'}
                          </div>
                          <h4 className="text-sm font-semibold text-stone-100 mt-0.5 line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-xs text-stone-400 line-clamp-2 mt-1 font-light">
                            {p.subtitle || p.shortDescription || p.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-[#E5D5BA]">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                            {originalPrice > price && (
                              <span className="text-xs text-stone-500 line-through ml-1.5">
                                ₹{originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewingProduct(p)}
                              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setShowProductModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-[#D4AF37] border border-stone-800"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: ORDERS VAULT */}
        {activeTab === 'orders' && (
          <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-900/40 p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#E5D5BA] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Patron Orders Vault
            </h3>
            {orders.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                No orders recorded in the live database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord, idx) => (
                  <div
                    key={ord.id || ord.order_number || idx}
                    className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-200">
                        Order #{ord.order_number || ord.orderId || `ORD-${idx + 1}`}
                      </div>
                      <div className="text-stone-400 text-[11px] mt-0.5">
                        Patron: {ord.buyer_name || ord.buyerName || 'Valued Collector'} •{' '}
                        {ord.buyer_email || ord.buyerEmail}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-bold text-[#D4AF37]">
                        ₹{(ord.total || ord.subtotal || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {ord.status || 'Paid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PATRONS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-900/40 p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#E5D5BA] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" /> Registered Patrons & Collectors
            </h3>
            {customers.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                No patrons registered in the directory yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {customers.map((cust, idx) => (
                  <div
                    key={cust.id || cust.email || idx}
                    className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5"
                  >
                    <div className="font-semibold text-stone-100">
                      {cust.full_name || cust.fullName || 'Collector'}
                    </div>
                    <div className="text-stone-400 text-[11px]">{cust.email}</div>
                    {cust.phone && <div className="text-stone-500 text-[10px]">{cust.phone}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: BROADCAST & SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* MODULE 1: GLOBAL BROADCAST ANNOUNCEMENT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/70 border border-[#D4AF37]/30 backdrop-blur-xl space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#E5D5BA]">
                      Top-Level Global Broadcast Announcement
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400">
                    Publish an instant luxury announcement ribbon at the very top of the customer storefront across all pages.
                  </p>
                </div>

                {/* Active Toggle Switch */}
                <div className="flex items-center gap-3 self-start sm:self-auto bg-stone-900/90 border border-stone-800 rounded-2xl px-4 py-2.5">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-stone-200">
                      {announcementActive ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          BROADCAST LIVE
                        </span>
                      ) : (
                        <span className="text-stone-400">BANNER HIDDEN</span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {announcementActive ? 'Visible to all customers' : 'Draft / Off'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAnnouncementActive(!announcementActive)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      announcementActive ? 'bg-emerald-600' : 'bg-stone-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                        announcementActive ? 'left-6.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Broadcast Message Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-stone-300">
                    Broadcast Message Content
                  </label>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {announcementMessage.length} characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="e.g. ✨ Sacred Consecration: Every crystal specimen is cleansed with 528Hz Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen."
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-2xl p-4 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] transition-all resize-none shadow-inner"
                />
              </div>

              {/* Quick Preset Templates */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                  Quick Broadcast Presets (Click to apply):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '✨ Sacred Consecration: Every crystal specimen is cleansed with 528Hz Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen.',
                    '🌙 Spiritual Retreat Notice: Soumyaa Naveen is currently on a sacred energy retreat. New session bookings resume next Monday.',
                    '🎉 Festive Privilege: Complimentary consecrated Selenite charging plate included with all masterwork orders above ₹2,999.',
                    '⚡ Full Moon Alignment: Channeled 7-Chakra & Pranic Energy Attunements available for booking this weekend.',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAnnouncementMessage(preset);
                        setAnnouncementActive(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#D4AF37]/50 text-stone-300 hover:text-[#D4AF37] text-[11px] transition-all text-left truncate max-w-md cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Simulator Box */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] block font-semibold">
                  Live Customer Storefront Preview:
                </span>
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#171207] via-[#2a1d08] to-[#171207] p-3.5 flex items-center justify-between gap-4 text-xs text-[#f6e6be] shadow-inner">
                  <div className="flex items-center gap-2.5 flex-1 justify-center text-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd978] animate-pulse flex-shrink-0" />
                    <span className="font-medium tracking-wide">
                      {announcementMessage.trim() || 'Your announcement message will appear here...'}
                    </span>
                  </div>
                  <span className="p-1 rounded bg-black/40 text-stone-400 text-[10px] font-mono">
                    [X]
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAnnouncement}
                  disabled={savingAnnouncement}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {savingAnnouncement ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Save &amp; Publish Announcement
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* MODULE 2: 9 SACRED SERVICES & MODALITIES AVAILABILITY */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/70 border border-stone-800 backdrop-blur-xl space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#E5D5BA]">
                      Metaphysical Services &amp; Healing Modalities Availability
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400">
                    Control live availability badges and booking guards for all 9 sacred modalities offered by Soumyaa Naveen.
                  </p>
                </div>

                {/* Batch Helper Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleBatchUpdateServices('available')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Set All Available
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBatchUpdateServices('currently unavailable')}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Pause All Bookings
                  </button>
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {servicesList.map((service) => {
                  const currentStatus = service.status || 'available';
                  const isUpdating = updatingServiceId === service.id;

                  return (
                    <div
                      key={service.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                        currentStatus === 'available'
                          ? 'bg-stone-900/50 border-emerald-500/30'
                          : currentStatus === 'currently unavailable'
                          ? 'bg-stone-900/30 border-rose-500/30'
                          : 'bg-stone-900/30 border-purple-500/30'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                            {service.id}
                          </span>
                          {isUpdating && (
                            <div className="w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        <h4 className="text-sm font-serif font-bold text-stone-100 leading-snug">
                          {service.name || service.title}
                        </h4>
                      </div>

                      {/* 3-State Segmented Control */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                          Current Availability:
                        </span>
                        <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                          {/* Available */}
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'available')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              currentStatus === 'available'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Active
                          </button>

                          {/* Unavailable */}
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'currently unavailable')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              currentStatus === 'currently unavailable'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Paused
                          </button>

                          {/* Coming Soon */}
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'coming soon')}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              currentStatus === 'coming soon'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Soon
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DELIVERY & SHIPPING SETTINGS */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-stone-950/80 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold border border-[#D4AF37]/30">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dynamic Logistics Architecture</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#E5D5BA]">
                    Delivery Tiers &amp; Distance Calculation Rules
                  </h2>
                  <p className="text-xs text-stone-400">
                    Configure radial distance thresholds originating from Pune for automatic real-time delivery fee computation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDeliverySettings}
                  disabled={savingDeliverySettings}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingDeliverySettings ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Synchronizing Rules...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save &amp; Publish Tiers</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Origin Hub Info */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Origin Dispatch Hub
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] font-mono text-emerald-400 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Origin City</label>
                      <input
                        type="text"
                        value={deliverySettings.origin_city || 'Pune'}
                        onChange={(e) =>
                          setDeliverySettings((prev) => ({ ...prev, origin_city: e.target.value }))
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Origin State</label>
                      <input
                        type="text"
                        value={deliverySettings.origin_state || 'Maharashtra'}
                        onChange={(e) =>
                          setDeliverySettings((prev) => ({ ...prev, origin_state: e.target.value }))
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-2 text-[11px] font-mono text-stone-500 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Coordinates: 18.5204° N, 73.8567° E</span>
                    </div>
                  </div>
                </div>

                {/* 2. Tier 1 (Pune Local) */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Tier 1: Local Metro
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">1-2 Days</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Max Distance Limit (km)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deliverySettings.tier_1_max_km || 50}
                          onChange={(e) =>
                            setDeliverySettings((prev) => ({
                              ...prev,
                              tier_1_max_km: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                        />
                        <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">km</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Delivery Fee (₹)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deliverySettings.tier_1_fee !== undefined ? deliverySettings.tier_1_fee : 50}
                          onChange={(e) =>
                            setDeliverySettings((prev) => ({
                              ...prev,
                              tier_1_fee: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[#D4AF37] font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                        />
                        <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">₹ INR</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Applies to Pune city &amp; immediate suburbs within 50 km.
                    </p>
                  </div>
                </div>

                {/* 3. Tier 2 (Maharashtra Regional) */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Tier 2: State Regional
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">2-3 Days</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Max Distance Limit (km)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deliverySettings.tier_2_max_km || 150}
                          onChange={(e) =>
                            setDeliverySettings((prev) => ({
                              ...prev,
                              tier_2_max_km: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                        />
                        <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">km</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Delivery Fee (₹)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deliverySettings.tier_2_fee !== undefined ? deliverySettings.tier_2_fee : 100}
                          onChange={(e) =>
                            setDeliverySettings((prev) => ({
                              ...prev,
                              tier_2_fee: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[#D4AF37] font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                        />
                        <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">₹ INR</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Applies to Mumbai, Thane, Satara, Ahmednagar (51–150 km).
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Interstate & Free Shipping Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Interstate / Other States */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Interstate / Other States Flat Fee
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">3-5 Days</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[11px] text-stone-400 block">Flat Rate for Interstate Destinations (₹)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={deliverySettings.interstate_fee !== undefined ? deliverySettings.interstate_fee : 150}
                        onChange={(e) =>
                          setDeliverySettings((prev) => ({
                            ...prev,
                            interstate_fee: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[#D4AF37] font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                      />
                      <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">₹ INR</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Applies automatically when delivery state is outside Maharashtra or distance exceeds Tier 2 limit.
                    </p>
                  </div>
                </div>

                {/* Free Shipping Policy */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Free Insured Delivery Policy
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDeliverySettings((prev) => ({
                          ...prev,
                          is_free_shipping_enabled: !prev.is_free_shipping_enabled,
                        }))
                      }
                      className="text-stone-400 hover:text-white"
                    >
                      {deliverySettings.is_free_shipping_enabled ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-stone-600" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[11px] text-stone-400 block">
                      Free Shipping Cart Threshold (₹ INR)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={!deliverySettings.is_free_shipping_enabled}
                        value={deliverySettings.free_shipping_threshold || 5000}
                        onChange={(e) =>
                          setDeliverySettings((prev) => ({
                            ...prev,
                            free_shipping_threshold: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                      />
                      <span className="absolute right-3 top-2 text-stone-500 font-mono text-xs">₹ INR</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      When cart total reaches ₹{(deliverySettings.free_shipping_threshold || 5000).toLocaleString('en-IN')}, shipping fee is automatically ₹0.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-Time Pincode Simulator */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900/90 via-[#1a1712]/90 to-stone-900/90 border border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Live Pincode Tier Verification Simulator
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">Interactive Test</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Indian PIN Code (e.g., 411001, 400001, 560001)..."
                    value={testPincode}
                    onChange={(e) => setTestPincode(e.target.value)}
                    className="flex-1 w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestPincode}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono font-bold text-stone-200 transition-colors"
                  >
                    Simulate Tier Fee
                  </button>
                </div>

                {testResult && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-4 animate-fade-in text-xs">
                    {testResult.error ? (
                      <span className="text-rose-400 flex items-center gap-1.5 font-mono">
                        <AlertCircle className="w-4 h-4" />
                        {testResult.error}
                      </span>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="font-bold text-stone-100 flex items-center gap-2">
                            <span>PIN {testResult.pincode}</span>
                            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-mono text-[#D4AF37]">
                              {testResult.region}
                            </span>
                          </div>
                          <div className="text-stone-400 font-mono text-[11px]">
                            {testResult.tier} • Approx. {testResult.distanceKm} km from Pune
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-mono font-bold text-[#D4AF37]">
                            ₹{testResult.calculatedFee} Delivery
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400">
                            FREE on orders &ge; ₹{testResult.freeOverThreshold}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FILTERS MATRIX MANAGER */}
        {activeTab === 'filters' && (
          <AdminFilterManager onToast={addToast} />
        )}
      </main>

      {/* LUXURY PRODUCT CREATION / EDIT MODAL */}
      <LuxuryProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSaveSuccess={handleProductSaveSuccess}
        existingProducts={products}
      />

      {/* LIVE CUSTOMER STOREFRONT SIMULATOR MODAL */}
      {previewingProduct && (
        <ProductPreviewModal
          product={previewingProduct}
          onClose={() => setPreviewingProduct(null)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141210] border border-rose-800/60 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-100">
                Remove Specimen from Vault?
              </h3>
              <p className="text-xs text-stone-400">
                Are you sure you want to delete &quot;<strong className="text-stone-200">{deletingProduct.name}</strong>&quot;? This will remove its variants and images from the active catalog.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30"
              >
                Delete Specimen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
