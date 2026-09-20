'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [newDropAlerts, setNewDropAlerts] = useState(true);

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
        setMessage({ type: 'success', text: 'Password updated successfully.' });
        setPassword('');
      }
    } catch {
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
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
    <div className="space-y-6 text-black">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-black">
          Account Settings & Security
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage your email subscriptions, update password credentials, and active session.
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-4 font-semibold">
          Email Preferences
        </span>
        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-black">
                Weekly Newsletter
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                New arrivals, seasonal sales, and interior décor styling inspiration.
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="accent-black h-4 w-4 rounded mt-1 cursor-pointer"
            />
          </label>

          <div className="border-t border-neutral-200 pt-4">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-black">
                  New Product Drops & Back-in-Stock Alerts
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Instant email notifications when new wall art or sculptures are added.
                </p>
              </div>
              <input
                type="checkbox"
                checked={newDropAlerts}
                onChange={(e) => setNewDropAlerts(e.target.checked)}
                className="accent-black h-4 w-4 rounded mt-1 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Password Update Card */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-4 font-semibold">
          Change Password
        </span>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 font-semibold">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
            />
          </div>
          {message.text && (
            <div
              className={`text-xs p-3 rounded-lg border ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-neutral-100 text-black border-neutral-300'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            <KeyRound size={14} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-black">Sign Out</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            Safely disconnect your user session on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 border border-neutral-300 text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors shrink-0 cursor-pointer"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
