import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Insured Consignment | ATELIER & ART HOUSE',
  description:
    'Track your fine art shipment, archival framing progress, and climate-controlled art freight in real time across India.',
  keywords: [
    'track art shipment',
    'fine art freight tracking',
    'Atelier consignment tracking',
  ],
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
