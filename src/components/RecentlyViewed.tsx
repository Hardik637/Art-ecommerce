'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { formatPrice, getCategoryLabel } from '@/lib/artCatalog';
import { MajorCategory } from '@/types/art';

interface RecentlyViewedProps {
  currentProductId?: string;
  maxItems?: number;
}

export default function RecentlyViewed({
  currentProductId,
  maxItems = 4,
}: RecentlyViewedProps) {
  const [mounted, setMounted] = useState(false);
  const items = useRecentlyViewedStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter out the current product from its own recently viewed list
  const displayItems = items
    .filter((i) => i.id !== currentProductId && i.slug !== currentProductId)
    .slice(0, maxItems);

  if (displayItems.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24 pt-10 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
            Your Browsing History
          </span>
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-black tracking-tight uppercase">
            Recently Viewed
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {displayItems.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug || item.id}`}
            className="group flex flex-col bg-white border border-neutral-200 hover:border-black transition-all duration-300 p-2.5 sm:p-3"
          >
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden mb-2.5">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-neutral-500 truncate mb-0.5">
                {getCategoryLabel(item.category as MajorCategory)}
              </span>
              <h4 className="text-[13px] font-sans font-bold text-black uppercase tracking-tight line-clamp-1 group-hover:text-neutral-600 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-neutral-500 font-sans line-clamp-1 mb-2">
                {item.medium}
              </p>
              <div className="mt-auto pt-1.5 border-t border-neutral-100 flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm font-sans font-bold text-black">
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-[11px] font-sans text-neutral-400 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
