'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Printer,
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
    setEditCourier(order.courierName || 'Blue Dart Express');
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
    <div className="space-y-6 text-black">
      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, or tracking..."
            className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-4 py-2 text-xs outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'processing', label: 'Packaging' },
            { key: 'shipped', label: 'In Transit' },
            { key: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
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
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:border-black transition-all"
            >
              {/* Top Banner */}
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-sm text-black">
                    {order.orderNumber}
                  </span>
                  <span className="text-neutral-500 font-mono">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-neutral-600">
                    Customer: <strong className="text-black">{order.customer.fullName}</strong> ({order.shippingAddress.city})
                  </span>
                  <span className="font-bold text-sm text-black font-mono">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white">
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              {/* Order Particulars & Items */}
              <div className="p-5 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3.5">
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
                        <h4 className="text-xs font-bold text-black">
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
                  ))}

                  <div className="pt-2 text-xs text-neutral-500">
                    <strong className="text-black">Shipping Address:</strong> {order.shippingAddress.fullName},{' '}
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode} (Tel: {order.shippingAddress.phone})
                  </div>
                </div>

                {/* Fulfillment Controls */}
                <div className="w-full md:w-80 bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                      Fulfillment & Tracking
                    </span>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(order)}
                        className="text-black hover:underline font-mono text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Edit2 size={11} /> Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(order.id)}
                        className="text-black hover:underline font-mono text-[11px] flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Save size={11} /> Save
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                          Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as Order['fulfillmentStatus'])
                          }
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black"
                        >
                          <option value="processing">Packaging & Prep</option>
                          <option value="shipped">Shipped / In Transit</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                          Courier
                        </label>
                        <input
                          type="text"
                          value={editCourier}
                          onChange={(e) => setEditCourier(e.target.value)}
                          placeholder="e.g. Blue Dart"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                          Tracking #
                        </label>
                        <input
                          type="text"
                          value={editTracking}
                          onChange={(e) => setEditTracking(e.target.value)}
                          placeholder="e.g. ATH-IN-889021"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-mono outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <p className="text-neutral-600">
                        Carrier: <strong className="text-black">{order.courierName || 'Blue Dart'}</strong>
                      </p>
                      <p className="font-mono text-black font-semibold">
                        Tracking: {order.trackingNumber || 'Pending Waybill'}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-black font-mono text-[11px] cursor-pointer"
                    >
                      <Printer size={12} /> Print Order
                    </button>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Insured Delivery
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
