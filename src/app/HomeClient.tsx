'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ARTWORKS,
  MAJOR_CATEGORIES,
  getBestSellers,
  getNewArrivals,
  getArtworkCategory,
} from '@/lib/artCatalog';
import ArtworkCard from '@/components/ArtworkCard';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'wall-art' | 'sculptures' | 'decorative-pieces'>('all');

  const newArrivals = useMemo(() => getNewArrivals().slice(0, 4), []);
  const bestSellers = useMemo(() => getBestSellers().slice(0, 4), []);

  const discoveryProducts = useMemo(() => {
    if (activeTab === 'all') return ARTWORKS.slice(0, 8);
    return ARTWORKS.filter((a) => getArtworkCategory(a) === activeTab).slice(0, 8);
  }, [activeTab]);

  return (
    <div className="bg-white min-h-screen text-black">
      {/* ── 1. RETAIL HERO CAMPAIGN BANNER ────────────────────────────── */}
      <section className="relative w-full border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Bold Commercial Headlines & High-Contrast CTAs */}
          <div className="lg:col-span-6 space-y-5 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-black" />
              <span className="type-label text-neutral-800">
                1000+ Curated Works • Modern Art &amp; Living
              </span>
            </div>

            <h1 className="type-hero text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] text-black">
              Exceptional Art Pieces, Priced Just Right
            </h1>

            <p className="text-sm md:text-base font-sans text-neutral-600 leading-relaxed max-w-lg">
              Curated wall art, sculptures and decorative pieces designed for modern spaces. Pan-India insured delivery with 7-day in-home trial.
            </p>

            {/* Direct Commercial E-Commerce CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/products"
                className="type-btn bg-black hover:bg-neutral-800 text-white text-xs px-8 py-4 transition-colors shadow-sm flex items-center gap-2.5"
              >
                <span>Shop Collection</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/wall-art"
                className="type-btn bg-white hover:bg-neutral-100 border border-black text-black text-xs px-8 py-4 transition-colors"
              >
                Explore Wall Art
              </Link>
            </div>

            {/* Commercial Trust Metrics */}
            <div className="flex items-center gap-6 pt-4 border-t border-neutral-200 text-xs font-sans text-neutral-600">
              <div>
                <span className="font-extrabold text-black block text-base">40+</span>
                <span>Curated Products</span>
              </div>
              <div className="w-px h-6 bg-neutral-300" />
              <div>
                <span className="font-extrabold text-black block text-base">100%</span>
                <span>Authentic Works</span>
              </div>
              <div className="w-px h-6 bg-neutral-300" />
              <div>
                <span className="font-extrabold text-black block text-base">Free</span>
                <span>Transit Above ₹999</span>
              </div>
            </div>
          </div>

          {/* Right: Featured Lifestyle Hero Product */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/5] bg-white border border-neutral-200 shadow-lg p-3 group overflow-hidden">
              <div className="relative w-full h-full bg-neutral-100 overflow-hidden">
                <Image
                  src="/artworks/painting-monsoon-abstract.svg"
                  alt="Curated Artwork in Interior"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Clean Product Label Tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 border border-neutral-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="type-label text-neutral-500 block">
                      Featured Work
                    </span>
                    <span className="type-product-title text-sm text-black truncate block mt-0.5">
                      Monsoon Over the Ghats
                    </span>
                  </div>
                  <Link
                    href="/products/monsoon-over-the-ghats"
                    className="type-btn bg-black text-white hover:bg-neutral-800 px-3 py-1.5 text-[10px] transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SHOP BY CATEGORY (Immediately below Hero) ─────────────── */}
      <section className="py-14 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-2">
          <div>
            <span className="type-label text-neutral-500 block mb-1">
              Curated Collections
            </span>
            <h2 className="type-heading text-2xl sm:text-3xl md:text-4xl text-black">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs md:text-sm font-sans text-neutral-500 max-w-md">
            Discover pieces classified by form, architectural placement, and interior purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MAJOR_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative bg-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-md"
            >
              {/* Category Product Image */}
              <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Category Card Details */}
              <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-sans font-bold text-lg text-black group-hover:text-black transition-colors uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-sans text-neutral-500">
                      {cat.itemCount} items
                    </span>
                  </div>
                  <p className="text-xs font-sans text-neutral-500 line-clamp-2 mb-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-black group-hover:text-black transition-colors">
                  <span>Shop {cat.name}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. NEW ARRIVALS (4 per row desktop, 2 per row mobile) ─────── */}
      <section className="py-14 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 border-b border-neutral-200">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <span className="type-label text-neutral-500 block mb-1">
              Fresh From The Studio
            </span>
            <h2 className="type-heading text-2xl sm:text-3xl md:text-4xl text-black">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?filter=new"
            className="type-btn text-xs text-neutral-800 hover:text-black underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      </section>

      {/* ── 4. BESTSELLERS (4 per row desktop, 2 per row mobile) ──────── */}
      <section className="py-14 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 border-b border-neutral-200">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <span className="type-label text-neutral-500 block mb-1">
              Curated Favorites
            </span>
            <h2 className="type-heading text-2xl sm:text-3xl md:text-4xl text-black">
              Popular Items
            </h2>
          </div>
          <Link
            href="/products?filter=bestseller"
            className="type-btn text-xs text-neutral-800 hover:text-black underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      </section>

      {/* ── 5. FEATURED COLLECTION: CURATED FOR YOUR HOME ─────────────── */}
      <section className="py-14 md:py-20 bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Visual banner */}
            <div className="lg:col-span-6 relative aspect-[16/10] bg-neutral-900 overflow-hidden border border-neutral-800">
              <Image
                src="/artworks/sculpture-dynamic-dancer.svg"
                alt="Curated for Modern Interiors"
                fill
                className="object-contain p-6"
              />
              <div className="absolute top-4 left-4 bg-black/90 px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-white border border-neutral-800">
                Living Room &amp; Foyer Placement
              </div>
            </div>

            {/* Collection Pitch */}
            <div className="lg:col-span-6 space-y-4 md:space-y-5">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase block">
                Home Décor Curation
              </span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase leading-tight text-white">
                Curated For Your Home
              </h2>
              <p className="text-sm md:text-base font-sans text-neutral-300 leading-relaxed">
                Thoughtfully proportioned pieces to anchor living room focal walls, entryway consoles, and quiet study alcoves. Arrives securely crated with all hardware included for immediate installation.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-200 text-xs font-sans font-bold uppercase tracking-widest px-8 py-4 transition-colors"
                >
                  <span>Shop Collection</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. SHOP ALL / PRODUCT DISCOVERY (Interactive Tabbed Grid) ─── */}
      <section className="py-14 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="type-label text-neutral-500 block mb-1">
              Explore The Catalog
            </span>
            <h2 className="type-heading text-2xl sm:text-3xl md:text-4xl text-black">
              Explore Collection
            </h2>
          </div>

          {/* Clean Retail Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Works' },
              { id: 'wall-art', label: 'Wall Art' },
              { id: 'sculptures', label: 'Sculptures' },
              { id: 'decorative-pieces', label: 'Decorative Pieces' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 sm:px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic 8-item discovery grid: 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {discoveryProducts.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-sans font-bold uppercase tracking-widest px-8 py-3.5 transition-colors"
          >
            <span>View All Products In Catalog</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── 7. COMPACT BRAND STORY & TRUST GUARANTEES ─────────────────── */}
      <section className="py-14 md:py-16 bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
              The Atelier Standard
            </span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-black tracking-tight uppercase mb-3">
              Art That Belongs In Your Space
            </h2>
            <p className="text-xs sm:text-sm font-sans text-neutral-600 leading-relaxed">
              Thoughtfully selected pieces designed to bring character, texture and personality to modern interiors. Handcrafted with museum archival materials.
            </p>
            <div className="mt-4">
              <Link
                href="/about"
                className="text-xs font-sans font-bold uppercase tracking-wider text-black hover:text-neutral-700 underline underline-offset-4"
              >
                About Atelier →
              </Link>
            </div>
          </div>

          {/* 3 Concise Trust Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100">
            <div className="flex items-start gap-3.5 p-4 bg-neutral-50 border border-neutral-200">
              <ShieldCheck className="text-black flex-shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-sans font-bold text-xs sm:text-sm text-black uppercase mb-1">
                  Signed Authenticity
                </h3>
                <p className="text-xs font-sans text-neutral-500 leading-relaxed">
                  Every work is signed, numbered, and accompanied by a verified Certificate of Authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 bg-neutral-50 border border-neutral-200">
              <Truck className="text-black flex-shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-sans font-bold text-xs sm:text-sm text-black uppercase mb-1">
                  White-Glove Insured Transit
                </h3>
                <p className="text-xs font-sans text-neutral-500 leading-relaxed">
                  Delivered pan-India in custom wooden crates with full transit insurance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 bg-neutral-50 border border-neutral-200">
              <RotateCcw className="text-black flex-shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-sans font-bold text-xs sm:text-sm text-black uppercase mb-1">
                  7-Day In-Home Trial
                </h3>
                <p className="text-xs font-sans text-neutral-500 leading-relaxed">
                  Experience the artwork in your home. Easy returns and exchanges if it doesn&apos;t fit your space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
