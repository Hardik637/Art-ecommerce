import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ARTISTS } from '@/lib/artCatalog';
import { MapPin, ArrowUpRight, Sparkles, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resident Master Artists | ATELIER & ART HOUSE',
  description:
    'Discover the 6 fictional master artists of Atelier & Art House — painters, sculptors, and contemporary designers shaping our collection.',
};

export default function ArtistsDirectoryPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[11px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Resident Studio Directory
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#11100F] font-light tracking-tight leading-tight">
            The Master Artists & Sculptors
          </h1>
          <p className="text-sm md:text-base text-[#555] font-sans mt-4 leading-relaxed">
            Every artwork in the Atelier catalog is conceived by our six resident masters — from monumental delta water abstractions to lost-wax bronze castings and collectible cyber-mythological vinyls.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm hover:border-[#B08A4A]/60 hover:shadow-md transition-all flex flex-col group"
            >
              {/* Cover Banner & Portrait */}
              <div className="relative h-48 bg-[#EFE9DF] overflow-hidden">
                <Image
                  src={artist.coverImage}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100F]/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 bg-[#11100F]/90 backdrop-blur-sm text-[#B08A4A] px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider border border-[#B08A4A]/30 flex items-center gap-1">
                  <Sparkles size={11} />
                  {artist.artworksCount} Works
                </div>

                <div className="absolute -bottom-6 left-6">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#FAF8F5] shadow-md relative bg-[#11100F]">
                    <Image
                      src={artist.portrait}
                      alt={artist.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 pt-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#777] font-mono mb-1">
                    <MapPin size={12} className="text-[#B08A4A]" />
                    <span>{artist.location}</span>
                  </div>

                  <h2 className="font-serif text-2xl text-[#11100F] font-light group-hover:text-[#B08A4A] transition-colors">
                    {artist.name}
                  </h2>

                  <p className="text-[11px] font-mono text-[#8A6A32] uppercase tracking-wider mt-1">
                    {artist.signatureStyle}
                  </p>

                  <p className="text-xs text-[#555] font-sans mt-3 line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>

                  <blockquote className="mt-4 p-3 rounded-xl bg-[#EFE9DF]/50 border-l-2 border-[#B08A4A] text-[11px] font-serif italic text-[#333]">
                    &ldquo;{artist.statement}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4DBCF] flex items-center justify-between">
                  <span className="text-[11px] text-[#777] font-mono">
                    {artist.followerCount.toLocaleString()} Patrons Following
                  </span>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase font-sans font-medium tracking-wider text-[#11100F] group-hover:text-[#B08A4A] transition-colors"
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
