const { body, param, query, validationResult } = require('express-validator');

/**
 * Reusable validation middleware that intercepts express-validator results
 * and returns a formatted 400 Bad Request if validation rules fail.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Input validation failed',
      errors: formattedErrors,
    });
  }
  next();
}

// =========================================================================
// 1. AUTH VALIDATION RULES
// =========================================================================
const registerRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty.'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number.'),
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

// =========================================================================
// 2. CHECKOUT & PAYMENT VALIDATION RULES
// =========================================================================
const createOrderRules = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items array must contain at least one specimen.'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer.'),
  body('buyerName')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required.'),
  body('buyerEmail')
    .trim()
    .isEmail()
    .withMessage('A valid buyer email is required.')
    .normalizeEmail(),
  body('shippingAddress.line1')
    .trim()
    .notEmpty()
    .withMessage('Street address (line 1) is required.'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required.'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required.'),
  body('shippingAddress.postalCode')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit Indian PIN code.'),
  body('shippingAddress.phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number for delivery.'),
];

const verifyPaymentRules = [
  body('razorpay_order_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Order ID is required for verification.'),
  body('razorpay_payment_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Payment ID is required for verification.'),
  body('razorpay_signature')
    .trim()
    .notEmpty()
    .withMessage('Cryptographic signature is required for verification.'),
];

// =========================================================================
// 3. PRODUCT VALIDATION RULES
// =========================================================================
const createProductRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.'),
  body('basePrice')
    .isFloat({ min: 1 })
    .withMessage('Base price must be a positive number greater than 0.'),
  body('totalStock')
    .isInt({ min: 0 })
    .withMessage('Total stock must be a non-negative integer.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required.'),
  body('crystalType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Crystal type cannot be empty.'),
];

const updateProductRules = [
  param('id')
    .notEmpty()
    .withMessage('Product ID is required.'),
  body('basePrice')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Base price must be greater than 0.'),
  body('totalStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total stock must be a non-negative integer.'),
];

// =========================================================================
// 4. REVIEW VALIDATION RULES
// =========================================================================
const createReviewRules = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required.'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Review comment must be between 5 and 1000 characters.'),
];

module.exports = {
  validateRequest,
  registerRules,
  loginRules,
  createOrderRules,
  verifyPaymentRules,
  createProductRules,
  updateProductRules,
  createReviewRules,
};
