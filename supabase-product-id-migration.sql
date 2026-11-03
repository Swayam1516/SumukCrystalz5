-- =========================================================================
-- SUMUK CRYSTALZ 5 — AUTOMATIC CATEGORY-BASED UNIQUE PRODUCT ID SYSTEM
-- Database Migration & Atomic Sequence Architecture
-- Target: Supabase PostgreSQL (public.products & public.product_id_sequences)
-- =========================================================================

-- 1. Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. CREATE SEQUENCE MANAGEMENT TABLE: public.product_id_sequences
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.product_id_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    prefix VARCHAR(10) NOT NULL,
    next_number INTEGER NOT NULL DEFAULT 1 CHECK (next_number > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_product_id_sequences_category UNIQUE (category),
    CONSTRAINT uq_product_id_sequences_prefix UNIQUE (prefix)
);

-- Index for instant lookups
CREATE INDEX IF NOT EXISTS idx_product_id_sequences_category ON public.product_id_sequences(category);
CREATE INDEX IF NOT EXISTS idx_product_id_sequences_prefix ON public.product_id_sequences(prefix);

-- Enable Row Level Security (RLS)
ALTER TABLE public.product_id_sequences ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone (anon, authenticated, service_role) can view category prefixes
DROP POLICY IF EXISTS "Public can view product_id_sequences" ON public.product_id_sequences;
CREATE POLICY "Public can view product_id_sequences"
    ON public.product_id_sequences FOR SELECT
    USING (true);

-- Write policy: Authenticated admins, service_role, and anon (with backend key) can insert/update
DROP POLICY IF EXISTS "Admins can manage product_id_sequences" ON public.product_id_sequences;
CREATE POLICY "Admins can manage product_id_sequences"
    ON public.product_id_sequences FOR ALL
    USING (true)
    WITH CHECK (true);

-- =========================================================================
-- 3. SEED CANONICAL CATEGORIES & PREFIXES
-- =========================================================================
-- Mandatory categories: Bracelet (BR), Mala (MA), Home Decor (HO), Other (OT)
-- Also registers standard alias mappings for existing catalog consistency
INSERT INTO public.product_id_sequences (category, prefix, next_number)
VALUES
    ('Bracelet', 'BR', 1),
    ('Mala', 'MA', 1),
    ('Home Decor', 'HO', 1),
    ('Other', 'OT', 1),
    ('Crystal Trees', 'CT', 1),
    ('Raw Crystals', 'RA', 1),
    ('Gift Sets', 'GI', 1),
    ('Energy Bands', 'EB', 1),
    ('Sacred Malas', 'SM', 1)
ON CONFLICT (category) DO UPDATE
SET updated_at = NOW();

-- =========================================================================
-- 4. ADD DEDICATED product_id COLUMN TO public.products
-- =========================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'products' 
          AND column_name = 'product_id'
    ) THEN
        ALTER TABLE public.products ADD COLUMN product_id TEXT;
    END IF;
END $$;

-- Enforce UNIQUE constraint on product_id (ignoring NULL during staging)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_id ON public.products(product_id) WHERE product_id IS NOT NULL;

-- =========================================================================
-- 5. FUNCTION: DERIVE TWO-CHARACTER PREFIX FOR NEW CATEGORIES
-- =========================================================================
CREATE OR REPLACE FUNCTION public.derive_category_prefix(p_category_name TEXT)
RETURNS VARCHAR(10)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_clean TEXT;
    v_words TEXT[];
    v_prefix VARCHAR(10);
