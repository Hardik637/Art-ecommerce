import { Metadata } from 'next';
import Link from 'next/link';
import { Truck, ShieldCheck, Box, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'White-Glove Art Shipping & Transit Insurance | ATELIER & ART HOUSE',
  description:
    'Museum-grade archival crating, climate-controlled fine art freight, and 100% comprehensive transit insurance across India.',
};

export default function ShippingPage() {
  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Logistics & Care Protocols
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            White-Glove Art Shipping & Transit Insurance
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            Transporting original fine art requires rigorous engineering. Every canvas, lost-wax bronze, and collectible sculpture travels under our comprehensive transit insurance and climate-controlled packing standards.
          </p>
        </div>

        {/* 3 Steps of Packing Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
              <Box size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#11100F] font-medium">
              1. Archival Wrapping
            </h3>
            <p className="text-xs text-[#555] font-sans leading-relaxed">
              Artwork faces are sealed in breathable, acid-free museum glassine paper followed by moisture-barrier film and thick polyethylene corner armor.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#11100F] font-medium">
              2. Reinforced Crating
            </h3>
            <p className="text-xs text-[#555] font-sans leading-relaxed">
              All framed works over 90cm and delicate bronze sculptures are encapsulated in custom-built plywood crates with high-density shock absorbers.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center">
              <Truck size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#11100F] font-medium">
              3. Insured Freight
            </h3>
            <p className="text-xs text-[#555] font-sans leading-relaxed">
              Shipments move via certified fine art carriers (Blue Dart Fine Art Special and Sequel Secure) with 100% declared value transit insurance.
            </p>
          </div>
        </div>

        {/* Delivery Timelines & Lead Times */}
        <section className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl text-[#11100F] font-light">
            Dispatch Timelines by Artwork Type
          </h2>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4DBCF] gap-2">
              <div>
                <strong className="text-sm text-[#11100F] block">Unframed Canvases & Fine Art Prints</strong>
                <span className="text-[#777]">Rolled in heavy-gauge archival tubes or gallery wrapped flat-packs</span>
              </div>
              <span className="font-mono text-[#8A6A32] font-semibold shrink-0">
                Dispatches in 2–3 Business Days
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4DBCF] gap-2">
              <div>
                <strong className="text-sm text-[#11100F] block">Custom Archival Float Framed Artworks</strong>
                <span className="text-[#777]">Handcrafted solid Ash wood / Oak frame, cured, and fitted with UV glass</span>
              </div>
              <span className="font-mono text-[#8A6A32] font-semibold shrink-0">
                Dispatches in 5–8 Business Days
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4DBCF] gap-2">
              <div>
                <strong className="text-sm text-[#11100F] block">Cast Bronze Sculptures & Heavy Art Figures</strong>
                <span className="text-[#777]">Padded in die-cut foam within reinforced wooden shipping crates</span>
              </div>
              <span className="font-mono text-[#8A6A32] font-semibold shrink-0">
                Dispatches in 3–5 Business Days
              </span>
            </div>
          </div>
        </section>

        {/* Complimentary Art Freight Policy */}
        <section className="bg-gradient-to-br from-[#11100F] to-[#292622] text-[#F4EFE7] rounded-2xl p-8 border border-[#B08A4A]/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#B08A4A] text-xs font-mono uppercase tracking-widest">
            <ShieldCheck size={16} />
            <span>Complimentary Fine Art Freight</span>
          </div>
          <h3 className="font-serif text-2xl text-[#FAF8F5] font-light">
            Free Pan-India Delivery on All Orders Above ₹{siteConfig.shipping.freeThreshold}
          </h3>
          <p className="text-xs text-[#A8A096] font-sans leading-relaxed max-w-2xl">
            Because we believe masterworks should arrive without logistical compromise, all acquisitions qualifying under the threshold receive complimentary door-to-door white-glove art transit across India, including metro air express.
          </p>
        </section>

        {/* Uncrating Protocol */}
        <section className="space-y-4 text-xs font-sans text-[#555] leading-relaxed">
          <h2 className="font-serif text-2xl text-[#11100F] font-light">
            Patron Delivery & Uncrating Guidelines
          </h2>
          <p>
            Upon delivery, our courier representative will wait while you inspect the external condition of the crate or package. If any exterior damage or puncture is detected:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Photograph the crate before opening from multiple angles.</li>
            <li>Note the damage on the delivery agent&apos;s physical or digital proof of delivery (POD) receipt.</li>
            <li>Contact our senior art concierge within 48 hours at <a href={`mailto:${siteConfig.contact.email}`} className="text-[#11100F] font-bold underline">{siteConfig.contact.email}</a>. Our 100% comprehensive transit policy covers immediate studio restoration or complete replacement.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
