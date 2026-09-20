import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Award, Compass, Heart, Package, Settings, ShieldCheck, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Account | ATELIER Home & Living',
  description:
    'Manage your Atelier orders, saved wishlist items, and delivery preferences.',
  robots: {
    index: false,
    follow: true,
  },
};

const NAV = [
  { name: 'Account Overview',  href: '/account',            icon: Compass },
  { name: 'My Orders',         href: '/account/orders',     icon: Package },
  { name: 'Wishlist',          href: '/account/wishlist',   icon: Heart },
  { name: 'My Collection',     href: '/account/collection', icon: Award },
  { name: 'Profile Details',   href: '/account/profile',    icon: User },
  { name: 'Settings',          href: '/account/settings',   icon: Settings },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const demoUserCookie = cookieStore.get('atelier_demo_user');

  let fullName = 'Vikram Sethi';
  let email = 'vikram.sethi@example.com';
  let avatarUrl: string | null = null;
  let isDemo = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
      avatarUrl = user.user_metadata?.avatar_url || null;
      email = user.email || '';
    } else if (demoUserCookie?.value) {
      isDemo = true;
    } else {
      isDemo = true;
    }
  } catch {
    isDemo = true;
  }

  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="bg-neutral-50 min-h-screen text-black">
      {/* Header Banner */}
      <div className="border-b border-neutral-200 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-black" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-semibold text-neutral-500">
                Customer Account
              </span>
            </div>
            <h1 className="font-sans text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-black">
              Welcome, {fullName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-5 py-2.5 bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-sans font-bold shadow-xs"
            >
              Shop Catalog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ── Sidebar ── */}
          <aside className="w-full md:w-64 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white text-black p-5 mb-4 border border-neutral-200 shadow-xs">
              <div className="flex items-center gap-3.5 mb-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-300"
                  />
                ) : (
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-sans font-bold">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-sans font-bold text-sm leading-tight truncate text-black uppercase" title={fullName}>
                    {fullName}
                  </p>
                  <p className="text-neutral-500 text-[10px] font-sans tracking-wider uppercase mt-0.5">
                    Verified Customer
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
                <span className="truncate" title={email}>{email}</span>
                <ShieldCheck size={14} className="text-black shrink-0" />
              </div>
            </div>

            {/* Nav links */}
            <nav className="space-y-1 bg-white border border-neutral-200 p-2 shadow-xs">
              {NAV.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors group"
                >
                  <Icon size={15} className="text-neutral-400 group-hover:text-black transition-colors" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {isDemo && (
              <div className="mt-4 p-3 border border-neutral-200 bg-white text-center">
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                  Demo account mode active.
                </p>
              </div>
            )}
          </aside>

          {/* ── Page content ── */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
