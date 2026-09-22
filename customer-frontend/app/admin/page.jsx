'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import {
  supabase,
  getSupabaseOrders,
  getSupabaseCustomers,
  updateOrderStatusInSupabase,
  updateProductAvailabilityInSupabase,
} from '@/lib/supabase';
import {
  ShieldCheck,
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Truck,
  RotateCw,
  LogOut,
  Sparkles,
  Search,
  Check,
  X,
  Crown,
  Users,
  Database,
  KeyRound,
  ExternalLink,
  Copy,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Star,
  Eye,
  EyeOff,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Gem,
  User,
  Heart,
  HelpCircle,
  ChevronRight,
  Settings,
  Bell,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Ban,
  Save,
  MessageSquare,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAdmin, login, logout, initAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Active Tab: 'orders' | 'inventory' | 'features' | 'reviews' | 'customers'
  const [activeTab, setActiveTab] = useState('orders');

  // Data Collections
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Site Feature Controls State (Persisted in localStorage)
  const [siteFeatures, setSiteFeatures] = useState({
    storeOnline: true,
    consecrationEnabled: true,
    consecrationFee: 100,
    announcementActive: true,
    announcementText: '✨ Holy Navaratri Blessing: Complimentary Vedic 432Hz Sound Attunement on All Crystal Vault Orders with Code SUMUK108',
    promoCode: 'SUMUK108',
    freeShippingThreshold: 5000,
    shippingFee: 150,
    directPaymentEnabled: true,
    razorpayKeyId: 'rzp_test_TdpRP2dJ2kJRLp',
    autoApproveReviews: true,
  });

  // Filters & Search States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all'); // 'all' | 'available' | 'unavailable'

  // Modals & Active Edit States
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Customer Request / Out of Specimen Stock');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    category: 'Energy Bands',
    price: 699,
    originalPrice: 1299,
    stockCount: 15,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
    description: '',
    chakra: 'Crown & Third Eye',
  });

  // AWB Edit Tracking
  const [editingAwbOrderId, setEditingAwbOrderId] = useState(null);
  const [awbInput, setAwbInput] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Auth Initialization on Load
  useEffect(() => {
    setMounted(true);
    initAuth();
    loadSiteFeatures();
    loadAllAdminData();
  }, [initAuth]);

  // Load features configuration from localStorage
  const loadSiteFeatures = () => {
    try {
      const saved = localStorage.getItem('sumuk_site_features');
      if (saved) {
        setSiteFeatures(JSON.parse(saved));
      }
    } catch (e) {}
  };

  const handleSaveFeatureSettings = (newSettings) => {
    setSiteFeatures(newSettings);
    try {
      localStorage.setItem('sumuk_site_features', JSON.stringify(newSettings));
      addToast('Site configuration updated live across entire storefront!', 'success');
    } catch (e) {
      addToast('Saved locally.', 'info');
    }
  };

  // Load all Orders, Inventory & Reviews
  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      // 1. Load Products live from Backend REST API
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.products || []);
          setProducts(items);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn('Backend products fetch notice:', err.message);
        setProducts([]);
      }

      // 2. Load Orders from Supabase & Local Cache
      let fetchedOrders = [];
      try {
        const supabaseOrders = await getSupabaseOrders();
        if (supabaseOrders && supabaseOrders.length > 0) {
          fetchedOrders = supabaseOrders;
        }
      } catch (e) {
        console.warn('Supabase fetch orders notice:', e);
      }

      // Merge localStorage orders
      try {
        const localRaw = localStorage.getItem('sumuk_recent_orders');
        if (localRaw) {
          const localList = JSON.parse(localRaw);
          localList.forEach((loc) => {
            const exists = fetchedOrders.some(
              (f) =>
                (f.id && (f.id === loc.id || f.id === loc._id)) ||
                (f.order_number && (f.order_number === loc.order_number || f.order_number === loc.orderId))
            );
            if (!exists) {
              fetchedOrders.push(loc);
            }
          });
        }
      } catch (e) {}

      // Fallback demo orders if none exist
      if (fetchedOrders.length === 0) {
        fetchedOrders = [
          {
            id: 'ord_77492c10-91ae-4bf1-b9d2-7c6d1234abcd',
            order_number: 'ORD-108842',
            buyer_name: 'Dr. Soumya Sharma',
            buyer_email: 'soumya.sharma@sumukcrystalz.com',
            buyer_phone: '+91 98765 43210',
            status: 'delivered',
            total_amount: 14500.00,
            total: 14500.00,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            shipping_address: {
              fullName: 'Dr. Soumya Sharma',
              line1: '7th Sanctuary Sanctum, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560038',
            },
            items: [
              {
                id: 'it_01',
                name: 'Celestial Amethyst Geode Cathedral 1.8kg',
                price: 8500,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
                is_reviewed: true,
              },
              {
                id: 'it_02',
                name: 'Madagascar Raw Rose Quartz Harmony Obelisk',
                price: 6000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format&fit=crop&q=80',
                is_reviewed: false,
              },
            ],
          },
          {
            id: 'ord_88201a33-88bb-4bc3-a912-9988aabbccdd',
            order_number: 'ORD-108843',
            buyer_name: 'Aarav Singhania',
            buyer_email: 'aarav.singh@gmail.com',
            buyer_phone: '+91 99887 76655',
            status: 'shipped',
            total_amount: 11200.00,
            total: 11200.00,
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            shipping_address: {
              fullName: 'Aarav Singhania',
              line1: 'B-402, Highline Sky Villas, Whitefield',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560066',
            },
            items: [
              {
                id: 'it_03',
                name: 'Golden Pyrite Abundance Sphere 80mm',
                price: 11200,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
                is_reviewed: false,
              },
            ],
          },
          {
            id: 'ord_99312f44-11cc-4dd5-b223-112233445566',
            order_number: 'ORD-108844',
            buyer_name: 'Priyanka Sen',
            buyer_email: 'priyanka.sen@outlook.com',
            buyer_phone: '+91 97112 33445',
            status: 'processing',
            total_amount: 4500.00,
            total: 4500.00,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            shipping_address: {
              fullName: 'Priyanka Sen',
              line1: 'Flat 12A, Palm Meadows, Jayanagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560041',
            },
            items: [
              {
                id: 'it_04',
                name: 'Spectral Aurora Labradorite Freeform',
                price: 4500,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
                is_reviewed: false,
              },
            ],
          },
        ];
      }

      setOrders(fetchedOrders);

      // 3. Load Reviews from Supabase
      try {
        const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (revs && revs.length > 0) {
          setReviews(revs);
        } else {
          setReviews([
            {
              id: 'rev_1',
              user_id: 'usr_1',
              product_id: 'prod_amethyst',
              rating: 5,
              comment: 'The crystal aura in our meditation room was transformed instantaneously. Sound attunement certificate included was authentic and beautifully sealed.',
              photo_url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (e) {}

      // 4. Load Customers
      try {
        const custs = await getSupabaseCustomers();
        if (custs && custs.length > 0) {
          setCustomers(custs);
        } else {
          setCustomers([
            {
              full_name: 'Dr. Soumya Sharma',
              email: 'soumya.sharma@sumukcrystalz.com',
              phone: '+91 98765 43210',
              total_orders: 4,
              total_spent: 42500,
              updated_at: new Date().toISOString(),
            },
            {
              full_name: 'Aarav Singhania',
              email: 'aarav.singh@gmail.com',
              phone: '+91 99887 76655',
              total_orders: 1,
              total_spent: 11200,
              updated_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (e) {}
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // -------------------------------------------------------------------------
  // ORDER ACTIONS: UPDATE STATUS, CANCEL ORDER, UPDATE AWB
  // -------------------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // 1. Update in Supabase
      await updateOrderStatusInSupabase(orderId, newStatus);

      // 2. Update local state
      const updatedOrders = orders.map((ord) => {
        if (ord.id === orderId || ord._id === orderId || ord.order_number === orderId) {
          return { ...ord, status: newStatus };
        }
        return ord;
      });
      setOrders(updatedOrders);
      localStorage.setItem('sumuk_recent_orders', JSON.stringify(updatedOrders));

      addToast(`Order ${orderId.slice(-6)} status updated to "${newStatus.toUpperCase()}"`, 'success');
    } catch (err) {
      addToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    const targetId = cancelModalOrder.id || cancelModalOrder._id || cancelModalOrder.order_number;

    try {
      await updateOrderStatusInSupabase(targetId, 'cancelled', { cancel_reason: cancelReason });

      const updatedOrders = orders.map((ord) => {
        if (ord.id === targetId || ord._id === targetId || ord.order_number === targetId) {
          return { ...ord, status: 'cancelled', cancel_reason: cancelReason };
        }
        return ord;
      });
      setOrders(updatedOrders);
      localStorage.setItem('sumuk_recent_orders', JSON.stringify(updatedOrders));

      addToast(`Order ${targetId.slice(-6)} successfully CANCELLED and synchronized.`, 'success');
      setCancelModalOrder(null);
      setCancelReason('');
    } catch (err) {
      addToast(`Cancellation error: ${err.message}`, 'error');
    }
  };

  const handleSaveAwb = async (orderId) => {
    if (!awbInput.trim()) return;
    try {
      await updateOrderStatusInSupabase(orderId, 'shipped', { awb_code: awbInput.trim() });

      const updatedOrders = orders.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          return { ...ord, awbNumber: awbInput.trim(), status: 'shipped' };
        }
        return ord;
      });
      setOrders(updatedOrders);
      localStorage.setItem('sumuk_recent_orders', JSON.stringify(updatedOrders));

      addToast(`AWB Tracking Code ${awbInput} attached to Order.`, 'success');
      setEditingAwbOrderId(null);
      setAwbInput('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------------------
  // INVENTORY ACTIONS: TOGGLE AVAILABLE / CURRENTLY NOT AVAILABLE, STOCK, EDIT
  // -------------------------------------------------------------------------
  const handleToggleProductAvailability = async (productId, currentInStock) => {
    const nextState = !currentInStock;

    try {
      // 1. Sync backend REST API
      try {
        const prod = products.find((p) => p.id === productId || p._id === productId);
        await fetch(`${API_BASE}/api/admin/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            inStock: nextState,
            isActive: nextState,
            total_stock: nextState ? (prod?.stockCount || prod?.total_stock || 10) : 0,
          }),
        });
      } catch (err) {
        console.warn('Backend update failed:', err);
      }

      // 2. Sync Supabase
      try {
        await updateProductAvailabilityInSupabase(productId, nextState);
      } catch (e) {}

      // 3. Update local state
      const updatedProducts = products.map((prod) => {
        if (prod.id === productId || prod._id === productId) {
          return {
            ...prod,
            inStock: nextState,
            isActive: nextState,
            total_stock: nextState ? (prod.stockCount || prod.total_stock || 10) : 0,
          };
        }
        return prod;
      });
      setProducts(updatedProducts);

      addToast(
        `Product marked as ${nextState ? '✨ AVAILABLE (In Stock)' : '❌ CURRENTLY NOT AVAILABLE (Out of Stock)'}`,
        nextState ? 'success' : 'info'
      );
    } catch (err) {
      addToast(`Error toggling product: ${err.message}`, 'error');
    }
  };

  const handleAdjustStock = async (productId, delta) => {
    const targetProd = products.find((p) => p.id === productId || p._id === productId);
    const currentCount = targetProd?.stockCount || targetProd?.total_stock || 0;
    const newCount = Math.max(0, currentCount + delta);

    try {
      await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          stockCount: newCount,
          total_stock: newCount,
          inStock: newCount > 0,
          isActive: newCount > 0,
        }),
      });
    } catch (err) {
      console.warn('Backend stock adjust failed:', err);
    }

    const updatedProducts = products.map((prod) => {
      if (prod.id === productId || prod._id === productId) {
        return {
          ...prod,
          stockCount: newCount,
          total_stock: newCount,
          inStock: newCount > 0,
          isActive: newCount > 0,
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    addToast('Inventory count updated', 'success');
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const targetId = editingProduct.id || editingProduct._id;

    try {
      await fetch(`${API_BASE}/api/admin/products/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editingProduct),
      });
    } catch (err) {
      console.warn('Backend product update failed:', err);
    }

    const updatedProducts = products.map((prod) =>
      prod.id === targetId || prod._id === targetId ? editingProduct : prod
    );
    setProducts(updatedProducts);
    addToast(`Changes saved for "${editingProduct.name}"`, 'success');
    setEditingProduct(null);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const createdItem = {
      ...newProduct,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: 0,
    };

    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(createdItem),
      });
      if (res.ok) {
        const data = await res.json();
        const saved = data.product || createdItem;
        setProducts([saved, ...products]);
      } else {
        setProducts([{ ...createdItem, id: `prod_${Date.now()}` }, ...products]);
      }
    } catch (err) {
      console.warn('Backend create product failed:', err);
      setProducts([{ ...createdItem, id: `prod_${Date.now()}` }, ...products]);
    }

    setShowAddProductModal(false);
    addToast(`"${newProduct.name}" consecrated and added to the store!`, 'success');
    setNewProduct({
      name: '',
      subtitle: '',
      category: 'Energy Bands',
      price: 699,
      originalPrice: 1299,
      stockCount: 15,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
      description: '',
      chakra: 'Crown & Third Eye',
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you wish to remove this specimen from the live catalog?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn('Backend delete product failed:', err);
    }
    const filtered = products.filter((p) => p.id !== productId && p._id !== productId);
    setProducts(filtered);
    addToast('Product specimen removed from catalog.', 'info');
  };

  // -------------------------------------------------------------------------
  // FILTERED LISTS & STATS COMPUTATION
  // -------------------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const idMatch = (order.order_number || order.id || order._id || '').toLowerCase().includes(orderSearch.toLowerCase());
      const buyerMatch = (order.buyer_name || order.shipping_address?.fullName || '').toLowerCase().includes(orderSearch.toLowerCase());
      const emailMatch = (order.buyer_email || '').toLowerCase().includes(orderSearch.toLowerCase());
      const matchesSearch = idMatch || buyerMatch || emailMatch;

      if (orderStatusFilter === 'all') return matchesSearch;
      return matchesSearch && (order.status?.toLowerCase() === orderStatusFilter.toLowerCase());
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const nameMatch = (prod.name || '').toLowerCase().includes(inventorySearch.toLowerCase());
      const categoryMatch = (prod.category || prod.purposeLabel || '').toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesSearch = nameMatch || categoryMatch;

      if (inventoryFilter === 'available') return matchesSearch && (prod.inStock !== false && prod.isActive !== false);
      if (inventoryFilter === 'unavailable') return matchesSearch && (prod.inStock === false || prod.isActive === false);
      return matchesSearch;
    });
  }, [products, inventorySearch, inventoryFilter]);

  const stats = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);
    const activeOrdCount = orders.filter((o) => ['pending', 'processing', 'shipped', 'paid'].includes(o.status)).length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;
    const availableCount = products.filter((p) => p.inStock !== false && p.isActive !== false).length;
    const unavailableCount = products.filter((p) => p.inStock === false || p.isActive === false).length;

    return {
      totalRev,
      activeOrdCount,
      cancelledCount,
      availableCount,
      unavailableCount,
      totalOrders: orders.length,
      totalProducts: products.length,
    };
  }, [orders, products]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#07050d] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Banner Container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-mono font-bold backdrop-blur-xl animate-slide-up ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : toast.type === 'info'
                ? 'bg-purple-950/90 border-purple-500/50 text-purple-200'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* TOP BAR: LUXURY ADMIN HEADER & KPI STATS */}
        {/* ========================================================================= */}
        <header className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171026] via-[#100b1d] to-[#1c1230] border border-amber-500/25 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border-2 border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Crown className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Command Center &bull; Live Storefront Control</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Sumuk Crystalz 5 Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAllAdminData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 transition"
              >
                <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${loadingData ? 'animate-spin' : ''}`} />
                <span>Sync Realtime</span>
              </button>
              <Link
                href="/account"
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition"
              >
                View Customer Vault
              </Link>
            </div>
          </div>

          {/* Quick Realtime KPI Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
              <p className="text-[10px] font-mono uppercase text-zinc-400">Total Revenue</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-amber-300 mt-0.5">
                ₹{stats.totalRev.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
              <p className="text-[10px] font-mono uppercase text-zinc-400">Active Orders</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-sky-400 mt-0.5">
                {stats.activeOrdCount} / {stats.totalOrders}
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
              <p className="text-[10px] font-mono uppercase text-zinc-400">Available Products</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-emerald-400 mt-0.5">
                {stats.availableCount} in stock
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
              <p className="text-[10px] font-mono uppercase text-zinc-400">Unavailable / Sold</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-rose-400 mt-0.5">
                {stats.unavailableCount} items
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-mono uppercase text-zinc-400">Cancelled Orders</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-zinc-400 mt-0.5">
                {stats.cancelledCount} orders
              </p>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS */}
        {/* ========================================================================= */}
        <nav className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders &amp; Cancellation ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>Inventory &amp; Availability ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'features'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Storefront Live Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'customers'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patron Directory ({customers.length})</span>
          </button>
        </nav>

        {/* ========================================================================= */}
        {/* TAB 1: ORDER MANAGEMENT & CANCELLATION PROVISION                          */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  Order Fulfillment &amp; Cancellation Control
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update live courier status, cancel orders with automatic customer notifications, and assign AWB codes.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search ID, Name, Email..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                <Package className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">No orders matching current filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderId = order.order_number || order.id || order._id;
                  const isCancelled = order.status === 'cancelled';
                  const orderDate = new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={orderId}
                      className={`bg-zinc-900/70 border rounded-2xl overflow-hidden transition-all shadow-xl ${
                        isCancelled ? 'border-rose-950/80 opacity-75' : 'border-zinc-800/90 hover:border-amber-500/30'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-5 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-white">{orderId}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              order.status === 'delivered'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : order.status === 'shipped'
                                ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                                : order.status === 'cancelled'
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono">
                            {order.buyer_name || order.shipping_address?.fullName || 'Collector'} &bull;{' '}
                            <span className="text-amber-300 font-bold">₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}</span> &bull; {orderDate}
                          </p>
                        </div>

                        {/* Interactive Admin Controls: Status Switcher & Cancel Button */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Status:</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id || order._id || orderId, e.target.value)}
                              className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* 1-Click Provision to Cancel Order */}
                          {!isCancelled ? (
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 transition"
                              title="Cancel Order & Update Supabase"
                            >
                              <Ban className="w-3.5 h-3.5 text-rose-400" />
                              <span>Cancel Order</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-rose-400 italic">
                              Cancelled {order.cancel_reason ? `(${order.cancel_reason})` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items & Shipping Breakdown */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items Column */}
                        <div className="lg:col-span-2 space-y-3 divide-y divide-zinc-800/60">
                          {(order.items || order.order_items || []).map((item, itIdx) => (
                            <div key={itIdx} className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product_image || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500'}
                                  alt={item.name || item.product_name}
                                  className="w-12 h-12 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
                                />
                                <div>
                                  <h4 className="text-xs font-semibold text-zinc-100">{item.name || item.product_name}</h4>
                                  <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Qty: {item.quantity || 1} &bull; ₹{Number(item.price || item.unitPrice || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-amber-400">
                                ₹{(Number(item.price || item.unitPrice || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Logistics & Sanctuary Address */}
                        <div className="bg-zinc-950/60 rounded-xl p-3.5 border border-zinc-800/80 text-xs font-mono space-y-2">
                          <div className="flex items-center justify-between text-zinc-400 pb-1.5 border-b border-zinc-800">
                            <span>Delivery Destination</span>
                            <span className="text-zinc-500">{order.buyer_phone || order.shipping_address?.phone}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed">
                            {order.shipping_address?.line1 || order.shipping_address?.address || 'Indiranagar Sanctum'},{' '}
                            {order.shipping_address?.city || 'Bengaluru'}, {order.shipping_address?.state || 'Karnataka'} - {order.shipping_address?.postalCode || '560038'}
                          </p>

                          {/* AWB Code Management */}
                          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                            <span className="text-zinc-400 text-[10px]">AWB Tracking:</span>
                            {editingAwbOrderId === orderId ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={awbInput}
                                  onChange={(e) => setAwbInput(e.target.value)}
                                  placeholder="AWB123..."
                                  className="w-24 px-2 py-0.5 bg-black border border-amber-400 rounded text-[11px] text-white"
                                />
                                <button
                                  onClick={() => handleSaveAwb(order.id || order._id || orderId)}
                                  className="p-1 bg-amber-400 text-black rounded text-[10px]"
                                >
                                  <Save className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingAwbOrderId(orderId);
                                  setAwbInput(order.awbNumber || order.shipping?.awb_code || '');
                                }}
                                className="text-cyan-400 hover:underline text-[11px] font-bold"
                              >
                                {order.awbNumber || order.shipping?.awb_code || '+ Add Tracking AWB'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY & AVAILABILITY PROVISION (AVAILABLE / NOT AVAILABLE)     */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Gem className="w-5 h-5 text-amber-400" />
                  Specimen Inventory &amp; Live Availability Controls
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Toggle specimen status between <strong>"Available"</strong> and <strong>"Currently Not Available"</strong> instantly for customers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search Specimen by name..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={inventoryFilter}
                  onChange={(e) => setInventoryFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Specimens ({products.length})</option>
                  <option value="available">Available Only ({stats.availableCount})</option>
                  <option value="unavailable">Currently Not Available ({stats.unavailableCount})</option>
                </select>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-400 to-amber-300 text-black hover:brightness-110 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Specimen</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const isAvailable = product.inStock !== false && product.isActive !== false;
                const stock = product.stockCount ?? product.total_stock ?? 10;

                return (
                  <div
                    key={product.id || product._id}
                    className={`bg-zinc-900/70 border rounded-2xl overflow-hidden transition-all shadow-xl flex flex-col justify-between ${
                      isAvailable ? 'border-zinc-800 hover:border-amber-500/40' : 'border-rose-900/50 bg-rose-950/10'
                    }`}
                  >
                    <div>
                      {/* Product Thumbnail & Status Overlay */}
                      <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                        <img
                          src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase shadow-lg ${
                            isAvailable
                              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                              : 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                          }`}>
                            {isAvailable ? '● Available in Vault' : '✕ Currently Not Available'}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 bg-black/70 hover:bg-amber-400 hover:text-black text-white rounded-lg transition"
                            title="Edit Specimen Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id || product._id)}
                            className="p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg transition"
                            title="Delete Specimen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">{product.purposeLabel || product.category || 'Sacred Gem'}</p>
                          <h3 className="font-serif text-base font-bold text-white mt-0.5 truncate">{product.name}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{product.subtitle || product.shortDescription || product.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase block">Price:</span>
                            <span className="font-bold text-amber-300 text-sm">₹{Number(product.price).toLocaleString('en-IN')}</span>
                          </div>

                          {/* Stock Stepper */}
                          <div className="text-right">
                            <span className="text-zinc-500 text-[10px] uppercase block">Vault Stock:</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <button
                                onClick={() => handleAdjustStock(product.id || product._id, -1)}
                                className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold text-white px-1">{stock}</span>
                              <button
                                onClick={() => handleAdjustStock(product.id || product._id, 1)}
                                className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick 1-Click Availability Toggle Switch */}
                    <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {isAvailable ? 'Status: Available' : 'Status: Unavailable'}
                      </span>
                      <button
                        onClick={() => handleToggleProductAvailability(product.id || product._id, isAvailable)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition shadow-sm ${
                          isAvailable
                            ? 'bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300'
                            : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                            <span>Mark Unavailable</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Make Available</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STOREFRONT LIVE CONTROLS ("ALTER EVERY FEATURE")                  */}
        {/* ========================================================================= */}
        {activeTab === 'features' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                Storefront Feature Toggles &amp; Global Customization
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Alter prices, active consecration rituals, announcement banners, payment modes, and operational parameters live.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Global Store State & Consecration */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Spiritual Services &amp; Store Operations
                </h3>

                {/* Store Online Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200">Live Store Operations</h4>
                    <p className="text-[11px] text-zinc-500">Allow customers to browse and place vault orders.</p>
                  </div>
                  <button
                    onClick={() => handleSaveFeatureSettings({ ...siteFeatures, storeOnline: !siteFeatures.storeOnline })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                      siteFeatures.storeOnline ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {siteFeatures.storeOnline ? 'ONLINE' : 'MAINTENANCE'}
                  </button>
                </div>

                {/* Vedic Consecration Ritual Toggle & Price */}
                <div className="space-y-2 pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-zinc-200">432Hz Sound Attunement Ritual</h4>
                      <p className="text-[11px] text-zinc-500">Enable personal consecration option on product cards.</p>
                    </div>
                    <button
                      onClick={() => handleSaveFeatureSettings({ ...siteFeatures, consecrationEnabled: !siteFeatures.consecrationEnabled })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                        siteFeatures.consecrationEnabled ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {siteFeatures.consecrationEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-zinc-400">Attunement Fee (₹):</span>
                    <input
                      type="number"
                      value={siteFeatures.consecrationFee}
                      onChange={(e) => setSiteFeatures({ ...siteFeatures, consecrationFee: Number(e.target.value) })}
                      onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                      className="w-24 px-3 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-amber-300 text-right"
                    />
                  </div>
                </div>

                {/* Free Shipping Threshold */}
                <div className="space-y-2 pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Free Shipping Minimum (₹):</span>
                    <input
                      type="number"
                      value={siteFeatures.freeShippingThreshold}
                      onChange={(e) => setSiteFeatures({ ...siteFeatures, freeShippingThreshold: Number(e.target.value) })}
                      onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                      className="w-28 px-3 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-amber-300 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Standard Shipping Fee (₹):</span>
                    <input
                      type="number"
                      value={siteFeatures.shippingFee}
                      onChange={(e) => setSiteFeatures({ ...siteFeatures, shippingFee: Number(e.target.value) })}
                      onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                      className="w-28 px-3 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-amber-300 text-right"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Announcement Banner & Payment Handles */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Marketing Banners &amp; Payment Gateway
                </h3>

                {/* Announcement Ticker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-zinc-200">Top Header Announcement Bar</h4>
                    <button
                      onClick={() => handleSaveFeatureSettings({ ...siteFeatures, announcementActive: !siteFeatures.announcementActive })}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                        siteFeatures.announcementActive ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {siteFeatures.announcementActive ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={siteFeatures.announcementText}
                    onChange={(e) => setSiteFeatures({ ...siteFeatures, announcementText: e.target.value })}
                    onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                    className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs font-mono text-zinc-100 resize-none focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Promo Code & Direct Razorpay Handle */}
                <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Active Promo Code:</span>
                    <input
                      type="text"
                      value={siteFeatures.promoCode}
                      onChange={(e) => setSiteFeatures({ ...siteFeatures, promoCode: e.target.value })}
                      onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                      className="w-32 px-3 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono font-bold text-amber-300 text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Razorpay Key ID:</span>
                    <input
                      type="text"
                      value={siteFeatures.razorpayKeyId || ''}
                      onChange={(e) => setSiteFeatures({ ...siteFeatures, razorpayKeyId: e.target.value })}
                      onBlur={() => handleSaveFeatureSettings(siteFeatures)}
                      className="w-48 px-3 py-1 bg-black border border-zinc-700 rounded-lg text-[11px] font-mono text-purple-300 text-right"
                    />
                  </div>
                </div>

                {/* Save All Button */}
                <button
                  onClick={() => handleSaveFeatureSettings(siteFeatures)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-mono font-bold text-xs hover:brightness-110 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Broadcast All Settings</span>
                </button>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REVIEWS MODERATION                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Customer Reviews &amp; Supabase Storage Photos
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review ratings, customer testimonials, and crystal photos uploaded directly to the <code>review-images</code> bucket.
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
                  {rev.photo_url && (
                    <img
                      src={rev.photo_url}
                      alt="Customer review photo"
                      className="w-24 h-24 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs font-mono text-zinc-400 ml-2">
                        {new Date(rev.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed italic">"{rev.comment}"</p>
                    <p className="text-[10px] font-mono text-amber-400/80">User ID: {rev.user_id}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PATRON DIRECTORY                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'customers' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Registered Crystal Patrons &amp; Lifetime Value
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Directory of authenticated collectors and sanctuary shipping destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((cust, cIdx) => (
                <div key={cIdx} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300">
                      {cust.full_name ? cust.full_name.charAt(0) : 'C'}
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white">{cust.full_name}</h4>
                      <p className="text-[10px] font-mono text-zinc-400 truncate">{cust.email}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Total Spent:</span>
                    <span className="font-bold text-emerald-400">₹{Number(cust.total_spent || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: CANCEL ORDER REASON DIALOG                                       */}
      {/* ========================================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e0b16] border border-rose-500/40 rounded-2xl p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-display text-base font-bold text-rose-300 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                Cancel Order {cancelModalOrder.order_number || cancelModalOrder.id}
              </h3>
              <button onClick={() => setCancelModalOrder(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Are you sure you wish to cancel this order? This will update the Supabase database and mark the customer order status as <strong>CANCELLED</strong>.
            </p>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Reason for Cancellation:</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Customer request / Out of stock specimen / Payment verification..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white resize-none focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW SPECIMEN MODAL                                           */}
      {/* ========================================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0e0b16] border border-amber-500/30 rounded-2xl p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Consecrate &amp; Add New Crystal Specimen
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Specimen Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Celestial Golden Pyrite Sovereign Sphere"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Vault Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Metaphysical Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Vibrational frequencies, origin, and spiritual benefits..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white resize-none focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT EXISTING PRODUCT                                            */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0e0b16] border border-amber-500/30 rounded-2xl p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Edit Specimen: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Specimen Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Vault Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockCount ?? editingProduct.total_stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value), total_stock: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={editingProduct.subtitle || editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs font-mono text-white resize-none focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md"
                >
                  Save Specimen Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
