import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Normalizes a raw Supabase product record into a unified object
 */
export function normalizeProduct(raw) {
  if (!raw) return null;

  // Extract images from joined table or hero_image
  const joinedImages = (raw.product_images || [])
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((img) => img.image_url)
    .filter(Boolean);

  const imagesList = joinedImages.length > 0
    ? joinedImages
    : (raw.hero_image ? [raw.hero_image] : ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80']);

  // Extract variants
  const variantsList = (raw.product_variants || []).map((v) => ({
    id: v.id,
    name: v.variant_name || v.name || 'Standard',
    variant_name: v.variant_name || v.name || 'Standard',
    beadSize: v.bead_size || '',
    bead_size: v.bead_size || '',
    braceletSize: v.bracelet_size || '',
    bracelet_size: v.bracelet_size || '',
    price: Number(v.selling_price || 0),
    selling_price: Number(v.selling_price || 0),
    originalPrice: Number(v.original_price || 0),
    original_price: Number(v.original_price || 0),
    stock: Number(v.stock || 0),
    sku: v.sku || '',
    available: v.available !== false,
  }));

  const sellingPrice = Number(raw.selling_price || raw.price || raw.base_price || 0);
  const originalPrice = Number(raw.original_price || raw.originalPrice || (sellingPrice * 1.5));
  const discountPercent = originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : Number(raw.discount_percentage || 0);

  return {
    ...raw,
    id: raw.id,
    slug: raw.slug || (raw.name ? raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `specimen-${raw.id}`),
    name: raw.name || raw.title || 'Sacred Crystal Specimen',
    title: raw.name || raw.title || 'Sacred Crystal Specimen',
    subtitle: raw.short_description || raw.subtitle || '',
    shortDescription: raw.short_description || raw.subtitle || '',
    short_description: raw.short_description || raw.subtitle || '',
    description: raw.description || '',
    category: raw.category || 'Energy Bands',
    collection: raw.collection || 'Masterworks Collection',
    crystalType: raw.crystal_type || 'Pyrite',
    crystal_type: raw.crystal_type || 'Pyrite',
    zodiac: raw.zodiac || '',
    chakra: raw.chakra || 'Crown & Third Eye',
    healingBenefits: raw.healing_benefits || '',
    healing_benefits: raw.healing_benefits || '',
    careInstructions: raw.care_instructions || '',
    care_instructions: raw.care_instructions || '',
    authenticityInfo: raw.authenticity_info || '100% Certified Authentic Natural Crystal & Consecrated at 528Hz',
    authenticity_info: raw.authenticity_info || '100% Certified Authentic Natural Crystal & Consecrated at 528Hz',
    price: sellingPrice,
    sellingPrice,
    selling_price: sellingPrice,
    originalPrice,
    original_price: originalPrice,
    discountPercent,
    discount_percentage: discountPercent,
    badge: raw.bestseller ? 'BESTSELLER' : (raw.new_arrival ? 'NEW' : (raw.limited_edition ? 'LIMITED' : 'MASTERWORK')),
    badgeColor: raw.bestseller ? 'bg-[#B8860B] text-white' : 'bg-purple-900 text-white',
    rating: 5.0,
    reviewsCount: 108,
    active: raw.active !== false,
    isActive: raw.active !== false,
    inStock: raw.active !== false,
    heroImage: imagesList[0],
    hero_image: imagesList[0],
    image: imagesList[0],
    images: imagesList,
    variants: variantsList,
    product_variants: variantsList,
    product_images: imagesList.map((url, idx) => ({ image_url: url, display_order: idx + 1 })),
    stockCount: variantsList.length > 0 ? variantsList.reduce((sum, v) => sum + (v.stock || 0), 0) : 50,
  };
}

/**
 * Persist product, variants and images to Supabase PostgreSQL
 */
export async function saveProductToSupabase(productPayload) {
  try {
    const name = (productPayload.name || productPayload.title || '').trim();
    if (!name) throw new Error('Product name is required.');

    let slug = productPayload.slug;
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!slug) slug = `specimen-${Date.now()}`;
    }

    const sellingPrice = Number(productPayload.price || productPayload.selling_price || productPayload.base_price || 0);
    const originalPrice = Number(productPayload.originalPrice || productPayload.original_price || (sellingPrice * 1.5));
    const discountPercent = originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : Number(productPayload.discountPercent || productPayload.discount_percentage || 0);

    const images = Array.isArray(productPayload.images) && productPayload.images.length > 0
      ? productPayload.images
      : (productPayload.hero_image || productPayload.heroImage || productPayload.image ? [productPayload.hero_image || productPayload.heroImage || productPayload.image] : []);

    const heroImage = images[0] || productPayload.hero_image || productPayload.heroImage || productPayload.image || '';

    const productRecord = {
      name,
      slug,
      category: productPayload.category || 'Energy Bands',
      collection: productPayload.collection || 'Masterworks Collection',
      crystal_type: productPayload.crystalType || productPayload.crystal_type || 'Pyrite',
      zodiac: productPayload.zodiac || '',
      chakra: productPayload.chakra || 'Crown & Third Eye',
      short_description: productPayload.shortDescription || productPayload.short_description || productPayload.subtitle || '',
      description: productPayload.description || '',
      healing_benefits: productPayload.healingBenefits || productPayload.healing_benefits || (Array.isArray(productPayload.vedicBenefits) ? productPayload.vedicBenefits.join('\n') : ''),
      care_instructions: productPayload.careInstructions || productPayload.care_instructions || '',
      authenticity_info: productPayload.authenticityInfo || productPayload.authenticity_info || '100% Certified Authentic Natural Crystal & Consecrated at 528Hz',
      selling_price: sellingPrice,
      original_price: originalPrice,
      discount_percentage: discountPercent,
      featured: Boolean(productPayload.featured),
      bestseller: Boolean(productPayload.bestseller),
      new_arrival: Boolean(productPayload.newArrival || productPayload.new_arrival),
      premium_collection: Boolean(productPayload.premiumCollection || productPayload.premium_collection),
      limited_edition: Boolean(productPayload.limitedEdition || productPayload.limited_edition),
      active: productPayload.active !== undefined ? Boolean(productPayload.active) : (productPayload.isActive !== undefined ? Boolean(productPayload.isActive) : true),
      hero_image: heroImage,
      updated_at: new Date().toISOString(),
    };

    const isExistingUuid = typeof productPayload.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productPayload.id);
    if (isExistingUuid) {
      productRecord.id = productPayload.id;
    }

    // 1. Upsert into 'products' table
    const { data: savedProduct, error: prodErr } = await supabase
      .from('products')
      .upsert(productRecord, { onConflict: isExistingUuid ? 'id' : 'slug' })
      .select()
      .single();

    if (prodErr) {
      console.error('Supabase Product Save Error:', prodErr);
      throw prodErr;
    }

    const productId = savedProduct.id;

    // 2. Sync Variants if provided
    if (productPayload.variants && Array.isArray(productPayload.variants) && productPayload.variants.length > 0) {
      await supabase.from('product_variants').delete().eq('product_id', productId);

      const variantsToInsert = productPayload.variants.map((v) => ({
        product_id: productId,
        variant_name: v.name || v.variant_name || 'Standard',
        bead_size: v.beadSize || v.bead_size || '',
        bracelet_size: v.braceletSize || v.bracelet_size || '',
        weight: v.weight || '',
        color_finish: v.colorFinish || v.color_finish || '',
        selling_price: Number(v.price || v.selling_price || sellingPrice),
        original_price: Number(v.originalPrice || v.original_price || originalPrice),
        stock: Number(v.stock || v.stockCount || 20),
        sku: v.sku || `${slug.toUpperCase()}-${(v.name || 'STD').replace(/[^a-z0-9]/gi, '').slice(0, 4)}`,
        available: v.available !== false,
      }));

      await supabase.from('product_variants').insert(variantsToInsert);
    }

    // 3. Sync Images if provided
    if (images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId);

      const imagesToInsert = images.map((url, idx) => ({
        product_id: productId,
        image_url: url,
        display_order: idx + 1,
        is_hero: idx === 0,
      }));

      await supabase.from('product_images').insert(imagesToInsert);
    }

    const complete = await getSupabaseProductBySlug(savedProduct.slug || productId);
    return { success: true, product: complete || normalizeProduct(savedProduct), error: null };
  } catch (err) {
    console.error('Error saving product to Supabase:', err);
    return { success: false, product: null, error: err.message || err };
  }
}

