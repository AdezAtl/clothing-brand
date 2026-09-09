-- ==============================================================================
-- Lola's Hub Boutique (Challenge, Ibadan) — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create table: lh_products (Inventory and styles)
CREATE TABLE IF NOT EXISTS public.lh_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
  sizes JSONB NOT NULL DEFAULT '["S", "M", "L"]'::jsonb,
  fabric TEXT,
  color TEXT,
  fit TEXT,
  measurements JSONB DEFAULT '{}'::jsonb,
  accent_color TEXT DEFAULT '#1E4A2C',
  pattern TEXT DEFAULT 'ankara-wrap',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create table: lh_orders (Customer checkout orders)
CREATE TABLE IF NOT EXISTS public.lh_orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL CHECK (total >= 0),
  delivery TEXT,
  date TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create table: lh_messages (Fitting inquiries & WhatsApp store contacts)
CREATE TABLE IF NOT EXISTS public.lh_messages (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  phone TEXT,
  preview TEXT,
  garment TEXT,
  time_display TEXT,
  unread BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.lh_products (category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.lh_orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.lh_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.lh_messages (unread);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.lh_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lh_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lh_messages ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view active products
CREATE POLICY "Allow public read of products"
  ON public.lh_products
  FOR SELECT
  USING (true);

-- Products: Authenticated admin or anon key with backend full access
CREATE POLICY "Allow full access to products for authenticated users"
  ON public.lh_products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon insert/update/delete on products"
  ON public.lh_products
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Orders: Anyone can create a checkout order
CREATE POLICY "Allow public insert of orders"
  ON public.lh_orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Orders: Public can read orders (or backoffice manages them)
CREATE POLICY "Allow read orders"
  ON public.lh_orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow update orders"
  ON public.lh_orders
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Messages: Anyone can send a fitting inquiry
CREATE POLICY "Allow public insert of messages"
  ON public.lh_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow manage messages"
  ON public.lh_messages
  FOR ALL
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- INITIAL SEED DATA (Challenge Boutique Catalog)
-- ==============================================================================
INSERT INTO public.lh_products (id, name, tagline, category, price, sizes, stock, fabric, color, fit, measurements, accent_color, pattern)
VALUES
  (
    'p1',
    'Ankara Wrap Dress',
    'Flattering crossover front with self-tie waist belt',
    'Dresses',
    18500,
    '["S", "M", "L"]'::jsonb,
    6,
    '100% Wax Cotton Ankara',
    'Forest Green & Gold Ochre',
    'True to size with adjustable crossover belt',
    '{"S": "Bust 34\" | Waist 27\" | Length 44\"", "M": "Bust 37\" | Waist 30\" | Length 45\"", "L": "Bust 40\" | Waist 33\" | Length 46\""}'::jsonb,
    '#1E4A2C',
    'ankara-wrap'
  ),
  (
    'p2',
    'Emerald Two-Piece Set',
    'Sleeveless boatneck tunic with tapered matching trousers',
    'Two-Piece',
    24000,
    '["M", "L", "XL"]'::jsonb,
    5,
    'Heavy Crepe Blend with breathable drape',
    'Deep Emerald',
    'Relaxed top, elasticated back waistband on trousers',
    '{"M": "Top Length 25\" | Trouser Waist 29-31\" | Inseam 30\"", "L": "Top Length 26\" | Trouser Waist 32-34\" | Inseam 30.5\"", "XL": "Top Length 27\" | Trouser Waist 35-37\" | Inseam 31\""}'::jsonb,
    '#14402A',
    'two-piece'
  ),
  (
    'p3',
    'Straight-Leg Office Trouser',
    'High-waisted cut with clean front crease and side pockets',
    'Workwear',
    15500,
    '["28", "30", "32", "34"]'::jsonb,
    12,
    'Structured Suiting Poly-Viscose (Wrinkle-Resistant)',
    'Midnight Navy',
    'High rise, tailored straight leg from knee to ankle',
    '{"28": "Waist 28\" | Hips 37\" | Inseam 31\"", "30": "Waist 30\" | Hips 39\" | Inseam 31.5\"", "32": "Waist 32\" | Hips 41\" | Inseam 32\"", "34": "Waist 34\" | Hips 43\" | Inseam 32\""}'::jsonb,
    '#1B2433',
    'trouser'
  ),
  (
    'p4',
    'Pleated Midi Skirt',
    'Permanent knife pleats with enclosed comfort elastic waist',
    'Dresses',
    13000,
    '["S", "M", "L"]'::jsonb,
    9,
    'Chiffon-finish twill with full cotton lining',
    'Terracotta Rust',
    'A-line flare, falls mid-calf on 5''5" height',
    '{"S": "Waist 26-28\" | Length 33\"", "M": "Waist 29-31\" | Length 33.5\"", "L": "Waist 32-34\" | Length 34\""}'::jsonb,
    '#B65328',
    'skirt'
  ),
  (
    'p5',
    'Structured Blazer Top',
    'Single-button tailored jacket with notch lapel',
    'Workwear',
    21000,
    '["S", "M", "L"]'::jsonb,
    4,
    'Textured Linen-Cotton Weave with satin lining',
    'Bone Ivory & Tortoiseshell Buttons',
    'Tailored shoulder with slight boxy modern torso',
    '{"S": "Shoulder 15.5\" | Bust 35\" | Length 26\"", "M": "Shoulder 16.2\" | Bust 38\" | Length 26.5\"", "L": "Shoulder 17.0\" | Bust 41\" | Length 27\""}'::jsonb,
    '#A0825B',
    'blazer'
  ),
  (
    'p6',
    'Tiered Peplum Blouse',
    'Feminine ruffled hem with concealed back zipper',
    'Two-Piece',
    14500,
    '["S", "M", "L", "XL"]'::jsonb,
    8,
    'Lightweight Poplin Cotton',
    'Sunset Coral Print',
    'Fitted through bust, flares gracefully at waist',
    '{"S": "Bust 34\" | Waist 28\" | Length 23\"", "M": "Bust 37\" | Waist 31\" | Length 23.5\"", "L": "Bust 40\" | Waist 34\" | Length 24\""}'::jsonb,
    '#D95D39',
    'peplum'
  )
ON CONFLICT (id) DO NOTHING;

-- Initial Orders
INSERT INTO public.lh_orders (id, customer, phone, address, items, total, delivery, date, status, payment_method)
VALUES
  (
    'LH-8492',
    'Funmilayo Adeleke',
    '0814 233 4991',
    '14 Awolowo Ave, Old Bodija, Ibadan',
    '[{"name": "Ankara Wrap Dress", "size": "M", "quantity": 1, "price": 18500}]'::jsonb,
    20000,
    'Same-Day Ibadan Bike Delivery (₦1,500)',
    'Today, 11:20 AM',
    'Pending',
    'Bank Transfer'
  ),
  (
    'LH-8301',
    'Chidinma Okafor',
    '0802 991 4420',
    '32 Ring Road, Near Challenge Junction, Ibadan',
    '[{"name": "Emerald Two-Piece Set", "size": "L", "quantity": 1, "price": 24000}]'::jsonb,
    25500,
    'Same-Day Ibadan Bike Delivery (₦1,500)',
    'Yesterday, 3:15 PM',
    'Shipped',
    'Card / Paystack'
  ),
  (
    'LH-8199',
    'Toyin Kareem',
    '0818 440 1209',
    'Store Pickup at Challenge Boutique',
    '[{"name": "Straight-Leg Office Trouser", "size": "30", "quantity": 1, "price": 15500}]'::jsonb,
    15500,
    'Pickup at Challenge Boutique (Free)',
    '2026-09-06',
    'Shipped',
    'In-Shop Payment'
  )
ON CONFLICT (id) DO NOTHING;

-- Initial Messages
INSERT INTO public.lh_messages (id, sender_name, phone, preview, garment, time_display, unread)
VALUES
  ('m1', 'Toyin K.', '0818 440 1209', 'Can I stop by Challenge around 5 PM to try on the emerald two-piece in size L?', 'Emerald Two-Piece Set', '45m ago', true),
  ('m2', 'Bolanle M.', '0703 112 4990', 'Do you have the office straight trousers in waist 34 available for same-day bike dispatch to Secretariat?', 'Straight-Leg Office Trouser', '2h ago', true),
  ('m3', 'Adaobi N.', '0809 332 1088', 'The wrap dress fit perfectly for my church dedication yesterday, thank you!', 'Ankara Wrap Dress', '1d ago', false)
ON CONFLICT (id) DO NOTHING;
