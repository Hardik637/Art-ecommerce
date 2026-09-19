import { Metadata } from 'next';
import CollectionClient from './CollectionClient';

export const metadata: Metadata = {
  title: 'My Collection & Certificates | ATELIER & ART HOUSE',
  description: 'View your private art collection, provenance registry, and digitally signed Certificates of Authenticity.',
};

export default function CollectionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-[#11100F]">
          Private Collection & Provenance Dossier
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Catalog of your acquired original works, archival prints, and sculptures with authenticable certificates.
        </p>
      </div>

      <CollectionClient />
    </div>
  );
}
