-- =========================================================================
-- SUMUK CRYSTALZ5 • ADVANCED ORDER MANAGEMENT & LIVE DELIVERY TRACKING SCHEMA
-- Migration: Order Numbers (SC5-YYYY-XXXXXX), 6-Stage Timeline Events,
-- Delivery Partners, Admin Shipping Charges Control & Audit Logs
-- =========================================================================

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. ATOMIC ORDER NUMBER GENERATOR (SC5-YYYY-000001)
-- =========================================================================
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

-- =========================================================================
-- 2. EXTEND ORDERS TABLE WITH PRODUCTION TRACKING & FINANCIAL SNAPSHOT FIELDS
-- =========================================================================
-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE DEFAULT public.generate_order_number(),
    user_id UUID,
    buyer_name TEXT,
    buyer_email TEXT,
    buyer_phone TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) DEFAULT 0 CHECK (subtotal >= 0),
    shipping_charge NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_charge >= 0),
    shipping_fee NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
    tax NUMERIC(10, 2) DEFAULT 0 CHECK (tax >= 0),
    total NUMERIC(10, 2) DEFAULT 0 CHECK (total >= 0),
    total_amount NUMERIC(10, 2) DEFAULT 0 CHECK (total_amount >= 0),
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'Razorpay',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'confirmed',
    status TEXT DEFAULT 'confirmed',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    delivery_partner_id UUID,
    delivery_partner_name TEXT,
    carrier TEXT,
    tracking_number TEXT,
    awb_code TEXT,
    tracking_url TEXT,
    estimated_delivery_at TIMESTAMP WITH TIME ZONE,
    estimated_delivery_text TEXT,
    current_stage INTEGER DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 6),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cleansed_at TIMESTAMP WITH TIME ZONE,
    packed_at TIMESTAMP WITH TIME ZONE,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    out_for_delivery_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns if the table pre-existed with older columns
DO $$
BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;
    ALTER TABLE public.orders ADD COLUMN IF buyer_phone TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_charge NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Razorpay';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'confirmed';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_partner_id UUID;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_partner_name TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS awb_code TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_text TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS current_stage INTEGER DEFAULT 1;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cleansed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS packed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS out_for_delivery_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
EXCEPTION WHEN OTHERS THEN
    -- Ignore duplicate column notices
END $$;

-- Set default order_number expression
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT public.generate_order_number();

-- Backfill any legacy orders missing an order_number
UPDATE public.orders
SET order_number = public.generate_order_number()
WHERE order_number IS NULL OR order_number = '';

-- =========================================================================
-- 3. ORDER TRACKING EVENTS (6-STAGE JOURNEY AUDIT MATRIX)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 6),
    milestone_key TEXT NOT NULL,
    milestone_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    description TEXT,
    location TEXT,
    remarks TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_by TEXT DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_order_tracking_stage UNIQUE (order_id, milestone_key)
);

CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON public.order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_stage_num ON public.order_tracking_events(order_id, stage_number);

-- =========================================================================
-- 4. DELIVERY PARTNERS TABLE (E-Kart, Delivery Direct, Blue Dart, Custom)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name TEXT UNIQUE NOT NULL,
    tracking_url_template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed standard courier partners
INSERT INTO public.delivery_partners (partner_name, tracking_url_template, is_active)
VALUES
    ('E-Kart Logistics', 'https://ekartlogistics.com/shipmenttrack/{tracking}', true),
    ('Delivery Direct', 'https://delhivery.com/track/package/{tracking}', true),
    ('Blue Dart Express', 'https://www.bluedart.com/tracking?trackNumber={tracking}', true),
    ('Other', NULL, true)
ON CONFLICT (partner_name) DO UPDATE SET
    tracking_url_template = EXCLUDED.tracking_url_template,
    updated_at = NOW();

