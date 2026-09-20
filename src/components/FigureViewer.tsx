'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArtworkProduct } from '@/types/art';
import { X, Move } from 'lucide-react';

interface FigureViewerProps {
  artwork: ArtworkProduct;
  onClose: () => void;
}

export default function FigureViewer({ artwork, onClose }: FigureViewerProps) {
  const angles = [
    { id: 'front', label: 'Front Angle', img: artwork.images[0] || artwork.thumbnail },
    { id: 'perspective', label: '3/4 Perspective', img: artwork.images[1] || artwork.images[0] || artwork.thumbnail },
    { id: 'side', label: 'Side Profile', img: artwork.images[2] || artwork.images[0] || artwork.thumbnail },
    { id: 'detail', label: 'Surface Detail', img: artwork.images[0] || artwork.thumbnail },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : angles.length - 1));
      } else {
        setCurrentIndex((prev) => (prev < angles.length - 1 ? prev + 1 : 0));
      }
      dragStartX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    dragStartX.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 35) {
      if (delta > 0) {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : angles.length - 1));
      } else {
        setCurrentIndex((prev) => (prev < angles.length - 1 ? prev + 1 : 0));
      }
      dragStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    dragStartX.current = null;
  };

  const currentAngle = angles[currentIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <div
        className="relative w-full max-w-4xl bg-black border border-neutral-800 text-white shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-400 uppercase">
              360° Object Study
            </p>
            <h3 className="font-sans text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
              {artwork.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 360 Canvas with Drag & Touch Support */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[4/3] w-full bg-neutral-950 cursor-grab active:cursor-grabbing select-none flex items-center justify-center p-8 overflow-hidden"
        >
          {/* Current Angle Display */}
          <div className="relative w-full h-full max-w-md max-h-[500px]">
            <Image
              src={currentAngle.img}
              alt={currentAngle.label}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Drag Instruction Banner */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md px-4 py-2 border border-neutral-800 flex items-center gap-2 pointer-events-none text-xs text-white">
            <Move size={13} className="text-white" />
            <span className="text-[11px] font-sans font-medium tracking-wide">
              Drag or swipe left/right to rotate sculpture
            </span>
          </div>
        </div>

        {/* Angle Selection Tabs & Specs */}
        <div className="p-6 bg-black border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {angles.map((ang, idx) => (
              <button
                key={ang.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-2 text-xs font-sans uppercase tracking-wider transition-all border ${
                  currentIndex === idx
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {ang.label}
              </button>
            ))}
          </div>

          <div className="text-right text-xs text-neutral-400 font-sans">
            <span className="text-white font-semibold uppercase">
              {artwork.sculptureSpecs?.material || artwork.medium}
            </span>
            <span className="mx-2">•</span>
            <span>
              {artwork.dimensions.width} × {artwork.dimensions.height} × {artwork.dimensions.depth || 20} {artwork.dimensions.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
