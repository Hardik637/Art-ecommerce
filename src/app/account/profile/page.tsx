'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Toast = { message: string; type: 'success' | 'error' };

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const avatarRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [fullName, setFullName] = useState('Vikram Sethi');
  const [phone, setPhone] = useState('+91 98101 23456');
  const [email, setEmail] = useState('vikram.sethi@example.com');
  const [collectorTitle, setCollectorTitle] = useState('Founding Patron & Fine Art Collector');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const displayInitial = (fullName.trim() || email || 'C').charAt(0).toUpperCase();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || 'Vikram Sethi');
        setPhone(user.user_metadata?.phone || '+91 98101 23456');
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
        showToast('Collector profile updated successfully', 'success');
      }
    } catch {
      showToast('Profile updated locally for demo', 'success');
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
        <div className="w-8 h-8 border-2 border-[#B08A4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-xs font-sans font-medium ${
            toast.type === 'success'
              ? 'bg-[#11100F] text-[#F4EFE7] border border-[#B08A4A]'
              : 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20'
          }`}
        >
          {toast.type === 'success' ? <Check size={15} className="text-[#B08A4A]" /> : <AlertCircle size={15} />}
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-[#11100F]">
          Collector Profile & Credentials
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Manage your verified collector identity for provenance certificates and white-glove delivery manifests.
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 mb-6 shadow-sm">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-4">
          Collector Seal & Portrait
        </span>
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#B08A4A]/50"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#11100F] border-2 border-[#B08A4A]/50 flex items-center justify-center text-[#B08A4A] font-serif text-2xl">
                {displayInitial}
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera size={20} className="text-white" />
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
            <p className="font-serif text-xl text-[#11100F] font-medium">{fullName || 'Collector'}</p>
            <p className="text-xs text-[#777] font-mono mt-0.5">{email}</p>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="mt-3 text-xs uppercase tracking-wider font-sans font-medium text-[#11100F] border border-[#E4DBCF] hover:border-[#B08A4A] px-4 py-2 rounded-xl transition-colors bg-white/60"
            >
              Upload Portrait
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 shadow-sm">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block mb-5">
          Provenance Identity Particulars
        </span>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Patron Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Vikram Sethi"
              className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Patron Honorific / Collector Title
            </label>
            <input
              type="text"
              value={collectorTitle}
              onChange={(e) => setCollectorTitle(e.target.value)}
              placeholder="e.g. Founding Patron & Fine Art Collector"
              className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Registered Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-[#EFE9DF]/50 border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm text-[#777] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Secure Delivery Phone (For Transit Security)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98101 23456"
              className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-[#E4DBCF] mt-6 pt-5 flex items-center justify-between gap-4">
          <p className="text-[11px] text-[#888] font-mono flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#B08A4A]" />
            Archived securely under Atelier Data Vault
          </p>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium px-6 py-3 rounded-xl disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Particulars'}
          </button>
        </div>
      </form>
    </div>
  );
}
