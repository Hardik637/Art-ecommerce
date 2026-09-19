import { Metadata } from 'next';
import AccountOverviewClient from './AccountOverviewClient';

export const metadata: Metadata = {
  title: 'Cabinet Overview | ATELIER & ART HOUSE',
  description: 'View your art collection portfolio, valuation, recent acquisitions, and followed studios.',
};

export default function AccountPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-[#11100F]">
          Cabinet Portfolio & Provenance Overview
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Real-time record of acquired original works, followed master artists, and insured art transit.
        </p>
      </div>

      <AccountOverviewClient />
    </div>
  );
}
