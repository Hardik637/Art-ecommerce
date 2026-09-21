import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';
import { addCustomProduct, getCustomProducts, slugify } from '@/lib/customProducts';
import { Product, MajorCategory } from '@/types/art';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customProducts = getCustomProducts();
  return NextResponse.json({ products: customProducts });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required.' },
        { status: 400 }
      );
    }

    const category: MajorCategory =
      body.category === 'sculptures' || body.category === 'decorative-pieces'
        ? body.category
        : 'wall-art';

    const images = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : body.thumbnail
      ? [body.thumbnail]
      : ['/artworks/painting-monsoon-abstract.svg'];

    const newProduct: Product = {
      id: `art-${Date.now()}`,
      slug: slugify(body.name),
      name: body.name.trim(),
      category,
      subcategory: body.subcategory || 'contemporary',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      original_price: body.originalPrice ? Number(body.originalPrice) : undefined,
      description: body.description || '',
      shortDescription: body.shortDescription || body.description?.slice(0, 160) || '',
      short_description: body.shortDescription || body.description?.slice(0, 160) || '',
      images,
      thumbnail: images[0],
      material: body.material || body.medium || 'Mixed Archival Media',
      medium: body.medium || body.material || 'Contemporary Art',
      dimensions: {
        width: Number(body.dimensions?.width || 100),
        height: Number(body.dimensions?.height || 100),
        depth: body.dimensions?.depth ? Number(body.dimensions.depth) : undefined,
        unit: 'cm',
      },
      stock: Number(body.stock || 1),
      isActive: true,
      is_active: true,
      isFeatured: Boolean(body.isFeatured),
      is_featured: Boolean(body.isFeatured),
      isNew: Boolean(body.isNew ?? true),
      is_new: Boolean(body.isNew ?? true),
      isBestseller: Boolean(body.isBestseller),
      is_bestseller: Boolean(body.isBestseller),
      isArtistFavorite: Boolean(body.isArtistFavorite),
      is_artist_favorite: Boolean(body.isArtistFavorite),
      rating: 5.0,
      reviewCount: 0,
      review_count: 0,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If Supabase is connected, also insert into supabase
    if (isSupabaseAdminConfigured()) {
      try {
        const admin = createAdminClient();
        if (admin) {
          await admin.from('products').insert({
            id: newProduct.id,
            slug: newProduct.slug,
            name: newProduct.name,
            category: newProduct.category,
            subcategory: newProduct.subcategory,
            price: newProduct.price,
            original_price: newProduct.originalPrice || null,
            description: newProduct.description,
            short_description: newProduct.shortDescription,
            images: newProduct.images,
            thumbnail: newProduct.thumbnail,
            material: newProduct.material,
            medium: newProduct.medium,
            dimensions: newProduct.dimensions,
            stock: newProduct.stock,
            is_active: true,
            is_featured: newProduct.isFeatured,
            is_new: newProduct.isNew,
            is_bestseller: newProduct.isBestseller,
            is_artist_favorite: newProduct.isArtistFavorite,
            rating: 5.0,
            review_count: 0,
            created_at: newProduct.createdAt,
            updated_at: newProduct.updatedAt,
          });
        }
      } catch (dbErr) {
        console.warn('[Admin Products API] Supabase insert note:', dbErr);
      }
    }

    // Save to local custom products store
    const saved = addCustomProduct(newProduct);

    return NextResponse.json({ success: true, product: saved }, { status: 201 });
  } catch (err: any) {
    console.error('[Admin Products API] Error creating product:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
