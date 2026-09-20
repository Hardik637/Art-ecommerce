'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Eye, Filter } from 'lucide-react';
import { ARTWORKS } from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';

export default function AdminProductsClient() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [artworksList] = useState<ArtworkProduct[]>(ARTWORKS);

  const filtered = artworksList.filter((a) => {
    const matchesCategory =
      selectedCategory === 'all' || a.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      (a.artistName && a.artistName.toLowerCase().includes(q)) ||
      a.medium.toLowerCase().includes(q) ||
      (a.catalogNumber && a.catalogNumber.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-black">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, artist, medium..."
              className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-4 py-2 text-xs outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-black outline-none cursor-pointer"
            >
              <option value="all">All Disciplines (36)</option>
              <option value="paintings">Wall Art (12)</option>
              <option value="sculptures">Sculptures (6)</option>
              <option value="figures">Collectible Figures (6)</option>
              <option value="prints">Art Prints (6)</option>
              <option value="objects">Decorative Pieces (6)</option>
            </select>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold shrink-0"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Artworks Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Artist</th>
                <th className="py-3 px-4">Medium & Dimensions</th>
                <th className="py-3 px-4">Edition Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Framing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 relative rounded-md overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src={artwork.thumbnail || artwork.images[0]}
                          alt={artwork.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-neutral-400 block">
                          {artwork.catalogNumber}
                        </span>
                        <span className="text-xs font-bold text-black block truncate max-w-[180px]">
                          {artwork.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-black">
                    {artwork.artistName}
                  </td>

                  <td className="py-3 px-4 text-neutral-600">
                    <span className="block truncate max-w-[160px]">{artwork.medium}</span>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      {artwork.dimensions.width} × {artwork.dimensions.height} cm
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {artwork.isOneOfOne ? (
                      <span className="inline-block text-black font-bold">
                        Original Work
                      </span>
                    ) : artwork.isLimitedEdition ? (
                      <span className="text-neutral-600">
                        Limited ({artwork.editionSize || 50})
                      </span>
                    ) : (
                      <span className="text-neutral-500">Standard Print</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-black">
                    ₹{artwork.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-[11px] font-mono text-neutral-600">
                    {artwork.frameAvailable ? (
                      <span className="text-black font-medium">Available</span>
                    ) : (
                      <span className="text-neutral-400">Not Applicable</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white">
                      Active
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/products/${artwork.slug || artwork.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-neutral-300 hover:border-black text-[11px] font-semibold text-black transition-colors"
                      title="Preview Product"
                    >
                      <Eye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Displaying {filtered.length} of {artworksList.length} products</span>
          <span>Catalog Database</span>
        </div>
      </div>
    </div>
  );
}
