import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acquisition Checkout & Provenance Confirmation | ATELIER & ART HOUSE',
  description:
    'Complete your fine art acquisition with verified provenance registration, bespoke museum framing, and 100% insured art transit.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
