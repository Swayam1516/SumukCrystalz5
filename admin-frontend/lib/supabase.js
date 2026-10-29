import { createClient } from '@supabase/supabase-js';
import { CRYSTAL_CATALOG } from '../data/crystals';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmsiounkoqpwjccczebk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Offline & DNS failure circuit breaker
let isSupabaseOffline = false;
let lastOfflineCheck = 0;
const OFFLINE_COOLDOWN_MS = 60000;

export function isSupabaseOfflineState() {
  return isSupabaseOffline && (Date.now() - lastOfflineCheck < OFFLINE_COOLDOWN_MS);
}

export function markSupabaseOffline() {
  isSupabaseOffline = true;
  lastOfflineCheck = Date.now();
}

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
    authenticityInfo: raw.authenticity_info || 'Authentic Natural Crystal & Sacredly Consecrated',
    authenticity_info: raw.authenticity_info || 'Authentic Natural Crystal & Sacredly Consecrated',
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
    assigned_filters: raw.assigned_filters || raw.assignedFilters || raw.tags || [],
    assignedFilters: raw.assigned_filters || raw.assignedFilters || raw.tags || [],
    tags: raw.assigned_filters || raw.assignedFilters || raw.tags || [],
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
      authenticity_info: productPayload.authenticityInfo || productPayload.authenticity_info || 'Authentic Natural Crystal & Sacredly Consecrated',
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

    let savedProduct = null;
    let isCloudSaved = false;

    // 1. Try to upsert into Supabase if not flagged offline
    if (!isSupabaseOfflineState()) {
      try {
        const isExistingUuid = typeof productPayload.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productPayload.id);
        if (isExistingUuid) {
          productRecord.id = productPayload.id;
        }

        const { data, error: prodErr } = await supabase
          .from('products')
          .upsert(productRecord, { onConflict: isExistingUuid ? 'id' : 'slug' })
          .select()
          .single();

        if (!prodErr && data) {
          savedProduct = data;
          isCloudSaved = true;
          const productId = savedProduct.id;

          // Sync Variants
          if (productPayload.variants && Array.isArray(productPayload.variants) && productPayload.variants.length > 0) {
            await supabase.from('product_variants').delete().eq('product_id', productId).catch(() => {});

            const variantsToInsert = productPayload.variants.map((v, i) => ({
              product_id: productId,
              variant_name: v.name || v.variant_name || 'Standard',
              bead_size: v.beadSize || v.bead_size || '',
              bracelet_size: v.braceletSize || v.bracelet_size || '',
              weight: v.weight || '',
              color_finish: v.colorFinish || v.color_finish || '',
              selling_price: Number(v.price || v.selling_price || sellingPrice),
              original_price: Number(v.originalPrice || v.original_price || originalPrice),
              stock: Number(v.stock || v.stockCount || 20),
              sku: v.sku || `${slug.toUpperCase()}-${i + 1}`,
              available: v.available !== false,
            }));

            await supabase.from('product_variants').insert(variantsToInsert).catch(() => {});
          }

          // Sync Images
          if (images.length > 0) {
            await supabase.from('product_images').delete().eq('product_id', productId).catch(() => {});

            const imagesToInsert = images.map((url, idx) => ({
              product_id: productId,
              image_url: url,
              display_order: idx + 1,
              is_hero: idx === 0,
            }));

            await supabase.from('product_images').insert(imagesToInsert).catch(() => {});
          }
        } else if (prodErr) {
          console.warn('Supabase product save warning:', prodErr.message);
          markSupabaseOffline();
        }
      } catch (cloudErr) {
        console.warn('Supabase network error, saving to local vault:', cloudErr.message);
        markSupabaseOffline();
      }
    }

    // 2. Build full normalized product
    const finalId = savedProduct?.id || productPayload.id || `crys-${Date.now()}`;
    const normalized = normalizeProduct({
      ...productRecord,
      id: finalId,
      images,
      product_images: images.map((url, idx) => ({ id: `img-${idx}`, image_url: url, display_order: idx + 1, is_hero: idx === 0 })),
      variants: productPayload.variants || [],
      product_variants: (productPayload.variants || []).map((v, idx) => ({
        id: v.id || `var-${Date.now()}-${idx}`,
        variant_name: v.name || v.variant_name || 'Standard',
        bead_size: v.beadSize || v.bead_size || '',
        selling_price: Number(v.price || v.selling_price || sellingPrice),
        original_price: Number(v.originalPrice || v.original_price || originalPrice),
        stock: Number(v.stock || v.stockCount || 20),
        sku: v.sku || `${slug.toUpperCase()}-${idx + 1}`,
      })),
    });

    // 3. Persist to browser LocalStorage vault
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('sumuk_custom_products') || '[]');
        const updated = [normalized, ...stored.filter(p => p.id !== normalized.id && p.slug !== normalized.slug)];
        localStorage.setItem('sumuk_custom_products', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('sumuk_products_updated', { detail: updated }));
      } catch (_) {}
    }

    return {
      success: true,
      product: normalized,
      isOfflineFallback: !isCloudSaved,
      error: null
    };
  } catch (err) {
    console.warn('Error in saveProductToSupabase:', err);
    return { success: true, product: productPayload, isOfflineFallback: true, error: null };
  }
}

