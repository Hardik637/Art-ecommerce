'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ChevronRight,
  X,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Order } from '@/types/art';

// The 4 Core Stages requested by the user:
// 1. Current Orders (New / Placed / In Prep)
// 2. Orders that have been shipped (In Transit)
// 3. Completed orders (Delivered)
// 4. Canceled orders
export type OrderStage = 'placed' | 'shipped' | 'completed' | 'canceled';

const STAGE_CONFIG: Record<
  OrderStage,
  {
    label: string;
    description: string;
    icon: any;
  }
> = {
  placed: {
    label: 'Current Orders',
    description: 'Incoming and newly placed orders awaiting framing, packaging, and courier dispatch.',
    icon: Clock,
  },
  shipped: {
    label: 'Shipped Orders',
    description: 'Orders dispatched with couriers with active waybill tracking numbers.',
    icon: Truck,
  },
  completed: {
    label: 'Completed Orders',
    description: 'Orders successfully delivered to patrons with verified receipt.',
    icon: CheckCircle2,
  },
  canceled: {
    label: 'Canceled Orders',
    description: 'Orders canceled before fulfillment or refunded.',
    icon: XCircle,
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
        setActiveTab('shipped');
      }
    } catch (err) {
      console.error('Failed to ship order:', err);
    } finally {
      setShipSubmitting(false);
    }
  };

  // Mark as Delivered / Completed action
  const handleMarkDelivered = async (order: Order) => {
    if (!confirm(`Confirm delivery completion for order #${order.orderNumber}?`)) return;

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
    <div className="space-y-6 font-sans text-black">
      {/* ── SINGLE SMALL COMPACT NAV BAR WITH THE 4 OPTIONS AND SEARCH BAR ── */}
      <div className="bg-white border border-neutral-200 rounded-xl p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        {/* The 4 Stage Navigation Options */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(
            [
              { stage: 'placed', label: 'Current Orders', count: placedOrders.length },
              { stage: 'shipped', label: 'Shipped Orders', count: shippedOrders.length },
              { stage: 'completed', label: 'Completed Orders', count: completedOrders.length },
              { stage: 'canceled', label: 'Canceled Orders', count: canceledOrders.length },
            ] as const
          ).map((item) => {
            const isCurrent = activeTab === item.stage;

            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => setActiveTab(item.stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-black text-white shadow-xs font-bold'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isCurrent
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-neutral-800 border border-neutral-200'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Refresh Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, customers, tracking..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-black outline-none focus:border-black focus:bg-white font-sans transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="p-1.5 bg-white border border-neutral-300 rounded-lg hover:border-black text-neutral-600 hover:text-black transition-colors cursor-pointer shrink-0"
            title="Refresh Orders"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      {currentList.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl p-12 text-center space-y-2">
          <h3 className="font-display font-black text-xl uppercase text-neutral-800 tracking-tight">
            No Orders In {STAGE_CONFIG[activeTab].label}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
            {search
              ? `No orders matching "${search}".`
              : `There are currently 0 orders in this category.`}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-mono underline text-black cursor-pointer pt-1"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {currentList.map((order) => {
            const stage = getOrderStage(order.fulfillmentStatus);

            return (
              <div
                key={order.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs hover:border-black transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-3.5 sm:p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(order.orderNumber, order.id)}
                      className="font-mono font-bold text-sm text-black flex items-center gap-1.5 hover:underline cursor-pointer"
                      title="Copy Order ID"
                    >
                      <span>#{order.orderNumber}</span>
                      {copiedId === order.id ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} className="text-neutral-400" />
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

                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {order.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-black">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-2.5 py-1 rounded-md border border-neutral-300 hover:border-black text-[11px] font-semibold text-black transition-colors flex items-center gap-1 cursor-pointer bg-white"
                    >
                      <span>Details</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Order Main Content Area */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start bg-white">
                  {/* Item Thumbnails & Descriptions (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="space-y-2.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3.5">
                          <div className="w-13 h-13 relative rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-50">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="52px"
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
                    <div className="pt-2.5 border-t border-neutral-100 text-xs text-neutral-600 space-y-0.5">
                      <div>
                        <strong className="text-black">Patron:</strong>{' '}
                        {order.customer.fullName} ({order.customer.phone})
                      </div>
                      <div>
                        <strong className="text-black">Deliver To:</strong>{' '}
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                      {order.shippingAddress.deliveryNotes && (
                        <div className="text-[11px] text-neutral-500 italic">
                          Notes: &quot;{order.shippingAddress.deliveryNotes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage-Specific Fulfillment Controls (5 Cols) */}
                  <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-bold">
                        Stage: {STAGE_CONFIG[stage].label}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Stage 1: Current Orders */}
                    {stage === 'placed' && (
                      <div className="space-y-2.5">
                        <p className="text-xs text-neutral-600 font-sans">
                          Order received & ready for packaging/framing dispatch.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenShipModal(order)}
                            className="py-2 px-3 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Truck size={13} />
                            <span>Mark Shipped</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="py-2 px-3 rounded-lg border border-neutral-300 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-neutral-700"
                          >
                            <XCircle size={13} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage 2: Shipped Orders */}
                    {stage === 'shipped' && (
                      <div className="space-y-2.5">
                        <div className="p-2.5 bg-white border border-neutral-200 rounded-lg space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-black">{order.courierName || 'Blue Dart Express'}</span>
                            <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                              IN TRANSIT
                            </span>
                          </div>
                          <div className="font-mono text-neutral-800 font-bold flex items-center justify-between">
                            <span>AWB: {order.trackingNumber || 'Pending'}</span>
                            {order.trackingNumber && (
                              <button
                                type="button"
                                onClick={() => handleCopy(order.trackingNumber!, `track-${order.id}`)}
                                className="text-neutral-400 hover:text-black"
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

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleMarkDelivered(order)}
                            className="py-2 px-3 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 size={13} />
                            <span>Delivered</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenShipModal(order)}
                            className="py-2 px-3 rounded-lg border border-neutral-300 bg-white hover:border-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-black"
                          >
                            <span>Edit AWB</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage 3: Completed Orders */}
                    {stage === 'completed' && (
                      <div className="space-y-2">
                        <div className="p-2.5 bg-white border border-neutral-200 rounded-lg text-xs space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>Delivered to Customer</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            Delivered via {order.courierName || 'Courier'} ({order.trackingNumber || 'Verified'})
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="w-full py-1.5 px-3 rounded-lg border border-neutral-300 bg-white hover:border-black text-xs font-semibold text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer size={12} />
                          <span>Print Slip</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 4: Canceled Orders */}
                    {stage === 'canceled' && (
                      <div className="p-2.5 bg-white border border-neutral-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-600">
                          <XCircle size={13} />
                          <span>Order Canceled</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Payment Status: {order.paymentStatus}
                        </p>
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                  Fulfillment Dispatch
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
                  Carrier Partner *
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-sans text-black outline-none focus:border-black cursor-pointer"
                >
                  <option value="Blue Dart Art Express">Blue Dart Art Express</option>
                  <option value="Delhivery Secure White Glove">Delhivery Secure White Glove</option>
                  <option value="DTDC Premium Air Express">DTDC Premium Air Express</option>
                  <option value="FedEx Express Priority">FedEx Express Priority</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="Local Atelier Van">Local Atelier Van</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Tracking Waybill / Consignment # *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-88902144"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-black outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShipModalOrder(null)}
                  className="px-3 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shipSubmitting}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Truck size={13} />
                  <span>{shipSubmitting ? 'Saving...' : 'Confirm Shipment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL ORDER */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
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

            <p className="text-xs text-neutral-600 font-sans">
              Are you sure you want to cancel this order? This will move it to Canceled Orders.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Cancellation Reason
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs outline-none focus:border-black font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-3 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-black cursor-pointer"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  disabled={cancelSubmitting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {cancelSubmitting ? 'Canceling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-5 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                  Order Dossier
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 border border-neutral-300 hover:border-black rounded-lg text-neutral-600 hover:text-black cursor-pointer"
                  title="Print Packing Slip"
                >
                  <Printer size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block">
                  Customer
                </span>
                <p className="font-bold text-black">{selectedOrder.customer.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.customer.email}</p>
                <p className="font-mono text-neutral-600">{selectedOrder.customer.phone}</p>
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block">
                  Shipping Address
                </span>
                <p className="text-neutral-700">{selectedOrder.shippingAddress.addressLine1}</p>
                <p className="text-neutral-700">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  <strong className="font-mono text-black">{selectedOrder.shippingAddress.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden border border-neutral-200 shrink-0 bg-neutral-50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">{item.name}</h4>
                        <p className="text-[11px] text-neutral-500 font-sans">
                          {item.artistName} • {item.medium}
                        </p>
                        {item.frame && (
                          <p className="text-[10px] text-neutral-600 font-mono">
                            Frame: {item.frame.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-xs text-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between font-bold text-sm text-black font-mono">
              <span>Grand Total</span>
              <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
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
