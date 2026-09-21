const AppError = require('../utils/AppError');
const { LOW_STOCK_THRESHOLD } = require('../utils/constants');
const {
  supabase,
  getSupabaseOrders,
  getSupabaseCustomers,
} = require('../utils/supabase');
const orderService = require('../services/orderService');
const {
  getSupabaseAllProducts,
  getSupabaseProductBySlugOrId,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
} = require('../utils/supabaseProductService');

/**
 * GET /api/admin/orders
 */
async function getAllOrders(req, res, next) {
  try {
    let orders = [];
    if (supabase) {
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
async function updateOrderStatus(req, res, next) {
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
 */
async function getLowStockAlerts(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold, 10) || LOW_STOCK_THRESHOLD;
    const allProducts = await getSupabaseAllProducts({ includeInactive: true });
    const lowStock = allProducts.filter((p) => (p.stockCount || p.totalStock || 0) <= threshold);

    res.json({
      success: true,
      threshold,
      count: lowStock.length,
      products: lowStock,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products
 * Retrieve all products for admin management table directly from Supabase
 */
async function getAllProducts(req, res, next) {
  try {
    const products = await getSupabaseAllProducts({ includeInactive: true });

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
 * Permanently create product, variants, and images directly in Supabase Cloud Database
 */
async function createProduct(req, res, next) {
  try {
    const payload = req.body;

    if (!payload.name && !payload.title) {
      return next(new AppError('Product name is required.', 400));
    }

    const created = await createSupabaseProduct(payload);

    res.status(201).json({
      success: true,
      message: 'Product permanently created in Supabase database.',
      product: created,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 * Permanently update product, variants, and images directly in Supabase Cloud Database
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updated = await updateSupabaseProduct(id, payload);

    res.json({
      success: true,
      message: 'Product updated successfully in Supabase database.',
      product: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 * Permanently delete product from Supabase Cloud Database
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteSupabaseProduct(id);

    res.json({
      success: true,
      deleted,
      message: 'Product permanently removed from Supabase database.',
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
    let customers = [];
    if (supabase) {
      customers = await getSupabaseCustomers();
    }
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
  updateOrderStatus,
  getLowStockAlerts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCustomers,
};
