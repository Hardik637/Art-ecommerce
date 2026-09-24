import { Product } from '@/types/art';
import { getAdminFirestore } from './admin';

const PRODUCTS_COLLECTION = 'products';

export interface FirebaseProductQueryOptions {
  category?: string;
  subcategory?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  limit?: number;
}

/**
 * Fetch products from Firestore with optional filtering
 */
export async function getFirebaseProducts(
  options: FirebaseProductQueryOptions = {}
): Promise<Product[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  try {
    let query: FirebaseFirestore.Query = db.collection(PRODUCTS_COLLECTION);

    if (options.category) {
      query = query.where('category', '==', options.category);
    }
    if (options.subcategory && options.subcategory !== 'all') {
      query = query.where('subcategory', '==', options.subcategory);
    }
    if (options.isFeatured !== undefined) {
      query = query.where('isFeatured', '==', options.isFeatured);
    }
    if (options.isNew !== undefined) {
      query = query.where('isNew', '==', options.isNew);
    }
    if (options.isBestseller !== undefined) {
      query = query.where('isBestseller', '==', options.isBestseller);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snap = await query.get();
    return snap.docs.map((doc) => doc.data() as Product);
  } catch (err) {
    console.error('[Firebase Products] Error fetching products:', err);
    return [];
  }
}

/**
 * Fetch a single product by ID or Slug from Firestore
 */
export async function getFirebaseProductById(idOrSlug: string): Promise<Product | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  try {
    // 1. Try by document ID
    const docRef = db.collection(PRODUCTS_COLLECTION).doc(idOrSlug);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data() as Product;
    }

    // 2. Try by slug query
    const slugSnap = await db
      .collection(PRODUCTS_COLLECTION)
      .where('slug', '==', idOrSlug)
      .limit(1)
      .get();

    if (!slugSnap.empty) {
      return slugSnap.docs[0].data() as Product;
    }

    return null;
  } catch (err) {
    console.error('[Firebase Products] Error fetching product by id/slug:', err);
    return null;
  }
}

/**
 * Create or update a product in Firestore
 */
export async function saveFirebaseProduct(product: Product): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const docRef = db.collection(PRODUCTS_COLLECTION).doc(product.id);
    await docRef.set({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('[Firebase Products] Error saving product:', err);
    return false;
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteFirebaseProduct(productId: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    await db.collection(PRODUCTS_COLLECTION).doc(productId).delete();
    return true;
  } catch (err) {
    console.error('[Firebase Products] Error deleting product:', err);
    return false;
  }
}
