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
  Award,
} from 'lucide-react';
import { ARTWORKS, ARTISTS } from '@/lib/artCatalog';
import { getAllOrders } from '@/lib/orders';

export default function AdminDashboard() {
  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: 'Total Gross Sales',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      change: '+18.4% this month',
      isPositive: true,
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
      change: 'Active orders',
      isPositive: true,
    },
    {
      title: 'Active Products',
      value: ARTWORKS.length.toString(),
      icon: Palette,
      change: 'Catalog items',
      isPositive: true,
    },
    {
      title: 'Active Artists',
      value: ARTISTS.length.toString(),
      icon: Users,
      change: '6 Resident Creators',
      isPositive: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
            Store Management
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Store revenue, product inventory status, and recent order fulfillments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold shadow-xs"
          >
            <PlusCircle size={14} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-black hover:border-black transition-colors text-xs uppercase tracking-wider font-semibold"
          >
            <Truck size={14} /> Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-black">
                  <Icon size={16} />
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-neutral-500 font-mono text-[10px] tracking-wider uppercase mb-0.5">
                  {stat.title}
                </h3>
                <p className="text-2xl font-extrabold text-black tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-base font-bold text-black">
                  Recent Orders
                </h2>
                <p className="text-xs text-neutral-500">
                  Latest customer orders and dispatch status.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
              >
                All Orders <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-2.5">Order ID</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Product</th>
                    <th className="pb-2.5">Total</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/70 transition-colors">
                      <td className="py-3 font-mono font-semibold text-black">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-black block">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-black font-medium block max-w-[180px] truncate">
                          {order.items[0]?.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          {order.items[0]?.artistName}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-black">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white">
                          {order.fulfillmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <span>Integrated with Blue Dart Express</span>
            <Link
              href="/admin/orders"
              className="text-black font-semibold hover:underline"
            >
              Manage Shipments →
            </Link>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="bg-black text-white rounded-xl p-6 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                  Inventory Highlights
                </span>
                <h3 className="text-base font-bold text-white">
                  Featured Products
                </h3>
              </div>
              <Award size={16} className="text-neutral-400" />
            </div>

            <div className="space-y-3">
              {ARTWORKS.slice(0, 5).map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center gap-3 pb-3 border-b border-neutral-800 last:border-0 last:pb-0"
                >
                  <div className="w-11 h-11 relative rounded-md overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900">
                    <Image
                      src={artwork.thumbnail || artwork.images[0]}
                      alt={artwork.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {artwork.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {artwork.artistName} • {artwork.medium}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs text-white font-bold block">
                      ₹{artwork.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase">
                      {artwork.isOneOfOne ? 'Original' : 'Limited'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-800">
            <Link
              href="/admin/products"
              className="w-full block text-center py-2 rounded-lg bg-neutral-800 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-wider font-semibold text-white"
            >
              View Full Catalog ({ARTWORKS.length} Items)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
