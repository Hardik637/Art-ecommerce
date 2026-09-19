'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artist, ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import { useUserStore } from '@/store/userStore';
import { MapPin, Globe, Instagram, Heart, Sparkles, Mail, Award, Check } from 'lucide-react';

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
    <div className="bg-[#F4EFE7] min-h-screen">
      {/* Artist Hero Banner */}
      <div className="relative h-80 md:h-96 bg-[#11100F] overflow-hidden border-b border-[#E4DBCF]">
        <Image
          src={artist.coverImage}
          alt={artist.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100F] via-[#11100F]/60 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#B08A4A] relative shrink-0 shadow-2xl bg-[#11100F]">
              <Image
                src={artist.portrait}
                alt={artist.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="text-[#FAF8F5]">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={13} className="text-[#B08A4A]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#B08A4A]">
                  {artist.location}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-light text-[#FAF8F5]">
                {artist.name}
              </h1>
              <p className="text-xs md:text-sm font-mono text-[#D4C4B0] mt-1">
                {artist.signatureStyle}
              </p>
            </div>
          </div>

          {/* Follow / Inquire Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleFollowArtist(artist.id)}
              className={`px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2 transition-all shadow-md ${
                isFollowing
                  ? 'bg-[#B08A4A] text-white border border-[#B08A4A]'
                  : 'bg-[#FAF8F5] text-[#11100F] hover:bg-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check size={14} /> Following Studio
                </>
              ) : (
                <>
                  <Heart size={14} className="text-[#B08A4A]" /> Follow Studio ({artist.followerCount})
                </>
              )}
            </button>

            <a
              href={`mailto:concierge@atelierarthouse.com?subject=Commission%20Inquiry%20for%20${encodeURIComponent(artist.name)}`}
              className="px-5 py-3 rounded-xl bg-[#292622] hover:bg-[#11100F] text-[#F4EFE7] text-xs uppercase tracking-wider font-sans font-medium flex items-center gap-2 transition-colors border border-white/10"
            >
              <Mail size={14} className="text-[#B08A4A]" />
              Inquire Bespoke Work
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Artist Bio Column */}
          <div className="space-y-8">
            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-3">
                Curatorial Bio & Practice
              </span>
              <p className="text-xs md:text-sm text-[#444] font-sans leading-relaxed">
                {artist.bio}
              </p>

              {/* Artist Statement */}
              <div className="mt-6 pt-6 border-t border-[#E4DBCF]">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-2">
                  Artist&apos;s Philosophy
                </span>
                <blockquote className="font-serif italic text-sm text-[#11100F] leading-relaxed">
                  &ldquo;{artist.statement}&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Mediums & Exhibitions */}
            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-3">
                  Mediums & Techniques
                </span>
                <div className="flex flex-wrap gap-2">
                  {artist.mediums.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 rounded-lg bg-[#EFE9DF] text-[11px] font-mono text-[#11100F] border border-[#E4DBCF]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {artist.exhibitions && artist.exhibitions.length > 0 && (
                <div className="pt-4 border-t border-[#E4DBCF]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-3">
                    Selected Exhibitions
                  </span>
                  <ul className="space-y-2 text-xs font-sans text-[#555]">
                    {artist.exhibitions.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Award size={13} className="text-[#B08A4A] shrink-0 mt-0.5" />
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
            <div className="flex items-center justify-between pb-4 border-b border-[#E4DBCF]">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#11100F] font-light">
                  Works from the Studio
                </h2>
                <p className="text-xs text-[#777] font-sans mt-0.5">
                  Available original canvases, sculptures, and limited editions.
                </p>
              </div>
              <span className="font-mono text-xs text-[#B08A4A]">
                {artworks.length} Works
              </span>
            </div>

            {artworks.length === 0 ? (
              <div className="p-12 text-center bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl text-xs text-[#777]">
                Currently all pieces from this studio are acquired. Contact the art concierge for upcoming releases.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
