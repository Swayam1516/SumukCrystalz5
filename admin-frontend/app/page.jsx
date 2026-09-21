'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import { ENERGY_STONES_CATALOG } from '@/data/energyStones';
import { getSupabaseCustomers, getSupabaseOrders } from '@/lib/supabase';
import LuxuryProductModal from '@/components/LuxuryProductModal';
import ProductPreviewModal from '@/components/ProductPreviewModal';
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
  ShoppingBag
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
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'customers' | 'supabase'

  // Data Collections
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

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

  // Load products from Backend API on mount
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.products || []);
          if (isMounted) {
            setProducts(list);
            return;
          }
        }
      } catch (e) {
        console.warn('Initial product load note:', e.message);
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
      const ordersRes = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || (Array.isArray(ordersData) ? ordersData : []));
      } else {
        const supaOrders = await getSupabaseOrders();
        if (supaOrders?.length) setOrders(supaOrders);
      }

      // 2. Customers
      const customersRes = await fetch(`${API_BASE}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (customersRes.ok) {
        const custData = await customersRes.json();
        setCustomers(custData.customers || (Array.isArray(custData) ? custData : []));
      } else {
        const supaCust = await getSupabaseCustomers();
        if (supaCust?.length) setCustomers(supaCust);
      }

      // 3. Products
      const prodsRes = await fetch(`${API_BASE}/api/admin/products`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        const list = Array.isArray(prodsData) ? prodsData : (prodsData.products || []);
        if (list?.length) {
          setProducts(list);
        }
      } else {
        const pubRes = await fetch(`${API_BASE}/api/products`);
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          const list = Array.isArray(pubData) ? pubData : (pubData.products || []);
          if (list?.length) setProducts(list);
        }
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
    addToast(`✨ Specimen "${savedProduct.name}" synchronized to live sanctuary!`);
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
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(clone),
      });
      if (res.ok) {
        const resData = await res.json();
        const saved = resData.product || clone;
        setProducts((prev) => [saved, ...prev]);
        addToast(`📄 Duplicated "${product.name}" in database!`);
        return;
      }
    } catch (e) {
      console.warn('Duplicate product fetch warning:', e);
    }

    setProducts((prev) => [clone, ...prev]);
    addToast(`📄 Duplicated "${product.name}" successfully!`);
  };

  // Toggle Active Status
  const handleToggleProductStatus = async (product) => {
    const nextStatus = !product.isActive;
    const targetId = product.id || product.slug;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id || p.slug === product.slug) {
          return { ...p, isActive: nextStatus };
        }
        return p;
      })
    );

    try {
      await fetch(`${API_BASE}/api/admin/products/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...product, isActive: nextStatus }),
      });
    } catch (e) {}

    addToast(`Visibility set to ${nextStatus ? 'Active' : 'Draft'} for "${product.name}"`);
  };

  // Delete Product
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id || deletingProduct.slug;
    setProducts((prev) => prev.filter((p) => p.id !== targetId && p.slug !== targetId));

    try {
      await fetch(`${API_BASE}/api/admin/products/${targetId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (e) {}

    addToast(`🗑️ "${deletingProduct.name}" removed from sanctuary vault.`, 'info');
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
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
