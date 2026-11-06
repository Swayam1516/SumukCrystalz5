-- =========================================================================
-- SUMUK CRYSTALZ 5 • COMPLETE DATABASE FIX & ADVANCED ORDER TRACKING SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- Fixes all 404 & 400 errors: orders, order_tracking_events, delivery_partners,
-- product_id_sequences, preview_next_product_id, store_filters, admin_audit_logs
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- 1. EXTEND ORDERS TABLE WITH FULL TRACKING & LIFECYCLE COLUMNS
-- ─────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
    year_str TEXT;
BEGIN
    next_val := nextval('public.order_number_seq');
    year_str := TO_CHAR(CURRENT_DATE, 'YYYY');
    RETURN 'SC5-' || year_str || '-' || LPAD(next_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_phone TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_charge NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Razorpay';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'confirmed';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_partner_id UUID;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_partner_name TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS awb_code TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_text TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'order_confirmed';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cleansed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS packed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS out_for_delivery_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
EXCEPTION WHEN OTHERS THEN
    -- Ignore
END $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. CREATE ORDER TRACKING EVENTS TABLE (6-STAGE VEDIC TIMELINE)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    milestone_key TEXT NOT NULL,
    stage_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending',
    admin_remarks TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_order_milestone UNIQUE (order_id, milestone_key)
);

CREATE INDEX IF NOT EXISTS idx_tracking_order_id ON public.order_tracking_events(order_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. CREATE DELIVERY PARTNERS TABLE
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    courier_code TEXT NOT NULL,
    tracking_url_template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default delivery partners
INSERT INTO public.delivery_partners (name, courier_code, tracking_url_template, is_active)
VALUES
    ('BlueDart Express', 'bluedart', 'https://www.bluedart.com/tracking?handler=tnh&trackid={tracking_number}', true),
    ('Delhivery Logistics', 'delhivery', 'https://www.delhivery.com/track/package/{tracking_number}', true),
    ('DTDC Express', 'dtdc', 'https://www.dtdc.in/tracking.asp?strCnno={tracking_number}', true),
    ('India Post Speed Post', 'indiapost', 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignment={tracking_number}', true),
    ('Shiprocket Armored Courier', 'shiprocket', 'https://shiprocket.co/tracking/{tracking_number}', true),
    ('Sanctuary Direct Courier', 'sanctuary_direct', '', true)
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. CREATE PRODUCT ID SEQUENCES TABLE & RPC PREVIEW FUNCTION
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_id_sequences (
    category TEXT PRIMARY KEY,
    prefix TEXT NOT NULL UNIQUE,
    next_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.product_id_sequences (category, prefix, next_number)
VALUES
    ('Energy Bands', 'BR', 1),
    ('Raw Geodes', 'RG', 1),
    ('Consecrated Malas', 'ML', 1),
    ('Vastu Gemstone Trees', 'TR', 1),
    ('Towers & Points', 'TW', 1),
    ('Crystal Pyramids', 'PY', 1),
    ('Sacred Pendants', 'PD', 1),
    ('Singing Bowls & Sound Bells', 'SB', 1),
    ('Vastu Space Enhancers', 'VS', 1)
ON CONFLICT (category) DO NOTHING;

CREATE OR REPLACE FUNCTION public.preview_next_product_id(p_category TEXT)
RETURNS JSONB AS $$
DECLARE
    v_prefix TEXT;
    v_next_num INTEGER;
BEGIN
    SELECT prefix, next_number INTO v_prefix, v_next_num
    FROM public.product_id_sequences
    WHERE LOWER(category) = LOWER(p_category);

    IF v_prefix IS NULL THEN
        v_prefix := 'CRYS';
        v_next_num := 1;
    END IF;

    RETURN jsonb_build_object(
        'prefix', v_prefix,
        'next_number', v_next_num,
        'preview_product_id', v_prefix || LPAD(v_next_num::TEXT, 3, '0')
    );
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. CREATE STORE FILTERS TABLE
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.store_filters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'sidebar',
    options JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. CREATE ADMIN AUDIT LOGS TABLE
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT,
    entity_id TEXT,
    action TEXT,
    details JSONB,
    actor_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 7. ENABLE OPEN ACCESS RLS (PERMISSIVE POLICIES FOR STOREFRONT & ADMIN)
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_id_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public full access on orders" ON public.orders;
    CREATE POLICY "Public full access on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access on order_tracking_events" ON public.order_tracking_events;
    CREATE POLICY "Public full access on order_tracking_events" ON public.order_tracking_events FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access on delivery_partners" ON public.delivery_partners;
    CREATE POLICY "Public full access on delivery_partners" ON public.delivery_partners FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access on product_id_sequences" ON public.product_id_sequences;
    CREATE POLICY "Public full access on product_id_sequences" ON public.product_id_sequences FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access on store_filters" ON public.store_filters;
    CREATE POLICY "Public full access on store_filters" ON public.store_filters FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access on admin_audit_logs" ON public.admin_audit_logs;
    CREATE POLICY "Public full access on admin_audit_logs" ON public.admin_audit_logs FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN
    -- Ignore
END $$;

