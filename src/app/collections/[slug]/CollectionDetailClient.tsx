'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CuratedCollection, ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import { useUserStore } from '@/store/userStore';
import { Bookmark, Sparkles, Check, ArrowLeft, Eye, MessageSquare } from 'lucide-react';

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
    <div className="bg-[#F4EFE7] min-h-screen pb-20">
      {/* Exhibition Hero Banner */}
      <div className="relative h-96 md:h-[450px] bg-[#11100F] overflow-hidden border-b border-[#E4DBCF]">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100F] via-[#11100F]/60 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs text-[#B08A4A] hover:text-white uppercase font-mono tracking-widest mb-4 transition-colors"
          >
            <ArrowLeft size={13} /> All Exhibitions
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl text-[#FAF8F5]">
              {collection.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B08A4A]/20 text-[#B08A4A] text-[10px] font-mono uppercase tracking-wider mb-2 border border-[#B08A4A]/40">
                  <Sparkles size={10} />
                  {collection.badge}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-5xl font-light text-[#FAF8F5] leading-tight">
                {collection.name}
              </h1>
              <p className="text-xs md:text-sm font-mono text-[#D4C4B0] mt-2">
                {collection.subtitle}
              </p>
              <p className="text-xs text-[#A8A096] font-sans mt-3 max-w-xl leading-relaxed">
                {collection.description}
              </p>
              <div className="text-[11px] font-mono text-[#777] mt-3">
                Curated by <strong>{collection.curator}</strong> • {artworks.length} Masterworks
              </div>
            </div>

            {/* Save Collection Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleSaveCollection(collection.id)}
                className={`px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2 transition-all shadow-md ${
                  isSaved
                    ? 'bg-[#B08A4A] text-white border border-[#B08A4A]'
                    : 'bg-[#FAF8F5] text-[#11100F] hover:bg-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check size={14} /> Saved in Cabinet
                  </>
                ) : (
                  <>
                    <Bookmark size={14} className="text-[#B08A4A]" /> Save Exhibition
                  </>
                )}
              </button>

              <a
                href={`mailto:concierge@atelierarthouse.com?subject=Private%20Viewing%20Request%20-%20${encodeURIComponent(collection.name)}`}
                className="px-5 py-3 rounded-xl bg-[#292622] text-[#F4EFE7] hover:bg-[#11100F] text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2 transition-colors border border-white/10"
              >
                <MessageSquare size={14} className="text-[#B08A4A]" />
                Inquire Private Viewing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Exhibition Works Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E4DBCF]">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-sans whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#11100F] text-[#F4EFE7] font-medium'
                  : 'bg-[#FAF8F5] text-[#666] border border-[#E4DBCF] hover:text-[#11100F]'
              }`}
            >
              All Exhibition Pieces ({artworks.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-sans capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#11100F] text-[#F4EFE7] font-medium'
                    : 'bg-[#FAF8F5] text-[#666] border border-[#E4DBCF] hover:text-[#11100F]'
                }`}
              >
                {cat} ({artworks.filter((a) => a.category === cat).length})
              </button>
            ))}
          </div>
        )}

        {/* Artwork Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
