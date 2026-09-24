import { Metadata } from 'next';
import WishlistClient from '@/app/account/wishlist/WishlistClient';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Wishlist | Zorodoor Art',
  description: 'Your saved original artworks, sculptures, and decorative pieces.',
};

export default function WishlistPage() {
  return (
    <div className="bg-[#FAFAF9] min-h-screen text-black py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-neutral-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-black font-semibold">Wishlist</span>
        </nav>

        <div className="mb-8 border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight leading-none">
              Your Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-2">
              Save pieces you love and come back to them anytime.
            </p>
          </div>
        </div>

        <WishlistClient />
      </div>
    </div>
  );
}
