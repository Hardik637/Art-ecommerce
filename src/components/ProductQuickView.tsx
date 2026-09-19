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
      artistName: artwork.artistName,
      price: artwork.price,
      image: currentImage,
      medium: artwork.medium,
      dimensions: `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
      frameOption: artwork.frameAvailable ? selectedFrame : undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#11100F]/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <div
        className="relative w-full max-w-4xl bg-[#F4EFE7] border border-[#E4DBCF] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E4DBCF] flex items-center justify-center text-[#78716C] hover:text-[#11100F] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Left: Gallery preview */}
        <div className="w-full md:w-1/2 bg-[#E4DBCF] p-6 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/5] bg-[#FAF7F2] border border-[#D6CDBF] shadow-inner mb-4">
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
                  className={`w-12 h-14 relative bg-[#FAF7F2] border ${
                    currentImage === img ? 'border-[#11100F] ring-1 ring-[#11100F]' : 'border-[#D6CDBF]'
                  } overflow-hidden`}
                >
                  <Image src={img} alt="" fill className="object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Artwork Acquisition Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase">
              {getCategoryLabel(artwork.category)}
            </span>
            <span className="text-[10px] font-sans text-[#78716C] tracking-wider uppercase">
              {artwork.catalogNumber}
            </span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#11100F] leading-snug mb-2">
            {artwork.name}
          </h2>

          <p className="text-xs text-[#78716C] font-sans mb-4">
            {artwork.medium} • {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
          </p>

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E4DBCF]">
            <span className="font-serif text-2xl font-semibold text-[#11100F]">
              {formatPrice(totalPrice)}
            </span>
            {artwork.originalPrice && (
              <span className="font-sans text-sm text-[#A8A29E] line-through">
                {formatPrice(artwork.originalPrice + framePrice)}
              </span>
            )}
            <span className="text-[10px] text-[#78716C] ml-auto uppercase tracking-wider">
              Taxes included
            </span>
          </div>

          <p className="text-xs text-[#292622] font-sans leading-relaxed mb-6 line-clamp-3">
            {artwork.shortDescription || artwork.description}
          </p>

          {/* Framing Selection */}
          {artwork.frameAvailable && (
            <div className="mb-6">
              <label className="block text-[11px] font-sans font-semibold tracking-[0.18em] text-[#11100F] uppercase mb-2">
                Museum Framing Option
              </label>
              <div className="space-y-1.5">
                {STANDARD_FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`w-full text-left p-2.5 border text-xs font-sans transition-all flex items-center justify-between ${
                      selectedFrame.id === frame.id
                        ? 'border-[#11100F] bg-[#FAF7F2]'
                        : 'border-[#E4DBCF] hover:border-[#11100F]'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-[#11100F] block">{frame.name}</span>
                      <span className="text-[10px] text-[#78716C]">{frame.material}</span>
                    </div>
                    <span className="font-medium text-[#11100F]">
                      {frame.price === 0 ? 'Included' : `+${formatPrice(frame.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Badge */}
          <div className="bg-[#FAF7F2] p-3 border border-[#E4DBCF] mb-6 flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#B08A4A] flex-shrink-0" />
            <p className="text-[11px] font-sans text-[#78716C]">
              Includes signed provenance &amp; Certificate of Authenticity.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-4 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="flex-1 bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-3.5 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:bg-[#10B981]"
            >
              {added ? (
                <>
                  <Check size={15} />
                  <span>Added to Bag</span>
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
              className="w-12 h-12 border border-[#E4DBCF] bg-[#FAF7F2] hover:border-[#11100F] flex items-center justify-center text-[#11100F] transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                fill={isInWishlist ? '#481E25' : 'none'}
                className={isInWishlist ? 'text-[#481E25]' : 'text-[#78716C]'}
              />
            </button>
          </div>

          <div className="text-center mt-3">
            <Link
              href={`/products/${artwork.slug || artwork.id}`}
              onClick={onClose}
              className="text-[11px] font-sans font-semibold tracking-wider text-[#78716C] hover:text-[#11100F] inline-flex items-center gap-1 uppercase underline underline-offset-4"
            >
              <span>View Product Details</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
