const AppError = require('../utils/AppError');
const {
  getSupabaseAllProducts,
  getSupabaseProductBySlugOrId,
} = require('../utils/supabaseProductService');

// Fallback catalog in case database is warming up
const SEED_CATALOG = [
  {
    id: 'prod_money_magnet',
    name: 'Money Magnet Fusion Energy Band',
    title: 'Money Magnet Fusion Energy Band',
    slug: 'money-magnet-fusion-band',
    subtitle: 'Triple Wealth Synergy: Peruvian Pyrite, Green Aventurine & Golden Tiger’s Eye',
    shortDescription: 'Engineered to unlock multi-directional financial channels, business magnetism, and sovereign confidence with 8mm natural gemstones.',
    description: 'The Money Magnet Fusion Band is crafted with certified Peruvian Pyrite (The Abundance Stone), Green Aventurine (The Gambler’s Stone of Opportunity), and Golden Tiger’s Eye (Sovereign Will & Solar Plexus Power). Handcrafted with high-tensile silicone elastic and 528Hz sound consecrated by Reiki Master Soumyaa Naveen.',
    category: 'Energy Bands',
    collection: 'Masterworks Collection',
    crystalType: 'Pyrite',
    chakra: 'Solar Plexus, Heart, Root',
    zodiac: 'Leo, Sagittarius, Taurus',
    element: 'Earth & Fire',
    price: 699,
    basePrice: 699,
    originalPrice: 1299,
    discountPercent: 46,
    stockCount: 18,
    totalStock: 18,
    sku: 'SKU-MMFB-8MM',
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      { id: 'var_6mm', name: '6mm Delicate Beads', sizeOrWeight: '6mm', value: '6mm', price: 499, originalPrice: 999, stock: 20, sku: 'MMFB-6MM', isDefault: false, isAvailable: true },
      { id: 'var_8mm', name: '8mm Classic Regular', sizeOrWeight: '8mm', value: '8mm', price: 699, originalPrice: 1299, stock: 18, sku: 'MMFB-8MM', isDefault: true, isAvailable: true },
      { id: 'var_10mm', name: '10mm Masterwork Heavier', sizeOrWeight: '10mm', value: '10mm', price: 999, originalPrice: 1699, stock: 12, sku: 'MMFB-10MM', isDefault: false, isAvailable: true },
    ],
    badges: ['Best Seller', 'Featured Crystal'],
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    inStock: true,
    rating: 4.9,
    ratingAverage: 4.9,
    reviewsCount: 42,
  },
  {
    id: 'prod_raw_pyrite',
    name: 'Raw Peruvian Pyrite Wealth Cluster',
    title: 'Raw Peruvian Pyrite Wealth Cluster',
    slug: 'raw-peruvian-pyrite-wealth-cluster',
    subtitle: 'Uncut Golden Fool’s Gold Cluster from Huaron Mines, Peru',
    shortDescription: 'High-density natural pyrite crystalline matrix radiating pure magnetic solar plexus energy and shielding.',
    description: 'Directly sourced from the high-altitude hydrothermal veins of Huaron, Peru, this cubic pyrite cluster exhibits mirror-like metallic luster. Known as the ultimate stone of financial manifestation, it shields your auric field from environmental toxicity while acting as a grounding wealth anchor.',
    category: 'Raw Geodes',
    collection: 'Earth Matrix Geodes',
    crystalType: 'Pyrite',
    chakra: 'Solar Plexus',
    zodiac: 'Leo, Aries',
    element: 'Earth & Fire',
    price: 1499,
    basePrice: 1499,
    originalPrice: 2499,
    discountPercent: 40,
    stockCount: 10,
    totalStock: 10,
    sku: 'SKU-PYR-RAW-01',
    images: [
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      { id: 'var_100g', name: '100g Pocket Cluster', sizeOrWeight: '100g', value: '100g', price: 999, originalPrice: 1699, stock: 15, sku: 'PYR-100G', isDefault: false, isAvailable: true },
      { id: 'var_250g', name: '250g Altar Masterpiece', sizeOrWeight: '250g', value: '250g', price: 1499, originalPrice: 2499, stock: 10, sku: 'PYR-250G', isDefault: true, isAvailable: true },
      { id: 'var_500g', name: '500g Sovereign Altar Monument', sizeOrWeight: '500g', value: '500g', price: 2899, originalPrice: 4599, stock: 5, sku: 'PYR-500G', isDefault: false, isAvailable: true },
    ],
    badges: ['Featured Crystal', 'Limited Edition'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    inStock: true,
    rating: 5.0,
    ratingAverage: 5.0,
    reviewsCount: 29,
  },
  {
    id: 'prod_amethyst_mala',
    name: 'Amethyst Deep Violet Spiritual Mala',
    title: 'Amethyst Deep Violet Spiritual Mala',
    slug: 'amethyst-deep-violet-spiritual-mala',
    subtitle: '108 Sacred Beads: Uruguayan High-Grade Amethyst & Natural Rudraksha',
    shortDescription: 'Traditional 108 japa mala designed for deep transcendental meditation and crown chakra attunement.',
    description: 'Hand-knotted with 108 individual 8mm natural Uruguayan amethyst beads and consecrated with 528Hz Solfeggio sound attunement. Stimulates higher consciousness, mental serenity, and protection against psychic agitation.',
    category: 'Sacred Malas',
    collection: 'Celestial Sanctuary',
    crystalType: 'Amethyst',
    chakra: 'Crown, Third Eye',
    zodiac: 'Pisces, Aquarius, Sagittarius',
    element: 'Air & Ether',
    price: 1299,
    basePrice: 1299,
    originalPrice: 2199,
    discountPercent: 41,
    stockCount: 14,
    totalStock: 14,
    sku: 'SKU-AME-MALA-108',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      { id: 'var_mala_6mm', name: '6mm 108 Japa Beads', sizeOrWeight: '6mm', value: '6mm', price: 999, originalPrice: 1699, stock: 20, sku: 'AME-MALA-6MM', isDefault: false, isAvailable: true },
      { id: 'var_mala_8mm', name: '8mm 108 Japa Beads', sizeOrWeight: '8mm', value: '8mm', price: 1299, originalPrice: 2199, stock: 14, sku: 'AME-MALA-8MM', isDefault: true, isAvailable: true },
    ],
    badges: ['New Arrival', 'Premium Collection'],
    isNewArrival: true,
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    inStock: true,
    rating: 4.8,
    ratingAverage: 4.8,
    reviewsCount: 19,
  }
];

/**
 * GET /api/products
 * Read products directly from Supabase Cloud Database
 */
async function getProducts(req, res, next) {
  try {
    const {
      q,
      category,
      collection,
      crystalType,
      minPrice,
      maxPrice,
      sort = 'newest',
    } = req.query;

    let products = await getSupabaseAllProducts({
      q,
      category,
      collection,
      crystalType,
      minPrice,
      maxPrice,
      sort,
      includeInactive: false,
    });

    if (!products || products.length === 0) {
      products = SEED_CATALOG;
    }

    res.json({
      success: true,
      count: products.length,
      total: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Retrieve single product by Slug or ID directly from Supabase
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    let product = await getSupabaseProductBySlugOrId(id);

    if (!product) {
      product = SEED_CATALOG.find((p) => p.slug === id || p.id === id);
    }

    if (!product) {
      return next(new AppError('Product not found in the treasury.', 404));
    }

    res.json({
      success: true,
      product,
      inStock: (product.stockCount || 0) > 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  SEED_CATALOG,
};
