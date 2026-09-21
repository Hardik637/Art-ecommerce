'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render directly without admin sidebar or guards
  const isLoginPage = pathname === '/admin/login';

  const [authChecking, setAuthChecking] = useState(!isLoginPage);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    let isMounted = true;
    fetch('/api/admin/auth/verify')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.authenticated) {
            setAdminUser(data.user?.username || 'admin');
            setAuthChecking(false);
          } else {
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, pathname, router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // proceed
    }
    router.replace('/admin/login');
  };

  // If this is the login page, render just children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If verifying authentication, show modern minimal loading screen
  if (authChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-display font-black text-xl uppercase tracking-widest">
          VERIFYING ADMIN CREDENTIALS...
        </span>
        <span className="text-[10px] font-mono text-neutral-500 mt-2 uppercase tracking-widest">
          Encrypted Session Handshake
        </span>
      </div>
    );
  }

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders & Tracking', href: '/admin/orders', icon: Package },
    { name: 'Add New Item', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Products Catalog', href: '/admin/products', icon: Palette },
    { name: 'Artists & Creators', href: '/admin/artists', icon: Users },
    { name: 'Collections', href: '/admin/collections', icon: Layers },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-black antialiased">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-black text-white border-r border-neutral-900 flex flex-col hidden md:flex h-screen sticky top-0 shrink-0 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-900 justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-tight uppercase text-white block leading-tight">
                ZORODOOR
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block">
                ADMIN CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Admin identity badge */}
        <div className="px-4 py-3 bg-neutral-950/70 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-neutral-300">
              {adminUser || 'admin'}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
            OWNER
          </span>
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
                    ? 'bg-white text-black font-bold shadow-xs'
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
        <div className="p-3 border-t border-neutral-900 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors font-medium"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} /> View Live Store
            </span>
            <span className="text-[10px]">↗</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer text-left"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-black text-white border-b border-neutral-900 flex items-center px-4 justify-between sticky top-0 z-30">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="font-display font-black text-xl tracking-tight uppercase">
              ZORODOOR ADMIN
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-neutral-400 font-mono flex items-center gap-1 border border-neutral-800 px-2 py-1 rounded"
            >
              Store <ExternalLink size={11} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black text-white border-b border-neutral-900 px-4 py-3 space-y-1 z-20">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === link.href ? 'bg-white text-black' : 'text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">Admin: {adminUser}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-red-400 hover:underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6 md:p-10 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
