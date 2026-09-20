'use client';

import React, { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-6 text-black">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-1 font-semibold">
          Configuration
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          Store & Delivery Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage store information, customer service contacts, and free shipping delivery thresholds.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs font-semibold flex items-center gap-3">
          <Check size={16} />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Particulars */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Store Identity
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Store Name
              </label>
              <input
                type="text"
                defaultValue={siteConfig.name}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-base font-bold outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Store Tagline
              </label>
              <input
                type="text"
                defaultValue="Curated Wall Art, Sculptures & Modern Home Décor"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Support Email
              </label>
              <input
                type="email"
                defaultValue={siteConfig.contact.email}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 font-mono text-xs outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Support Hours
              </label>
              <input
                type="text"
                defaultValue={siteConfig.contact.supportHours}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 font-mono text-xs outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Shipping & Thresholds
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                defaultValue={siteConfig.shipping.freeThreshold}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 font-mono text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                defaultValue={siteConfig.shipping.standardFee}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 font-mono text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Save size={15} /> Save Settings
        </button>
      </form>
    </div>
  );
}
