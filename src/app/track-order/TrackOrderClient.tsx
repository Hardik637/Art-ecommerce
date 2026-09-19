'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Truck, ShieldCheck, CheckCircle2, Clock, Search, ArrowRight, Award } from 'lucide-react';
import { getOrderById, getAllOrders } from '@/lib/orders';
import { Order } from '@/types/art';

export default function TrackOrderClient() {
  const [orderQuery, setOrderQuery] = useState('ATH-2026-8941');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(getOrderById('ord-1001') || null);
  const [searched, setSearched] = useState(true);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = orderQuery.trim();
    const found =
      getOrderById(cleanQuery) ||
      getAllOrders().find(
        (o) =>
          o.orderNumber.toLowerCase() === cleanQuery.toLowerCase() ||
          o.id.toLowerCase() === cleanQuery.toLowerCase() ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanQuery.toLowerCase())
      );

    setSearchedOrder(found || null);
    setSearched(true);
  };

  const step =
    searchedOrder?.fulfillmentStatus === 'delivered'
      ? 4
      : searchedOrder?.fulfillmentStatus === 'shipped'
      ? 3
      : 2;

  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B08A4A]/40 bg-[#B08A4A]/10 text-[#B08A4A] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Truck size={11} />
            Insured Art Logistics
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light">
            Track Insured Art Shipment
          </h1>
          <p className="text-xs text-[#666] font-sans max-w-md mx-auto leading-relaxed">
            Enter your Atelier Order ID (e.g. ATH-2026-8941) or Air Waybill number to review live transit progress.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
              />
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. ATH-2026-8941"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl pl-11 pr-4 py-3.5 text-xs font-mono outline-none focus:border-[#B08A4A]"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium shrink-0"
            >
              Locate Shipment
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#777] font-mono">
            <span>Demo Waybills: <strong>ATH-2026-8941</strong> or <strong>ATH-2026-8942</strong></span>
            <span className="text-[#059669]">100% Insured</span>
          </div>
        </div>

        {/* Results Card */}
        {searched && searchedOrder && (
          <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm space-y-6">
            {/* Header info */}
            <div className="p-6 bg-[#EFE9DF]/50 border-b border-[#E4DBCF] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777] block">
                  Acquisition Order
                </span>
                <span className="font-mono text-base font-semibold text-[#11100F]">
                  {searchedOrder.orderNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777] block">
                  Carrier Partner
                </span>
                <span className="text-xs font-sans font-medium text-[#11100F]">
                  {searchedOrder.courierName || 'Blue Dart Fine Art Special'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777] block">
                  Air Waybill / Tracking
                </span>
                <span className="font-mono text-xs text-[#B08A4A] font-semibold">
                  {searchedOrder.trackingNumber || 'Pending Dispatch'}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#B08A4A]/15 text-[#8A6A32] border border-[#B08A4A]/30">
                  <ShieldCheck size={11} />
                  {searchedOrder.fulfillmentStatus}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="p-6 pt-2">
              <p className="text-[11px] font-mono uppercase text-[#777] tracking-wider mb-6 text-center">
                Transit Lifecycle Status
              </p>
              <div className="relative flex items-center justify-between max-w-lg mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E4DBCF] w-full" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#B08A4A] transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-[#11100F] text-white flex items-center justify-center text-[10px] font-mono">
                    ✓
                  </div>
                  <span className="text-[10px] font-sans text-[#11100F] mt-1.5 font-medium">
                    Order Placed
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      step >= 2 ? 'bg-[#11100F] text-white' : 'bg-[#E4DBCF] text-[#777]'
                    }`}
                  >
                    {step > 2 ? '✓' : '2'}
                  </div>
                  <span className="text-[10px] font-sans text-[#11100F] mt-1.5 font-medium">
                    Archival Framing
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      step >= 3 ? 'bg-[#11100F] text-white' : 'bg-[#E4DBCF] text-[#777]'
                    }`}
                  >
                    {step > 3 ? '✓' : '3'}
                  </div>
                  <span className="text-[10px] font-sans text-[#11100F] mt-1.5 font-medium">
                    Insured Freight
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      step >= 4 ? 'bg-[#11100F] text-white' : 'bg-[#E4DBCF] text-[#777]'
                    }`}
                  >
                    4
                  </div>
                  <span className="text-[10px] font-sans text-[#11100F] mt-1.5 font-medium">
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Artwork Particulars */}
            <div className="p-6 pt-0 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777] block">
                Consigned Masterwork Items
              </span>
              {searchedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E4DBCF] gap-4"
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
                      <h4 className="font-serif text-base text-[#11100F] font-medium leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#666] font-sans">
                        {item.artistName} • {item.medium}
                      </p>
                      {item.frame && (
                        <p className="text-[11px] text-[#B08A4A] font-mono mt-0.5">
                          Frame: {item.frame.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-semibold text-[#11100F]">
                      ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                    </span>
                    <Link
                      href="/account/collection"
                      className="text-[11px] text-[#B08A4A] hover:underline font-mono flex items-center gap-1 mt-1 justify-end"
                    >
                      <Award size={12} /> Certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Address */}
            <div className="p-5 bg-[#EFE9DF]/30 border-t border-[#E4DBCF] text-xs font-sans text-[#666] flex flex-wrap items-center justify-between gap-3">
              <span>
                Destination: {searchedOrder.shippingAddress.fullName}, {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state}
              </span>
              <a
                href="mailto:concierge@atelierarthouse.com?subject=Inquiry%20Regarding%20Shipment"
                className="text-[#11100F] font-medium hover:underline"
              >
                Contact Art Concierge for Special Instructions →
              </a>
            </div>
          </div>
        )}

        {searched && !searchedOrder && (
          <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-12 text-center space-y-3">
            <h3 className="font-serif text-xl text-[#11100F]">Shipment Record Not Found</h3>
            <p className="text-xs text-[#777] font-sans max-w-sm mx-auto leading-relaxed">
              We could not find an active consignment matching &quot;{orderQuery}&quot;. Please verify the order number in your confirmation email or contact our art concierge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
