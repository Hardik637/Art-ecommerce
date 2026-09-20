import { Metadata } from 'next';
import OrdersClient from './OrdersClient';

export const metadata: Metadata = {
  title: 'My Acquisitions & Orders | ATELIER & ART HOUSE',
  description: 'Track and manage your fine art acquisitions, custom framing progress, and insured white-glove shipments.',
};

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-black uppercase tracking-tight">
          Acquisitions & Insured Transit
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Monitor archival preparation, custom wood float framing, and climate-controlled art delivery.
        </p>
      </div>

      <OrdersClient />
    </div>
  );
}
