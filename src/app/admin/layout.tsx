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
    { name: 'Products Catalog', href: '/admin/products', icon: Palette },
    { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Orders & Sales', href: '/admin/orders', icon: Package },
    { name: 'Artists & Creators', href: '/admin/artists', icon: Users },
    { name: 'Collections', href: '/admin/collections', icon: Layers },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white border-r border-neutral-800 flex flex-col hidden md:flex h-screen sticky top-0 shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800 justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight uppercase text-white block leading-tight">
                Store Admin
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block">
                Management CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-black' : 'text-neutral-500'}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} /> View Live Store
            </span>
            <span className="text-[10px]">↗</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-neutral-900 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="md:hidden h-14 bg-black text-white border-b border-neutral-800 flex items-center px-4 justify-between sticky top-0 z-20">
          <Link href="/admin" className="text-sm font-bold tracking-wider uppercase">
            Store Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-neutral-300 font-mono flex items-center gap-1"
            >
              Store <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
