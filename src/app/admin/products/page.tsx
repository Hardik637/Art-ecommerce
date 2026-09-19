import { Metadata } from 'next';
import AdminProductsClient from './AdminProductsClient';

export const metadata: Metadata = {
  title: 'Artworks Catalog & Inventory | Atelier CMS',
  description: 'Manage masterwork paintings, sculptures, collectible figures, framing options, and provenance registry.',
};

export default function AdminProductsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
            Curatorial Inventory
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
          Masterwork Artworks & Sculptures
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Complete inventory of active one-of-one canvases, bronze castings, collectible vinyl figures, and fine prints.
        </p>
      </div>

      <AdminProductsClient />
    </div>
  );
}
