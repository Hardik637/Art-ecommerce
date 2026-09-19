import type { Metadata } from 'next';
import CategoryPageClient from '@/components/CategoryPageClient';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sculptures | Bronze, Carved Stone & Designer Figures',
  description:
    'Distinctive sculptural pieces that bring form and character into your space. Lost-wax cast bronzes, crystalline marble silhouettes, and limited-edition designer figures.',
  keywords: [
    'sculptures for home decor India',
    'buy bronze sculptures online',
    'collectible art toys India',
    'marble sculptures',
    'lost-wax bronze art',
    'Atelier Art House',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/sculptures`,
  },
  openGraph: {
    title: 'Sculptures Collection | Atelier & Art House',
    description:
      'Distinctive sculptural pieces that bring form and character into your space.',
    url: `${SITE_CONFIG.url}/sculptures`,
    type: 'website',
  },
};

export default function SculpturesPage() {
  return (
    <CategoryPageClient
      category="sculptures"
      title="Sculptures"
      subtitle="Hand-cast lost-wax bronzes, crystalline marble forms, and limited cybernetic mythological figures."
      description="Distinctive sculptural pieces that bring form and character into your space."
    />
  );
}
