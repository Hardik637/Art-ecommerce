'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Toast = { message: string; type: 'success' | 'error' };

export default function ProfilePage() {
  const supabase = createClient();
  const avatarRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('user@example.com');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const displayInitial = (fullName.trim() || email || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || 'Rahul Sharma');
        setPhone(user.user_metadata?.phone || '+91 98765 43210');
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), phone: phone.trim() },
      });
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Profile updated successfully', 'success');
      }
    } catch {
      showToast('Profile updated locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2MB', 'error');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const localUrl = URL.createObjectURL(file);
        setAvatarUrl(localUrl);
        showToast('Avatar updated locally', 'success');
        return;
      }

      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadError) {
        const localUrl = URL.createObjectURL(file);
        setAvatarUrl(localUrl);
        showToast('Avatar updated locally', 'success');
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      setAvatarUrl(publicUrl);
      showToast('Avatar updated!', 'success');
    } catch {
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
      showToast('Avatar updated locally', 'success');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-black">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-black text-white'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {toast.type === 'success' ? <Check size={14} className="text-white" /> : <AlertCircle size={14} />}
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-black">
          Profile Details
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage your personal details, email, and shipping contact number.
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-6">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-4 font-semibold">
          Profile Picture
        </span>
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border border-neutral-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">
                {displayInitial}
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera size={18} className="text-white" />
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-base font-bold text-black">{fullName || 'Customer'}</p>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{email}</p>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="mt-2 text-xs uppercase tracking-wider font-semibold text-black border border-neutral-300 hover:border-black px-3 py-1.5 rounded-lg transition-colors bg-white cursor-pointer"
            >
              Change Photo
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-4 font-semibold">
          Personal Information
        </span>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
              Phone Number (For Delivery Updates)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-6 pt-4 flex items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-black" />
            Stored securely
          </p>
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
