'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-[#FAFAF9] border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 4-Column Structured E-Commerce Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 relative">
                <Image src="/brand-seal.svg" alt="Atelier" fill className="object-contain" />
              </div>
              <span className="font-sans font-bold text-lg tracking-[0.2em] text-white uppercase">
                ATELIER
              </span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-sans">
              Curated original wall art, sculptures, and decorative pieces designed for modern living spaces. Delivered pan-India with white-glove assurance.
            </p>
            <div className="space-y-1 text-xs text-neutral-400 font-sans">
              <p>{SITE_CONFIG.contact.address}</p>
              <p>{SITE_CONFIG.contact.phone}</p>
              <p className="text-[#B08A4A]">{SITE_CONFIG.contact.email}</p>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-sans font-bold tracking-widest text-white uppercase">
              Shop
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-neutral-400">
              <li>
                <Link href="/wall-art" className="hover:text-white transition-colors">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link href="/sculptures" className="hover:text-white transition-colors">
                  Sculptures
                </Link>
              </li>
              <li>
                <Link href="/decorative-pieces" className="hover:text-white transition-colors">
                  Decorative Pieces
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?filter=bestseller" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-sans font-bold tracking-widest text-white uppercase">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-neutral-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Inquiries
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  7-Day In-Home Trial
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Framing &amp; Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Orders */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-sans font-bold tracking-widest text-white uppercase">
              Account
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-neutral-400">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-sans text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} ATELIER HOME &amp; LIVING. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Returns Policy
            </Link>
            <a
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href={SITE_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
