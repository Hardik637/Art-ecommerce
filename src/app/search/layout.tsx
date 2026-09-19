import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Catalog & Artists | ATELIER & ART HOUSE',
  description:
    'Search the full Atelier & Art House permanent catalog — original paintings, lost-wax bronze sculptures, collectible figures, and master artist studios.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