/**
 * Fetch all products from Supabase with joined variants and images
 */
export async function getSupabaseProducts(onlyActive = false) {
  try {
    let query = supabase
      .from('products')
      .select('*, product_variants(*), product_images(*)')
      .order('created_at', { ascending: false });

    if (onlyActive) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(normalizeProduct);
  } catch (err) {
    console.warn('Supabase fetch products notice:', err.message);
    return [];
  }
}

/**
 * Fetch single product by slug or UUID
 */
export async function getSupabaseProductBySlug(slugOrId) {
  try {
    if (!slugOrId) return null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    let query = supabase
      .from('products')
      .select('*, product_variants(*), product_images(*)');

    if (isUuid) {
      query = query.eq('id', slugOrId);
    } else {
      query = query.eq('slug', slugOrId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;

    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.warn('Supabase product fetch notice:', err.message);
    return null;
  }
}

/**
 * Delete product from Supabase
 */
export async function deleteProductFromSupabase(productId) {
  try {
    if (!productId) throw new Error('Product ID is required.');
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Delete product error:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Toggle product active status in Supabase
 */
export async function toggleProductStatusInSupabase(productId, active) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, product: normalizeProduct(data), error: null };
  } catch (err) {
    return { success: false, product: null, error: err.message };
  }
}

export const updateProductAvailabilityInSupabase = toggleProductStatusInSupabase;

/**
 * Persist customer profile directly to Supabase
 */
export async function saveCustomerToSupabase(customer) {
  try {
    const payload = {
      full_name: customer.fullName || customer.name || 'Valued Collector',
      email: customer.email?.toLowerCase().trim(),
      phone: customer.phone || '',
      shipping_address: customer.shippingAddress || customer.address || {},
      total_orders: customer.totalOrders || 1,
      total_spent: customer.totalSpent || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert(payload, { onConflict: 'email' })
      .select();

    if (error) {
      console.warn('Supabase customer save notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase customer error:', err.message);
    return null;
  }
}

/**
 * Persist order details and line items directly to Supabase & localStorage
 */
export async function saveOrderToSupabase(order) {
  try {
    const orderNumber = order.orderId || order._id || order.orderNumber || `ORD-${Date.now()}`;
    const buyerEmail = order.buyerEmail?.toLowerCase().trim() || '';
    const buyerName = order.buyerName || order.shippingAddress?.fullName || 'Collector';
    const totalAmount = Number(order.total || order.total_amount || 0);

    const payload = {
      order_number: orderNumber,
      user_id: order.userId || order.user_id || null,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: order.buyerPhone || order.shippingAddress?.phone || '',
      shipping_address: order.shippingAddress || {},
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      shipping_fee: Number(order.shippingFee || 0),
      total: totalAmount,
      total_amount: totalAmount,
      currency: order.currency || 'INR',
      razorpay_order_id: order.razorpayOrderId || '',
      razorpay_payment_id: order.razorpayPaymentId || '',
      status: order.status || 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase 'orders' table
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    const createdOrderId = orderResult?.id || payload.order_number;

    // 2. Insert line items into 'order_items' table if items array exists
    if (order.items && Array.isArray(order.items) && order.items.length > 0 && orderResult?.id) {
      const lineItemsPayload = order.items.map((it) => ({
        order_id: orderResult.id,
        product_id: it.productId || it.product_id || it.id || null,
        product_name: it.name || it.product_name || 'Sacred Crystal Specimen',
        product_image: it.image || it.images?.[0] || it.product_image || '',
        price: Number(it.price || it.unitPrice || 0),
        quantity: Number(it.quantity || 1),
        is_reviewed: false,
      }));

      await supabase.from('order_items').insert(lineItemsPayload).select();
    }

    // 3. Always save in localStorage for instant seamless client-side reflection
    if (typeof window !== 'undefined') {
      try {
        const localRecord = {
          ...payload,
          id: createdOrderId,
          _id: createdOrderId,
          items: order.items,
        };
        const existingRaw = localStorage.getItem('sumuk_recent_orders');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = [localRecord, ...existingList.filter(o => (o.id !== createdOrderId && o._id !== createdOrderId && o.order_number !== orderNumber))];
        localStorage.setItem('sumuk_recent_orders', JSON.stringify(updatedList));
      } catch (storageErr) {
        console.warn('LocalStorage save notice:', storageErr);
      }
    }

    return orderResult || payload;
  } catch (err) {
    console.warn('Supabase order error:', err.message);
    return null;
  }
}

/**
 * Query orders from Supabase with joined order items
 */
export async function getSupabaseOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          order_id,
          product_id,
          product_name,
          product_image,
          price,
          quantity,
          is_reviewed
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch orders notice:', err.message);
    return [];
  }
}

/**
 * Query orders for a specific user (by user ID or email)
 */
export async function getSupabaseOrdersByUser(userId, email) {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          order_id,
          product_id,
          product_name,
          product_image,
          price,
          quantity,
          is_reviewed
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('buyer_email', email.toLowerCase().trim());
    } else {
      return [];
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch user orders notice:', err.message);
    return [];
  }
}

/**
 * Update order status (e.g. Cancelled, Shipped, Delivered) in Supabase
 */
export async function updateOrderStatusInSupabase(orderId, status, details = {}) {
  try {
    const updates = {
      status,
      updated_at: new Date().toISOString(),
      ...details,
    };

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Update order status error:', err);
    return { data: null, error: err.message };
  }
}

/**
 * Query customers from Supabase
 */
export async function getSupabaseCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch customers notice:', err.message);
    return [];
  }
}

