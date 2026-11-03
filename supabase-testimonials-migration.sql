-- =========================================================================
-- SUMUK CRYSTALZ 5 — TESTIMONIALS & REVIEWS SUPABASE DATABASE SCHEMA
-- Migration: 007_testimonials_and_storage.sql
-- =========================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure admin helper function reflects canonical admin definitions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'sumukcrystalz5@gmail.com')
        ) OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
        (auth.jwt() ->> 'email') = 'sumukcrystalz5@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('product', 'service')),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    service_name TEXT NULL,
    customer_name TEXT NOT NULL,
    customer_location TEXT NULL,
    avatar_url TEXT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    description TEXT NULL,
    source TEXT NULL DEFAULT 'WhatsApp',
    proof_image_url TEXT NULL,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERFORMANCE & ORDERING INDEXES
CREATE INDEX IF NOT EXISTS idx_testimonials_published_order 
ON public.testimonials (is_published, display_order ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_category 
ON public.testimonials (category);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured 
ON public.testimonials (is_featured);

CREATE INDEX IF NOT EXISTS idx_testimonials_product_id 
ON public.testimonials (product_id);

-- 5. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.set_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER trigger_set_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.set_testimonials_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anonymous and standard users: SELECT only published testimonials
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
ON public.testimonials FOR SELECT
USING (is_published = true OR public.is_admin());

-- Administrators: Full CRUD control over all testimonials (draft, published, reordered)
DROP POLICY IF EXISTS "Admin full access to testimonials" ON public.testimonials;
CREATE POLICY "Admin full access to testimonials"
ON public.testimonials FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. STORAGE BUCKET CONFIGURATION ('testimonial-media')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'testimonial-media',
    'testimonial-media',
    true,
    2097152, -- 2 MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read testimonial media" ON storage.objects;
CREATE POLICY "Public read testimonial media"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-media');

DROP POLICY IF EXISTS "Admin insert testimonial media" ON storage.objects;
CREATE POLICY "Admin insert testimonial media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'testimonial-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update testimonial media" ON storage.objects;
CREATE POLICY "Admin update testimonial media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'testimonial-media' AND public.is_admin())
WITH CHECK (bucket_id = 'testimonial-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete testimonial media" ON storage.objects;
CREATE POLICY "Admin delete testimonial media"
ON storage.objects FOR DELETE
USING (bucket_id = 'testimonial-media' AND public.is_admin());

-- 8. SEED CANONICAL SACRED TESTIMONIALS (Initial Gold Vault Set)
INSERT INTO public.testimonials (
    category,
    service_name,
    customer_name,
    customer_location,
    avatar_url,
    rating,
    review_text,
    description,
    source,
    proof_image_url,
    is_published,
    is_featured,
    display_order
)
VALUES
    (
        'product',
        NULL,
        'Ananya Deshmukh',
        'Koregaon Park, Pune',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        5,
        'The natural Pyrite cluster and wealth bracelet from Sumuk Crystalz radiates exceptional density and weight. You can feel the traditional sound bowl consecration the second you unbox it.',
        'Consecrated AAA Pyrite Manifestation Bracelet',
        'WhatsApp',
        NULL,
        true,
        true,
        1
    ),
    (
        'service',
        'Usui Reiki Distance Healing',
        'Dr. Rajeshwar Iyer',
        'Bengaluru, Karnataka',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        5,
        'Soumyaa Naveen’s distance chakra attunement brought tangible lightness and deep relief from chronic work fatigue. Her voice note debrief was astonishingly accurate.',
        'Chakra realign & auric cleansing session',
        'Instagram',
        NULL,
        true,
        true,
        2
    ),
    (
        'product',
        NULL,
        'Meera Kulkarni',
        'Bandra West, Mumbai',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        5,
        'I ordered a raw amethyst cathedral geode for my meditation sanctuary. The deep violet crystalline formations and packaging care exceeded every luxury expectation.',
        'Natural Amethyst Cathedral specimen',
        'WhatsApp',
        NULL,
        true,
        true,
        3
    ),
    (
        'service',
        'Vibrational Numerology Blueprint',
        'Vikramaditya Singhania',
        'New Delhi',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        5,
        'The personalized numerology dossier revealed karmic cycles I had experienced for a decade. The crystal pairing recommendations aligned with my business pivot perfectly.',
        'In-depth 9-modality life path analysis',
        'Google',
        NULL,
        true,
        false,
        4
    )
ON CONFLICT DO NOTHING;
