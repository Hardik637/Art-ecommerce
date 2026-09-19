import { Metadata } from 'next';
import Link from 'next/link';
import { Maximize2, Compass, Eye, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Art Dimensions & Wall Space Guide | ATELIER & ART HOUSE',
  description:
    'Curatorial guidelines for artwork sizing, eye-level hanging standards, furniture proportion ratios, and sculpture pedestal placements.',
};

export default function SizeGuidePage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Curatorial Space Planning
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Art Dimensions & Wall Space Guide
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            Selecting the ideal canvas scale or sculpture plinth transforms an interior from furnished to architecturally curated. Use our museum standards to harmonize artwork scale with your room dimensions.
          </p>
        </div>

        {/* Artwork Scale Matrix */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-[#EFE9DF]/50 border-b border-[#E4DBCF]">
            <h2 className="font-serif text-xl text-[#11100F] font-light">
              Standard Artwork Scale Matrix
            </h2>
            <p className="text-xs text-[#777] font-sans mt-0.5">
              Dimensions, recommended room settings, and viewing distance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#E4DBCF] bg-[#FAF8F5] text-[#777] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-5">Scale Classification</th>
                  <th className="py-4 px-4">Dimensions (cm)</th>
                  <th className="py-4 px-4">Ideal Setting & Placement</th>
                  <th className="py-4 px-4">Viewing Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DBCF]/60">
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-5 font-serif text-sm font-medium text-[#11100F]">
                    Intimate / Vignette
                  </td>
                  <td className="py-4 px-4 font-mono text-[#8A6A32]">
                    30 × 40 to 45 × 60 cm
                  </td>
                  <td className="py-4 px-4 text-[#555]">
                    Study desk, powder room, reading alcove, or multi-piece gallery wall grid.
                  </td>
                  <td className="py-4 px-4 font-mono text-[#777]">1.0 – 1.5 meters</td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-5 font-serif text-sm font-medium text-[#11100F]">
                    Editorial / Medium
                  </td>
                  <td className="py-4 px-4 font-mono text-[#8A6A32]">
                    60 × 90 to 75 × 100 cm
                  </td>
                  <td className="py-4 px-4 text-[#555]">
                    Entryway console table, dining room niche, executive office wall.
                  </td>
                  <td className="py-4 px-4 font-mono text-[#777]">1.5 – 2.5 meters</td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-5 font-serif text-sm font-medium text-[#11100F]">
                    Statement / Large
                  </td>
                  <td className="py-4 px-4 font-mono text-[#8A6A32]">
                    90 × 120 to 100 × 150 cm
                  </td>
                  <td className="py-4 px-4 text-[#555]">
                    Living room sofa anchor, king bed headboard, double-height stairwell.
                  </td>
                  <td className="py-4 px-4 font-mono text-[#777]">2.5 – 4.0 meters</td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-5 font-serif text-sm font-medium text-[#11100F]">
                    Monumental Salon
                  </td>
                  <td className="py-4 px-4 font-mono text-[#8A6A32]">
                    120 × 180 to 150 × 200 cm+
                  </td>
                  <td className="py-4 px-4 text-[#555]">
                    Grand salon wall, penthouse foyer, architectural reception lobby.
                  </td>
                  <td className="py-4 px-4 font-mono text-[#777]">3.5+ meters</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Golden Hanging Rules */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl text-[#11100F] font-light">
            The Three Golden Rules of Art Placement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center font-mono text-xs font-bold">
                57&quot;
              </div>
              <h3 className="font-serif text-lg text-[#11100F] font-medium">
                The 57-Inch Eye-Level Standard
              </h3>
              <p className="text-xs text-[#555] font-sans leading-relaxed">
                Galleries worldwide align the vertical center of an artwork precisely <strong>57 inches (145 cm)</strong> from the floor. This represents the human average visual horizon.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center font-mono text-xs font-bold">
                2/3
              </div>
              <h3 className="font-serif text-lg text-[#11100F] font-medium">
                The Two-Thirds Furniture Ratio
              </h3>
              <p className="text-xs text-[#555] font-sans leading-relaxed">
                When hanging art above a sofa, console, or bed, the artwork or diptych width should span approximately <strong>60% to 75%</strong> of the furniture piece width.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center font-mono text-xs font-bold">
                8&quot;
              </div>
              <h3 className="font-serif text-lg text-[#11100F] font-medium">
                The Anchor Clearance
              </h3>
              <p className="text-xs text-[#555] font-sans leading-relaxed">
                Leave between <strong>6 to 8 inches (15–20 cm)</strong> between the top of the sofa backrest or console surface and the bottom edge of the frame.
              </p>
            </div>
          </div>
        </div>

        {/* Sculpture Placement Guidelines */}
        <section className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl text-[#11100F] font-light">
            Sculpture, Bronzes & Figure Display Guidelines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#555] font-sans leading-relaxed">
            <div className="space-y-2">
              <strong className="text-sm text-[#11100F] block">
                Plinth & Pedestal Elevations
              </strong>
              <p>
                Lost-wax cast bronzes and three-dimensional works achieve maximum emotional presence when displayed on a basalt, wood, or matte steel pedestal measuring 90 to 110 cm tall, ensuring 360-degree illumination and walk-around sightlines.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="text-sm text-[#11100F] block">
                Art Figures & Collectibles
              </strong>
              <p>
                Collectible figures (24cm–35cm) perform exceptionally within open vitrines, floating architectural shelving, or minimalist console vignettes paired with an asymmetric table lamp to produce dramatic drop shadows.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Room Visualizer CTA */}
        <div className="bg-gradient-to-br from-[#11100F] to-[#292622] text-[#F4EFE7] rounded-2xl p-8 border border-[#B08A4A]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Interactive Spatial Visualizer
            </span>
            <h3 className="font-serif text-2xl text-[#FAF8F5] font-light">
              Experience Any Artwork on Real Walls
            </h3>
            <p className="text-xs text-[#A8A096] font-sans leading-relaxed">
              Every masterwork in our catalog features a <strong>&quot;View in Room&quot;</strong> visualizer that simulates real scale across Living Rooms, Dining Rooms, Executive Offices, and Minimalist Bedrooms.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 px-6 py-3.5 bg-[#B08A4A] text-white hover:bg-white hover:text-[#11100F] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium"
          >
            Explore Catalog & Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
