import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ShieldCheck, Compass, ArrowRight } from 'lucide-react';
import { PRIMARY_ARTIST } from '@/lib/artCatalog';

export const metadata: Metadata = {
  title: 'About Us | Modern Art & Home Décor',
  description:
    'Contemporary wall art, original sculptures, and curated home décor designed for modern residential and architectural spaces.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-black">
      {/* Hero Header */}
      <div className="relative py-20 md:py-28 px-6 text-center border-b border-neutral-200 bg-black text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block">
            Our Brand Story
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Art For Modern Living Spaces
          </h1>

          <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed pt-1">
            Curated wall art, statement sculptures, and decorative objects designed to bring architectural presence and character to contemporary interiors.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Curatorial Philosophy */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Direct From Studios
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-black leading-tight">
              Bridging Independent Artists & Modern Homes
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-neutral-600 leading-relaxed">
              <p>
                We collaborate directly with contemporary artists, sculptors, and craftsman studios to create thoughtful collections. Every piece is constructed with enduring materials—kiln-dried solid wood frames, heavyweight archival canvas, and lost-wax cast metal.
              </p>
              <p>
                Whether you are decorating an entire residence or searching for an anchor statement piece for a single wall, our collections are curated to make shopping for art straightforward and accessible.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
            <Image
              src="/artworks/handpainted-sacred-geometry.svg"
              alt="Hand painted artwork"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Standards & Quality
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
              Why Shop With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-black">
                Verified Authenticity
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every original painting and numbered sculpture edition comes complete with a Certificate of Authenticity specifying medium, dimensions, and origin.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-bold text-black">
                Handcrafted Framing
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our in-house framing uses solid ash and oak shadow float frames with acid-free backing and protective glass for lasting durability.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Compass size={20} />
              </div>
              <h3 className="text-sm font-bold text-black">
                Insured Doorstep Delivery
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All artworks and sculptures travel in reinforced packaging with 100% transit insurance directly to your home across India.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Artist Section */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-44 h-52 rounded-xl overflow-hidden border border-neutral-300 relative bg-neutral-200">
                <Image
                  src={PRIMARY_ARTIST.portrait}
                  alt={PRIMARY_ARTIST.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                Resident Artist
              </span>
              <h2 className="text-2xl font-bold text-black">
                {PRIMARY_ARTIST.name}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                {PRIMARY_ARTIST.location}
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {PRIMARY_ARTIST.bio}
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center space-y-4 pt-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
            Ready to Upgrade Your Space?
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Browse our curated collections of wall art, sculptures, and decorative home pieces.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold"
            >
              Shop All Products
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-neutral-300 bg-white text-black hover:border-black transition-colors text-xs uppercase tracking-wider font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
