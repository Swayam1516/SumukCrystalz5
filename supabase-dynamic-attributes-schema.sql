-- =========================================================================
-- SUMUK CRYSTALZ — FULLY DYNAMIC PRODUCT ATTRIBUTES & EAV SCHEMA
-- Database: PostgreSQL / Supabase
-- Purpose: Supports arbitrary product options (Size, Weight, Material, etc.)
--          with dynamic price modifiers, inventory tracking, and JSONB order snapshots.
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. PRODUCTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    currency TEXT DEFAULT 'INR',
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    total_stock INTEGER NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 2. PRODUCT OPTIONS TABLE (e.g. "Bracelet Wrist Size", "Crystal Weight")
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    option_name TEXT NOT NULL,
    input_type TEXT NOT NULL DEFAULT 'select' CHECK (input_type IN ('select', 'radio', 'text', 'checkbox')),
    is_required BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_product_option_name UNIQUE (product_id, option_name)
);

-- =========================================================================
-- 3. PRODUCT OPTION VALUES TABLE (e.g. "6.5 inches", "500g", "AAA Grade")
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.product_option_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id UUID NOT NULL REFERENCES public.product_options(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_option_value_label UNIQUE (option_id, label)
);

-- =========================================================================
-- 4. ORDERS & ORDER ITEMS ENHANCEMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
    tax NUMERIC(10, 2) DEFAULT 0 CHECK (tax >= 0),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    selected_attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If order_items table already existed without selected_attributes, add it safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'selected_attributes'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN selected_attributes JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- =========================================================================
-- 5. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_options_sort_order ON public.product_options(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_option_values_option_id ON public.product_option_values(option_id);
CREATE INDEX IF NOT EXISTS idx_product_option_values_sort_order ON public.product_option_values(option_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_selected_attributes ON public.order_items USING GIN (selected_attributes);

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products Policies: Public can read active products, Admin can modify
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full access to products" ON public.products;
CREATE POLICY "Admin full access to products" 
ON public.products FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Product Options Policies: Public read, Admin write
DROP POLICY IF EXISTS "Public can view product options" ON public.product_options;
CREATE POLICY "Public can view product options" 
ON public.product_options FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.products p 
        WHERE p.id = product_options.product_id 
        AND (p.is_active = true OR public.is_admin())
    )
);

DROP POLICY IF EXISTS "Admin full access to product options" ON public.product_options;
CREATE POLICY "Admin full access to product options" 
ON public.product_options FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Product Option Values Policies: Public read, Admin write
DROP POLICY IF EXISTS "Public can view product option values" ON public.product_option_values;
CREATE POLICY "Public can view product option values" 
ON public.product_option_values FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.product_options po
        JOIN public.products p ON p.id = po.product_id
        WHERE po.id = product_option_values.option_id
        AND (p.is_active = true OR public.is_admin())
    )
);

DROP POLICY IF EXISTS "Admin full access to product option values" ON public.product_option_values;
CREATE POLICY "Admin full access to product option values" 
ON public.product_option_values FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Orders & Order Items Policies: Customers can insert checkout items and read their own orders
DROP POLICY IF EXISTS "Allow checkout creation on orders" ON public.orders;
CREATE POLICY "Allow checkout creation on orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing order items" ON public.order_items;
CREATE POLICY "Allow viewing order items" 
ON public.order_items FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow checkout creation on order items" ON public.order_items;
CREATE POLICY "Allow checkout creation on order items" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

-- =========================================================================
-- 7. ATOMIC TRANSACTION FUNCTION: CREATE PRODUCT WITH OPTIONS & VALUES
-- =========================================================================
-- This function allows creating a product along with all its dynamic options
-- and value choices in an all-or-nothing single atomic transaction.
CREATE OR REPLACE FUNCTION public.create_product_with_options(
    p_title TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_base_price NUMERIC,
    p_images JSONB DEFAULT '[]'::jsonb,
    p_total_stock INT DEFAULT 0,
    p_is_active BOOLEAN DEFAULT true,
    p_options JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    v_product_id UUID;
    v_opt JSONB;
    v_val JSONB;
    v_option_id UUID;
    v_opt_order INT := 0;
    v_val_order INT := 0;
BEGIN
    -- 1. Insert Base Product
    INSERT INTO public.products (
        title, slug, description, base_price, images, total_stock, is_active
    ) VALUES (
        p_title,
        COALESCE(p_slug, LOWER(REGEXP_REPLACE(p_title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8)),
        p_description,
        p_base_price,
        p_images,
        p_total_stock,
        p_is_active
    ) RETURNING id INTO v_product_id;

    -- 2. Loop through Option Groups
    FOR v_opt IN SELECT * FROM jsonb_array_elements(p_options)
    LOOP
        v_opt_order := v_opt_order + 1;
        INSERT INTO public.product_options (
            product_id, option_name, input_type, is_required, sort_order
        ) VALUES (
            v_product_id,
            v_opt->>'option_name',
            COALESCE(v_opt->>'input_type', 'select'),
            COALESCE((v_opt->>'is_required')::boolean, true),
            COALESCE((v_opt->>'sort_order')::int, v_opt_order)
        ) RETURNING id INTO v_option_id;

        -- 3. Loop through Values within the Option Group
        IF v_opt ? 'values' AND jsonb_typeof(v_opt->'values') = 'array' THEN
            v_val_order := 0;
            FOR v_val IN SELECT * FROM jsonb_array_elements(v_opt->'values')
            LOOP
                v_val_order := v_val_order + 1;
                INSERT INTO public.product_option_values (
                    option_id, label, price_adjustment, stock_quantity, sort_order
                ) VALUES (
                    v_option_id,
                    v_val->>'label',
                    COALESCE((v_val->>'price_adjustment')::numeric, 0.00),
                    COALESCE((v_val->>'stock_quantity')::int, 0),
                    COALESCE((v_val->>'sort_order')::int, v_val_order)
                );
            END LOOP;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'product_id', v_product_id,
        'message', 'Product and dynamic options created successfully'
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create product with options: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 8. SUPABASE STORAGE BUCKET CONFIGURATION (Idempotent Setup)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
DROP POLICY IF EXISTS "Public can view brand assets" ON storage.objects;
CREATE POLICY "Public can view brand assets" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('brand-assets', 'product-images'));

DROP POLICY IF EXISTS "Admins can manage brand assets" ON storage.objects;
CREATE POLICY "Admins can manage brand assets" 
ON storage.objects FOR ALL 
USING (bucket_id IN ('brand-assets', 'product-images') AND public.is_admin())
WITH CHECK (bucket_id IN ('brand-assets', 'product-images') AND public.is_admin());
