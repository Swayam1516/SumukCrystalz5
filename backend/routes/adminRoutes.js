const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.get('/inventory/low-stock', adminController.getLowStockAlerts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);

module.exports = router;
