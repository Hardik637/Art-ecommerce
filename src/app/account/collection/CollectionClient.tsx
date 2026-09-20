'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Printer, X, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getAllOrders } from '@/lib/orders';
import { OrderItem } from '@/types/art';

interface CollectedItem extends OrderItem {
  orderNumber: string;
  acquisitionDate: string;
  coaRegistryNumber: string;
}

export default function CollectionClient() {
  const [mounted, setMounted] = useState(false);
  const [selectedCoaItem, setSelectedCoaItem] = useState<CollectedItem | null>(null);
  const { collectedOrders } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseOrders = getAllOrders();
  const allOrders = [
    ...collectedOrders,
    ...baseOrders.filter((bo) => !collectedOrders.some((co) => co.id === bo.id)),
  ];

  // Flatten items from all orders into a private collection
  const collection: CollectedItem[] = [];
  allOrders.forEach((order) => {
    order.items.forEach((item, idx) => {
      collection.push({
        ...item,
        orderNumber: order.orderNumber,
        acquisitionDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        coaRegistryNumber: `AUTH-COA-2026-${order.orderNumber.slice(-4)}${idx + 1}`,
      });
    });
  });

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-96 bg-neutral-100 rounded-xl" />
        <div className="h-96 bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4 text-black">
          <Award size={28} />
        </div>
        <h2 className="text-xl font-bold text-black mb-1">
          No Purchased Artworks Yet
        </h2>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mb-5 leading-relaxed">
          Purchased artworks, sculptures, and decorative pieces will appear here with their verified digital Certificates of Authenticity.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors rounded-lg text-xs uppercase tracking-wider font-semibold"
        >
          Explore Catalog <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collection.map((item) => (
          <div
            key={item.id + item.coaRegistryNumber}
            className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs flex flex-col hover:border-black transition-all group"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-neutral-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 rounded-sm text-[10px] font-mono tracking-wider flex items-center gap-1.5 font-bold">
                <ShieldCheck size={11} />
                {item.coaRegistryNumber}
              </div>
            </div>

            {/* Particulars */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mb-1">
                  <span>{item.artistName}</span>
                  <span>Acquired {item.acquisitionDate}</span>
                </div>
                <h3 className="text-lg font-bold text-black leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {item.medium} {item.dimensions ? `• ${item.dimensions}` : ''}
                </p>
                {item.frame && (
                  <div className="mt-2.5 p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] font-mono text-neutral-700 flex items-center justify-between">
                    <span>Frame: {item.frame.name}</span>
                    <span>+₹{item.frame.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider block">
                    Price Paid
                  </span>
                  <span className="font-mono text-sm font-bold text-black">
                    ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCoaItem(item)}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Award size={14} />
                  Certificate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate of Authenticity Modal */}
      {selectedCoaItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-xl my-8 bg-white border-2 border-black rounded-xl shadow-2xl p-6 sm:p-8 text-black print:m-0 print:border-none">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCoaItem(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1.5 rounded-full hover:bg-neutral-100 transition-colors print:hidden cursor-pointer"
              aria-label="Close Certificate Modal"
            >
              <X size={18} />
            </button>

            {/* Certificate Header */}
            <div className="text-center pb-6 border-b border-neutral-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-2 shadow-xs">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl tracking-wider uppercase font-extrabold text-black">
                Certificate of Authenticity
              </h2>
              <p className="text-[10px] tracking-widest uppercase font-mono text-neutral-500 mt-0.5">
                Authenticity Registry & Provenance
              </p>
            </div>

            {/* Artwork Details Body */}
            <div className="my-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="w-20 h-20 relative rounded-md overflow-hidden shrink-0 border border-neutral-200 bg-neutral-200">
                  <Image
                    src={selectedCoaItem.image}
                    alt={selectedCoaItem.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                    Artwork Title
                  </span>
                  <h3 className="text-lg font-bold text-black">
                    {selectedCoaItem.name}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    By <strong className="text-black">{selectedCoaItem.artistName}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    Medium
                  </span>
                  <p className="text-xs font-semibold text-black mt-0.5">
                    {selectedCoaItem.medium}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    Dimensions
                  </span>
                  <p className="text-xs font-semibold text-black mt-0.5">
                    {selectedCoaItem.dimensions || 'Archival Standard'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    Order Number
                  </span>
                  <p className="text-xs font-mono font-semibold text-black mt-0.5">
                    {selectedCoaItem.orderNumber}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    Registry Hash
                  </span>
                  <p className="text-xs font-mono font-bold text-black mt-0.5">
                    {selectedCoaItem.coaRegistryNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg border border-neutral-300 hover:border-black text-black transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                Print Certificate
              </button>

              <button
                type="button"
                onClick={() => setSelectedCoaItem(null)}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
