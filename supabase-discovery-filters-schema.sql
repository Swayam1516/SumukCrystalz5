-- =========================================================================
-- SUMUK CRYSTALZ 5 — ADVANCED MULTI-DIMENSIONAL PRODUCT FILTERING & DYNAMIC CATEGORY MANAGEMENT SYSTEM
-- Target: Supabase PostgreSQL
-- Purpose: 6 Independent Discovery Dimensions, Multi-Filter Assignments,
--          Product Variant Synchronization, and Dynamic Storefront Taxonomies.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. DISCOVERY FILTER GROUPS (The 6 Main Dimensions)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.discovery_filter_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_key VARCHAR(50) UNIQUE NOT NULL,
    group_name TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    description TEXT DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 2. DISCOVERY FILTERS (Individual options & sub-groups)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.discovery_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.discovery_filter_groups(id) ON DELETE CASCADE,
    filter_key VARCHAR(100) UNIQUE NOT NULL,
    filter_name TEXT NOT NULL,
    parent_filter_id UUID REFERENCES public.discovery_filters(id) ON DELETE CASCADE,
    category_type VARCHAR(50) DEFAULT '',
    description TEXT DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 3. PRODUCT DISCOVERY FILTERS (Many-to-Many Relationship)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.product_discovery_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    filter_id UUID NOT NULL REFERENCES public.discovery_filters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_product_discovery_filter UNIQUE (product_id, filter_id)
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_discovery_filters_group_id ON public.discovery_filters(group_id);
CREATE INDEX IF NOT EXISTS idx_discovery_filters_parent ON public.discovery_filters(parent_filter_id);
CREATE INDEX IF NOT EXISTS idx_discovery_filters_key ON public.discovery_filters(filter_key);
CREATE INDEX IF NOT EXISTS idx_product_discovery_filters_pid ON public.product_discovery_filters(product_id);
CREATE INDEX IF NOT EXISTS idx_product_discovery_filters_fid ON public.product_discovery_filters(filter_id);

-- Safe Column Addition on public.products for embedded fallback & caching
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'assigned_filters'
    ) THEN
        ALTER TABLE public.products ADD COLUMN assigned_filters JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- =========================================================================
-- 4. ENABLE ROW LEVEL SECURITY & POLICIES
-- =========================================================================
ALTER TABLE public.discovery_filter_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_discovery_filters ENABLE ROW LEVEL SECURITY;

