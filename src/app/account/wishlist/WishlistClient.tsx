'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight, Trash2, ShoppingBag, Check } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';

function getProductBadge(artwork: ArtworkProduct): string | null {
  const origPrice = artwork.originalPrice || artwork.original_price;
  if (origPrice && origPrice > artwork.price) {
    const discount = Math.round(((origPrice - artwork.price) / origPrice) * 100);
    return discount > 0 ? `SALE ${discount}% OFF` : 'SALE';
  }
  if (artwork.isBestseller) return 'BESTSELLER';
  if (artwork.isNew) return 'NEW';
  if (artwork.isArtistFavorite) return 'TRENDING';
  if (artwork.isFeatured) return 'FEATURED';
  if (artwork.isLimitedEdition) return 'LIMITED';
  return null;
}

export default function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (artwork: ArtworkProduct) => {
    if (artwork.stock <= 0) return;
    addItem({
      productId: artwork.id,
      slug: artwork.slug,
      name: artwork.name,
      artistName: artwork.artistName || '',
      price: artwork.price,
      image: artwork.images[0] || artwork.thumbnail,
      medium: artwork.medium,
      dimensions: `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
      stock: artwork.stock,
    });

    setAddedIds((prev) => ({ ...prev, [artwork.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [artwork.id]: false }));
    }, 1800);
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 bg-neutral-100 border border-neutral-200" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 p-12 sm:p-20 text-center max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5 text-black">
          <Heart size={26} strokeWidth={1.8} />
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-md mx-auto mb-8 leading-relaxed">
          Save pieces you love and come back to them anytime.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-widest font-sans font-bold shadow-xs"
        >
          <span>Explore Collection</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-sans text-neutral-500 uppercase tracking-wider">
          <strong className="text-black font-bold">{items.length}</strong> {items.length === 1 ? 'Saved Piece' : 'Saved Pieces'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((artwork) => {
          const badge = getProductBadge(artwork);
          const isUnavailable = artwork.stock <= 0;
          const isAdded = Boolean(addedIds[artwork.id]);

          return (
            <div
              key={artwork.id}
              className="group relative flex flex-col bg-white border border-neutral-200 hover:border-black transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-100 overflow-hidden">
                {badge && (
                  <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                    <span className="bg-black text-white text-[8.5px] sm:text-[9px] font-sans font-bold tracking-[0.06em] px-2 py-0.5 uppercase">
                      {badge}
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeItem(artwork.id)}
                  className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:text-black hover:bg-white shadow-xs transition-colors"
                  aria-label="Remove from Wishlist"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={14} />
                </button>

                <Link
                  href={`/products/${artwork.slug || artwork.id}`}
                  className="block w-full h-full p-2.5 sm:p-3"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={artwork.images[0] || artwork.thumbnail}
                      alt={artwork.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </Link>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-3.5 flex flex-col flex-1 bg-white">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.10em] text-neutral-500 mb-1 truncate">
                  {getCategoryLabel(artwork.category)}
                </span>

                <Link
                  href={`/products/${artwork.slug || artwork.id}`}
                  className="text-[13px] sm:text-[14px] font-sans font-bold text-black hover:text-neutral-600 line-clamp-1 mb-1 transition-colors uppercase tracking-[0.02em]"
                >
                  {artwork.name}
                </Link>

                <p className="text-[11px] text-neutral-500 font-sans line-clamp-1 mb-2">
                  {artwork.medium}
                </p>

                {/* Availability status */}
                <div className="mb-3">
                  {isUnavailable ? (
                    <span className="inline-block text-[9px] font-sans font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                      Currently Unavailable
                    </span>
                  ) : (
                    <span className="inline-block text-[9px] font-sans font-bold uppercase tracking-wider text-black bg-neutral-50 px-2 py-0.5 border border-neutral-200">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Price and Add to Cart action */}
                <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-sans font-bold text-black">
                      {formatPrice(artwork.price)}
                    </span>
                    {artwork.originalPrice && artwork.originalPrice > artwork.price && (
                      <span className="font-sans text-[11px] text-neutral-400 line-through">
                        {formatPrice(artwork.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(artwork)}
                    disabled={isUnavailable || isAdded}
                    className={`py-1.5 px-3 text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      isUnavailable
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : isAdded
                        ? 'bg-black text-white'
                        : 'bg-black text-white hover:bg-neutral-800'
                    }`}
                    aria-label={isUnavailable ? 'Currently unavailable' : 'Add to cart'}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} />
                        <span>Added</span>
                      </>
                    ) : isUnavailable ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <ShoppingBag size={12} />
                        <span>+ Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
