const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },       // e.g. "Small (3-4cm)", "18-inch chain"
    priceModifier: { type: Number, default: 0 },    // added to base price
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },

    // Taxonomy used by storefront filters
    crystalType: { type: String, required: true, index: true }, // e.g. "Amethyst", "Rose Quartz"
    chakra: {
      type: [String],
      enum: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
      index: true,
    },
    form: {
      type: String,
      enum: ['Raw', 'Polished', 'Jewelry', 'Carved', 'Cluster'],
      required: true,
      index: true,
    },
    origin: { type: String },
    metaphysicalProperties: [{ type: String }],
    careInstructions: { type: String },

    // Pricing & inventory
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    variants: [VariantSchema],
    totalStock: { type: Number, required: true, default: 0 },

    // Media
    images: [{ type: String, required: true }],       // CDN URLs
    model3dUrl: { type: String },                      // .glb/.gltf URL for R3F viewer
    model3dScale: { type: Number, default: 1 },

    // Authenticity / sourcing (brand story requirement)
    certificateUrl: { type: String },
    sourcedFrom: { type: String },
    artisanRepresentative: { type: String },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ crystalType: 1, chakra: 1, form: 1, basePrice: 1 });

module.exports = mongoose.model('Product', ProductSchema);
