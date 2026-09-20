import { Metadata } from 'next';
import { Truck, ShieldCheck, Box } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | Modern Art & Home Décor',
  description:
    'Packaging standards, insured transit, dispatch timelines, and delivery policies across India.',
};

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Logistics & Delivery
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Shipping & Packaging Standards
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            Every artwork, sculpture, and home décor piece is securely packed with protective materials and insured for damage-free transit across India.
          </p>
        </div>

        {/* 3 Steps of Packing Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
              <Box size={18} />
            </div>
            <h3 className="text-sm font-bold text-black">
              1. Protective Wrapping
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Artwork surfaces are sealed with acid-free protective layers, corner bumpers, and moisture-barrier bubble wrap.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-black">
              2. Reinforced Packaging
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Large framed works and heavy sculptures are packed in multi-wall heavy cardboard or reinforced wooden crates.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
              <Truck size={18} />
            </div>
            <h3 className="text-sm font-bold text-black">
              3. Insured Transit
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All orders are dispatched via trusted courier partners (Blue Dart, Delhivery) with comprehensive transit insurance.
            </p>
          </div>
        </div>

        {/* Delivery Timelines */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-black">
            Dispatch Timelines by Product Type
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div>
                <strong className="text-xs font-semibold text-black block">Standard Wall Art & Art Prints</strong>
                <span className="text-neutral-500">Carefully packaged in heavy-duty tubes or flat packaging</span>
              </div>
              <span className="font-mono text-black font-semibold shrink-0">
                Dispatches in 2–3 Business Days
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div>
                <strong className="text-xs font-semibold text-black block">Custom Framed Artworks</strong>
                <span className="text-neutral-500">Assembled, fitted with premium glass, and inspected before packing</span>
              </div>
              <span className="font-mono text-black font-semibold shrink-0">
                Dispatches in 4–7 Business Days
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div>
                <strong className="text-xs font-semibold text-black block">Sculptures & Decorative Pieces</strong>
                <span className="text-neutral-500">Molded foam and double-wall reinforced boxed packaging</span>
              </div>
              <span className="font-mono text-black font-semibold shrink-0">
                Dispatches in 3–5 Business Days
              </span>
            </div>
          </div>
        </section>

        {/* Complimentary Shipping Policy */}
        <section className="bg-black text-white rounded-xl p-8 space-y-3">
          <div className="flex items-center gap-2 text-neutral-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Shipping Policy</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Free Shipping on Orders Above ₹{siteConfig.shipping.freeThreshold.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
            We offer complimentary standard shipping across India on all qualifying orders. Standard metro delivery takes 3 to 6 business days after dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}
