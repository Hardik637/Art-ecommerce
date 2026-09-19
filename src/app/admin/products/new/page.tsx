'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check, Award, Sparkles, Upload, ShieldCheck } from 'lucide-react';
import { ARTISTS } from '@/lib/artCatalog';

export default function NewArtworkPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState(ARTISTS[0].id);
  const [category, setCategory] = useState<'paintings' | 'sculptures' | 'figures' | 'prints' | 'objects'>('paintings');
  const [price, setPrice] = useState('32000');
  const [medium, setMedium] = useState('Oil and 24K Gold Leaf on Belgian Linen');
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
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-widest text-[#777] hover:text-[#11100F] mb-4 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Catalog
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#B08A4A]">
            Catalog Ingestion & Provenance Registration
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#11100F] font-light">
          Register New Masterwork
        </h1>
        <p className="text-xs text-[#777] font-sans mt-1">
          Index an original painting, lost-wax bronze casting, or collectible figure into the Atelier permanent registry.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-[#EBF7EE] border border-[#1E7E34]/30 text-[#1E7E34] text-xs font-sans font-medium flex items-center gap-3">
          <Check size={16} />
          Masterwork registered successfully with provenance hash ATH-REG-2026! Redirecting to catalog...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Identification & Artist */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Primary Identification & Provenance
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Whispers of the Narmada Gorge"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-serif text-lg outline-none focus:border-[#B08A4A] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                  Master Artist *
                </label>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
                >
                  {ARTISTS.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name} ({artist.signatureStyle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                  Discipline / Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
                >
                  <option value="paintings">Fine Art Painting</option>
                  <option value="sculptures">Sculpture & Cast Metal</option>
                  <option value="figures">Collectible Art Figure</option>
                  <option value="prints">Museum Fine Art Print</option>
                  <option value="objects">Decorative Luxury Object</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Physical Specifications */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Substrate, Medium & Dimensions
          </span>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Medium & Materials *
              </label>
              <input
                type="text"
                required
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Lost-Wax Bronze with Malachite Patina"
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#B08A4A] transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                  Width (cm)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-[#B08A4A]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-[#B08A4A]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                  Depth (cm)
                </label>
                <input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-[#B08A4A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Commercial Valuation & Edition */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Commercial Valuation & Editioning
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Acquisition Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-mono text-base font-semibold outline-none focus:border-[#B08A4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
                Edition Structure
              </label>
              <select
                value={editionType}
                onChange={(e) => setEditionType(e.target.value as typeof editionType)}
                className="w-full bg-white border border-[#E4DBCF] rounded-xl px-4 py-3 font-sans text-xs outline-none focus:border-[#B08A4A]"
              >
                <option value="oneOfOne">One-of-One Hand-Painted (1/1 Original)</option>
                <option value="limited">Limited Edition Cast / Bronze (50 Casts)</option>
                <option value="open">Fine Art Open Edition Print</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E4DBCF] bg-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={frameAvailable}
                onChange={(e) => setFrameAvailable(e.target.checked)}
                className="accent-[#B08A4A] h-4 w-4 rounded"
              />
              <div>
                <span className="text-xs font-semibold text-[#11100F] block">
                  Enable Archival Museum Framing
                </span>
                <span className="text-[10px] text-[#777]">
                  Float frames in Black Ash, Natural Oak, Antique Gold
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E4DBCF] bg-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={coa}
                onChange={(e) => setCoa(e.target.checked)}
                className="accent-[#B08A4A] h-4 w-4 rounded"
              />
              <div>
                <span className="text-xs font-semibold text-[#11100F] block">
                  Generate Certificate of Authenticity
                </span>
                <span className="text-[10px] text-[#777]">
                  Signed provenance dossier and digital seal
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Curatorial Description & Notes */}
        <div className="bg-[#FAF8F5] border border-[#E4DBCF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B08A4A] block">
            Curatorial Essay & Provenance Notes
          </span>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Curator Statement / Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the conceptual origin, brush technique, emotional resonance, and provenance history..."
              className="w-full bg-white border border-[#E4DBCF] rounded-xl p-4 font-sans text-xs outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#777] mb-1.5 font-mono">
              Artist Studio Notes
            </label>
            <textarea
              rows={2}
              value={artistNotes}
              onChange={(e) => setArtistNotes(e.target.value)}
              placeholder="First-person observation from the master artist..."
              className="w-full bg-white border border-[#E4DBCF] rounded-xl p-4 font-sans text-xs outline-none focus:border-[#B08A4A] transition-colors"
            />
          </div>
        </div>

        {/* Submission Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E4DBCF]">
          <Link
            href="/admin/products"
            className="text-xs uppercase font-mono text-[#777] hover:text-[#11100F]"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors rounded-xl text-xs uppercase tracking-widest font-sans font-medium flex items-center gap-2 shadow-lg disabled:opacity-60"
          >
            {saving ? (
              'Ingesting Masterwork...'
            ) : (
              <>
                <Award size={15} /> Publish to Atelier Catalog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
