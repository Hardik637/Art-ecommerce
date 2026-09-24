import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/art';

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  artistName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  medium: string;
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  recordView: (product: Product) => void;
  clearHistory: () => void;
}

const MAX_RECENTLY_VIEWED = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      recordView: (product) =>
        set((state) => {
          if (!product || !product.id) return state;

          const newItem: RecentlyViewedItem = {
            id: product.id,
            slug: product.slug || product.id,
            name: product.name,
            artistName: product.artistName,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || product.original_price,
            thumbnail: product.thumbnail || product.images?.[0] || '',
            medium: product.medium,
            viewedAt: Date.now(),
          };

          // Filter out existing occurrence of this product
          const filtered = state.items.filter((i) => i.id !== product.id && i.slug !== product.slug);

          // Prepend newest item, limit to MAX_RECENTLY_VIEWED
          return {
            items: [newItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED),
          };
        }),

      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'atelier-recently-viewed-storage',
    }
  )
);