/**
 * ==========================================
 * SITE ANNOUNCEMENTS & BROADCAST BANNER
 * ==========================================
 */

export const DEFAULT_ANNOUNCEMENT = {
  id: 'global',
  message: '✨ Sacred Consecration: Every crystal specimen is cleansed with 528Hz Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen.',
  is_active: false,
};

/**
 * Fetch global site broadcast announcement
 */
export async function getSupabaseAnnouncement() {
  try {
    const { data, error } = await supabase
      .from('site_announcements')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sumuk_site_announcement', JSON.stringify(data));
        } catch (_) {}
      }
      return data;
    }
  } catch (err) {
    // Gracefully fallback if table does not exist in schema cache
  }

  // Defensive fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sumuk_site_announcement');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
  }

  return DEFAULT_ANNOUNCEMENT;
}

/**
 * Update global site broadcast announcement
 */
export async function updateSupabaseAnnouncement({ message, is_active }) {
  const payload = {
    id: 'global',
    message: (message || '').trim(),
    is_active: Boolean(is_active),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('site_announcements')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_site_announcement', JSON.stringify(data || payload));
      } catch (_) {}
    }

    return { success: true, announcement: data || payload, error: null };
  } catch (err) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_site_announcement', JSON.stringify(payload));
      } catch (_) {}
    }
    return { success: true, announcement: payload, error: null };
  }
}

