'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowUpRight, Sparkles, Palette, Users } from 'lucide-react';
import { ARTWORKS, ARTISTS, CURATED_COLLECTIONS, searchArtworks, formatPrice } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';

const POPULAR_SEARCHES = [
  'Monsoon',
  'One of One',
  'Bronze Sculpture',
  'Ananya Sen',
  'Gold Leaf',
  'Makrana Marble',
  'Collectible Figures',
  'Under ₹5,000',
];

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
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
    <div className="min-h-screen bg-[#F4EFE7] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Search Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
            Catalog Search
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F]">
            Discover Artworks &amp; Artists
          </h1>
        </div>

        {/* Input Bar */}
        <div className="relative mb-10">
          <div className="flex items-center bg-[#FAF7F2] border border-[#E4DBCF] p-4 shadow-sm focus-within:border-[#11100F] transition-colors">
            <Search size={20} className="text-[#78716C] mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by artwork title, artist name, medium (bronze, impasto, marble)..."
              className="w-full bg-transparent text-sm md:text-base font-sans text-[#11100F] placeholder-[#78716C] outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#78716C] hover:text-[#11100F] transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches when query is empty */}
        {!query.trim() && (
          <div className="mb-16">
            <p className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-4">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-[#FAF7F2] hover:bg-[#11100F] hover:text-[#F4EFE7] border border-[#E4DBCF] text-xs font-sans px-4 py-2 text-[#11100F] transition-colors"
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
              <div className="bg-[#FAF7F2] p-6 border border-[#E4DBCF]">
                <h3 className="text-xs font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-4 flex items-center gap-2">
                  <Users size={14} />
                  <span>Matching Artists ({matchingArtists.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingArtists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.slug}`}
                      className="flex items-center gap-3 p-3 bg-[#F4EFE7] border border-[#E4DBCF] hover:border-[#11100F] transition-colors group"
                    >
                      <div className="w-12 h-14 relative bg-[#292622] flex-shrink-0">
                        <Image
                          src={artist.portrait}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base font-normal text-[#11100F] group-hover:text-[#481E25] truncate">
                          {artist.name}
                        </h4>
                        <p className="text-[11px] text-[#78716C] font-sans truncate">
                          {artist.signatureStyle}
                        </p>
                      </div>
                      <ArrowUpRight size={14} className="text-[#78716C] group-hover:text-[#11100F]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Collections */}
            {matchingCollections.length > 0 && (
              <div className="bg-[#FAF7F2] p-6 border border-[#E4DBCF]">
                <h3 className="text-xs font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-4 flex items-center gap-2">
                  <Palette size={14} />
                  <span>Matching Collections ({matchingCollections.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.slug}`}
                      className="p-4 bg-[#F4EFE7] border border-[#E4DBCF] hover:border-[#11100F] transition-colors group flex justify-between items-center"
                    >
                      <div>
                        <span className="text-[9px] font-sans text-[#B08A4A] uppercase tracking-wider block">
                          {col.badge || 'Curated Exhibition'}
                        </span>
                        <h4 className="font-serif text-lg font-normal text-[#11100F] group-hover:text-[#481E25]">
                          {col.name}
                        </h4>
                        <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">
                          {col.subtitle}
                        </p>
                      </div>
                      <ArrowUpRight size={15} className="text-[#78716C] group-hover:text-[#11100F] ml-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Artworks */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E4DBCF]">
                <h2 className="font-serif text-2xl font-normal text-[#11100F]">
                  Artworks ({matchingArtworks.length})
                </h2>
                <span className="text-xs font-sans text-[#78716C]">
                  Results for &ldquo;{query}&rdquo;
                </span>
              </div>

              {matchingArtworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {matchingArtworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#FAF7F2] border border-[#E4DBCF] p-8">
                  <p className="font-serif text-2xl text-[#11100F] mb-2">
                    No artworks found matching &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs font-sans text-[#78716C] max-w-sm mx-auto mb-6">
                    Try searching for &quot;oil&quot;, &quot;bronze&quot;, &quot;figure&quot;, or &quot;Ananya Sen&quot;.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-[#11100F] text-[#F4EFE7] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-[#481E25] transition-colors"
                  >
                    Browse Complete Catalog
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
