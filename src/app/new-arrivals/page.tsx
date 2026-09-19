import { Metadata } from 'next';
import Link from 'next/link';
import { ARTWORKS } from '@/lib/artCatalog';
import ArtworkCard from '@/components/ArtworkCard';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recent Studio Releases & New Masterworks | ATELIER & ART HOUSE',
  description:
    'Fresh original paintings, bronze sculptures, and limited collectible figures just completed by our six resident master artists.',
};

export default function NewArrivalsPage() {
  const newArrivals = ARTWORKS.filter((a) => a.isNew);

  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Resident Master Studios
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#11100F] font-light tracking-tight leading-tight">
            Recent Studio Releases
          </h1>
          <p className="text-xs md:text-sm text-[#555] font-sans mt-3 leading-relaxed">
            Newly completed one-of-one hand-painted canvases, freshly patinated lost-wax bronzes, and limited collectible editions directly from our resident ateliers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