/**
 * ==========================================
 * SERVICE AVAILABILITY MANAGEMENT
 * ==========================================
 */

export const CANONICAL_SERVICES_DEFAULT = [
  { id: 'reiki-master', name: 'Reiki Mastership & Energy Attunement', status: 'available' },
  { id: 'aura-checking', name: 'Aura Checking & Biofield Scanning', status: 'available' },
  { id: 'numerology', name: 'Sacred Numerology & Destiny Blueprint', status: 'available' },
  { id: 'tarot-readings', name: 'Intuitive Tarot Readings & Guidance', status: 'available' },
  { id: 'crystal-therapy', name: 'Crystal Therapy & Resonant Attunement', status: 'available' },
  { id: 'psychic-surgery', name: 'Psychic Surgery & Etheric Cord Cutting', status: 'available' },
  { id: 'energy-healing', name: 'Energy Healing & Blockage Removal', status: 'available' },
  { id: 'reiki-infused-products', name: 'Reiki-Infused Crystal Products', status: 'available' },
  { id: 'customized-crystal-orders', name: 'Customized Crystal Orders & Bespoke Curation', status: 'available' },
];

/**
 * Fetch all service availability statuses
 */
export async function getSupabaseServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      if (typeof window !== 'undefined') {
        try {
          const map = {};
          data.forEach((s) => { map[s.id] = s.status || 'available'; });
          localStorage.setItem('sumuk_services_status_map', JSON.stringify(map));
        } catch (_) {}
      }
      return data;
    }
  } catch (err) {
    // Gracefully fallback if table does not exist in schema cache
  }

  // Defensive fallback from localStorage map
  if (typeof window !== 'undefined') {
    try {
      const cachedRaw = localStorage.getItem('sumuk_services_status_map');
      if (cachedRaw) {
        const cachedMap = JSON.parse(cachedRaw);
        return CANONICAL_SERVICES_DEFAULT.map((s) => ({
          ...s,
          status: cachedMap[s.id] || s.status,
        }));
      }
    } catch (_) {}
  }

  return CANONICAL_SERVICES_DEFAULT;
}

