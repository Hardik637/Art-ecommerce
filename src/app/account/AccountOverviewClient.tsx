'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Package, Heart, Sparkles, ChevronRight, ArrowUpRight, ShieldCheck, Truck } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getAllOrders } from '@/lib/orders';
import { Order } from '@/types/art';

export default function AccountOverviewClient() {
  const [mounted, setMounted] = useState(false);
  const { followedArtistIds, collectedOrders } = useUserStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Merge in-memory repository orders with client-placed orders
  const baseOrders = getAllOrders();
  const allOrders: Order[] = [
    ...collectedOrders,
    ...baseOrders.filter((bo) => !collectedOrders.some((co) => co.id === bo.id)),
  ];

  // Calculate stats
  const totalArtworksCount = allOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );
  const totalValuation = allOrders.reduce((sum, o) => sum + o.total, 0);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#E4DBCF]/40 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-[#E4DBCF]/40 rounded-2xl" />
      </div>
    );
  }

  const recentOrder = allOrders[0];

  return (
    <div className="space-y-8">
      {/* 4 Collector Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-5 shadow-sm hover:border-[#B08A4A]/50 transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest">Collected Works</span>
            <Award size={16} className="text-[#B08A4A]" />
          </div>
          <p className="font-serif text-3xl text-[#11100F]">{totalArtworksCount}</p>
          <Link
            href="/account/collection"
            className="text-[11px] text-[#B08A4A] hover:underline flex items-center gap-1 mt-2 font-medium"
          >
            View Private Gallery <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-5 shadow-sm hover:border-[#B08A4A]/50 transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest">Portfolio Value</span>
            <Sparkles size={16} className="text-[#B08A4A]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl text-[#11100F]">
            ₹{totalValuation.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#777] mt-2 font-mono">Insured Provenance</p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-5 shadow-sm hover:border-[#B08A4A]/50 transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest">Master Artists</span>
            <ShieldCheck size={16} className="text-[#B08A4A]" />
          </div>
          <p className="font-serif text-3xl text-[#11100F]">{followedArtistIds.length}</p>
          <Link
            href="/artists"
            className="text-[11px] text-[#B08A4A] hover:underline flex items-center gap-1 mt-2 font-medium"
          >
            Followed Studios <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-5 shadow-sm hover:border-[#B08A4A]/50 transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest">Curated Wishlist</span>
            <Heart size={16} className="text-[#B08A4A]" />
          </div>
          <p className="font-serif text-3xl text-[#11100F]">{wishlistItems.length}</p>
          <Link
            href="/account/wishlist"
            className="text-[11px] text-[#B08A4A] hover:underline flex items-center gap-1 mt-2 font-medium"
          >
            Saved Masterpieces <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Acquisition Spotlight */}
      {recentOrder && (
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E4DBCF]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A]">
                Most Recent Acquisition
              </span>
              <h2 className="font-serif text-xl text-[#11100F] font-light mt-0.5">
                Order #{recentOrder.orderNumber}
              </h2>
            </div>
            <Link
              href="/account/orders"
              className="text-xs font-sans font-medium text-[#11100F] hover:text-[#B08A4A] flex items-center gap-1"
            >
              All Acquisitions <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/70 border border-[#E4DBCF]/60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-[#E4DBCF] shrink-0 bg-[#EFE9DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#11100F] font-medium leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#777]">
                      {item.artistName} • {item.medium}
                    </p>
                    {item.frame && (
                      <p className="text-[11px] text-[#B08A4A] font-mono mt-0.5">
                        Frame: {item.frame.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right sm:self-center self-end">
                  <p className="font-mono text-sm font-semibold text-[#11100F]">
                    ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#B08A4A]/15 text-[#B08A4A]">
                    <Truck size={10} />
                    {recentOrder.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#E4DBCF] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#777] font-mono text-[11px]">
              Insured Art Transit: {recentOrder.courierName || 'Blue Dart Art Special'} • Waybill: {recentOrder.trackingNumber || 'Pending'}
            </span>
            <Link
              href="/account/collection"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium"
            >
              <Award size={13} />
              View Certificate of Authenticity
            </Link>
          </div>
        </div>
      )}

      {/* Curatorial Concierge Card */}
      <div className="bg-gradient-to-br from-[#11100F] to-[#292622] text-[#F4EFE7] rounded-2xl p-7 border border-[#B08A4A]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B08A4A]">
            Private Curatorial Advisory
          </span>
          <h3 className="font-serif text-2xl font-light text-[#FAF8F5]">
            Commission a Bespoke Artwork or Request Wall Curation
          </h3>
          <p className="text-xs text-[#A8A096] font-sans leading-relaxed">
            Our senior curators assist founding patrons with custom-sized commissions, archival museum framing consultations, and white-glove home installation across India.
          </p>
        </div>
        <a
          href="mailto:concierge@atelierarthouse.com?subject=Patron%20Curatorial%20Inquiry"
          className="shrink-0 px-5 py-3 rounded-xl bg-[#B08A4A] text-white hover:bg-white hover:text-[#11100F] transition-colors text-xs uppercase tracking-widest font-sans font-semibold"
        >
          Contact Art Concierge
        </a>
      </div>
    </div>
  );
}
