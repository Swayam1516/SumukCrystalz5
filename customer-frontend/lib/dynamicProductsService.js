import { supabase } from './supabase';

/**
 * =========================================================================
 * SUPABASE CLIENT SERVICE: DYNAMIC PRODUCT ATTRIBUTES & FOUNDER ASSETS
 * =========================================================================
 */

/**
 * 1. Fetch a single product with nested product_options and product_option_values
 * @param {string} idOrSlug - UUID or slug of the product
 */
export async function fetchProductWithOptions(idOrSlug) {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        description,
        base_price,
        currency,
        images,
        is_active,
        total_stock,
        created_at,
        product_options (
          id,
          product_id,
          option_name,
          input_type,
          is_required,
          sort_order,
          product_option_values (
            id,
            option_id,
            label,
            price_adjustment,
            stock_quantity,
            sort_order
          )
        )
      `)
      .order('sort_order', { foreignTable: 'product_options', ascending: true })
      .order('sort_order', { foreignTable: 'product_options.product_option_values', ascending: true });

    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) {
      console.warn('Error fetching dynamic product options:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in fetchProductWithOptions:', err);
    return null;
  }
}

/**
 * 2. Fetch all active products with their dynamic options
 */
export async function fetchAllProductsWithOptions() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        description,
        base_price,
        currency,
        images,
        is_active,
        total_stock,
        product_options (
          id,
          option_name,
          input_type,
          is_required,
          sort_order,
          product_option_values (
            id,
            label,
            price_adjustment,
            stock_quantity,
            sort_order
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching catalog with dynamic options:', err);
    return [];
  }
}

/**
 * 3. Admin: Create a product with arbitrary dynamic options & choices
 * Supports both PostgreSQL RPC (Atomic Transaction) and Coordinated Batch Fallback
 * 
 * @param {Object} productData - { title, slug, description, base_price, images, total_stock, is_active }
 * @param {Array} options - [
 *   {
 *     option_name: "Bracelet Size",
 *     input_type: "radio",
 *     is_required: true,
 *     sort_order: 1,
 *     values: [
 *       { label: "6.5 inches", price_adjustment: 0, stock_quantity: 20 },
 *       { label: "7.0 inches (+₹150)", price_adjustment: 150, stock_quantity: 15 }
 *     ]
 *   }
 * ]
 */
export async function createProductWithOptions(productData, options = []) {
  try {
    // A. Attempt atomic transaction via PostgreSQL RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_product_with_options', {
      p_title: productData.title || productData.name,
      p_slug: productData.slug || null,
      p_description: productData.description || '',
      p_base_price: parseFloat(productData.base_price || productData.price || 0),
      p_images: productData.images || [],
      p_total_stock: parseInt(productData.total_stock || productData.stockCount || 0, 10),
      p_is_active: productData.is_active !== undefined ? productData.is_active : true,
      p_options: options,
    });

    if (!rpcError && rpcData?.success) {
      return { success: true, productId: rpcData.product_id, data: rpcData };
    }

    // B. Fallback: Coordinated Multi-table Client Batch Insert
    console.info('Falling back to coordinated client batch insert...');

    // 1. Insert Base Product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert([
        {
          title: productData.title || productData.name,
          slug: productData.slug || (productData.title || productData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
          description: productData.description || '',
          base_price: parseFloat(productData.base_price || productData.price || 0),
          images: productData.images || [],
          total_stock: parseInt(productData.total_stock || productData.stockCount || 0, 10),
          is_active: productData.is_active !== undefined ? productData.is_active : true,
        },
      ])
      .select()
      .single();

    if (prodErr) throw prodErr;

    const productId = product.id;

    // 2. Iterate through Option Groups
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const { data: createdOpt, error: optErr } = await supabase
        .from('product_options')
        .insert([
          {
            product_id: productId,
            option_name: opt.option_name,
            input_type: opt.input_type || 'select',
            is_required: opt.is_required !== undefined ? opt.is_required : true,
            sort_order: opt.sort_order || i + 1,
          },
        ])
        .select()
        .single();

      if (optErr) throw optErr;

      // 3. Insert Option Values for this Group
      if (opt.values && opt.values.length > 0) {
        const valuesToInsert = opt.values.map((val, valIndex) => ({
          option_id: createdOpt.id,
          label: val.label,
          price_adjustment: parseFloat(val.price_adjustment || 0),
          stock_quantity: parseInt(val.stock_quantity || 0, 10),
          sort_order: val.sort_order || valIndex + 1,
        }));

        const { error: valErr } = await supabase
          .from('product_option_values')
          .insert(valuesToInsert);

        if (valErr) throw valErr;
      }
    }

    return { success: true, productId, product };
  } catch (err) {
    console.error('Error creating product with options:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * 4. Create Order Item with Selected Dynamic Attributes Snapshot
 * @param {string} orderId - UUID of the parent order
 * @param {Object} itemData - Item details with selected_attributes JSONB
 */
export async function createOrderItemWithAttributes(orderId, itemData) {
  try {
    const payload = {
      order_id: orderId,
      product_id: itemData.productId || itemData.id || null,
      product_title: itemData.title || itemData.name,
      unit_price: parseFloat(itemData.finalPrice || itemData.unitPrice || itemData.price),
      quantity: parseInt(itemData.quantity || 1, 10),
      selected_attributes: itemData.selected_attributes || itemData.customOptions || {},
    };

    const { data, error } = await supabase
      .from('order_items')
      .insert([payload])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error recording order item with dynamic attributes:', err);
    return null;
  }
}

/**
 * 5. Founder Image & Asset Helper from Supabase Storage
 * Retrieves public URL from 'brand-assets' bucket with fallback
 */
export function getFounderImageUrl(path = 'founder.jpg') {
  try {
    const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
    if (data?.publicUrl) {
      return data.publicUrl;
    }
  } catch (e) {
    console.warn('Storage URL retrieval notice:', e);
  }
  // Elegant high-res fallback
  return '/images/soumya-profile.jpeg';
}
