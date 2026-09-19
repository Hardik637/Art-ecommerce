'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3 text-[#111]">Check Your Email</h2>
          <p className="text-[#888] font-medium leading-relaxed mb-8">
            We sent a confirmation link to <strong className="text-[#111]">{form.email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/login" className="inline-block bg-[#111] text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-[#FF3B30] transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4EFE7] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <span className="font-serif text-3xl md:text-4xl tracking-[0.2em] font-light text-[#11100F] uppercase">
              Atelier
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#B08A4A] uppercase font-mono">
              Art House & Provenance
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-normal text-[#11100F] mt-6 mb-2">
            Register as an Atelier Patron
          </h1>
          <p className="text-[#555] font-sans text-xs max-w-xs mx-auto leading-relaxed">
            Gain curatorial privileges, provenance certificates for all acquisitions, and invitations to private exhibitions.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-8 shadow-sm">
          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-[#E4DBCF] rounded-xl py-3 font-sans text-xs font-medium text-[#11100F] hover:border-[#B08A4A] hover:bg-white transition-all mb-6 bg-white/70"
          >
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E4DBCF]" />
            <span className="text-[#888] text-[10px] uppercase font-mono tracking-widest">or email registration</span>
            <div className="flex-1 h-px bg-[#E4DBCF]" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Patron / Collector Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Lord / Lady / Full Name"
                required
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="collector@domain.com"
                required
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#11100F]"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[#FEE2E2] text-[#DC2626] text-xs font-medium p-3 rounded-xl border border-[#DC2626]/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#11100F] text-[#F4EFE7] uppercase tracking-[0.2em] text-xs py-3.5 rounded-xl hover:bg-[#B08A4A] hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-4 font-sans font-semibold"
            >
              {loading ? 'Creating Account...' : <><span>Join Patron Registry</span><ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-sans text-[#777] mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-[#11100F] font-semibold underline underline-offset-4 decoration-[#B08A4A] hover:text-[#B08A4A] transition-colors">
            Sign In to Cabinet
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
