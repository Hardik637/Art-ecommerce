import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Patron Privacy & Discretion Policy | ATELIER & ART HOUSE',
  description:
    'Our commitment to collector discretion, acquisition confidentiality, and secure personal data protection.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Patron Discretion
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Patron Privacy & Confidentiality
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            Collecting fine art is a private endeavor. We uphold the strictest standards of discretion regarding patron identity, provenance records, and delivery locations.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-8 text-xs md:text-sm text-[#555] font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              1. Collector Anonymity & Public Discretion
            </h2>
            <p>
              Atelier & Art House will never publish, share, or sell the names, collection details, or purchase valuations of private patrons. When artworks are referenced in retrospective literature or exhibition catalogues, collector attributions are recorded as <em>&quot;Private Collection, India&quot;</em> unless explicit written authorization is granted by the collector.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              2. Data Collected for Logistics & Provenance
            </h2>
            <p>
              We collect only the essential personal details required to verify provenance and ensure safe transit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Full Patron Name & registered email for Certificates of Authenticity</li>
              <li>Encrypted delivery addresses and telephone numbers shared solely with certified fine art freight handlers</li>
              <li>Encrypted payment tokens processed through PCI-DSS Level 1 compliant gateway gateways (Razorpay)</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              3. Curatorial Communications
            </h2>
            <p>
              Subscribers to <em>The Sunday Salon Dispatch</em> receive curatorial essays and private preview invitations. Patrons can modify their dispatch preferences or unsubscribe at any time within their Collector Cabinet settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
