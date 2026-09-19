import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Provenance & Acquisition | ATELIER & ART HOUSE',
  description:
    'Terms of service governing artwork acquisitions, authenticity certificates, provenance registry records, and private curatorial advisory.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Legal & Provenance Governance
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Terms of Provenance & Acquisition
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            These terms govern the relationship between Atelier & Art House, its represented master artists, and private collectors.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-8 text-xs md:text-sm text-[#555] font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              1. Provenance & Warranty of Authenticity
            </h2>
            <p>
              Atelier & Art House guarantees that all cataloged artworks, bronze castings, and limited-edition figures are original works directly consigned by or produced under license from our resident master artists. Each piece is issued with a wax-sealed Certificate of Authenticity and registered in the immutable Atelier Provenance Database.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              2. Commercial Valuation & Acquisition
            </h2>
            <p>
              Acquisition prices are shown in Indian Rupees (INR) and are inclusive of standard applicable GST. Framing choices, museum glass upgrades, and international customs duties (where applicable) are itemized transparently prior to payment confirmation.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              3. Copyright & Intellectual Property
            </h2>
            <p>
              Acquisition of an artwork conveys ownership of the physical object and its accompanying Certificate of Authenticity. Moral rights, copyright, and reproduction rights remain the exclusive intellectual property of the master artist. No artwork may be reproduced or exploited for commercial merchandise without explicit written consent.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              4. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms of Acquisition shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with provenance or transactions shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