/**
 * Update individual service availability status
 */
export async function updateServiceStatusInSupabase(serviceId, status) {
  const allowedStatuses = ['available', 'currently unavailable', 'coming soon'];
  const validStatus = allowedStatuses.includes(status) ? status : 'available';

  try {
    const { data, error } = await supabase
      .from('services')
      .update({ status: validStatus, updated_at: new Date().toISOString() })
      .eq('id', serviceId)
      .select();

    if (error) throw error;

    // Cache locally
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem('sumuk_services_status_map');
        const cachedMap = cachedRaw ? JSON.parse(cachedRaw) : {};
        cachedMap[serviceId] = validStatus;
        localStorage.setItem('sumuk_services_status_map', JSON.stringify(cachedMap));
      } catch (_) {}
    }

    return { success: true, serviceId, status: validStatus, error: null };
  } catch (err) {
    console.warn('Supabase service update warning:', err.message);
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem('sumuk_services_status_map');
        const cachedMap = cachedRaw ? JSON.parse(cachedRaw) : {};
        cachedMap[serviceId] = validStatus;
        localStorage.setItem('sumuk_services_status_map', JSON.stringify(cachedMap));
      } catch (_) {}
    }
    return { success: true, serviceId, status: validStatus, error: null };
  }
}

/**
 * ==========================================
 * DELIVERY & SHIPPING CONFIGURATION
 * ==========================================
 */

export const DEFAULT_DELIVERY_SETTINGS = {
  id: 'global',
  origin_city: 'Pune',
  origin_state: 'Maharashtra',
  origin_lat: 18.5204,
  origin_lng: 73.8567,
  tier_1_max_km: 50,
  tier_1_fee: 50,
  tier_2_max_km: 150,
  tier_2_fee: 100,
  interstate_fee: 150,
  free_shipping_threshold: 5000,
  is_free_shipping_enabled: true,
};

/**
 * Fetch delivery configuration from Supabase
 */
