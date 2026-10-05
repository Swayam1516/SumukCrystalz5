'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Truck, Check, AlertCircle, Save, Clock, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function OrderStatusModal({
  order = null,
  onClose,
  onSaveSuccess,
}) {
  if (!order) return null;

  const [status, setStatus] = useState(order.status || 'pending');
  const [carrier, setCarrier] = useState(order.carrier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || order.trackingNumber || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const items = Array.isArray(order.items) ? order.items : [];
  const totalAmount = Number(order.total || order.total_amount || order.subtotal || 0);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const orderId = order.id || order._id;

      // 1. Update Supabase
      const { data, error: supaErr } = await supabase
        .from('orders')
        .update({
          status,
          carrier: carrier.trim(),
          tracking_number: trackingNumber.trim(),
          updated_at: new Date().toISOString(),
          ...(status === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
          ...(status === 'shipped' ? { shipped_at: new Date().toISOString() } : {}),
          ...(status === 'cancelled' ? { cancelled_at: new Date().toISOString() } : {}),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (supaErr) {
        console.warn('Supabase order update notice:', supaErr);
      }

      // 2. Also try backend API
      if (API_BASE) {
        await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, carrier, trackingNumber }),
        }).catch(() => {});
      }

      const updated = {
        ...order,
        status,
        carrier,
        tracking_number: trackingNumber,
      };

      onSaveSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-xl w-full bg-[#141210] border border-[#D4AF37]/40 rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#F3E5AB]">
                Order #{order.order_number || order.orderId || 'ORD-001'}
              </h3>
              <p className="text-xs text-stone-400">
                {order.buyer_name || order.buyerName || 'Valued Patron'} • {order.buyer_email || order.buyerEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Breakdown */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
            <span className="text-stone-400 font-medium">Order Total</span>
            <span className="text-base font-bold text-[#F3E5AB]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {items.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                Ordered Items:
              </span>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-stone-300">
                  <span>
                    {item.name || item.product_name || item.title} (x{item.quantity || 1})
                  </span>
                  <span className="font-mono text-stone-400">
                    ₹{((item.unit_price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Fulfillment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
            >
              <option value="pending">🟡 Pending Payment / Confirmation</option>
              <option value="confirmed">🟣 Order Confirmed by Sanctum</option>
              <option value="processing">🔵 Processing &amp; Consecration</option>
              <option value="packed">📦 Packed in Vault</option>
              <option value="shipped">🚚 Shipped / In Transit</option>
              <option value="delivered">🟢 Delivered to Patron</option>
              <option value="cancelled">🔴 Cancelled</option>
              <option value="refunded">⚪ Refunded</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Carrier / Courier</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. BlueDart / Delhivery / DTDC"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">AWB / Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BD987654321IN"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Order Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
