'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArtworkProduct } from '@/types/art';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/artCatalog';
import { Heart, ShoppingBag, Check } from 'lucide-react';

interface ArtworkCardProps {
  artwork: ArtworkProduct;
  priority?: boolean;
  onQuickView?: (artwork: ArtworkProduct) => void;
}

export default function ArtworkCard({
  artwork,
  priority = false,
  onQuickView,
}: ArtworkCardProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(artwork.id));
  const addItem = useCartStore((state) => state.addItem);

  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist : false;
  const secondaryImage = artwork.images[1] || artwork.images[0] || artwork.thumbnail;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: artwork.id,
      slug: artwork.slug,
      name: artwork.name,
      artistName: artwork.artistName,
      price: artwork.price,
      image: artwork.images[0] || artwork.thumbnail,
      medium: artwork.medium,
      dimensions: `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md"
    >
      {/* ── Product Image Container ─────────────────────────────────── */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-100 overflow-hidden">
        {/* Subtle Retail Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
          {artwork.isOneOfOne && (
            <span className="bg-[#0F0F0F] text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-wider px-2 py-0.5 uppercase">
              1/1 Original
            </span>
          )}
          {artwork.isLimitedEdition && !artwork.isOneOfOne && (
            <span className="bg-neutral-800 text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-wider px-2 py-0.5 uppercase">
              Edition {artwork.editionSize ? `of ${artwork.editionSize}` : ''}
            </span>
          )}
          {artwork.isBestseller && !artwork.isOneOfOne && !artwork.isLimitedEdition && (
            <span className="bg-[#B08A4A] text-black text-[8.5px] sm:text-[9px] font-sans font-bold tracking-wider px-2 py-0.5 uppercase">
              Bestseller
            </span>
          )}
          {artwork.isNew && !artwork.isBestseller && !artwork.isOneOfOne && (
            <span className="bg-neutral-900 text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-wider px-2 py-0.5 uppercase">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(artwork);
          }}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 hover:text-black hover:scale-110 transition-all shadow-sm"
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            fill={isWishlisted ? '#0F0F0F' : 'none'}
            className={isWishlisted ? 'text-[#0F0F0F]' : 'text-neutral-600'}
          />
        </button>

        {/* Product Image Link with Clean Hover Zoom */}
        <Link
          href={`/products/${artwork.slug || artwork.id}`}
          className="block w-full h-full p-2 sm:p-3"
        >
          <div className="relative w-full h-full bg-neutral-100">
            <Image
              src={isHovered && secondaryImage ? secondaryImage : artwork.images[0] || artwork.thumbnail}
              alt={artwork.name}
              fill
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          </div>
        </Link>

        {/* Slide-Up Quick Add Button (Desktop Hover + Mobile Always Accessible) */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={added}
            className={`w-full py-2.5 px-3 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-colors shadow-md ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0F0F0F] text-white hover:bg-neutral-800'
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>+ Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Product Card Information ─────────────────────────────────── */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 bg-white">
        {/* Category Label */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9.5px] sm:text-[10px] font-sans font-semibold tracking-wider text-neutral-500 uppercase truncate">
            {getCategoryLabel(artwork.category)}
          </span>
          <span className="text-[9px] font-sans text-neutral-400 uppercase hidden sm:inline">
            {artwork.catalogNumber}
          </span>
        </div>

        {/* Product Name */}
        <Link
          href={`/products/${artwork.slug || artwork.id}`}
          className="font-sans text-xs sm:text-sm font-medium text-neutral-900 hover:text-black leading-snug line-clamp-1 mb-1 transition-colors"
        >
          {artwork.name}
        </Link>

        {/* Medium / Subtitle */}
        <p className="text-[11px] text-neutral-500 font-sans line-clamp-1 mb-2">
          {artwork.medium}
        </p>

        {/* Price & Mobile Quick Add Row */}
        <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-semibold text-xs sm:text-sm text-[#0F0F0F]">
              {formatPrice(artwork.price)}
            </span>
            {artwork.originalPrice && (
              <span className="font-sans text-[11px] text-neutral-400 line-through">
                {formatPrice(artwork.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Tap-To-Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={added}
            className="sm:hidden p-1.5 text-neutral-800 hover:text-black transition-colors"
            aria-label="Add to bag"
          >
            {added ? <Check size={15} className="text-emerald-600" /> : <ShoppingBag size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
