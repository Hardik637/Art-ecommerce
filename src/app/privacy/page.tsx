import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Modern Art & Home Décor',
  description:
    'Information regarding customer data privacy, checkout encryption, and order processing security.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Customer Privacy
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Privacy Policy
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            We value your privacy and are committed to protecting your personal information throughout your shopping experience.
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 space-y-8 text-xs md:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base md:text-lg font-bold text-black">
              1. Information We Collect
            </h2>
            <p>
              We collect information necessary to process your transactions and deliver your orders, including your name, email address, phone number, shipping address, and order history.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              2. Secure Payment Processing
            </h2>
            <p>
              All online payments are securely processed through encrypted PCI-DSS compliant payment gateways (Razorpay). We do not store full credit/debit card numbers or CVVs on our servers.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-200 pt-6">
            <h2 className="text-base md:text-lg font-bold text-black">
              3. Data Usage & Sharing
            </h2>
            <p>
              Your contact details are shared exclusively with trusted delivery and courier services solely for fulfilling order shipments. We never sell or rent your personal information to third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
