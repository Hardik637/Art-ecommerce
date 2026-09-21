import React from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Palette,
  ArrowUpRight,
  Truck,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ARTWORKS } from '@/lib/artCatalog';
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
      title: 'Current Orders',
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
    <div className="max-w-7xl mx-auto pb-20 space-y-7 text-black font-sans bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-400 block mb-1 font-semibold">
            Store Management Center
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-black uppercase leading-none">
            Admin Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-medium">
            Real-time tracking of current orders, fulfillment progress, and catalog inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-bold shadow-2xs cursor-pointer"
          >
            <PlusCircle size={14} /> Add Item
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-black hover:border-black transition-colors text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <Truck size={14} /> Order Tracking
          </Link>
        </div>
      </div>

      {/* 4 STAGE ORDER SHORTCUTS */}
      <div className="space-y-2.5">
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold block">
          Order Pipeline Stages
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/orders"
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-2xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                STAGE 1
              </span>
              <span className="font-display font-black text-2xl">{placedOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              Current Orders
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              New orders awaiting packaging & dispatch
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-2xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                STAGE 2
              </span>
              <span className="font-display font-black text-2xl">{shippedOrders.length}</span>
            </div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
              Shipped Orders
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              In transit with active tracking codes
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-2xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                STAGE 3
              </span>
              <span className="font-display font-black text-2xl">{completedOrders.length}</span>
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
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-2xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                STAGE 4
              </span>
              <span className="font-display font-black text-2xl">{canceledOrders.length}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-black">
                  <Icon size={15} />
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                  {stat.tag}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                  {stat.title}
                </span>
                <div className="text-xl font-display font-black tracking-tight text-black mt-0.5">
                  {stat.value}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Quick Add CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                Latest Activity
              </span>
              <h2 className="font-display font-black text-xl uppercase tracking-tight text-black">
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
              <div key={order.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center font-mono font-bold text-[11px] text-black">
                    #{order.orderNumber.slice(-4)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{order.customer.fullName}</h4>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {order.shippingAddress.city} • {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-black block">
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

        {/* Quick Add Product Card (1 col) - Majorly White */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Inventory Tool
            </span>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black leading-tight">
              Add New Catalog Piece
            </h2>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Upload photos, set pricing, assign medium details, and publish live to the boutique.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Launch Item Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