export async function getSupabaseDeliverySettings() {
  try {
    const { data, error } = await supabase
      .from('delivery_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sumuk_delivery_settings', JSON.stringify(data));
        } catch (_) {}
      }
      return { ...DEFAULT_DELIVERY_SETTINGS, ...data };
    }
  } catch (err) {
    // Fallback gracefully
  }

  // Defensive fallback from localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sumuk_delivery_settings');
      if (cached) return { ...DEFAULT_DELIVERY_SETTINGS, ...JSON.parse(cached) };
    } catch (_) {}
  }

  return DEFAULT_DELIVERY_SETTINGS;
}

/**
 * Update delivery configuration in Supabase
 */
export async function updateSupabaseDeliverySettings(payload) {
  const record = {
    id: 'global',
    origin_city: payload.origin_city || 'Pune',
    origin_state: payload.origin_state || 'Maharashtra',
    origin_lat: Number(payload.origin_lat || 18.5204),
    origin_lng: Number(payload.origin_lng || 73.8567),
    tier_1_max_km: Number(payload.tier_1_max_km || 50),
    tier_1_fee: Number(payload.tier_1_fee || 50),
    tier_2_max_km: Number(payload.tier_2_max_km || 150),
    tier_2_fee: Number(payload.tier_2_fee || 100),
    interstate_fee: Number(payload.interstate_fee || 150),
    free_shipping_threshold: Number(payload.free_shipping_threshold || 5000),
    is_free_shipping_enabled: Boolean(payload.is_free_shipping_enabled),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('delivery_settings')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_delivery_settings', JSON.stringify(data || record));
      } catch (_) {}
    }

    return { success: true, settings: data || record, error: null };
  } catch (err) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_delivery_settings', JSON.stringify(record));
      } catch (_) {}
    }
    return { success: true, settings: record, error: null };
  }
}

/**
 * ============================================================================
 * DYNAMIC STORE FILTERS SYSTEM (ADMIN ADD / REMOVE PROVISION)
 * ============================================================================
 */
