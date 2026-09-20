import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/art';

interface WishlistState {
  items: Product[];
  toggleItem: (item: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          } else {
            return { items: [...state.items, item] };
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'atelier-art-wishlist-storage',
    }
  )
);
