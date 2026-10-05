/**
 * Analytics and KPI computation engine for Sumuk Crystalz Founder Portal.
 * Computes all metrics strictly from actual database records (orders, products, customers).
 */

export function computeDashboardMetrics(orders = [], products = [], customers = []) {
  // 1. Products Metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive !== false && p.active !== false).length;
  
  const outOfStockProducts = products.filter((p) => {
    const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 0);
    return stock <= 0;
  });

  const lowStockThreshold = 5;
  const lowStockProducts = products.filter((p) => {
    const stock = p.stockCount !== undefined ? p.stockCount : (p.totalStock !== undefined ? p.totalStock : 0);
    return stock > 0 && stock <= lowStockThreshold;
  });

  // 2. Orders Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ['pending', 'created'].includes((o.status || '').toLowerCase())).length;
  const processingOrders = orders.filter((o) => ['processing', 'paid', 'confirmed', 'packed'].includes((o.status || '').toLowerCase())).length;
  const deliveredOrders = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;
  const cancelledOrders = orders.filter((o) => ['cancelled', 'refunded', 'failed'].includes((o.status || '').toLowerCase())).length;

  // 3. Revenue Metrics
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let totalRevenue = 0;
  let todayRevenue = 0;
  let thisMonthRevenue = 0;

  orders.forEach((ord) => {
    const status = (ord.status || '').toLowerCase();
    // Count revenue for valid non-cancelled orders
    if (!['cancelled', 'refunded', 'failed'].includes(status)) {
      const amount = Number(ord.total || ord.total_amount || ord.subtotal || 0);
      totalRevenue += amount;

      const orderTime = new Date(ord.created_at || ord.createdAt || 0).getTime();
      if (orderTime >= todayStart) {
        todayRevenue += amount;
      }
      if (orderTime >= monthStart) {
        thisMonthRevenue += amount;
      }
    }
  });

  // 4. Customers Metrics
  const totalCustomers = customers.length || new Set(orders.map((o) => o.buyer_email || o.buyerEmail).filter(Boolean)).size;

  return {
    totalProducts,
    activeProducts,
    outOfStockCount: outOfStockProducts.length,
    outOfStockProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    todayRevenue,
    thisMonthRevenue,
    totalCustomers,
  };
}

/**
 * Computes chronological revenue trend data for charts
 */
export function computeRevenueTrend(orders = [], range = '30d') {
  const now = new Date();
  const points = [];

  let days = 30;

  if (range === 'today') {
    days = 1;
    // 6 intervals of 4 hours
    for (let h = 0; h < 24; h += 4) {
      const hourLabel = `${h.toString().padStart(2, '0')}:00`;
      points.push({ label: hourLabel, revenue: 0, orders: 0 });
    }
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    orders.forEach((ord) => {
      const ordDate = new Date(ord.created_at || ord.createdAt || 0);
      if (ordDate.getTime() >= todayStart && !['cancelled', 'refunded'].includes((ord.status || '').toLowerCase())) {
        const h = ordDate.getHours();
        const slotIdx = Math.min(Math.floor(h / 4), points.length - 1);
        const amount = Number(ord.total || ord.total_amount || ord.subtotal || 0);
        if (points[slotIdx]) {
          points[slotIdx].revenue += amount;
          points[slotIdx].orders += 1;
        }
      }
    });

    return points;
  }

  if (range === '7d') days = 7;
  else if (range === '30d') days = 30;
  else if (range === '3m') days = 90;
  else if (range === '12m') days = 365;

  const step = days > 90 ? 30 : days > 30 ? 7 : 1;
  const bucketCount = Math.ceil(days / step);

  for (let i = bucketCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * step);
    const label = days > 90
      ? d.toLocaleDateString('en-US', { month: 'short' })
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    points.push({ label, date: d, revenue: 0, orders: 0 });
  }

  orders.forEach((ord) => {
    if (['cancelled', 'refunded', 'failed'].includes((ord.status || '').toLowerCase())) return;
    const ordDate = new Date(ord.created_at || ord.createdAt || 0);
    const amount = Number(ord.total || ord.total_amount || ord.subtotal || 0);

    const diffDays = Math.floor((now.getTime() - ordDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < days) {
      const idx = Math.max(0, Math.min(bucketCount - 1, Math.floor((days - 1 - diffDays) / step)));
      if (points[idx]) {
        points[idx].revenue += amount;
        points[idx].orders += 1;
      }
    }
  });

  return points;
}

/**
 * Computes category distribution metrics
 */
export function computeCategoryPerformance(products = [], orders = []) {
  const categoryMap = {};

  products.forEach((p) => {
    const cat = p.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { name: cat, productCount: 0, totalStock: 0, salesCount: 0, revenue: 0 };
    }
    categoryMap[cat].productCount += 1;
    categoryMap[cat].totalStock += (p.stockCount || p.totalStock || 0);
  });

  orders.forEach((ord) => {
    if (['cancelled', 'refunded'].includes((ord.status || '').toLowerCase())) return;
    const items = Array.isArray(ord.items) ? ord.items : [];
    items.forEach((item) => {
      const matchingProd = products.find((p) => p.id === item.product_id || p.name === item.name || p.name === item.product_name);
      const cat = matchingProd?.category || 'Energy Bands';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, productCount: 0, totalStock: 0, salesCount: 0, revenue: 0 };
      }
      const qty = item.quantity || 1;
      const price = Number(item.unit_price || item.price || 0);
      categoryMap[cat].salesCount += qty;
      categoryMap[cat].revenue += qty * price;
    });
  });

  return Object.values(categoryMap).sort((a, b) => b.productCount - a.productCount);
}

/**
 * Computes order status breakdown
 */
export function computeOrderStatusDistribution(orders = []) {
  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((o) => {
    const s = (o.status || 'pending').toLowerCase();
    if (['pending', 'created'].includes(s)) statusCounts.pending += 1;
    else if (['processing', 'paid', 'confirmed', 'packed'].includes(s)) statusCounts.processing += 1;
    else if (['shipped', 'in_transit', 'out_for_delivery'].includes(s)) statusCounts.shipped += 1;
    else if (s === 'delivered') statusCounts.delivered += 1;
    else statusCounts.cancelled += 1;
  });

  return [
    { label: 'Delivered', count: statusCounts.delivered, color: '#10B981' },
    { label: 'Processing', count: statusCounts.processing, color: '#D4AF37' },
    { label: 'Pending', count: statusCounts.pending, color: '#F59E0B' },
    { label: 'Shipped', count: statusCounts.shipped, color: '#8B5CF6' },
    { label: 'Cancelled', count: statusCounts.cancelled, color: '#EF4444' },
  ];
}
