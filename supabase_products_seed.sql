-- ============================================================
-- ZORODOOR Supabase Products Table
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the products table
create table if not exists public.products (
  id          text primary key,
  name        text not null,
  price       integer not null,        -- price in INR (paise-free, whole rupees)
  original_price integer,
  category    text not null,
  image       text not null,
  badge       text,
  description text not null,
  features    text[] not null default '{}',
  sizes       text[] not null default '{}',
  in_stock    boolean not null default true,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (good practice — public read, admin write)
alter table public.products enable row level security;

-- Allow anyone to read products (public storefront)
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Only service_role (your backend/admin) can insert/update/delete
create policy "Service role can manage products"
  on public.products
  for all
  to service_role
  using (true);

-- 2. Seed all 17 products
insert into public.products (id, name, price, original_price, category, image, badge, description, features, sizes, in_stock, tags)
values
  (
    '20', 'Vintage Varsity Half-Zip Sweatshirt', 3499, 4499, 'Sweatshirts', '/products/varsity_sweatshirt.png',
    '🆕 NEW DROP',
    'Black oversized vintage streetwear sweatshirt with a beige polo collar and a half-zip front. ''Varsity'' embroidered in bold retro script font. Features distinct chest and sleeve patches for an authentic collegiate aesthetic.',
    ARRAY['320gsm Heavyweight Fleece', 'Polo Collar with Quarter-Zip', 'Premium Retro Embroidery', 'Authentic Varsity Patches'],
    ARRAY['S', 'M', 'L', 'XL'], true,
    ARRAY['varsity', 'sweatshirt', 'vintage', 'half-zip', 'black']
  ),
  (
    '21', 'Grand Prix Racing Heavy Sweatshirt', 3299, 4299, 'Sweatshirts', '/products/vintage_racer_sweatshirt.png',
    '🏁 TRENDING',
    'Heavy washed grey oversized vintage streetwear sweatshirt with a half-zip front and high collar. Bold ''Racing Team'' embroidery and authentic motorsport patches on the chest and sleeves for a pure retro track vibe.',
    ARRAY['Heavy Washed Grey Cotton', 'High Collar Half-Zip', 'Motorsport Appliqué Patches', 'Worn-In Vintage Wash'],
    ARRAY['M', 'L', 'XL', 'XXL'], true,
    ARRAY['racing', 'motorsport', 'sweatshirt', 'grey', 'vintage', 'track']
  ),
  (
    '11', 'WAKE UP TO REALITY Oversized Tee', 2299, 2799, 'T-Shirts', '/products/anime_tee_eyes.png',
    '👁️ TRENDING',
    'Minimalist anime eyes graphic with sleek typography. Drop shoulders and high-density screen print.',
    ARRAY['Premium Cotton Blend', 'Minimalist Screen Print', 'Relaxed Silhouette', 'High-Density Ink'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['anime', 'eyes', 'minimalist', 'trending', 'black']
  ),
  (
    '13', 'Box Head Oversized Tee', 2299, 2799, 'T-Shirts', '/products/anime_tee_boxhead.png',
    '🆕 NEW DROP',
    'Quirky box-head anime character with chaotic Japanese street art doodles on a premium sand/beige oversized tee.',
    ARRAY['280gsm Heavyweight Cotton', 'Boxy Oversized Fit', 'Japanese Street Art Graphic', 'Pre-Shrunk'],
    ARRAY['S', 'M', 'L', 'XL'], true,
    ARRAY['anime', 'japanese', 'streetwear', 'new', 'beige']
  ),
  (
    '14', 'Zorodoor Script Oversized Tee', 1999, 2499, 'T-Shirts', '/products/anime_tee_typography_cream.png',
    '✍️ SIGNATURE',
    'Clean script typography with gothic "Z" sleeve logo. Born from the darkness on premium cream cotton.',
    ARRAY['Premium Cotton', 'Script Typography Print', 'Gothic Sleeve Logo', 'Comfort Fit'],
    ARRAY['M', 'L', 'XL', 'XXL'], true,
    ARRAY['typography', 'script', 'cream', 'logo', 'signature']
  ),
  (
    '15', 'Emotionally Unavailable Oversized Tee', 2499, 2999, 'T-Shirts', '/products/anime_tee_numb.png',
    '🖤 BESTSELLER',
    'Hooded anime figure surrounded by chaotic graffiti tags. For those who feel everything but say nothing.',
    ARRAY['Heavyweight Washed Cotton', 'Graffiti Tag Print', 'Drop Shoulders', 'Boxy Silhouette'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['anime', 'graffiti', 'dark', 'bestseller', 'hooded']
  ),
  (
    '16', 'Alone In A Crowd Oversized Tee', 2499, 2999, 'T-Shirts', '/products/anime_tee_alone.png',
    '🌧️ MELANCHOLIC',
    'Anime girl sitting alone in the rain with gothic calligraphy. Melancholic streetwear art on washed gray cotton.',
    ARRAY['Washed Gray Cotton', 'Gothic Calligraphy Print', 'Anime Artwork', 'Durable Ribbed Collar'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['anime', 'gothic', 'melancholic', 'gray', 'rain']
  ),
  (
    '17', 'Samurai Spirit Oversized Tee', 2499, 2999, 'T-Shirts', '/products/anime_tee_samurai.png',
    '⚔️ LIMITED',
    'Bold samurai illustration with Japanese kanji on premium black cotton. For those who live with honor.',
    ARRAY['280gsm Black Cotton', 'Full-Front Samurai Print', 'Japanese Kanji Detail', 'Oversized Boxy Fit'],
    ARRAY['S', 'M', 'L', 'XL'], true,
    ARRAY['samurai', 'japanese', 'kanji', 'black', 'limited']
  ),
  (
    '18', 'The Struggler Oversized Tee', 2199, 2699, 'T-Shirts', '/products/anime_tee_struggler.png',
    '🔥 CULT DROP',
    'Raw brutalist typography paired with distressed anime art. This one hits different.',
    ARRAY['Heavy Pigment Wash', 'Distressed Graphic Print', 'Ribbed Neck', 'Relaxed Silhouette'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['brutalist', 'typography', 'anime', 'distressed', 'cult']
  ),
  (
    '19', 'Cyberpunk Night Oversized Tee', 2299, 2799, 'T-Shirts', '/products/anime_tee_cyberpunk.png',
    '🤖 SCI-FI',
    'Neon-infused cyberpunk city illustration on washed black. The future is now.',
    ARRAY['Washed Black Cotton', 'Multi-Color Screen Print', 'Drop Shoulder', 'Pre-Washed Texture'],
    ARRAY['M', 'L', 'XL', 'XXL'], true,
    ARRAY['cyberpunk', 'neon', 'scifi', 'city', 'black']
  ),
  (
    '4', 'Goku Dragon Oversized Tee', 2199, 2699, 'T-Shirts', '/products/goku_tshirt_front.png',
    '🐉 ICONIC',
    'Full-chest Goku illustration in classic anime linework. A tribute to the greatest warrior. Heavyweight cotton, oversized fit.',
    ARRAY['280gsm Cotton', 'Full-Chest Linework Print', 'Oversized Drop Shoulder', 'Pre-Washed Softness'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['goku', 'dragon ball', 'anime', 'iconic', 'black']
  ),
  (
    '8', 'Berserk Oversized Tee', 2199, 2699, 'T-Shirts', '/products/berserk_tshirt_front.png',
    '⚡ DARK FANTASY',
    'Guts from Berserk — the relentless warrior who never stops fighting. Dark fantasy manga art on heavyweight cotton.',
    ARRAY['Heavyweight Washed Cotton', 'Berserk Manga Artwork', 'Boxy Oversized Silhouette', 'Ribbed Cuffs'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['berserk', 'guts', 'manga', 'dark', 'fantasy']
  ),
  (
    '1', 'Zero Fucks Oversized Tee', 1999, 2499, 'T-Shirts', '/products/zero_fucks_tshirt.png',
    '😤 ATTITUDE',
    '"Zero Fucks Given" — the mantra of every person who refuses to conform. Bold typography on premium white cotton.',
    ARRAY['Premium White Cotton', 'Bold Slogan Typography', 'Relaxed Oversized Fit', 'Soft Ring-Spun Cotton'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['slogan', 'typography', 'attitude', 'white', 'bold']
  ),
  (
    '2', 'Just Chilling Palm Oversized Tee', 1999, 2499, 'T-Shirts', '/products/just_chilling_tshirt.png',
    '🌴 CHILL VIBES',
    'Palm illustration with laid-back summer typography. For when you''re in your "I don''t care" era.',
    ARRAY['Lightweight Cotton', 'Summer Palm Graphic', 'Relaxed Boxy Fit', 'Breathable Weave'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['chill', 'palm', 'summer', 'slogan', 'relaxed']
  ),
  (
    '3', 'Vintage Graphic Oversized Tee', 1899, 2399, 'T-Shirts', '/products/vintage_graphic_tshirt.png',
    '🕰️ VINTAGE',
    'Retro-distressed graphic with worn-in appeal. The kind of tee that looks better the longer you wear it.',
    ARRAY['Pigment-Dyed Cotton', 'Vintage Distressed Print', 'Lived-In Feel', 'Oversized Boxy Cut'],
    ARRAY['S', 'M', 'L', 'XL'], true,
    ARRAY['vintage', 'retro', 'distressed', 'graphic', 'aged']
  ),
  (
    '5', 'Premium Heavyweight Black Tee', 1499, 1899, 'T-Shirts', '/products/premium_black_tshirt.png',
    '⬛ ESSENTIAL',
    'The essential black tee — 280gsm heavyweight cotton in a clean, boxy oversized fit. No graphics. Pure quality.',
    ARRAY['280gsm Ring-Spun Cotton', 'Boxy Oversized Silhouette', 'Reinforced Stitching', 'Pre-Shrunk'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['essential', 'plain', 'black', 'heavyweight', 'basic']
  ),
  (
    '6', 'Premium Heavyweight White Tee', 1499, 1899, 'T-Shirts', '/products/premium_white_tshirt.png',
    '⬜ ESSENTIAL',
    'The essential white tee — 280gsm heavyweight cotton in a clean, boxy oversized fit. Stack with anything.',
    ARRAY['280gsm Ring-Spun Cotton', 'Boxy Oversized Silhouette', 'Reinforced Stitching', 'Pre-Shrunk'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], true,
    ARRAY['essential', 'plain', 'white', 'heavyweight', 'basic']
  )
on conflict (id) do update set
  name           = excluded.name,
  price          = excluded.price,
  original_price = excluded.original_price,
  category       = excluded.category,
  image          = excluded.image,
  badge          = excluded.badge,
  description    = excluded.description,
  features       = excluded.features,
  sizes          = excluded.sizes,
  in_stock       = excluded.in_stock,
  tags           = excluded.tags;

-- Verify
select id, name, price, category from public.products order by category, price desc;