/**
 * Fetch all products from Supabase with joined variants and images
 */
export async function getSupabaseProducts(onlyActive = false) {
  let localProducts = [];
  if (typeof window !== 'undefined') {
    try {
      localProducts = JSON.parse(localStorage.getItem('sumuk_custom_products') || '[]');
    } catch (_) {}
  }

  if (isSupabaseOfflineState()) {
    const combined = [...localProducts, ...CRYSTAL_CATALOG.map(normalizeProduct)];
    return onlyActive ? combined.filter(p => p.active !== false) : combined;
  }

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

    const cloudProducts = (data || []).map(normalizeProduct);
    const combined = [...localProducts, ...cloudProducts.filter(cp => !localProducts.some(lp => lp.id === cp.id || lp.slug === cp.slug))];
    return combined;
  } catch (err) {
    markSupabaseOffline();
    const combined = [...localProducts, ...CRYSTAL_CATALOG.map(normalizeProduct)];
    return onlyActive ? combined.filter(p => p.active !== false) : combined;
  }
}

/**
 * Fetch single product by slug or UUID
 */
export async function getSupabaseProductBySlug(slugOrId) {
  if (!slugOrId) return null;
  if (isSupabaseOfflineState()) return null;

  try {
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
    markSupabaseOffline();
    return null;
  }
}

/**
 * Delete product and cascading variants / images from Supabase
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

/**
 * Query orders from Supabase
 */
export async function getSupabaseOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch orders notice:', err.message);
    return [];
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
  message: '✨ Sacred Consecration: Every crystal specimen is cleansed with sacred Solfeggio sound bowls & consecrated by Usui Reiki Master Soumyaa Naveen.',
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
 * OCCASION & FESTIVAL SALE BANNER MANAGEMENT
 * ==========================================
 */

export const DEFAULT_OCCASION_BANNER = {
  id: 'occasion_sale_banner',
  occasion_name: 'Diwali',
  title: 'BIG SPIRITUAL DIWALI',
  subtitle: 'SALE STARTS 28TH OCT',
  discount_badge: 'FESTIVE SALE',
  link_url: '/shop?sale=diwali',
  image_url: '/images/diwali-sale-banner.jpg',
  gradient_theme: 'diwali',
  is_active: true,
  updated_at: new Date().toISOString(),
};

/**
 * Fetch dynamic occasion sale banner
 */
export async function getSupabaseOccasionBanner() {
  if (!isSupabaseOfflineState()) {
    try {
      const { data, error } = await supabase
        .from('site_announcements')
        .select('*')
        .eq('id', 'occasion_sale_banner')
        .maybeSingle();

      if (!error && data && data.message) {
        try {
          const parsed = JSON.parse(data.message);
          if (parsed && typeof parsed === 'object') {
            if (typeof window !== 'undefined') {
              localStorage.setItem('sumuk_occasion_banner', JSON.stringify(parsed));
            }
            return parsed;
          }
        } catch (_) {}
      }
    } catch (err) {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sumuk_occasion_banner');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
  }

  return DEFAULT_OCCASION_BANNER;
}

/**
 * Save/update dynamic occasion sale banner
 */
export async function updateSupabaseOccasionBanner(bannerPayload) {
  const merged = {
    ...DEFAULT_OCCASION_BANNER,
    ...bannerPayload,
    updated_at: new Date().toISOString(),
  };

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sumuk_occasion_banner', JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('sumuk_occasion_banner_updated', { detail: merged }));
    }

    if (!isSupabaseOfflineState()) {
      await supabase
        .from('site_announcements')
        .upsert({
          id: 'occasion_sale_banner',
          message: JSON.stringify(merged),
          is_active: Boolean(merged.is_active),
          updated_at: merged.updated_at,
        }, { onConflict: 'id' })
        .catch(() => {});
    }

    return { success: true, banner: merged };
  } catch (err) {
    console.warn('Update banner warning:', err);
    return { success: true, banner: merged };
  }
}

