const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/create-order', authenticate, paymentLimiter, paymentController.createOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
