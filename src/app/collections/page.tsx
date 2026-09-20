import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CURATED_COLLECTIONS } from '@/lib/artCatalog';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Collections | Modern Art & Home Décor',
  description:
    'Explore curated collections of contemporary art, original sculptures, and designer home décor.',
};

export default function CollectionsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Curated Edits
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Curated Collections
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 leading-relaxed">
            Thematic selections of wall art, sculptures, and home décor curated to elevate residential spaces.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden hover:border-black transition-all flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {col.badge && (
                  <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider">
                    {col.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-white text-[11px] font-mono font-medium">
                  {col.productIds.length} Products
                </div>
              </div>

              {/* Text Particulars */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1">
                    Curated Edit
                  </span>
                  <h2 className="text-xl font-bold text-black group-hover:underline transition-colors">
                    {col.name}
                  </h2>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    {col.subtitle}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-semibold text-black">
                  <span>Explore Collection</span>
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
