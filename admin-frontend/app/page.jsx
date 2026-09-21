'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import { ENERGY_STONES_CATALOG } from '@/data/energyStones';
import { getSupabaseCustomers, getSupabaseOrders } from '@/lib/supabase';
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
  EyeOff
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
    }, 3500);
  };

  // Inventory View & Filters
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'instock' | 'lowstock' | 'outofstock'

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    category: 'Energy Bands',
    purpose: 'wealth',
    purposeLabel: 'Wealth & Abundance',
    beadType: 'Pyrite',
    beadSize: '8mm Regular',
    price: 699,
    originalPrice: 1299,
    energizedPrice: 100,
    stockCount: 15,
    images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'],
    description: '',
    chakra: 'Solar Plexus & Sacral',
    zodiac: 'Leo, Sagittarius, Aries',
    isActive: true,
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Manage Media Modal State
  const [mediaManagingProduct, setMediaManagingProduct] = useState(null);
  const [urlInput, setUrlInput] = useState('');

  // Delete Confirmation Modal
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // File Upload Refs
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Load products from localStorage / seed data
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('sumuk_admin_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(ENERGY_STONES_CATALOG);
        localStorage.setItem('sumuk_admin_products', JSON.stringify(ENERGY_STONES_CATALOG));
      }
    } catch (e) {
      setProducts(ENERGY_STONES_CATALOG);
    }
  }, []);

  const saveProductsToStorage = (updated) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sumuk_admin_products', JSON.stringify(updated));
    }
  };

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
        setOrders(ordersData);
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
        setCustomers(custData);
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
        if (prodsData?.length) {
          saveProductsToStorage(prodsData);
        }
      }

      addToast('✨ Sanctuary Database synchronized successfully!');
    } catch (err) {
      console.warn('Admin fetch data warning:', err);
      addToast('Live database sync completed (Offline vault active)', 'info');
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

  // Image Upload Handler
  const handleImageFiles = (files, targetMode = 'new') => {
    if (!files || !files.length) return;
    const fileArray = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(f.name)
    );

    if (fileArray.length === 0) {
      addToast('No valid image files found in selection.', 'error');
      return;
    }

    let loadedCount = 0;
    const loadedUrls = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        loadedUrls.push(e.target.result);
        loadedCount++;
        if (loadedCount === fileArray.length) {
          if (targetMode === 'new') {
            setNewProduct((prev) => ({
              ...prev,
              images: [...prev.images, ...loadedUrls],
            }));
          } else if (targetMode === 'edit' && editingProduct) {
            setEditingProduct((prev) => ({
              ...prev,
              images: [...(prev.images || []), ...loadedUrls],
            }));
          } else if (targetMode === 'media' && mediaManagingProduct) {
            setMediaManagingProduct((prev) => {
              const updated = {
                ...prev,
                images: [...(prev.images || []), ...loadedUrls],
              };
              const updatedAll = products.map((p) =>
                p.id === prev.id || p._id === prev._id ? updated : p
              );
              saveProductsToStorage(updatedAll);
              return updated;
            });
          }
          addToast(`📸 Added ${loadedUrls.length} images.`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Publish New Specimen
  const handlePublishNewProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      addToast('Please provide specimen name and price', 'error');
      return;
    }

    setPublishing(true);
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const discountPercent = Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100);

    const createdSpecimen = {
      ...newProduct,
      id: slug,
      slug,
      discountPercent: discountPercent > 0 ? discountPercent : 45,
      images: newProduct.images.length
        ? newProduct.images
        : ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'],
      rating: 5.0,
      reviewsCount: 1,
      badge: 'NEW CURATION',
      inStock: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [createdSpecimen, ...products];
    saveProductsToStorage(updated);

    try {
      await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createdSpecimen),
      });
    } catch (err) {}

    setPublishing(false);
    setShowAddModal(false);
    addToast(`💎 "${createdSpecimen.name}" successfully published to Vault!`);

    // Reset Form
    setNewProduct({
      name: '',
      subtitle: '',
      category: 'Energy Bands',
      purpose: 'wealth',
      purposeLabel: 'Wealth & Abundance',
      beadType: 'Pyrite',
      beadSize: '8mm Regular',
      price: 699,
      originalPrice: 1299,
      energizedPrice: 100,
      stockCount: 15,
      images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'],
      description: '',
      chakra: 'Solar Plexus & Sacral',
      zodiac: 'Leo, Sagittarius, Aries',
      isActive: true,
    });
  };

  // Save Edited Specimen
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingEdit(true);

    const discountPercent = Math.round(
      ((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100
    );

    const updatedSpecimen = {
      ...editingProduct,
      discountPercent: discountPercent > 0 ? discountPercent : 45,
      inStock: editingProduct.stockCount > 0,
      updatedAt: new Date().toISOString(),
    };

    const updated = products.map((p) =>
      p.id === editingProduct.id || p._id === editingProduct._id ? updatedSpecimen : p
    );
    saveProductsToStorage(updated);

    try {
      await fetch(`${API_BASE}/api/admin/products/${editingProduct.id || editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSpecimen),
      });
    } catch (err) {}

    setSavingEdit(false);
    setEditingProduct(null);
    addToast(`✨ Specimen "${updatedSpecimen.name}" successfully updated!`);
  };

  // Stock Adjustment
  const adjustStock = (productId, delta) => {
    const updated = products.map((p) => {
      if (p.id === productId || p._id === productId) {
        const current = p.stockCount !== undefined ? p.stockCount : 15;
        const next = Math.max(0, current + delta);
        return { ...p, stockCount: next, inStock: next > 0 };
      }
      return p;
    });
    saveProductsToStorage(updated);
    addToast('📦 Stock count updated.');
  };

  // Delete Product
  const confirmDeleteProduct = () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id || deletingProduct._id;
    const updated = products.filter((p) => p.id !== targetId && p._id !== targetId);
    saveProductsToStorage(updated);

    try {
      fetch(`${API_BASE}/api/admin/products/${targetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {}

    addToast(`🗑️ "${deletingProduct.name}" removed from vault.`, 'info');
    setDeletingProduct(null);
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updatedOrders = orders.map((o) =>
      o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);

    try {
      await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {}

    addToast(`📦 Order status updated to "${newStatus.toUpperCase()}"`);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.beadType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.purpose === categoryFilter;
    const stock = p.stockCount !== undefined ? p.stockCount : 15;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && stock > 5) ||
      (stockFilter === 'lowstock' && stock > 0 && stock <= 5) ||
      (stockFilter === 'outofstock' && stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  if (!mounted) return null;

  // =========================================================================
  // VIEW A: ADMIN LOGIN GATE (FOUNDER ACCESS ONLY)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07050d] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0e0a19] border border-amber-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
                SUMUK CRYSTALZ 5
              </h1>
              <p className="text-xs font-mono text-amber-300 mt-1 uppercase tracking-widest font-bold">
                Founder Sanctuary Portal
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Founder Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Sumukcrystalz5@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-amber-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="btn-pill-primary w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4 text-black" />
              <span>{loadingAuth ? 'Verifying Authorization...' : 'Unlock Sanctuary'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] font-mono text-neutral-500">
              Enterprise Zero-Trust Authentication Guarded
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: UNLOCKED FOUNDER ADMIN SANCTUARY
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#07050d] text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#090712]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
            <Crown className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
              SUMUK CRYSTALZ 5
            </h1>
            <p className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-widest">
              Founder Admin Sanctuary
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#120e20] p-1 rounded-xl border border-white/10">
          {[
            { id: 'inventory', label: 'Specimen Catalog', icon: Package },
            { id: 'orders', label: 'Orders Vault', icon: Truck },
            { id: 'customers', label: 'Patron Directory', icon: Users },
            { id: 'supabase', label: 'Database Schema', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLiveAdminData(token)}
            disabled={loadingData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition"
            title="Sync live records"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
            title="Sign out of Founder Sanctuary"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: SPECIMEN CATALOG / INVENTORY                                       */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Specimen Vault &amp; Inventory</h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Manage natural crystals, 432Hz consecrated stock, and multimedia galleries.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-pill-primary px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Publish Specimen</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 rounded-2xl bg-[#0e0a19] border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search specimens by name, bead, chakra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090712] border border-white/10 text-xs text-white font-mono focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#090712] border border-white/10 text-xs text-white font-mono"
                >
                  <option value="all">All Intentions</option>
                  <option value="wealth">Wealth &amp; Abundance</option>
                  <option value="love">Love &amp; Harmony</option>
                  <option value="protection">Protection</option>
                  <option value="peace">Peace &amp; Calm</option>
                  <option value="career">Career &amp; Focus</option>
                </select>

                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 ${viewMode === 'table' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id || p._id}
                    className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 overflow-hidden shadow-xl flex flex-col group hover:border-amber-500/50 transition duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-black/40">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">💎</div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-400/30">
                          {p.stockCount !== undefined ? p.stockCount : 15} in stock
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                          {p.purposeLabel || p.purpose}
                        </div>
                        <h3 className="font-serif text-base font-bold text-white line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-2">{p.subtitle || p.shortDescription}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                          <span className="text-base font-mono font-bold text-amber-300">
                            ₹{(p.price || 699).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => adjustStock(p.id || p._id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-mono text-xs flex items-center justify-center"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <button
                            onClick={() => adjustStock(p.id || p._id, 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-mono text-xs flex items-center justify-center"
                            title="Increase Stock"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            title="Edit Specimen"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30"
                            title="Delete Specimen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0e0a19] border border-amber-500/20 overflow-x-auto shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400">
                      <th className="py-4 px-4">Specimen</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id || p._id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 relative overflow-hidden flex-shrink-0">
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-serif text-sm font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-neutral-400">{p.beadType}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-amber-300">{p.purposeLabel || p.purpose}</td>
                        <td className="py-3 px-4 font-bold text-white">₹{p.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            (p.stockCount ?? 15) > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {p.stockCount ?? 15}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS VAULT                                                       */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Orders &amp; Shiprocket Logistics</h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Fulfill consecrated customer orders and monitor live delivery dispatches.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 font-mono text-xs">
                No orders placed yet. Customer checkout orders will populate here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400">
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Customer &amp; Phone</th>
                      <th className="py-3 px-3">Items</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr key={order._id || order.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3">
                          <span className="text-white font-bold block">{order.orderNumber || order.razorpayOrderId || order._id?.slice(-8)}</span>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{order.buyerName || order.shippingAddress?.fullName}</p>
                          <p className="text-[11px] text-amber-300">{order.buyerEmail || order.shippingAddress?.email}</p>
                        </td>
                        <td className="py-3 px-3">
                          {(order.items || []).map((it, idx) => (
                            <span key={idx} className="block text-neutral-300">
                              {it.quantity || 1}x {it.name}
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-300">
                          ₹{Number(order.total || 699).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {order.status || 'paid'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={order.status || 'paid'}
                            onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                            className="bg-[#090712] border border-white/20 text-white rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="paid">Paid</option>
                            <option value="consecrated">Consecrated</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PATRON CRM DIRECTORY                                               */}
        {/* ========================================================================= */}
        {activeTab === 'customers' && (
          <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-white">Patron &amp; Collector CRM</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#090712] border border-white/10 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-white">{c.name || c.full_name}</h4>
                  <p className="text-xs font-mono text-amber-300">{c.email}</p>
                  <p className="text-[11px] font-mono text-neutral-400">{c.phone || '+91'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SUPABASE RELATIONAL SCHEMA                                         */}
        {/* ========================================================================= */}
        {activeTab === 'supabase' && (
          <div className="bg-[#0e0a19] rounded-3xl border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-white">Supabase PostgreSQL Enterprise Schema</h2>
            <p className="text-xs text-neutral-400 font-mono">
              Execute this DDL directly in your Supabase SQL Editor to ensure all 8 tables and RLS policies are active.
            </p>
            <pre className="p-4 rounded-2xl bg-[#090712] border border-white/10 text-xs font-mono text-amber-300/90 overflow-x-auto max-h-96">
{`-- Sumuk Crystalz 8 Relational Tables DDL
-- View full file in supabase-schema.sql
CREATE TABLE IF NOT EXISTS public.users (...);
CREATE TABLE IF NOT EXISTS public.products (...);
CREATE TABLE IF NOT EXISTS public.orders (...);
CREATE TABLE IF NOT EXISTS public.order_items (...);
CREATE TABLE IF NOT EXISTS public.payments (...);
CREATE TABLE IF NOT EXISTS public.inventory (...);
CREATE TABLE IF NOT EXISTS public.shipping (...);
CREATE TABLE IF NOT EXISTS public.reviews (...);`}
            </pre>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0a19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white">Publish New Specimen</h3>
            <form onSubmit={handlePublishNewProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Specimen Name (e.g., Pyrite Golden Abundance Band)"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Subtitle (e.g., Natural 8mm AAA Pyrite & Citrine Beads)"
                value={newProduct.subtitle}
                onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  required
                  className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={newProduct.stockCount}
                  onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                  required
                  className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="btn-pill-primary px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {publishing ? 'Publishing...' : 'Publish to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0a19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white">Edit &ldquo;{editingProduct.name}&rdquo;</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  value={editingProduct.stockCount}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                  className="px-4 py-2.5 rounded-xl bg-[#090712] border border-white/15 text-xs text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-mono text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn-pill-primary px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0a19] border border-red-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Delete Specimen?</h3>
            <p className="text-xs font-mono text-neutral-400">
              Are you sure you want to remove &ldquo;{deletingProduct.name}&rdquo; from the vault?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 text-xs font-mono text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl border text-xs font-mono shadow-2xl flex items-center gap-2 ${
              t.type === 'error'
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : t.type === 'info'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
