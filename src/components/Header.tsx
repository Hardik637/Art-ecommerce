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
      {/* ── Main Editorial Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F4EFE7]/95 backdrop-blur-md border-b border-[#E4DBCF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[76px] flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#11100F] hover:text-[#B08A4A] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <Link href="/search" className="p-1.5 text-[#11100F]" aria-label="Search">
              <Search size={20} strokeWidth={1.8} />
            </Link>
          </div>

          {/* Brand Logo / Seal */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
            >
              <div className="w-9 h-9 relative flex-shrink-0">
                <Image
                  src="/brand-seal.svg"
                  alt="Atelier Seal"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl md:text-2xl font-semibold tracking-[0.14em] text-[#11100F] leading-none">
                  ATELIER
                </span>
                <span className="text-[7.5px] font-sans font-semibold tracking-[0.3em] text-[#78716C] uppercase mt-0.5">
                  Art &amp; Living
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links — Strictly 3 Curated Categories */}
          <nav className="hidden lg:flex items-center space-x-10 text-xs font-sans font-medium tracking-[0.2em] text-[#11100F]">
            <Link
              href="/wall-art"
              className="hover:text-[#B08A4A] py-6 uppercase transition-colors"
            >
              Wall Art
            </Link>

            <Link
              href="/sculptures"
              className="hover:text-[#B08A4A] py-6 uppercase transition-colors"
            >
              Sculptures
            </Link>

            <Link
              href="/decorative-pieces"
              className="hover:text-[#B08A4A] py-6 uppercase transition-colors"
            >
              Decorative Pieces
            </Link>
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/search"
              className="hidden lg:flex p-2 text-[#11100F] hover:text-[#B08A4A] transition-colors"
              aria-label="Search catalog"
            >
              <Search size={19} strokeWidth={1.7} />
            </Link>

            <Link
              href="/account/wishlist"
              className="relative p-2 text-[#11100F] hover:text-[#B08A4A] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.7} />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#481E25] text-[#F4EFE7] rounded-full text-[9px] font-sans font-semibold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="p-2 text-[#11100F] hover:text-[#B08A4A] transition-colors flex items-center gap-2"
              aria-label="Account"
            >
              {mounted && isLoggedIn && userInitial ? (
                <div className="w-6 h-6 rounded-full bg-[#11100F] text-[#F4EFE7] text-[10px] font-serif flex items-center justify-center">
                  {userInitial}
                </div>
              ) : (
                <User size={19} strokeWidth={1.7} />
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-[#11100F] hover:text-[#B08A4A] transition-colors flex items-center gap-2"
              aria-label="Open Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B08A4A] text-[#11100F] rounded-full text-[9px] font-sans font-bold flex items-center justify-center">
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
            className="absolute inset-0 bg-[#11100F]/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-[#F4EFE7] border-r border-[#E4DBCF] flex flex-col shadow-2xl">
              {/* Mobile Header */}
              <div className="p-6 border-b border-[#E4DBCF] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 relative">
                    <Image src="/brand-seal.svg" alt="Atelier" fill className="object-contain" />
                  </div>
                  <span className="font-serif text-lg font-semibold tracking-wider text-[#11100F]">
                    ATELIER
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#78716C] hover:text-[#11100F]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation List — Strictly 3 Curated Categories */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2 text-sm font-sans font-medium text-[#11100F]">
                <div>
                  <Link
                    href="/wall-art"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3.5 uppercase tracking-widest text-xs font-semibold border-b border-[#E4DBCF] hover:text-[#B08A4A] transition-colors"
                  >
                    Wall Art
                  </Link>
                </div>

                <div>
                  <Link
                    href="/sculptures"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3.5 uppercase tracking-widest text-xs font-semibold border-b border-[#E4DBCF] hover:text-[#B08A4A] transition-colors"
                  >
                    Sculptures
                  </Link>
                </div>

                <div>
                  <Link
                    href="/decorative-pieces"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3.5 uppercase tracking-widest text-xs font-semibold border-b border-[#E4DBCF] hover:text-[#B08A4A] transition-colors"
                  >
                    Decorative Pieces
                  </Link>
                </div>

                <div className="pt-4">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-[#78716C] hover:text-[#11100F] transition-colors"
                  >
                    All Works &amp; Catalog
                  </Link>
                </div>

                <div>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-[#78716C] hover:text-[#11100F] transition-colors"
                  >
                    About Atelier &amp; Studio
                  </Link>
                </div>

                <div>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 uppercase tracking-wider text-xs text-[#78716C] hover:text-[#11100F] transition-colors"
                  >
                    Contact &amp; Inquiries
                  </Link>
                </div>
              </div>

              {/* Mobile Footer Links */}
              <div className="p-6 border-t border-[#E4DBCF] bg-[#FAF7F2] space-y-3">
                <Link
                  href={isLoggedIn ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#11100F] text-[#F4EFE7] py-2.5 text-center text-xs font-semibold uppercase tracking-wider block"
                >
                  {isLoggedIn ? 'My Collector Account' : 'Sign In'}
                </Link>
                <div className="flex justify-around text-xs text-[#78716C] pt-2">
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                    About Atelier
                  </Link>
                  <span>•</span>
                  <Link href="/shipping" onClick={() => setMobileMenuOpen(false)}>
                    Shipping &amp; FAQ
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
