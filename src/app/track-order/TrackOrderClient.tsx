'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import { getOrderById, getAllOrders } from '@/lib/orders';
import { Order } from '@/types/art';

export default function TrackOrderClient() {
  const [orderQuery, setOrderQuery] = useState('ATH-2026-8941');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  React.useEffect(() => {
    async function loadInitial() {
      const initial = await getOrderById('ord-1001');
      if (initial) {
        setSearchedOrder(initial);
        setSearched(true);
      }
    }
    loadInitial();
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = orderQuery.trim();
    if (!cleanQuery) return;

    const found = await getOrderById(cleanQuery);
    if (found) {
      setSearchedOrder(found);
      setSearched(true);
      return;
    }

    const localFound = getAllOrders().find(
      (o) =>
        o.orderNumber.toLowerCase() === cleanQuery.toLowerCase() ||
        o.id.toLowerCase() === cleanQuery.toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanQuery.toLowerCase())
    );

    setSearchedOrder(localFound || null);
    setSearched(true);
  };

  const step =
    searchedOrder?.fulfillmentStatus === 'delivered'
      ? 4
      : searchedOrder?.fulfillmentStatus === 'shipped'
      ? 3
      : 2;

  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/15 bg-neutral-100 text-black text-[10px] font-mono uppercase tracking-widest">
            <Truck size={12} />
            Live Shipment Tracker
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            Track Your Order
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            Enter your Order ID (e.g. ATH-2026-8941) or Tracking Number to view current status and estimated delivery.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-xs">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. ATH-2026-8941"
                className="w-full bg-white border border-neutral-300 rounded-lg pl-11 pr-4 py-3 text-xs font-mono outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors rounded-lg text-xs uppercase tracking-wider font-semibold shrink-0 cursor-pointer"
            >
              Track Order
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Demo ID: <strong>ATH-2026-8941</strong></span>
            <span className="text-black font-medium">All Deliveries Insured</span>
          </div>
        </div>

        {/* Results Card */}
        {searched && searchedOrder && (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs space-y-6">
            {/* Header info */}
            <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Order Number
                </span>
                <span className="font-mono text-sm font-bold text-black">
                  {searchedOrder.orderNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Carrier
                </span>
                <span className="text-xs font-medium text-black">
                  {searchedOrder.courierName || 'Blue Dart Express'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Tracking Number
                </span>
                <span className="font-mono text-xs text-black font-semibold">
                  {searchedOrder.trackingNumber || 'Processing'}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white">
                  <ShieldCheck size={12} />
                  {searchedOrder.fulfillmentStatus}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="p-6 pt-2">
              <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider mb-6 text-center">
                Delivery Progress
              </p>
              <div className="relative flex items-center justify-between max-w-lg mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 w-full" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-mono font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] text-black mt-1.5 font-medium">
                    Confirmed
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      step >= 2 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {step > 2 ? '✓' : '2'}
                  </div>
                  <span className="text-[10px] text-black mt-1.5 font-medium">
                    Packaging
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      step >= 3 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {step > 3 ? '✓' : '3'}
                  </div>
                  <span className="text-[10px] text-black mt-1.5 font-medium">
                    In Transit
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      step >= 4 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    4
                  </div>
                  <span className="text-[10px] text-black mt-1.5 font-medium">
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 pt-0 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Order Items
              </span>
              {searchedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative rounded-md overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-black leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {item.artistName} • {item.medium}
                      </p>
                      {item.frame && (
                        <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                          Frame: {item.frame.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-black">
                      ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                    </span>
                    <Link
                      href="/account/collection"
                      className="text-[10px] text-neutral-600 hover:text-black hover:underline font-mono flex items-center gap-1 mt-1 justify-end"
                    >
                      <CheckCircle2 size={11} /> Authenticity
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Address */}
            <div className="p-5 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-600 flex flex-wrap items-center justify-between gap-3">
              <span>
                Shipping to: {searchedOrder.shippingAddress.fullName}, {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state}
              </span>
              <a
                href="mailto:support@artecommerce.com"
                className="text-black font-semibold hover:underline"
              >
                Need Help with Order? →
              </a>
            </div>
          </div>
        )}

        {searched && !searchedOrder && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-black">Order Not Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              We could not find an order matching &quot;{orderQuery}&quot;. Please check the order ID in your confirmation email or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
