import { Product, MajorCategory } from '@/types/art';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ARTWORKS } from '@/lib/artCatalog';
import { getCustomProducts } from '@/lib/customProducts';

export type { Product, MajorCategory };

export const VALID_CATEGORIES: MajorCategory[] = ['wall-art', 'sculptures', 'decorative-pieces'];

export function isValidCategory(category: string): category is MajorCategory {
  return VALID_CATEGORIES.includes(category as MajorCategory);
}

function mapSupabaseRowToProduct(row: any): Product {
  const category: MajorCategory = isValidCategory(row.category) ? row.category : 'wall-art';

  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    category,
    subcategory: row.subcategory || 'contemporary',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    original_price: row.original_price ? Number(row.original_price) : undefined,
    description: row.description || '',
    shortDescription: row.short_description || row.description?.slice(0, 160) || '',
    short_description: row.short_description || row.description?.slice(0, 160) || '',
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.thumbnail],
    thumbnail: row.thumbnail || (Array.isArray(row.images) ? row.images[0] : ''),
    material: row.material || 'Mixed Archival Media',
    medium: row.medium || 'Contemporary Art',
    dimensions: typeof row.dimensions === 'object' && row.dimensions !== null ? row.dimensions : { width: 0, height: 0, unit: 'cm' },
    stock: Number(row.stock !== undefined ? row.stock : 1),
    isActive: Boolean(row.is_active !== false),
    is_active: Boolean(row.is_active !== false),
    isFeatured: Boolean(row.is_featured),
    is_featured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    is_new: Boolean(row.is_new),
    isBestseller: Boolean(row.is_bestseller),
    is_bestseller: Boolean(row.is_bestseller),
    isArtistFavorite: Boolean(row.is_artist_favorite),
    is_artist_favorite: Boolean(row.is_artist_favorite),
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 0),
    review_count: Number(row.review_count || 0),
    createdAt: row.created_at || new Date().toISOString(),
    created_at: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

export interface ProductQueryOptions {
  category?: MajorCategory;
  subcategory?: string;
  search?: string;
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
  limit?: number;
  offset?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Authoritative Product Data Service
 * Reads from Supabase when connected, with strictly typed development fixtures fallback.
 */
export async function getProducts(options: ProductQueryOptions = {}): Promise<Product[]> {
  if (options.category && !isValidCategory(options.category)) {
    throw new Error(`Invalid category "${options.category}". Allowed: ${VALID_CATEGORIES.join(', ')}`);
  }

  const customProducts = getCustomProducts();

  // 1. Check Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('products').select('*').eq('is_active', true);

      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.subcategory && options.subcategory !== 'all') {
        query = query.eq('subcategory', options.subcategory);
      }
      if (options.isFeatured) {
        query = query.eq('is_featured', true);
      }
      if (options.isNew) {
        query = query.eq('is_new', true);
      }
      if (options.isBestseller) {
        query = query.eq('is_bestseller', true);
      }
      if (options.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
      }
      if (options.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
      }

      // Sort
      if (options.sort === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (options.sort === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (options.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (options.sort === 'rating') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = [...customProducts, ...data.map(mapSupabaseRowToProduct)];

        // In-memory search filter if needed
        if (options.search?.trim()) {
          const q = options.search.toLowerCase().trim();
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.medium.toLowerCase().includes(q)
          );
        }

        return results;
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Products Service] Supabase query failed, using development fixtures:', err);
      }
    }
  }

  // 2. Custom & Development Fixtures Fallback
  let list = [...customProducts, ...ARTWORKS];

  if (options.category) {
    list = list.filter((p) => p.category === options.category);
  }
  if (options.subcategory && options.subcategory !== 'all') {
    list = list.filter((p) => p.subcategory === options.subcategory);
  }
  if (options.isFeatured) {
    list = list.filter((p) => p.isFeatured || p.is_featured);
  }
  if (options.isNew) {
    list = list.filter((p) => p.isNew || p.is_new);
  }
  if (options.isBestseller) {
    list = list.filter((p) => p.isBestseller || p.is_bestseller);
  }
  if (options.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.search?.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.medium.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (options.sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (options.sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (options.sort === 'rating') {
    list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  if (options.offset) {
    list = list.slice(options.offset);
  }
  if (options.limit) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const custom = getCustomProducts().find((p) => p.slug === slug || p.id === slug);
  if (custom) return custom;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch {
      // fallback
    }
  }

  const found = ARTWORKS.find((p) => p.slug === slug || p.id === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const custom = getCustomProducts().find((p) => p.id === id || p.slug === id);
  if (custom) return custom;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch {
      // fallback
    }
  }

  const found = ARTWORKS.find((p) => p.id === id || p.slug === id);
  return found || null;
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductsByCategory(category: MajorCategory): Promise<Product[]> {
  return getProducts({ category });
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return getProducts({ isNew: true, limit });
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  return getProducts({ isBestseller: true, limit });
}

