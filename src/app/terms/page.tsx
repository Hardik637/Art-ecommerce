import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Modern Art & Home Décor',
  description:
    'Terms of service governing artwork purchases, delivery warranties, intellectual property, and orders.',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-400 block mb-2">
            Legal Information
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight leading-none">
            Terms of Service
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-3 max-w-2xl leading-relaxed font-sans">
            These terms govern product orders, delivery agreements, and store policies for all purchases made through our platform.
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 space-y-8 text-xs md:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base md:text-lg font-bold text-black">
              1. Product Authenticity & Description
            </h2>
            <p>
              We guarantee that all cataloged artworks, sculptures, and decorative pieces are original products or authorized limited editions. Detailed specifications regarding materials, dimensions, and framing options are accurately provided on each product page.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              2. Pricing & Payments
            </h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST. Delivery fees, if any, and optional custom framing charges are clearly itemized before order checkout.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              3. Copyright & Intellectual Property
            </h2>
            <p>
              Purchasing an artwork conveys ownership of the physical piece. Reproduction rights, commercial merchandising, and digital replication rights remain the intellectual property of the respective artists and cannot be used commercially without explicit consent.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              4. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
