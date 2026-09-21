'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';
import { ARTISTS } from '@/lib/artCatalog';

export default function AddNewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'wall-art' | 'sculptures' | 'decorative-pieces'>('wall-art');
  const [subcategory, setSubcategory] = useState('contemporary');
  const [artistName, setArtistName] = useState('Ananya Sen');
  const [customArtist, setCustomArtist] = useState('');
  const [price, setPrice] = useState('38000');
  const [originalPrice, setOriginalPrice] = useState('45000');
  const [stock, setStock] = useState('1');
  const [medium, setMedium] = useState('Oil and 24K Gold Leaf on Belgian Linen');
  const [width, setWidth] = useState('120');
  const [height, setHeight] = useState('150');
  const [depth, setDepth] = useState('4');
  const [editionType, setEditionType] = useState<'oneOfOne' | 'limited' | 'open'>('oneOfOne');
  const [enableFraming, setEnableFraming] = useState(true);
  const [enableCoa, setEnableCoa] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [description, setDescription] = useState('');

  // Uploaded images state
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual URL input toggle
  const [manualUrl, setManualUrl] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);

  // Calculate discount percentage
  const numPrice = Number(price) || 0;
  const numOriginal = Number(originalPrice) || 0;
  const discountPercent =
    numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0;

  // Handle file uploads
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to upload image.');
        }

        if (data.url) {
          setImages((prev) => [...prev, data.url]);
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. You can paste an image URL directly.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      setImages((prev) => [...prev, manualUrl.trim()]);
      setManualUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError('Please upload at least one artwork photo or provide an image URL.');
      return;
    }

    setSubmitting(true);

    try {
      const finalArtist = artistName === 'other' ? customArtist.trim() || 'Resident Artist' : artistName;

      const payload = {
        name: title.trim(),
        category,
        subcategory: subcategory.trim(),
        price: numPrice,
        originalPrice: numOriginal > 0 ? numOriginal : undefined,
        stock: Number(stock) || 1,
        medium: medium.trim(),
        dimensions: {
          width: Number(width) || 0,
          height: Number(height) || 0,
          depth: depth ? Number(depth) : undefined,
          unit: 'cm',
        },
        images,
        thumbnail: images[0],
        artistName: finalArtist,
        description: description.trim(),
        isFeatured,
        isNew,
        isBestseller,
        isOneOfOne: editionType === 'oneOfOne',
        isLimitedEdition: editionType === 'limited',
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product.');
      }

      setCreatedProduct(data.product);
    } catch (err: any) {
      setError(err.message || 'An error occurred while publishing the product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 font-sans text-black">
      {/* Top Header with Bebas Neue display typography */}
      <div className="border-b border-neutral-200 pb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black mb-3 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Products Catalog
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 block mb-1 font-semibold">
              Catalog Management Studio
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-black leading-none">
              Add New Item
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Upload high-resolution photography, configure curatorial specifications, and publish directly to the live boutique.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 border border-neutral-200 px-2.5 py-1 rounded-full">
              Zorodoor Art Curation
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Modal / Banner */}
      {createdProduct && (
        <div className="bg-white text-black p-6 sm:p-7 rounded-2xl border border-neutral-300 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 block font-bold">
                Item Published Successfully
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                {createdProduct.name} Is Now Live
              </h3>
            </div>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            This piece has been committed to the Zorodoor catalog. Patrons can now browse, configure museum framing, and purchase it online.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/products/${createdProduct.slug || createdProduct.id}`}
              target="_blank"
              className="px-4 py-2.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View On Live Store</span>
              <ExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={() => {
                setCreatedProduct(null);
                setTitle('');
                setImages([]);
                setDescription('');
              }}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer bg-white"
            >
              Add Another Piece
            </button>

            <Link
              href="/admin/products"
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Product Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: PHOTO UPLOAD (Required) */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                Visual Assets
              </span>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                Artwork Photography & Imagery *
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              {images.length} {images.length === 1 ? 'Image' : 'Images'} Added
            </span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
              uploading
                ? 'border-neutral-400 bg-neutral-50'
                : 'border-neutral-300 hover:border-black hover:bg-neutral-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-black">
              {uploading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={22} strokeWidth={2} />
              )}
            </div>

            <div className="space-y-1">
              <p className="font-sans font-bold text-sm text-black">
                {uploading
                  ? 'Processing and optimizing artwork image...'
                  : 'Click to select photo or drag and drop here'}
              </p>
              <p className="text-xs text-neutral-500 font-sans">
                High-resolution JPEG, PNG, WebP, or AVIF (up to 10MB per image).
              </p>
              <p className="text-[10px] font-mono text-neutral-400 pt-1">
                You can upload multiple views: Frontal view, Scale mockup, Close-up texture.
              </p>
            </div>
          </div>

          {uploadError && (
            <div className="text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Image Previews Gallery */}
          {images.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Catalog Photos (First photo is Primary thumbnail):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((imgUrl, index) => (
                  <div
                    key={`${imgUrl}-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 aspect-square"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Artwork preview ${index + 1}`}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />

                    {/* Primary Badge */}
                    {index === 0 ? (
                      <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded shadow-md font-bold">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(index)}
                        className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-black hover:text-white text-black text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback / Manual Image URL option */}
          <div className="pt-2 border-t border-neutral-100">
            <details className="text-xs text-neutral-500 cursor-pointer">
              <summary className="font-mono text-[11px] uppercase tracking-wider hover:text-black">
                + Or paste an image URL directly
              </summary>
              <div className="mt-3 flex gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://example.com/artwork-image.jpg"
                  className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-black outline-none focus:border-black font-sans"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* SECTION 2: IDENTIFICATION & ARTIST */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-200 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Product Specification
            </span>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              Item Details & Classification
            </h2>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Artwork / Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Whispers of the High Desert"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-base font-bold text-black placeholder-neutral-400 outline-none focus:border-black focus:bg-white transition-all font-sans"
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Discipline / Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black cursor-pointer"
                >
                  <option value="wall-art">Wall Art (Paintings & Canvas)</option>
                  <option value="sculptures">Sculptures (Castings & Bronze)</option>
                  <option value="decorative-pieces">Decorative Pieces & Objects</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Subcategory / Movement
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. abstract, contemporary, minimalist, bronze"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black font-sans"
                />
              </div>
            </div>

            {/* Artist Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Artist / Creator *
                </label>
                <select
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black cursor-pointer"
                >
                  {ARTISTS.map((artist) => (
                    <option key={artist.id} value={artist.name}>
                      {artist.name} ({artist.location})
                    </option>
                  ))}
                  <option value="other">Other / Custom Artist Name</option>
                </select>
              </div>

              {artistName === 'other' ? (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Enter Artist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customArtist}
                    onChange={(e) => setCustomArtist(e.target.value)}
                    placeholder="e.g. Tarun Tahiliani"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Initial Stock Inventory
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-mono font-bold text-black outline-none focus:border-black"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: PRICING & MEDIUM */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-200 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Commercial Terms
            </span>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              Pricing, Medium & Dimensions
            </h2>
          </div>

          <div className="space-y-5">
            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Store Selling Price (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-neutral-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="38000"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-4 py-3 font-mono text-lg font-bold text-black outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                    Original / MRP Price (Optional)
                  </label>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-neutral-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="45000"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-4 py-3 font-mono text-lg font-bold text-neutral-600 outline-none focus:border-black font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Medium */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Medium & Materials *
              </label>
              <input
                type="text"
                required
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Hand-poured Bronze with Verdigris Patina, Oil on Belgian Linen"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black font-sans"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Dimensions (Width × Height × Depth in cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">Width (cm)</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="120"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">Height (cm)</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="150"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">Depth (cm)</span>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    placeholder="4"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Edition Structure */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Edition Structure
              </label>
              <select
                value={editionType}
                onChange={(e) => setEditionType(e.target.value as any)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none focus:border-black cursor-pointer"
              >
                <option value="oneOfOne">Original Work (Unique 1 of 1 Masterpiece)</option>
                <option value="limited">Limited Edition (Numbered Run of 50)</option>
                <option value="open">Standard Curated Edition</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: BADGES & STORY */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-200 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Curatorial Badges
            </span>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              Badges & Curatorial Narrative
            </h2>
          </div>

          <div className="space-y-5">
            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="accent-black h-4 w-4 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-black block">New Arrival Badge</span>
                  <span className="text-[10px] text-neutral-500">Showcases piece in New Arrivals section</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-black h-4 w-4 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-black block">Featured in Gallery</span>
                  <span className="text-[10px] text-neutral-500">High-priority spotlight in curated exhibitions</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFraming}
                  onChange={(e) => setEnableFraming(e.target.checked)}
                  className="accent-black h-4 w-4 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-black block">Museum Framing Options</span>
                  <span className="text-[10px] text-neutral-500">Enable Black Ash, Natural Oak, & Gold Leaf frames</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCoa}
                  onChange={(e) => setEnableCoa(e.target.checked)}
                  className="accent-black h-4 w-4 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-black block">Certificate of Authenticity</span>
                  <span className="text-[10px] text-neutral-500">Includes signed physical atelier certificate</span>
                </div>
              </label>
            </div>

            {/* Description / Story */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Curatorial Story & Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the artist's inspiration, texture, technique, spatial presence, and lighting recommendations..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3.5 text-xs text-black outline-none focus:border-black font-sans leading-relaxed transition-colors"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Link
            href="/admin/products"
            className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
          >
            Discard & Return
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Item...</span>
              </>
            ) : (
              <>
                <Award size={16} />
                <span>Publish To Live Store</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
