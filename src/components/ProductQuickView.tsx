'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArtworkProduct, FrameOption } from '@/types/art';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, STANDARD_FRAME_OPTIONS, getCategoryLabel } from '@/lib/artCatalog';
import { X, Check, ShoppingBag, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductQuickViewProps {
  artwork: ArtworkProduct | null;
  onClose: () => void;
}

function getQuickViewBadge(artwork: ArtworkProduct): string | null {
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

export default function ProductQuickView({ artwork, onClose }: ProductQuickViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    artwork ? state.isInWishlist(artwork.id) : false
  );

  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(STANDARD_FRAME_OPTIONS[0]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);

  // Keyboard Escape listener & Scroll locking
  useEffect(() => {
    if (!artwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [artwork, onClose]);

  if (!artwork) return null;

  const currentImage = selectedImage || artwork.images[0] || artwork.thumbnail;
  const framePrice = artwork.frameAvailable ? selectedFrame.price : 0;
  const totalPrice = artwork.price + framePrice;
  const badge = getQuickViewBadge(artwork);
  const isOutOfStock = artwork.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: artwork.id,
      slug: artwork.slug,
      name: artwork.name,
      artistName: artwork.artistName || '',
      price: artwork.price,
      image: currentImage,
      medium: artwork.medium,
      dimensions: `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
      stock: artwork.stock,
      frameOption: artwork.frameAvailable ? selectedFrame : undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1100);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(artwork);
    setHeartPulsing(true);
    setTimeout(() => setHeartPulsing(false), 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition-colors"
          aria-label="Close Quick View"
        >
          <X size={17} />
        </button>

        {/* Left: Gallery preview */}
        <div className="w-full md:w-1/2 bg-neutral-100 p-4 sm:p-5 flex flex-col items-center justify-center relative">
          {badge && (
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <span className="bg-black text-white text-[8.5px] sm:text-[9px] font-sans font-bold tracking-[0.06em] px-2 py-0.5 uppercase">
                {badge}
              </span>
            </div>
          )}

          <div className="relative w-full aspect-[4/5] bg-white border border-neutral-200 shadow-xs mb-3">
            <Image
              src={currentImage}
              alt={artwork.name}
              fill
              className="object-contain p-3"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Thumbnails */}
          {artwork.images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto max-w-full py-1">
              {artwork.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-11 h-13 relative bg-white border flex-shrink-0 transition-all ${
                    currentImage === img ? 'border-black ring-1 ring-black' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  } overflow-hidden`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col overflow-y-auto bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="type-label text-neutral-500">
              {getCategoryLabel(artwork.category)}
            </span>
            <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider">
              {artwork.catalogNumber}
            </span>
          </div>

          <h2
            id="quickview-title"
            className="font-sans font-bold text-base sm:text-xl text-black uppercase tracking-tight leading-snug mb-1"
          >
            {artwork.name}
          </h2>

          <p className="text-xs text-neutral-500 font-sans mb-3">
            {artwork.medium} • {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
          </p>

          <div className="flex items-baseline gap-2.5 mb-3.5 pb-3.5 border-b border-neutral-100">
            <span className="type-price text-xl sm:text-2xl text-black">
              {formatPrice(totalPrice)}
            </span>
            {artwork.originalPrice && artwork.originalPrice > artwork.price && (
              <span className="font-sans text-xs text-neutral-400 line-through">
                {formatPrice(artwork.originalPrice + framePrice)}
              </span>
            )}
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider ml-auto text-neutral-500">
              {isOutOfStock ? 'Sold Out' : 'In Stock'}
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4 line-clamp-2">
            {artwork.shortDescription || artwork.description}
          </p>

          {/* Framing Selection */}
          {artwork.frameAvailable && (
            <div className="mb-4">
              <label className="block text-[10px] font-sans font-bold tracking-wider text-neutral-900 uppercase mb-1.5">
                Framing Option
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {STANDARD_FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`w-full text-left p-2 border text-xs font-sans transition-all flex items-center justify-between ${
                      selectedFrame.id === frame.id
                        ? 'border-black bg-neutral-50 font-medium'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-neutral-900 block truncate">{frame.name}</span>
                      <span className="text-[10px] text-neutral-500 truncate block">{frame.material}</span>
                    </div>
                    <span className="text-neutral-900 font-semibold flex-shrink-0">
                      {frame.price === 0 ? 'Included' : `+${formatPrice(frame.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Badge */}
          <div className="bg-neutral-50 p-2.5 border border-neutral-200 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-black flex-shrink-0" />
            <p className="text-[11px] font-sans text-neutral-600">
              Includes signed Certificate of Authenticity &amp; insured courier.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-2 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={added || isOutOfStock}
              className={`flex-1 py-3 px-4 font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {added ? (
                <>
                  <Check size={15} />
                  <span>Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`w-11 h-11 border border-neutral-300 bg-white hover:border-black flex items-center justify-center text-neutral-900 transition-transform duration-200 ${
                heartPulsing ? 'scale-125' : ''
              }`}
              aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                size={18}
                fill={isInWishlist ? '#000000' : 'none'}
                className={isInWishlist ? 'text-black' : 'text-neutral-500'}
              />
            </button>
          </div>

          <div className="text-center mt-3">
            <Link
              href={`/products/${artwork.slug || artwork.id}`}
              onClick={onClose}
              className="text-[11px] font-sans font-bold tracking-wider text-neutral-600 hover:text-black inline-flex items-center gap-1 uppercase underline underline-offset-4"
            >
              <span>View Full Details</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
