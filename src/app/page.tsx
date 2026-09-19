import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Contemporary Art House, Sculptures & Collectibles`,
  description:
    'Discover museum-grade original paintings, lost-wax bronze sculptures, limited-edition art toys, and fine art prints. Curated for spaces that demand presence.',
  keywords: [
    'contemporary art marketplace India',
    'buy original paintings online India',
    'bronze sculptures for home',
    'limited edition art toys India',
    'Indian contemporary artists',
    'curated art gallery',
    'one of one art',
    'luxury home decor art',
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | Contemporary Art House & Collector Boutique`,
    description:
      'Pieces that change the room. Original works, collectible figures and objects selected for spaces that demand presence.',
    url: SITE_CONFIG.url,
    type: 'website',
    images: [
      {
        url: '/artworks/painting-monsoon-abstract.svg',
        width: 1200,
        height: 630,
        alt: 'Atelier & Art House Digital Exhibition',
      },
    ],
  },
};

export default function Home() {
  return <HomeClient />;
}