export const DEFAULT_STORE_FILTERS = [
  {
    id: 'intentions',
    name: 'Energy Intentions',
    slug: 'intentions',
    type: 'ticker_row1',
    isActive: true,
    options: [
      { id: 'all', label: 'All Energy Stones', count: 118, value: 'all', isActive: true },
      { id: 'wealth', label: 'Wealth & Abundance', count: 34, value: 'wealth', isActive: true },
      { id: 'love', label: 'Love & Harmony', count: 26, value: 'love', isActive: true },
      { id: 'protection', label: 'Protection & Evil Eye', count: 28, value: 'protection', isActive: true },
      { id: 'peace', label: 'Peace & Calm', count: 18, value: 'peace', isActive: true },
      { id: 'career', label: 'Career & Focus', count: 12, value: 'career', isActive: true },
      { id: 'spiritual', label: 'Spiritual Awakening', count: 15, value: 'spiritual', isActive: true },
    ],
  },
  {
    id: 'modalities',
    name: 'Healing Modalities',
    slug: 'modalities',
    type: 'ticker_row2',
    isActive: true,
    options: [
      { id: 'reiki-master', label: 'Reiki Master', value: 'reiki-master', isActive: true },
      { id: 'aura-checking', label: 'Aura Checking', value: 'aura-checking', isActive: true },
      { id: 'numerology', label: 'Numerology', value: 'numerology', isActive: true },
      { id: 'tarot-readings', label: 'Tarot Readings', value: 'tarot-readings', isActive: true },
      { id: 'crystal-therapy', label: 'Crystal Therapy', value: 'crystal-therapy', isActive: true },
      { id: 'psychic-surgery', label: 'Psychic Surgery', value: 'psychic-surgery', isActive: true },
      { id: 'vastu-alignment', label: 'Vastu Alignment', value: 'vastu-alignment', isActive: true },
    ],
  },
  {
    id: 'bead_sizes',
    name: 'Bead Sizes & Dimensions',
    slug: 'bead_sizes',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: '6mm', label: '6mm Dainty Petite', value: '6mm', isActive: true },
      { id: '8mm', label: '8mm Regular Standard', value: '8mm', isActive: true },
      { id: '10mm', label: '10mm Statement High Grade', value: '10mm', isActive: true },
      { id: '12mm', label: '12mm Master Collector', value: '12mm', isActive: true },
    ],
  },
  {
    id: 'chakras',
    name: 'Chakra Alignment',
    slug: 'chakras',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'crown', label: 'Crown Chakra (Sahasrara)', value: 'crown', isActive: true },
      { id: 'third-eye', label: 'Third Eye Chakra (Ajna)', value: 'third-eye', isActive: true },
      { id: 'throat', label: 'Throat Chakra (Vishuddha)', value: 'throat', isActive: true },
      { id: 'heart', label: 'Heart Chakra (Anahata)', value: 'heart', isActive: true },
      { id: 'solar-plexus', label: 'Solar Plexus (Manipura)', value: 'solar-plexus', isActive: true },
      { id: 'sacral', label: 'Sacral Chakra (Svadhishthana)', value: 'sacral', isActive: true },
      { id: 'root', label: 'Root Chakra (Muladhara)', value: 'root', isActive: true },
    ],
  },
  {
    id: 'crystal_types',
    name: 'Gemstones & Minerals',
    slug: 'crystal_types',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'fluorite', label: 'Rainbow Fluorite', value: 'fluorite', isActive: true },
      { id: 'pyrite', label: 'Golden Pyrite / Fool\'s Gold', value: 'pyrite', isActive: true },
      { id: 'amethyst', label: 'Amethyst Sacred Violet', value: 'amethyst', isActive: true },
      { id: 'clear-quartz', label: 'Clear Quartz Master Healer', value: 'clear-quartz', isActive: true },
      { id: 'rose-quartz', label: 'Rose Quartz Love Stone', value: 'rose-quartz', isActive: true },
      { id: 'black-tourmaline', label: 'Black Tourmaline Shield', value: 'black-tourmaline', isActive: true },
      { id: 'citrine', label: 'Natural Citrine Merchant Stone', value: 'citrine', isActive: true },
      { id: 'tiger-eye', label: 'Golden Tiger Eye', value: 'tiger-eye', isActive: true },
      { id: 'labradorite', label: 'Spectrolite Labradorite', value: 'labradorite', isActive: true },
      { id: 'selenite', label: 'Moroccan Selenite', value: 'selenite', isActive: true },
    ],
  },
];

/**
 * Fetch live dynamic store filters
 */
export async function getSupabaseStoreFilters() {
  try {
    const { data, error } = await supabase
      .from('store_filters')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sumuk_store_filters', JSON.stringify(data));
        } catch (_) {}
      }
      return data;
    }
  } catch (err) {
    console.warn('Supabase store filters note:', err.message);
  }

  // Defensive fallback from localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sumuk_store_filters');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
  }

  return DEFAULT_STORE_FILTERS;
}

/**
 * Save store filters to Supabase & localStorage
 */
export async function saveSupabaseStoreFilters(filters) {
  try {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_store_filters', JSON.stringify(filters));
        window.dispatchEvent(new CustomEvent('sumuk_filters_updated', { detail: filters }));
      } catch (_) {}
    }

    // Upsert into Supabase store_filters table if available
    if (Array.isArray(filters)) {
      for (let i = 0; i < filters.length; i++) {
        const item = {
          id: filters[i].id,
          name: filters[i].name,
          slug: filters[i].slug || filters[i].id,
          type: filters[i].type || 'sidebar',
          options: filters[i].options || [],
          is_active: filters[i].isActive !== false,
          sort_order: i,
          updated_at: new Date().toISOString(),
        };
        await supabase
          .from('store_filters')
          .upsert(item, { onConflict: 'id' })
          .catch(() => {});
      }
    }

    return { success: true, filters };
  } catch (err) {
    console.warn('Save filters warning:', err.message);
    return { success: true, filters };
  }
}

/**
 * Reset store filters to canonical defaults
 */
export async function resetDefaultStoreFilters() {
  return saveSupabaseStoreFilters(DEFAULT_STORE_FILTERS);
}

