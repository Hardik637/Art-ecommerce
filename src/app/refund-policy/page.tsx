import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Acquisition & Return Policy | ATELIER & ART HOUSE',
  description:
    'Collector inspection window, fine art return protocols, transit insurance claims, and custom archival framing policies.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Collector Protection
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Acquisition & Return Policy
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            We understand that living with an artwork is an intimate sensory experience. Atelier & Art House provides a 7-day in-situ collector evaluation window for all acquisitions.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-8 text-xs md:text-sm text-[#555] font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              The 7-Day In-Situ Collector Evaluation Window
            </h2>
            <p>
              Once your artwork or bronze sculpture is delivered and un-crated, you have <strong>7 full calendar days</strong> to view the piece within your private interior lighting. If the work does not harmonize with your space or meet your curatorial expectations, you may initiate a return.
            </p>
            <p>
              To ensure the preservation of fine art, returned items must be in pristine original condition, accompanied by the intact, wax-sealed Certificate of Authenticity and repacked in the original reinforced crate.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              Transit Damage & Restoration Guarantee
            </h2>
            <p>
              All shipments are insured for 100% of their declared acquisition valuation. If an artwork or frame sustains damage during transit, photograph the external crate and the artwork within 48 hours and alert our art concierge at <a href={`mailto:${siteConfig.contact.email}`} className="text-[#11100F] font-bold underline">{siteConfig.contact.email}</a>.
            </p>
            <p>
              At your discretion, we will either:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Issue an immediate 100% refund including all shipping and framing charges, OR</li>
              <li>Coordinate return to the master artist&apos;s studio for certified conservation and frame re-crafting.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              Custom Museum Float Framing Policy
            </h2>
            <p>
              Because our solid wood float frames (Black Ash, White Oak, 22K Gold Leaf) are cut and hand-finished specifically to each collector&apos;s requested dimensions, the framing component carries a non-refundable workshop charge if an artwork is returned simply due to aesthetic preference. The artwork canvas itself is refunded in full.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E4DBCF] pt-6">
            <h2 className="font-serif text-2xl text-[#11100F] font-medium">
              White-Glove Reverse Logistics & Refund Disbursement
            </h2>
            <p>
              Approved returns are picked up directly from your residence by our fine art courier partners. Upon receipt at our Bengaluru preservation facility and verification by our registrar, your refund is credited to your original payment method within <strong>3 to 5 business days</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