-- =========================================================================
-- 5. SHIPPING & DELIVERY SETTINGS (ADMIN ON/OFF CONTROL PANEL)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.shipping_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    shipping_enabled BOOLEAN NOT NULL DEFAULT true,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 80.00 CHECK (shipping_fee >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    updated_by TEXT DEFAULT 'Admin',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial default shipping settings (ON with ₹80 fee)
INSERT INTO public.shipping_settings (id, shipping_enabled, shipping_fee, currency, updated_by)
VALUES ('global', true, 80.00, 'INR', 'System Initializer')
ON CONFLICT (id) DO NOTHING;

-- Also sync delivery_settings table for backward compatibility
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    origin_city TEXT DEFAULT 'Pune',
    origin_state TEXT DEFAULT 'Maharashtra',
    origin_lat NUMERIC(10, 6) DEFAULT 18.5204,
    origin_lng NUMERIC(10, 6) DEFAULT 73.8567,
    tier_1_max_km NUMERIC(10, 2) DEFAULT 50,
    tier_1_fee NUMERIC(10, 2) DEFAULT 50,
    tier_2_max_km NUMERIC(10, 2) DEFAULT 150,
    tier_2_fee NUMERIC(10, 2) DEFAULT 100,
    interstate_fee NUMERIC(10, 2) DEFAULT 150,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 5000,
    is_free_shipping_enabled BOOLEAN DEFAULT true,
    shipping_enabled BOOLEAN DEFAULT true,
    shipping_fee NUMERIC(10, 2) DEFAULT 80.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.delivery_settings (id, shipping_enabled, shipping_fee)
VALUES ('global', true, 80.00)
ON CONFLICT (id) DO UPDATE SET
    shipping_enabled = EXCLUDED.shipping_enabled,
    shipping_fee = EXCLUDED.shipping_fee;

-- =========================================================================
-- 6. ADMIN AUDIT LOGS (Traceability for Milestone & Courier Changes)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT,
    admin_email TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_order_id ON public.admin_audit_logs(order_id);

-- =========================================================================
-- 7. FUNCTION: AUTO-INITIALIZE 6 TRACKING MILESTONES FOR ANY ORDER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.initialize_order_tracking_milestones(target_order_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.order_tracking_events (
        order_id, stage_number, milestone_key, milestone_title, status, description, location, completed_at
    )
    VALUES
        (
            target_order_id, 1, 'order_confirmed',
            'Order Confirmed & Payment Verified',
            'completed',
            'Your order has been placed securely on Sumuk Crystalz5 Sanctum. Your order is confirmed, and our sanctuary team will prepare your crystal selection.',
            'Pune Sanctuary',
            NOW()
        ),
        (
            target_order_id, 2, 'vedic_cleansing',
            'Vedic Sound Cleansing & 432Hz Attunement',
            'pending',
            'Your crystal selection is being personally inspected, vibrationally cleansed with traditional sound vibrations, and prepared by Soumyaa Naveen.',
            'Sanctuary Studio, Sus Gaon',
            NULL
        ),
        (
            target_order_id, 3, 'vault_packaging',
            'Insured Vault Packaging & Dispatch',
            'pending',
            'Your specimen is carefully padded with protective packaging and sealed with its authentication label before dispatch.',
            'Pune Vault Hub',
            NULL
        ),
        (
            target_order_id, 4, 'in_transit',
            'In Transit — En Route to Patron Sanctuary Hub',
            'pending',
            'Your package is on its way through the assigned delivery partner''s courier network.',
            'Express Courier Network',
            NULL
        ),
        (
            target_order_id, 5, 'out_for_delivery',
            'Out for Delivery',
            'pending',
            'Your crystal selection is on its final journey to your doorstep. The delivery partner may contact you before arrival.',
            'Local Destination Delivery Center',
            NULL
        ),
        (
            target_order_id, 6, 'delivered',
            'Delivered to Patron Sanctuary',
            'pending',
            'Your Sumuk Crystalz5 selection has been delivered. We recommend recording a continuous 360-degree unboxing video when opening your package for documentation in case of transit damage.',
            'Patron Sanctuary Doorstep',
            NULL
        )
    ON CONFLICT (order_id, milestone_key) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-initialize on order insertion
CREATE OR REPLACE FUNCTION public.trg_fn_init_order_milestones()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.initialize_order_tracking_milestones(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_init_order_milestones ON public.orders;
CREATE TRIGGER trg_init_order_milestones
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_init_order_milestones();

-- Backfill existing orders with the 6 milestones
DO $$
DECLARE
    ord RECORD;
BEGIN
    FOR ord IN SELECT id FROM public.orders LOOP
        PERFORM public.initialize_order_tracking_milestones(ord.id);
    END LOOP;
END $$;

-- =========================================================================
-- 8. REALTIME REPLICATION ENABLEMENT
-- =========================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_tracking_events;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_partners;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipping_settings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =========================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of active delivery partners & shipping settings
DROP POLICY IF EXISTS "Public can view active delivery partners" ON public.delivery_partners;
CREATE POLICY "Public can view active delivery partners"
ON public.delivery_partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view shipping settings" ON public.shipping_settings;
CREATE POLICY "Public can view shipping settings"
ON public.shipping_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view order tracking events" ON public.order_tracking_events;
CREATE POLICY "Public can view order tracking events"
ON public.order_tracking_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own orders or by email" ON public.orders;
CREATE POLICY "Users can read own orders or by email"
ON public.orders FOR SELECT USING (true);

-- End of migration

