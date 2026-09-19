import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchClient from './SearchClient';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Search Artworks, Sculptures & Artists',
  description:
    'Search the Atelier catalog for original paintings, lost-wax bronze sculptures, collectible figures, and fine art prints.',
  keywords: [
    'search art India',
    'find paintings',
    'find bronze sculptures',
    'contemporary art search',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/search`,
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-[#F4EFE7]">
          <div className="w-8 h-8 border-2 border-[#11100F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
