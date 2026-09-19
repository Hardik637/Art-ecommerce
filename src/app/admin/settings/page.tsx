'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Save } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
            Curatorial Configuration
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
          Gallery & Logistics Configuration
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Manage brand identity, art concierge contacts, framing specifications, and insured transit thresholds.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#EBF7EE] border border-[#1E7E34]/30 text-[#1E7E34] text-xs font-sans font-medium flex items-center gap-3">
          <Check size={16} />
          Curatorial settings saved successfully across gallery services.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand Particulars */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E4DBCF] shadow-sm p-6 sm:p-8 space-y-5">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Gallery Brand Identity
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Art House Name
              </label>
              <input
                type="text"
                defaultValue={siteConfig.name}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-serif text-lg outline-none focus:border-[#B08A4A]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Curatorial Tagline
              </label>
              <input
                type="text"
                defaultValue="Curated Masterworks, Fine Art Sculptures & Provenance Editions"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Senior Art Concierge Email
              </label>
              <input
                type="email"
                defaultValue={siteConfig.contact.email}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-xs outline-none focus:border-[#B08A4A]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                VIP Private Client Concierge Phone
              </label>
              <input
                type="text"
                defaultValue={siteConfig.contact.phone}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-xs outline-none focus:border-[#B08A4A]"
              />
            </div>
          </div>
        </div>

        {/* Framing & Logistics */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E4DBCF] shadow-sm p-6 sm:p-8 space-y-5">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Archival Framing & Transit Insurance
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Complimentary White-Glove Threshold (₹)
              </label>
              <input
                type="number"
                defaultValue={siteConfig.shipping.freeThreshold}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-[#B08A4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Standard Crate Transit Fee (₹)
              </label>
              <input
                type="number"
                defaultValue={siteConfig.shipping.standardFee}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-[#B08A4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Wood Float Reveal Gap
              </label>
              <input
                type="text"
                defaultValue="8mm Museum Shadow Reveal"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Provenance Certificate Prefix
              </label>
              <input
                type="text"
                defaultValue="ATH-COA-2026-"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-xs outline-none focus:border-[#B08A4A]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium flex items-center justify-center gap-2 shadow-md"
        >
          <Save size={15} /> Save Curatorial Configuration
        </button>
      </form>
    </div>
  );
}
