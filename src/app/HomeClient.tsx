'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ARTWORKS,
  MAJOR_CATEGORIES,
  getBestSellers,
  getNewArrivals,
} from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import ProductQuickView from '@/components/ProductQuickView';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function HomeClient() {
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);

  // Curated artwork collections for the homepage
  // Standout curated selection (1 from each category + 1 focal painting)
  const curatedSelection = [
    ARTWORKS.find((a) => a.id === 'art-01') || ARTWORKS[0], // Monsoon Over the Ghats (Wall Art)
    ARTWORKS.find((a) => a.id === 'art-19') || ARTWORKS[18], // Dynamic Dancer (Sculpture)
    ARTWORKS.find((a) => a.id === 'art-37') || ARTWORKS[36], // Astrolabe Paperweight (Decorative Piece)
    ARTWORKS.find((a) => a.id === 'art-03') || ARTWORKS[2], // Royal Durbar Reverie (Wall Art)
  ];

  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <div className="bg-[#F4EFE7] min-h-screen text-[#11100F]">
      {/* ── 1. CINEMATIC HERO BANNER ─────────────────────────────────── */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-between border-b border-[#E4DBCF] overflow-hidden">
        <div className="absolute inset-0 bg-[#F4EFE7] z-0 paper-texture opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
          {/* Left: Headline, Value Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E4DBCF]/80 border border-[#D6CDBF] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#B08A4A] animate-pulse" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#11100F]">
                  Curated Art for Living Spaces
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#11100F] leading-[1.05] tracking-tight">
                Art for Beautiful Spaces. <br />
                <span className="italic font-light text-[#481E25]">Curated for Considered Homes.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-sm md:text-base font-sans text-[#78716C] leading-relaxed max-w-lg"
            >
              Handcrafted original wall art, lost-wax cast bronze sculptures, and artisanal decorative objects selected specifically to elevate contemporary home interiors with depth and quiet contemplation.
            </motion.p>

            {/* Direct E-Commerce CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/products"
                className="bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] text-xs font-sans font-semibold uppercase tracking-[0.2em] px-8 py-4 flex items-center gap-3 transition-colors shadow-lg group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/wall-art"
                className="border border-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] text-[#11100F] text-xs font-sans font-semibold uppercase tracking-[0.2em] px-8 py-4 transition-colors"
              >
                Shop Wall Art
              </Link>
            </motion.div>

            {/* Reassurance Tiers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex items-center gap-6 md:gap-8 pt-4 border-t border-[#E4DBCF] text-xs font-sans text-[#78716C]"
            >
              <div>
                <span className="font-serif text-lg font-medium text-[#11100F] block">40</span>
                <span>Original Works</span>
              </div>
              <div className="w-px h-8 bg-[#E4DBCF]" />
              <div>
                <span className="font-serif text-lg font-medium text-[#11100F] block">100%</span>
                <span>Signed &amp; Certified</span>
              </div>
              <div className="w-px h-8 bg-[#E4DBCF]" />
              <div>
                <span className="font-serif text-lg font-medium text-[#11100F] block">Free</span>
                <span>White-Glove Transit</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Featured Hero Art Piece */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-lg aspect-[4/5] bg-[#E4DBCF] p-4 border border-[#D6CDBF] shadow-2xl group"
            >
              <div className="relative w-full h-full bg-[#FAF7F2] overflow-hidden border border-[#D6CDBF]">
                <Image
                  src="/artworks/painting-monsoon-abstract.svg"
                  alt="Monsoon Over the Ghats"
                  fill
                  className="object-contain p-3 group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />

                {/* Artwork Information Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#11100F]/90 backdrop-blur-md p-3.5 border border-[#B08A4A]/30 flex items-center justify-between text-[#F4EFE7]">
                  <div>
                    <p className="text-[10px] font-sans font-semibold tracking-widest text-[#B08A4A] uppercase">
                      Featured Work • Wall Art
                    </p>
                    <p className="font-serif text-sm font-normal truncate">
                      Monsoon Over the Ghats
                    </p>
                  </div>
                  <Link
                    href="/products/monsoon-over-the-ghats"
                    className="p-1.5 bg-[#B08A4A] text-[#11100F] hover:bg-[#D4AF37] transition-colors"
                    aria-label="View artwork details"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED / CURATED ART FOR THE HOME ─────────────────────── */}
      <section className="py-20 md:py-24 border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
                Curator&apos;s Selection
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight">
                Curated for the Home
              </h2>
            </div>
            <p className="text-xs md:text-sm font-sans text-[#78716C] max-w-md leading-relaxed">
              Standout works selected to anchor living rooms, entryway plinths, and dining spaces. Each piece arrives signed, numbered, and ready to install.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedSelection.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                onQuickView={(a) => setQuickViewArtwork(a)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SHOP BY CATEGORY (WALL ART, SCULPTURES, DECORATIVE PIECES) ── */}
      <section className="py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
                Essential Pillars
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight">
                Shop by Category
              </h2>
            </div>
            <p className="text-xs md:text-sm font-sans text-[#78716C] max-w-md leading-relaxed">
              Three distinct disciplines curated for refined spaces. Discover pieces organized by form and placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {MAJOR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative bg-[#F4EFE7] border border-[#E4DBCF] hover:border-[#11100F] transition-all duration-300 flex flex-col overflow-hidden shadow-sm"
              >
                <div className="relative w-full aspect-[4/3] bg-[#E4DBCF] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#11100F]/10 group-hover:bg-[#11100F]/0 transition-colors pointer-events-none" />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-serif text-2xl font-normal text-[#11100F] group-hover:text-[#481E25] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-sans text-[#78716C]">
                        {cat.itemCount} pieces
                      </span>
                    </div>
                    <p className="text-xs text-[#B08A4A] font-sans uppercase tracking-wider mb-2">
                      {cat.subtitle}
                    </p>
                    <p className="text-xs text-[#78716C] font-sans leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E4DBCF] flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] group-hover:text-[#481E25] transition-colors">
                    <span>Explore {cat.name}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BEST SELLERS FOR THE HOME ─────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
                Collector Favorites
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight">
                Best Sellers for the Home
              </h2>
            </div>
            <Link
              href="/products?filter=bestseller"
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:text-[#B08A4A] flex items-center gap-1 transition-colors"
            >
              <span>View All Best Sellers →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                onQuickView={(a) => setQuickViewArtwork(a)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ART FOR YOUR HOME / HOME DÉCOR EDITORIAL VIGNETTES ────────── */}
      <section className="py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
              Art &amp; Living
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight mb-4">
              Art That Transforms a Room
            </h2>
            <p className="text-xs md:text-sm font-sans text-[#78716C] leading-relaxed">
              An original artwork changes how daylight fills a room and how a space feels at dusk. Every creation is conceived to companion the quiet rhythm of considered spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vignette 1: Living & Dining Walls */}
            <div className="bg-[#F4EFE7] border border-[#E4DBCF] p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase block mb-3">
                  01 / Walls &amp; Focal Points
                </span>
                <h3 className="font-serif text-2xl text-[#11100F] mb-3">
                  Focal Living &amp; Dining Walls
                </h3>
                <p className="text-xs font-sans text-[#78716C] leading-relaxed mb-6">
                  Monumental textured abstractions, mineral indigo washes, and hand-applied 22K gold foil that establish warmth, architectural scale, and effortless conversation in central living spaces.
                </p>
              </div>
              <Link
                href="/wall-art"
                className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:text-[#B08A4A] flex items-center justify-between pt-4 border-t border-[#E4DBCF] transition-colors"
              >
                <span>Explore Wall Pieces</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Vignette 2: Sculptural Consoles & Plinths */}
            <div className="bg-[#F4EFE7] border border-[#E4DBCF] p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase block mb-3">
                  02 / Surfaces &amp; Pedestals
                </span>
                <h3 className="font-serif text-2xl text-[#11100F] mb-3">
                  Sculptural Consoles &amp; Plinths
                </h3>
                <p className="text-xs font-sans text-[#78716C] leading-relaxed mb-6">
                  Fluid lost-wax bronze and hand-chiseled stone forms that introduce three-dimensional weight, balance, and tactile dynamism to entryways, mantels, and credenzas.
                </p>
              </div>
              <Link
                href="/sculptures"
                className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:text-[#B08A4A] flex items-center justify-between pt-4 border-t border-[#E4DBCF] transition-colors"
              >
                <span>Explore Sculptures</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Vignette 3: Desks, Shelves & Intimate Corners */}
            <div className="bg-[#F4EFE7] border border-[#E4DBCF] p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase block mb-3">
                  03 / Studies &amp; Accents
                </span>
                <h3 className="font-serif text-2xl text-[#11100F] mb-3">
                  Desks, Shelves &amp; Corners
                </h3>
                <p className="text-xs font-sans text-[#78716C] leading-relaxed mb-6">
                  Artisanal smoke-fired vessels, precision kinetic brass desk balances, and limited-edition design artifacts that invite touch, reflection, and quiet everyday discovery.
                </p>
              </div>
              <Link
                href="/decorative-pieces"
                className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:text-[#B08A4A] flex items-center justify-between pt-4 border-t border-[#E4DBCF] transition-colors"
              >
                <span>Explore Decorative Pieces</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. NEW RELEASES FRESH FROM THE STUDIO ────────────────────── */}
      <section className="py-20 md:py-24 border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
                Fresh Acquisitions
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight">
                New Studio Releases
              </h2>
            </div>
            <Link
              href="/products?filter=new"
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:text-[#B08A4A] flex items-center gap-1 transition-colors"
            >
              <span>View All New Releases →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                onQuickView={(a) => setQuickViewArtwork(a)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHY ATELIER (Trust & Collector Guarantees) ─────────────── */}
      <section className="py-20 bg-[#1C1A18] text-[#F4EFE7] border-b border-[#292622]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
              Our Standard
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#F4EFE7] tracking-tight">
              Why Decorate with Atelier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 bg-[#25221F] border border-[#3A3530]">
              <Sparkles className="text-[#B08A4A]" size={28} />
              <h3 className="font-serif text-lg font-normal text-[#F4EFE7]">
                Museum-Grade Quality
              </h3>
              <p className="text-xs font-sans text-[#A8A29E] leading-relaxed">
                Handcrafted using heavyweight Belgian linen, pure 24K gold leaf, and solid lost-wax bronze meant to endure for generations.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#25221F] border border-[#3A3530]">
              <ShieldCheck className="text-[#B08A4A]" size={28} />
              <h3 className="font-serif text-lg font-normal text-[#F4EFE7]">
                Signed Authenticity
              </h3>
              <p className="text-xs font-sans text-[#A8A29E] leading-relaxed">
                Every piece includes an individually numbered, wax-embossed Certificate of Authenticity signed by the artist.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#25221F] border border-[#3A3530]">
              <Truck className="text-[#B08A4A]" size={28} />
              <h3 className="font-serif text-lg font-normal text-[#F4EFE7]">
                Insured White-Glove Transit
              </h3>
              <p className="text-xs font-sans text-[#A8A29E] leading-relaxed">
                Dispatched in reinforced shock-absorbing wooden crates with 100% transit insurance pan-India directly to your door.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#25221F] border border-[#3A3530]">
              <RotateCcw className="text-[#B08A4A]" size={28} />
              <h3 className="font-serif text-lg font-normal text-[#F4EFE7]">
                7-Day In-Home Approval
              </h3>
              <p className="text-xs font-sans text-[#A8A29E] leading-relaxed">
                Live with the artwork in your home. If the scale, lighting, or tone doesn&apos;t fit your space, return or exchange with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickView
        artwork={quickViewArtwork}
        onClose={() => setQuickViewArtwork(null)}
      />
    </div>
  );
}
