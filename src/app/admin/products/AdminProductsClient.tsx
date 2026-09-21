'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Eye, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { ARTWORKS } from '@/lib/artCatalog';
import { Product } from '@/types/art';

export default function AdminProductsClient() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productsList, setProductsList] = useState<Product[]>([...ARTWORKS]);
  const [loading, setLoading] = useState(false);

  const fetchCustomProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          // Put newly created items first
          setProductsList([...data.products, ...ARTWORKS]);
        }
      }
    } catch {
      // fallback to ARTWORKS
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomProducts();
  }, []);

  const filtered = productsList.filter((a) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      a.category === selectedCategory ||
      (selectedCategory === 'paintings' && a.category === 'wall-art');

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      ((a as any).artistName && (a as any).artistName.toLowerCase().includes(q)) ||
      (a.medium && a.medium.toLowerCase().includes(q)) ||
      ((a as any).catalogNumber && (a as any).catalogNumber.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-black font-sans">
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
              className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-4 py-2 text-xs outline-none focus:border-black transition-colors font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-black outline-none cursor-pointer"
            >
              <option value="all">All Categories ({productsList.length})</option>
              <option value="wall-art">Wall Art</option>
              <option value="sculptures">Sculptures</option>
              <option value="decorative-pieces">Decorative Pieces</option>
            </select>

            <button
              type="button"
              onClick={fetchCustomProducts}
              className="p-2 border border-neutral-300 rounded-lg text-neutral-500 hover:text-black hover:border-black transition-colors"
              title="Refresh Products"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-bold shrink-0 shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Add Item
        </Link>
      </div>

      {/* Artworks Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 font-mono text-[10px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Item & Visual</th>
                <th className="py-3 px-4">Artist / Creator</th>
                <th className="py-3 px-4">Discipline & Medium</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((artwork) => {
                const isCustom = String(artwork.id).startsWith('art-custom-') || String(artwork.id).startsWith('art-1');
                const imageSrc =
                  artwork.thumbnail ||
                  (artwork.images && artwork.images[0]) ||
                  '/artworks/painting-monsoon-abstract.svg';

                return (
                  <tr key={artwork.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                          <Image
                            src={imageSrc}
                            alt={artwork.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-black block truncate max-w-[190px]">
                              {artwork.name}
                            </span>
                            {isCustom && (
                              <span className="text-[9px] font-mono bg-black text-white px-1.5 py-0.2 rounded font-semibold">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-neutral-400 block uppercase">
                            {artwork.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-black">
                      {(artwork as any).artistName || 'Studio Resident'}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      <span className="block truncate max-w-[160px] font-medium">{artwork.medium}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                      {typeof artwork.dimensions === 'object' && artwork.dimensions
                        ? `${artwork.dimensions.width} × ${artwork.dimensions.height} cm`
                        : (artwork.dimensions as string)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-black">
                      ₹{artwork.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-neutral-700">
                      {artwork.stock ?? 1} units
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white font-semibold">
                        Active
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/products/${artwork.slug || artwork.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-neutral-300 hover:border-black text-[11px] font-semibold text-black transition-colors cursor-pointer bg-white"
                        title="Preview on Live Boutique"
                      >
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Displaying {filtered.length} of {productsList.length} products</span>
          <span>Catalog Database Synchronized</span>
        </div>
      </div>
    </div>
  );
}
