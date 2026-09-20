import { Metadata } from 'next';
import { ARTWORKS } from '@/lib/artCatalog';
import ArtworkCard from '@/components/ArtworkCard';

export const metadata: Metadata = {
  title: 'New Arrivals | ATELIER Home & Living',
  description:
    'Fresh original paintings, bronze sculptures, and limited collectible figures just released for modern interiors.',
};

export default function NewArrivalsPage() {
  const newArrivals = ARTWORKS.filter((a) => a.isNew);

  return (
    <div className="bg-white min-h-screen py-10 md:py-16 text-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8 md:space-y-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span className="text-[10px] uppercase font-sans font-bold tracking-[0.14em] text-neutral-500">
              Fresh Releases
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-black tracking-tight uppercase leading-none">
            New Arrivals
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 font-sans mt-2 leading-relaxed">
            Newly released original wall art, sculptures, and limited decorative objects curated for modern spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
