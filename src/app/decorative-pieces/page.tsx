import type { Metadata } from 'next';
import CategoryPageClient from '@/components/CategoryPageClient';
import { SITE_CONFIG } from '@/config/site';
import { getProductsByCategory } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Decorative Pieces | Vessels, Kinetic Balances & Accent Objects',
  description:
    'Thoughtfully selected objects that add detail and personality to refined interiors. Artisanal vessels, kinetic brass balances, and decorative artifacts for consoles, shelves, and desks.',
  keywords: [
    'decorative pieces for home',
    'luxury home decor objects India',
    'brass desk objects',
    'artisanal vessels India',
    'curated table objects',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/decorative-pieces`,
  },
  openGraph: {
    title: 'Decorative Pieces Collection | Zorodoor Art',
    description:
      'Thoughtfully selected objects that add detail and personality to refined interiors.',
    url: `${SITE_CONFIG.url}/decorative-pieces`,
    type: 'website',
  },
};

export default async function DecorativePiecesPage() {
  const products = await getProductsByCategory('decorative-pieces');

  return (
    <CategoryPageClient
      category="decorative-pieces"
      title="Decorative Pieces"
      subtitle="Artisanal terracotta vessels, precision kinetic brass instruments, and tactile tabletop accents."
      description="Thoughtfully selected objects that add detail and personality to refined interiors."
      initialProducts={products}
    />
  );
}