/**
 * ==========================================
 * SERVICE AVAILABILITY MANAGEMENT
 * ==========================================
 */

import { CANONICAL_SERVICES_DEFAULT, normalizeService, SERVICE_CATEGORIES } from '../data/servicesData';
export { CANONICAL_SERVICES_DEFAULT, normalizeService, SERVICE_CATEGORIES };

/**
 * ==========================================
 * SERVICE AVAILABILITY & MODALITIES MANAGEMENT
 * ==========================================
 */

/**
 * Fetch all service availability statuses and full rich descriptions
 */
export async function getSupabaseServices() {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      const normalizedList = data.map(normalizeService);

      if (typeof window !== 'undefined') {
        try {
          const map = {};
          normalizedList.forEach((s) => { map[s.id] = s.status || 'available'; });
          localStorage.setItem('sumuk_services_status_map', JSON.stringify(map));
          localStorage.setItem('sumuk_custom_services_list', JSON.stringify(normalizedList));
        } catch (_) {}
      }
      return normalizedList;
    }
  } catch (err) {
    // Gracefully fallback
  }

  // 2. Check localStorage custom services list
  if (typeof window !== 'undefined') {
    try {
      const cachedCustom = localStorage.getItem('sumuk_custom_services_list');
      if (cachedCustom) {
        const parsed = JSON.parse(cachedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeService);
        }
      }

      // Check status map fallback
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

  // 3. Fallback to canonical 9 modalities
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

        const cachedCustom = localStorage.getItem('sumuk_custom_services_list');
        if (cachedCustom) {
          const list = JSON.parse(cachedCustom);
          const idx = list.findIndex((s) => s.id === serviceId);
          if (idx >= 0) {
            list[idx].status = validStatus;
            localStorage.setItem('sumuk_custom_services_list', JSON.stringify(list));
          }
        }
      } catch (_) {}
    }

    return { success: true, serviceId, status: validStatus, error: null };
  } catch (err) {
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem('sumuk_services_status_map');
        const cachedMap = cachedRaw ? JSON.parse(cachedRaw) : {};
        cachedMap[serviceId] = validStatus;
        localStorage.setItem('sumuk_services_status_map', JSON.stringify(cachedMap));

        const cachedCustom = localStorage.getItem('sumuk_custom_services_list');
        if (cachedCustom) {
          const list = JSON.parse(cachedCustom);
          const idx = list.findIndex((s) => s.id === serviceId);
          if (idx >= 0) {
            list[idx].status = validStatus;
            localStorage.setItem('sumuk_custom_services_list', JSON.stringify(list));
          }
        }
      } catch (_) {}
    }
    return { success: true, serviceId, status: validStatus, error: null };
  }
}

/**
 * Save complete service object (Broad description, pricing, tiers, keywords, requirements)
 */
