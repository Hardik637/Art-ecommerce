import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SITE_CONFIG } from '@/config/site';

export interface CartItem {
  id: string; // Unique composite key: `${productId}-${frameId || 'unframed'}`
  productId: string;
  slug: string;
  name: string;
  artistName: string;
  price: number;
  image: string;
  medium: string;
  dimensions: string;
  frameOption?: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getFramingTotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) =>
        set((state) => {
          const frameId = newItem.frameOption?.id || 'unframed';
          const compositeId = newItem.id || `${newItem.productId}-${frameId}`;

          const existingItem = state.items.find((i) => i.id === compositeId);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === compositeId ? { ...i, quantity: i.quantity + 1 } : i
              ),
              isOpen: true,
            };
          }

          const cartItem: CartItem = {
            ...newItem,
            id: compositeId,
            quantity: 1,
          };

          return {
            items: [...state.items, cartItem],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getFramingTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.frameOption?.price || 0) * item.quantity,
          0
        );
      },

      getShipping: () => {
        const subtotal = get().getSubtotal() + get().getFramingTotal();
        if (subtotal === 0) return 0;
        return subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : 499;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getFramingTotal() + get().getShipping();
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'atelier-art-cart-storage',
    }
  )
);
