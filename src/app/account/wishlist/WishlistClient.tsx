'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';
import { useWishlistStore } from '@/store/wishlistStore';

export default function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-[#E4DBCF]/40 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {items.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto mb-4 text-[#B08A4A]">
            <Heart size={32} />
          </div>
          <h2 className="font-serif text-2xl text-[#11100F] font-light mb-2">
            Your Curated Wishlist is Empty
          </h2>
          <p className="text-xs text-[#777] font-sans max-w-md mx-auto mb-6 leading-relaxed">
            Click the heart icon on any masterwork, sculpture, or collectible figure to reserve it in your personal wishlist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium"
          >
            Explore Gallery Works <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
