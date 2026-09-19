'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Package,
  PlusCircle,
  Users,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Artworks Catalog', href: '/admin/products', icon: Palette },
    { name: 'Add Masterwork', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Acquisitions & Orders', href: '/admin/orders', icon: Package },
    { name: 'Master Artists', href: '/admin/artists', icon: Users },
    { name: 'Exhibitions & Edits', href: '/admin/collections', icon: Layers },
    { name: 'Curatorial Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE7] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#11100F] text-[#F4EFE7] border-r border-[#292622] flex flex-col hidden md:flex h-screen sticky top-0 shrink-0">
        {/* Gallery Seal Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#B08A4A]/20 border border-[#B08A4A]/50 flex items-center justify-center text-[#B08A4A]">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="font-serif text-base tracking-[0.15em] font-light uppercase text-[#FAF8F5] block leading-tight">
                Atelier
              </span>
              <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#B08A4A] block">
                Curator CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#FAF8F5] text-[#11100F] font-semibold shadow-md'
                    : 'text-[#A8A096] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-[#B08A4A]' : 'text-[#777]'}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs text-[#A8A096] hover:text-white hover:bg-white/5 transition-colors font-mono"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> Live Gallery View
            </span>
            <span className="text-[10px] text-[#B08A4A]">↗</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors font-mono"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#11100F] text-[#FAF8F5] border-b border-white/10 flex items-center px-6 justify-between sticky top-0 z-20">
          <Link href="/admin" className="font-serif text-lg tracking-widest uppercase">
            Atelier <span className="text-[#B08A4A] text-xs font-mono">CMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#B08A4A] font-mono flex items-center gap-1"
            >
              Gallery <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
