import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Modern Art & Home Décor',
  description:
    'Answers regarding artwork authenticity, framing options, shipping transit insurance, and order returns.',
};

const FAQS = [
  {
    question: 'How is authenticity verified for every artwork?',
    answer:
      'Every original painting, sculpture, and decorative piece comes with a verified Certificate of Authenticity specifying title, medium, dimensions, and production year.',
  },
  {
    question: 'What is the difference between an Original Artwork, Limited Edition, and Art Print?',
    answer:
      'An Original Artwork is a singular piece created entirely by hand. A Limited Edition is a numbered run capped at a strictly limited quantity. An Art Print is an archival reproduction printed on heavyweight museum-grade paper using archival pigment inks.',
  },
  {
    question: 'What materials are used in your framing?',
    answer:
      'Our framing studio uses solid natural woods (Black Ash, White Oak, Matte Black) with acid-free mats and premium protective glass engineered to preserve artwork longevity.',
  },
  {
    question: 'How are fragile sculptures and large canvases packaged?',
    answer:
      'All items are packed using multi-layer protective materials, reinforced custom corner guards, shock-absorbing padding, and durable wooden crates for heavy sculptures to ensure damage-free transit.',
  },
  {
    question: 'Can I visualize an artwork on my wall before purchasing?',
    answer:
      'Yes! Use our interactive "View in Room" feature on any product page to preview the piece with realistic scale against living room sofas, dining areas, and office walls.',
  },
  {
    question: 'What is your shipping and return policy?',
    answer:
      'We offer free insured delivery on orders meeting the qualifying threshold. In the rare event an item arrives damaged or does not fit your space, our customer support will process a replacement or return within our inspection policy window.',
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Help Center
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            Everything you need to know about our products, framing options, secure shipping, and order management.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 sm:p-8 hover:border-black transition-colors"
            >
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">
                {faq.question}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-black text-white rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Have More Questions?
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Our support team is available to assist with sizing, framing advice, or order inquiries.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors rounded-lg text-xs uppercase tracking-wider font-semibold"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
