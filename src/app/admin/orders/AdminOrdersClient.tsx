'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Printer,
  ChevronRight,
  X,
  Copy,
  Check,
  AlertTriangle,
  ArrowUpRight,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { Order } from '@/types/art';

// The 4 Core Stages requested by the user:
// 1. When order anything (New / Placed / In Prep)
// 2. Orders that have been shipped (In Transit)
// 3. Completed orders (Delivered)
// 4. Canceled orders
export type OrderStage = 'placed' | 'shipped' | 'completed' | 'canceled';

const STAGE_CONFIG: Record<
  OrderStage,
  {
    label: string;
    sublabel: string;
    description: string;
    icon: any;
    color: string;
  }
> = {
  placed: {
    label: 'When Order Anything (New)',
    sublabel: 'Placed & In Prep',
    description: 'New orders placed by patrons awaiting packaging, framing, and courier dispatch.',
    icon: Clock,
    color: 'bg-amber-500',
  },
  shipped: {
    label: 'Orders That Have Been Shipped',
    sublabel: 'In Transit',
    description: 'Orders dispatched with couriers with active waybill tracking numbers.',
    icon: Truck,
    color: 'bg-blue-500',
  },
  completed: {
    label: 'Completed Orders',
    sublabel: 'Delivered',
    description: 'Orders successfully delivered to patrons with verified receipt.',
    icon: CheckCircle2,
    color: 'bg-emerald-500',
  },
  canceled: {
    label: 'Canceled Orders',
    sublabel: 'Void / Refunded',
    description: 'Orders canceled before fulfillment or refunded.',
    icon: XCircle,
    color: 'bg-neutral-500',
  },
};

