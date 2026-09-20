'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArtworkProduct, FrameOption } from '@/types/art';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import {
  formatPrice,
  STANDARD_FRAME_OPTIONS,
  SAMPLE_REVIEWS,
  ARTWORKS,
  getArtworkCategory,
  getCategoryLabel,
} from '@/lib/artCatalog';
import RoomPreviewModal from '@/components/RoomPreviewModal';
import FigureViewer from '@/components/FigureViewer';
import ArtworkCard from '@/components/ArtworkCard';
import {
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  Maximize2,
  RotateCw,
  ChevronDown,
  Star,
  Truck,
  ArrowRight,
  RotateCcw,
  Minus,
  Plus,
} from 'lucide-react';

interface ArtworkDetailClientProps {
  artwork: ArtworkProduct;
}

/**
 * Data-backed retail badge priority:
 * SALE (discount %) > BESTSELLER > NEW > TRENDING > FEATURED > LIMITED
 */
function getDetailBadge(artwork: ArtworkProduct): { text: string; style: string } | null {
  const origPrice = artwork.originalPrice;
  if (origPrice && origPrice > artwork.price) {
    const discountPercent = Math.round(((origPrice - artwork.price) / origPrice) * 100);
    return {
      text: discountPercent > 0 ? `SALE ${discountPercent}% OFF` : 'SALE',
      style: 'bg-black text-white font-bold',
    };
  }
  if (artwork.isBestseller) {
    return {
      text: 'BESTSELLER',
      style: 'bg-black text-white font-bold',
    };
  }
  if (artwork.isNew) {
    return {
      text: 'NEW',
      style: 'bg-neutral-900 text-white font-semibold',
    };
  }
  if (artwork.isArtistFavorite) {
    return {
      text: 'TRENDING',
      style: 'bg-neutral-900 text-white font-semibold',
    };
  }
  if (artwork.isFeatured) {
    return {
      text: 'FEATURED',
      style: 'bg-neutral-800 text-white font-semibold',
    };
  }
  if (artwork.isLimitedEdition) {
    return {
      text: 'LIMITED',
      style: 'bg-neutral-800 text-white font-semibold',
    };
  }
  return null;
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(artwork.id));

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(STANDARD_FRAME_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [figureViewerOpen, setFigureViewerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    dimensions: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentImage = artwork.images[selectedImageIndex] || artwork.thumbnail;
  const framePrice = artwork.frameAvailable ? selectedFrame.price : 0;
  const unitPrice = artwork.price + framePrice;
  const totalPrice = unitPrice * quantity;
  const primaryBadge = getDetailBadge(artwork);

  // Handle Cart & Buy Now
  const handleAddToCart = () => {
    if (artwork.stock <= 0) return;
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
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (artwork.stock <= 0) return;
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
      quantity: 1,
    });
    router.push('/checkout');
  };

  // Related artworks
  const relatedArtworks = ARTWORKS.filter(
    (a) => a.id !== artwork.id && (a.artistId === artwork.artistId || a.category === artwork.category)
  ).slice(0, 4);

  // Filter reviews for product
  const reviews = SAMPLE_REVIEWS.filter((r) => r.productId === artwork.id);

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-neutral-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${getArtworkCategory(artwork)}`}
            className="hover:text-black transition-colors"
          >
            {getCategoryLabel(artwork.category)}
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">{artwork.name}</span>
        </nav>

        {/* ── MAIN PRODUCT SPLIT: LEFT GALLERY + RIGHT BUY BOX ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ── LEFT: PRODUCT IMAGE GALLERY ─────────────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Product Image Container */}
            <div className="relative aspect-[4/5] bg-white border border-neutral-200 overflow-hidden shadow-xs group">
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative w-full h-full bg-neutral-100 cursor-zoom-in"
              >
                <Image
                  src={currentImage}
                  alt={artwork.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Enlarge trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-neutral-800 hover:text-black hover:bg-white shadow-xs transition-colors"
                  aria-label="Enlarge image"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {artwork.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {artwork.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 relative bg-white border flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Visualizer Tools Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setRoomModalOpen(true)}
                className="flex-1 min-w-[180px] bg-white border border-neutral-300 hover:border-black py-3 px-4 text-xs font-sans font-semibold uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-colors"
              >
                <Maximize2 size={14} className="text-black" />
                <span>View In Room</span>
              </button>

              {artwork.category === 'sculptures' && (
                <button
                  onClick={() => setFigureViewerOpen(true)}
                  className="flex-1 min-w-[180px] bg-black text-white hover:bg-neutral-800 py-3 px-4 text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCw size={14} className="text-white" />
                  <span>360° Angle Viewer</span>
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: BUY BOX & COMMERCIAL DETAILS (STICKY RAIL) ─────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="type-label text-neutral-500">
                  {getCategoryLabel(artwork.category)}
                </span>
                <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider">
                  SKU: {artwork.catalogNumber}
                </span>
              </div>

              <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-black uppercase tracking-tight mb-2">
                {artwork.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 font-sans mb-3">
                {artwork.medium}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {primaryBadge && (
                  <span
                    className={`${primaryBadge.style} text-[9px] font-sans tracking-wider px-2.5 py-1 uppercase`}
                  >
                    {primaryBadge.text}
                  </span>
                )}
                <span
                  className={`text-[9px] font-sans font-bold tracking-wider px-2.5 py-1 uppercase ${
                    artwork.stock > 0
                      ? 'bg-neutral-100 border border-neutral-300 text-black'
                      : 'bg-neutral-200 border border-neutral-300 text-neutral-600'
                  }`}
                >
                  {artwork.stock > 0 ? 'In Stock • Ready to Dispatch' : 'SOLD OUT'}
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-5 bg-white border border-neutral-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="type-price text-2xl sm:text-3xl text-black">
                    {formatPrice(totalPrice)}
                  </span>
                  {artwork.originalPrice && artwork.originalPrice > artwork.price && (
                    <span className="font-sans text-xs sm:text-sm text-neutral-400 line-through">
                      {formatPrice((artwork.originalPrice + framePrice) * quantity)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-sans font-medium text-neutral-500 uppercase tracking-wider">
                  Inclusive of all taxes
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs font-sans text-neutral-600">
                <p className="flex items-center gap-2">
                  <Truck size={14} className="text-black" />
                  <span>Complimentary insured shipping across India</span>
                </p>
                <p className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-black" />
                  <span>7-Day Return &amp; Exchange Guarantee</span>
                </p>
              </div>
            </div>

            {/* Frame Selector */}
            {artwork.frameAvailable && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-sans font-bold tracking-wider text-black uppercase">
                    Select Framing Option
                  </label>
                  <Link
                    href="/size-guide"
                    className="text-[11px] font-sans text-black hover:underline"
                  >
                    Framing Guide
                  </Link>
                </div>

                <div className="space-y-1.5">
                  {STANDARD_FRAME_OPTIONS.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame)}
                      className={`w-full text-left p-3 border transition-all flex items-center justify-between text-xs font-sans ${
                        selectedFrame.id === frame.id
                          ? 'border-black bg-white shadow-xs'
                          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-black block">{frame.name}</span>
                        <span className="text-[11px] text-neutral-500">{frame.description}</span>
                      </div>
                      <span className="font-bold text-black ml-4 flex-shrink-0">
                        {frame.price === 0 ? 'Included' : `+${formatPrice(frame.price)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add To Bag + Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-neutral-300 bg-white h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || artwork.stock <= 0}
                    className="px-3 h-full hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-xs font-sans font-bold text-black min-w-8 text-center">
                    {artwork.stock <= 0 ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(artwork.stock, q + 1))}
                    disabled={quantity >= artwork.stock || artwork.stock <= 0}
                    className="px-3 h-full hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Add To Cart CTA - NEVER opens drawer, gives toast feedback */}
                {artwork.stock <= 0 ? (
                  <button
                    disabled
                    className="flex-1 h-12 px-6 font-sans text-xs font-bold uppercase tracking-widest bg-neutral-200 text-neutral-500 cursor-not-allowed flex items-center justify-center"
                  >
                    SOLD OUT
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="flex-1 h-12 px-6 font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs bg-black hover:bg-neutral-800 text-white"
                  >
                    {added ? (
                      <>
                        <Check size={16} />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(artwork)}
                  className="w-12 h-12 border border-neutral-300 bg-white hover:border-black flex items-center justify-center text-black transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? '#000000' : 'none'}
                    className={isInWishlist ? 'text-black' : 'text-neutral-500'}
                  />
                </button>
              </div>

              {/* Buy Now Direct Button: High-Contrast Secondary Border Treatment */}
              {artwork.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full border-2 border-black bg-white hover:bg-black hover:text-white text-black h-12 px-6 font-sans text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Authenticity Guarantee Box */}
            <div className="bg-white p-4 border border-neutral-200 flex items-start gap-3">
              <ShieldCheck size={20} className="text-black flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-sans font-bold text-black uppercase tracking-wider mb-0.5">
                  Authenticity Guaranteed
                </p>
                <p className="text-[11px] font-sans text-neutral-500 leading-relaxed">
                  Every product is crafted with premium materials and comes with a certificate of authenticity.
                </p>
              </div>
            </div>

            {/* ── 3 CLEAN RETAIL ACCORDIONS ─────────────────────────── */}
            <div className="pt-2 border-t border-neutral-200 divide-y border-neutral-200">
              {/* Accordion 1: Description */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-black"
                >
                  <span>Description &amp; Details</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openAccordions.description ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordions.description && (
                  <div className="pt-3 space-y-2.5 text-xs font-sans text-neutral-700 leading-relaxed">
                    <p>{artwork.description}</p>
                    {artwork.story && (
                      <div className="bg-neutral-100 p-3 border-l-2 border-black text-neutral-600">
                        {artwork.story}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Dimensions & Materials */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-black"
                >
                  <span>Dimensions &amp; Materials</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openAccordions.dimensions ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordions.dimensions && (
                  <div className="pt-3 space-y-2 text-xs font-sans text-neutral-600">
                    <p>
                      <strong className="text-black">Medium:</strong> {artwork.medium}
                    </p>
                    <p>
                      <strong className="text-black">Base / Substrate:</strong> {artwork.material}
                    </p>
                    <p>
                      <strong className="text-black">Exact Dimensions:</strong> {artwork.dimensions.width} ×{' '}
                      {artwork.dimensions.height} {artwork.dimensions.depth ? `× ${artwork.dimensions.depth}` : ''}{' '}
                      {artwork.dimensions.unit} ({Math.round(artwork.dimensions.width / 2.54)} ×{' '}
                      {Math.round(artwork.dimensions.height / 2.54)} in)
                    </p>
                    {artwork.weight && (
                      <p>
                        <strong className="text-black">Weight:</strong> {artwork.weight}
                      </p>
                    )}
                    <div className="mt-2 p-2.5 bg-neutral-100 text-[11px] text-neutral-700">
                      <strong>Display Recommendation:</strong> Ready to display with pre-installed mounting brackets. For living room focal walls, hang at eye-level (57–60 inches from floor).
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-black"
                >
                  <span>Shipping &amp; 7-Day Returns</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openAccordions.shipping ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="pt-3 space-y-2 text-xs font-sans text-neutral-600 leading-relaxed">
                    <p>
                      <strong className="text-black">Packaging:</strong> Reinforced wooden crate with moisture-barrier wrapping and corner guards.
                    </p>
                    <p>
                      <strong className="text-black">Transit:</strong> Complimentary insured delivery across India within 4–7 business days.
                    </p>
                    <p>
                      <strong className="text-black">7-Day In-Home Trial:</strong> Live with the piece in your home. If it doesn&apos;t fit your space, we organize return pickup with full refund.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER REVIEWS SECTION ─────────────────────────────────── */}
        <section className="mt-16 md:mt-24 pt-12 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                Verified Purchases
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-black tracking-tight uppercase">
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-sans">
              <div className="flex text-black">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#000000" />
                ))}
              </div>
              <span className="font-bold text-black">5.0 / 5.0</span>
              <span className="text-neutral-500">• Verified Purchases</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white border border-neutral-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-black">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="#000000" />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400">{rev.date}</span>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-black">
                    {rev.title}
                  </h4>

                  <p className="text-xs font-sans text-neutral-600 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-100">
                    <span className="font-semibold text-neutral-800">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-black flex items-center gap-1 font-medium">
                        <Check size={12} />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white border border-neutral-200 text-center max-w-md mx-auto">
              <p className="font-sans font-bold text-base text-black mb-1 uppercase">
                Be the first to bring this piece home
              </p>
              <p className="text-xs font-sans text-neutral-500">
                Arrives with Certificate of Authenticity and insured white-glove transit.
              </p>
            </div>
          )}
        </section>

        {/* ── RELATED PRODUCTS (4-col Desktop, 2-col Mobile) ──────────── */}
        {relatedArtworks.length > 0 && (
          <section className="mt-16 md:mt-24 pt-12 border-t border-neutral-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                  You May Also Like
                </span>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-black tracking-tight uppercase">
                  Related Products
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs font-sans font-bold text-black hover:text-neutral-700 uppercase tracking-wider"
              >
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedArtworks.map((item) => (
                <ArtworkCard key={item.id} artwork={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interactive Modals */}
      {roomModalOpen && (
        <RoomPreviewModal artwork={artwork} onClose={() => setRoomModalOpen(false)} />
      )}

      {figureViewerOpen && (
        <FigureViewer artwork={artwork} onClose={() => setFigureViewerOpen(false)} />
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative w-full max-w-4xl aspect-[4/5] max-h-[90vh]">
            <Image
              src={currentImage}
              alt={artwork.name}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
