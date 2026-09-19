import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { CURATED_COLLECTIONS } from '@/lib/artCatalog';
import { Layers, Eye, Sparkles, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Exhibitions & Edits | Atelier CMS',
  description: 'Manage curated thematic collections and digital exhibition showcases.',
};

export default function AdminCollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Digital Exhibitions
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
            Curated Exhibitions & Thematic Edits
          </h1>
          <p className="text-xs text-[#777] font-sans mt-1">
            Manage thematic groupings, interior room curation edits, and curatorial introductions.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium"
        >
          <Plus size={14} /> Create Exhibition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CURATED_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#B08A4A]/50 transition-all"
          >
            <div>
              <div className="relative aspect-[16/9] bg-[#EFE9DF] overflow-hidden">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {col.badge && (
                  <div className="absolute top-3 left-3 bg-[#11100F]/90 backdrop-blur-sm text-[#B08A4A] px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider border border-[#B08A4A]/30">
                    {col.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-white/90 text-xs font-mono">
                  {col.productIds.length} Artworks
                </div>
              </div>

              <div className="p-5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-1">
                  Curated by {col.curator}
                </span>
                <h3 className="font-serif text-xl text-[#11100F] font-medium leading-snug">
                  {col.name}
                </h3>
                <p className="text-xs text-[#8A6A32] font-mono mt-0.5">
                  {col.subtitle}
                </p>
                <p className="text-xs text-[#555] font-sans mt-3 line-clamp-3 leading-relaxed">
                  {col.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-[#E4DBCF] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#777]">
                Featured on Homepage: {col.featuredOnHome ? 'Yes' : 'No'}
              </span>
              <Link
                href={`/collections/${col.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4DBCF] hover:border-[#11100F] text-xs font-sans font-medium text-[#11100F] transition-colors"
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
