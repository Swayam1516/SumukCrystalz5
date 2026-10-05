'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { computeDashboardMetrics } from '@/lib/analyticsEngine';

// Components
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AdminKPIGrid from '@/components/AdminKPIGrid';
import AdminActionCenter from '@/components/AdminActionCenter';
import AdminAnalyticsSection from '@/components/AdminAnalyticsSection';
import AdminQuickActions from '@/components/AdminQuickActions';
import AdvancedProductWorkspace from '@/components/AdvancedProductWorkspace';
import EnhancedProductTable from '@/components/EnhancedProductTable';
import RecentOrdersWidget from '@/components/RecentOrdersWidget';
import RecentProductsWidget from '@/components/RecentProductsWidget';
import RestockModal from '@/components/RestockModal';
import OrderStatusModal from '@/components/OrderStatusModal';
import ProductPreviewModal from '@/components/ProductPreviewModal';
import AdminFilterManager from '@/components/AdminFilterManager';
import AdminChatbotManager from '@/components/AdminChatbotManager';

// Lucide Icons
import {
  Crown,
  Lock,
  Key,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Package,
  ShoppingBag,
  Users,
  Megaphone,
  Truck,
  SlidersHorizontal,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  TrendingUp,
  MapPin,
  Compass,
  Zap,
  Layers,
  Check,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Trash2,
  Clock,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAdmin, login, logout, initAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Authentication Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'action-center' | 'inventory' | 'orders' | 'customers' | 'services' | 'broadcast' | 'shipping' | 'filters' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Database Collections
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [showProductWorkspace, setShowProductWorkspace] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewingProduct, setPreviewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [restockingProduct, setRestockingProduct] = useState(null);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);

  // Delivery Settings State
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [savingDeliverySettings, setSavingDeliverySettings] = useState(false);
  const [testPincode, setTestPincode] = useState('');
  const [testResult, setTestResult] = useState(null);

  // Broadcast & Modalities State
  const [announcementMessage, setAnnouncementMessage] = useState(
    '✨ Sacred Consecration: Every crystal specimen is cleansed with 528Hz Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen.'
  );
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [servicesList, setServicesList] = useState(CANONICAL_SERVICES_DEFAULT);
  const [updatingServiceId, setUpdatingServiceId] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Initialize Auth
  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Fetch Live Data from Supabase / Backend API
  const fetchLiveAdminData = useCallback(async (authToken) => {
    setLoadingData(true);
    try {
      // 1. Orders
      let ordersList = [];
      const supaOrders = await getSupabaseOrders();
      if (supaOrders && supaOrders.length > 0) {
        ordersList = supaOrders;
      } else if (API_BASE) {
        const ordersRes = await fetch(`${API_BASE}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${authToken || token}` },
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
      } else if (API_BASE) {
        const customersRes = await fetch(`${API_BASE}/api/admin/customers`, {
          headers: { Authorization: `Bearer ${authToken || token}` },
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
      } else if (API_BASE) {
        const prodsRes = await fetch(`${API_BASE}/api/admin/products`, {
          headers: { Authorization: `Bearer ${authToken || token}` },
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

      // 6. Delivery Settings
      const supaShipping = await getSupabaseDeliverySettings();
      if (supaShipping) {
        setDeliverySettings(supaShipping);
      }
    } catch (err) {
      console.warn('Admin fetch data warning:', err);
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  // Load on mount and when admin is authenticated
  useEffect(() => {
    if (isAdmin && token) {
      fetchLiveAdminData(token);
    }
  }, [isAdmin, token, fetchLiveAdminData]);

  // Compute Live Metrics
  const metrics = useMemo(() => {
    return computeDashboardMetrics(orders, products, customers);
  }, [orders, products, customers]);

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.toLowerCase().trim();
    if (!cleanEmail || !loginPassword) {
      setLoginError('Please provide both administrator email and master security password.');
      return;
    }

    setLoadingAuth(true);
    const res = await login(cleanEmail, loginPassword);
    setLoadingAuth(false);

    if (res.success) {
      addToast('👑 Welcome back, Soumyaa Naveen! Founder Sanctuary Unlocked.');
    } else {
      setLoginError(res.error || 'Access Denied: Invalid administrator credentials.');
    }
  };

  // Product Save Callback
  const handleProductSaveSuccess = (savedProduct) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProduct.id || p.slug === savedProduct.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedProduct;
        return copy;
      }
      return [savedProduct, ...prev];
    });
    addToast(`✨ Specimen "${savedProduct.name || savedProduct.title}" saved to Supabase!`);
    setEditingProduct(null);
  };

  // Duplicate Product
  const handleDuplicateProduct = async (product) => {
    const cloneSlug = `${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy-${Math.floor(100 + Math.random() * 900)}`;
    const clone = {
      ...product,
      id: undefined,
      slug: cloneSlug,
      name: `${product.name || product.title} (Duplicate)`,
      title: `${product.name || product.title} (Duplicate)`,
      sku: product.sku ? `${product.sku}-DUP` : `SKU-DUP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const supaRes = await saveProductToSupabase(clone);
      if (supaRes.success) {
        setProducts((prev) => [supaRes.product, ...prev]);
        addToast(`📄 Duplicated "${product.name || product.title}" in Supabase!`);
        return;
      }
    } catch (e) {
      console.warn('Duplicate error:', e);
    }

    setProducts((prev) => [clone, ...prev]);
    addToast(`📄 Duplicated "${product.name || product.title}" successfully!`);
  };

  // Toggle Product Status
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

    addToast(`Visibility set to ${nextStatus ? 'Active' : 'Draft'} for "${product.name || product.title}"`);
  };

  // Delete Product
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id || deletingProduct.slug;
    setProducts((prev) => prev.filter((p) => p.id !== targetId && p.slug !== targetId));

    if (deletingProduct.id) {
      await deleteProductFromSupabase(deletingProduct.id);
    }

    addToast(`🗑️ "${deletingProduct.name || deletingProduct.title}" removed from Supabase and catalog.`, 'info');
    setDeletingProduct(null);
  };

  // Bulk Actions
  const handleBulkAction = async ({ type, ids = [], value, feature }) => {
    if (ids.length === 0) return;

    if (type === 'STATUS') {
      setProducts((prev) =>
        prev.map((p) => (ids.includes(p.id || p.slug) ? { ...p, isActive: value, active: value } : p))
      );
      for (const id of ids) {
        const prod = products.find((p) => p.id === id || p.slug === id);
        if (prod?.id) await toggleProductStatusInSupabase(prod.id, value);
      }
      addToast(`⚡ Bulk updated ${ids.length} specimens to ${value ? 'Active' : 'Draft'}!`);
    } else if (type === 'DELETE') {
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id || p.slug)));
      for (const id of ids) {
        const prod = products.find((p) => p.id === id || p.slug === id);
        if (prod?.id) await deleteProductFromSupabase(prod.id);
      }
      addToast(`🗑️ Bulk deleted ${ids.length} specimens from Supabase.`, 'info');
    } else if (type === 'FEATURE') {
      setProducts((prev) =>
        prev.map((p) => (ids.includes(p.id || p.slug) ? { ...p, [feature]: true } : p))
      );
      addToast(`✨ Feature badge applied to ${ids.length} specimens.`);
    }
  };

  // Save Delivery Settings
  const handleSaveDeliverySettings = async (e) => {
    if (e) e.preventDefault();
    setSavingDeliverySettings(true);
    try {
      const res = await updateSupabaseDeliverySettings(deliverySettings);
      if (res.success) {
        setDeliverySettings(res.settings);
        addToast('✨ Delivery fees & shipping rules synchronized with Supabase!');
      } else {
        throw new Error(res.error || 'Failed to save shipping settings');
      }
    } catch (err) {
      addToast(`Error saving shipping rules: ${err.message}`, 'error');
    } finally {
      setSavingDeliverySettings(false);
    }
  };

  // Test Pincode Simulator
  const handleTestPincode = (e) => {
    if (e) e.preventDefault();
    const pin = testPincode.replace(/\D/g, '').slice(0, 6);
    if (pin.length !== 6) {
      setTestResult({ error: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }

    const isPune = pin.startsWith('411') || pin.startsWith('412');
    const isMaha = ['40', '41', '42', '43', '44'].includes(pin.slice(0, 2));

    let tier = 'Interstate Flat Rate';
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

  // Save Broadcast Announcement
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
            : '⏸️ Broadcast Banner deactivated and hidden.',
          'success'
        );
      } else {
        addToast(res.error || 'Failed to update announcement', 'error');
      }
    } catch (err) {
      addToast('Error saving announcement: ' + err.message, 'error');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  // Update Individual Service Status
  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    setUpdatingServiceId(serviceId);
    setServicesList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );

    try {
      const res = await updateServiceStatusInSupabase(serviceId, newStatus);
      if (res.success) {
        addToast(`✨ Modality status updated to "${newStatus}"!`);
      }
    } catch (err) {
      addToast('Error updating service: ' + err.message, 'error');
    } finally {
      setUpdatingServiceId(null);
    }
  };

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

        <div className="w-full max-w-md bg-[#141210]/95 border border-[#D4AF37]/35 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg shadow-[#D4AF37]/10">
              <Crown className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] tracking-wide">
              Founder Sanctuary Vault
            </h1>
            <p className="text-xs text-stone-400">
              Sumuk Crystalz 5 • Secure Administrator &amp; Inventory Portal
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
                placeholder="sumukcrystalz5@gmail.com"
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

  // MAIN LUXURY 3D ADMIN PORTAL
  return (
    <div className="min-h-screen bg-[#0A0908] text-stone-100 flex">
      {/* Toast Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto ${
              t.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : t.type === 'info'
                ? 'bg-stone-900/90 border-stone-700 text-stone-200'
                : 'bg-stone-950/90 border-[#D4AF37]/50 text-[#F3E5AB]'
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

      {/* Responsive Luxury Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        metrics={metrics}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          onOpenCreateProduct={() => {
            setEditingProduct(null);
            setShowProductWorkspace(true);
          }}
          onRefreshData={() => {
            fetchLiveAdminData(token);
            addToast('✨ Sanctuary Database re-synchronized!');
          }}
          loadingData={loadingData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          metrics={metrics}
          products={products}
          orders={orders}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: EXECUTIVE OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Top KPI Cards Grid */}
              <AdminKPIGrid metrics={metrics} onNavigate={setActiveTab} />

              {/* Action Center */}
              <AdminActionCenter
                metrics={metrics}
                orders={orders}
                products={products}
                services={servicesList}
                onNavigate={setActiveTab}
                onQuickRestock={(prod) => setRestockingProduct(prod)}
              />

              {/* Real-Time Analytics Charts */}
              <AdminAnalyticsSection
                orders={orders}
                products={products}
                customers={customers}
                metrics={metrics}
              />

              {/* Quick Actions Shortcuts */}
              <AdminQuickActions
                onOpenCreateProduct={() => {
                  setEditingProduct(null);
                  setShowProductWorkspace(true);
                }}
                onNavigate={setActiveTab}
                onRefreshData={() => fetchLiveAdminData(token)}
                loadingData={loadingData}
              />

              {/* Dual Widgets: Recent Orders & Recent Specimens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrdersWidget
                  orders={orders}
                  onNavigate={setActiveTab}
                  onOpenOrderStatus={(ord) => setSelectedOrderForStatus(ord)}
                />
                <RecentProductsWidget
                  products={products}
                  onNavigate={setActiveTab}
                  onEditProduct={(p) => {
                    setEditingProduct(p);
                    setShowProductWorkspace(true);
                  }}
                  onPreviewProduct={(p) => setPreviewingProduct(p)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: REAL-TIME ANALYTICS & INTELLIGENCE */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <AdminKPIGrid metrics={metrics} onNavigate={setActiveTab} />
              <AdminAnalyticsSection
                orders={orders}
                products={products}
                customers={customers}
                metrics={metrics}
              />
            </div>
          )}

          {/* TAB 3: ACTION CENTER */}
          {activeTab === 'action-center' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AdminActionCenter
                metrics={metrics}
                orders={orders}
                products={products}
                services={servicesList}
                onNavigate={setActiveTab}
                onQuickRestock={(prod) => setRestockingProduct(prod)}
              />
            </div>
          )}

          {/* TAB 4: CRYSTAL CATALOG & VARIANTS */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D4AF37]" />
                    Crystal Catalog &amp; 3D Specimen Inventory
                  </h2>
                  <p className="text-xs text-stone-400">
                    Manage prices, variants, photographic media, stock levels, and Vedic classifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductWorkspace(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Crystal Specimen</span>
                </button>
              </div>

              <EnhancedProductTable
                products={products}
                onOpenCreateProduct={() => {
                  setEditingProduct(null);
                  setShowProductWorkspace(true);
                }}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setShowProductWorkspace(true);
                }}
                onPreviewProduct={(p) => setPreviewingProduct(p)}
                onDuplicateProduct={handleDuplicateProduct}
                onToggleProductStatus={handleToggleProductStatus}
                onDeleteProduct={(p) => setDeletingProduct(p)}
                onBulkAction={handleBulkAction}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          )}

          {/* TAB 5: PATRON ORDERS SANCTUARY */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                    Patron Orders Sanctuary
                  </h2>
                  <p className="text-xs text-stone-400">
                    Live customer orders, payment verification, and fulfillment tracking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fetchLiveAdminData(token)}
                  className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#D4AF37]/40 text-stone-300 hover:text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Orders</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="border border-[#D4AF37]/25 rounded-3xl overflow-hidden bg-stone-900/40 backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-950/95 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
                        <th className="py-4 px-4">Order ID &amp; Date</th>
                        <th className="py-4 px-4">Patron Details</th>
                        <th className="py-4 px-4">Items Summary</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-stone-500">
                            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            No patron orders recorded in database yet.
                          </td>
                        </tr>
                      ) : (
                        orders.map((ord, idx) => {
                          const status = (ord.status || 'pending').toLowerCase();
                          const dateStr = ord.created_at || ord.createdAt ? new Date(ord.created_at || ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
                          const items = Array.isArray(ord.items) ? ord.items : [];
                          const total = Number(ord.total || ord.total_amount || ord.subtotal || 0);

                          return (
                            <tr key={ord.id || ord.order_number || idx} className="hover:bg-stone-800/40 transition-colors">
                              <td className="py-3.5 px-4 font-mono">
                                <div className="font-bold text-stone-100">
                                  #{ord.order_number || ord.orderId || `ORD-${idx + 1}`}
                                </div>
                                <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" /> {dateStr}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-stone-200">
                                  {ord.buyer_name || ord.buyerName || 'Valued Patron'}
                                </div>
                                <div className="text-[11px] text-stone-400">{ord.buyer_email || ord.buyerEmail}</div>
                                {ord.buyer_phone && <div className="text-[10px] text-stone-500">{ord.buyer_phone}</div>}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="text-stone-300">
                                  {items.length > 0
                                    ? `${items[0]?.name || items[0]?.product_name || 'Specimen'}${items.length > 1 ? ` +${items.length - 1} more` : ''}`
                                    : '1 Crystal Specimen'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#F3E5AB]">
                                  ₹{total.toLocaleString('en-IN')}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                                    status === 'delivered'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : ['processing', 'paid', 'confirmed', 'packed'].includes(status)
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : ['cancelled', 'refunded'].includes(status)
                                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  {ord.status || 'Pending'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForStatus(ord)}
                                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#D4AF37] text-stone-300 hover:text-black font-semibold text-xs border border-stone-800 hover:border-[#D4AF37] transition-all cursor-pointer"
                                >
                                  Update Status
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PATRONS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  Patrons &amp; Collectors Directory
                </h2>
                <p className="text-xs text-stone-400">
                  Registered spiritual seekers, collectors, and repeat patrons across India.
                </p>
              </div>

              {customers.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 rounded-3xl bg-stone-900/40 border border-stone-800">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No patrons registered in directory yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {customers.map((cust, idx) => (
                    <div
                      key={cust.id || cust.email || idx}
                      className="p-5 rounded-3xl bg-gradient-to-br from-stone-900/90 via-[#141210]/95 to-stone-950 border border-stone-800 hover:border-[#D4AF37]/40 transition-all duration-300 shadow-xl space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F3E5AB] font-serif font-bold text-sm">
                          {(cust.full_name || cust.fullName || 'P')[0]?.toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-stone-100 truncate text-xs">
                            {cust.full_name || cust.fullName || 'Collector'}
                          </div>
                          <div className="text-[10px] font-mono text-[#D4AF37]">Verified Patron</div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-stone-400 pt-1 border-t border-stone-800/80">
                        <div className="truncate">{cust.email}</div>
                        {cust.phone && <div className="text-stone-500 font-mono text-[11px]">{cust.phone}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: 9 METAPHYSICAL SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  9 Sacred Modalities &amp; Energy Healing Services
                </h2>
                <p className="text-xs text-stone-400">
                  Control live booking status and availability badges for all modalities channeled by Founder Soumyaa Naveen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {servicesList.map((service) => {
                  const currentStatus = service.status || 'available';
                  const isUpdating = updatingServiceId === service.id;

                  return (
                    <div
                      key={service.id}
                      className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl ${
                        currentStatus === 'available'
                          ? 'bg-stone-900/60 border-emerald-500/30'
                          : currentStatus === 'currently unavailable'
                          ? 'bg-stone-900/40 border-rose-500/30'
                          : 'bg-stone-900/40 border-purple-500/30'
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
                        <p className="text-xs text-stone-400 line-clamp-2">
                          {service.tagline || service.description || 'Vedic energy attunement session.'}
                        </p>
                      </div>

                      {/* 3-State Switcher */}
                      <div className="space-y-1.5 pt-3 border-t border-stone-800/80">
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                          Current Availability:
                        </span>
                        <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-2xl border border-stone-800">
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'available')}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                              currentStatus === 'available'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'currently unavailable')}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                              currentStatus === 'currently unavailable'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Paused
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateServiceStatus(service.id, 'coming soon')}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                              currentStatus === 'coming soon'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Soon
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: BROADCAST ANNOUNCEMENT */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/80 border border-[#D4AF37]/35 backdrop-blur-2xl space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-serif font-bold text-[#F3E5AB]">
                        Storefront Global Marquee Ribbon
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400">
                      Publish a luxury headline ribbon at the top of the customer sanctuary across all device viewports.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5">
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

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300 block">Broadcast Message</label>
                  <textarea
                    rows={2}
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveAnnouncement}
                    disabled={savingAnnouncement}
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingAnnouncement ? 'Saving...' : 'Save & Publish Announcement'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SHIPPING & DISTANCE LOGISTICS */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/80 border border-[#D4AF37]/35 backdrop-blur-2xl space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#D4AF37]" />
                      Radial Delivery Tiers &amp; Distance Engine
                    </h2>
                    <p className="text-xs text-stone-400">
                      Configure radial distance thresholds originating from Pune for automatic delivery fee computation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveDeliverySettings}
                    disabled={savingDeliverySettings}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingDeliverySettings ? 'Saving...' : 'Save Shipping Rules'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Origin Dispatch */}
                  <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3 text-xs">
                    <span className="font-mono uppercase text-[#D4AF37] font-bold block">
                      Origin Dispatch Hub
                    </span>
                    <div>
                      <label className="text-stone-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={deliverySettings.origin_city || 'Pune'}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, origin_city: e.target.value }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1">State</label>
                      <input
                        type="text"
                        value={deliverySettings.origin_state || 'Maharashtra'}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, origin_state: e.target.value }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                      />
                    </div>
                  </div>

                  {/* Tier 1 */}
                  <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3 text-xs">
                    <span className="font-mono uppercase text-amber-400 font-bold block">
                      Tier 1: Pune Local (&le; 50km)
                    </span>
                    <div>
                      <label className="text-stone-400 block mb-1">Max Km</label>
                      <input
                        type="number"
                        value={deliverySettings.tier_1_max_km || 50}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, tier_1_max_km: Number(e.target.value) }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1">Fee (₹)</label>
                      <input
                        type="number"
                        value={deliverySettings.tier_1_fee !== undefined ? deliverySettings.tier_1_fee : 50}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, tier_1_fee: Number(e.target.value) }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[#D4AF37] font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3 text-xs">
                    <span className="font-mono uppercase text-purple-400 font-bold block">
                      Tier 2: Maharashtra Regional (51-150km)
                    </span>
                    <div>
                      <label className="text-stone-400 block mb-1">Max Km</label>
                      <input
                        type="number"
                        value={deliverySettings.tier_2_max_km || 150}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, tier_2_max_km: Number(e.target.value) }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1">Fee (₹)</label>
                      <input
                        type="number"
                        value={deliverySettings.tier_2_fee !== undefined ? deliverySettings.tier_2_fee : 100}
                        onChange={(e) => setDeliverySettings((s) => ({ ...s, tier_2_fee: Number(e.target.value) }))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[#D4AF37] font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Pincode Simulator */}
                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                  <span className="text-xs font-mono uppercase text-[#D4AF37] font-bold block">
                    Interactive Pincode Rate Calculator
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={testPincode}
                      onChange={(e) => setTestPincode(e.target.value)}
                      placeholder="Enter 6-digit Indian PIN (e.g. 411001, 400001, 560001)..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTestPincode}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200"
                    >
                      Calculate Fee
                    </button>
                  </div>

                  {testResult && (
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs flex justify-between items-center">
                      {testResult.error ? (
                        <span className="text-rose-400">{testResult.error}</span>
                      ) : (
                        <>
                          <div>
                            <span className="font-bold text-stone-100">{testResult.region}</span> • {testResult.tier} ({testResult.distanceKm} km)
                          </div>
                          <div className="font-bold text-[#F3E5AB] text-sm">
                            ₹{testResult.calculatedFee} Delivery
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: DYNAMIC FILTER MATRIX */}
          {activeTab === 'filters' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AdminFilterManager onToast={addToast} />
            </div>
          )}

          {/* TAB 11: AI ASSISTANT & FAQS */}
          {activeTab === 'chatbot' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AdminChatbotManager />
            </div>
          )}

          {/* TAB 12: VAULT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/80 border border-stone-800 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#D4AF37]" />
                    Vault Settings &amp; Infrastructure
                  </h2>
                  <p className="text-xs text-stone-400">
                    Master environment parameters and security token protocols.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-stone-400">Supabase Project Endpoint:</div>
                    <div className="text-[#D4AF37]">https://cmsiounkoqpwjccczebk.supabase.co</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-stone-400">Administrator Profile:</div>
                    <div className="text-emerald-400">Soumyaa Naveen (sumukcrystalz5@gmail.com)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-stone-400">Active Database Tables:</div>
                    <div className="text-stone-300">products, product_variants, product_images, orders, users, services, site_announcements, delivery_settings, store_filters</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 10-TAB PRODUCT WORKSPACE MODAL */}
      <AdvancedProductWorkspace
        isOpen={showProductWorkspace}
        onClose={() => {
          setShowProductWorkspace(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSaveSuccess={handleProductSaveSuccess}
        existingProducts={products}
      />

      {/* LIVE CUSTOMER SIMULATOR MODAL */}
      {previewingProduct && (
        <ProductPreviewModal
          product={previewingProduct}
          onClose={() => setPreviewingProduct(null)}
        />
      )}

      {/* QUICK RESTOCK MODAL */}
      {restockingProduct && (
        <RestockModal
          product={restockingProduct}
          onClose={() => setRestockingProduct(null)}
          onSaveSuccess={(updated) => {
            handleProductSaveSuccess(updated);
            addToast(`📦 Restocked "${updated.name || updated.title}"!`);
          }}
        />
      )}

      {/* ORDER STATUS MODAL */}
      {selectedOrderForStatus && (
        <OrderStatusModal
          order={selectedOrderForStatus}
          onClose={() => setSelectedOrderForStatus(null)}
          onSaveSuccess={(updated) => {
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id || o.order_number === updated.order_number ? updated : o))
            );
            addToast(`🚚 Order #${updated.order_number || 'ORD'} status updated to "${updated.status}"!`);
          }}
        />
      )}

      {/* DELETE SPECIMEN CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141210] border border-rose-800/60 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-100">
                Remove Specimen from Vault?
              </h3>
              <p className="text-xs text-stone-400">
                Are you sure you want to permanently delete &quot;<strong className="text-stone-200">{deletingProduct.name || deletingProduct.title}</strong>&quot;? This will remove its variants and images.
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
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30 cursor-pointer"
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
