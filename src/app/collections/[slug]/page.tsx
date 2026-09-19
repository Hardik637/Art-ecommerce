import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CURATED_COLLECTIONS,
  getCollectionBySlug,
  ARTWORKS,
} from '@/lib/artCatalog';
import CollectionDetailClient from './CollectionDetailClient';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  CURATED_COLLECTIONS.forEach((col) => {
    paths.push({ slug: col.slug });
    paths.push({ slug: col.id });
  });
  return paths;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found | ATELIER & ART HOUSE',
    };
  }

  return {
    title: `${collection.name} | Curated Exhibition | ATELIER & ART HOUSE`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} — Curated by ${collection.curator}`,
      description: collection.description,
      images: [collection.coverImage],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  // Find all artworks in this curated collection
  const artworks = ARTWORKS.filter((a) => collection.productIds.includes(a.id));

  return <CollectionDetailClient collection={collection} artworks={artworks} />;
}
