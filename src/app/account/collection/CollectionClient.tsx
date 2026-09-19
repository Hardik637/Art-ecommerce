'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Printer, X, ShieldCheck, Download, Share2, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
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
        coaRegistryNumber: `ATH-COA-2026-${order.orderNumber.slice(-4)}${idx + 1}`,
      });
    });
  });

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-96 bg-[#E4DBCF]/40 rounded-2xl" />
        <div className="h-96 bg-[#E4DBCF]/40 rounded-2xl" />
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto mb-4 text-[#B08A4A]">
          <Award size={32} />
        </div>
        <h2 className="font-serif text-2xl text-[#11100F] font-light mb-2">
          Your Private Gallery is Awaiting Its First Work
        </h2>
        <p className="text-xs text-[#777] font-sans max-w-md mx-auto mb-6 leading-relaxed">
          Acquired original artworks, collectible figures, and bronze sculptures are automatically cataloged here with their digitally signed Certificates of Authenticity.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium"
        >
          Explore the Masterwork Catalog <ArrowRight size={14} />
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
            className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-[#B08A4A]/60 transition-all group"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] bg-[#EFE9DF] overflow-hidden border-b border-[#E4DBCF]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#11100F]/90 backdrop-blur-md text-[#F4EFE7] px-3 py-1 rounded-full text-[10px] font-mono tracking-wider flex items-center gap-1.5 border border-white/10">
                <ShieldCheck size={11} className="text-[#B08A4A]" />
                {item.coaRegistryNumber}
              </div>
            </div>

            {/* Artwork Particulars */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#777] font-mono mb-1">
                  <span>{item.artistName}</span>
                  <span>Acquired {item.acquisitionDate}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#11100F] font-light leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-[#666] font-sans mt-1">
                  {item.medium} {item.dimensions ? `• ${item.dimensions}` : ''}
                </p>
                {item.frame && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white/70 border border-[#E4DBCF]/80 text-[11px] font-mono text-[#8A6A32] flex items-center justify-between">
                    <span>Framing: {item.frame.name}</span>
                    <span>+₹{item.frame.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4DBCF] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#888] tracking-widest block">
                    Acquisition Valuation
                  </span>
                  <span className="font-mono text-base font-semibold text-[#11100F]">
                    ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCoaItem(item)}
                  className="px-4 py-2.5 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2"
                >
                  <Award size={14} className="text-[#B08A4A]" />
                  View Certificate
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
          className="fixed inset-0 z-50 bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl my-8 bg-[#FAF8F5] border-4 border-[#B08A4A] rounded-2xl shadow-2xl p-6 sm:p-10 text-[#11100F] print:m-0 print:border-none print:shadow-none">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCoaItem(null)}
              className="absolute top-4 right-4 text-[#777] hover:text-[#11100F] p-2 rounded-full hover:bg-[#EFE9DF] transition-colors print:hidden"
              aria-label="Close Certificate Modal"
            >
              <X size={20} />
            </button>

            {/* Certificate Header */}
            <div className="text-center pb-6 border-b border-[#B08A4A]/40 relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#11100F] text-[#B08A4A] mb-3 shadow-md">
                <Award size={28} />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase font-light text-[#11100F]">
                Certificate of Authenticity
              </h2>
              <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#B08A4A] mt-1">
                Atelier & Art House • Provenance Registry
              </p>
              <p className="text-xs text-[#666] font-sans mt-2 max-w-md mx-auto italic">
                This document certifies that the work cataloged below is a registered authentic creation verified by Atelier & Art House Curatorial Council.
              </p>
            </div>

            {/* Artwork Details Body */}
            <div className="my-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/60 border border-[#E4DBCF]">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden shrink-0 border border-[#B08A4A]/40 bg-[#EFE9DF]">
                  <Image
                    src={selectedCoaItem.image}
                    alt={selectedCoaItem.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A]">
                    Masterwork Title
                  </span>
                  <h3 className="font-serif text-2xl text-[#11100F] italic">
                    &ldquo;{selectedCoaItem.name}&rdquo;
                  </h3>
                  <p className="text-xs font-sans text-[#444]">
                    Created by <strong className="text-[#11100F]">{selectedCoaItem.artistName}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Medium & Substrate
                  </span>
                  <p className="text-xs font-serif text-[#11100F] mt-0.5 font-medium">
                    {selectedCoaItem.medium}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Dimensions
                  </span>
                  <p className="text-xs font-serif text-[#11100F] mt-0.5 font-medium">
                    {selectedCoaItem.dimensions || 'Archival Museum Standard'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Acquisition Order
                  </span>
                  <p className="text-xs font-mono text-[#11100F] mt-0.5 font-semibold">
                    {selectedCoaItem.orderNumber}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Framing Specification
                  </span>
                  <p className="text-xs font-serif text-[#11100F] mt-0.5">
                    {selectedCoaItem.frame ? selectedCoaItem.frame.name : 'Unframed / Gallery Profile'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Registry Date
                  </span>
                  <p className="text-xs font-serif text-[#11100F] mt-0.5">
                    {selectedCoaItem.acquisitionDate}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block">
                    Provenance Hash
                  </span>
                  <p className="text-xs font-mono text-[#B08A4A] mt-0.5 font-bold">
                    {selectedCoaItem.coaRegistryNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-[#B08A4A]/40 grid grid-cols-2 gap-8 text-center">
              <div className="space-y-2">
                <div className="h-10 border-b border-[#11100F]/30 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-lg text-[#11100F]/80">
                    {selectedCoaItem.artistName}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block">
                  Master Artist Signature
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-10 border-b border-[#11100F]/30 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-base text-[#B08A4A]">
                    Dr. Gayatri Sen, Chief Curator
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block">
                  Atelier Verification Seal
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t border-[#E4DBCF] flex items-center justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#11100F] text-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] transition-colors text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2"
              >
                <Printer size={14} />
                Print Certificate Dossier
              </button>

              <button
                type="button"
                onClick={() => setSelectedCoaItem(null)}
                className="px-5 py-2.5 rounded-xl bg-[#B08A4A] text-white hover:bg-[#11100F] transition-colors text-xs uppercase tracking-wider font-sans font-medium"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
