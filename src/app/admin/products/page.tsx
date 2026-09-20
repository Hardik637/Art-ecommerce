import { Metadata } from 'next';
import AdminProductsClient from './AdminProductsClient';

export const metadata: Metadata = {
  title: 'Products Catalog & Inventory | Admin CMS',
  description: 'Manage wall art, sculptures, decorative pieces, framing options, and inventory.',
};

export default function AdminProductsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6 text-black">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
          Inventory
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          Products Catalog & Inventory
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Complete inventory of wall art, bronze castings, collectible figures, and decorative pieces.
        </p>
      </div>

      <AdminProductsClient />
    </div>
  );
}
