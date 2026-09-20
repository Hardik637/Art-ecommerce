import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateShipping } from '@/lib/shipping';

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
  stock?: number;
  frameOption?: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface CartToastInfo {
  visible: boolean;
  message: string;
  productName?: string;
  productImage?: string;
  price?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toast: CartToastInfo | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  showToast: (toast: Omit<CartToastInfo, 'visible'>) => void;
  hideToast: () => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string; quantity?: number }) => void;
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
      toast: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      showToast: (toastData) =>
        set({
          toast: {
            ...toastData,
            visible: true,
          },
        }),

      hideToast: () =>
        set((state) => ({
          toast: state.toast ? { ...state.toast, visible: false } : null,
        })),

      addItem: (newItem) =>
        set((state) => {
          const frameId = newItem.frameOption?.id || 'unframed';
          const compositeId = newItem.id || `${newItem.productId}-${frameId}`;
          const maxStock = newItem.stock ?? 99;

          const existingItem = state.items.find((i) => i.id === compositeId);

          let updatedItems: CartItem[];
          if (existingItem) {
            const newQuantity = Math.min(maxStock, existingItem.quantity + (newItem.quantity || 1));
            updatedItems = state.items.map((i) =>
              i.id === compositeId ? { ...i, quantity: newQuantity } : i
            );
          } else {
            const cartItem: CartItem = {
              ...newItem,
              id: compositeId,
              quantity: Math.min(maxStock, Math.max(1, newItem.quantity || 1)),
            };
            updatedItems = [...state.items, cartItem];
          }

          return {
            items: updatedItems,
            isOpen: false, // Add to cart NEVER opens cart drawer
            toast: {
              visible: true,
              message: 'Added to cart',
              productName: newItem.name,
              productImage: newItem.image,
              price: newItem.price + (newItem.frameOption?.price || 0),
            },
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.id !== id) return i;
              const maxStock = i.stock ?? 99;
              const safeQty = Math.min(maxStock, Math.max(0, quantity));
              return { ...i, quantity: safeQty };
            })
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
        return calculateShipping(subtotal);
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
      partialize: (state) => ({ items: state.items }),
    }
  )
);

