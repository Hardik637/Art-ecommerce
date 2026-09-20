import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ARTISTS } from '@/lib/artCatalog';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artists & Creators | Modern Art & Home Décor',
  description:
    'Discover our resident artists, sculptors, and designers crafting contemporary artworks.',
};

export default function ArtistsDirectoryPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Resident Creators
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Artists & Sculptors
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 leading-relaxed">
            The independent creators and craftsman studios behind our original paintings, bronze sculptures, and designer decorative pieces.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden hover:border-black transition-all flex flex-col group"
            >
              {/* Cover Banner & Portrait */}
              <div className="relative h-44 bg-neutral-200 overflow-hidden">
                <Image
                  src={artist.coverImage}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 bg-black text-white px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold tracking-wider">
                  {artist.artworksCount} Works
                </div>

                <div className="absolute -bottom-5 left-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm relative bg-neutral-900">
                    <Image
                      src={artist.portrait}
                      alt={artist.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 pt-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono mb-1">
                    <MapPin size={12} className="text-black" />
                    <span>{artist.location}</span>
                  </div>

                  <h2 className="text-xl font-bold text-black group-hover:underline transition-colors">
                    {artist.name}
                  </h2>

                  <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    {artist.signatureStyle}
                  </p>

                  <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {artist.followerCount.toLocaleString()} Followers
                  </span>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wider text-black group-hover:underline transition-colors"
                  >
                    View Studio <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
