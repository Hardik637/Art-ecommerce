'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isFirebaseConfigured()) {
        const { signInWithEmail } = await import('@/lib/firebase');
        await signInWithEmail(email, password);
        router.push(redirect);
        router.refresh();
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (isFirebaseConfigured()) {
        const { signInWithGoogle } = await import('@/lib/firebase');
        await signInWithGoogle();
        router.push(redirect);
        router.refresh();
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
        },
      });
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed.');
    }
  };

  const handleDemoAccess = () => {
    document.cookie = 'atelier_demo_user=vikram; path=/; max-age=86400';
    router.push(redirect || '/account');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16 text-black">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-sans text-2xl md:text-3xl tracking-[0.14em] font-bold text-black uppercase">
              ATELIER
            </span>
            <span className="text-[9px] tracking-[0.16em] text-neutral-500 uppercase font-sans font-semibold">
              Home &amp; Living
            </span>
          </Link>
          <h1 className="type-heading text-xl md:text-2xl text-black mt-4 mb-1">
            Customer Sign In
          </h1>
          <p className="text-neutral-500 font-sans text-xs max-w-xs mx-auto leading-relaxed">
            Access your orders, saved wishlist items, and delivery status.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm">
          {/* Quick Demo Access Button */}
          <button
            onClick={handleDemoAccess}
            type="button"
            className="w-full mb-6 bg-neutral-900 text-white border border-neutral-800 py-3 px-4 font-sans text-xs tracking-wider uppercase flex items-center justify-between hover:bg-black transition-colors group"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="font-medium">Quick Demo Access (Vikram Sethi)</span>
            </span>
            <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-neutral-300 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-black hover:border-black hover:bg-neutral-50 transition-all mb-6 bg-white"
          >
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-neutral-400 text-[10px] uppercase font-sans font-medium tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-sans font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-white border border-neutral-300 px-4 py-2.5 font-sans text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-sans font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white border border-neutral-300 px-4 py-2.5 font-sans text-sm outline-none focus:border-black transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-neutral-100 text-red-700 text-xs font-medium p-3 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white uppercase tracking-widest text-xs py-3 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-4 font-sans font-bold"
            >
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-sans text-neutral-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-black font-semibold underline underline-offset-4 hover:text-neutral-700 transition-colors">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
