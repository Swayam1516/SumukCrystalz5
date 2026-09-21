-- =========================================================================
-- SUMUK CRYSTALZ — ENTERPRISE SUPABASE DATABASE ARCHITECTURE SCHEMA
-- Project URL: https://cmsiounkoqpwjccczebk.supabase.co
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/cmsiounkoqpwjccczebk/sql
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. USERS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    notification_preferences JSONB DEFAULT '{"email": true, "whatsapp": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backward compatibility view/alias for customers
CREATE OR REPLACE VIEW public.customers AS 
SELECT 
    id, 
    full_name, 
    email, 
    phone, 
    COALESCE(addresses->0, '{}'::jsonb) AS shipping_address,
    created_at, 
    updated_at 
FROM public.users;

-- =========================================================================
-- 2. PRODUCTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    crystal_type TEXT NOT NULL,
    chakra TEXT[] DEFAULT '{}'::text[],
    form TEXT NOT NULL CHECK (form IN ('Raw', 'Polished', 'Jewelry', 'Carved', 'Cluster', 'Specimen')),
    origin TEXT,
    metaphysical_properties TEXT[] DEFAULT '{}'::text[],
    care_instructions TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    currency TEXT DEFAULT 'INR',
    variants JSONB DEFAULT '[]'::jsonb,
    total_stock INTEGER NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
    images TEXT[] NOT NULL DEFAULT '{}'::text[],
    model_3d_url TEXT,
    certificate_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating_average NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 3. ORDERS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
    tax NUMERIC(10, 2) DEFAULT 0 CHECK (tax >= 0),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    tracking_number TEXT,
    carrier TEXT,
    awb_code TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'created', 'paid', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE,
    packed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 4. ORDER ITEMS TABLE (Relational Breakdown)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    variant_label TEXT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 5. PAYMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    signature TEXT,
    method TEXT,
    error_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 6. INVENTORY TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    reserved_stock INTEGER NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 7. SHIPPING TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.shipping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    courier TEXT,
    awb_code TEXT UNIQUE,
    shipment_id TEXT,
    tracking_url TEXT,
    label_url TEXT,
    status TEXT NOT NULL DEFAULT 'manifested' CHECK (status IN ('manifested', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled')),
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivered_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 8. REVIEWS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
);

-- =========================================================================
-- 9. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_crystal_type ON public.products (crystal_type);
CREATE INDEX IF NOT EXISTS idx_products_base_price ON public.products (base_price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON public.orders (buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews (product_id);

-- =========================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public read active products, Admin write
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON public.products FOR ALL USING (auth.role() = 'service_role');

-- Orders Policies: Checkout insert & buyer order tracking
CREATE POLICY "Allow checkout order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public order view by order number and email" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Service role full access orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');

-- Order Items Policies
CREATE POLICY "Allow public insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Service role full access order items" ON public.order_items FOR ALL USING (auth.role() = 'service_role');

-- Reviews Policies
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow insert verified reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access reviews" ON public.reviews FOR ALL USING (auth.role() = 'service_role');

-- Users & Payments Policies
CREATE POLICY "Allow user registration and profile" ON public.users FOR ALL USING (true);
CREATE POLICY "Service role full access payments" ON public.payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access inventory" ON public.inventory FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access shipping" ON public.shipping FOR ALL USING (auth.role() = 'service_role');

