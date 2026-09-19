import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARTWORKS, getArtworkById, getArtworkBySlug } from '@/lib/artCatalog';
import ArtworkDetailClient from './ArtworkDetailClient';
import { SITE_CONFIG } from '@/config/site';

export async function generateStaticParams() {
  const params: Array<{ id: string }> = [];
  for (const art of ARTWORKS) {
    params.push({ id: art.id });
    if (art.slug && art.slug !== art.id) {
      params.push({ id: art.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = getArtworkBySlug(id) || getArtworkById(id);

  if (!artwork) {
    return { title: 'Masterwork Not Found | Atelier' };
  }

  const title = `${artwork.name} by ${artwork.artistName}`;
  const description = `${artwork.shortDescription} Explore ${artwork.name} at Atelier & Art House. ${artwork.medium}. Dimensions: ${artwork.dimensions.width}×${artwork.dimensions.height} cm.`;

  return {
    title,
    description,
    keywords: [
      artwork.name,
      artwork.artistName,
      artwork.medium,
      artwork.category,
      'buy artwork online India',
      'Atelier Art House',
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/products/${artwork.slug || artwork.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/products/${artwork.slug || artwork.id}`,
      type: 'website',
      images: [
        {
          url: artwork.images[0] || artwork.thumbnail,
          width: 800,
          height: 1000,
          alt: artwork.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = getArtworkBySlug(id) || getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const artworkSchema = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.name,
    image: `${SITE_CONFIG.url}${artwork.images[0] || artwork.thumbnail}`,
    description: artwork.description,
    artMedium: artwork.medium,
    artform: artwork.type,
    width: {
      '@type': 'Distance',
      name: `${artwork.dimensions.width} ${artwork.dimensions.unit}`,
    },
    height: {
      '@type': 'Distance',
      name: `${artwork.dimensions.height} ${artwork.dimensions.unit}`,
    },
    creator: {
      '@type': 'Person',
      name: artwork.artistName,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/products/${artwork.slug || artwork.id}`,
      priceCurrency: 'INR',
      price: artwork.price,
      availability: artwork.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };

  return (
    <div className="bg-[#F4EFE7] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artworkSchema) }}
      />
      <ArtworkDetailClient artwork={artwork} />
    </div>
  );
}