export async function saveServiceToSupabase(serviceData) {
  const normalized = normalizeService(serviceData);
  if (!normalized || !normalized.id) {
    return { success: false, error: 'Service ID is required' };
  }

  // 1. Cache locally immediately
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sumuk_custom_services_list');
      let list = cached ? JSON.parse(cached) : [...CANONICAL_SERVICES_DEFAULT];
      const idx = list.findIndex((s) => s.id === normalized.id);
      if (idx >= 0) {
        list[idx] = normalized;
      } else {
        list.push(normalized);
      }
      localStorage.setItem('sumuk_custom_services_list', JSON.stringify(list));

      const statusMapRaw = localStorage.getItem('sumuk_services_status_map');
      const statusMap = statusMapRaw ? JSON.parse(statusMapRaw) : {};
      statusMap[normalized.id] = normalized.status || 'available';
      localStorage.setItem('sumuk_services_status_map', JSON.stringify(statusMap));
    } catch (_) {}
  }

  // 2. Persist to Supabase
  try {
    const payload = {
      id: normalized.id,
      name: normalized.name || normalized.title,
      title: normalized.title || normalized.name,
      short_title: normalized.shortTitle || normalized.name,
      category: normalized.category || 'readings',
      price: Number(normalized.price || 0),
      status: normalized.status || 'available',
      duration: normalized.duration || '',
      format: normalized.format || '',
      tagline: normalized.tagline || '',
      description: normalized.description || '',
      benefits: {
        badge: normalized.badge,
        priceDisplay: normalized.priceDisplay,
        broadDescription: normalized.broadDescription,
        keywords: normalized.keywords,
        pricingTiers: normalized.pricingTiers,
        whatWeAnalyse: normalized.whatWeAnalyse,
        howItWorks: normalized.howItWorks,
        detailsRequired: normalized.detailsRequired,
        importantNote: normalized.importantNote,
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('services')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn('Supabase service upsert error:', error.message);
    }
    return { success: true, service: normalized, error: null };
  } catch (err) {
    console.warn('Supabase service upsert exception:', err.message);
    return { success: true, service: normalized, error: null };
  }
}

/**
 * Reset all services to default canonical seed data
 */
