import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IndianRupee,
  ShoppingBag,
  Palette,
  Users,
  ArrowUpRight,
  Truck,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { ARTWORKS, ARTISTS } from '@/lib/artCatalog';
import { getAllOrders } from '@/lib/orders';
import { getCustomProducts } from '@/lib/customProducts';

export default function AdminDashboard() {
  const orders = getAllOrders();
  const customProducts = getCustomProducts();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // 4 Core Stages requested by user
  const placedOrders = orders.filter(
    (o) =>
      o.fulfillmentStatus === 'processing' ||
      o.fulfillmentStatus === 'in_framing' ||
      o.fulfillmentStatus === 'pending' ||
      o.fulfillmentStatus === 'confirmed' ||
      o.fulfillmentStatus === 'packed'
  );
  const shippedOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'shipped' || o.fulfillmentStatus === 'out_for_delivery'
  );
  const completedOrders = orders.filter((o) => o.fulfillmentStatus === 'delivered');
  const canceledOrders = orders.filter((o) => o.fulfillmentStatus === 'cancelled');

  const stats = [
    {
      title: 'Total Gross Volume',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      change: 'Lifetime Bookings',
      tag: 'FINANCIAL',
    },
    {
      title: 'Placed Orders',
      value: placedOrders.length.toString(),
      icon: Clock,
      change: 'Needs Dispatch',
      tag: 'STAGE 1',
    },
    {
      title: 'Shipped Orders',
      value: shippedOrders.length.toString(),
      icon: Truck,
      change: 'In Transit',
      tag: 'STAGE 2',
    },
    {
      title: 'Catalog Pieces',
      value: (ARTWORKS.length + customProducts.length).toString(),
      icon: Palette,
      change: `${customProducts.length} Custom Uploads`,
      tag: 'INVENTORY',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 text-black font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-neutral-500 block mb-1 font-semibold">
            Executive Command Center
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-black uppercase leading-none">
            Store Admin Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Real-time tracking of orders, fulfillment pipeline, and boutique catalog inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle size={14} /> Add New Item
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 bg-white text-black hover:border-black transition-colors text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <Truck size={14} /> Order Tracking
          </Link>
        </div>
      </div>

      {/* 4 STAGE ORDER SHORTCUTS */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold block">
          Order Tracking Pipeline
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                STAGE 1
              </span>
              <span className="font-display font-black text-3xl">{placedOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              When Order Anything
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              New orders awaiting packaging & shipping
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">
                STAGE 2
              </span>
              <span className="font-display font-black text-3xl">{shippedOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              Shipped Orders
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              Active in transit with courier waybills
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                STAGE 3
              </span>
              <span className="font-display font-black text-3xl">{completedOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              Completed Orders
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              Successfully delivered to patrons
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-bold">
                STAGE 4
              </span>
              <span className="font-display font-black text-3xl">{canceledOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              Canceled Orders
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              Voided or refunded transactions
            </p>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center text-black">
                  <Icon size={16} />
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                  {stat.tag}
                </span>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                  {stat.title}
                </span>
                <div className="text-2xl font-display font-black tracking-tight text-black mt-0.5">
                  {stat.value}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Quick Add CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders list (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                Latest Activity
              </span>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-mono uppercase text-neutral-600 hover:text-black flex items-center gap-1 font-bold"
            >
              <span>View All ({orders.length})</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-mono font-bold text-xs text-black">
                    #{order.orderNumber.slice(-4)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">{order.customer.fullName}</h4>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {order.shippingAddress.city} • {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-black block">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded font-semibold">
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Add Product Card (1 col) */}
        <div className="bg-black text-white border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Curator Tooling
            </span>
            <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white leading-tight">
              Add New Artwork Or Object
            </h2>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Upload photos, set pricing, assign resident artists, and configure museum framing specifications for the live store.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Launch Item Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
