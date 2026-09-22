const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/create-order', optionalAuth, paymentLimiter, paymentController.createOrder);
router.post('/verify', optionalAuth, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;

