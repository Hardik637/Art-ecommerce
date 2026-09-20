import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { SITE_CONFIG } from '@/config/site';
import { getAllProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'All Art & Home Décor Products',
  description:
    'Browse original paintings, sculptures, and decorative pieces curated for modern spaces. Nationwide delivery with authenticity guarantee.',
  keywords: [
    'buy art online India',
    'paintings catalog',
    'sculptures catalog',
    'decorative pieces',
    'modern wall art',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/products`,
  },
  openGraph: {
    title: 'All Art & Home Décor Products | Zorodoor Art',
    description:
      'Curated catalog of wall art, sculptures, and decorative pieces for modern interiors.',
    url: `${SITE_CONFIG.url}/products`,
  },
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#11100F] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ProductsClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
