import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Size & Placement Guide | Modern Art & Home Décor',
  description:
    'Dimensions, hanging heights, furniture scale ratios, and placement standards for wall art and sculptures.',
};

export default function SizeGuidePage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Placement & Scale
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Size & Placement Guide
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            Selecting the right proportions ensures your wall art and home décor pieces balance naturally with your room dimensions.
          </p>
        </div>

        {/* Artwork Scale Matrix */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-white">
            <h2 className="text-base font-bold text-black">
              Standard Dimensions Guide
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Dimensions, suggested spaces, and ideal viewing distances.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Size Classification</th>
                  <th className="py-3.5 px-4">Dimensions</th>
                  <th className="py-3.5 px-4">Ideal Setting</th>
                  <th className="py-3.5 px-4">Viewing Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr className="hover:bg-neutral-100/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-black">
                    Small
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">
                    30 × 40 to 45 × 60 cm
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    Desk, entryway nook, powder room, or gallery wall grid.
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">1.0 – 1.5 m</td>
                </tr>

                <tr className="hover:bg-neutral-100/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-black">
                    Medium
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">
                    60 × 90 to 75 × 100 cm
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    Above console table, dining room wall, study office.
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">1.5 – 2.5 m</td>
                </tr>

                <tr className="hover:bg-neutral-100/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-black">
                    Large / Statement
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">
                    90 × 120 to 100 × 150 cm
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    Above living room sofa, king bed headboard, stairwell.
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">2.5 – 4.0 m</td>
                </tr>

                <tr className="hover:bg-neutral-100/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-black">
                    Extra Large
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">
                    120 × 180 to 150 × 200 cm+
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    Double-height living spaces, foyer, commercial reception.
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">3.5+ m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Golden Hanging Rules */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">
            Three Core Hanging Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-mono text-xs font-bold">
                57&quot;
              </div>
              <h3 className="text-sm font-bold text-black">
                Eye-Level Standard
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Standard interior practice positions the vertical center of an artwork <strong>57 inches (145 cm)</strong> above the floor for natural sightlines.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-mono text-xs font-bold">
                2/3
              </div>
              <h3 className="text-sm font-bold text-black">
                Two-Thirds Proportion
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                When hanging art above a sofa or console, the artwork or pair should measure approximately <strong>60% to 75%</strong> of the furniture piece width.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-mono text-xs font-bold">
                8&quot;
              </div>
              <h3 className="text-sm font-bold text-black">
                Furniture Clearance
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Leave between <strong>6 to 8 inches (15–20 cm)</strong> between the top of the sofa backrest or console table and the bottom of the frame.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-black text-white rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-1">
            <h3 className="text-lg font-bold text-white">
              Test Any Artwork in Your Room
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every product features an interactive <strong>View in Room</strong> visualizer to verify scale against sofas and credenzas before ordering.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors rounded-lg text-xs uppercase tracking-wider font-semibold"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
