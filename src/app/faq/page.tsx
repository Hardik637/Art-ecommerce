import { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Curatorial Questions | ATELIER & ART HOUSE',
  description:
    'Answers regarding artwork authenticity, provenance certificates, museum float framing, white-glove transit insurance, and bespoke commissions.',
};

const FAQS = [
  {
    question: 'How is authenticity verified for every artwork?',
    answer:
      'Every original painting, bronze sculpture, and collectible figure is cataloged in the permanent Atelier Registry with a unique provenance hash (e.g. ATH-COA-2026-8941). Your acquisition includes a hot-wax sealed, hand-numbered Certificate of Authenticity signed jointly by the master artist and our chief curator.',
  },
  {
    question: 'What is the difference between a 1/1 Original, Limited Edition, and Fine Art Print?',
    answer:
      'A "One-of-One" (1/1) is an original singular piece conceived and executed entirely by hand with no other copies in existence. A "Limited Edition" is a strictly capped casting run (e.g., 50 bronze casts or 50 collectible figures), each numbered on the base. A "Fine Art Print" is an archival museum reproduction on 310gsm German etching paper using 12-color pigment inks with a 100+ year fade-resistance rating.',
  },
  {
    question: 'What materials are used in the Atelier custom framing studio?',
    answer:
      'Our framing atelier uses sustainably harvested solid American White Oak, kiln-dried Black Ash wood, and hand-applied 22K antique gold leafing. We construct true float frames featuring an 8mm shadow reveal gap, acid-free backing, and optional UltraVue 99% UV-protective museum anti-reflective glass.',
  },
  {
    question: 'How are fragile sculptures and large canvases packaged for transit?',
    answer:
      'All framed artworks and heavy cast sculptures travel inside reinforced plywood crates with custom die-cut polyethylene shock-absorption foam and breathable acid-free glassine paper. Every shipment is handled by certified fine art couriers with 100% declared transit insurance.',
  },
  {
    question: 'Can I visualize an artwork on my own walls before purchasing?',
    answer:
      'Yes! Every artwork page features an interactive "View in Room" visualizer allowing you to test scaling against living room sofas, dining credenzas, and bedrooms with framing toggles. You may also email photographs of your space to concierge@atelierarthouse.com for complimentary 3D architectural wall simulation.',
  },
  {
    question: 'Can I commission a custom-sized painting or bespoke bronze sculpture?',
    answer:
      'Yes. Through our Private Curatorial Advisory, patrons can commission custom site-specific canvases and bespoke patina variations directly from our six resident master artists. Typical commission lead times range from 4 to 8 weeks.',
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Curatorial Inquiries
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            Essential information regarding provenance certificates, archival museum float framing, white-glove art transit, and collector acquisitions.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[#B08A4A]/50 transition-colors"
            >
              <h2 className="font-serif text-xl text-[#11100F] font-medium mb-3">
                {faq.question}
              </h2>
              <p className="text-xs sm:text-sm text-[#555] font-sans leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#11100F] text-[#F4EFE7] rounded-2xl p-8 border border-[#B08A4A]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl text-[#FAF8F5]">
              Have a Specific Curatorial Question?
            </h3>
            <p className="text-xs text-[#A8A096] font-sans mt-1">
              Our art advisory team provides personalized assistance for private collectors.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 bg-[#B08A4A] text-white hover:bg-white hover:text-[#11100F] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium"
          >
            Consult Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
