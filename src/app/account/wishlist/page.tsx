import { Metadata } from 'next';
import WishlistClient from './WishlistClient';

export const metadata: Metadata = {
  title: 'Curated Wishlist | ATELIER & ART HOUSE',
  description: 'Your saved original artworks, fine art prints, sculptures, and collectible figures.',
};

export default function WishlistPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-black uppercase tracking-tight">
          Curated Wishlist & Saved Works
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Artworks reserved for future acquisitions or private curatorial consultation.
        </p>
      </div>

      <WishlistClient />
    </div>
  );
}
