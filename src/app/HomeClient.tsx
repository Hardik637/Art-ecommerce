'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBestSellers, getNewArrivals } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import ProductQuickView from '@/components/ProductQuickView';
import RecentlyViewed from '@/components/RecentlyViewed';
import FindYourPieceModal from '@/components/FindYourPieceModal';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Compass } from 'lucide-react';

const STYLES = [
  { label: 'Minimal', query: 'minimal' },
  { label: 'Abstract', query: 'abstract' },
  { label: 'Organic', query: 'organic' },
  { label: 'Architectural', query: 'architectural' },
  { label: 'Sculptural', query: 'sculpture' },
  { label: 'Statement', query: 'statement' },
];

export default function HomeClient() {
  const newArrivals = useMemo(() => getNewArrivals().slice(0, 4), []);
  const bestSellers = useMemo(() => getBestSellers().slice(0, 4), []);
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);
  const [findPieceOpen, setFindPieceOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen text-black">
      {/* ── 1. FULL-SCREEN CAMPAIGN HERO (100svh) ────────────────────────── */}
      <section
        className="relative w-full bg-black overflow-hidden flex flex-col items-center justify-center min-h-[calc(100svh-86px)] md:min-h-[calc(100svh-92px)] select-none border-b border-neutral-900"
        aria-label="Campaign Hero"
      >
        {/* Background Lifestyle Campaign Imagery */}
        <div className="absolute inset-0 z-10">
          <div className="relative w-full h-full">
            {/* Desktop Landscape Artwork Campaign Photography */}
            <Image
              src="/hero-campaign.jpg"
              alt="Atelier Modern Art & Architectural Home Décor"
              fill
              sizes="100vw"
              priority
              className="hidden sm:block object-cover object-center brightness-[0.80] contrast-[1.05]"
            />
            {/* Mobile Portrait Optimized Artwork Campaign Photography */}
            <Image
              src="/hero-campaign-mobile.jpg"
              alt="Atelier Modern Art & Architectural Home Décor"
              fill
              sizes="100vw"
              priority
              className="block sm:hidden object-cover object-center brightness-[0.78] contrast-[1.05]"
            />
            {/* Natural Contrast Gradient Overlay for Flawless Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 z-15" />
          </div>
        </div>

        {/* Hero Content Overlay — Centered with Commanding Presence */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl flex flex-col items-center">
            {/* Small Eyebrow Badge */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.16em] text-white uppercase bg-black/60 backdrop-blur-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>New Season Drop • Modern Living</span>
              </span>
            </div>

            {/* Main Campaign Title — Heavy Bold & Thicker Display Typography */}
            <h1 className="font-display font-black text-[clamp(2.85rem,14vw,4.75rem)] sm:text-[clamp(4.25rem,8.5vw,8.5rem)] text-white text-center leading-[0.88] tracking-tight uppercase mb-4 sm:mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] [-webkit-text-stroke:1.5px_currentColor]">
              Art That Defines <br className="hidden sm:block" />
              The Room
            </h1>

            {/* Short Supporting Line — Space Grotesk 400 clean readability */}
            <p className="text-white/90 font-sans font-normal text-xs sm:text-sm md:text-base tracking-[0.01em] max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Original wall art, handcrafted sculptures, and architectural pieces curated for contemporary interiors.
            </p>

            {/* High-Contrast Hero CTA Button — Space Grotesk 700 uppercase tracking-[0.06em] */}
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-neutral-200 font-sans font-bold text-xs sm:text-sm px-8 sm:px-10 py-3.5 sm:py-4 uppercase tracking-[0.06em] transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            >
              <span>Shop Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. NEW ARRIVALS (Product-First E-Commerce Section) ──────────── */}
      <section className="py-12 sm:py-16 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="flex items-end justify-between mb-6 sm:mb-8 md:mb-10">
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-500 block mb-1">
              Fresh From The Studio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight leading-none">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?filter=new"
            className="font-sans font-bold text-xs uppercase tracking-[0.06em] text-black hover:text-neutral-600 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 4-col desktop, 2-col mobile with ample breathing room */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {newArrivals.map((art, idx) => (
            <ScrollReveal key={art.id} delay={idx * 60}>
              <ArtworkCard
                artwork={art}
                onQuickView={setQuickViewArtwork}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 3. BESTSELLERS (Product-First E-Commerce Section) ───────────── */}
      <section className="py-12 sm:py-16 md:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="flex items-end justify-between mb-6 sm:mb-8 md:mb-10">
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-500 block mb-1">
              Top Ranked Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight leading-none">
              Bestsellers
            </h2>
          </div>
          <Link
            href="/products?filter=bestseller"
            className="font-sans font-bold text-xs uppercase tracking-[0.06em] text-black hover:text-neutral-600 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 4-col desktop, 2-col mobile with ample breathing room */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {bestSellers.map((art, idx) => (
            <ScrollReveal key={art.id} delay={idx * 60}>
              <ArtworkCard
                artwork={art}
                onQuickView={setQuickViewArtwork}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 4. SHOP BY STYLE (Subtle Curated Discovery) ─────────────────── */}
      <section className="py-12 sm:py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-500 block mb-1">
            Curated Aesthetics
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-black uppercase tracking-tight leading-none mb-2">
            Shop By Style
          </h2>
          <p className="text-xs text-neutral-600 font-sans">
            Discover artwork tailored to your interior mood and architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {STYLES.map((style) => (
            <Link
              key={style.label}
              href={`/search?q=${encodeURIComponent(style.query)}`}
              className="group py-3 px-4 text-center border border-neutral-200 hover:border-black bg-white hover:bg-black transition-colors"
            >
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-black group-hover:text-white transition-colors block">
                {style.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setFindPieceOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 hover:border-black bg-white hover:bg-neutral-50 text-xs font-sans font-bold uppercase tracking-widest text-black transition-colors"
          >
            <Compass size={14} />
            <span>Need Guidance? Take the 30-Second Art Finder</span>
          </button>
        </div>
      </section>

      {/* ── 5. RECENTLY VIEWED (Subtle Browsing History) ───────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewed maxItems={4} />
      </div>

      {/* ── 6. SUBTLE TRUST & SERVICE STRIP ────────────────────────────── */}
      <section className="py-8 sm:py-10 bg-neutral-50 border-t sm:border-t-0 border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Truck size={18} className="text-black flex-shrink-0" />
              <div>
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-black block">
                  Free Shipping Above ₹999
                </span>
                <span className="font-sans text-[11px] text-neutral-500">
                  Insured pan-India white-glove delivery
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <RotateCcw size={18} className="text-black flex-shrink-0" />
              <div>
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-black block">
                  7-Day In-Home Trial
                </span>
                <span className="font-sans text-[11px] text-neutral-500">
                  Easy doorstep returns if not 100% satisfied
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <ShieldCheck size={18} className="text-black flex-shrink-0" />
              <div>
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-black block">
                  Archival Quality Guaranteed
                </span>
                <span className="font-sans text-[11px] text-neutral-500">
                  Certificate of authenticity included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewArtwork && (
        <ProductQuickView
          artwork={quickViewArtwork}
          onClose={() => setQuickViewArtwork(null)}
        />
      )}

      {/* Guided Art Finder Modal */}
      <FindYourPieceModal
        isOpen={findPieceOpen}
        onClose={() => setFindPieceOpen(false)}
      />
    </div>
  );
}
