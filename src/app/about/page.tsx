import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ShieldCheck, Sparkles, Compass, MapPin, ArrowRight } from 'lucide-react';
import { PRIMARY_ARTIST } from '@/lib/artCatalog';

export const metadata: Metadata = {
  title: 'About the Art House & Curatorial Manifesto | ATELIER & ART HOUSE',
  description:
    'Founded as a sanctuary for contemporary fine art, sculptures, and collectible figures. Discover our provenance registry, archival framing studio, and resident masters.',
};

const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'ArtGallery',
  name: 'ATELIER & ART HOUSE',
  description:
    'A sanctuary for contemporary fine art, sculptures, collectible figures, and decorative objects with certified provenance.',
  url: 'https://atelierarthouse.com',
  telephone: '+91 98101 23456',
  email: 'concierge@atelierarthouse.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '7 Residency Road, Shanthala Nagar',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560025',
    addressCountry: 'IN',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

      {/* Hero Exhibition Header */}
      <div className="relative py-24 md:py-32 px-6 text-center border-b border-[#E4DBCF] bg-[#11100F] text-[#FAF8F5] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#B08A4A_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B08A4A]/40 bg-[#B08A4A]/10 text-[#B08A4A] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Sparkles size={11} />
            The Curatorial Manifesto
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-[#FAF8F5] leading-tight">
            Art is Not Decoration. <br />
            <span className="italic font-serif text-[#D4C4B0]">It is Living Presence.</span>
          </h1>

          <p className="text-xs md:text-sm font-sans text-[#A8A096] max-w-xl mx-auto leading-relaxed pt-2">
            Atelier & Art House was founded on a singular conviction: that spaces of consequence demand artworks with history, weight, and indisputable provenance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Curatorial Philosophy */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A] block">
              Chapter I • The Foundation
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light leading-snug">
              A Bridge Between Living Studios & Discerning Collectors
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-[#555] font-sans leading-relaxed">
              <p>
                In a digital landscape flooded with disposable prints and transient decor, Atelier & Art House stands as a deliberate sanctuary for tactile mastery. Every canvas in our gallery is stretched over kiln-dried teak or pine bars; every bronze is cast using ancient lost-wax metallurgy; and every sculpture carries the palpable hand of its maker.
              </p>
              <p>
                We do not deal in anonymous wall decor. We represent six singular resident master studios across India — working directly with artists from Santiniketan to Kochi to curate pieces that anchor living rooms, private libraries, and architectural residences.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#E4DBCF] bg-[#EFE9DF] shadow-lg">
            <Image
              src="/artworks/handpainted-sacred-geometry.svg"
              alt="Hand painted masterwork in progress"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* 3 Pillars of the House */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A] block mb-2">
              Chapter II • The Standards
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
              The Three Pillars of Atelier Provenance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#11100F] font-medium">
                Certified Provenance
              </h3>
              <p className="text-xs text-[#666] font-sans leading-relaxed">
                Every acquisition is cataloged in the permanent Atelier Registry with a cryptographically verified hash, accompanied by a hot-wax sealed Certificate of Authenticity signed by the artist and chief curator.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
                <Award size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#11100F] font-medium">
                Archival Museum Framing
              </h3>
              <p className="text-xs text-[#666] font-sans leading-relaxed">
                Our bespoke framing atelier crafts solid Black Ash and White Oak shadow float frames with 8mm reveals, acid-free archival matting, and optional UltraVue 99% UV-protective museum glass.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
                <Compass size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#11100F] font-medium">
                White-Glove Art Transit
              </h3>
              <p className="text-xs text-[#666] font-sans leading-relaxed">
                We partner with specialized fine art freight handlers (Blue Dart Fine Art Special and Sequel Secure). Artworks travel in custom wooden crates with full transit insurance from the studio to your wall.
              </p>
            </div>
          </div>
        </section>

        {/* The Artist & Studio Section */}
        <section className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-56 rounded-2xl overflow-hidden border-2 border-[#E4DBCF] relative bg-[#11100F] shadow-lg">
                <Image
                  src={PRIMARY_ARTIST.portrait}
                  alt={PRIMARY_ARTIST.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A] block">
                Chapter III • The Artist &amp; Studio
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#11100F] font-normal">
                {PRIMARY_ARTIST.name}
              </h2>
              <p className="text-xs font-sans text-[#B08A4A] uppercase tracking-wider">
                Founder &amp; Resident Artist • {PRIMARY_ARTIST.location}
              </p>
              <p className="text-sm text-[#444] font-sans leading-relaxed">
                {PRIMARY_ARTIST.bio}
              </p>
              <blockquote className="border-l-2 border-[#B08A4A] pl-4 italic font-serif text-base text-[#481E25]">
                &ldquo;{PRIMARY_ARTIST.statement}&rdquo;
              </blockquote>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#11100F] text-[#F4EFE7] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-[#481E25] transition-colors"
                >
                  <span>Explore The Full Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Invitation CTA */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
            Begin Your Private Collection
          </h2>
          <p className="text-xs md:text-sm text-[#666] font-sans max-w-lg mx-auto leading-relaxed">
            Whether acquiring your first limited edition bronze or commissioning a site-specific canvas, our art concierge is at your service.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium shadow-md"
            >
              Explore Catalog Masterworks
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl border border-[#E4DBCF] bg-[#FAF8F5] text-[#11100F] hover:border-[#11100F] transition-colors text-xs uppercase tracking-widest font-sans font-medium"
            >
              Consult Art Concierge
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
