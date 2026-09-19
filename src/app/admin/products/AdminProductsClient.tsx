'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Eye, Sparkles, Award, ShieldCheck, Filter } from 'lucide-react';
import { ARTWORKS } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';

export default function AdminProductsClient() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [artworksList, setArtworksList] = useState<ArtworkProduct[]>(ARTWORKS);

  const filtered = artworksList.filter((a) => {
    const matchesCategory =
      selectedCategory === 'all' || a.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.artistName.toLowerCase().includes(q) ||
      a.medium.toLowerCase().includes(q) ||
      a.catalogNumber.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, artist, medium, or catalog #..."
              className="w-full bg-[#FAF8F5] border border-[#E4DBCF] rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#888]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-xl px-3 py-2.5 text-xs font-sans text-[#11100F] outline-none"
            >
              <option value="all">All Disciplines (36)</option>
              <option value="paintings">Paintings (12)</option>
              <option value="sculptures">Sculptures (6)</option>
              <option value="figures">Collectible Figures (6)</option>
              <option value="prints">Fine Art Prints (6)</option>
              <option value="objects">Decorative Objects (6)</option>
            </select>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium shrink-0"
        >
          <Plus size={15} /> Catalog New Masterwork
        </Link>
      </div>

      {/* Artworks Table */}
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#EFE9DF]/60 border-b border-[#E4DBCF] text-[#777] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-5">Artwork & Cat. #</th>
                <th className="py-3.5 px-4">Master Artist</th>
                <th className="py-3.5 px-4">Medium & Dimensions</th>
                <th className="py-3.5 px-4">Edition Type</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Framing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DBCF]/70">
              {filtered.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-white/70 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-[#E4DBCF] shrink-0 bg-[#EFE9DF]">
                        <Image
                          src={artwork.thumbnail || artwork.images[0]}
                          alt={artwork.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-[#B08A4A] block">
                          {artwork.catalogNumber}
                        </span>
                        <span className="font-serif text-sm text-[#11100F] font-medium block truncate max-w-[200px]">
                          {artwork.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans font-medium text-[#11100F]">
                    {artwork.artistName}
                  </td>

                  <td className="py-3 px-4 text-[#666]">
                    <span className="block truncate max-w-[180px]">{artwork.medium}</span>
                    <span className="text-[10px] font-mono text-[#888] block">
                      {artwork.dimensions.width} × {artwork.dimensions.height} cm
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {artwork.isOneOfOne ? (
                      <span className="inline-flex items-center gap-1 text-[#8A6A32] font-semibold">
                        <Sparkles size={11} /> 1/1 Original
                      </span>
                    ) : artwork.isLimitedEdition ? (
                      <span className="text-[#555]">
                        Limited ({artwork.editionSize || 50})
                      </span>
                    ) : (
                      <span className="text-[#777]">Museum Print</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-[#11100F]">
                    ₹{artwork.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-[11px] font-mono text-[#666]">
                    {artwork.frameAvailable ? (
                      <span className="text-[#059669]">4 Frame Styles</span>
                    ) : (
                      <span className="text-[#888]">Sculpture Base</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#059669]/10 text-[#059669]">
                      Active Catalog
                    </span>
                  </td>

                  <td className="py-3 px-5 text-right">
                    <Link
                      href={`/products/${artwork.slug || artwork.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4DBCF] hover:border-[#11100F] text-[11px] font-sans font-medium text-[#11100F] transition-colors"
                      title="Preview in Gallery"
                    >
                      <Eye size={12} /> View Live
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#EFE9DF]/40 border-t border-[#E4DBCF] flex items-center justify-between text-xs text-[#777] font-mono">
          <span>Displaying {filtered.length} of {artworksList.length} masterworks</span>
          <span>Provenance Registry ID: ATH-REG-2026</span>
        </div>
      </div>
    </div>
  );
}
