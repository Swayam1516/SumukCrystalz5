const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    label: { type: String },
    sizeOrWeight: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    priceModifier: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    title: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    subtitle: { type: String },
    category: { type: String, default: 'Energy Bands', index: true },
    collection: { type: String, default: 'Masterworks Collection', index: true },
    description: { type: String, required: true },
    shortDescription: { type: String },

    // Metaphysical & Crystal Attributes
    crystalType: { type: String, default: 'Pyrite', index: true },
    chakra: { type: [String], default: [] },
    zodiac: { type: String },
    element: { type: String },
    form: { type: String, default: 'Jewelry' },
    origin: { type: String },
    metaphysicalProperties: [{ type: String }],
    healingBenefits: { type: String },
    spiritualProperties: { type: String },
    careInstructions: { type: String },
    authenticityNote: { type: String },

    // Pricing & Inventory
    basePrice: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    sku: { type: String },
    variants: [VariantSchema],
    totalStock: { type: Number, required: true, default: 0 },
    stockCount: { type: Number, default: 0 },

    // Photography & Media
    images: [{ type: String, required: true }],
    image: { type: String },
    model3dUrl: { type: String },
    model3dScale: { type: Number, default: 1 },
    certificateUrl: { type: String },
    sourcedFrom: { type: String },
    artisanRepresentative: { type: String },

    // Special Storefront Badges
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    isPremiumCollection: { type: Boolean, default: false },
    badge: { type: String },
    badgeColor: { type: String },
    beadSize: { type: String },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 12 },
    reviewsCount: { type: Number, default: 12 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', crystalType: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
