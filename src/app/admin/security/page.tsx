'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Save, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }

      setSuccess('Admin credentials updated successfully. Please remember your new password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-7 font-sans text-black">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5">
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-400 block mb-1 font-semibold">
          Access & Security
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-black uppercase leading-none">
          Admin Credentials
        </h1>
        <p className="text-xs text-neutral-500 mt-1.5 font-medium">
          Change your store owner admin username and master password. Old password verification is required.
        </p>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: VERIFY CURRENT PASSWORD */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-black">
              <KeyRound size={15} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Step 1: Current Password Verification *
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              Enter your current password to verify authorization before changing credentials.
            </p>

            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-10 py-2.5 text-xs text-black outline-none focus:border-black font-sans"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* STEP 2: NEW CREDENTIALS */}
          <div className="space-y-4 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-black block">
              Step 2: New Admin Credentials
            </span>

            {/* Username */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                Admin Username
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-black outline-none focus:border-black font-sans"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                New Master Password *
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-10 py-2.5 text-xs text-black outline-none focus:border-black font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-10 py-2.5 text-xs text-black outline-none focus:border-black font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying & Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Update Admin Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Info Card */}
      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
        <ShieldCheck size={16} className="shrink-0 mt-0.5 text-black" />
        <p>
          Password updates are hashed using <strong>PBKDF2-SHA512</strong> with a cryptographic salt.
          The server verifies old passwords in constant time to prevent timing analysis.
        </p>
      </div>
    </div>
  );
}
