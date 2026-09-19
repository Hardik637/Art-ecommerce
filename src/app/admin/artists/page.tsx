import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ARTISTS } from '@/lib/artCatalog';
import { MapPin, Eye, Users, Sparkles, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resident Master Artists | Atelier CMS',
  description: 'Manage master artist profiles, studio representations, and exhibitions.',
};

export default function AdminArtistsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
            Studio Representations
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
          Resident Master Artists & Studios
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Directory of contracted artists, studio locations, disciplines, and catalog allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTISTS.map((artist) => (
          <div
            key={artist.id}
            className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#B08A4A]/50 transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B08A4A] relative shrink-0 bg-[#11100F]">
                  <Image
                    src={artist.portrait}
                    alt={artist.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#11100F] font-medium leading-tight">
                    {artist.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-[#777] font-mono mt-1">
                    <MapPin size={11} className="text-[#B08A4A]" />
                    <span>{artist.location}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-[#8A6A32] tracking-wider block mt-0.5">
                    {artist.signatureStyle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#555] font-sans line-clamp-3 leading-relaxed">
                {artist.bio}
              </p>

              <div className="mt-4 pt-4 border-t border-[#E4DBCF] grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[10px] uppercase font-mono text-[#888] block">
                    Catalog Works
                  </span>
                  <span className="font-serif text-lg text-[#11100F] font-medium">
                    {artist.artworksCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#EFE9DF]/50 border border-[#E4DBCF]">
                  <span className="text-[10px] uppercase font-mono text-[#888] block">
                    Patron Followers
                  </span>
                  <span className="font-serif text-lg text-[#11100F] font-medium">
                    {artist.followerCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4DBCF] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#059669]">
                Verified Studio Representation
              </span>
              <Link
                href={`/artists/${artist.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4DBCF] hover:border-[#11100F] text-xs font-sans font-medium text-[#11100F] transition-colors"
              >
                <Eye size={12} /> View Studio
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
