const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cmsiounkoqpwjccczebk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Normalizes a Supabase product record with its nested variants and images
 */
function formatSupabaseProduct(p) {
  if (!p) return null;

  // Extract images ordered by display_order
  let images = [];
  if (Array.isArray(p.product_images) && p.product_images.length > 0) {
    images = p.product_images
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map((img) => img.image_url)
      .filter(Boolean);
  }
  if (images.length === 0 && p.hero_image) {
    images = [p.hero_image];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'];
  }

  // Extract variants
  let variants = [];
  if (Array.isArray(p.product_variants) && p.product_variants.length > 0) {
    variants = p.product_variants.map((v) => ({
      id: v.id,
      name: v.variant_name,
      variantName: v.variant_name,
      sizeOrWeight: v.bead_size || v.weight || v.bracelet_size || '',
      value: v.bead_size || v.weight || v.bracelet_size || '',
      beadSize: v.bead_size || '',
      braceletSize: v.bracelet_size || '',
      weight: v.weight || '',
      colorFinish: v.color_finish || '',
      price: Number(v.selling_price || p.selling_price || 0),
      sellingPrice: Number(v.selling_price || p.selling_price || 0),
      originalPrice: Number(v.original_price || p.original_price || (v.selling_price * 1.5) || 0),
      stock: parseInt(v.stock || 0, 10),
      sku: v.sku || '',
      isAvailable: v.available !== false && (v.stock > 0),
      available: v.available !== false && (v.stock > 0),
    }));
  }

  const sellingPrice = Number(p.selling_price || 0);
  const originalPrice = Number(p.original_price || (sellingPrice * 1.5) || 0);
  const discountPercentage = Number(
    p.discount_percentage !== undefined
      ? p.discount_percentage
      : originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0
  );

  // Total stock across variants or product field
  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    : 15;

  // Badges array
  const badges = [];
  if (p.new_arrival) badges.push('New Arrival');
  if (p.bestseller) badges.push('Best Seller');
  if (p.limited_edition) badges.push('Limited Edition');
  if (p.premium_collection) badges.push('Premium Collection');
  if (p.featured) badges.push('Featured Crystal');

  return {
    id: p.id,
    _id: p.id,
    slug: p.slug,
    name: p.name,
    title: p.name,
    category: p.category || 'Energy Bands',
    collection: p.collection || 'Masterworks Collection',
    crystalType: p.crystal_type || 'Pyrite',
    crystal_type: p.crystal_type || 'Pyrite',
    zodiac: p.zodiac || '',
    chakra: p.chakra || '',
    shortDescription: p.short_description || '',
    short_description: p.short_description || '',
    description: p.description || '',
    healingBenefits: p.healing_benefits || '',
    healing_benefits: p.healing_benefits || '',
    careInstructions: p.care_instructions || '',
    care_instructions: p.care_instructions || '',
    authenticityInfo: p.authenticity_info || '100% Certified Authentic Natural Crystal',
    authenticity_info: p.authenticity_info || '100% Certified Authentic Natural Crystal',
    price: sellingPrice,
    sellingPrice: sellingPrice,
    selling_price: sellingPrice,
    basePrice: sellingPrice,
    base_price: sellingPrice,
    originalPrice: originalPrice,
    original_price: originalPrice,
    discountPercent: discountPercentage,
    discountPercentage: discountPercentage,
    discount_percentage: discountPercentage,
    featured: !!p.featured,
    isFeatured: !!p.featured,
    bestseller: !!p.bestseller,
    isBestSeller: !!p.bestseller,
    newArrival: !!p.new_arrival,
    new_arrival: !!p.new_arrival,
    isNewArrival: !!p.new_arrival,
    premiumCollection: !!p.premium_collection,
    premium_collection: !!p.premium_collection,
    isPremiumCollection: !!p.premium_collection,
    limitedEdition: !!p.limited_edition,
    limited_edition: !!p.limited_edition,
    isLimitedEdition: !!p.limited_edition,
    active: p.active !== false,
    isActive: p.active !== false,
    inStock: totalStock > 0,
    stockCount: totalStock,
    totalStock: totalStock,
    total_stock: totalStock,
    sku: variants[0]?.sku || `SKU-${p.slug?.toUpperCase().slice(0, 8) || 'CRYS'}`,
    heroImage: images[0],
    hero_image: images[0],
    image: images[0],
    images: images,
    product_images: p.product_images || [],
    variants: variants,
    product_variants: p.product_variants || [],
    badges: badges,
    rating: 5.0,
    ratingAverage: 5.0,
    reviewsCount: 18,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

/**
 * 1. GET ALL PRODUCTS FROM SUPABASE
 */
async function getSupabaseAllProducts(filters = {}) {
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        category,
        collection,
        crystal_type,
        zodiac,
        chakra,
        short_description,
        description,
        healing_benefits,
        care_instructions,
        authenticity_info,
        selling_price,
        original_price,
        discount_percentage,
        featured,
        bestseller,
        new_arrival,
        premium_collection,
        limited_edition,
        active,
        hero_image,
        created_at,
        updated_at,
        product_variants (
          id,
          product_id,
          variant_name,
          bead_size,
          bracelet_size,
          weight,
          color_finish,
          selling_price,
          original_price,
          stock,
          sku,
          available
        ),
        product_images (
          id,
          product_id,
          image_url,
          display_order,
          is_hero
        )
      `)
      .order('created_at', { ascending: false });

    if (!filters.includeInactive) {
      query = query.eq('active', true);
    }

    if (filters.category && filters.category !== 'all') {
      query = query.ilike('category', filters.category);
    }

    if (filters.collection && filters.collection !== 'all') {
      query = query.ilike('collection', filters.collection);
    }

    if (filters.crystalType) {
      query = query.ilike('crystal_type', filters.crystalType);
    }

    if (filters.minPrice) {
      query = query.gte('selling_price', Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      query = query.lte('selling_price', Number(filters.maxPrice));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error.message);
      return [];
    }

    let formatted = (data || []).map(formatSupabaseProduct);

    // Apply in-memory text search if q is provided
    if (filters.q && filters.q.trim()) {
      const qLower = filters.q.toLowerCase().trim();
      formatted = formatted.filter(
        (p) =>
          p.name?.toLowerCase().includes(qLower) ||
          p.description?.toLowerCase().includes(qLower) ||
          p.shortDescription?.toLowerCase().includes(qLower) ||
          p.crystalType?.toLowerCase().includes(qLower) ||
          p.zodiac?.toLowerCase().includes(qLower) ||
          p.chakra?.toLowerCase().includes(qLower)
      );
    }

    // Sorting
    if (filters.sort === 'priceAsc' || filters.sort === 'price-low') {
      formatted.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'priceDesc' || filters.sort === 'price-high') {
      formatted.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'name') {
      formatted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return formatted;
  } catch (err) {
    console.error('Fatal error in getSupabaseAllProducts:', err.message);
    return [];
  }
}

/**
 * 2. GET SINGLE PRODUCT BY SLUG OR ID FROM SUPABASE
 */
async function getSupabaseProductBySlugOrId(idOrSlug) {
  try {
    if (!idOrSlug) return null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        category,
        collection,
        crystal_type,
        zodiac,
        chakra,
        short_description,
        description,
        healing_benefits,
        care_instructions,
        authenticity_info,
        selling_price,
        original_price,
        discount_percentage,
        featured,
        bestseller,
        new_arrival,
        premium_collection,
        limited_edition,
        active,
        hero_image,
        created_at,
        updated_at,
        product_variants (
          id,
          product_id,
          variant_name,
          bead_size,
          bracelet_size,
          weight,
          color_finish,
          selling_price,
          original_price,
          stock,
          sku,
          available
        ),
        product_images (
          id,
          product_id,
          image_url,
          display_order,
          is_hero
        )
      `);

    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }

    return formatSupabaseProduct(data);
  } catch (err) {
    console.error('Fatal error in getSupabaseProductBySlugOrId:', err.message);
    return null;
  }
}

