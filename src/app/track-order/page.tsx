import { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Insured Art Shipment | ATELIER & ART HOUSE',
  description:
    'Real-time tracking of fine art acquisitions, archival custom framing progress, and climate-controlled freight across India.',
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
