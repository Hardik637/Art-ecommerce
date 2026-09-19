'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArtworkProduct } from '@/types/art';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/artCatalog';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';

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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#FAF7F2] border border-[#E4DBCF] hover:border-[#11100F] transition-all duration-300"
    >
      {/* Artwork Image Container */}
      <div className="relative aspect-[4/5] bg-[#E4DBCF] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {artwork.isOneOfOne && (
            <span className="bg-[#481E25] text-[#F4EFE7] text-[9px] font-sans font-semibold tracking-[0.2em] px-2.5 py-1 uppercase shadow-sm">
              One of One
            </span>
          )}
          {artwork.isLimitedEdition && !artwork.isOneOfOne && (
            <span className="bg-[#11100F] text-[#F4EFE7] text-[9px] font-sans font-semibold tracking-[0.2em] px-2.5 py-1 uppercase shadow-sm">
              Limited Edition {artwork.editionSize ? `(${artwork.editionSize})` : ''}
            </span>
          )}
          {artwork.stock === 1 && !artwork.isOneOfOne && (
            <span className="bg-[#B08A4A] text-[#11100F] text-[9px] font-sans font-bold tracking-[0.2em] px-2 py-0.5 uppercase">
              Low Stock
            </span>
          )}
          {artwork.isBestseller && !artwork.isOneOfOne && !artwork.isLimitedEdition && (
            <span className="bg-[#11100F] text-[#F4EFE7] text-[9px] font-sans font-semibold tracking-[0.2em] px-2.5 py-1 uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(artwork);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#F4EFE7]/90 backdrop-blur-sm flex items-center justify-center text-[#11100F] hover:scale-110 transition-transform shadow-sm"
          aria-label="Save to wishlist"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            fill={isWishlisted ? '#481E25' : 'none'}
            className={isWishlisted ? 'text-[#481E25]' : 'text-[#78716C] hover:text-[#11100F]'}
          />
        </button>

        {/* Artwork Link with Secondary Image Reveal */}
        <Link href={`/products/${artwork.slug || artwork.id}`} className="block w-full h-full p-3">
          <div className="relative w-full h-full bg-[#E4DBCF]">
            <Image
              src={isHovered && secondaryImage ? secondaryImage : artwork.images[0] || artwork.thumbnail}
              alt={artwork.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          </div>
        </Link>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#11100F]/80 via-[#11100F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex gap-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(artwork);
              }}
              className="flex-1 bg-[#F4EFE7] text-[#11100F] text-[10px] font-sans font-semibold uppercase tracking-[0.16em] py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-[#B08A4A] hover:text-[#11100F] transition-colors"
            >
              <Eye size={12} />
              <span>Quick View</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            disabled={added}
            className="flex-1 bg-[#11100F] text-[#F4EFE7] text-[10px] font-sans font-semibold uppercase tracking-[0.16em] py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-[#481E25] transition-colors disabled:bg-[#10B981]"
          >
            {added ? (
              <>
                <Check size={12} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Artwork Metadata */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase truncate">
            {getCategoryLabel(artwork.category)}
          </span>
          <span className="text-[9px] font-sans text-[#A8A29E] tracking-wider uppercase">
            {artwork.catalogNumber}
          </span>
        </div>

        <Link
          href={`/products/${artwork.slug || artwork.id}`}
          className="font-serif text-base font-normal text-[#11100F] leading-snug group-hover:text-[#481E25] transition-colors mb-1.5"
        >
          {artwork.name}
        </Link>

        <p className="text-[11px] text-[#78716C] font-sans mb-3 line-clamp-1">
          {artwork.medium}
        </p>

        <div className="mt-auto pt-2 border-t border-[#E4DBCF]/80 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-semibold text-[#11100F]">
              {formatPrice(artwork.price)}
            </span>
            {artwork.originalPrice && (
              <span className="font-sans text-xs text-[#A8A29E] line-through">
                {formatPrice(artwork.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-sans text-[#78716C] tracking-wide">
            {artwork.dimensions.width}×{artwork.dimensions.height} {artwork.dimensions.unit}
          </span>
        </div>
      </div>
    </div>
  );
}
