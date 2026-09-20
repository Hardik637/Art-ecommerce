'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Check, Send, Clock, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('orders');
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
    <div className="bg-white min-h-screen py-16 px-6 md:px-12 text-black">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-8">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-neutral-400 block mb-2">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight leading-none">
            Customer Support &amp; Inquiries
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-3 max-w-2xl leading-relaxed font-sans">
            Have questions about dimensions, framing options, custom orders, or shipping? Our support team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-1">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block">
                    Email Inquiries
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-base font-sans font-bold text-black hover:underline transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-sans">
                    Responses within 4–6 business hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-1">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block">
                    Support Hours
                  </span>
                  <p className="text-sm font-sans font-bold text-black uppercase tracking-wide">
                    {siteConfig.contact.supportHours}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-sans">
                    Orders, delivery tracking, and returns assistance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 block">
                    Delivery Coverage
                  </span>
                  <p className="text-sm font-sans font-bold text-black uppercase tracking-wide">
                    {siteConfig.contact.coverage}
                  </p>
                  <p className="text-xs text-neutral-500 font-sans">
                    Insured nationwide doorstep transit
                  </p>
                </div>
              </div>
            </div>

            {/* Space Simulation */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-black text-xs font-semibold">
                <ShieldCheck size={16} />
                <span>Complimentary Room Sizing Help</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Need advice on whether a piece will fit your wall? Send us your wall dimensions and photos, and our team will recommend the ideal size.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto text-xl">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-black">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name || 'Customer'}. We have received your inquiry and our support team will respond via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-lg border border-neutral-300 hover:border-black text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-500 block mb-2">
                    Topic
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'orders', label: 'Order Status' },
                      { id: 'product', label: 'Product Inquiry' },
                      { id: 'framing', label: 'Framing Sizing' },
                      { id: 'returns', label: 'Returns' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setInquiryType(tab.id)}
                        className={`py-2 px-2 text-center rounded-lg text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer ${
                          inquiryType === tab.id
                            ? 'bg-black text-white font-bold'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black font-semibold'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-sans font-bold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-sans font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-sans font-bold">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-sans font-bold">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, order number, or product question..."
                    className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs font-sans outline-none focus:border-black transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-sans font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
