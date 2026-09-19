import { MetadataRoute } from 'next';
import { ARTWORKS, ARTISTS, CURATED_COLLECTIONS } from '@/lib/artCatalog';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url || 'https://atelierarthouse.com';
  const now = new Date();

  const artworkUrls = ARTWORKS.map((art) => ({
    url: `${baseUrl}/products/${art.slug || art.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const artistUrls = ARTISTS.map((artist) => ({
    url: `${baseUrl}/artists/${artist.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionUrls = CURATED_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/artists`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/best-sellers`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/new-arrivals`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/shipping`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/size-guide`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  return [...staticUrls, ...artworkUrls, ...artistUrls, ...collectionUrls];
}
