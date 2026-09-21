import { supabase } from './supabase';

/**
 * =========================================================================
 * ADMIN SUPABASE SERVICE: DYNAMIC ATTRIBUTES MANAGEMENT
 * =========================================================================
 */

export async function createProductWithOptions(productData, options = []) {
  try {
    // 1. Attempt atomic RPC call
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

    // 2. Coordinated Fallback
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
    console.error('Error in admin createProductWithOptions:', err);
    return { success: false, error: err.message || err };
  }
}

export async function fetchProductWithOptions(idOrSlug) {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase
      .from('products')
      .select(`
        *,
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
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching admin product options:', err);
    return null;
  }
}
