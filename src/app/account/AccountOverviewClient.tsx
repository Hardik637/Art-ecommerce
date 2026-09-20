'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Package, Heart, ChevronRight, ArrowUpRight, ShieldCheck, Truck } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getAllOrders } from '@/lib/orders';
import { Order } from '@/types/art';

export default function AccountOverviewClient() {
  const [mounted, setMounted] = useState(false);
  const { collectedOrders } = useUserStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseOrders = getAllOrders();
  const allOrders: Order[] = [
    ...collectedOrders,
    ...baseOrders.filter((bo) => !collectedOrders.some((co) => co.id === bo.id)),
  ];

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
            <div key={i} className="h-28 bg-neutral-200" />
          ))}
        </div>
        <div className="h-64 bg-neutral-200" />
      </div>
    );
  }

  const recentOrder = allOrders[0];

  return (
    <div className="space-y-8 text-black">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-5 shadow-xs hover:border-black transition-colors">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider">Ordered Products</span>
            <Package size={16} className="text-black" />
          </div>
          <p className="font-sans font-extrabold text-2xl md:text-3xl text-black">{totalArtworksCount}</p>
          <Link
            href="/account/orders"
            className="text-[11px] text-black hover:underline flex items-center gap-1 mt-2 font-semibold uppercase"
          >
            View Orders <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-xs hover:border-black transition-colors">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider">Total Spend</span>
            <ShieldCheck size={16} className="text-black" />
          </div>
          <p className="font-sans font-extrabold text-xl md:text-2xl text-black">
            ₹{totalValuation.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-neutral-500 mt-2 font-sans">All Taxes Included</p>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-xs hover:border-black transition-colors">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider">Saved Items</span>
            <Heart size={16} className="text-black" />
          </div>
          <p className="font-sans font-extrabold text-2xl md:text-3xl text-black">{wishlistItems.length}</p>
          <Link
            href="/account/wishlist"
            className="text-[11px] text-black hover:underline flex items-center gap-1 mt-2 font-semibold uppercase"
          >
            View Wishlist <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-xs hover:border-black transition-colors">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider">Collection</span>
            <Award size={16} className="text-black" />
          </div>
          <p className="font-sans font-extrabold text-2xl md:text-3xl text-black">{allOrders.length}</p>
          <Link
            href="/account/collection"
            className="text-[11px] text-black hover:underline flex items-center gap-1 mt-2 font-semibold uppercase"
          >
            View Certificates <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Order Spotlight */}
      {recentOrder && (
        <div className="bg-white border border-neutral-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-500">
                Most Recent Order
              </span>
              <h2 className="font-sans font-bold text-lg text-black uppercase mt-0.5">
                Order #{recentOrder.orderNumber}
              </h2>
            </div>
            <Link
              href="/account/orders"
              className="text-xs font-sans font-bold uppercase tracking-wider text-black hover:text-neutral-600 flex items-center gap-1"
            >
              All Orders <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-neutral-50 border border-neutral-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative border border-neutral-300 shrink-0 bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold text-black uppercase leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-sans">
                      {item.artistName} • {item.medium}
                    </p>
                    {item.frame && (
                      <p className="text-[11px] text-neutral-600 font-sans mt-0.5">
                        Frame: {item.frame.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right sm:self-center self-end">
                  <p className="font-sans text-sm font-bold text-black">
                    ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider bg-black text-white">
                    <Truck size={10} />
                    {recentOrder.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-sans text-[11px]">
              Insured Transit: {recentOrder.courierName || 'Blue Dart Air'} • Waybill: {recentOrder.trackingNumber || 'Pending'}
            </span>
            <Link
              href="/account/collection"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-sans font-bold"
            >
              <Award size={13} />
              View Certificate
            </Link>
          </div>
        </div>
      )}

      {/* Customer Support Card */}
      <div className="bg-black text-white p-7 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
            Customer Care &amp; Custom Framing
          </span>
          <h3 className="font-sans text-xl md:text-2xl font-bold uppercase text-white">
            Need Custom Dimensions or Wall Consultation?
          </h3>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Our team assists with bespoke sizing, archival framing consultations, and complimentary white-glove installation guidance across India.
          </p>
        </div>
        <a
          href="mailto:support@atelierhome.com?subject=Custom%20Art%20Consultation"
          className="shrink-0 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-widest font-sans font-bold"
        >
          Contact Customer Care
        </a>
      </div>
    </div>
  );
}
