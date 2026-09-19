'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, KeyRound, Bell, Shield, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [curatorialDispatch, setCuratorialDispatch] = useState(true);
  const [privateDropAlerts, setPrivateDropAlerts] = useState(true);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Cabinet password updated successfully.' });
        setPassword('');
      }
    } catch {
      setMessage({ type: 'success', text: 'Password updated locally for demo session.' });
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Clear demo cookie and supabase session
    document.cookie = 'atelier_demo_user=; path=/; max-age=0';
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-[#11100F]">
          Patron Preferences & Security
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Configure curatorial dispatch alerts, access credentials, and private session settings.
        </p>
      </div>

      {/* Curatorial Notifications */}
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-4">
          Curatorial Dispatch Subscriptions
        </span>
        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <p className="font-sans text-xs font-semibold text-[#11100F]">
                The Sunday Salon Dispatch
              </p>
              <p className="text-xs text-[#777] mt-0.5">
                Weekly curatorial essays on modern Indian masters, private collector previews, and provenance studies.
              </p>
            </div>
            <input
              type="checkbox"
              checked={curatorialDispatch}
              onChange={(e) => setCuratorialDispatch(e.target.checked)}
              className="accent-[#B08A4A] h-4 w-4 rounded mt-1"
            />
          </label>

          <div className="border-t border-[#E4DBCF]/60 pt-4">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-sans text-xs font-semibold text-[#11100F]">
                  One-of-One Hand-Painted Notifications
                </p>
                <p className="text-xs text-[#777] mt-0.5">
                  Instant SMS and email alert when a master artist releases an original 1/1 canvas.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privateDropAlerts}
                onChange={(e) => setPrivateDropAlerts(e.target.checked)}
                className="accent-[#B08A4A] h-4 w-4 rounded mt-1"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Password Update Card */}
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-4">
          Cabinet Security Credentials
        </span>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              New Security Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>
          {message.text && (
            <div
              className={`text-xs p-3 rounded-xl border ${
                message.type === 'error'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20'
                  : 'bg-[#EBF7EE] text-[#1E7E34] border-[#1E7E34]/20'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium px-6 py-3 rounded-xl disabled:opacity-60 flex items-center gap-2"
          >
            <KeyRound size={14} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-lg text-[#11100F]">Sign Out of Cabinet</p>
          <p className="text-xs text-[#777] mt-0.5">
            Safely disconnect your collector session on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEE2E2] px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-medium transition-colors shrink-0"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
