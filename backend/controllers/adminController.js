const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const orderService = require('../services/orderService');
const AppError = require('../utils/AppError');
const { LOW_STOCK_THRESHOLD } = require('../utils/constants');

/**
 * GET /api/admin/orders
 */
async function getAllOrders(req, res, next) {
  try {
    const { status, startDate, endDate } = req.query;
    let orders = [];

    try {
      const filter = {};
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      if (require('mongoose').connection.readyState === 1) {
        orders = await Order.find(filter)
          .sort({ createdAt: -1 })
          .populate('items.product', 'name images slug');
      } else {
        const { getSupabaseOrders } = require('../utils/supabase');
        orders = await getSupabaseOrders();
      }
    } catch (e) {
      const { getSupabaseOrders } = require('../utils/supabase');
      orders = await getSupabaseOrders();
    }

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/orders/:id/status
 */
async function updateStatus(req, res, next) {
  try {
    const { status, trackingNumber, carrier } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, {
      status,
      trackingNumber,
      carrier,
    });

    res.json({
      success: true,
      message: `Order status updated to "${order.status}".`,
      order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/inventory/low-stock
 * Alerts for items with total stock <= LOW_STOCK_THRESHOLD
 */
async function getLowStockAlerts(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold, 10) || LOW_STOCK_THRESHOLD;
    const lowStockProducts = await Product.find({
      totalStock: { $lte: threshold },
      isActive: true,
    }).sort({ totalStock: 1 });

    res.json({
      success: true,
      threshold,
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products
 */
async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products
 */
async function createProduct(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(payload);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 */
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 */
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      message: 'Product removed from treasury.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/customers
 */
async function getCustomers(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const customerMap = new Map();

    for (const order of orders) {
      const email = order.buyerEmail?.toLowerCase().trim();
      if (!email) continue;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email,
          fullName: order.buyerName || order.shippingAddress?.fullName || 'Collector',
          phone: order.shippingAddress?.phone || 'N/A',
          shippingAddress: order.shippingAddress || {},
          totalOrders: 0,
          totalSpent: 0,
          lastOrderAt: order.createdAt,
          orders: [],
        });
      }

      const cust = customerMap.get(email);
      cust.totalOrders += 1;
      cust.totalSpent += order.total || 0;
      cust.orders.push({
        id: order._id,
        status: order.status,
        total: order.total,
        date: order.createdAt,
      });
    }

    const customers = Array.from(customerMap.values());
    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOrders,
  updateStatus,
  updateOrderStatus: updateStatus,
  getLowStockAlerts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCustomers,
};