function getOrderStage(status: Order['fulfillmentStatus']): OrderStage {
  switch (status) {
    case 'shipped':
    case 'out_for_delivery':
      return 'shipped';
    case 'delivered':
      return 'completed';
    case 'cancelled':
      return 'canceled';
    case 'pending':
    case 'payment_confirmed':
    case 'confirmed':
    case 'processing':
    case 'in_framing':
    case 'packed':
    default:
      return 'placed';
  }
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStage>('placed');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shipModalOrder, setShipModalOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);

  // Ship Modal Form
  const [courierName, setCourierName] = useState('Blue Dart Art Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipSubmitting, setShipSubmitting] = useState(false);

  // Cancel Modal Form
  const [cancelReason, setCancelReason] = useState('Customer requested cancellation prior to framing');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // Load orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter buckets
  const placedOrders = orders.filter((o) => getOrderStage(o.fulfillmentStatus) === 'placed');
  const shippedOrders = orders.filter((o) => getOrderStage(o.fulfillmentStatus) === 'shipped');
  const completedOrders = orders.filter((o) => getOrderStage(o.fulfillmentStatus) === 'completed');
  const canceledOrders = orders.filter((o) => getOrderStage(o.fulfillmentStatus) === 'canceled');

  const ordersByStage: Record<OrderStage, Order[]> = {
    placed: placedOrders,
    shipped: shippedOrders,
    completed: completedOrders,
    canceled: canceledOrders,
  };

  // Compute stats
  const totalRevenue = (list: Order[]) => list.reduce((sum, o) => sum + o.total, 0);

  // Filter current tab list by search query
  const currentList = ordersByStage[activeTab].filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.shippingAddress.city.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Mark as Shipped action
  const handleOpenShipModal = (order: Order) => {
    setShipModalOrder(order);
    setCourierName(order.courierName || 'Blue Dart Art Express');
    setTrackingNumber(
      order.trackingNumber || `ATH-IN-${Math.floor(100000 + Math.random() * 900000)}`
    );
  };

  const handleConfirmShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipModalOrder) return;
    setShipSubmitting(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: shipModalOrder.id,
          status: 'shipped',
          trackingNumber,
          courierName,
        }),
      });

      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setShipModalOrder(null);
        setActiveTab('shipped'); // Jump to shipped tab to see updated order
      }
    } catch (err) {
      console.error('Failed to ship order:', err);
    } finally {
      setShipSubmitting(false);
    }
  };

  // Mark as Delivered / Completed action
  const handleMarkDelivered = async (order: Order) => {
    if (!confirm(`Confirm completion for order #${order.orderNumber}?`)) return;

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: 'delivered',
        }),
      });

      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setActiveTab('completed');
      }
    } catch (err) {
      console.error('Failed to complete order:', err);
    }
  };

  // Cancel order action
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    setCancelSubmitting(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cancelModalOrder.id,
          action: 'cancel',
          reason: cancelReason,
        }),
      });

      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setCancelModalOrder(null);
        setActiveTab('canceled');
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(
          [
            {
              stage: 'placed',
              title: 'When Order Anything',
              subtitle: 'Placed & In Prep',
              count: placedOrders.length,
              amount: totalRevenue(placedOrders),
              accent: 'border-l-4 border-l-black',
              tag: 'NEEDS DISPATCH',
            },
            {
              stage: 'shipped',
              title: 'Shipped Orders',
              subtitle: 'In Transit',
              count: shippedOrders.length,
              amount: totalRevenue(shippedOrders),
              accent: 'border-l-4 border-l-neutral-700',
              tag: 'ON THE ROAD',
            },
            {
              stage: 'completed',
              title: 'Completed Orders',
              subtitle: 'Delivered',
              count: completedOrders.length,
              amount: totalRevenue(completedOrders),
              accent: 'border-l-4 border-l-neutral-400',
              tag: 'FULFILLED',
            },
            {
              stage: 'canceled',
              title: 'Canceled Orders',
              subtitle: 'Refunded / Void',
              count: canceledOrders.length,
              amount: totalRevenue(canceledOrders),
              accent: 'border-l-4 border-l-neutral-300',
              tag: 'CANCELLED',
            },
          ] as const
        ).map((card) => {
          const isSelected = activeTab === card.stage;
          return (
            <button
              key={card.stage}
              type="button"
              onClick={() => setActiveTab(card.stage)}
              className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black shadow-xl ring-2 ring-black scale-[1.01]'
                  : 'bg-white text-black border-neutral-200 hover:border-black hover:shadow-md'
              } ${card.accent}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-neutral-800 text-neutral-300'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {card.tag}
                </span>
                <span className="font-display font-black text-3xl leading-none">
                  {card.count}
                </span>
              </div>

              <div className="space-y-0.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-white' : 'text-black'
                  }`}
                >
                  {card.title}
                </span>
                <span
                  className={`text-[11px] font-mono block ${
                    isSelected ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {card.subtitle}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/40 flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider ${
                    isSelected ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Total Volume
                </span>
                <span className="font-mono font-bold text-xs">
                  ₹{card.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
        {/* The 4 Stage Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['placed', 'shipped', 'completed', 'canceled'] as OrderStage[]).map((stage) => {
            const isCurrent = activeTab === stage;
            const count = ordersByStage[stage].length;
            const config = STAGE_CONFIG[stage];

            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveTab(stage)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <span>{config.sublabel}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isCurrent ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, tracking..."
              className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-xs text-black outline-none focus:border-black font-sans transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="p-2 bg-white border border-neutral-300 rounded-lg hover:border-black text-neutral-700 hover:text-black transition-colors cursor-pointer shrink-0"
            title="Refresh Orders"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ACTIVE STAGE DESCRIPTION BANNER */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black flex items-center gap-2.5">
            <span>{STAGE_CONFIG[activeTab].label}</span>
            <span className="text-sm font-mono text-neutral-400 font-normal">
              ({currentList.length} {currentList.length === 1 ? 'Order' : 'Orders'})
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {STAGE_CONFIG[activeTab].description}
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {currentList.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-300 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <PackageCheck size={22} />
          </div>
          <h3 className="font-display text-2xl font-black uppercase text-neutral-800 tracking-tight">
            No Orders In This Category
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
            {search
              ? `No orders matching "${search}" in ${STAGE_CONFIG[activeTab].sublabel}.`
              : `Currently there are zero orders in ${STAGE_CONFIG[activeTab].sublabel}.`}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-mono underline text-black cursor-pointer"
            >
              Clear search query
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((order) => {
            const stage = getOrderStage(order.fulfillmentStatus);

            return (
              <div
                key={order.id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-black transition-all group"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(order.orderNumber, order.id)}
                      className="font-mono font-bold text-sm text-black flex items-center gap-1.5 hover:underline cursor-pointer"
                      title="Copy Order ID"
                    >
                      <span>#{order.orderNumber}</span>
                      {copiedId === order.id ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} className="text-neutral-400" />
                      )}
                    </button>

                    <span className="text-[11px] font-mono text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ${
                        stage === 'placed'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : stage === 'shipped'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : stage === 'completed'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {order.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                        Order Value
                      </span>
                      <span className="font-mono font-bold text-sm text-black">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black text-xs font-semibold text-black transition-colors flex items-center gap-1 cursor-pointer bg-white"
                    >
                      <span>Details</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Order Main Content Area */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Item Thumbnails & Descriptions (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="text-xs font-bold text-black truncate">
                                {item.name}
                              </h4>
                              <span className="text-xs font-mono font-bold text-black shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 font-sans">
                              {item.artistName} • {item.medium}
                            </p>
                            {item.frame && (
                              <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                                Frame: {item.frame.name} (+₹{item.frame.price})
                              </p>
                            )}
                            <span className="text-[10px] font-mono text-neutral-400">
                              Qty: {item.quantity} | Dim: {item.dimensions}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer & Shipping Summary */}
                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1">
                      <div>
                        <strong className="text-black">Patron:</strong>{' '}
                        {order.customer.fullName} ({order.customer.email} | {order.customer.phone})
                      </div>
                      <div>
                        <strong className="text-black">Deliver To:</strong>{' '}
                        {order.shippingAddress.addressLine1},{' '}
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                        {order.shippingAddress.pincode}
                      </div>
                      {order.shippingAddress.deliveryNotes && (
                        <div className="text-[11px] text-neutral-500 italic">
                          Notes: &quot;{order.shippingAddress.deliveryNotes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage-Specific Fulfillment Controls (5 Cols) */}
                  <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                        Stage: {STAGE_CONFIG[stage].sublabel}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Method: {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    {/* Stage 1: Placed / When order anything */}
                    {stage === 'placed' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                          <Clock size={15} className="shrink-0 text-amber-700" />
                          <span>Order received & paid. Ready for packing and shipping dispatch.</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenShipModal(order)}
                            className="w-full py-2.5 px-3 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Truck size={14} />
                            <span>Mark Shipped</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-neutral-700"
                          >
                            <XCircle size={14} />
                            <span>Cancel Order</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage 2: Shipped / In Transit */}
                    {stage === 'shipped' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-xs text-blue-950">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{order.courierName || 'Blue Dart Express'}</span>
                            <span className="text-[10px] font-mono bg-blue-200 px-1.5 py-0.5 rounded text-blue-900 font-semibold">
                              IN TRANSIT
                            </span>
                          </div>
                          <div className="font-mono text-black font-bold flex items-center justify-between pt-0.5">
                            <span>AWB: {order.trackingNumber || 'Pending'}</span>
                            {order.trackingNumber && (
                              <button
                                type="button"
                                onClick={() => handleCopy(order.trackingNumber!, `track-${order.id}`)}
                                className="text-neutral-500 hover:text-black"
                                title="Copy Waybill"
                              >
                                {copiedId === `track-${order.id}` ? (
                                  <Check size={12} className="text-emerald-600" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleMarkDelivered(order)}
                            className="w-full py-2.5 px-3 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Completed</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenShipModal(order)}
                            className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 bg-white hover:border-black text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-black"
                          >
                            <span>Edit Tracking</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage 3: Completed Orders */}
                    {stage === 'completed' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>Delivery Completed & Verified</span>
                          </div>
                          <p className="text-[11px] text-emerald-800 font-mono">
                            Delivered via {order.courierName || 'Courier'} ({order.trackingNumber || 'AWB Verified'})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="flex-1 py-2 px-3 rounded-lg border border-neutral-300 bg-white hover:border-black text-xs font-semibold text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={13} />
                            <span>Print Packing Slip</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage 4: Canceled Orders */}
                    {stage === 'canceled' && (
                      <div className="space-y-2">
                        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-800 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-red-600">
                            <XCircle size={14} />
                            <span>Order Voided / Canceled</span>
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            Status: Payment {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: MARK AS SHIPPED / UPDATE TRACKING */}
      {shipModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-neutral-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                  Logistics Dispatch
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                  Dispatch Order #{shipModalOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShipModalOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmShip} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Carrier / Courier Partner *
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-sans text-black outline-none focus:border-black cursor-pointer"
                >
                  <option value="Blue Dart Art Express">Blue Dart Art Express (Special Fragile)</option>
                  <option value="Delhivery Secure White Glove">Delhivery Secure White Glove</option>
                  <option value="DTDC Premium Air Express">DTDC Premium Air Express</option>
                  <option value="FedEx Express Priority">FedEx Express Priority</option>
                  <option value="DHL Art Logistics">DHL Art Logistics</option>
                  <option value="Local Atelier White-Glove Van">Local Atelier White-Glove Van</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Tracking Waybill / Consignment Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-88902144"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-black outline-none focus:border-black"
                />
                <p className="text-[10px] text-neutral-400 font-mono mt-1">
                  Patron will be able to track their artwork in real-time with this ID.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShipModalOrder(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shipSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Truck size={13} />
                  <span>{shipSubmitting ? 'Updating...' : 'Confirm Shipment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL ORDER */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-neutral-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={20} />
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                  Cancel Order #{cancelModalOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Are you sure you want to cancel this order? This will move it to the{' '}
              <strong>Canceled Orders</strong> bucket and release reserved artwork inventory.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Reason for Cancellation
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs outline-none focus:border-black font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-black cursor-pointer"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  disabled={cancelSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {cancelSubmitting ? 'Canceling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL ORDER DETAILS DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 border border-neutral-200 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                  Order Dossier
                </span>
                <h3 className="font-display font-black text-3xl uppercase tracking-tight text-black">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 border border-neutral-300 hover:border-black rounded-lg text-neutral-600 hover:text-black cursor-pointer"
                  title="Print Packing Slip"
                >
                  <Printer size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Patron & Destination Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Customer Information
                </span>
                <p className="font-bold text-black">{selectedOrder.customer.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.customer.email}</p>
                <p className="font-mono text-neutral-600">{selectedOrder.customer.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Delivery Destination
                </span>
                <p className="text-neutral-700">{selectedOrder.shippingAddress.addressLine1}</p>
                {selectedOrder.shippingAddress.addressLine2 && (
                  <p className="text-neutral-600">{selectedOrder.shippingAddress.addressLine2}</p>
                )}
                <p className="text-neutral-700">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  <strong className="font-mono text-black">{selectedOrder.shippingAddress.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                Acquired Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">{item.name}</h4>
                        <p className="text-[11px] text-neutral-500 font-sans">
                          {item.artistName} • {item.medium}
                        </p>
                        {item.frame && (
                          <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                            Frame: {item.frame.name}
                          </p>
                        )}
                        <span className="text-[10px] font-mono text-neutral-400">
                          Qty: {item.quantity} | Dim: {item.dimensions}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-xs text-black block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.frame && (
                        <span className="text-[10px] text-neutral-500 block">
                          +₹{item.frame.price.toLocaleString('en-IN')} frame
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.framingTotal > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Museum Framing</span>
                  <span>₹{selectedOrder.framingTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Insured Art Logistics</span>
                <span>{selectedOrder.shippingFee === 0 ? 'Complimentary' : `₹${selectedOrder.shippingFee}`}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-black">
                <span>Grand Total</span>
                <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <span className="text-[11px] font-mono text-neutral-500">
                Fulfillment: <strong className="uppercase text-black">{selectedOrder.fulfillmentStatus}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
