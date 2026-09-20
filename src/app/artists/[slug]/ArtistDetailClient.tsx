'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Artist, ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import { useUserStore } from '@/store/userStore';
import { MapPin, Heart, Check } from 'lucide-react';

interface ArtistDetailClientProps {
  artist: Artist;
  artworks: ArtworkProduct[];
}

export default function ArtistDetailClient({ artist, artworks }: ArtistDetailClientProps) {
  const [mounted, setMounted] = useState(false);
  const { toggleFollowArtist, isFollowingArtist } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFollowing = mounted ? isFollowingArtist(artist.id) : false;

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Artist Hero Banner */}
      <div className="relative h-72 md:h-80 bg-black overflow-hidden border-b border-neutral-200">
        <Image
          src={artist.coverImage}
          alt={artist.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white relative shrink-0 shadow-lg bg-neutral-900">
              <Image
                src={artist.portrait}
                alt={artist.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="text-white">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin size={12} className="text-white" />
                <span className="text-xs font-sans font-medium uppercase tracking-wider text-neutral-300">
                  {artist.location}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
                {artist.name}
              </h1>
              <p className="text-xs font-sans font-bold text-neutral-400 uppercase tracking-wider mt-1">
                {artist.signatureStyle}
              </p>
            </div>
          </div>

          {/* Follow Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleFollowArtist(artist.id)}
              className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-sans font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check size={14} /> Following
                </>
              ) : (
                <>
                  <Heart size={14} /> Follow ({artist.followerCount})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Artist Bio Column */}
          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block mb-2">
                Creator Bio
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {artist.bio}
              </p>

              {/* Statement */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block mb-1">
                  Statement
                </span>
                <blockquote className="italic text-xs text-black leading-relaxed font-sans">
                  &ldquo;{artist.statement}&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Mediums */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block mb-2">
                  Mediums &amp; Materials
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {artist.mediums.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-sm bg-white text-[10px] font-sans font-bold uppercase tracking-wider text-black border border-neutral-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {artist.exhibitions && artist.exhibitions.length > 0 && (
                <div className="pt-3 border-t border-neutral-200">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-2 font-semibold">
                    Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {artist.exhibitions.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-black font-bold">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Catalog Artworks by Artist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Products by {artist.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Available original works and limited editions.
                </p>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-semibold">
                {artworks.length} Items
              </span>
            </div>

            {artworks.length === 0 ? (
              <div className="p-12 text-center bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500">
                Currently all pieces from this creator are sold out. Check back for upcoming releases.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {artworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
