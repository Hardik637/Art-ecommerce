import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Order Tracking | Zorodoor Admin CMS',
  description: 'Manage current orders, in-transit shipments, completed deliveries, and cancellations.',
};

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6 text-black font-sans bg-white">
      {/* Clean Header */}
      <div className="border-b border-neutral-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-400 block mb-1 font-semibold">
            Store Fulfillment Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-black uppercase leading-none">
            Order Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Monitor current orders, assign dispatch couriers & tracking waybills, and oversee completions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Live Orders Active</span>
        </div>
      </div>

      <AdminOrdersClient />
    </div>
  );
}
