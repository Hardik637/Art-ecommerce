import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consult the Art Concierge & Private Advisory | ATELIER & ART HOUSE',
  description:
    'Reach out to our senior curatorial council for bespoke painting commissions, museum framing consultations, space simulations, and private studio viewings.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
