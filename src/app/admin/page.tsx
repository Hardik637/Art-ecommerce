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
  ShieldCheck,
} from 'lucide-react';
import { ARTWORKS, ARTISTS } from '@/lib/artCatalog';
import { getAllOrders } from '@/lib/orders';

export default function AdminDashboard() {
  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: 'Gross Acquisition Sales',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      change: '+18.4% this month',
      isPositive: true,
    },
    {
      title: 'Total Acquisitions',
      value: orders.length.toString(),
      icon: ShoppingBag,
      change: '2 pending framing',
      isPositive: true,
    },
    {
      title: 'Live Catalog Artworks',
      value: ARTWORKS.length.toString(),
      icon: Palette,
      change: '36 Masterworks Live',
      isPositive: true,
    },
    {
      title: 'Resident Master Artists',
      value: ARTISTS.length.toString(),
      icon: Users,
      change: '6 Studios Active',
      isPositive: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Curatorial Command & Provenance
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
            Atelier Curatorial Console
          </h1>
          <p className="text-xs text-[#777] font-sans mt-1">
            Real-time telemetry on art acquisitions, certified framing workflows, and master studio production.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium shadow-sm"
          >
            <PlusCircle size={14} /> Catalog Masterwork
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E4DBCF] bg-[#FAF8F5] text-[#11100F] hover:border-[#11100F] transition-colors text-xs uppercase tracking-wider font-sans font-medium"
          >
            <Truck size={14} /> Manage Freight
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E4DBCF] shadow-sm flex flex-col justify-between hover:border-[#B08A4A]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-[#EFE9DF] rounded-xl flex items-center justify-center text-[#B08A4A]">
                  <Icon size={18} />
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#B08A4A]/10 text-[#8A6A32]">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-[#777] font-mono text-[10px] tracking-wider uppercase mb-1">
                  {stat.title}
                </h3>
                <p className="font-serif text-3xl text-[#11100F]">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Acquisitions Table + Top Works */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Acquisitions */}
        <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl border border-[#E4DBCF] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E4DBCF]">
              <div>
                <h2 className="font-serif text-xl text-[#11100F] font-light">
                  Recent Acquisitions & Invoices
                </h2>
                <p className="text-xs text-[#777] font-sans">
                  Orders requiring archival framing preparation or courier dispatch.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-sans font-medium text-[#B08A4A] hover:underline flex items-center gap-1"
              >
                All Orders <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#E4DBCF] text-[#888] font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Collector</th>
                    <th className="pb-3">Artwork Item</th>
                    <th className="pb-3">Valuation</th>
                    <th className="pb-3 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DBCF]/60">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3.5 font-mono font-medium text-[#11100F]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <span className="font-medium text-[#11100F] block">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[10px] text-[#777] font-mono block">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#11100F] block max-w-[180px] truncate">
                          {order.items[0]?.name}
                        </span>
                        <span className="text-[10px] text-[#B08A4A] font-mono block">
                          {order.items[0]?.artistName}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-[#11100F]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#B08A4A]/15 text-[#8A6A32]">
                          {order.fulfillmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E4DBCF] flex items-center justify-between text-xs text-[#777]">
            <span>Blue Dart & Sequel Art Logistics connected</span>
            <Link
              href="/admin/orders"
              className="text-[#11100F] font-medium hover:underline"
            >
              Update Waybills →
            </Link>
          </div>
        </div>

        {/* Top Performing Masterworks */}
        <div className="bg-[#11100F] text-[#F4EFE7] rounded-2xl p-6 border border-[#292622] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A]">
                  Curator Highlights
                </span>
                <h3 className="font-serif text-xl text-[#FAF8F5] font-light">
                  Top Gallery Pieces
                </h3>
              </div>
              <Award size={18} className="text-[#B08A4A]" />
            </div>

            <div className="space-y-4">
              {ARTWORKS.slice(0, 5).map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0"
                >
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#292622]">
                    <Image
                      src={artwork.thumbnail || artwork.images[0]}
                      alt={artwork.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm text-[#FAF8F5] truncate">
                      {artwork.name}
                    </h4>
                    <p className="text-[10px] text-[#A8A096] truncate">
                      {artwork.artistName} • {artwork.medium}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs text-[#B08A4A] font-semibold block">
                      ₹{artwork.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-mono text-[#888] uppercase">
                      {artwork.isOneOfOne ? '1/1 Original' : 'Limited'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/10">
            <Link
              href="/admin/products"
              className="w-full block text-center py-2.5 rounded-xl bg-white/5 hover:bg-[#B08A4A] hover:text-white transition-colors text-xs uppercase tracking-wider font-sans font-medium text-[#FAF8F5]"
            >
              View Full 36 Masterwork Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
