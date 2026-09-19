'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Truck,
  Check,
  Search,
  Printer,
  ShieldCheck,
  ExternalLink,
  Edit2,
  Save,
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/orders';
import { Order } from '@/types/art';

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>(getAllOrders());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<Order['fulfillmentStatus']>('processing');
  const [editTracking, setEditTracking] = useState('');
  const [editCourier, setEditCourier] = useState('');

  const handleStartEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setEditStatus(order.fulfillmentStatus);
    setEditTracking(order.trackingNumber || '');
    setEditCourier(order.courierName || 'Blue Dart Art Special Express');
  };

  const handleSaveEdit = (orderId: string) => {
    const updated = updateOrderStatus(orderId, editStatus, editTracking, editCourier);
    if (updated) {
      setOrders([...getAllOrders()]);
    }
    setEditingOrderId(null);
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.fulfillmentStatus === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, collector name, or waybill..."
            className="w-full bg-[#FAF8F5] border border-[#E4DBCF] rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans outline-none focus:border-[#B08A4A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'processing', label: 'In Framing Prep' },
            { key: 'shipped', label: 'In Transit' },
            { key: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-sans whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-[#11100F] text-[#F4EFE7] font-medium'
                  : 'bg-[#FAF8F5] text-[#666] border border-[#E4DBCF] hover:text-[#11100F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const isEditing = editingOrderId === order.id;

          return (
            <div
              key={order.id}
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm hover:border-[#B08A4A]/50 transition-all"
            >
              {/* Top Banner */}
              <div className="p-5 bg-[#EFE9DF]/40 border-b border-[#E4DBCF] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-[#11100F]">
                    {order.orderNumber}
                  </span>
                  <span className="text-[#777]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[#555]">
                    Collector: <strong>{order.customer.fullName}</strong> ({order.shippingAddress.city})
                  </span>
                  <span className="font-bold text-sm text-[#11100F]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#B08A4A]/15 text-[#8A6A32]">
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              {/* Order Particulars & Items */}
              <div className="p-5 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-[#E4DBCF] shrink-0 bg-[#EFE9DF]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-[#11100F] font-medium">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#666] font-sans">
                          {item.artistName} • {item.medium}
                        </p>
                        {item.frame && (
                          <p className="text-[10px] text-[#B08A4A] font-mono mt-0.5">
                            Archival Frame: {item.frame.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-xs text-[#777] font-sans">
                    <strong>Shipping To:</strong> {order.shippingAddress.fullName},{' '}
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode} (Tel: {order.shippingAddress.phone})
                  </div>
                </div>

                {/* Fulfillment Controls */}
                <div className="w-full md:w-80 bg-white/80 border border-[#E4DBCF] rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E4DBCF]/60 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#777]">
                      Fulfillment & Waybill
                    </span>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(order)}
                        className="text-[#B08A4A] hover:underline font-mono text-[11px] flex items-center gap-1"
                      >
                        <Edit2 size={11} /> Edit Status
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(order.id)}
                        className="text-[#059669] hover:underline font-mono text-[11px] flex items-center gap-1 font-semibold"
                      >
                        <Save size={11} /> Save
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#777] mb-1">
                          Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as Order['fulfillmentStatus'])
                          }
                          className="w-full bg-[#FAF8F5] border border-[#E4DBCF] rounded-lg p-2 text-xs font-sans"
                        >
                          <option value="processing">In Archival Prep / Framing</option>
                          <option value="shipped">In Insured Transit (Shipped)</option>
                          <option value="delivered">Delivered to Patron</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#777] mb-1">
                          Courier Partner
                        </label>
                        <input
                          type="text"
                          value={editCourier}
                          onChange={(e) => setEditCourier(e.target.value)}
                          placeholder="e.g. Blue Dart Art Express"
                          className="w-full bg-[#FAF8F5] border border-[#E4DBCF] rounded-lg p-2 text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#777] mb-1">
                          Air Waybill / Tracking #
                        </label>
                        <input
                          type="text"
                          value={editTracking}
                          onChange={(e) => setEditTracking(e.target.value)}
                          placeholder="e.g. ATH-IN-889021"
                          className="w-full bg-[#FAF8F5] border border-[#E4DBCF] rounded-lg p-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <p className="text-[#555]">
                        Courier: <strong>{order.courierName || 'Blue Dart Fine Art Special'}</strong>
                      </p>
                      <p className="font-mono text-[#11100F]">
                        Waybill: <strong>{order.trackingNumber || 'Pending Waybill'}</strong>
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E4DBCF]/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 text-[#777] hover:text-[#11100F] font-mono text-[11px]"
                    >
                      <Printer size={12} /> Print Manifest
                    </button>
                    <span className="text-[10px] font-mono text-[#059669]">
                      Insured Freight
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
