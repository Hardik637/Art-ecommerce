'use client';

import { useCartStore } from '@/store/cartStore';
import { ARTWORKS, formatPrice } from '@/lib/artCatalog';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Trash2, ArrowRight, ShieldCheck, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getFramingTotal,
    getShipping,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const isPushedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDismiss = useCallback(() => {
    if (isPushedRef.current) {
      isPushedRef.current = false;
      // Pops the history state and triggers popstate listener to close drawer
      window.history.back();
    } else {
      closeCart();
    }
  }, [closeCart]);

  const handleNavigate = useCallback(() => {
    if (isPushedRef.current) {
      isPushedRef.current = false;
      window.history.replaceState({ ...window.history.state, cartDrawerOpen: false }, '');
    }
    closeCart();
  }, [closeCart]);

  // Controlled Browser History Handling for Back Button
  useEffect(() => {
    if (isOpen) {
      if (!isPushedRef.current) {
        window.history.pushState({ ...window.history.state, cartDrawerOpen: true }, '');
        isPushedRef.current = true;
      }

      const handlePopState = () => {
        // Browser Back or Android back gesture was triggered
        // Browser already popped the state; close the drawer without calling history.back()
        isPushedRef.current = false;
        closeCart();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleDismiss();
        }
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);

      // Prevent background scroll
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, closeCart, handleDismiss]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!mounted) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const framingTotal = getFramingTotal();
  const shipping = getShipping();
  const total = getTotal();
  const count = getItemCount();

  // Recommendations: 2 products not currently in cart
  const recommendations = ARTWORKS.filter(
    (art) => !items.some((i) => i.productId === art.id)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-black tracking-tight uppercase">
                Shopping Bag <span className="text-xs sm:text-sm font-normal text-neutral-500">({count})</span>
              </h2>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-neutral-50 px-5 py-2.5 border-b border-neutral-200">
            {subtotal >= 999 ? (
              <p className="text-xs font-sans text-black flex items-center gap-1.5 font-medium">
                <ShieldCheck size={15} className="text-black" />
                <span>Complimentary white-glove shipping applied</span>
              </p>
            ) : (
              <p className="text-xs font-sans text-neutral-600">
                Add <span className="font-bold text-black">{formatPrice(999 - subtotal)}</span> more for free delivery
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-sans font-bold text-base text-black mb-1 uppercase tracking-tight">
                  Your cart is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6 leading-relaxed">
                  Your cart is waiting for something special. Save pieces you love or explore our curated catalog.
                </p>
                <Link
                  href="/products"
                  onClick={handleNavigate}
                  className="inline-block bg-black text-white text-xs font-sans font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-5 border-b border-neutral-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-20 h-24 bg-neutral-100 relative overflow-hidden flex-shrink-0 border border-neutral-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="type-product-title text-sm text-black leading-snug truncate">
                          {item.name}
                        </h4>
                        <p className="type-label text-neutral-500 mt-0.5">
                          {item.artistName}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-black transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-1">
                      {item.frameOption?.name || 'Standard Framing / Original'}
                    </p>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      {/* Quantity stepper strictly respecting stock limits */}
                      <div className="flex items-center border border-neutral-300 bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-neutral-200 transition-colors text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-sans px-2.5 font-bold text-black min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-200 transition-colors text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-sans font-bold text-sm text-black">
                          {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Cross-Sells */}
            {items.length > 0 && recommendations.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase mb-3">
                  Recommended For You
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {recommendations.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/products/${rec.slug || rec.id}`}
                      onClick={handleNavigate}
                      className="group bg-neutral-50 p-2 border border-neutral-200 hover:border-black transition-colors flex flex-col"
                    >
                      <div className="aspect-[4/5] relative bg-neutral-100 mb-1.5 overflow-hidden">
                        <Image
                          src={rec.images[0] || rec.thumbnail}
                          alt={rec.name}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="type-product-title text-xs text-black truncate">
                        {rec.name}
                      </p>
                      <p className="type-price text-[11px] text-black mt-0.5">
                        {formatPrice(rec.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer / Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {framingTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Framing</span>
                    <span className="text-black font-semibold">{formatPrice(framingTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-black font-semibold">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-sans text-black">
                  <span className="font-bold">Total (Taxes Included)</span>
                  <span className="font-extrabold text-base">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={handleNavigate}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 px-6 font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
              <p className="text-[10px] text-center text-neutral-400">
                Pan-India Insured Transit • 7-Day In-Home Trial
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
