-- ============================================================================
-- THE WELL-LANDS AGROFOODS LTD. — ZESTARA FOODS
-- Complete Supabase PostgreSQL Schema, RLS Policies, Storage & Seed Data
-- Run this script once in the Supabase SQL Editor.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  ingredients TEXT,
  usage_tips TEXT,
  weight TEXT NOT NULL DEFAULT '100g',
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INTEGER NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  order_notes TEXT,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (
    status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
  ),
  order_channel TEXT NOT NULL DEFAULT 'website' CHECK (order_channel IN ('website', 'whatsapp')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Security-definer helper prevents infinite RLS recursion when checking admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- CATEGORIES POLICIES (Public read, Admin write)
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- PRODUCTS POLICIES (Public read, Admin write)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ORDERS POLICIES (Public checkout insert, Admin & owner select, Admin update/delete)
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
CREATE POLICY "Anyone can create an order"
  ON public.orders FOR INSERT
  WITH CHECK (
    status = 'Pending'
    AND total_amount >= 0
    AND (customer_id IS NULL OR customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins and order owners can view orders" ON public.orders;
CREATE POLICY "Admins and order owners can view orders"
  ON public.orders FOR SELECT
  USING (public.is_admin() OR (auth.uid() IS NOT NULL AND customer_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (quantity > 0 AND unit_price >= 0 AND subtotal >= 0);

DROP POLICY IF EXISTS "Admins and order owners can view order items" ON public.order_items;
CREATE POLICY "Admins and order owners can view order items"
  ON public.order_items FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;
CREATE POLICY "Admins can delete order items"
  ON public.order_items FOR DELETE
  USING (public.is_admin());

-- CONTACT MESSAGES POLICIES
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- ============================================================================
-- SEED CATEGORIES & ZESTARA CORE PRODUCTS
-- ============================================================================

INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Traditional Soup Spices', 'traditional-soup-spices', 'Authentic West African soup blends crafted for rich native broths.', 1),
  ('Rice & Stew Blends', 'rice-stew-blends', 'Vibrant tomato, pepper, and aromatic blends for Jollof rice and stews.', 2),
  ('Protein & Grill Seasonings', 'protein-grill-seasonings', 'Savory rubs and marinades for meats, poultry, and grilled fish.', 3),
  ('All-Purpose & Everyday', 'all-purpose-everyday', 'Versatile everyday culinary spices for wholesome Nigerian kitchens.', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (
  category_id, name, slug, description, ingredients, usage_tips, weight, price, image_url, is_featured, in_stock, stock_quantity
)
VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'traditional-soup-spices'),
    'ZESTARA Banga Spice',
    'zestara-banga-spice',
    'Rich, aromatic palm nut soup blend crafted from roasted native seeds, dried scent leaves, and sun-cured herbs for authentic Delta and Eastern Banga (Ofe Akwu).',
    'Ataiko, oburunbebe stick, dried scent leaf, roasted nutmeg, uda pods, natural aromatic herbs.',
    'Add 1 to 2 tablespoons directly into simmering palm fruit extract 10 minutes before serving.',
    '110g',
    2500.00,
    '/src/assets/images/product_banga_zestara_1794853701249.jpg',
    true,
    true,
    120
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'all-purpose-everyday'),
    'ZESTARA Curry Spice',
    'zestara-curry-spice',
    'Vibrant golden turmeric-forward curry powder milled fresh for bright colour, warm fragrance, and balanced depth in fried rice, chicken, and vegetable dishes.',
    'Sun-dried turmeric rhizomes, coriander seeds, cumin, fenugreek, ginger, sweet paprika, bay leaf.',
    'Bloom 1 teaspoon in warm cooking oil with chopped onions before adding rice or sauces.',
    '110g',
    2000.00,
    '/src/assets/images/product_curry_zestara_1794853677024.jpg',
    true,
    true,
    180
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'rice-stew-blends'),
    'ZESTARA Stew Spice',
    'zestara-stew-spice',
    'Deep terracotta-red tomato stew seasoning balanced with thyme, roasted garlic, sweet bell pepper, and savory botanicals for rich Sunday Nigerian stews.',
    'Dehydrated red bell pepper, sweet paprika, garlic flakes, onion granules, thyme, ginger, nutmeg.',
    'Stir 1 to 2 tablespoons into blended tomato-pepper base while frying for rich umami depth.',
    '100g',
    2200.00,
    '/src/assets/images/product_stew_zestara_1794853675533.jpg',
    true,
    true,
    150
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'rice-stew-blends'),
    'ZESTARA Jollof Rice Spice',
    'zestara-jollof-rice-spice',
    'Signature smoky party-Jollof seasoning blend infused with toasted spices, bay leaves, sweet chili, and savoury herbs for unmistakable Nigerian Jollof aroma.',
    'Smoked paprika, dried tomato powder, bay leaf, thyme, roasted onion, white pepper, ginger, curry leaf.',
    'Add 2 tablespoons per 4 cups of rice when sautéing your Jollof pepper paste and stock.',
    '120g',
    2400.00,
    '/src/assets/images/product_jollof_zestara_1794853676289.jpg',
    true,
    true,
    160
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'traditional-soup-spices'),
    'ZESTARA Pepper Soup Spice',
    'zestara-pepper-soup-spice',
    'Warming, fragrant West African pepper soup blend featuring calabash nutmeg (ehuru), negro pepper (uda), cloves, and uziza for comforting goat meat, catfish, and chicken pepper soup.',
    'Ehuru (calabash nutmeg), uda pods, uziza seeds, cloves, grains of paradise, dried ginger.',
    'Simmer 1.5 tablespoons with seasoned protein and water for 20 minutes; finish with fresh scent leaf.',
    '120g',
    2600.00,
    '/src/assets/images/product_peppersoup_zestara_1794853676381.jpg',
    false,
    true,
    140
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'protein-grill-seasonings'),
    'ZESTARA Protein Spice',
    'zestara-protein-spice',
    'Coarse-ground savory rub formulated for beef, chicken, turkey, and whole fish—locking in natural juices while delivering crisp roasted herb flavour.',
    'Cracked black pepper, rosemary needles, golden onion granules, garlic, ginger, white pepper, sea salt.',
    'Coat meat or fish generously and rest for 20 minutes before grilling, roasting, air-frying, or boiling.',
    '90g',
    2300.00,
    '/src/assets/images/product_protein_zestara_1794853678776.jpg',
    false,
    true,
    130
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'all-purpose-everyday'),
    'ZESTARA Mixed Spice',
    'zestara-mixed-spice',
    'Wholesome all-purpose household spice blend uniting golden turmeric, crushed herbs, paprika, and aromatic seeds for stir-fries, pasta, yam pottage, and everyday cooking.',
    'Turmeric, thyme, parsley, sweet paprika, coriander, onion, garlic, black pepper, mild chili.',
    'Sprinkle to taste into pottage, sauces, sautéed vegetables, eggs, or rice dishes.',
    '80g',
    1900.00,
    '/src/assets/images/product_mixed_zestara_1794853677928.jpg',
    false,
    true,
    200
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TO PROMOTE YOUR ADMIN USER AFTER SIGNING UP IN SUPABASE AUTH:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'zestarafoods@gmail.com';
-- ============================================================================
