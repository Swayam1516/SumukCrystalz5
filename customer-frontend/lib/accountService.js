import { supabase } from './supabase';

/**
 * =========================================================================
 * SUMUK CRYSTALZ — SUPABASE ACCOUNT & REVIEW CLIENT SERVICE
 * =========================================================================
 */

export async function getAuthUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return { user: null, error };
    return { user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
}

export async function getUserProfile(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { profile: null, error: null };
      throw error;
    }
    return { profile: data, error: null };
  } catch (err) {
    return { profile: null, error: err };
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    if (!userId) throw new Error('User ID is required');
    const payload = { ...updates, id: userId };
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getUserOrdersWithItems(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        status,
        total_amount,
        created_at,
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formattedOrders = (data || []).map((order) => ({
      ...order,
      order_items: order.order_items || [],
    }));
    return { orders: formattedOrders, error: null };
  } catch (err) {
    return { orders: [], error: err };
  }
}

export async function getUserAccountMetrics(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('user_id', userId);

    if (ordersError) throw ordersError;

    const { count: reviewCount, error: reviewError } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (reviewError) throw reviewError;

    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0) || 0;
    const activeOrders = orders?.filter(o => ['pending', 'processing', 'shipped'].includes(o.status))?.length || 0;

    return {
      metrics: {
        totalOrders,
        totalSpent,
        totalReviews: reviewCount || 0,
        activeOrders,
      },
      error: null,
    };
  } catch (err) {
    return {
      metrics: { totalOrders: 0, totalSpent: 0, totalReviews: 0, activeOrders: 0 },
      error: err,
    };
  }
}

export async function uploadReviewImage(userId, file) {
  try {
    if (!userId || !file) throw new Error('User ID and image file are required');
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) throw new Error('Please select a valid JPEG, PNG, or WEBP image.');

    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) throw new Error('Image size must be under 5MB.');

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('review-images')
      .getPublicUrl(filePath);

    return { publicUrl, filePath, error: null };
  } catch (err) {
    return { publicUrl: null, filePath: null, error: err };
  }
}

export async function submitProductReview({
  userId,
  productId,
  orderId,
  orderItemId,
  rating,
  comment,
  photoFile = null,
}) {
  try {
    const isUuid = (val) => Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val)));
    const effectiveUserId = userId || 'patron-verified';

    if (!rating || rating < 1 || rating > 5) throw new Error('Please select a star rating from 1 to 5.');
    if (!comment || comment.trim().length < 5) throw new Error('Please enter a review comment (minimum 5 characters).');

    let photoUrl = null;
    if (photoFile) {
      try {
        const { publicUrl, error: uploadErr } = await uploadReviewImage(effectiveUserId, photoFile);
        if (!uploadErr && publicUrl) photoUrl = publicUrl;
      } catch (e) {
        console.warn('Review photo upload notice:', e.message);
      }
    }

    const clientReview = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
      user_id: effectiveUserId,
      product_id: productId || null,
      order_id: orderId || null,
      rating: Math.round(rating),
      comment: comment.trim(),
      photo_url: photoUrl,
      created_at: new Date().toISOString(),
    };

    let savedReview = clientReview;

    // 1. Try persisting to Supabase if UUIDs align and offline mode is not triggered
    try {
      const dbPayload = {
        rating: Math.round(rating),
        comment: comment.trim(),
        photo_url: photoUrl,
        created_at: new Date().toISOString(),
      };
      if (isUuid(effectiveUserId)) dbPayload.user_id = effectiveUserId;
      if (isUuid(productId)) dbPayload.product_id = productId;
      if (isUuid(orderId)) dbPayload.order_id = orderId;

      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert([dbPayload])
        .select()
        .single();

      if (!reviewError && reviewData) {
        savedReview = reviewData;
      } else if (reviewError) {
        console.warn('Notice persisting review to Supabase:', reviewError.message);
      }

      if (orderItemId && isUuid(orderItemId)) {
        await supabase
          .from('order_items')
          .update({ is_reviewed: true })
          .eq('id', orderItemId);
      }
    } catch (dbErr) {
      console.warn('Supabase review insert fallback notice:', dbErr.message);
    }

    // 2. Always persist to localStorage so review is instantly cached
    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('sumuk_customer_reviews') || '[]');
        existing.unshift(savedReview);
        localStorage.setItem('sumuk_customer_reviews', JSON.stringify(existing));
      }
    } catch (_) {}

    return { success: true, review: savedReview, error: null };
  } catch (err) {
    return { success: false, review: null, error: err.message };
  }
}

export function formatMemberSinceDate(dateInput) {
  if (!dateInput) return 'Member Since: September, 2026';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Member Since: September, 2026';
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `Member Since: ${day} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
  } catch {
    return 'Member Since: September, 2026';
  }
}
