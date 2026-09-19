import { Metadata } from 'next';
import Link from 'next/link';
import { ARTWORKS } from '@/lib/artCatalog';
import ArtworkCard from '@/components/ArtworkCard';
import { Sparkles, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Collector Favourites & Celebrated Masterworks | ATELIER & ART HOUSE',
  description:
    'The most sought-after fine art paintings, lost-wax bronze sculptures, and limited-run collectible figures acquired by private patrons.',
};

export default function BestSellersPage() {
  const bestSellers = ARTWORKS.filter((a) => a.isBestseller || a.rating >= 4.9);

  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Curator & Patron Selection
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#11100F] font-light tracking-tight leading-tight">
            Celebrated Masterworks
          </h1>
          <p className="text-xs md:text-sm text-[#555] font-sans mt-3 leading-relaxed">
            The most acclaimed canvases, cast bronzes, and limited collectible sculptures in the Atelier permanent collection — chosen by senior curators and private patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
