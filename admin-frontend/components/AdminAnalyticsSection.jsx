'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
  Info,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  computeRevenueTrend,
  computeCategoryPerformance,
  computeOrderStatusDistribution,
} from '../lib/analyticsEngine';

// Modern SVG Interactive Area / Line Chart
function RevenueLineChart({ data = [], range, setRange }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const maxRevenue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.revenue), 1000);
    return Math.ceil(max * 1.15); // Add 15% head room
  }, [data]);

  const height = 240;
  const width = 600;
  const paddingX = 40;
  const paddingY = 30;

  const pointsString = useMemo(() => {
    if (data.length < 2) return '';
    return data
      .map((d, idx) => {
        const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
        const y = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, maxRevenue, width, height, paddingX, paddingY]);

  const areaString = useMemo(() => {
    if (data.length < 2) return '';
    const firstX = paddingX;
    const lastX = width - paddingX;
    const bottomY = height - paddingY;
    return `${firstX},${bottomY} ${pointsString} ${lastX},${bottomY}`;
  }, [data, pointsString, width, height, paddingX, paddingY]);

  return (
    <div className="space-y-4">
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            Revenue &amp; Sales Velocity Trend
          </div>
          <p className="text-[11px] text-stone-400">
            Real-time aggregate revenue computed across all valid patron transactions.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7D' },
            { id: '30d', label: '30D' },
            { id: '3m', label: '3M' },
            { id: '12m', label: '12M' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                range === r.id
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Frame */}
      <div className="relative w-full h-[260px] bg-stone-950/80 rounded-2xl border border-stone-800/80 p-2 overflow-hidden shadow-inner">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 px-8 py-7 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-b border-stone-600" />
          <div className="w-full border-b border-stone-600" />
          <div className="w-full border-b border-stone-600" />
          <div className="w-full border-b border-stone-600" />
        </div>

        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-stone-500">
            No order transactions recorded for this period.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Glowing Area Fill */}
            {areaString && (
              <polygon points={areaString} fill="url(#revenueGradient)" />
            )}

            {/* Main Smooth Line */}
            {pointsString && (
              <polyline
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
            )}

            {/* Interactive Data Points */}
            {data.map((d, idx) => {
              const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
              const y = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
              const isHovered = hoveredPoint === idx;

              return (
                <g key={idx} className="cursor-pointer">
                  {/* Outer glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="#D4AF37"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '6' : '3.5'}
                    fill="#F3E5AB"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredPoint !== null && data[hoveredPoint] && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-stone-900 border border-[#D4AF37]/50 shadow-2xl backdrop-blur-md text-center z-20 animate-in fade-in duration-150 pointer-events-none"
          >
            <div className="text-[10px] font-mono text-stone-400">
              {data[hoveredPoint].label}
            </div>
            <div className="text-xs font-bold text-[#F3E5AB]">
              ₹{data[hoveredPoint].revenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] font-mono text-emerald-400">
              {data[hoveredPoint].orders} orders
            </div>
          </div>
        )}

        {/* X Axis Date Labels */}
        <div className="absolute bottom-1.5 inset-x-8 flex justify-between text-[10px] font-mono text-stone-500 pointer-events-none">
          {data.length > 0 && <span>{data[0]?.label}</span>}
          {data.length > 4 && <span>{data[Math.floor(data.length / 2)]?.label}</span>}
          {data.length > 1 && <span>{data[data.length - 1]?.label}</span>}
        </div>
      </div>
    </div>
  );
}

// Donut Chart for Statuses
function OrderStatusDonut({ statusDistribution = [] }) {
  const total = statusDistribution.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-[#D4AF37]" />
          Order Status Breakdown
        </h4>
        <span className="text-[10px] font-mono text-stone-500">
          {total} Total Orders
        </span>
      </div>

      <div className="space-y-3">
        {statusDistribution.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-mono text-stone-400">
                  <strong className="text-stone-100">{item.count}</strong> ({percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Category Performance Widget
function CategoryPerformanceWidget({ categories = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
          Category Distribution &amp; Sales
        </h4>
        <span className="text-[10px] font-mono text-stone-500">
          {categories.length} Categories
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 pr-1">
        {categories.length === 0 ? (
          <div className="text-xs text-stone-500 text-center py-4">
            No category distribution available.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.name}
              className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-stone-200">{cat.name}</div>
                <div className="text-[10px] font-mono text-stone-500">
                  {cat.productCount} specimens • {cat.totalStock} units in vault
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#F3E5AB]">
                  ₹{cat.revenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  {cat.salesCount} sold
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inventory Health Gauge
function InventoryHealthWidget({ metrics = {} }) {
  const total = metrics.totalProducts || 1;
  const inStock = metrics.activeProducts || 0;
  const lowStock = metrics.lowStockCount || 0;
  const outOfStock = metrics.outOfStockCount || 0;

  const inStockPct = Math.round(((inStock - lowStock - outOfStock) / total) * 100) || 0;
  const lowStockPct = Math.round((lowStock / total) * 100) || 0;
  const outOfStockPct = Math.round((outOfStock / total) * 100) || 0;

  return (
    <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-[#F3E5AB] flex items-center gap-1.5">
          <Package className="w-4 h-4 text-[#D4AF37]" />
          Inventory Health Overview
        </h4>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
          {inStockPct}% Optimal
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-stone-800">
        <div
          style={{ width: `${Math.max(inStockPct, 5)}%` }}
          className="h-full bg-emerald-500 rounded-l-full"
          title={`In Stock: ${inStock - lowStock - outOfStock}`}
        />
        <div
          style={{ width: `${lowStockPct}%` }}
          className="h-full bg-amber-500"
          title={`Low Stock: ${lowStock}`}
        />
        <div
          style={{ width: `${outOfStockPct}%` }}
          className="h-full bg-rose-500 rounded-r-full"
          title={`Out of Stock: ${outOfStock}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
          <div className="text-[10px] font-mono text-emerald-400">In Stock</div>
          <div className="font-bold text-stone-100">{inStock - lowStock - outOfStock}</div>
        </div>
        <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
          <div className="text-[10px] font-mono text-amber-400">Low Stock</div>
          <div className="font-bold text-stone-100">{lowStock}</div>
        </div>
        <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-800/40">
          <div className="text-[10px] font-mono text-rose-400">Out of Stock</div>
          <div className="font-bold text-stone-100">{outOfStock}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsSection({
  orders = [],
  products = [],
  customers = [],
  metrics = {},
}) {
  const [revenueRange, setRevenueRange] = useState('30d');

  const revenueTrendData = useMemo(() => {
    return computeRevenueTrend(orders, revenueRange);
  }, [orders, revenueRange]);

  const categoryPerformance = useMemo(() => {
    return computeCategoryPerformance(products, orders);
  }, [products, orders]);

  const statusDistribution = useMemo(() => {
    return computeOrderStatusDistribution(orders);
  }, [orders]);

  return (
    <section className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A1612]/95 via-[#120F0D]/95 to-stone-950 border border-[#D4AF37]/30 backdrop-blur-2xl shadow-2xl">
        <RevenueLineChart
          data={revenueTrendData}
          range={revenueRange}
          setRange={setRevenueRange}
        />
      </div>

      {/* Grid of Specialized Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrderStatusDonut statusDistribution={statusDistribution} />
        <CategoryPerformanceWidget categories={categoryPerformance} />
        <InventoryHealthWidget metrics={metrics} />
      </div>
    </section>
  );
}
