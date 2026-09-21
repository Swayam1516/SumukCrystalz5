const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

// Orders & Logistics
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Inventory & Low Stock Alerts
router.get('/inventory/low-stock', adminController.getLowStockAlerts);

// Product Management (Full CRUD)
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Customers / Patrons
router.get('/customers', adminController.getCustomers);

module.exports = router;
