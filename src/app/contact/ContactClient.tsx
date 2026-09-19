'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Sparkles, Check, Send, Clock, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('acquisition');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F4EFE7] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-[#E4DBCF] pb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
              Private Curatorial Advisory
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#11100F] font-light leading-tight">
            Consult the Atelier Art Concierge
          </h1>
          <p className="text-xs md:text-sm text-[#666] font-sans mt-3 max-w-2xl leading-relaxed">
            Our curatorial team is available to assist patrons with private acquisitions, bespoke artist commissions, architectural scale consultations, and insured white-glove transit inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center shrink-0 mt-1">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block">
                    Curatorial Inquiries & Provenance
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-serif text-lg text-[#11100F] hover:text-[#B08A4A] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <p className="text-[11px] text-[#888] font-sans mt-0.5">
                    Responses within 4 business hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center shrink-0 mt-1">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block">
                    VIP Collector Desk
                  </span>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-serif text-lg text-[#11100F] hover:text-[#B08A4A] transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  <p className="text-[11px] text-[#888] font-sans mt-0.5">
                    Monday – Saturday, 10:00 – 19:00 IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#11100F] text-[#B08A4A] flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block">
                    Atelier Gallery & Private Salon
                  </span>
                  <p className="font-serif text-base text-[#11100F]">
                    7 Residency Road, Shanthala Nagar
                  </p>
                  <p className="text-xs text-[#666] font-sans">
                    Bengaluru, Karnataka 560025, India
                  </p>
                  <p className="text-[11px] text-[#B08A4A] font-mono mt-1">
                    Private viewings by appointment only
                  </p>
                </div>
              </div>
            </div>

            {/* Advisory Guarantee Box */}
            <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#8A6A32] text-xs font-mono">
                <ShieldCheck size={16} />
                <span>Complimentary Space Simulation</span>
              </div>
              <p className="text-xs text-[#666] font-sans leading-relaxed">
                Send our senior curators a photograph and dimensions of your wall space; we provide digital photographic renders of prospective masterworks framed to exact architectural scale within 24 hours.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E4DBCF] rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF7EE] border border-[#1E7E34]/30 text-[#1E7E34] flex items-center justify-center mx-auto text-2xl">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-2xl text-[#11100F] font-light">
                  Curatorial Inquiry Received
                </h3>
                <p className="text-xs text-[#666] font-sans max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name || 'Patron'}. Our dedicated art concierge has received your request and will contact you via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-[#E4DBCF] hover:border-[#11100F] text-xs uppercase tracking-wider font-sans font-medium transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-3">
                    Inquiry Nature
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'acquisition', label: 'Acquisition' },
                      { id: 'commission', label: 'Bespoke Art' },
                      { id: 'framing', label: 'Framing Spec' },
                      { id: 'viewing', label: 'Salon Visit' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setInquiryType(tab.id)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-sans transition-colors ${
                          inquiryType === tab.id
                            ? 'bg-[#11100F] text-[#F4EFE7] font-medium'
                            : 'bg-white border border-[#E4DBCF] text-[#666] hover:text-[#11100F]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                      Patron Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Sethi"
                      className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                      Patron Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="collector@domain.com"
                      className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                    Telephone (Optional, for WhatsApp Consultation)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98101 23456"
                    className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                    Message / Artwork Particulars *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the artwork you are considering, desired dimensions, or specific interior architectural requirements..."
                    className="w-full bg-white border border-[#E4DBCF] rounded-xl p-4 font-sans text-xs outline-none focus:border-[#B08A4A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={14} /> Dispatch Inquiry to Chief Curator
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
