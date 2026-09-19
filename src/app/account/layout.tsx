import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Award, Compass, Heart, Package, Settings, ShieldCheck, User, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Collector Cabinet | ATELIER & ART HOUSE',
  description:
    'Manage your Atelier & Art House collector cabinet — private collection, digital certificates of authenticity, insured shipments, and followed master artists.',
  robots: {
    index: false,
    follow: true,
  },
}

const NAV = [
  { name: 'Cabinet Overview',   href: '/account',            icon: Compass },
  { name: 'My Collection',      href: '/account/collection', icon: Award },
  { name: 'Acquisitions',       href: '/account/orders',     icon: Package },
  { name: 'Curated Wishlist',   href: '/account/wishlist',   icon: Heart },
  { name: 'Collector Profile',  href: '/account/profile',    icon: User },
  { name: 'Preferences',        href: '/account/settings',   icon: Settings },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const demoUserCookie = cookieStore.get('atelier_demo_user')

  let fullName = 'Vikram Sethi'
  let email = 'vikram.sethi@example.com'
  let avatarUrl: string | null = null
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Collector'
      avatarUrl = user.user_metadata?.avatar_url || null
      email = user.email || ''
    } else if (demoUserCookie?.value) {
      isDemo = true
    } else {
      // In development or when no Supabase project is active, default to demo collector
      isDemo = true
    }
  } catch {
    isDemo = true
  }

  const initial = fullName.charAt(0).toUpperCase()

  return (
    <div className="bg-[#F4EFE7] min-h-screen">
      {/* Editorial Header Banner */}
      <div className="border-b border-[#E4DBCF] bg-[#FAF8F5]/80 backdrop-blur-sm py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#B08A4A]">
                Provenance & Patron Cabinet
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
              Welcome, {fullName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#B08A4A]/30 bg-[#B08A4A]/10 text-[#B08A4A] text-xs font-mono">
              <Sparkles size={12} />
              Founding Patron Tier
            </span>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-wider font-sans font-medium"
            >
              Explore Works
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="w-full md:w-64 flex-shrink-0">
            {/* Collector Monogram Card */}
            <div className="bg-[#11100F] text-[#F4EFE7] rounded-2xl p-6 mb-4 border border-[#B08A4A]/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B08A4A]/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-14 h-14 rounded-full object-cover border border-[#B08A4A]/60"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#292622] rounded-full flex items-center justify-center text-xl font-serif text-[#B08A4A] border border-[#B08A4A]/40 shadow-inner">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-serif text-lg leading-tight truncate text-[#FAF8F5]" title={fullName}>
                    {fullName}
                  </p>
                  <p className="text-[#B08A4A] text-[10px] font-mono tracking-wider uppercase mt-1">
                    Verified Collector
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A8A096]">
                <span className="truncate" title={email}>{email}</span>
                <ShieldCheck size={14} className="text-[#B08A4A] shrink-0" />
              </div>
            </div>

            {/* Nav links */}
            <nav className="space-y-1 bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-2 shadow-sm">
              {NAV.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-[#555] hover:bg-[#F4EFE7] hover:text-[#11100F] transition-all group"
                >
                  <Icon size={16} className="text-[#888] group-hover:text-[#B08A4A] transition-colors" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {isDemo && (
              <div className="mt-4 p-4 rounded-xl border border-[#B08A4A]/20 bg-[#FAF8F5] text-center">
                <p className="text-[11px] text-[#777] leading-relaxed">
                  Viewing collector cabinet in guest demonstration mode.
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
  )
}