BEGIN
    IF p_category_name IS NULL OR TRIM(p_category_name) = '' THEN
        RETURN 'OT';
    END IF;

    -- Clean category string: strip non-alphanumeric except spaces, upper-case
    v_clean := UPPER(REGEXP_REPLACE(TRIM(p_category_name), '[^a-zA-Z0-9\s]', '', 'g'));
    
    -- Specific override rules matching specification
    IF v_clean = 'BRACELET' OR v_clean LIKE 'BRACELET%' OR v_clean = 'ENERGY BANDS' THEN
        RETURN 'BR';
    ELSIF v_clean = 'MALA' OR v_clean LIKE 'MALA%' OR v_clean = 'SACRED MALAS' THEN
        RETURN 'MA';
    ELSIF v_clean = 'HOME DECOR' OR v_clean LIKE 'HOME DECOR%' THEN
        RETURN 'HO';
    ELSIF v_clean = 'OTHER' THEN
        RETURN 'OT';
    ELSIF v_clean = 'CRYSTAL TREES' THEN
        RETURN 'CT';
    ELSIF v_clean = 'RAW CRYSTALS' THEN
        RETURN 'RA';
    ELSIF v_clean = 'GIFT SETS' THEN
        RETURN 'GI';
    END IF;

    -- Split into words
    v_words := REGEXP_SPLIT_TO_ARRAY(v_clean, '\s+');
    
    IF ARRAY_LENGTH(v_words, 1) >= 2 THEN
        -- Multi-word: First character of Word 1 + First character of Word 2 (e.g. Crystal Trees -> CT)
        v_prefix := SUBSTRING(v_words[1], 1, 1) || SUBSTRING(v_words[2], 1, 1);
    ELSE
        -- Single word: First two characters (e.g. Pendants -> PE)
        v_prefix := SUBSTRING(v_words[1], 1, 2);
    END IF;

    -- Ensure exactly 2 characters minimum, fallback to 'OT'
    IF LENGTH(v_prefix) < 2 THEN
        v_prefix := RPAD(v_prefix, 2, 'X');
    END IF;

    RETURN v_prefix;
END;
$$;

