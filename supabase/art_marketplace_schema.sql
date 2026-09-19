-- ============================================================
-- ATELIER & ART HOUSE - SUPABASE SCHEMA
-- Contemporary Art House, Luxury Collectibles & Editorial Store
-- ============================================================

-- 1. Profiles (Collectors & Gallery Administrators)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'curator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Artists
CREATE TABLE IF NOT EXISTS public.artists (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  portrait TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  bio TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  website TEXT,
  instagram TEXT,
  signature_style TEXT NOT NULL,
  mediums TEXT[] NOT NULL DEFAULT '{}',
  statement TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products (Artworks, Sculptures, Figures, Prints, Objects)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  catalog_number TEXT NOT NULL,
  name TEXT NOT NULL,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('paintings', 'sculptures', 'figures', 'prints', 'objects')),
  subcategory TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('painting', 'sculpture', 'figure', 'print', 'object')),
  price INTEGER NOT NULL, -- Price in whole INR
  original_price INTEGER,
  currency TEXT DEFAULT 'INR',
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  story TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  thumbnail TEXT NOT NULL,
  medium TEXT NOT NULL,
  material TEXT NOT NULL,
  dimensions JSONB NOT NULL, -- { width, height, depth, unit }
  orientation TEXT NOT NULL CHECK (orientation IN ('vertical', 'horizontal', 'square')),
  weight TEXT,
  color_palette TEXT[] NOT NULL DEFAULT '{}',
  style_tags TEXT[] NOT NULL DEFAULT '{}',
  room_tags TEXT[] NOT NULL DEFAULT '{}',
  mood_tags TEXT[] NOT NULL DEFAULT '{}',
  occasion_tags TEXT[] DEFAULT '{}',
  is_hand_painted BOOLEAN DEFAULT FALSE,
  is_original BOOLEAN DEFAULT TRUE,
  is_limited_edition BOOLEAN DEFAULT FALSE,
  is_one_of_one BOOLEAN DEFAULT FALSE,
  edition_size INTEGER,
  edition_number INTEGER,
  frame_available BOOLEAN DEFAULT TRUE,
  frame_options JSONB DEFAULT '[]',
  certificate_of_authenticity BOOLEAN DEFAULT TRUE,
  artist_notes TEXT,
  care_instructions TEXT[] DEFAULT '{}',
  shipping_info TEXT NOT NULL,
  lead_time TEXT NOT NULL DEFAULT 'Dispatched within 48 hours',
  stock INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_artist_favorite BOOLEAN DEFAULT FALSE,
  sculpture_specs JSONB, -- { scale, displayBase, multiAngleImages }
  rating DECIMAL(2, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Curated Collections
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  badge TEXT,
  curator TEXT NOT NULL,
  featured_on_home BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Collection Products (Junction Table)
CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id TEXT REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  framing_total INTEGER DEFAULT 0,
  shipping_fee INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  coupon_code TEXT,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'payment_confirmed', 'processing', 'in_framing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  location TEXT,
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Followed Artists
CREATE TABLE IF NOT EXISTS public.followed_artists (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- 9. Wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- 10. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INTEGER CHECK (discount_percent > 0 AND discount_percent <= 100),
  discount_amount INTEGER,
  min_order_amount INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ
);

-- ── INDEXES FOR FAST FILTERING & SEARCH ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_artist_id ON public.products(artist_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(fulfillment_status);

-- ── ROW LEVEL SECURITY (RLS) ────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY "Public can view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);

-- User permissions for profile and orders
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Allow authenticated or guest insert for orders" ON public.orders FOR INSERT WITH CHECK (true);
