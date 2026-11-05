'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  Check,
  AlertCircle,
  Save,
  Clock,
  Package,
  Sparkles,
  ExternalLink,
  Plus,
  Copy,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  supabase,
  getSupabaseDeliveryPartners,
  addSupabaseDeliveryPartner,
  getSupabaseOrderTracking,
  updateOrderTrackingMilestone,
  assignOrderDeliveryPartner,
  STAGE_CONFIGS,
} from '../lib/supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function OrderStatusModal({
  order = null,
  onClose,
  onSaveSuccess,
}) {
  if (!order) return null;

  const orderId = order.id || order._id || order.order_number;
  const orderNumber = order.order_number || order.orderId || 'SC5-2026-000001';

  // Overall Order Status & Tracking
  const [currentStage, setCurrentStage] = useState(order.current_stage || 'order_confirmed');
  const [orderStatus, setOrderStatus] = useState(order.order_status || order.status || 'confirmed');
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status || (order.status === 'paid' ? 'verified' : 'verified'));
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method || 'Razorpay');

  // Delivery Partner State
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(order.delivery_partner_id || '');
  const [selectedPartnerName, setSelectedPartnerName] = useState(order.delivery_partner_name || order.carrier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || order.awb_code || '');
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || '');
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState(
    order.estimated_delivery_at ? order.estimated_delivery_at.split('T')[0] : ''
  );
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(
    order.estimated_delivery_at && order.estimated_delivery_at.includes('T')
      ? order.estimated_delivery_at.split('T')[1].slice(0, 5)
      : '17:00'
  );
  const [estimatedDeliveryText, setEstimatedDeliveryText] = useState(order.estimated_delivery_text || '');

  // Add Partner Modal State
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');
  const [addingPartner, setAddingPartner] = useState(false);

  // Milestones State (6 stages)
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [auditCorrectionReason, setAuditCorrectionReason] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'courier' | 'items'

  const items = Array.isArray(order.items) ? order.items : (Array.isArray(order.order_items) ? order.order_items : []);
  const shippingAddress = order.shipping_address || order.shippingAddress || {};
  const subtotal = Number(order.subtotal || order.total_amount || 0);
  const shippingFee = Number(order.shipping_fee ?? order.shipping_charge ?? 0);
  const totalAmount = Number(order.total_amount || order.total || subtotal + shippingFee);

  // Load delivery partners and milestones on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const partners = await getSupabaseDeliveryPartners();
        if (isMounted) setDeliveryPartners(partners);

        const events = await getSupabaseOrderTracking(orderId);
        if (isMounted) {
          if (events && events.length > 0) {
            setMilestones(events);
          } else {
            // Default 6 milestones
            const defaults = STAGE_CONFIGS.map((cfg) => ({
              order_id: orderId,
              milestone_key: cfg.key,
              stage_number: cfg.stageNumber,
              title: cfg.title,
              description: cfg.description,
              location: cfg.location,
              status: cfg.key === 'order_confirmed' ? 'completed' : 'pending',
              admin_remarks: '',
              completed_at: cfg.key === 'order_confirmed' ? (order.confirmed_at || order.created_at) : null,
            }));
            setMilestones(defaults);
          }
        }
      } catch (err) {
        console.warn('Notice loading modal data:', err.message);
      } finally {
        if (isMounted) setLoadingMilestones(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // Auto-generate tracking URL when partner or tracking number changes
  useEffect(() => {
    if (!trackingNumber.trim()) return;
    const partner = deliveryPartners.find(
      (p) => p.id === selectedPartnerId || p.name.toLowerCase() === selectedPartnerName.toLowerCase()
    );
    if (partner?.tracking_url_template) {
      setTrackingUrl(partner.tracking_url_template.replace('{tracking_number}', trackingNumber.trim()));
    }
  }, [selectedPartnerId, selectedPartnerName, trackingNumber, deliveryPartners]);

  // Update a single milestone status in local state
  const handleMilestoneStatusChange = (milestoneKey, newStatus) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.milestone_key === milestoneKey
          ? {
              ...m,
              status: newStatus,
              ...(newStatus === 'completed' && !m.completed_at ? { completed_at: new Date().toISOString() } : {}),
            }
          : m
      )
    );
  };

  // Update milestone remarks
  const handleMilestoneRemarksChange = (milestoneKey, remarks) => {
    setMilestones((prev) =>
      prev.map((m) => (m.milestone_key === milestoneKey ? { ...m, admin_remarks: remarks } : m))
    );
  };

  // Copy tracking number
  const handleCopyTracking = () => {
    if (!trackingNumber) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  // Quick Add Delivery Partner
  const handleCreatePartner = async (e) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;
    setAddingPartner(true);
    try {
      const res = await addSupabaseDeliveryPartner({
        name: newPartnerName.trim(),
        tracking_url_template: newPartnerUrl.trim(),
      });
      if (res.success && res.partner) {
        setDeliveryPartners((prev) => [...prev, res.partner]);
        setSelectedPartnerId(res.partner.id);
        setSelectedPartnerName(res.partner.name);
        setNewPartnerName('');
        setNewPartnerUrl('');
        setShowAddPartnerModal(false);
      }
    } catch (err) {
      setError('Failed to add partner: ' + err.message);
    } finally {
      setAddingPartner(false);
    }
  };

  // Save changes to Supabase & Backend
  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const nowIso = new Date().toISOString();
      const combinedEstimatedDelivery = estimatedDeliveryAt
        ? `${estimatedDeliveryAt}T${estimatedDeliveryTime || '17:00'}:00.000Z`
        : null;

      // 1. Update each milestone in order_tracking_events
      for (const m of milestones) {
        await updateOrderTrackingMilestone(orderId, {
          milestoneKey: m.milestone_key,
          status: m.status,
          remarks: m.admin_remarks || '',
          adminName: 'Founder Admin',
          trackingNumber: trackingNumber.trim(),
          carrier: selectedPartnerName.trim(),
          estimatedDeliveryAt: combinedEstimatedDelivery,
          estimatedDeliveryText: estimatedDeliveryText.trim(),
        });
      }

      // 2. Assign Delivery Partner details to orders table
      if (selectedPartnerName || trackingNumber) {
        await assignOrderDeliveryPartner(orderId, {
          deliveryPartnerId: selectedPartnerId,
          deliveryPartnerName: selectedPartnerName.trim(),
          carrier: selectedPartnerName.trim(),
          trackingNumber: trackingNumber.trim(),
          trackingUrl: trackingUrl.trim(),
          estimatedDeliveryAt: combinedEstimatedDelivery,
          estimatedDeliveryText: estimatedDeliveryText.trim(),
          adminRemarks: auditCorrectionReason,
        });
      }

      // 3. Update orders table master status
      const orderPayloadUpdate = {
        order_status: orderStatus,
        status: orderStatus,
        payment_status: paymentStatus,
        current_stage: currentStage,
        delivery_partner_id: selectedPartnerId || null,
        delivery_partner_name: selectedPartnerName.trim() || null,
        carrier: selectedPartnerName.trim() || null,
        tracking_number: trackingNumber.trim() || null,
        tracking_url: trackingUrl.trim() || null,
        estimated_delivery_at: combinedEstimatedDelivery,
        estimated_delivery_text: estimatedDeliveryText.trim() || null,
        updated_at: nowIso,
      };

      await supabase.from('orders').update(orderPayloadUpdate).eq('id', orderId);

      // 4. Also call backend API endpoint if available
      if (API_BASE) {
        await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: orderStatus,
            carrier: selectedPartnerName,
            trackingNumber: trackingNumber,
            currentStage: currentStage,
          }),
        }).catch(() => {});
      }

      const updated = {
        ...order,
        ...orderPayloadUpdate,
      };

      onSaveSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Error saving order updates:', err);
      setError(err.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#141210] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl animate-in fade-in my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
                  Order #{orderNumber}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold">
                  {paymentStatus}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {order.buyer_name || order.buyerName || 'Valued Patron'} &bull; {order.buyer_email || order.buyerEmail} &bull; {order.buyer_phone || shippingAddress.phone || 'Phone verified'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800/80 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-500 block">Subtotal</span>
            <span className="font-bold text-stone-200">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-500 block">Shipping Charge</span>
            <span className={`font-bold ${shippingFee === 0 ? 'text-emerald-400' : 'text-stone-200'}`}>
              {shippingFee === 0 ? 'Free Delivery (₹0)' : `₹${shippingFee}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-500 block">Order Total</span>
            <span className="font-bold text-[#F3E5AB] text-sm">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-500 block">Payment Method</span>
            <span className="font-bold text-stone-200 uppercase">{paymentMethod}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 text-xs font-semibold gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`pb-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'milestones'
                ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>6-Stage Journey Milestones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courier')}
            className={`pb-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'courier'
                ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Courier &amp; Delivery Allocation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`pb-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'items'
                ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Specimens ({items.length})</span>
          </button>
        </div>

        {/* TAB 1: 6-STAGE MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-medium">
                Update customer order journey stages in real-time:
              </span>
              <span className="text-[11px] font-mono text-[#D4AF37]">
                Pune Sanctuary &bull; 432Hz Attunement
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div
                  key={m.milestone_key || idx}
                  className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2.5 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 border border-stone-700 text-[#D4AF37] font-bold text-[10px] flex items-center justify-center">
                        {m.stage_number || idx + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-stone-100">{m.title}</h4>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {m.location || 'Pune Sanctuary'}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill Selector */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      {['pending', 'in_progress', 'completed'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleMilestoneStatusChange(m.milestone_key, st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                            m.status === st
                              ? st === 'completed'
                                ? 'bg-emerald-500 text-black'
                                : st === 'in_progress'
                                ? 'bg-purple-600 text-white animate-pulse'
                                : 'bg-stone-700 text-white'
                              : 'bg-stone-900 text-stone-500 hover:text-stone-300 border border-stone-800'
                          }`}
                        >
                          {st === 'in_progress' ? 'In Progress' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remarks Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Optional remarks (e.g. Cleansed with Tibetan sound bowl, packaged in insured vault)"
                      value={m.admin_remarks || ''}
                      onChange={(e) => handleMilestoneRemarksChange(m.milestone_key, e.target.value)}
                      className="flex-1 bg-stone-900/90 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COURIER & DELIVERY ALLOCATION */}
        {activeTab === 'courier' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4 text-xs">
              
              {/* Delivery Partner Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-300">
                    Assigned Delivery Partner
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddPartnerModal(true)}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New Delivery Partner</span>
                  </button>
                </div>

                <select
                  value={selectedPartnerId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedPartnerId(pid);
                    const found = deliveryPartners.find((p) => p.id === pid);
                    if (found) {
                      setSelectedPartnerName(found.name);
                    }
                  }}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100"
                >
                  <option value="">Select Carrier Partner...</option>
                  {deliveryPartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking ID & Auto URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-stone-300">
                      Tracking / Delivery ID (AWB)
                    </label>
                    {trackingNumber && (
                      <button
                        type="button"
                        onClick={handleCopyTracking}
                        className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTracking ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. EKART99201882 or BD771920"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">
                    Live Tracking URL
                  </label>
                  <input
                    type="text"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="Auto-generated or custom tracking URL"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono"
                  />
                </div>
              </div>

              {/* Estimated Delivery Date & Time (Admin controlled, no fake 'Tomorrow 4 PM') */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDeliveryAt}
                    onChange={(e) => setEstimatedDeliveryAt(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">
                    Estimated Time Window
                  </label>
                  <input
                    type="time"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">
                    Display Text Note
                  </label>
                  <input
                    type="text"
                    value={estimatedDeliveryText}
                    onChange={(e) => setEstimatedDeliveryText(e.target.value)}
                    placeholder="e.g. Expected by 20 Nov 2026, 5:00 PM"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                  />
                </div>
              </div>

              {/* Destination Address Preview */}
              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Delivery Address:</span>
                </div>
                <p>
                  {shippingAddress.line1 || shippingAddress.address || 'Address'} {shippingAddress.line2 || ''}, {shippingAddress.city || 'City'}, {shippingAddress.state || 'State'} - {shippingAddress.postalCode || shippingAddress.pincode || 'Pincode'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
            {items.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No individual item records found. Total amount: ₹{totalAmount}
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-[#D4AF37]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-100">
                        {it.product_name || it.name || 'Consecrated Crystal'}
                      </h4>
                      <p className="text-[11px] text-stone-400 font-mono">
                        Qty: {it.quantity || 1} {it.variantLabel || it.bead_size ? `• ${it.variantLabel || it.bead_size}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#F3E5AB]">
                    ₹{Number((it.price || it.unit_price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-stone-400">Master Status:</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200"
            >
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing (Vedic Cleansing)</option>
              <option value="ready_for_dispatch">Ready for Dispatch (Packaging)</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Synchronize Timeline'}
            </button>
          </div>
        </div>

        {/* Add Delivery Partner Modal */}
        {showAddPartnerModal && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#181512] border border-[#D4AF37]/60 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h4 className="font-serif font-bold text-sm text-[#F3E5AB]">
                  Add New Delivery Partner
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-300">Partner / Courier Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    placeholder="e.g. DTDC Express, Shadowfax, Delhivery"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300">Tracking URL Template (Optional)</label>
                  <input
                    type="text"
                    value={newPartnerUrl}
                    onChange={(e) => setNewPartnerUrl(e.target.value)}
                    placeholder="e.g. https://www.dtdc.in/tracking/{tracking_number}"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-stone-500">
                    Use <code className="text-[#D4AF37]">{'{tracking_number}'}</code> as placeholder.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPartnerModal(false)}
                    className="flex-1 py-2 rounded-xl bg-stone-900 text-stone-300 hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingPartner}
                    className="flex-1 py-2 rounded-xl bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
                  >
                    {addingPartner ? 'Saving...' : 'Add Partner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
