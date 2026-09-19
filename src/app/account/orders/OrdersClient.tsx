'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, CheckCircle2, Clock, Award, Printer, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
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
        <div className="h-44 bg-[#E4DBCF]/40 rounded-2xl" />
        <div className="h-44 bg-[#E4DBCF]/40 rounded-2xl" />
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto mb-4 text-[#B08A4A]">
          <Package size={32} />
        </div>
        <h2 className="font-serif text-2xl text-[#11100F] font-light mb-2">No Acquisitions Yet</h2>
        <p className="text-xs text-[#777] font-sans max-w-md mx-auto mb-6 leading-relaxed">
          When you acquire an original artwork, fine art print, or sculpture, your order and white-glove transit details will appear here.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium"
        >
          Browse Curated Works <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E4DBCF]">
        {[
          { key: 'all', label: 'All Acquisitions' },
          { key: 'processing', label: 'Archival Preparation & Framing' },
          { key: 'shipped', label: 'In Transit' },
          { key: 'delivered', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 rounded-xl text-xs font-sans whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-[#11100F] text-[#F4EFE7] font-medium shadow-sm'
                : 'bg-[#FAF8F5] text-[#666] border border-[#E4DBCF] hover:text-[#11100F]'
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
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Order Top Bar */}
              <div className="p-5 border-b border-[#E4DBCF] bg-[#F4EFE7]/50 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#888] uppercase tracking-wider text-[10px] block">
                    Acquisition Order
                  </span>
                  <span className="font-semibold text-sm text-[#11100F]">
                    {order.orderNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[#888] uppercase tracking-wider text-[10px] block">
                    Order Date
                  </span>
                  <span className="text-[#333]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-[#888] uppercase tracking-wider text-[10px] block">
                    Payment Method
                  </span>
                  <span className="uppercase text-[#333]">
                    {order.paymentMethod === 'razorpay' ? 'Razorpay (Insured)' : 'Cash on Delivery'}
                  </span>
                </div>

                <div>
                  <span className="text-[#888] uppercase tracking-wider text-[10px] block">
                    Total Valuation
                  </span>
                  <span className="font-bold text-sm text-[#11100F]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#B08A4A]/15 text-[#B08A4A] border border-[#B08A4A]/30">
                    <ShieldCheck size={12} />
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              {/* Transit Timeline Progress Bar */}
              <div className="p-5 border-b border-[#E4DBCF] bg-white/40">
                <p className="text-[11px] font-mono text-[#777] uppercase tracking-wider mb-4">
                  White-Glove Provenance & Shipping Lifecycle
                </p>
                <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                  {/* Track Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E4DBCF] w-full -z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#B08A4A] transition-all duration-500 -z-0"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#11100F] text-[#F4EFE7] flex items-center justify-center text-[10px] font-mono">
                      ✓
                    </div>
                    <span className="text-[10px] font-sans font-medium text-[#11100F] mt-1.5">
                      Order Confirmed
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        step >= 2 ? 'bg-[#11100F] text-[#F4EFE7]' : 'bg-[#E4DBCF] text-[#777]'
                      }`}
                    >
                      {step > 2 ? '✓' : '2'}
                    </div>
                    <span className="text-[10px] font-sans font-medium text-[#11100F] mt-1.5">
                      Archival Prep / Framing
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        step >= 3 ? 'bg-[#11100F] text-[#F4EFE7]' : 'bg-[#E4DBCF] text-[#777]'
                      }`}
                    >
                      {step > 3 ? '✓' : '3'}
                    </div>
                    <span className="text-[10px] font-sans font-medium text-[#11100F] mt-1.5">
                      Insured Art Transit
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        step >= 4 ? 'bg-[#11100F] text-[#F4EFE7]' : 'bg-[#E4DBCF] text-[#777]'
                      }`}
                    >
                      4
                    </div>
                    <span className="text-[10px] font-sans font-medium text-[#11100F] mt-1.5">
                      Delivered
                    </span>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 pt-3 border-t border-[#E4DBCF]/60 flex flex-wrap items-center justify-between text-xs font-mono text-[#666]">
                    <span>
                      Courier: <strong>{order.courierName || 'Blue Dart Fine Art Special'}</strong>
                    </span>
                    <span>
                      Tracking / Air Waybill: <strong>{order.trackingNumber}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Items in Order */}
              <div className="p-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E4DBCF]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-[#E4DBCF] shrink-0 bg-[#EFE9DF]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A]">
                          {item.artistName}
                        </span>
                        <h4 className="font-serif text-lg text-[#11100F] leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#777] font-sans">
                          {item.medium} {item.dimensions ? `• ${item.dimensions}` : ''}
                        </p>
                        {item.frame && (
                          <p className="text-[11px] text-[#B08A4A] font-mono mt-1">
                            Archival Frame: {item.frame.name} (+₹{item.frame.price.toLocaleString('en-IN')})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center self-end">
                      <p className="font-mono text-sm font-semibold text-[#11100F]">
                        Qty: {item.quantity} × ₹{(item.price + (item.frame?.price || 0)).toLocaleString('en-IN')}
                      </p>
                      <Link
                        href="/account/collection"
                        className="inline-flex items-center gap-1 text-[11px] text-[#B08A4A] hover:underline font-mono mt-1"
                      >
                        <Award size={12} />
                        View Certificate of Authenticity
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="p-5 border-t border-[#E4DBCF] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                <div className="text-[#777]">
                  Delivery to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-[#E4DBCF] hover:border-[#11100F] text-[#11100F] font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Printer size={14} />
                    Print Receipt
                  </button>
                  <Link
                    href="/account/collection"
                    className="px-4 py-2 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] font-medium transition-colors"
                  >
                    Private Collection
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
