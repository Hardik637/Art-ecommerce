'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function Header() {
  const openCart = useCartStore((state) => state.openCart);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Collector';
        setUserInitial(name.charAt(0).toUpperCase());
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        setIsLoggedIn(true);
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Collector';
        setUserInitial(name.charAt(0).toUpperCase());
      } else {
        setIsLoggedIn(false);
        setUserInitial(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* ── Top Announcement Promo Bar ─────────────────────────────── */}
      <div className="bg-black text-white text-[10.5px] sm:text-[11px] font-sans font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-neutral-900">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
          <span>Free Shipping On Orders Above ₹999</span>
          <span className="text-neutral-500">•</span>
          <span>Cash On Delivery Available</span>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline">7-Day In-Home Trial</span>
        </div>
      </div>

      {/* ── Main Modern E-Commerce Header ──────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-16 md:h-18 flex items-center justify-between">
          {/* Mobile Menu & Search Triggers */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#0F0F0F] hover:text-black transition-colors -ml-2"
              aria-label="Open mobile navigation"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <Link
              href="/search"
              className="p-2 text-[#0F0F0F] hover:text-black transition-colors"
              aria-label="Search catalog"
            >
              <Search size={20} strokeWidth={1.8} />
            </Link>
          </div>

          {/* Brand Logo / Fashion Wordmark */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
            >
              <div className="w-7 h-7 relative flex-shrink-0">
                <Image
                  src="/brand-seal.svg"
                  alt="Atelier"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-lg md:text-xl tracking-[0.2em] text-[#0F0F0F] leading-none uppercase">
                  ATELIER
                </span>
                <span className="text-[8px] font-sans font-medium tracking-[0.3em] text-[#71717A] uppercase mt-0.5">
                  Home &amp; Living
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links — Clean Modern Fashion E-Commerce */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-sans font-medium tracking-[0.14em] text-[#18181B]">
            <Link
              href="/"
              className="py-5 uppercase transition-colors hover:text-black relative after:absolute after:bottom-4 after:left-0 after:right-0 after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Home
            </Link>
            <Link
              href="/wall-art"
              className="py-5 uppercase transition-colors hover:text-black relative after:absolute after:bottom-4 after:left-0 after:right-0 after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Wall Art
            </Link>
            <Link
              href="/sculptures"
              className="py-5 uppercase transition-colors hover:text-black relative after:absolute after:bottom-4 after:left-0 after:right-0 after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Sculptures
            </Link>
            <Link
              href="/decorative-pieces"
              className="py-5 uppercase transition-colors hover:text-black relative after:absolute after:bottom-4 after:left-0 after:right-0 after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Decorative Pieces
            </Link>
            <Link
              href="/products"
              className="py-5 uppercase transition-colors text-[#71717A] hover:text-black"
            >
              All Products
            </Link>
          </nav>

          {/* Utility Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <Link
              href="/search"
              className="hidden lg:flex p-2 text-[#0F0F0F] hover:text-black transition-colors"
              aria-label="Search products"
            >
              <Search size={19} strokeWidth={1.8} />
            </Link>

            <Link
              href="/account/wishlist"
              className="relative p-2 text-[#0F0F0F] hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.8} />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute top-1 right-0.5 w-4 h-4 bg-[#0F0F0F] text-white rounded-full text-[9px] font-sans font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="p-2 text-[#0F0F0F] hover:text-black transition-colors flex items-center gap-1.5"
              aria-label="Account"
            >
              {mounted && isLoggedIn && userInitial ? (
                <div className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white text-[10px] font-sans font-bold flex items-center justify-center">
                  {userInitial}
                </div>
              ) : (
                <User size={20} strokeWidth={1.8} />
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-black hover:text-neutral-700 transition-colors flex items-center gap-1.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-1 right-0.5 w-4 h-4 bg-black text-white rounded-full text-[9px] font-sans font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-12">
            <div className="w-screen max-w-xs bg-white border-r border-neutral-200 flex flex-col shadow-2xl">
              {/* Mobile Drawer Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative">
                    <Image src="/brand-seal.svg" alt="Atelier" fill className="object-contain" />
                  </div>
                  <span className="font-sans font-bold text-base tracking-wider text-black">
                    ATELIER
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-1 text-sm font-sans font-medium text-black">
                <div>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 uppercase tracking-wider text-xs font-semibold border-b border-neutral-100 hover:text-black transition-colors"
                  >
                    <span>Home</span>
                    <ChevronRight size={14} className="text-neutral-400" />
                  </Link>
                </div>

                <div>
                  <Link
                    href="/wall-art"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 uppercase tracking-wider text-xs font-semibold border-b border-neutral-100 hover:text-black transition-colors"
                  >
                    <span>Wall Art</span>
                    <ChevronRight size={14} className="text-neutral-400" />
                  </Link>
                </div>

                <div>
                  <Link
                    href="/sculptures"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 uppercase tracking-wider text-xs font-semibold border-b border-neutral-100 hover:text-black transition-colors"
                  >
                    <span>Sculptures</span>
                    <ChevronRight size={14} className="text-neutral-400" />
                  </Link>
                </div>

                <div>
                  <Link
                    href="/decorative-pieces"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 uppercase tracking-wider text-xs font-semibold border-b border-neutral-100 hover:text-black transition-colors"
                  >
                    <span>Decorative Pieces</span>
                    <ChevronRight size={14} className="text-neutral-400" />
                  </Link>
                </div>

                <div className="pt-3">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-neutral-600 hover:text-black transition-colors"
                  >
                    All Products Catalog
                  </Link>
                </div>

                <div>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-neutral-600 hover:text-black transition-colors"
                  >
                    About Atelier
                  </Link>
                </div>

                <div>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-neutral-600 hover:text-black transition-colors"
                  >
                    Contact &amp; Customer Care
                  </Link>
                </div>
              </div>

              {/* Mobile Drawer Footer Actions */}
              <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
                <Link
                  href={isLoggedIn ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#0F0F0F] text-white py-3 text-center text-xs font-semibold uppercase tracking-wider block transition-colors hover:bg-neutral-800"
                >
                  {isLoggedIn ? 'My Account' : 'Sign In / Register'}
                </Link>
                <div className="flex justify-around text-xs text-neutral-500 pt-1">
                  <Link href="/shipping" onClick={() => setMobileMenuOpen(false)}>
                    Shipping &amp; Delivery
                  </Link>
                  <span>•</span>
                  <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
                    Help &amp; FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
