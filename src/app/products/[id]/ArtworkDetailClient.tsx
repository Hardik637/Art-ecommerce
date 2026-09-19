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
} from 'lucide-react';

interface ArtworkDetailClientProps {
  artwork: ArtworkProduct;
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(artwork.id));

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(STANDARD_FRAME_OPTIONS[0]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [figureViewerOpen, setFigureViewerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Accordions state: 3 clear sections
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
  const totalPrice = artwork.price + framePrice;

  // Handle Cart & Buy Now
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
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
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
    router.push('/checkout');
  };

  // Related artworks
  const relatedArtworks = ARTWORKS.filter(
    (a) => a.id !== artwork.id && (a.artistId === artwork.artistId || a.category === artwork.category)
  ).slice(0, 3);

  // Filter reviews for product
  const reviews = SAMPLE_REVIEWS.filter((r) => r.productId === artwork.id);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-sans text-[#78716C] mb-8 uppercase tracking-widest">
        <Link href="/" className="hover:text-[#11100F] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${getArtworkCategory(artwork)}`}
          className="hover:text-[#11100F] transition-colors"
        >
          {getCategoryLabel(artwork.category)}
        </Link>
        <span>/</span>
        <span className="text-[#11100F] truncate max-w-xs">{artwork.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* ── LEFT: IMAGE GALLERY & INTERACTIVE VISUALIZERS ─────────── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Artwork Image with Matting */}
          <div className="relative aspect-[4/5] bg-[#E4DBCF] p-4 md:p-8 border border-[#D6CDBF] shadow-lg group">
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative w-full h-full bg-[#FAF7F2] overflow-hidden border border-[#D6CDBF] cursor-zoom-in"
            >
              <Image
                src={currentImage}
                alt={artwork.name}
                fill
                className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-700"
                priority
              />

              {/* Lightbox prompt overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-4 right-4 p-2 bg-[#F4EFE7]/80 backdrop-blur-sm rounded-full text-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] transition-colors shadow-sm"
                aria-label="Enlarge artwork"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Visualizer Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRoomModalOpen(true)}
              className="flex-1 min-w-[200px] bg-[#FAF7F2] border border-[#E4DBCF] hover:border-[#11100F] py-3 px-4 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#11100F] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Maximize2 size={14} className="text-[#B08A4A]" />
              <span>View In Room Preview</span>
            </button>

            {(artwork.category === 'sculptures' || artwork.category === 'figures') && (
              <button
                onClick={() => setFigureViewerOpen(true)}
                className="flex-1 min-w-[200px] bg-[#11100F] text-[#F4EFE7] hover:bg-[#481E25] py-3 px-4 text-xs font-sans font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <RotateCw size={14} className="text-[#B08A4A]" />
                <span>360° Multi-Angle Viewer</span>
              </button>
            )}
          </div>

          {/* Thumbnails Strip */}
          {artwork.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {artwork.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 relative bg-[#FAF7F2] border flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#11100F] ring-1 ring-[#11100F]'
                      : 'border-[#D6CDBF] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: CURATORIAL DOSSIER & ACQUISITION ACTIONS ───────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase">
                {getCategoryLabel(artwork.category)}
              </span>
              <span className="text-[11px] font-sans text-[#78716C] tracking-wider uppercase">
                {artwork.catalogNumber}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] leading-[1.1] mb-2">
              {artwork.name}
            </h1>

            <p className="text-xs md:text-sm text-[#78716C] font-sans mb-4">
              {artwork.medium}
            </p>

            {/* Prominent Dimensions Box for Home Decorators */}
            <div className="p-3.5 bg-[#E4DBCF]/60 border border-[#D6CDBF] flex items-center justify-between text-xs font-sans mb-6">
              <span className="text-[#78716C] font-medium">Artwork Dimensions:</span>
              <span className="font-semibold text-[#11100F]">
                {artwork.dimensions.width} × {artwork.dimensions.height}{' '}
                {artwork.dimensions.depth ? `× ${artwork.dimensions.depth}` : ''} {artwork.dimensions.unit}
                <span className="text-[#78716C] font-normal ml-1">
                  ({Math.round(artwork.dimensions.width / 2.54)} × {Math.round(artwork.dimensions.height / 2.54)} in)
                </span>
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {artwork.isOneOfOne && (
                <span className="bg-[#481E25] text-[#F4EFE7] text-[10px] font-sans font-semibold tracking-[0.2em] px-3 py-1 uppercase">
                  One of One (1/1)
                </span>
              )}
              {artwork.isLimitedEdition && !artwork.isOneOfOne && (
                <span className="bg-[#11100F] text-[#F4EFE7] text-[10px] font-sans font-semibold tracking-[0.2em] px-3 py-1 uppercase">
                  Limited Edition of {artwork.editionSize || 50}
                </span>
              )}
              <span className="bg-[#FAF7F2] border border-[#E4DBCF] text-[#11100F] text-[10px] font-sans font-medium tracking-wider px-2.5 py-1 uppercase">
                {artwork.stock > 0 ? 'In Stock • Dispatched within 48h' : 'Reserved / Sold'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-6 bg-[#FAF7F2] border border-[#E4DBCF] space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl md:text-4xl font-semibold text-[#11100F]">
                  {formatPrice(totalPrice)}
                </span>
                {artwork.originalPrice && (
                  <span className="font-sans text-sm text-[#A8A29E] line-through">
                    {formatPrice(artwork.originalPrice + framePrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans text-[#78716C] uppercase tracking-wider">
                All duties &amp; GST included
              </span>
            </div>

            <div className="pt-2 border-t border-[#E4DBCF] space-y-1.5 text-xs font-sans text-[#78716C]">
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-[#B08A4A]" />
                <span>Complimentary insured white-glove delivery across India</span>
              </p>
              <p className="flex items-center gap-2 text-[11px]">
                <RotateCcw size={13} className="text-[#B08A4A]" />
                <span>7-Day In-Home Trial with complimentary return pickup</span>
              </p>
            </div>
          </div>

          {/* Museum Framing Selector */}
          {artwork.frameAvailable && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-sans font-semibold tracking-[0.2em] text-[#11100F] uppercase">
                  Select Museum Framing
                </label>
                <Link
                  href="/size-guide"
                  className="text-[11px] font-sans text-[#B08A4A] hover:underline"
                >
                  Framing Guide
                </Link>
              </div>

              <div className="space-y-2">
                {STANDARD_FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`w-full text-left p-3.5 border transition-all flex items-center justify-between text-xs font-sans ${
                      selectedFrame.id === frame.id
                        ? 'border-[#11100F] bg-[#FAF7F2] shadow-sm'
                        : 'border-[#E4DBCF] bg-[#F4EFE7] hover:border-[#11100F]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#11100F] block">{frame.name}</span>
                      <span className="text-[11px] text-[#78716C]">{frame.description}</span>
                    </div>
                    <span className="font-semibold text-[#11100F] ml-4 flex-shrink-0">
                      {frame.price === 0 ? 'Included' : `+${formatPrice(frame.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={added || artwork.stock <= 0}
                className="flex-1 bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-4 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:bg-[#10B981]"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(artwork)}
                className="w-14 h-14 border border-[#E4DBCF] bg-[#FAF7F2] hover:border-[#11100F] flex items-center justify-center text-[#11100F] transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? '#481E25' : 'none'}
                  className={isInWishlist ? 'text-[#481E25]' : 'text-[#78716C]'}
                />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={artwork.stock <= 0}
              className="w-full bg-[#B08A4A] hover:bg-[#D4AF37] text-[#11100F] py-3.5 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Certificate of Authenticity Box */}
          <div className="bg-[#FAF7F2] p-4 border border-[#E4DBCF] flex items-start gap-3">
            <ShieldCheck size={22} className="text-[#B08A4A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-sans font-semibold text-[#11100F] uppercase tracking-wider mb-0.5">
                Authenticity &amp; Provenance Guaranteed
              </p>
              <p className="text-[11px] font-sans text-[#78716C] leading-relaxed">
                Includes an embossed Certificate of Authenticity individually numbered and signed by the artist.
              </p>
            </div>
          </div>

          {/* ── 3 STREAMLINED ACCORDIONS ──────────────────────────────── */}
          <div className="pt-4 border-t border-[#E4DBCF] divide-y divide-[#E4DBCF]">
            {/* 1. About the Piece */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#11100F]"
              >
                <span>About this Piece</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openAccordions.description ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordions.description && (
                <div className="pt-3 space-y-3 text-xs font-sans text-[#292622] leading-relaxed">
                  <p>{artwork.description}</p>
                  {artwork.story && (
                    <div className="bg-[#FAF7F2] p-3.5 border-l-2 border-[#B08A4A] text-[#78716C] italic font-serif text-sm">
                      &ldquo;{artwork.story}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Dimensions, Materials & Room Placement */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('dimensions')}
                className="w-full flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#11100F]"
              >
                <span>Dimensions, Materials &amp; Placement</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openAccordions.dimensions ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordions.dimensions && (
                <div className="pt-3 space-y-2.5 text-xs font-sans text-[#78716C]">
                  <p>
                    <strong className="text-[#11100F]">Medium:</strong> {artwork.medium}
                  </p>
                  <p>
                    <strong className="text-[#11100F]">Substrate / Base:</strong> {artwork.material}
                  </p>
                  <p>
                    <strong className="text-[#11100F]">Exact Dimensions:</strong> {artwork.dimensions.width} ×{' '}
                    {artwork.dimensions.height} {artwork.dimensions.depth ? `× ${artwork.dimensions.depth}` : ''}{' '}
                    {artwork.dimensions.unit} ({Math.round(artwork.dimensions.width / 2.54)} ×{' '}
                    {Math.round(artwork.dimensions.height / 2.54)} inches)
                  </p>
                  {artwork.weight && (
                    <p>
                      <strong className="text-[#11100F]">Weight:</strong> {artwork.weight}
                    </p>
                  )}
                  <p className="pt-2 text-[11px] text-[#292622] bg-[#FAF7F2] p-3 border border-[#E4DBCF]">
                    <strong>Hanging / Display Advice:</strong> Ready to hang with heavy-duty recessed hanging wire. For living rooms, center the artwork at eye level (approx. 57–60 inches from floor to canvas center).
                  </p>
                </div>
              )}
            </div>

            {/* 3. Shipping, Packaging & Authenticity */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#11100F]"
              >
                <span>Shipping, Packaging &amp; Free Returns</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openAccordions.shipping ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordions.shipping && (
                <div className="pt-3 space-y-2.5 text-xs font-sans text-[#78716C] leading-relaxed">
                  <p>
                    <strong className="text-[#11100F]">Packaging:</strong> Custom shock-absorbing wooden crate with acid-free moisture protection and corner guards.
                  </p>
                  <p>
                    <strong className="text-[#11100F]">Transit:</strong> Complimentary 100% insured white-glove courier across India (4–7 business days).
                  </p>
                  <p>
                    <strong className="text-[#11100F]">7-Day In-Home Trial:</strong> Live with the artwork in your home. If the piece doesn&apos;t fit your space, we arrange an insured return pickup with full refund.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── COLLECTOR REVIEWS SECTION ───────────────────────────────── */}
      <section className="mt-20 pt-16 border-t border-[#E4DBCF]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
              Verified Provenance
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#11100F]">
              Collector Reviews
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans">
            <div className="flex text-[#B08A4A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#B08A4A" />
              ))}
            </div>
            <span className="font-semibold text-[#11100F]">5.0 Out of 5</span>
            <span className="text-[#78716C]">• 100% Verified Collector Acquisitions</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-[#FAF7F2] border border-[#E4DBCF] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-[#B08A4A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#B08A4A" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#78716C]">{rev.date}</span>
                </div>

                <h4 className="font-serif text-base font-normal text-[#11100F]">
                  {rev.title}
                </h4>

                <p className="text-xs font-sans text-[#78716C] leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#78716C]">
                  <span className="font-medium text-[#11100F]">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[#B08A4A] flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Verified Collector</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#FAF7F2] border border-[#E4DBCF] text-center max-w-lg mx-auto">
            <p className="font-serif text-lg text-[#11100F] mb-1">
              Be the first to bring this piece home
            </p>
            <p className="text-xs font-sans text-[#78716C]">
              Every acquisition is accompanied by private concierge delivery and numbered Certificate of Authenticity.
            </p>
          </div>
        )}
      </section>

      {/* ── RELATED PIECES / COMPLETE THE ROOM ─────────────── */}
      {relatedArtworks.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[#E4DBCF]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
                Room Harmony
              </span>
              <h3 className="font-serif text-3xl font-normal text-[#11100F]">
                Complementary Pieces
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs font-sans text-[#11100F] hover:text-[#B08A4A] uppercase tracking-wider"
            >
              View Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArtworks.map((item) => (
              <ArtworkCard key={item.id} artwork={item} />
            ))}
          </div>
        </section>
      )}

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
          className="fixed inset-0 z-50 bg-[#11100F]/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative w-full max-w-5xl aspect-[4/5] max-h-[90vh]">
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
