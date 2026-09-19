import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Art Catalog & Acquisitions',
  description:
    'Browse original paintings, lost-wax bronze sculptures, collectible designer figures, and fine art prints. Curated Indian contemporary masterworks.',
  keywords: [
    'buy art online India',
    'paintings catalog',
    'sculptures catalog',
    'collectible figures',
    'one of one art',
    'fine art prints India',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/products`,
  },
  openGraph: {
    title: 'Art Catalog & Acquisitions | Atelier & Art House',
    description:
      'Curated catalog of original paintings, bronze sculptures, designer figures, and limited editions.',
    url: `${SITE_CONFIG.url}/products`,
  },
};

export default function ProductsPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#11100F] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ProductsClient />
      </Suspense>
    </div>
  );
}