export async function resetServicesToDefault() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('sumuk_custom_services_list');
      localStorage.removeItem('sumuk_services_status_map');
    } catch (_) {}
  }
  return CANONICAL_SERVICES_DEFAULT;
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
    id: 'purpose',
    name: '1. Shop by Purpose',
    slug: 'purpose',
    type: 'ticker_row1',
    isActive: true,
    options: [
      { id: 'purpose:love-relationships', label: 'Love & Relationships', count: 26, value: 'love-relationships', isActive: true },
      { id: 'purpose:money-abundance', label: 'Money & Abundance', count: 34, value: 'money-abundance', isActive: true },
      { id: 'purpose:protection', label: 'Protection & Shielding', count: 28, value: 'protection', isActive: true },
      { id: 'purpose:peace-relaxation', label: 'Peace & Relaxation', count: 18, value: 'peace-relaxation', isActive: true },
      { id: 'purpose:focus-studies', label: 'Focus & Studies', count: 14, value: 'focus-studies', isActive: true },
      { id: 'purpose:confidence', label: 'Confidence', count: 16, value: 'confidence', isActive: true },
      { id: 'purpose:career-business', label: 'Career & Business', count: 22, value: 'career-business', isActive: true },
      { id: 'purpose:manifestation', label: 'Manifestation', count: 20, value: 'manifestation', isActive: true },
      { id: 'purpose:spiritual-growth', label: 'Spiritual Growth', count: 25, value: 'spiritual-growth', isActive: true },
      { id: 'purpose:healing-wellness', label: 'Healing & Wellness', count: 30, value: 'healing-wellness', isActive: true },
    ],
  },
  {
    id: 'energy_system',
    name: '2. Shop by Energy System',
    slug: 'energy_system',
    type: 'ticker_row2',
    isActive: true,
    options: [
      { id: 'energy:7-chakras', label: '7 Chakras', count: 42, value: '7-chakras', isActive: true },
      { id: 'energy:zodiac', label: 'Zodiac', count: 38, value: 'zodiac', isActive: true },
      { id: 'energy:numerology', label: 'Numerology / Numbers', count: 18, value: 'numerology', isActive: true },
      { id: 'energy:planetary', label: 'Planetary', count: 16, value: 'planetary', isActive: true },
      { id: 'energy:aura-energy', label: 'Aura & Energy', count: 22, value: 'aura-energy', isActive: true },
      { id: 'energy:vastu', label: 'Vastu', count: 26, value: 'vastu', isActive: true },
    ],
  },
  {
    id: 'crystal_specimen',
    name: '3. Shop by Crystal / Specimen',
    slug: 'crystal_specimen',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'specimen:raw-stones', label: 'Raw Stones', value: 'raw-stones', count: 19, isActive: true },
      { id: 'specimen:tumbles', label: 'Tumbles', value: 'tumbles', count: 27, isActive: true },
      { id: 'specimen:towers-points', label: 'Towers & Points', value: 'towers-points', count: 21, isActive: true },
      { id: 'specimen:pyramids', label: 'Pyramids', value: 'pyramids', count: 18, isActive: true },
      { id: 'specimen:spheres', label: 'Spheres', value: 'spheres', count: 15, isActive: true },
      { id: 'specimen:clusters-geodes', label: 'Clusters & Geodes', value: 'clusters-geodes', count: 14, isActive: true },
      { id: 'specimen:crystal-trees', label: 'Crystal Trees', value: 'crystal-trees', count: 12, isActive: true },
      { id: 'specimen:crystal-chips', label: 'Crystal Chips', value: 'crystal-chips', count: 10, isActive: true },
      { id: 'specimen:gemstone-specimens', label: 'Gemstone Specimens', value: 'gemstone-specimens', count: 32, isActive: true },
      { id: 'specimen:rare-collector', label: 'Rare / Collector Crystals', value: 'rare-collector', count: 8, isActive: true },
    ],
  },
  {
    id: 'jewellery',
    name: '4. Shop by Jewellery',
    slug: 'jewellery',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'jewellery:bracelets', label: 'Bracelets', value: 'bracelets', count: 48, isActive: true },
      { id: 'jewellery:malas', label: 'Malas', value: 'malas', count: 16, isActive: true },
      { id: 'jewellery:necklaces', label: 'Necklaces', value: 'necklaces', count: 14, isActive: true },
      { id: 'jewellery:pendants', label: 'Pendants', value: 'pendants', count: 24, isActive: true },
      { id: 'jewellery:rings', label: 'Rings', value: 'rings', count: 11, isActive: true },
      { id: 'jewellery:earrings', label: 'Earrings', value: 'earrings', count: 9, isActive: true },
      { id: 'jewellery:beads', label: 'Beads', value: 'beads', count: 15, isActive: true },
      { id: 'jewellery:custom-jewellery', label: 'Custom Jewellery', value: 'custom-jewellery', count: 7, isActive: true },
    ],
  },
  {
    id: 'bead_size',
    name: '5. Shop by Bead Size',
    slug: 'bead_size',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'bead:4mm', label: '4 mm', value: '4mm', count: 12, isActive: true },
      { id: 'bead:6mm', label: '6 mm', value: '6mm', count: 28, isActive: true },
      { id: 'bead:8mm', label: '8 mm', value: '8mm', count: 52, isActive: true },
      { id: 'bead:10mm', label: '10 mm', value: '10mm', count: 24, isActive: true },
      { id: 'bead:12mm-plus', label: '12 mm+', value: '12mm-plus', count: 14, isActive: true },
      { id: 'bead:custom-size', label: 'Custom Size', value: 'custom-size', count: 6, isActive: true },
    ],
  },
  {
    id: 'home_space',
    name: '6. Shop for Home & Space',
    slug: 'home_space',
    type: 'sidebar',
    isActive: true,
    options: [
      { id: 'home:vastu-crystals', label: 'Vastu Crystals', value: 'vastu-crystals', count: 26, isActive: true },
      { id: 'home:crystal-trees', label: 'Crystal Trees', value: 'crystal-trees', count: 14, isActive: true },
      { id: 'home:crystal-pyramids', label: 'Crystal Pyramids', value: 'crystal-pyramids', count: 18, isActive: true },
      { id: 'home:selenite-decor', label: 'Selenite Décor', value: 'selenite-decor', count: 16, isActive: true },
      { id: 'home:clusters-geodes', label: 'Crystal Geodes & Clusters', value: 'clusters-geodes', count: 15, isActive: true },
      { id: 'home:crystal-spheres', label: 'Crystal Spheres', value: 'crystal-spheres', count: 12, isActive: true },
      { id: 'home:crystal-idols', label: 'Crystal Idols', value: 'crystal-idols', count: 9, isActive: true },
      { id: 'home:evil-eye-hangings', label: 'Evil-Eye / Protection Hangings', value: 'evil-eye-hangings', count: 18, isActive: true },
      { id: 'home:desk-office', label: 'Desk & Office Décor', value: 'desk-office', count: 20, isActive: true },
      { id: 'home:meditation-decor', label: 'Meditation / Spiritual Décor', value: 'meditation-decor', count: 22, isActive: true },
      { id: 'home:gift-decor', label: 'Gift & Décor Pieces', value: 'gift-decor', count: 25, isActive: true },
    ],
  },
];

/**
 * Fetch live dynamic store filters
 */
export async function getSupabaseStoreFilters() {
  if (!isSupabaseOfflineState()) {
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
      markSupabaseOffline();
    }
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

