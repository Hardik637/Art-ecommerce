import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Consult the Art Concierge & Advisory | ATELIER & ART HOUSE',
  description:
    'Private art advisory, bespoke masterwork commissions, museum framing consultations, and studio viewing appointments.',
  keywords: [
    'Atelier Art House contact',
    'art advisory India',
    'fine art concierge',
    'bespoke painting commission',
    'sculpture consultation',
  ],
};

export default function ContactPage() {
  return <ContactClient />;
}
