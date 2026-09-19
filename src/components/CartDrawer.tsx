'use client';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ARTWORKS, formatPrice } from '@/lib/artCatalog';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ArrowRight, ShieldCheck, Heart, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getFramingTotal, getShipping, getTotal, getItemCount } = useCartStore();
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const framingTotal = getFramingTotal();
  const shipping = getShipping();
  const total = getTotal();
  const count = getItemCount();

  // Pick 2 recommendation artworks not in cart
  const recommendations = ARTWORKS.filter(
    (art) => !items.some((i) => i.productId === art.id)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#11100F]/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F4EFE7] border-l border-[#E4DBCF] flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E4DBCF] bg-[#F4EFE7] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase">
                Acquisitions
              </p>
              <h2 className="font-serif text-2xl font-normal text-[#11100F] tracking-tight">
                Shopping Bag <span className="text-base text-[#78716C]">({count})</span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#78716C] hover:text-[#11100F] hover:bg-[#E4DBCF]/60 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Shipping Progress bar */}
          <div className="bg-[#E4DBCF]/60 px-6 py-2.5 border-b border-[#E4DBCF]">
            {subtotal >= 999 ? (
              <p className="text-xs font-sans text-[#11100F] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#B08A4A]" />
                <span>Complimentary white-glove art delivery applied</span>
              </p>
            ) : (
              <p className="text-xs font-sans text-[#78716C]">
                Add <span className="font-semibold text-[#11100F]">{formatPrice(999 - subtotal)}</span> more for complimentary white-glove shipping
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E4DBCF] flex items-center justify-center text-[#B08A4A]">
                  <span className="font-serif text-2xl italic">A</span>
                </div>
                <h3 className="font-serif text-xl text-[#11100F] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto mb-6">
                  Discover singular original artworks, cast bronze sculptures, and limited edition prints.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-block bg-[#11100F] text-[#F4EFE7] text-[11px] font-sans font-semibold uppercase tracking-[0.2em] px-6 py-3 rounded-none hover:bg-[#481E25] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-[#E4DBCF] last:border-b-0"
                >
                  <div className="w-20 h-24 bg-[#E4DBCF] relative overflow-hidden flex-shrink-0 border border-[#D6CDBF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-sans font-semibold tracking-[0.18em] text-[#B08A4A] uppercase">
                          {item.artistName}
                        </p>
                        <h4 className="font-serif text-base font-normal text-[#11100F] leading-snug truncate">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#78716C] hover:text-[#481E25] transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      {item.frameOption?.name || 'Unframed / Gallery Wrap'}
                    </p>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D6CDBF] bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-[#E4DBCF] transition-colors text-[#11100F]"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-sans px-2 font-medium text-[#11100F]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#E4DBCF] transition-colors text-[#11100F]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-base font-medium text-[#11100F]">
                          {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Recommendations / Complete the Curation */}
            {items.length > 0 && recommendations.length > 0 && (
              <div className="pt-4 border-t border-[#E4DBCF]">
                <p className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-3">
                  Complete the Curation
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {recommendations.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/products/${rec.slug || rec.id}`}
                      onClick={closeCart}
                      className="group bg-[#FAF7F2] p-2.5 border border-[#E4DBCF] hover:border-[#11100F] transition-colors flex flex-col"
                    >
                      <div className="aspect-[4/5] relative bg-[#E4DBCF] mb-2 overflow-hidden">
                        <Image
                          src={rec.images[0] || rec.thumbnail}
                          alt={rec.name}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-[9px] font-sans text-[#B08A4A] tracking-wider uppercase truncate">
                        {rec.artistName}
                      </p>
                      <p className="font-serif text-xs text-[#11100F] truncate leading-tight">
                        {rec.name}
                      </p>
                      <p className="text-[11px] font-medium text-[#11100F] mt-1">
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
            <div className="p-6 border-t border-[#E4DBCF] bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-[#78716C]">
                <div className="flex justify-between">
                  <span>Artworks Subtotal</span>
                  <span className="text-[#11100F] font-medium">{formatPrice(subtotal)}</span>
                </div>
                {framingTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Museum Framing</span>
                    <span className="text-[#11100F] font-medium">{formatPrice(framingTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured White-Glove Shipping</span>
                  <span className="text-[#11100F] font-medium">
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E4DBCF] text-base font-serif text-[#11100F]">
                  <span className="font-normal">Estimated Total</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-3.5 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
              <p className="text-[10px] text-center text-[#78716C]">
                Includes Certificate of Authenticity &amp; Transit Insurance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
