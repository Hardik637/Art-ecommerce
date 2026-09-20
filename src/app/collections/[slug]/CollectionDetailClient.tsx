'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CuratedCollection, ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import { useUserStore } from '@/store/userStore';
import { Bookmark, Check, ArrowLeft } from 'lucide-react';

interface CollectionDetailClientProps {
  collection: CuratedCollection;
  artworks: ArtworkProduct[];
}

export default function CollectionDetailClient({
  collection,
  artworks,
}: CollectionDetailClientProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { toggleSaveCollection, isCollectionSaved } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaved = mounted ? isCollectionSaved(collection.id) : false;

  const filteredArtworks = artworks.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const categories = Array.from(new Set(artworks.map((a) => a.category)));

  return (
    <div className="bg-white min-h-screen pb-20 text-black">
      {/* Banner */}
      <div className="relative h-80 md:h-[400px] bg-black overflow-hidden border-b border-neutral-200">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white uppercase font-sans font-bold tracking-wider mb-3 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Collections
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl text-white">
              {collection.badge && (
                <span className="inline-block px-2.5 py-0.5 rounded-sm bg-white text-black text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
                  {collection.badge}
                </span>
              )}
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-none">
                {collection.name}
              </h1>
              <p className="text-xs md:text-sm font-sans font-medium text-neutral-300 mt-2">
                {collection.subtitle}
              </p>
              <p className="text-xs text-neutral-400 mt-2 max-w-xl leading-relaxed font-sans">
                {collection.description}
              </p>
              <div className="text-[11px] font-sans font-medium text-neutral-400 mt-2">
                {artworks.length} Products Available
              </div>
            </div>

            {/* Save Collection Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleSaveCollection(collection.id)}
                className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-sans font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check size={14} /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={14} /> Save Collection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Works Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              All Products ({artworks.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                {cat} ({artworks.filter((a) => a.category === cat).length})
              </button>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
