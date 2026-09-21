import { supabase } from './supabase';

/**
 * =========================================================================
 * SUMUK CRYSTALZ — SUPABASE ACCOUNT & REVIEW CLIENT SERVICE
 * =========================================================================
 */

/**
 * Fetch the currently authenticated user from Supabase Auth
 * @returns {Promise<{ user: object|null, error: object|null }>}
 */
export async function getAuthUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Session might not be present or expired
      return { user: null, error };
    }
    return { user, error: null };
  } catch (err) {
    console.error('Error in getAuthUser:', err);
    return { user: null, error: err };
  }
}

/**
 * Fetch customer profile by user ID
 * @param {string} userId
 * @returns {Promise<{ profile: object|null, error: object|null }>}
 */
export async function getUserProfile(userId) {
  try {
    if (!userId) throw new Error('User ID is required');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If profile does not exist yet, we can attempt an upsert fallback
      if (error.code === 'PGRST116') {
        return { profile: null, error: null };
      }
      throw error;
    }

    return { profile: data, error: null };
  } catch (err) {
    console.warn('Error fetching user profile from Supabase:', err.message);
    return { profile: null, error: err };
  }
}

/**
 * Update customer profile details
 * @param {string} userId
 * @param {object} updates - { full_name, phone, address, avatar_url }
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function updateUserProfile(userId, updates) {
  try {
    if (!userId) throw new Error('User ID is required');

    const payload = {
      ...updates,
      id: userId,
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    return { data: null, error: err };
  }
}

/**
 * Fetch user order history joined with order items
 * Orders sorted by created_at DESC
 * @param {string} userId
 * @returns {Promise<{ orders: Array, error: object|null }>}
 */
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

    // Normalizing order_items field
    const formattedOrders = (data || []).map((order) => ({
      ...order,
      order_items: order.order_items || [],
    }));

    return { orders: formattedOrders, error: null };
  } catch (err) {
    console.warn('Error fetching user orders from Supabase:', err.message);
    return { orders: [], error: err };
  }
}

/**
 * Fetch aggregated metrics for the account dashboard
 * (Total orders, Total reviews written, Total investment)
 * @param {string} userId
 * @returns {Promise<{ metrics: object, error: object|null }>}
 */
export async function getUserAccountMetrics(userId) {
  try {
    if (!userId) throw new Error('User ID is required');

    // 1. Fetch Orders Count & Sum
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('user_id', userId);

    if (ordersError) throw ordersError;

    // 2. Fetch Reviews Count
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
    console.warn('Error fetching user metrics:', err.message);
    return {
      metrics: {
        totalOrders: 0,
        totalSpent: 0,
        totalReviews: 0,
        activeOrders: 0,
      },
      error: err,
    };
  }
}

/**
 * Upload an image file to Supabase Storage 'review-images' bucket
 * Path convention: review-images/${userId}/${Date.now()}_${sanitizedFileName}
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<{ publicUrl: string|null, error: object|null }>}
 */
export async function uploadReviewImage(userId, file) {
  try {
    if (!userId || !file) {
      throw new Error('User ID and image file are required');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid JPEG, PNG, or WEBP image.');
    }

    // Validate file size (max 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('Image size must be under 5MB.');
    }

    // Clean filename and construct path
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${Date.now()}_${cleanFileName}`;

    // Upload to 'review-images' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('review-images')
      .getPublicUrl(filePath);

    return { publicUrl, filePath, error: null };
  } catch (err) {
    console.error('Supabase Review Image Upload Error:', err.message);
    return { publicUrl: null, filePath: null, error: err };
  }
}

/**
 * Complete Product Review Submission Workflow
 * 1. Uploads optional review image to 'review-images' Supabase Storage bucket
 * 2. Inserts new record into 'reviews' table
 * 3. Updates 'order_items' table setting is_reviewed = true
 * 
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.productId
 * @param {string} params.orderId
 * @param {string} params.orderItemId
 * @param {number} params.rating (1-5)
 * @param {string} params.comment
 * @param {File|null} params.photoFile
 * @returns {Promise<{ success: boolean, review: object|null, error: string|null }>}
 */
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
    if (!userId) throw new Error('You must be signed in to submit a review.');
    if (!rating || rating < 1 || rating > 5) throw new Error('Please select a star rating from 1 to 5.');
    if (!comment || comment.trim().length < 5) throw new Error('Please enter a review comment (minimum 5 characters).');

    let photoUrl = null;

    // 1. Upload photo if supplied
    if (photoFile) {
      const { publicUrl, error: uploadErr } = await uploadReviewImage(userId, photoFile);
      if (uploadErr) {
        throw new Error(`Failed to upload photo: ${uploadErr.message}`);
      }
      photoUrl = publicUrl;
    }

    // 2. Insert into 'reviews' table
    const reviewPayload = {
      user_id: userId,
      product_id: productId || null,
      order_id: orderId || null,
      rating: Math.round(rating),
      comment: comment.trim(),
      photo_url: photoUrl,
      created_at: new Date().toISOString(),
    };

    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert([reviewPayload])
      .select()
      .single();

    if (reviewError) {
      throw new Error(`Failed to save review: ${reviewError.message}`);
    }

    // 3. Mark the specific order item as reviewed
    if (orderItemId) {
      const { error: updateItemError } = await supabase
        .from('order_items')
        .update({ is_reviewed: true })
        .eq('id', orderItemId);

      if (updateItemError) {
        console.warn('Warning: Could not update order item is_reviewed status:', updateItemError.message);
      }
    }

    return {
      success: true,
      review: reviewData,
      error: null,
    };
  } catch (err) {
    console.error('Submit review error:', err);
    return {
      success: false,
      review: null,
      error: err.message || 'An unexpected error occurred while submitting your review.',
    };
  }
}

/**
 * Format timestamp into "Member Since: DD Month, YYYY"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatMemberSinceDate(dateInput) {
  if (!dateInput) return 'Member Since: September, 2026';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Member Since: September, 2026';
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `Member Since: ${day} ${month}, ${year}`;
  } catch {
    return 'Member Since: September, 2026';
  }
}
