const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const AppError = require('../utils/AppError');

/**
 * GET /api/products
 * Search, filter by category/form/chakra/price, sort, and paginate
 */
async function getProducts(req, res, next) {
  try {
    const {
      q,
      category,
      crystalType,
      chakra,
      form,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    // 1. Text Search query
    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { crystalType: { $regex: q.trim(), $options: 'i' } },
        { metaphysicalProperties: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    // 2. Filters
    if (crystalType) filter.crystalType = crystalType;
    if (category) filter.crystalType = category;
    if (form) filter.form = form;
    if (chakra) filter.chakra = chakra;

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    // 3. Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'priceAsc') sortOptions = { basePrice: 1 };
    if (sort === 'priceDesc') sortOptions = { basePrice: -1 };
    if (sort === 'rating') sortOptions = { ratingAverage: -1 };
    if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: products.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      products,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Retrieve product details along with verified collector reviews
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return next(new AppError('Product not found in the treasury.', 404));
    }

    // Fetch related verified reviews
    let reviews = [];
    try {
      reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).limit(10);
    } catch (e) {}

    res.json({
      success: true,
      product,
      reviews,
      inStock: (product.totalStock || 0) > 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
};
