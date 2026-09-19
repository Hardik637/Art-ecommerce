import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CURATED_COLLECTIONS } from '@/lib/artCatalog';
import { Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Exhibitions & Collections | ATELIER & ART HOUSE',
  description:
    'Explore curated exhibitions of contemporary art — one-of-one original paintings, museum sculptures, architectural room edits, and collectible designer figures.',
};

export default function CollectionsPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[11px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Curatorial Exhibitions
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#11100F] font-light tracking-tight leading-tight">
            Curated Collections
          </h1>
          <p className="text-sm md:text-base text-[#555] font-sans mt-4 leading-relaxed">
            Thematic dialogues between paintings, lost-wax bronzes, and artisanal figures — arranged by mood, interior architecture, and curatorial philosophy.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm hover:border-[#B08A4A]/60 hover:shadow-md transition-all flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] bg-[#EFE9DF] overflow-hidden">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {col.badge && (
                  <div className="absolute top-3 left-3 bg-[#11100F]/90 backdrop-blur-sm text-[#B08A4A] px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider border border-[#B08A4A]/30">
                    {col.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-white/80 text-[11px] font-mono">
                  {col.productIds.length} Works
                </div>
              </div>

              {/* Text Particulars */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-1">
                    Curated by {col.curator}
                  </span>
                  <h2 className="font-serif text-2xl text-[#11100F] font-light group-hover:text-[#B08A4A] transition-colors">
                    {col.name}
                  </h2>
                  <p className="text-xs text-[#8A6A32] font-mono mt-1">
                    {col.subtitle}
                  </p>
                  <p className="text-xs text-[#555] font-sans mt-3 line-clamp-3 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4DBCF] flex items-center justify-between text-xs font-sans font-medium text-[#11100F] group-hover:text-[#B08A4A] transition-colors">
                  <span>Explore Curated Exhibition</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
