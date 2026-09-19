import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ARTISTS, getArtistBySlug, getArtworksByArtist } from '@/lib/artCatalog';
import ArtistDetailClient from './ArtistDetailClient';

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  ARTISTS.forEach((artist) => {
    paths.push({ slug: artist.slug });
    paths.push({ slug: artist.id });
  });
  return paths;
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    return {
      title: 'Artist Not Found | ATELIER & ART HOUSE',
    };
  }

  return {
    title: `${artist.name} | Resident Artist | ATELIER & ART HOUSE`,
    description: artist.shortBio || artist.bio,
    openGraph: {
      title: `${artist.name} — Atelier & Art House`,
      description: artist.bio,
      images: [artist.coverImage || artist.portrait],
    },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const artworks = getArtworksByArtist(artist.id);

  return <ArtistDetailClient artist={artist} artworks={artworks} />;
}
