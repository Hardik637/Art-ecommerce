import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Orders & Shipments | Admin CMS',
  description: 'Manage store orders, customer deliveries, and shipping carrier tracking numbers.',
};

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6 text-black">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
          Fulfillment & Shipments
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          Orders & Delivery Management
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review customer orders, update delivery status, and assign shipping tracking numbers.
        </p>
      </div>

      <AdminOrdersClient />
    </div>
  );
}
