import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Order Tracking & Fulfillment | Zorodoor Admin CMS',
  description: 'Manage placed orders, in-transit shipments, completed deliveries, and cancellations.',
};

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 text-black font-sans">
      {/* Header with Zorodoor Bebas Neue Display */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-neutral-500 block mb-1 font-semibold">
            Store Fulfillment Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-black uppercase leading-none">
            Order Tracking & Logistics
          </h1>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            Monitor incoming orders, assign dispatch couriers & tracking waybills, and oversee completions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Live Order Synchronizer</span>
        </div>
      </div>

      <AdminOrdersClient />
    </div>
  );
}
