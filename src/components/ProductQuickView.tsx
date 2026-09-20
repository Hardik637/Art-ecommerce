'use client';

import { useState } from 'react';
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

export default function ProductQuickView({ artwork, onClose }: ProductQuickViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    artwork ? state.isInWishlist(artwork.id) : false
  );

  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(STANDARD_FRAME_OPTIONS[0]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [added, setAdded] = useState(false);

  if (!artwork) return null;

  const currentImage = selectedImage || artwork.images[0] || artwork.thumbnail;
  const framePrice = artwork.frameAvailable ? selectedFrame.price : 0;
  const totalPrice = artwork.price + framePrice;

  const handleAddToCart = () => {
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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative w-full max-w-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Left: Gallery preview */}
        <div className="w-full md:w-1/2 bg-neutral-100 p-5 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/5] bg-white border border-neutral-200 shadow-xs mb-3">
            <Image
              src={currentImage}
              alt={artwork.name}
              fill
              className="object-contain p-3"
              priority
            />
          </div>

          {/* Thumbnails */}
          {artwork.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {artwork.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-12 h-14 relative bg-white border ${
                    currentImage === img ? 'border-black ring-1 ring-black' : 'border-neutral-200'
                  } overflow-hidden`}
                >
                  <Image src={img} alt="" fill className="object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="type-label text-neutral-500">
              {getCategoryLabel(artwork.category)}
            </span>
            <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider">
              {artwork.catalogNumber}
            </span>
          </div>

          <h2 className="type-hero text-xl sm:text-2xl text-black leading-snug mb-1">
            {artwork.name}
          </h2>

          <p className="text-xs text-neutral-500 font-sans mb-3">
            {artwork.medium} • {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
          </p>

          <div className="flex items-baseline gap-2.5 mb-4 pb-4 border-b border-neutral-100">
            <span className="type-price text-2xl text-black">
              {formatPrice(totalPrice)}
            </span>
            {artwork.originalPrice && artwork.originalPrice > artwork.price && (
              <span className="font-sans text-xs text-neutral-400 line-through">
                {formatPrice(artwork.originalPrice + framePrice)}
              </span>
            )}
            <span className="text-[10px] text-neutral-500 ml-auto uppercase">
              Taxes included
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4 line-clamp-3">
            {artwork.shortDescription || artwork.description}
          </p>

          {/* Framing Selection */}
          {artwork.frameAvailable && (
            <div className="mb-4">
              <label className="block text-[10px] font-sans font-bold tracking-wider text-neutral-900 uppercase mb-1.5">
                Framing Option
              </label>
              <div className="space-y-1.5">
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
                    <div>
                      <span className="text-neutral-900 block">{frame.name}</span>
                      <span className="text-[10px] text-neutral-500">{frame.material}</span>
                    </div>
                    <span className="text-neutral-900 font-semibold">
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
              Includes signed Certificate of Authenticity.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-3 flex gap-2.5">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="flex-1 py-3 px-4 font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors bg-black text-white hover:bg-neutral-800"
            >
              {added ? (
                <>
                  <Check size={15} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(artwork)}
              className="w-11 h-11 border border-neutral-300 bg-white hover:border-black flex items-center justify-center text-neutral-900 transition-colors"
              aria-label="Wishlist"
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
