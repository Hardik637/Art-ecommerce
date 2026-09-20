'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#F4EFE7] border-b border-[#E4DBCF] shadow-2xl z-40 transition-all duration-300"
    >
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid grid-cols-5 gap-8 border-b border-[#E4DBCF] pb-10">
          {/* Column 1: WALL ART */}
          <div>
            <h3 className="font-sans text-xs font-bold text-[#11100F] uppercase tracking-wider mb-4 pb-2 border-b border-[#E4DBCF]">
              Wall Art
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-[#78716C]">
              <li>
                <Link
                  href="/wall-art"
                  onClick={onClose}
                  className="hover:text-[#481E25] font-medium text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  All Wall Art
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=hand-painted"
                  onClick={onClose}
                  className="hover:text-[#481E25] font-medium text-[#11100F] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Hand-Painted Originals</span>
                  <span className="text-[9px] bg-[#481E25] text-[#F4EFE7] px-1.5 py-0.2 rounded-xs">1/1</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=abstract"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Abstract
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=contemporary"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Contemporary
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=portraits"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Portraits &amp; Figurative
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=landscapes"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Landscapes &amp; Horizons
                </Link>
              </li>
              <li>
                <Link
                  href="/products?filter=limited-editions"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Numbered Limited Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: SCULPTURES & DECORATIVE PIECES */}
          <div>
            <h3 className="font-sans text-xs font-bold text-[#11100F] uppercase tracking-wider mb-4 pb-2 border-b border-[#E4DBCF]">
              Sculptures &amp; Decor
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-[#78716C]">
              <li>
                <Link
                  href="/sculptures"
                  onClick={onClose}
                  className="hover:text-[#481E25] font-medium text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  All Sculptures
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=bronze"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Lost-Wax Cast Bronze
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=collectible-figures"
                  onClick={onClose}
                  className="hover:text-[#B08A4A] font-medium text-[#11100F] hover:translate-x-1 inline-flex items-center gap-1 transition-all"
                >
                  <span>Collectible Art Figures</span>
                  <Sparkles size={11} className="text-[#B08A4A]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/decorative-pieces"
                  onClick={onClose}
                  className="hover:text-[#481E25] font-medium text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  All Decorative Pieces
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=desk-objects"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Kinetic Desk Balances
                </Link>
              </li>
              <li>
                <Link
                  href="/products?subcategory=decorative-objects"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Decorative Vessels &amp; Accents
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: DISCOVER & CURATIONS */}
          <div>
            <h3 className="font-sans text-xs font-bold text-[#11100F] uppercase tracking-wider mb-4 pb-2 border-b border-[#E4DBCF]">
              Discover
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-[#78716C]">
              <li>
                <Link
                  href="/collections/artist-favourites"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Artist&apos;s Favourites
                </Link>
              </li>
              <li>
                <Link
                  href="/products?filter=new"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  New From The Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/products?filter=bestsellers"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Acquisition Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/one-of-one"
                  onClick={onClose}
                  className="hover:text-[#481E25] font-semibold hover:translate-x-1 inline-block transition-all"
                >
                  One-of-One Originals
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/collectors-edit"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Collector&apos;s Edit
                </Link>
              </li>
              <li>
                <Link
                  href="/artists"
                  onClick={onClose}
                  className="hover:text-[#B08A4A] font-medium hover:translate-x-1 inline-block transition-all"
                >
                  Browse Master Artists →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SHOP BY ROOM & MOOD */}
          <div>
            <h3 className="font-sans text-xs font-bold text-[#11100F] uppercase tracking-wider mb-4 pb-2 border-b border-[#E4DBCF]">
              Shop By Room
            </h3>
            <ul className="space-y-2 text-xs font-sans text-[#78716C] mb-5">
              <li>
                <Link
                  href="/products?room=living-room"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Living Room Salon
                </Link>
              </li>
              <li>
                <Link
                  href="/products?room=bedroom"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Master Bedroom Sanctuary
                </Link>
              </li>
              <li>
                <Link
                  href="/products?room=study"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Executive Study &amp; Library
                </Link>
              </li>
              <li>
                <Link
                  href="/products?room=entryway"
                  onClick={onClose}
                  className="hover:text-[#11100F] hover:translate-x-1 inline-block transition-all"
                >
                  Gallery Entryway
                </Link>
              </li>
            </ul>

            <h4 className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-2">
              By Mood
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Calm', 'Bold', 'Dark', 'Romantic', 'Royal', 'Minimal'].map((m) => (
                <Link
                  key={m}
                  href={`/products?mood=${m.toLowerCase()}`}
                  onClick={onClose}
                  className="text-[10px] px-2 py-0.5 border border-[#E4DBCF] hover:border-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] transition-colors"
                >
                  {m}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 5: GIFT EDIT & FEATURED EXHIBITION */}
          <div className="bg-[#FAF7F2] p-4 border border-[#E4DBCF] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase block mb-1">
                Featured Spotlight
              </span>
              <h4 className="font-sans text-sm font-bold text-[#11100F] uppercase tracking-tight leading-tight mb-2">
                The Artist&apos;s Hand: One of One
              </h4>
              <p className="text-[11px] text-[#78716C] leading-relaxed mb-3">
                Explore original unrepeatable canvases bearing artist wax seals and museum provenance.
              </p>
            </div>

            <div className="relative aspect-[4/3] bg-[#E4DBCF] overflow-hidden mb-3 border border-[#D6CDBF]">
              <Image
                src="/artworks/handpainted-sacred-geometry.svg"
                alt="One of One Original Art"
                fill
                className="object-contain p-2"
              />
            </div>

            <Link
              href="/collections/one-of-one"
              onClick={onClose}
              className="text-[11px] font-sans font-semibold tracking-wider text-[#11100F] hover:text-[#481E25] flex items-center justify-between uppercase transition-colors"
            >
              <span>View Collection</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* MegaMenu Bottom Bar: Gift Price Tiers */}
        <div className="pt-6 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-[#11100F] tracking-wider uppercase text-[11px]">
              Gift Edit:
            </span>
            <Link
              href="/products?occasion=new-home"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#11100F] transition-colors"
            >
              New Home
            </Link>
            <Link
              href="/products?occasion=anniversary"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#11100F] transition-colors"
            >
              Anniversary
            </Link>
            <Link
              href="/products?maxPrice=2500"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#11100F] transition-colors"
            >
              Under ₹2,500
            </Link>
            <Link
              href="/products?maxPrice=5000"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#11100F] transition-colors"
            >
              Under ₹5,000
            </Link>
          </div>

          <Link
            href="/shipping"
            onClick={onClose}
            className="text-[11px] text-neutral-600 hover:text-black hover:underline"
          >
            Free Standard Shipping On Orders Above ₹999
          </Link>
        </div>
      </div>
    </div>
  );
}
