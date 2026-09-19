import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Acquisitions & Art Freight | Atelier CMS',
  description: 'Manage art acquisitions, custom framing statuses, and insured transit tracking numbers.',
};

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
            Fulfillment & Logistics
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
          Acquisitions & Insured Transit
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Review collector orders, update framing status, and assign climate-controlled logistics air waybills.
        </p>
      </div>

      <AdminOrdersClient />
    </div>
  );
}
