const orderService = require('../services/orderService');

/**
 * GET /api/orders/my-orders
 * Fetches order history for currently authenticated customer
 */
async function getMyOrders(req, res, next) {
  try {
    const orders = await orderService.getUserOrders(req.user.id, req.user.email);
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
 * GET /api/orders/:id
 * Fetches order details with ownership verification
 */
async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res.json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/orders/:id/cancel
 * Cancels order if in cancellable state
 */
async function cancelMyOrder(req, res, next) {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Order cancelled successfully. Stock restored.',
      order,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyOrders,
  getOrder,
  getOrderById: getOrder,
  cancelMyOrder,
  cancelOrder: cancelMyOrder,
};

