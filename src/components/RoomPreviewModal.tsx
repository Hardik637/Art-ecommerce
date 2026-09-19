'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArtworkProduct } from '@/types/art';
import { X, Sliders, Maximize2 } from 'lucide-react';

interface RoomPreviewModalProps {
  artwork: ArtworkProduct;
  onClose: () => void;
}

type RoomType = 'living-room' | 'bedroom' | 'study' | 'entryway';

const ROOM_OPTIONS: Array<{ id: RoomType; label: string; image: string }> = [
  { id: 'living-room', label: 'Living Room', image: '/rooms/room-living-room.svg' },
  { id: 'bedroom', label: 'Master Bedroom', image: '/rooms/room-bedroom.svg' },
  { id: 'study', label: 'Executive Study', image: '/rooms/room-study.svg' },
  { id: 'entryway', label: 'Gallery Entryway', image: '/rooms/room-entryway.svg' },
];

export default function RoomPreviewModal({ artwork, onClose }: RoomPreviewModalProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living-room');
  const [scale, setScale] = useState<'standard' | 'large' | 'statement'>('standard');
  const [frameType, setFrameType] = useState<'none' | 'black' | 'gold' | 'oak'>('gold');

  const currentRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoom) || ROOM_OPTIONS[0];

  // Scale multipliers
  const scaleSizes = {
    standard: 'w-44 md:w-56',
    large: 'w-56 md:w-72',
    statement: 'w-72 md:w-96',
  };

  // Frame styles
  const frameBorderStyles = {
    none: 'border-0 shadow-xl',
    black: 'border-[8px] md:border-[12px] border-[#11100F] shadow-2xl ring-1 ring-white/10',
    gold: 'border-[8px] md:border-[12px] border-[#B08A4A] shadow-2xl ring-1 ring-[#D4AF37]',
    oak: 'border-[8px] md:border-[12px] border-[#D4C4B0] shadow-2xl ring-1 ring-black/10',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div
        className="relative w-full max-w-5xl bg-[#F4EFE7] border border-[#E4DBCF] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E4DBCF] flex items-center justify-between bg-[#F4EFE7]">
          <div>
            <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase">
              Curatorial Visualizer
            </p>
            <h3 className="font-serif text-2xl font-normal text-[#11100F]">
              View in Room: <span className="italic">{artwork.name}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E4DBCF] flex items-center justify-center text-[#78716C] hover:text-[#11100F] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Room Visual Canvas Area */}
        <div className="relative aspect-[16/10] w-full bg-[#E5DFD4] overflow-hidden flex items-center justify-center select-none">
          {/* Room Environment Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentRoom.image}
              alt={currentRoom.label}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Wall-Mounted Artwork with Realistic Drop Shadow and Framing */}
          <div
            className={`relative z-10 -translate-y-6 md:-translate-y-12 transition-all duration-300 ${scaleSizes[scale]}`}
          >
            <div
              className={`aspect-[4/5] relative bg-[#FAF7F2] transition-all duration-300 ${frameBorderStyles[frameType]}`}
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(17, 16, 15, 0.45), 0 10px 15px -3px rgba(17, 16, 15, 0.3)',
              }}
            >
              <Image
                src={artwork.images[0] || artwork.thumbnail}
                alt={artwork.name}
                fill
                className="object-contain p-1"
                priority
              />
            </div>

            {/* Subtle museum spotlight highlight from top */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/20 blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="p-6 bg-[#FAF7F2] border-t border-[#E4DBCF] grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Room Selector */}
          <div>
            <label className="block text-[11px] font-sans font-semibold tracking-[0.18em] text-[#11100F] uppercase mb-2">
              Select Interior Space
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ROOM_OPTIONS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`px-3 py-2 text-xs font-sans text-left transition-all border ${
                    selectedRoom === room.id
                      ? 'bg-[#11100F] text-[#F4EFE7] border-[#11100F]'
                      : 'bg-[#F4EFE7] text-[#78716C] border-[#E4DBCF] hover:border-[#11100F]'
                  }`}
                >
                  {room.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Selector */}
          <div>
            <label className="block text-[11px] font-sans font-semibold tracking-[0.18em] text-[#11100F] uppercase mb-2">
              Scale Perspective
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'standard', label: 'Standard' },
                  { id: 'large', label: 'Focal Piece' },
                  { id: 'statement', label: 'Statement' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScale(s.id)}
                  className={`px-3 py-2 text-xs font-sans text-center transition-all border ${
                    scale === s.id
                      ? 'bg-[#11100F] text-[#F4EFE7] border-[#11100F]'
                      : 'bg-[#F4EFE7] text-[#78716C] border-[#E4DBCF] hover:border-[#11100F]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#78716C] mt-2">
              Artwork actual dimensions: {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
            </p>
          </div>

          {/* Frame Style in Room */}
          <div>
            <label className="block text-[11px] font-sans font-semibold tracking-[0.18em] text-[#11100F] uppercase mb-2">
              Framing Finish
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'none', label: 'Unframed' },
                  { id: 'black', label: 'Black Ash' },
                  { id: 'gold', label: 'Gilt Gold' },
                  { id: 'oak', label: 'Raw Oak' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrameType(f.id)}
                  className={`px-3 py-2 text-xs font-sans text-left transition-all border ${
                    frameType === f.id
                      ? 'bg-[#11100F] text-[#F4EFE7] border-[#11100F]'
                      : 'bg-[#F4EFE7] text-[#78716C] border-[#E4DBCF] hover:border-[#11100F]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
