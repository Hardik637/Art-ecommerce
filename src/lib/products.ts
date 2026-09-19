import { ARTWORKS, searchArtworks } from './artCatalog';
import { ArtworkProduct } from '@/types/art';

export interface Product extends ArtworkProduct {
  image: string; // for backward compatibility with components expecting .image
  inStock: boolean;
  badge?: string;
  features?: string[];
  sizes?: string[];
}

export const PRODUCTS: Product[] = ARTWORKS.map((artwork) => ({
  ...artwork,
  image: artwork.images[0] || artwork.thumbnail,
  inStock: artwork.stock > 0,
  badge: artwork.isOneOfOne
    ? 'ONE OF ONE'
    : artwork.isLimitedEdition
    ? 'LIMITED EDITION'
    : artwork.isBestseller
    ? 'BESTSELLER'
    : artwork.isNew
    ? 'NEW WORK'
    : undefined,
  features: [
    artwork.medium,
    `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
    artwork.material,
    artwork.certificateOfAuthenticity ? 'Certificate of Authenticity' : 'Fine Art Archive',
  ],
  sizes: artwork.frameAvailable
    ? ['Unframed', 'Black Wood', 'Gold Leaf', 'Natural Oak']
    : ['Standard Scale'],
}));

export function searchProducts(query: string): Product[] {
  const results = searchArtworks(query);
  return results.map((artwork) => ({
    ...artwork,
    image: artwork.images[0] || artwork.thumbnail,
    inStock: artwork.stock > 0,
    badge: artwork.isOneOfOne
      ? 'ONE OF ONE'
      : artwork.isLimitedEdition
      ? 'LIMITED EDITION'
      : artwork.isBestseller
      ? 'BESTSELLER'
      : artwork.isNew
      ? 'NEW WORK'
      : undefined,
    features: [
      artwork.medium,
      `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
      artwork.material,
      'Certificate of Authenticity Included',
    ],
    sizes: ['Unframed', 'Black Wood', 'Gold Leaf'],
  }));
}

export * from './artCatalog';
