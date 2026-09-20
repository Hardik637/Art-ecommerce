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
          <div key={i} className="h-80 bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {items.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-black">
            <Heart size={28} />
          </div>
          <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-black mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-neutral-500 font-sans max-w-md mx-auto mb-6 leading-relaxed">
            Click the heart icon on any wall art, sculpture, or decorative piece to save it to your wishlist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-widest font-sans font-bold"
          >
            Explore Products <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