/**
 * 3. CREATE PRODUCT IN SUPABASE (Atomic: Products -> Variants -> Images)
 */
async function createSupabaseProduct(productData) {
  try {
    const name = productData.name || productData.title;
    const slug =
      productData.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const sellingPrice = parseFloat(productData.price || productData.sellingPrice || productData.selling_price || productData.basePrice || 0);
    const originalPrice = parseFloat(productData.originalPrice || productData.original_price || (sellingPrice * 1.5) || 0);
    const discountPercentage = parseFloat(productData.discountPercent || productData.discountPercentage || productData.discount_percentage || 0);

    const chakraStr = Array.isArray(productData.chakra)
      ? productData.chakra.join(', ')
      : (productData.chakra || productData.chakraAssociation || '');

    const imagesList = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images
      : (productData.image ? [productData.image] : ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80']);

    // Check badges
    const badges = Array.isArray(productData.badges) ? productData.badges : [];
    const isNewArrival = !!(productData.isNewArrival || productData.new_arrival || badges.includes('New Arrival'));
    const isBestSeller = !!(productData.isBestSeller || productData.bestseller || badges.includes('Best Seller'));
    const isLimitedEdition = !!(productData.isLimitedEdition || productData.limited_edition || badges.includes('Limited Edition'));
    const isPremiumCollection = !!(productData.isPremiumCollection || productData.premium_collection || badges.includes('Premium Collection'));
    const isFeatured = !!(productData.isFeatured || productData.featured || badges.includes('Featured Crystal'));

    const productPayload = {
      slug,
      name,
      category: productData.category || 'Energy Bands',
      collection: productData.collection || 'Masterworks Collection',
      crystal_type: productData.crystalType || productData.crystal_type || 'Pyrite',
      zodiac: productData.zodiac || productData.zodiacAssociation || '',
      chakra: chakraStr,
      short_description: productData.shortDescription || productData.short_description || productData.subtitle || '',
      description: productData.description || productData.shortDescription || '',
      healing_benefits: productData.healingBenefits || productData.healing_benefits || '',
      care_instructions: productData.careInstructions || productData.care_instructions || '',
      authenticity_info: productData.authenticityInfo || productData.authenticity_info || '100% Certified Authentic Natural Crystal',
      selling_price: sellingPrice,
      original_price: originalPrice,
      discount_percentage: discountPercentage,
      featured: isFeatured,
      bestseller: isBestSeller,
      new_arrival: isNewArrival,
      premium_collection: isPremiumCollection,
      limited_edition: isLimitedEdition,
      active: productData.isActive !== undefined ? productData.isActive : (productData.active !== undefined ? productData.active : true),
      hero_image: imagesList[0] || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // A. Insert into products table
    const { data: createdProduct, error: prodErr } = await supabase
      .from('products')
      .upsert(productPayload, { onConflict: 'slug' })
      .select()
      .single();

    if (prodErr || !createdProduct) {
      console.warn(
        `⚠️ Supabase products table notice: ${prodErr?.message}. Please execute 'supabase-products-migration.sql' in Supabase SQL Editor: https://supabase.com/dashboard/project/cmsiounkoqpwjccczebk/sql`
      );
      // Return formatted product payload if table is awaiting migration run
      return formatSupabaseProduct({
        ...productPayload,
        id: `prod_${Date.now()}`,
        product_variants: (productData.variants || []).map((v, i) => ({
          id: `var_${i}`,
          variant_name: v.name || v.variant_name || v.label,
          bead_size: v.beadSize || v.bead_size || '',
          selling_price: v.price || v.sellingPrice || sellingPrice,
          stock: v.stock || 10,
          sku: v.sku || `SKU-${slug.toUpperCase().slice(0, 6)}`,
          available: true,
        })),
        product_images: imagesList.map((url, i) => ({
          id: `img_${i}`,
          image_url: url,
          display_order: i + 1,
          is_hero: i === 0,
        })),
      });
    }

    const productId = createdProduct.id;

    // B. Insert Variants
    const variantsList = Array.isArray(productData.variants) && productData.variants.length > 0
      ? productData.variants
      : [
          {
            name: '8mm Classic Regular',
            sizeOrWeight: '8mm',
            sellingPrice: sellingPrice,
            originalPrice: originalPrice,
            stock: productData.stockCount || productData.totalStock || 15,
            sku: productData.sku || `SKU-${slug.toUpperCase().slice(0, 8)}`,
            available: true,
          }
        ];

    // Clean old variants if updating
    await supabase.from('product_variants').delete().eq('product_id', productId);

    const variantRows = variantsList.map((v) => ({
      product_id: productId,
      variant_name: v.name || v.variant_name || v.label || 'Standard Edition',
      bead_size: v.beadSize || v.bead_size || (v.sizeOrWeight?.includes('mm') ? v.sizeOrWeight : ''),
      bracelet_size: v.braceletSize || v.bracelet_size || '',
      weight: v.weight || (v.sizeOrWeight?.includes('g') ? v.sizeOrWeight : ''),
      color_finish: v.colorFinish || v.color_finish || '',
      selling_price: parseFloat(v.price || v.sellingPrice || v.selling_price || sellingPrice),
      original_price: parseFloat(v.originalPrice || v.original_price || originalPrice),
      stock: parseInt(v.stock !== undefined ? v.stock : 10, 10),
      sku: v.sku || `SKU-${slug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
      available: v.available !== false && v.isAvailable !== false,
    }));

    if (variantRows.length > 0) {
      const { error: varErr } = await supabase.from('product_variants').insert(variantRows);
      if (varErr) {
        console.warn('Supabase variants insert notice:', varErr.message);
      }
    }

    // C. Insert Images
    await supabase.from('product_images').delete().eq('product_id', productId);

    const imageRows = imagesList.map((url, idx) => ({
      product_id: productId,
      image_url: url,
      display_order: idx + 1,
      is_hero: idx === 0,
    }));

    if (imageRows.length > 0) {
      const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
      if (imgErr) {
        console.warn('Supabase images insert notice:', imgErr.message);
      }
    }

    // Return full hydrated product
    return await getSupabaseProductBySlugOrId(productId);
  } catch (err) {
    console.error('Fatal error in createSupabaseProduct:', err.message);
    throw err;
  }
}

/**
 * 4. UPDATE PRODUCT IN SUPABASE
 */
async function updateSupabaseProduct(idOrSlug, patchData) {
  try {
    const existing = await getSupabaseProductBySlugOrId(idOrSlug);
    if (!existing) {
      throw new Error(`Product not found: ${idOrSlug}`);
    }

    const productId = existing.id;
    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (patchData.name) updatePayload.name = patchData.name;
    if (patchData.category) updatePayload.category = patchData.category;
    if (patchData.collection) updatePayload.collection = patchData.collection;
    if (patchData.crystalType || patchData.crystal_type) updatePayload.crystal_type = patchData.crystalType || patchData.crystal_type;
    if (patchData.zodiac !== undefined) updatePayload.zodiac = patchData.zodiac;
    if (patchData.chakra !== undefined) {
      updatePayload.chakra = Array.isArray(patchData.chakra) ? patchData.chakra.join(', ') : patchData.chakra;
    }
    if (patchData.shortDescription || patchData.short_description) {
      updatePayload.short_description = patchData.shortDescription || patchData.short_description;
    }
    if (patchData.description) updatePayload.description = patchData.description;
    if (patchData.healingBenefits || patchData.healing_benefits) {
      updatePayload.healing_benefits = patchData.healingBenefits || patchData.healing_benefits;
    }
    if (patchData.careInstructions || patchData.care_instructions) {
      updatePayload.care_instructions = patchData.careInstructions || patchData.care_instructions;
    }
    if (patchData.authenticityInfo || patchData.authenticity_info) {
      updatePayload.authenticity_info = patchData.authenticityInfo || patchData.authenticity_info;
    }
    if (patchData.price !== undefined || patchData.selling_price !== undefined) {
      updatePayload.selling_price = parseFloat(patchData.price || patchData.selling_price);
    }
    if (patchData.originalPrice !== undefined || patchData.original_price !== undefined) {
      updatePayload.original_price = parseFloat(patchData.originalPrice || patchData.original_price);
    }
    if (patchData.discountPercent !== undefined || patchData.discount_percentage !== undefined) {
      updatePayload.discount_percentage = parseFloat(patchData.discountPercent || patchData.discount_percentage);
    }
    if (patchData.featured !== undefined || patchData.isFeatured !== undefined) {
      updatePayload.featured = patchData.featured !== undefined ? patchData.featured : patchData.isFeatured;
    }
    if (patchData.bestseller !== undefined || patchData.isBestSeller !== undefined) {
      updatePayload.bestseller = patchData.bestseller !== undefined ? patchData.bestseller : patchData.isBestSeller;
    }
    if (patchData.new_arrival !== undefined || patchData.isNewArrival !== undefined) {
      updatePayload.new_arrival = patchData.new_arrival !== undefined ? patchData.new_arrival : patchData.isNewArrival;
    }
    if (patchData.premium_collection !== undefined || patchData.isPremiumCollection !== undefined) {
      updatePayload.premium_collection = patchData.premium_collection !== undefined ? patchData.premium_collection : patchData.isPremiumCollection;
    }
    if (patchData.limited_edition !== undefined || patchData.isLimitedEdition !== undefined) {
      updatePayload.limited_edition = patchData.limited_edition !== undefined ? patchData.limited_edition : patchData.isLimitedEdition;
    }
    if (patchData.active !== undefined || patchData.isActive !== undefined || patchData.inStock !== undefined) {
      updatePayload.active = patchData.active !== undefined ? patchData.active : (patchData.isActive !== undefined ? patchData.isActive : patchData.inStock);
    }
    if (patchData.images && Array.isArray(patchData.images) && patchData.images.length > 0) {
      updatePayload.hero_image = patchData.images[0];
    } else if (patchData.image) {
      updatePayload.hero_image = patchData.image;
    }

    // A. Update Product row
    const { error: prodErr } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', productId);

    if (prodErr) {
      throw new Error(`Error updating product in Supabase: ${prodErr.message}`);
    }

    // B. Update Variants if provided
    if (Array.isArray(patchData.variants)) {
      await supabase.from('product_variants').delete().eq('product_id', productId);
      const variantRows = patchData.variants.map((v) => ({
        product_id: productId,
        variant_name: v.name || v.variant_name || v.label || 'Standard Edition',
        bead_size: v.beadSize || v.bead_size || (v.sizeOrWeight?.includes('mm') ? v.sizeOrWeight : ''),
        bracelet_size: v.braceletSize || v.bracelet_size || '',
        weight: v.weight || (v.sizeOrWeight?.includes('g') ? v.sizeOrWeight : ''),
        color_finish: v.colorFinish || v.color_finish || '',
        selling_price: parseFloat(v.price || v.sellingPrice || v.selling_price || updatePayload.selling_price || existing.price),
        original_price: parseFloat(v.originalPrice || v.original_price || updatePayload.original_price || existing.originalPrice),
        stock: parseInt(v.stock !== undefined ? v.stock : 10, 10),
        sku: v.sku || `SKU-${existing.slug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
        available: v.available !== false && v.isAvailable !== false,
      }));

      if (variantRows.length > 0) {
        await supabase.from('product_variants').insert(variantRows);
      }
    }

    // C. Update Images if provided
    if (Array.isArray(patchData.images) && patchData.images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      const imageRows = patchData.images.map((url, idx) => ({
        product_id: productId,
        image_url: url,
        display_order: idx + 1,
        is_hero: idx === 0,
      }));
      await supabase.from('product_images').insert(imageRows);
    }

    return await getSupabaseProductBySlugOrId(productId);
  } catch (err) {
    console.error('Fatal error in updateSupabaseProduct:', err.message);
    throw err;
  }
}

/**
 * 5. DELETE PRODUCT FROM SUPABASE (Cascades to variants and images)
 */
async function deleteSupabaseProduct(idOrSlug) {
  try {
    const existing = await getSupabaseProductBySlugOrId(idOrSlug);
    if (!existing) {
      return false;
    }

    const { error } = await supabase.from('products').delete().eq('id', existing.id);
    if (error) {
      throw new Error(`Error deleting product from Supabase: ${error.message}`);
    }

    return true;
  } catch (err) {
    console.error('Fatal error in deleteSupabaseProduct:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  formatSupabaseProduct,
  getSupabaseAllProducts,
  getSupabaseProductBySlugOrId,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
};