-- Read policies: Public can read active filter groups and filters
DROP POLICY IF EXISTS "Public can view active filter groups" ON public.discovery_filter_groups;
CREATE POLICY "Public can view active filter groups"
    ON public.discovery_filter_groups FOR SELECT
    USING (is_active = true OR auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view active discovery filters" ON public.discovery_filters;
CREATE POLICY "Public can view active discovery filters"
    ON public.discovery_filters FOR SELECT
    USING (is_active = true OR auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view product discovery filters" ON public.product_discovery_filters;
CREATE POLICY "Public can view product discovery filters"
    ON public.product_discovery_filters FOR SELECT
    USING (true);

-- Write policies: Admins and service_role can manage filters & assignments
DROP POLICY IF EXISTS "Admins can manage discovery filter groups" ON public.discovery_filter_groups;
CREATE POLICY "Admins can manage discovery filter groups"
    ON public.discovery_filter_groups FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage discovery filters" ON public.discovery_filters;
CREATE POLICY "Admins can manage discovery filters"
    ON public.discovery_filters FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage product discovery filters" ON public.product_discovery_filters;
CREATE POLICY "Admins can manage product discovery filters"
    ON public.product_discovery_filters FOR ALL
    USING (true) WITH CHECK (true);

-- =========================================================================
-- 5. SEED CANONICAL 6 DISCOVERY DIMENSIONS
-- =========================================================================
INSERT INTO public.discovery_filter_groups (group_key, group_name, subtitle, description, display_order, is_active)
VALUES
    ('purpose', 'Shop by Purpose', 'What would you like to invite into your life?', 'Manifestation, Protection, Abundance, and Spiritual Wellness', 1, true),
    ('energy_system', 'Shop by Energy System', 'Discover crystals through your energy and spiritual preferences.', '7 Chakras, Zodiac, Numerology, Planetary, Aura & Vastu', 2, true),
    ('crystal_specimen', 'Shop by Crystal / Specimen', 'Raw stones, tumbles, towers, spheres and mineral identities.', 'Authentic gemstone specimens and rare collector minerals', 3, true),
    ('jewellery', 'Shop by Jewellery', 'Sacred wearable crystal bracelets, malas, pendants and rings.', 'Vedic energized crystal jewellery handcrafted for daily wear', 4, true),
    ('bead_size', 'Shop by Bead Size', 'Calibrated gemstone bead sizes connected to product variants.', '4mm, 6mm, 8mm, 10mm, 12mm+ and custom sizes', 5, true),
    ('home_space', 'Shop for Home & Space', 'Vastu crystals, gemstone trees, and spiritual home décor.', 'Sacred altar centerpieces, desk décor, and spatial harmony', 6, true)
ON CONFLICT (group_key) DO UPDATE SET
    group_name = EXCLUDED.group_name,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- =========================================================================
-- 6. SEED CANONICAL DISCOVERY FILTERS
-- =========================================================================

-- A. PURPOSE FILTERS
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'purpose';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        (v_group_id, 'purpose:love-relationships', 'Love & Relationships', 'purpose', 1, true),
        (v_group_id, 'purpose:money-abundance', 'Money & Abundance', 'purpose', 2, true),
        (v_group_id, 'purpose:protection', 'Protection', 'purpose', 3, true),
        (v_group_id, 'purpose:peace-relaxation', 'Peace & Relaxation', 'purpose', 4, true),
        (v_group_id, 'purpose:focus-studies', 'Focus & Studies', 'purpose', 5, true),
        (v_group_id, 'purpose:confidence', 'Confidence', 'purpose', 6, true),
        (v_group_id, 'purpose:career-business', 'Career & Business', 'purpose', 7, true),
        (v_group_id, 'purpose:manifestation', 'Manifestation', 'purpose', 8, true),
        (v_group_id, 'purpose:spiritual-growth', 'Spiritual Growth', 'purpose', 9, true),
        (v_group_id, 'purpose:healing-wellness', 'Healing & Wellness', 'purpose', 10, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- B. ENERGY SYSTEM FILTERS (Chakras, Zodiac, Numerology, Planetary, Aura, Vastu)
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'energy_system';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        -- 7 Chakras
        (v_group_id, 'energy:root-chakra', 'Root Chakra', 'chakra', 1, true),
        (v_group_id, 'energy:sacral-chakra', 'Sacral Chakra', 'chakra', 2, true),
        (v_group_id, 'energy:solar-plexus-chakra', 'Solar Plexus Chakra', 'chakra', 3, true),
        (v_group_id, 'energy:heart-chakra', 'Heart Chakra', 'chakra', 4, true),
        (v_group_id, 'energy:throat-chakra', 'Throat Chakra', 'chakra', 5, true),
        (v_group_id, 'energy:third-eye-chakra', 'Third Eye Chakra', 'chakra', 6, true),
        (v_group_id, 'energy:crown-chakra', 'Crown Chakra', 'chakra', 7, true),

        -- Zodiac
        (v_group_id, 'energy:zodiac-aries', 'Aries', 'zodiac', 8, true),
        (v_group_id, 'energy:zodiac-taurus', 'Taurus', 'zodiac', 9, true),
        (v_group_id, 'energy:zodiac-gemini', 'Gemini', 'zodiac', 10, true),
        (v_group_id, 'energy:zodiac-cancer', 'Cancer', 'zodiac', 11, true),
        (v_group_id, 'energy:zodiac-leo', 'Leo', 'zodiac', 12, true),
        (v_group_id, 'energy:zodiac-virgo', 'Virgo', 'zodiac', 13, true),
        (v_group_id, 'energy:zodiac-libra', 'Libra', 'zodiac', 14, true),
        (v_group_id, 'energy:zodiac-scorpio', 'Scorpio', 'zodiac', 15, true),
        (v_group_id, 'energy:zodiac-sagittarius', 'Sagittarius', 'zodiac', 16, true),
        (v_group_id, 'energy:zodiac-capricorn', 'Capricorn', 'zodiac', 17, true),
        (v_group_id, 'energy:zodiac-aquarius', 'Aquarius', 'zodiac', 18, true),
        (v_group_id, 'energy:zodiac-pisces', 'Pisces', 'zodiac', 19, true),

        -- Numerology / Numbers
        (v_group_id, 'energy:num-lifepath-1', 'Life Path 1', 'numerology', 20, true),
        (v_group_id, 'energy:num-lifepath-2', 'Life Path 2', 'numerology', 21, true),
        (v_group_id, 'energy:num-lifepath-3', 'Life Path 3', 'numerology', 22, true),
        (v_group_id, 'energy:num-lifepath-4', 'Life Path 4', 'numerology', 23, true),
        (v_group_id, 'energy:num-lifepath-5', 'Life Path 5', 'numerology', 24, true),
        (v_group_id, 'energy:num-lifepath-6', 'Life Path 6', 'numerology', 25, true),
        (v_group_id, 'energy:num-lifepath-7', 'Life Path 7', 'numerology', 26, true),
        (v_group_id, 'energy:num-lifepath-8', 'Life Path 8', 'numerology', 27, true),
        (v_group_id, 'energy:num-lifepath-9', 'Life Path 9', 'numerology', 28, true),
        (v_group_id, 'energy:num-master-11', 'Master Number 11', 'numerology', 29, true),
        (v_group_id, 'energy:num-master-22', 'Master Number 22', 'numerology', 30, true),
        (v_group_id, 'energy:num-master-33', 'Master Number 33', 'numerology', 31, true),

        -- Planetary
        (v_group_id, 'energy:planet-sun', 'Sun', 'planetary', 32, true),
        (v_group_id, 'energy:planet-moon', 'Moon', 'planetary', 33, true),
        (v_group_id, 'energy:planet-mars', 'Mars', 'planetary', 34, true),
        (v_group_id, 'energy:planet-mercury', 'Mercury', 'planetary', 35, true),
        (v_group_id, 'energy:planet-jupiter', 'Jupiter', 'planetary', 36, true),
        (v_group_id, 'energy:planet-venus', 'Venus', 'planetary', 37, true),
        (v_group_id, 'energy:planet-saturn', 'Saturn', 'planetary', 38, true),
        (v_group_id, 'energy:planet-rahu', 'Rahu', 'planetary', 39, true),
        (v_group_id, 'energy:planet-ketu', 'Ketu', 'planetary', 40, true),

        -- Aura & Energy
        (v_group_id, 'energy:aura-cleansing', 'Aura Cleansing', 'aura', 41, true),
        (v_group_id, 'energy:aura-energy-balance', 'Energy Balance', 'aura', 42, true),
        (v_group_id, 'energy:aura-positive-energy', 'Positive Energy', 'aura', 43, true),
        (v_group_id, 'energy:aura-grounding', 'Grounding', 'aura', 44, true),
        (v_group_id, 'energy:aura-spiritual-protection', 'Spiritual Protection', 'aura', 45, true),
        (v_group_id, 'energy:aura-meditation', 'Meditation', 'aura', 46, true),

        -- Vastu Directions & Remedies
        (v_group_id, 'energy:vastu-north', 'North Direction', 'vastu', 47, true),
        (v_group_id, 'energy:vastu-south', 'South Direction', 'vastu', 48, true),
        (v_group_id, 'energy:vastu-east', 'East Direction', 'vastu', 49, true),
        (v_group_id, 'energy:vastu-west', 'West Direction', 'vastu', 50, true),
        (v_group_id, 'energy:vastu-northeast', 'North-East', 'vastu', 51, true),
        (v_group_id, 'energy:vastu-northwest', 'North-West', 'vastu', 52, true),
        (v_group_id, 'energy:vastu-southeast', 'South-East', 'vastu', 53, true),
        (v_group_id, 'energy:vastu-southwest', 'South-West', 'vastu', 54, true),
        (v_group_id, 'energy:vastu-brahmasthan', 'Centre / Brahmasthan', 'vastu', 55, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- C. CRYSTAL / SPECIMEN FILTERS (Specimen Forms + Crystal Identities)
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'crystal_specimen';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        -- Specimen Forms
        (v_group_id, 'specimen:raw-stones', 'Raw Stones', 'specimen_form', 1, true),
        (v_group_id, 'specimen:tumbles', 'Tumbles', 'specimen_form', 2, true),
        (v_group_id, 'specimen:towers-points', 'Towers & Points', 'specimen_form', 3, true),
        (v_group_id, 'specimen:pyramids', 'Pyramids', 'specimen_form', 4, true),
        (v_group_id, 'specimen:spheres', 'Spheres', 'specimen_form', 5, true),
        (v_group_id, 'specimen:clusters-geodes', 'Clusters & Geodes', 'specimen_form', 6, true),
        (v_group_id, 'specimen:crystal-trees', 'Crystal Trees', 'specimen_form', 7, true),
        (v_group_id, 'specimen:crystal-chips', 'Crystal Chips', 'specimen_form', 8, true),
        (v_group_id, 'specimen:gemstone-specimens', 'Gemstone Specimens', 'specimen_form', 9, true),
        (v_group_id, 'specimen:rare-collector', 'Rare / Collector Crystals', 'specimen_form', 10, true),

        -- Crystal Identities
        (v_group_id, 'crystal:amethyst', 'Amethyst', 'crystal_identity', 11, true),
        (v_group_id, 'crystal:rose-quartz', 'Rose Quartz', 'crystal_identity', 12, true),
        (v_group_id, 'crystal:clear-quartz', 'Clear Quartz', 'crystal_identity', 13, true),
        (v_group_id, 'crystal:citrine', 'Citrine', 'crystal_identity', 14, true),
        (v_group_id, 'crystal:tigers-eye', 'Tiger''s Eye', 'crystal_identity', 15, true),
        (v_group_id, 'crystal:green-aventurine', 'Green Aventurine', 'crystal_identity', 16, true),
        (v_group_id, 'crystal:obsidian', 'Obsidian', 'crystal_identity', 17, true),
        (v_group_id, 'crystal:black-tourmaline', 'Black Tourmaline', 'crystal_identity', 18, true),
        (v_group_id, 'crystal:pyrite', 'Pyrite', 'crystal_identity', 19, true),
        (v_group_id, 'crystal:selenite', 'Selenite', 'crystal_identity', 20, true),
        (v_group_id, 'crystal:labradorite', 'Labradorite', 'crystal_identity', 21, true),
        (v_group_id, 'crystal:lapis-lazuli', 'Lapis Lazuli', 'crystal_identity', 22, true),
        (v_group_id, 'crystal:carnelian', 'Carnelian', 'crystal_identity', 23, true),
        (v_group_id, 'crystal:fluorite', 'Fluorite', 'crystal_identity', 24, true),
        (v_group_id, 'crystal:moonstone', 'Moonstone', 'crystal_identity', 25, true),
        (v_group_id, 'crystal:garnet', 'Garnet', 'crystal_identity', 26, true),
        (v_group_id, 'crystal:malachite', 'Malachite', 'crystal_identity', 27, true),
        (v_group_id, 'crystal:other-crystals', 'Other Crystals', 'crystal_identity', 28, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- D. JEWELLERY FILTERS
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'jewellery';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        (v_group_id, 'jewellery:bracelets', 'Bracelets', 'jewellery', 1, true),
        (v_group_id, 'jewellery:malas', 'Malas', 'jewellery', 2, true),
        (v_group_id, 'jewellery:necklaces', 'Necklaces', 'jewellery', 3, true),
        (v_group_id, 'jewellery:pendants', 'Pendants', 'jewellery', 4, true),
        (v_group_id, 'jewellery:rings', 'Rings', 'jewellery', 5, true),
        (v_group_id, 'jewellery:earrings', 'Earrings', 'jewellery', 6, true),
        (v_group_id, 'jewellery:beads', 'Beads', 'jewellery', 7, true),
        (v_group_id, 'jewellery:custom-jewellery', 'Custom Jewellery', 'jewellery', 8, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- E. BEAD SIZE FILTERS
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'bead_size';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        (v_group_id, 'bead:4mm', '4 mm', 'bead_size', 1, true),
        (v_group_id, 'bead:6mm', '6 mm', 'bead_size', 2, true),
        (v_group_id, 'bead:8mm', '8 mm', 'bead_size', 3, true),
        (v_group_id, 'bead:10mm', '10 mm', 'bead_size', 4, true),
        (v_group_id, 'bead:12mm-plus', '12 mm+', 'bead_size', 5, true),
        (v_group_id, 'bead:custom-size', 'Custom Size', 'bead_size', 6, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- F. HOME & SPACE FILTERS
DO $$
DECLARE
    v_group_id UUID;
BEGIN
    SELECT id INTO v_group_id FROM public.discovery_filter_groups WHERE group_key = 'home_space';

    INSERT INTO public.discovery_filters (group_id, filter_key, filter_name, category_type, display_order, is_active)
    VALUES
        (v_group_id, 'home:vastu-crystals', 'Vastu Crystals', 'home_space', 1, true),
        (v_group_id, 'home:crystal-trees', 'Crystal Trees', 'home_space', 2, true),
        (v_group_id, 'home:crystal-pyramids', 'Crystal Pyramids', 'home_space', 3, true),
        (v_group_id, 'home:selenite-decor', 'Selenite Décor', 'home_space', 4, true),
        (v_group_id, 'home:clusters-geodes', 'Crystal Geodes & Clusters', 'home_space', 5, true),
        (v_group_id, 'home:crystal-spheres', 'Crystal Spheres', 'home_space', 6, true),
        (v_group_id, 'home:crystal-idols', 'Crystal Idols', 'home_space', 7, true),
        (v_group_id, 'home:evil-eye-hangings', 'Evil-Eye / Protection Hangings', 'home_space', 8, true),
        (v_group_id, 'home:desk-office', 'Desk & Office Décor', 'home_space', 9, true),
        (v_group_id, 'home:meditation-decor', 'Meditation / Spiritual Décor', 'home_space', 10, true),
        (v_group_id, 'home:gift-decor', 'Gift & Décor Pieces', 'home_space', 11, true)
    ON CONFLICT (filter_key) DO UPDATE SET
        filter_name = EXCLUDED.filter_name,
        category_type = EXCLUDED.category_type,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;
END $$;

-- =========================================================================
-- 7. HELPER RPC FUNCTIONS FOR REAL-TIME FILTER QUERIES & SYNCHRONIZATION
-- =========================================================================

-- Function to get discovery taxonomy with active product counts
CREATE OR REPLACE FUNCTION public.get_discovery_taxonomy()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', g.id,
            'group_key', g.group_key,
            'group_name', g.group_name,
            'subtitle', g.subtitle,
            'description', g.description,
            'display_order', g.display_order,
            'filters', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', f.id,
                        'filter_key', f.filter_key,
                        'filter_name', f.filter_name,
                        'category_type', f.category_type,
                        'display_order', f.display_order,
                        'product_count', (
                            SELECT count(DISTINCT pdf.product_id)
                            FROM public.product_discovery_filters pdf
                            JOIN public.products p ON p.id = pdf.product_id
                            WHERE pdf.filter_id = f.id AND p.active = true
                        )
                    ) ORDER BY f.display_order ASC
                )
                FROM public.discovery_filters f
                WHERE f.group_id = g.id AND f.is_active = true
            )
        ) ORDER BY g.display_order ASC
    ) INTO result
    FROM public.discovery_filter_groups g
    WHERE g.is_active = true;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Function to atomically assign filters to a product by filter keys
CREATE OR REPLACE FUNCTION public.set_product_discovery_filters(
    p_product_id UUID,
    p_filter_keys TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_filter_id UUID;
    v_key TEXT;
    v_count INT := 0;
BEGIN
    -- Delete existing filter links
    DELETE FROM public.product_discovery_filters WHERE product_id = p_product_id;

    -- Insert new links
    IF p_filter_keys IS NOT NULL AND array_length(p_filter_keys, 1) > 0 THEN
        FOREACH v_key IN ARRAY p_filter_keys
        LOOP
            SELECT id INTO v_filter_id FROM public.discovery_filters WHERE filter_key = v_key LIMIT 1;
            IF v_filter_id IS NOT NULL THEN
                INSERT INTO public.product_discovery_filters (product_id, filter_id)
                VALUES (p_product_id, v_filter_id)
                ON CONFLICT (product_id, filter_id) DO NOTHING;
                v_count := v_count + 1;
            END IF;
        END LOOP;
    END IF;

    -- Update the assigned_filters cache on public.products
    UPDATE public.products
    SET assigned_filters = to_jsonb(p_filter_keys),
        updated_at = NOW()
    WHERE id = p_product_id;

    RETURN jsonb_build_object('success', true, 'assigned_count', v_count);
END;
$$;

