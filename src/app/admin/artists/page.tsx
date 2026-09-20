import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ARTISTS } from '@/lib/artCatalog';
import { MapPin, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artists & Creators | Admin CMS',
  description: 'Manage creator profiles, studio representations, and portfolios.',
};

export default function AdminArtistsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6 text-black">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
          Creators
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          Artists & Creators
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Directory of independent artists, studio locations, and catalog allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTISTS.map((artist) => (
          <div
            key={artist.id}
            className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black transition-all"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-300 relative shrink-0 bg-neutral-900">
                  <Image
                    src={artist.portrait}
                    alt={artist.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black leading-tight">
                    {artist.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono mt-0.5">
                    <MapPin size={11} className="text-black" />
                    <span>{artist.location}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block mt-0.5">
                    {artist.signatureStyle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {artist.bio}
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                    Products
                  </span>
                  <span className="text-base font-bold text-black">
                    {artist.artworksCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                    Followers
                  </span>
                  <span className="text-base font-bold text-black">
                    {artist.followerCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[10px] font-mono text-black font-semibold">
                Active Creator
              </span>
              <Link
                href={`/artists/${artist.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-300 hover:border-black text-xs font-semibold text-black transition-colors"
              >
                <Eye size={12} /> Studio Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
