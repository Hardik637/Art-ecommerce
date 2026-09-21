import { Product, ArtworkProduct, MajorCategory } from '@/types/art';
import fs from 'fs';
import path from 'path';

/**
 * Custom Products Storage Manager
 * Enables store owner to add new products from the admin panel with image uploads.
 * These products are integrated into the live catalog alongside existing artworks.
 */

// In-memory cache for fast access
let customProductsMemoryStore: Product[] = [];
const STORAGE_FILE_PATH = path.join(process.cwd(), '.custom_products.json');

// Initialize from file if present
function loadPersistedProducts(): Product[] {
  try {
    if (fs.existsSync(STORAGE_FILE_PATH)) {
      const content = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Custom Products] Failed to load persisted products:', err);
  }
  return [];
}

function persistProducts(products: Product[]) {
  try {
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Custom Products] Failed to write custom products file:', err);
  }
}

// Initial load
customProductsMemoryStore = loadPersistedProducts();

export function getCustomProducts(): Product[] {
  return customProductsMemoryStore;
}

export function addCustomProduct(product: Product): Product {
  // Ensure fields are populated
  const prepared: Product = {
    ...product,
    id: product.id || `art-custom-${Date.now()}`,
    slug: product.slug || slugify(product.name),
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    is_active: true,
  };

  customProductsMemoryStore.unshift(prepared);
  persistProducts(customProductsMemoryStore);
  return prepared;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
