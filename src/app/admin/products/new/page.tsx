'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Award } from 'lucide-react';
import { ARTISTS } from '@/lib/artCatalog';

export default function NewArtworkPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState(ARTISTS[0].id);
  const [category, setCategory] = useState<'paintings' | 'sculptures' | 'figures' | 'prints' | 'objects'>('paintings');
  const [price, setPrice] = useState('32000');
  const [medium, setMedium] = useState('Oil and Acrylic on Canvas');
  const [width, setWidth] = useState('120');
  const [height, setHeight] = useState('90');
  const [depth, setDepth] = useState('4');
  const [editionType, setEditionType] = useState<'oneOfOne' | 'limited' | 'open'>('oneOfOne');
  const [frameAvailable, setFrameAvailable] = useState(true);
  const [coa, setCoa] = useState(true);
  const [description, setDescription] = useState('');
  const [artistNotes, setArtistNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6 text-black">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-neutral-400 hover:text-black mb-3 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Products
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          Add New Product
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Add a new wall art piece, sculpture, or decorative item to the store catalog.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs font-semibold flex items-center gap-3">
          <Check size={16} />
          Product created successfully! Redirecting to catalog...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identification & Artist */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Product Identification
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Whispers of the Gorge"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                  Artist / Creator *
                </label>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
                >
                  {ARTISTS.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name} ({artist.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
                >
                  <option value="paintings">Wall Art</option>
                  <option value="sculptures">Sculptures</option>
                  <option value="figures">Collectible Figures</option>
                  <option value="prints">Art Prints</option>
                  <option value="objects">Decorative Pieces</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Medium & Dimensions */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Medium & Dimensions
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Medium / Materials *
              </label>
              <input
                type="text"
                required
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Oil on Belgian Linen"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                  Width (cm)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                  Depth (cm)
                </label>
                <input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Edition */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Pricing & Edition Type
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 font-mono text-base font-bold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
                Edition Structure
              </label>
              <select
                value={editionType}
                onChange={(e) => setEditionType(e.target.value as typeof editionType)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-black"
              >
                <option value="oneOfOne">Original Hand-Crafted (Original Work)</option>
                <option value="limited">Limited Edition Run (50 Units)</option>
                <option value="open">Standard Open Edition</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-300 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={frameAvailable}
                onChange={(e) => setFrameAvailable(e.target.checked)}
                className="accent-black h-4 w-4 rounded cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-black block">
                  Enable Framing Options
                </span>
                <span className="text-[10px] text-neutral-500">
                  Solid Black Ash, Natural Oak, Matte Black
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-300 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={coa}
                onChange={(e) => setCoa(e.target.checked)}
                className="accent-black h-4 w-4 rounded cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-black block">
                  Certificate of Authenticity
                </span>
                <span className="text-[10px] text-neutral-500">
                  Generate verified authenticity certificate
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Description */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">
            Product Description
          </span>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the artwork, style, technique, and recommended spaces..."
              className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">
              Artist Notes
            </label>
            <textarea
              rows={2}
              value={artistNotes}
              onChange={(e) => setArtistNotes(e.target.value)}
              placeholder="Creator's note on the piece..."
              className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Submission Bar */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/products"
            className="text-xs uppercase font-mono text-neutral-500 hover:text-black"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Award size={15} /> Publish Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
