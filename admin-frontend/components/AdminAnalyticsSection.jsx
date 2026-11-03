'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  PieChart,
  BarChart3,
  DollarSign,
  Sparkles,
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
          <div className="text-xs font-serif font-bold text-stone-900 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <DollarSign className="w-4 h-4" />
            </div>
            Revenue &amp; Sales Velocity Trend
          </div>
          <p className="text-[11px] text-stone-500">
            Real-time aggregate revenue computed across all valid patron transactions.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
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
              className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-medium transition-all ${
                range === r.id
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Frame */}
      <div className="relative w-full h-[260px] bg-stone-50/60 rounded-xl border border-stone-100 p-2 overflow-hidden shadow-inner">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 px-8 py-6 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-stone-400 w-full" />
          <div className="border-b border-stone-400 w-full" />
          <div className="border-b border-stone-400 w-full" />
          <div className="border-b border-stone-400 w-full" />
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          {areaString && <polygon points={areaString} fill="url(#revenueFill)" />}

          {/* Line Stroke */}
          {pointsString && (
            <polyline
              points={pointsString}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {data.map((d, idx) => {
            const x = paddingX + (idx / Math.max(data.length - 1, 1)) * (width - paddingX * 2);
            const y = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
            const isHovered = hoveredPoint === idx;

            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3.5}
                  className="fill-white stroke-purple-600 transition-all duration-200"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint !== null && data[hoveredPoint] && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-md text-xs font-sans pointer-events-none"
          >
            <div className="text-stone-500 text-[10px]">{data[hoveredPoint].label}</div>
            <div className="font-serif font-bold text-stone-900">
              ₹{Number(data[hoveredPoint].revenue).toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Donut Chart for Statuses
function OrderStatusDonut({ statusDistribution = [] }) {
  const total = statusDistribution.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="p-5 rounded-2xl bg-white/95 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-purple-50 text-purple-700">
            <PieChart className="w-3.5 h-3.5" />
          </div>
          Order Status Breakdown
        </h4>
        <span className="text-[10px] font-sans text-stone-500">
          {total} Total Orders
        </span>
      </div>

      <div className="space-y-3">
        {statusDistribution.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-sans text-stone-500 text-[11px]">
                  <strong className="text-stone-900">{item.count}</strong> ({percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
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
    <div className="p-5 rounded-2xl bg-white/95 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-amber-50 text-amber-700">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          Category Distribution &amp; Sales
        </h4>
        <span className="text-[10px] font-sans text-stone-500">
          {categories.length} Categories
        </span>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-200 pr-1">
        {categories.length === 0 ? (
          <div className="text-xs text-stone-400 text-center py-4">
            No category distribution available.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.name}
              className="p-3 rounded-xl bg-stone-50/70 border border-stone-100 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-stone-900">{cat.name}</div>
                <div className="text-[10px] font-sans text-stone-500">
                  {cat.productCount} specimens • {cat.totalStock} units in vault
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif font-bold text-stone-900">
                  ₹{cat.revenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] font-sans text-emerald-700 font-medium">
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
    <div className="p-5 rounded-2xl bg-white/95 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-700">
            <Package className="w-3.5 h-3.5" />
          </div>
          Inventory Health Overview
        </h4>
        <span className="text-[10px] font-sans text-emerald-700 font-semibold">
          {inStockPct}% Optimal
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-stone-200">
        <div
          style={{ width: `${Math.max(inStockPct, 5)}%` }}
          className="h-full bg-emerald-500 rounded-l-full"
          title={`In Stock: ${inStock - lowStock - outOfStock}`}
        />
        <div
          style={{ width: `${lowStockPct}%` }}
          className="h-full bg-amber-400"
          title={`Low Stock: ${lowStock}`}
        />
        <div
          style={{ width: `${outOfStockPct}%` }}
          className="h-full bg-rose-500 rounded-r-full"
          title={`Out of Stock: ${outOfStock}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="text-[10px] font-sans text-emerald-700 font-medium">In Stock</div>
          <div className="font-serif font-bold text-stone-900">{inStock - lowStock - outOfStock}</div>
        </div>
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
          <div className="text-[10px] font-sans text-amber-800 font-medium">Low Stock</div>
          <div className="font-serif font-bold text-stone-900">{lowStock}</div>
        </div>
        <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
          <div className="text-[10px] font-sans text-rose-700 font-medium">Out of Stock</div>
          <div className="font-serif font-bold text-stone-900">{outOfStock}</div>
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
      <div className="p-6 rounded-2xl bg-white/95 border border-stone-200/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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
