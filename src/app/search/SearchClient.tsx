'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowUpRight, Palette, Users } from 'lucide-react';
import { ARTISTS, CURATED_COLLECTIONS, searchArtworks } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import ProductQuickView from '@/components/ProductQuickView';
import RecentlyViewed from '@/components/RecentlyViewed';

const POPULAR_SEARCHES = [
  'Monsoon',
  'Bronze Sculpture',
  'Ananya Sen',
  'Makrana Marble',
  'Collectible Figures',
  'Under ₹5,000',
  'Abstract',
  'Wall Art',
];

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const url = query.trim() ? `/search?q=${encodeURIComponent(query)}` : '/search';
      router.replace(url, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [query, router]);

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingArtworks = query.trim() ? searchArtworks(query) : [];
  const matchingArtists = query.trim()
    ? ARTISTS.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.signatureStyle.toLowerCase().includes(q) ||
          a.mediums.some((m) => m.toLowerCase().includes(q))
      )
    : [];
  const matchingCollections = query.trim()
    ? CURATED_COLLECTIONS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="min-h-screen bg-white py-10 md:py-16 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Search Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-neutral-500 uppercase block mb-2">
            Catalog Search
          </span>
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-black uppercase tracking-tight">
            Search Products
          </h1>
        </div>

        {/* Input Bar */}
        <div className="relative mb-10">
          <div className="flex items-center bg-neutral-50 border border-neutral-300 p-4 shadow-xs focus-within:border-black transition-colors">
            <Search size={20} className="text-neutral-500 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product title, artist, medium (bronze, marble, impasto)..."
              className="w-full bg-transparent text-sm md:text-base font-sans text-black placeholder-neutral-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches when query is empty */}
        {!query.trim() && (
          <div className="mb-16">
            <p className="text-[11px] font-sans font-bold tracking-widest text-neutral-500 uppercase mb-4">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-neutral-50 hover:bg-black hover:text-white border border-neutral-200 text-xs font-sans font-semibold uppercase tracking-wider px-4 py-2 text-black transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Suggestions (Artist / Collections / Artworks) */}
        {query.trim() && (
          <div className="space-y-12">
            {/* Matching Artists */}
            {matchingArtists.length > 0 && (
              <div className="bg-neutral-50 p-6 border border-neutral-200">
                <h3 className="text-xs font-sans font-bold tracking-widest text-black uppercase mb-4 flex items-center gap-2">
                  <Users size={14} />
                  <span>Matching Artists ({matchingArtists.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingArtists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.slug}`}
                      className="flex items-center gap-3 p-3 bg-white border border-neutral-200 hover:border-black transition-colors group"
                    >
                      <div className="w-12 h-14 relative bg-neutral-100 flex-shrink-0">
                        <Image
                          src={artist.portrait}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-sm font-bold text-black group-hover:text-neutral-700 truncate uppercase">
                          {artist.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-sans truncate">
                          {artist.signatureStyle}
                        </p>
                      </div>
                      <ArrowUpRight size={14} className="text-neutral-400 group-hover:text-black" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Collections */}
            {matchingCollections.length > 0 && (
              <div className="bg-neutral-50 p-6 border border-neutral-200">
                <h3 className="text-xs font-sans font-bold tracking-widest text-black uppercase mb-4 flex items-center gap-2">
                  <Palette size={14} />
                  <span>Matching Collections ({matchingCollections.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.slug}`}
                      className="p-4 bg-white border border-neutral-200 hover:border-black transition-colors group flex justify-between items-center"
                    >
                      <div>
                        <span className="text-[9px] font-sans text-neutral-500 uppercase tracking-wider block">
                          {col.badge || 'Curated Collection'}
                        </span>
                        <h4 className="font-sans text-base font-bold text-black group-hover:text-neutral-700 uppercase">
                          {col.name}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                          {col.subtitle}
                        </p>
                      </div>
                      <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-black ml-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Artworks */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-black">
                  Products ({matchingArtworks.length})
                </h2>
                <span className="text-xs font-sans text-neutral-500">
                  Results for &ldquo;{query}&rdquo;
                </span>
              </div>

              {matchingArtworks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {matchingArtworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      onQuickView={setQuickViewArtwork}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-neutral-50 border border-neutral-200 p-8">
                  <p className="font-sans text-xl font-bold text-black uppercase mb-2">
                    NO SEARCH RESULTS
                  </p>
                  <p className="text-xs sm:text-sm font-sans text-neutral-500 max-w-sm mx-auto mb-6">
                    We couldn&apos;t find anything matching your search.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-black text-white px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                  >
                    VIEW ALL PRODUCTS
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <div className="mt-16">
          <RecentlyViewed />
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        artwork={quickViewArtwork}
        onClose={() => setQuickViewArtwork(null)}
      />
    </div>
  );
}
