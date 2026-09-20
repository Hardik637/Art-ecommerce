import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Modern Art & Home Décor',
  description:
    'Return windows, transit damage protocols, refund processing timelines, and customer satisfaction guarantees.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Returns & Exchanges
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Return & Refund Policy
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            We want you to love your art pieces. Here is our straightforward policy for returns, exchanges, and transit damage.
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 space-y-8 text-xs md:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base md:text-lg font-bold text-black">
              7-Day Inspection Window
            </h2>
            <p>
              You have <strong>7 calendar days</strong> from the delivery date to inspect your artwork in your home. If the piece does not match your expectations or space, you may request a return.
            </p>
            <p>
              Returned items must be undamaged, complete with all original documentation, and securely repacked in their original packaging materials.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              Transit Damage Guarantee
            </h2>
            <p>
              All shipments are insured for transit. If an item arrives damaged, please take clear photos of the packaging and product within 48 hours of delivery and contact us at <a href={`mailto:${siteConfig.contact.email}`} className="text-black font-semibold underline">{siteConfig.contact.email}</a>.
            </p>
            <p>
              We will promptly arrange a full replacement or a 100% refund.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              Refund Processing
            </h2>
            <p>
              Once your returned item is received and inspected at our facility, refunds are initiated back to your original payment method within <strong>3 to 5 business days</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
