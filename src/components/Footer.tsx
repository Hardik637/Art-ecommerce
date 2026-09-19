'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Twitter, ArrowRight, Check } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#11100F] text-[#F4EFE7] border-t border-[#292622] pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Editorial Top Section: Newsletter Banner (Omitted on Homepage per design requirements) */}
        {!isHomePage && (
          <div className="border-b border-[#292622] pb-16 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-3">
                The Collector&apos;s Dispatch
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#F4EFE7] tracking-tight leading-[1.1] mb-4">
                Keep art in your inbox.
              </h2>
              <p className="text-[#A8A29E] font-sans text-xs md:text-sm max-w-xl leading-relaxed">
                New masterworks from the studio, private exhibition invitations, and curatorial essays delivered twice monthly. Never intrusive.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-[#1C1A18] border border-[#B08A4A]/40 p-4 text-[#F4EFE7] flex items-center gap-3">
                  <Check size={18} className="text-[#B08A4A]" />
                  <span className="text-xs font-sans tracking-wide">
                    Welcome to Atelier dispatch. Check your inbox shortly.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter collector email address"
                    required
                    className="flex-1 bg-[#1C1A18] border border-[#3D352E] px-4 py-3.5 text-xs text-[#F4EFE7] placeholder-[#78716C] outline-none focus:border-[#B08A4A] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#B08A4A] hover:bg-[#D4AF37] text-[#11100F] px-6 py-3.5 text-xs font-sans font-semibold tracking-widest uppercase flex items-center gap-2 transition-colors flex-shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 4 Columns Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#292622]">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 relative">
                <Image src="/brand-seal.svg" alt="Atelier Seal" fill className="object-contain" />
              </div>
              <span className="font-serif text-2xl tracking-wider text-[#F4EFE7]">
                ATELIER
              </span>
            </Link>
            <p className="text-xs text-[#A8A29E] max-w-sm leading-relaxed mb-6 font-sans">
              A contemporary art house and luxury collector boutique celebrating master Indian painters, sculptors, and limited-edition figure designers. Curated for spaces that demand presence.
            </p>
            <div className="space-y-1 text-xs text-[#78716C]">
              <p>{SITE_CONFIG.contact.address}</p>
              <p>{SITE_CONFIG.contact.hours}</p>
              <p className="text-[#B08A4A] mt-2">{SITE_CONFIG.contact.email}</p>
            </div>
          </div>

          {/* Column 2: Shop Catalog */}
          <div>
            <h3 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-5">
              Shop Creations
            </h3>
            <ul className="space-y-3 text-xs font-sans text-[#A8A29E]">
              <li>
                <Link href="/wall-art" className="hover:text-[#F4EFE7] transition-colors">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link href="/sculptures" className="hover:text-[#F4EFE7] transition-colors">
                  Sculptures
                </Link>
              </li>
              <li>
                <Link href="/decorative-pieces" className="hover:text-[#F4EFE7] transition-colors">
                  Decorative Pieces
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F4EFE7] transition-colors">
                  All Catalog Works
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-[#F4EFE7] transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Studio & Guarantees */}
          <div>
            <h3 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-5">
              The Studio
            </h3>
            <ul className="space-y-3 text-xs font-sans text-[#A8A29E]">
              <li>
                <Link href="/about" className="hover:text-[#F4EFE7] transition-colors">
                  About the Artist &amp; Studio
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#F4EFE7] transition-colors">
                  Wall Scale &amp; Framing Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#F4EFE7] transition-colors">
                  White-Glove Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F4EFE7] transition-colors">
                  Contact &amp; Commissions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F4EFE7] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Collector Services */}
          <div>
            <h3 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase mb-5">
              Collector Care
            </h3>
            <ul className="space-y-3 text-xs font-sans text-[#A8A29E]">
              <li>
                <Link href="/shipping" className="hover:text-[#F4EFE7] transition-colors">
                  White-Glove Shipping
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#F4EFE7] transition-colors">
                  Wall Space &amp; Framing Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F4EFE7] transition-colors">
                  Certificate of Authenticity
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#F4EFE7] transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F4EFE7] transition-colors">
                  Atelier Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F4EFE7] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© {new Date().getFullYear()} ATELIER &amp; ART HOUSE. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#F4EFE7] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F4EFE7] transition-colors">
              Terms of Consignment
            </Link>
            <Link href="/refund-policy" className="hover:text-[#F4EFE7] transition-colors">
              Inspection Guarantee
            </Link>
            <a
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#B08A4A] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
            <a
              href={SITE_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#B08A4A] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
