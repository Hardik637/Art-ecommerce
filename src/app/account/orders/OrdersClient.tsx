'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShieldCheck, Printer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getAllOrders } from '@/lib/orders';
import { Order } from '@/types/art';

export default function OrdersClient() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');
  const { collectedOrders } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseOrders = getAllOrders();
  const allOrders: Order[] = [
    ...collectedOrders,
    ...baseOrders.filter((bo) => !collectedOrders.some((co) => co.id === bo.id)),
  ];

  const filteredOrders = allOrders.filter((order) => {
    if (filter === 'all') return true;
    return order.fulfillmentStatus === filter;
  });

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-neutral-100 rounded-xl" />
        <div className="h-40 bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4 text-black">
          <Package size={28} />
        </div>
        <h2 className="text-xl font-bold text-black mb-1">No Orders Found</h2>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mb-5 leading-relaxed">
          When you purchase wall art, sculptures, or decorative pieces, your order status and tracking details will appear here.
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
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'processing', label: 'Processing' },
          { key: 'shipped', label: 'In Transit' },
          { key: 'delivered', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === tab.key
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const step =
            order.fulfillmentStatus === 'delivered'
              ? 4
              : order.fulfillmentStatus === 'shipped'
              ? 3
              : 2;

          return (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Order Top Bar */}
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-mono">
                    Order Number
                  </span>
                  <span className="font-bold font-mono text-sm text-black">
                    {order.orderNumber}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-mono">
                    Date
                  </span>
                  <span className="text-neutral-700">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-mono">
                    Payment
                  </span>
                  <span className="uppercase text-neutral-700 font-medium">
                    {order.paymentMethod === 'razorpay' ? 'Prepaid (Razorpay)' : 'Cash on Delivery'}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block font-mono">
                    Total
                  </span>
                  <span className="font-bold text-sm text-black font-mono">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black text-white">
                    <ShieldCheck size={12} />
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              {/* Transit Timeline Progress Bar */}
              <div className="p-5 border-b border-neutral-200 bg-white">
                <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-4">
                  Fulfillment Status
                </p>
                <div className="relative flex items-center justify-between max-w-xl mx-auto">
                  {/* Track Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 w-full" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black transition-all duration-500"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-mono font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] text-black mt-1.5 font-medium">
                      Confirmed
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        step >= 2 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {step > 2 ? '✓' : '2'}
                    </div>
                    <span className="text-[10px] text-black mt-1.5 font-medium">
                      Packaging
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        step >= 3 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {step > 3 ? '✓' : '3'}
                    </div>
                    <span className="text-[10px] text-black mt-1.5 font-medium">
                      Shipped
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
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

                {order.trackingNumber && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500">
                    <span>
                      Courier: <strong className="text-black">{order.courierName || 'Blue Dart'}</strong>
                    </span>
                    <span>
                      Tracking: <strong className="text-black">{order.trackingNumber}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Items in Order */}
              <div className="p-5 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                          {item.artistName}
                        </span>
                        <h4 className="text-xs font-semibold text-black leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          {item.medium} {item.dimensions ? `• ${item.dimensions}` : ''}
                        </p>
                        {item.frame && (
                          <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                            Frame: {item.frame.name} (+₹{item.frame.price.toLocaleString('en-IN')})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center self-end">
                      <p className="font-mono text-xs font-bold text-black">
                        Qty: {item.quantity} × ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                      </p>
                      <Link
                        href="/account/collection"
                        className="inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-black hover:underline font-mono mt-1"
                      >
                        <CheckCircle2 size={11} />
                        Certificate of Authenticity
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="text-neutral-500 text-[11px]">
                  Shipping to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:border-black text-black font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <Printer size={13} />
                    Receipt
                  </button>
                  <Link
                    href="/account/collection"
                    className="px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 font-semibold transition-colors text-xs"
                  >
                    My Collection
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
