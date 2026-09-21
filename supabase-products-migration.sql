-- =========================================================================
-- SUMUK CRYSTALZ — SUPABASE-ONLY PRODUCT & VARIANT DATABASE SCHEMA
-- Project URL: https://cmsiounkoqpwjccczebk.supabase.co
-- SQL Editor: https://supabase.com/dashboard/project/cmsiounkoqpwjccczebk/sql
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Energy Bands',
    collection TEXT DEFAULT 'Masterworks Collection',
    crystal_type TEXT DEFAULT 'Pyrite',
    zodiac TEXT DEFAULT '',
    chakra TEXT DEFAULT '',
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    healing_benefits TEXT DEFAULT '',
    care_instructions TEXT DEFAULT '',
    authenticity_info TEXT DEFAULT '100% Certified Authentic Natural Crystal & Consecrated at 528Hz',
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    bestseller BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    premium_collection BOOLEAN DEFAULT false,
    limited_edition BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    hero_image TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    bead_size TEXT DEFAULT '',
    bracelet_size TEXT DEFAULT '',
    weight TEXT DEFAULT '',
    color_finish TEXT DEFAULT '',
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    sku TEXT DEFAULT '',
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_hero BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for Ultra-Fast Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_crystal_type ON public.products(crystal_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public can view active products, variants, and images
CREATE POLICY "Public can view active products" 
    ON public.products FOR SELECT 
    USING (active = true OR auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Public can view variants" 
    ON public.product_variants FOR SELECT 
    USING (true);

CREATE POLICY "Public can view images" 
    ON public.product_images FOR SELECT 
    USING (true);

-- POLICIES: Full access for service_role and authenticated admins / anon backend
CREATE POLICY "Full access products for service_role" 
    ON public.products FOR ALL 
    USING (true) WITH CHECK (true);

CREATE POLICY "Full access product_variants for service_role" 
    ON public.product_variants FOR ALL 
    USING (true) WITH CHECK (true);

CREATE POLICY "Full access product_images for service_role" 
    ON public.product_images FOR ALL 
    USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED INITIAL LUXURY CRYSTALS (Idempotent Upsert)
-- =========================================================================

-- Product 1: Money Magnet Fusion Energy Band
DO $$
DECLARE
    v_prod_id UUID;
BEGIN
    INSERT INTO public.products (
        slug, name, category, collection, crystal_type, zodiac, chakra,
        short_description, description,
        healing_benefits, care_instructions, authenticity_info,
        selling_price, original_price, discount_percentage,
        featured, bestseller, new_arrival, premium_collection, limited_edition, active,
        hero_image
    ) VALUES (
        'money-magnet-fusion-band',
        'Money Magnet Fusion Energy Band',
        'Energy Bands',
        'Masterworks Collection',
        'Pyrite',
        'Leo, Sagittarius, Taurus',
        'Solar Plexus, Heart, Root',
        'Triple Wealth Synergy: Peruvian Pyrite, Green Aventurine & Golden Tiger’s Eye engineered for multi-directional abundance.',
        'The Money Magnet Fusion Band is hand-crafted with certified Peruvian Pyrite (The Abundance Stone), Green Aventurine (The Gambler’s Stone of Opportunity), and Golden Tiger’s Eye (Sovereign Will & Solar Plexus Power). Handcrafted with high-tensile silicone elastic and 528Hz sound consecrated by Reiki Master Soumyaa Naveen.',
        'Draws financial wealth, accelerates business opportunity, shields the aura from negative vibrations.',
        'Cleanse with sacred sage or sound vibration. Avoid harsh chemical cleaners.',
        '100% Certified Natural Gemstones. Reiki Consecrated at 528Hz.',
        699.00, 1299.00, 46.00,
        true, true, false, true, false, true,
        'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        selling_price = EXCLUDED.selling_price,
        original_price = EXCLUDED.original_price,
        updated_at = NOW()
    RETURNING id INTO v_prod_id;

    -- Delete old variants & images for this product to re-seed clean
    DELETE FROM public.product_variants WHERE product_id = v_prod_id;
    DELETE FROM public.product_images WHERE product_id = v_prod_id;

    -- Insert Variants
    INSERT INTO public.product_variants (product_id, variant_name, bead_size, bracelet_size, weight, color_finish, selling_price, original_price, stock, sku, available)
    VALUES
        (v_prod_id, '6mm Delicate Beads', '6mm', 'Standard', '', 'Natural Polished', 499.00, 999.00, 20, 'MMFB-6MM', true),
        (v_prod_id, '8mm Classic Regular', '8mm', 'Standard', '', 'Natural Polished', 699.00, 1299.00, 18, 'MMFB-8MM', true),
        (v_prod_id, '10mm Masterwork Heavier', '10mm', 'Standard', '', 'Natural Polished', 999.00, 1699.00, 12, 'MMFB-10MM', true);

    -- Insert Images
    INSERT INTO public.product_images (product_id, image_url, display_order, is_hero)
    VALUES
        (v_prod_id, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80', 1, true),
        (v_prod_id, 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80', 2, false);
END $$;

-- Product 2: Raw Peruvian Pyrite Wealth Cluster
DO $$
DECLARE
    v_prod_id UUID;
BEGIN
    INSERT INTO public.products (
        slug, name, category, collection, crystal_type, zodiac, chakra,
        short_description, description,
        healing_benefits, care_instructions, authenticity_info,
        selling_price, original_price, discount_percentage,
        featured, bestseller, new_arrival, premium_collection, limited_edition, active,
        hero_image
    ) VALUES (
        'raw-peruvian-pyrite-wealth-cluster',
        'Raw Peruvian Pyrite Wealth Cluster',
        'Raw Geodes',
        'Earth Matrix Geodes',
        'Pyrite',
        'Leo, Aries',
        'Solar Plexus',
        'High-density natural pyrite crystalline matrix radiating pure magnetic solar plexus energy and shielding.',
        'Directly sourced from the high-altitude hydrothermal veins of Huaron, Peru, this cubic pyrite cluster exhibits mirror-like metallic luster. Known as the ultimate stone of financial manifestation, it shields your auric field from environmental toxicity while acting as a grounding wealth anchor.',
        'Amplifies personal willpower, grounds financial intentions, deflects environmental electromagnetic radiation.',
        'Do not submerge in water. Cleanse with sunlight or sacred smoke.',
        'Fair-mined artisanal specimen from Huaron Mines, Peru.',
        1499.00, 2499.00, 40.00,
        true, false, false, true, true, true,
        'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        selling_price = EXCLUDED.selling_price,
        original_price = EXCLUDED.original_price,
        updated_at = NOW()
    RETURNING id INTO v_prod_id;

    DELETE FROM public.product_variants WHERE product_id = v_prod_id;
    DELETE FROM public.product_images WHERE product_id = v_prod_id;

    INSERT INTO public.product_variants (product_id, variant_name, bead_size, bracelet_size, weight, color_finish, selling_price, original_price, stock, sku, available)
    VALUES
        (v_prod_id, '100g Pocket Cluster', '', '', '100g', 'Natural Metallic Luster', 999.00, 1699.00, 15, 'PYR-100G', true),
        (v_prod_id, '250g Altar Masterpiece', '', '', '250g', 'Natural Metallic Luster', 1499.00, 2499.00, 10, 'PYR-250G', true),
        (v_prod_id, '500g Sovereign Altar Monument', '', '', '500g', 'Natural Metallic Luster', 2899.00, 4599.00, 5, 'PYR-500G', true);

    INSERT INTO public.product_images (product_id, image_url, display_order, is_hero)
    VALUES
        (v_prod_id, 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1000&q=80', 1, true);
END $$;

-- Product 3: Amethyst Deep Violet Spiritual Mala
DO $$
DECLARE
    v_prod_id UUID;
BEGIN
    INSERT INTO public.products (
        slug, name, category, collection, crystal_type, zodiac, chakra,
        short_description, description,
        healing_benefits, care_instructions, authenticity_info,
        selling_price, original_price, discount_percentage,
        featured, bestseller, new_arrival, premium_collection, limited_edition, active,
        hero_image
    ) VALUES (
        'amethyst-deep-violet-spiritual-mala',
        'Amethyst Deep Violet Spiritual Mala',
        'Sacred Malas',
        'Celestial Sanctuary',
        'Amethyst',
        'Pisces, Aquarius, Sagittarius',
        'Crown, Third Eye',
        'Traditional 108 japa mala designed for deep transcendental meditation and crown chakra attunement.',
        'Hand-knotted with 108 individual 8mm natural Uruguayan amethyst beads and consecrated with 528Hz Solfeggio sound attunement. Stimulates higher consciousness, mental serenity, and protection against psychic agitation.',
        'Crown chakra activation, emotional tranquility, mental clarity during meditation.',
        'Recharge under full moonlight. Keep away from prolonged direct harsh sunlight.',
        '108 Grade-AAA Natural Uruguayan Amethyst Gemstones.',
        1299.00, 2199.00, 41.00,
        false, false, true, true, false, true,
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        selling_price = EXCLUDED.selling_price,
        original_price = EXCLUDED.original_price,
        updated_at = NOW()
    RETURNING id INTO v_prod_id;

    DELETE FROM public.product_variants WHERE product_id = v_prod_id;
    DELETE FROM public.product_images WHERE product_id = v_prod_id;

    INSERT INTO public.product_variants (product_id, variant_name, bead_size, bracelet_size, weight, color_finish, selling_price, original_price, stock, sku, available)
    VALUES
        (v_prod_id, '6mm 108 Japa Beads', '6mm', '108 Mala', '', 'Deep Violet Polish', 999.00, 1699.00, 20, 'AME-MALA-6MM', true),
        (v_prod_id, '8mm 108 Japa Beads', '8mm', '108 Mala', '', 'Deep Violet Polish', 1299.00, 2199.00, 14, 'AME-MALA-8MM', true);

    INSERT INTO public.product_images (product_id, image_url, display_order, is_hero)
    VALUES
        (v_prod_id, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80', 1, true);
END $$;
