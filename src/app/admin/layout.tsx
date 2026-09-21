'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Package,
  PlusCircle,
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

  // If verifying authentication, show modern minimal loading screen in clean white
  if (authChecking) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-display font-black text-2xl uppercase tracking-wider text-black">
          VERIFYING ADMIN CREDENTIALS...
        </span>
        <span className="text-[10px] font-mono text-neutral-400 mt-2 uppercase tracking-widest">
          Encrypted Session Handshake
        </span>
      </div>
    );
  }

  // Clean navigation links (Removed Artists & Collections per user request)
  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Order Tracking', href: '/admin/orders', icon: Package },
    { name: 'Add New Item', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Products Catalog', href: '/admin/products', icon: Palette },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-black antialiased selection:bg-black selection:text-white">
      {/* Desktop Sidebar (Majorly White with crisp black typography & borders) */}
      <aside className="w-64 bg-white text-black border-r border-neutral-200 flex flex-col hidden md:flex h-screen sticky top-0 shrink-0 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck size={18} strokeWidth={2.2} />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight uppercase text-black block leading-none">
                ZORODOOR
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block mt-0.5">
                STORE OWNER CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Admin identity badge */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-neutral-800">
              {adminUser || 'admin'}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 bg-white border border-neutral-300 px-2 py-0.5 rounded font-semibold">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-black text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black font-semibold'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-white' : 'text-neutral-500'}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-neutral-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} /> View Live Store
            </span>
            <span className="text-[10px] font-mono">↗</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-white">
        {/* Mobile Header (Clean White) */}
        <header className="md:hidden h-16 bg-white text-black border-b border-neutral-200 flex items-center px-4 justify-between sticky top-0 z-30 shadow-2xs">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <span className="font-display font-black text-xl tracking-tight uppercase">
              ZORODOOR ADMIN
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-neutral-600 font-mono flex items-center gap-1 border border-neutral-200 px-2 py-1 rounded hover:border-black"
            >
              Store <ExternalLink size={11} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-600 hover:text-black"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white text-black border-b border-neutral-200 px-4 py-3 space-y-1 z-20 shadow-lg">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  pathname === link.href ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Admin: {adminUser}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-red-600 font-bold hover:underline"
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
