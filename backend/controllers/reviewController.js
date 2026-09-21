const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { ORDER_STATUS } = require('../utils/constants');

/**
 * POST /api/reviews
 * Allows submission only if authenticated user has purchased the product in a paid/delivered order.
 */
async function createReview(req, res, next) {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name || 'Verified Collector';

    // 1. Verify user purchased the product
    const qualifyingOrder = await Order.findOne({
      $or: [
        { user: userId },
        { buyerEmail: userEmail?.toLowerCase() },
      ],
      'items.product': productId,
      status: {
        $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED],
      },
    });

    if (!qualifyingOrder) {
      return next(
        new AppError(
          'Verification Required: Only patrons who have purchased and confirmed this specimen can leave a verified review.',
          403
        )
      );
    }

    // 2. Prevent duplicate review
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return next(new AppError('You have already submitted a review for this specimen.', 400));
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      userName,
      rating: Number(rating),
      title: title?.trim(),
      comment: comment.trim(),
      isVerifiedPurchase: true,
    });

    // 3. Recalculate product rating average
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(avgRating * 10) / 10,
      ratingCount: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your verified collector review!',
      review,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reviews/product/:productId
 */
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReview,
  getProductReviews,
};