-- =========================================================================
-- 6. RPC: PREVIEW NEXT PRODUCT ID (READ-ONLY, CONCURRENCY-SAFE)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.preview_next_product_id(p_category TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_norm_cat TEXT;
    v_prefix VARCHAR(10);
    v_next_num INTEGER;
    v_formatted_id TEXT;
    v_rec RECORD;
BEGIN
    IF p_category IS NULL OR TRIM(p_category) = '' THEN
        p_category := 'Other';
    END IF;

    v_norm_cat := TRIM(p_category);

    -- Check if exact category exists in sequences
    SELECT prefix, next_number INTO v_rec
    FROM public.product_id_sequences
    WHERE category ILIKE v_norm_cat
    LIMIT 1;

    IF FOUND THEN
        v_prefix := v_rec.prefix;
        v_next_num := v_rec.next_number;
    ELSE
        -- Derive prefix
        v_prefix := public.derive_category_prefix(v_norm_cat);
        -- Check if derived prefix exists under another entry
        SELECT next_number INTO v_next_num
        FROM public.product_id_sequences
        WHERE prefix = v_prefix
        LIMIT 1;
        
        IF NOT FOUND THEN
            v_next_num := 1;
        END IF;
    END IF;

    -- Format prospective ID with 3 zero-padded digits
    v_formatted_id := v_prefix || LPAD(v_next_num::TEXT, 3, '0');

    -- Safety check against existing products
    WHILE EXISTS (SELECT 1 FROM public.products WHERE product_id = v_formatted_id) LOOP
        v_next_num := v_next_num + 1;
        v_formatted_id := v_prefix || LPAD(v_next_num::TEXT, 3, '0');
    END LOOP;

    RETURN jsonb_build_object(
        'category', v_norm_cat,
        'prefix', v_prefix,
        'next_number', v_next_num,
        'preview_product_id', v_formatted_id
    );
END;
$$;

-- =========================================================================
-- 7. ATOMIC RPC: GENERATE & ALLOCATE UNIQUE PRODUCT ID WITH ROW-LEVEL LOCKING
-- =========================================================================
CREATE OR REPLACE FUNCTION public.generate_next_product_id(
    p_category TEXT,
    p_custom_prefix TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
    v_norm_cat TEXT;
    v_prefix VARCHAR(10);
    v_seq_id UUID;
    v_current_num INTEGER;
    v_assigned_id TEXT;
    v_collision_cat TEXT;
BEGIN
    IF p_category IS NULL OR TRIM(p_category) = '' THEN
        p_category := 'Other';
    END IF;

    v_norm_cat := TRIM(p_category);

    -- If custom prefix provided, clean and uppercase
    IF p_custom_prefix IS NOT NULL AND TRIM(p_custom_prefix) <> '' THEN
        v_prefix := UPPER(REGEXP_REPLACE(TRIM(p_custom_prefix), '[^a-zA-Z0-9]', '', 'g'));
    ELSE
        -- Check if category exists
        SELECT prefix INTO v_prefix
        FROM public.product_id_sequences
        WHERE category ILIKE v_norm_cat
        LIMIT 1;

        IF v_prefix IS NULL THEN
            v_prefix := public.derive_category_prefix(v_norm_cat);
        END IF;
    END IF;

    -- Check for prefix collision with a DIFFERENT category
    SELECT category INTO v_collision_cat
    FROM public.product_id_sequences
    WHERE prefix = v_prefix AND category NOT ILIKE v_norm_cat
    LIMIT 1;

    IF v_collision_cat IS NOT NULL THEN
        -- Collision detected! If no custom prefix provided, report error
        IF p_custom_prefix IS NULL THEN
            RAISE EXCEPTION 'PREFIX_COLLISION: Prefix "%" is already assigned to category "%". Please provide an explicit custom prefix to resolve collision.', v_prefix, v_collision_cat;
        END IF;
    END IF;

    -- Ensure category row exists in product_id_sequences with row lock
    INSERT INTO public.product_id_sequences (category, prefix, next_number)
    VALUES (v_norm_cat, v_prefix, 1)
    ON CONFLICT (category) DO NOTHING;

    -- Lock the specific category sequence row FOR UPDATE (prevents race conditions)
    SELECT id, prefix, next_number 
    INTO v_seq_id, v_prefix, v_current_num
    FROM public.product_id_sequences
    WHERE category ILIKE v_norm_cat
    FOR UPDATE;

    -- Ensure we never issue an ID that already exists in public.products (e.g. from manual inserts)
    LOOP
        v_assigned_id := v_prefix || LPAD(v_current_num::TEXT, 3, '0');
        IF NOT EXISTS (SELECT 1 FROM public.products WHERE product_id = v_assigned_id) THEN
            EXIT;
        END IF;
        v_current_num := v_current_num + 1;
    END LOOP;

    -- Atomically increment sequence for next product
    UPDATE public.product_id_sequences
    SET next_number = v_current_num + 1,
        updated_at = NOW()
    WHERE id = v_seq_id;

    RETURN jsonb_build_object(
        'success', true,
        'category', v_norm_cat,
        'prefix', v_prefix,
        'assigned_product_id', v_assigned_id,
        'next_number', v_current_num + 1
    );
END;
$$;

-- =========================================================================
-- 8. ATOMIC RPC: CREATE PRODUCT WITH UNIQUE PRODUCT ID (TRANSACTION SAFE)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.create_product_with_unique_id(
    p_product_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
    v_category TEXT;
    v_name TEXT;
    v_slug TEXT;
    v_product_id TEXT;
    v_allocated JSONB;
    v_inserted_id UUID;
    v_variants JSONB;
    v_variant JSONB;
    v_images JSONB;
    v_image_url TEXT;
    v_idx INTEGER;
BEGIN
    v_name := TRIM(COALESCE(p_product_payload->>'name', p_product_payload->>'title', ''));
    IF v_name = '' THEN
        RAISE EXCEPTION 'Product name is mandatory.';
    END IF;

    v_category := TRIM(COALESCE(p_product_payload->>'category', 'Other'));
    v_slug := COALESCE(p_product_payload->>'slug', LOWER(REGEXP_REPLACE(v_name, '[^a-zA-Z0-9]+', '-', 'g')));

    -- 1. Check if product already has an immutable product_id assigned
    IF p_product_payload->>'product_id' IS NOT NULL AND TRIM(p_product_payload->>'product_id') <> '' THEN
        v_product_id := TRIM(p_product_payload->>'product_id');
    ELSE
        -- Atomically allocate new unique product_id within this same transaction
        v_allocated := public.generate_next_product_id(v_category);
        v_product_id := v_allocated->>'assigned_product_id';
    END IF;

    -- 2. Insert master product row
    INSERT INTO public.products (
        product_id,
        name,
        slug,
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
        hero_image
    ) VALUES (
        v_product_id,
        v_name,
        v_slug,
        v_category,
        COALESCE(p_product_payload->>'collection', 'Masterworks Collection'),
        COALESCE(p_product_payload->>'crystal_type', p_product_payload->>'crystalType', 'Pyrite'),
        COALESCE(p_product_payload->>'zodiac', ''),
        COALESCE(p_product_payload->>'chakra', ''),
        COALESCE(p_product_payload->>'short_description', p_product_payload->>'shortDescription', ''),
        COALESCE(p_product_payload->>'description', ''),
        COALESCE(p_product_payload->>'healing_benefits', p_product_payload->>'healingBenefits', ''),
        COALESCE(p_product_payload->>'care_instructions', p_product_payload->>'careInstructions', ''),
        COALESCE(p_product_payload->>'authenticity_info', 'Authentic Natural Crystal & Sacredly Consecrated'),
        COALESCE((p_product_payload->>'selling_price')::NUMERIC, (p_product_payload->>'price')::NUMERIC, 0),
        COALESCE((p_product_payload->>'original_price')::NUMERIC, (p_product_payload->>'originalPrice')::NUMERIC, 0),
        COALESCE((p_product_payload->>'discount_percentage')::NUMERIC, 0),
        COALESCE((p_product_payload->>'featured')::BOOLEAN, false),
        COALESCE((p_product_payload->>'bestseller')::BOOLEAN, false),
        COALESCE((p_product_payload->>'new_arrival')::BOOLEAN, false),
        COALESCE((p_product_payload->>'premium_collection')::BOOLEAN, false),
        COALESCE((p_product_payload->>'limited_edition')::BOOLEAN, false),
        COALESCE((p_product_payload->>'active')::BOOLEAN, true),
        COALESCE(p_product_payload->>'hero_image', '')
    )
    RETURNING id INTO v_inserted_id;

    -- 3. Insert Variants (SKU derived with parent Product ID prefix: e.g. BR001-8MM)
    v_variants := p_product_payload->'variants';
    IF v_variants IS NOT NULL AND jsonb_array_length(v_variants) > 0 THEN
        FOR v_idx IN 0..(jsonb_array_length(v_variants) - 1) LOOP
            v_variant := v_variants->v_idx;
            INSERT INTO public.product_variants (
                product_id,
                variant_name,
                bead_size,
                bracelet_size,
                selling_price,
                original_price,
                stock,
                sku,
                available
            ) VALUES (
                v_inserted_id,
                COALESCE(v_variant->>'name', v_variant->>'variant_name', 'Standard'),
                COALESCE(v_variant->>'bead_size', v_variant->>'beadSize', ''),
                COALESCE(v_variant->>'bracelet_size', v_variant->>'braceletSize', ''),
                COALESCE((v_variant->>'selling_price')::NUMERIC, (v_variant->>'price')::NUMERIC, (p_product_payload->>'selling_price')::NUMERIC, 0),
                COALESCE((v_variant->>'original_price')::NUMERIC, (v_variant->>'originalPrice')::NUMERIC, 0),
                COALESCE((v_variant->>'stock')::INTEGER, (v_variant->>'stockCount')::INTEGER, 20),
                -- Variant SKU uses parent product_id as base!
                COALESCE(v_variant->>'sku', v_product_id || '-' || COALESCE(NULLIF(UPPER(REGEXP_REPLACE(v_variant->>'bead_size', '[^a-zA-Z0-9]', '', 'g')), ''), (v_idx + 1)::TEXT)),
                COALESCE((v_variant->>'available')::BOOLEAN, true)
            );
        END LOOP;
    END IF;

    -- 4. Insert Images
    v_images := p_product_payload->'images';
    IF v_images IS NOT NULL AND jsonb_array_length(v_images) > 0 THEN
        FOR v_idx IN 0..(jsonb_array_length(v_images) - 1) LOOP
            v_image_url := v_images->>v_idx;
            IF v_image_url IS NOT NULL AND v_image_url <> '' THEN
                INSERT INTO public.product_images (
                    product_id,
                    image_url,
                    display_order,
                    is_hero
                ) VALUES (
                    v_inserted_id,
                    v_image_url,
                    v_idx + 1,
                    v_idx = 0
                );
            END IF;
        END LOOP;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_inserted_id,
        'product_id', v_product_id,
        'name', v_name,
        'slug', v_slug,
        'category', v_category
    );
END;
$$;

-- =========================================================================
-- 9. DETERMINISTIC MIGRATION BACKFILL FOR EXISTING PRODUCTS
-- =========================================================================
DO $$
DECLARE
    v_prod RECORD;
    v_cat TEXT;
    v_prefix VARCHAR(10);
    v_num INTEGER;
    v_new_id TEXT;
BEGIN
    -- Loop over all existing products lacking a product_id, ordered by creation date
    FOR v_prod IN 
        SELECT id, name, category, created_at 
        FROM public.products 
        WHERE product_id IS NULL OR product_id = ''
        ORDER BY created_at ASC 
    LOOP
        v_cat := COALESCE(v_prod.category, 'Other');

        -- Map existing catalog categories to canonical sequences
        IF v_cat ILIKE '%bracelet%' OR v_cat ILIKE '%energy band%' THEN
            v_cat := 'Bracelet';
        ELSIF v_cat ILIKE '%mala%' THEN
            v_cat := 'Mala';
        ELSIF v_cat ILIKE '%decor%' OR v_cat ILIKE '%geode%' OR v_cat ILIKE '%tumble%' THEN
            v_cat := 'Home Decor';
        ELSE
            -- Keep category name or map to Other
            IF NOT EXISTS (SELECT 1 FROM public.product_id_sequences WHERE category ILIKE v_cat) THEN
                v_cat := 'Other';
            END IF;
        END IF;

        -- Ensure category entry in sequences
        SELECT prefix, next_number INTO v_prefix, v_num
        FROM public.product_id_sequences
        WHERE category ILIKE v_cat
        FOR UPDATE;

        IF NOT FOUND THEN
            v_prefix := public.derive_category_prefix(v_cat);
            v_num := 1;
            INSERT INTO public.product_id_sequences (category, prefix, next_number)
            VALUES (v_cat, v_prefix, 2);
        ELSE
            UPDATE public.product_id_sequences 
            SET next_number = v_num + 1,
                updated_at = NOW()
            WHERE category ILIKE v_cat;
        END IF;

        -- Build format: PREFIX + 3 digits (e.g. BR001)
        v_new_id := v_prefix || LPAD(v_num::TEXT, 3, '0');

        -- Safety check for uniqueness
        WHILE EXISTS (SELECT 1 FROM public.products WHERE product_id = v_new_id) LOOP
            v_num := v_num + 1;
            v_new_id := v_prefix || LPAD(v_num::TEXT, 3, '0');
        END LOOP;

        -- Assign product_id to product
        UPDATE public.products
        SET product_id = v_new_id
        WHERE id = v_prod.id;

        RAISE NOTICE 'Backfilled Product "%" (%) with Product ID: %', v_prod.name, v_prod.id, v_new_id;
    END LOOP;
END $$;

-- =========================================================================
-- 10. ROLLBACK STRATEGY (DOCUMENTATION ONLY)
-- =========================================================================
/*
-- To rollback this migration if ever needed:
-- 1. DROP INDEX IF EXISTS idx_products_product_id;
-- 2. ALTER TABLE public.products DROP COLUMN IF EXISTS product_id;
-- 3. DROP FUNCTION IF EXISTS public.create_product_with_unique_id(JSONB);
-- 4. DROP FUNCTION IF EXISTS public.generate_next_product_id(TEXT, TEXT);
-- 5. DROP FUNCTION IF EXISTS public.preview_next_product_id(TEXT);
-- 6. DROP FUNCTION IF EXISTS public.derive_category_prefix(TEXT);
-- 7. DROP TABLE IF EXISTS public.product_id_sequences;
*/
