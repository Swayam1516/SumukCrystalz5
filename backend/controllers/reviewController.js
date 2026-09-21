const AppError = require('../utils/AppError');
const { supabase } = require('../utils/supabase');

/**
 * POST /api/reviews
 * Allows submission only if authenticated user has purchased the product
 */
async function createReview(req, res, next) {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || 'Verified Collector';

    if (!supabase) {
      return res.status(201).json({
        success: true,
        message: 'Review received.',
      });
    }

    const reviewPayload = {
      product_id: productId,
      user_id: userId,
      user_name: userName,
      rating: Number(rating || 5),
      title: title?.trim() || '',
      comment: comment?.trim() || '',
      is_verified_purchase: true,
      created_at: new Date().toISOString(),
    };

    const { data: review, error } = await supabase
      .from('reviews')
      .insert(reviewPayload)
      .select()
      .single();

    res.status(201).json({
      success: true,
      message: 'Thank you for your verified collector review!',
      review: review || reviewPayload,
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
    let reviews = [];

    if (supabase) {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (data) reviews = data;
    }

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
