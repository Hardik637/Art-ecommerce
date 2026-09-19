import type { Metadata } from 'next';
import CategoryPageClient from '@/components/CategoryPageClient';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Wall Art | Paintings, Canvases & Archival Prints',
  description:
    'Curated wall pieces designed to bring character, texture and depth to your interiors. Original paintings on Belgian linen, gold leaf compositions, and limited-edition fine art prints.',
  keywords: [
    'wall art India',
    'buy original paintings online',
    'fine art prints for living room',
    'contemporary Indian wall art',
    'framed canvas art',
    'Atelier Art House',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/wall-art`,
  },
  openGraph: {
    title: 'Wall Art Collection | Atelier & Art House',
    description:
      'Curated wall pieces designed to bring character, texture and depth to your interiors.',
    url: `${SITE_CONFIG.url}/wall-art`,
    type: 'website',
  },
};

export default function WallArtPage() {
  return (
    <CategoryPageClient
      category="wall-art"
      title="Wall Art"
      subtitle="Original oil and acrylic works on Belgian linen, 22K gold leaf compositions, and signed limited-edition prints."
      description="Curated wall pieces designed to bring character, texture and depth to your interiors."
    />
  );
}
