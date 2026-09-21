'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    fetch('/api/admin/auth/verify')
      .then((res) => {
        if (res.ok) {
          router.replace(redirectUrl);
        }
      })
      .catch(() => {});
  }, [router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace(redirectUrl);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8">
      {/* Card Header */}
      <div className="space-y-2 text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-black mx-auto flex items-center justify-center shadow-lg mb-4">
          <Lock size={20} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
          Restricted Access
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
          Owner Admin
        </h1>
        <p className="text-xs text-neutral-400 font-sans font-normal pt-1">
          Sign in with your encrypted credentials to manage orders, inventory, and storefront settings.
        </p>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3.5 flex items-start gap-3 text-red-200 text-xs animate-shake">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-3.5 flex items-center gap-3 text-white text-xs">
          <CheckCircle2 size={16} className="shrink-0 text-white" />
          <span>Identity verified. Accessing admin dashboard...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
            Admin Username
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
              Secret Key / Password
            </label>
            <span className="text-[10px] font-mono text-neutral-600">PBKDF2 Protected</span>
          </div>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </div>
          ) : success ? (
            <span>Authenticated</span>
          ) : (
            <>
              <span>Sign In To Admin</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </form>

      {/* Security Guarantee Footnote */}
      <div className="pt-4 border-t border-neutral-900 text-center space-y-1.5">
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          Zero-leak authentication • Timing-safe • HttpOnly cookie
        </p>
        <p className="text-[11px] text-neutral-600 font-sans">
          Need credentials? Check your configured environment or store setup documentation.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans selection:bg-white selection:text-black">
      {/* Top Header Bar */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-neutral-900">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-neutral-400 transition-colors">
            ZORODOOR
          </span>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase px-1.5 py-0.5 border border-neutral-800 rounded">
            STORE
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <ShieldCheck size={14} className="text-white" />
          <span className="hidden sm:inline">256-BIT ENCRYPTED SESSION</span>
        </div>
      </header>

      {/* Main Login Card with Suspense Boundary */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Loading Secure Gateway...
              </p>
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="h-14 px-6 sm:px-12 flex items-center justify-between border-t border-neutral-900 text-xs text-neutral-600 font-mono">
        <span>© {new Date().getFullYear()} ZORODOOR ATELIER</span>
        <Link href="/" className="hover:text-white transition-colors">
          Return to Storefront →
        </Link>
      </footer>
    </div>
  );
}
