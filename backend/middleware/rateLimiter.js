const rateLimit = require('express-rate-limit');

// 1. General Catalog Browsing Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Strict Authentication Rate Limiter (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per IP per 15 min
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Strict Checkout & Order Creation Limiter
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Too many checkout requests from this IP. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = checkoutLimiter;

module.exports = {
  generalLimiter,
  authLimiter,
  checkoutLimiter,
  paymentLimiter,
};
