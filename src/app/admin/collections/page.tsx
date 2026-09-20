import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { CURATED_COLLECTIONS } from '@/lib/artCatalog';
import { Eye, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Collections | Admin CMS',
  description: 'Manage curated thematic collections and showcases.',
};

export default function AdminCollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6 text-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
            Collections
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
            Curated Collections
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage thematic groupings and category feature showcases.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold cursor-pointer"
        >
          <Plus size={14} /> New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CURATED_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-black transition-all"
          >
            <div>
              <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {col.badge && (
                  <div className="absolute top-3 left-3 bg-black text-white px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold">
                    {col.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-white text-xs font-mono font-medium">
                  {col.productIds.length} Products
                </div>
              </div>

              <div className="p-5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
                  Curated Collection
                </span>
                <h3 className="text-base font-bold text-black leading-snug">
                  {col.name}
                </h3>
                <p className="text-xs text-neutral-600 font-medium mt-0.5">
                  {col.subtitle}
                </p>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                  {col.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400">
                Featured on Homepage: {col.featuredOnHome ? 'Yes' : 'No'}
              </span>
              <Link
                href={`/collections/${col.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-300 hover:border-black text-xs font-semibold text-black transition-colors"
              >
                <Eye size={12} /> View Live
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
