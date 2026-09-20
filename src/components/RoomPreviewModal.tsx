'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArtworkProduct } from '@/types/art';
import { X } from 'lucide-react';

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
  const [frameType, setFrameType] = useState<'none' | 'black' | 'white' | 'oak'>('black');

  const currentRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoom) || ROOM_OPTIONS[0];

  // Scale multipliers
  const scaleSizes = {
    standard: 'w-44 md:w-56',
    large: 'w-56 md:w-72',
    statement: 'w-72 md:w-96',
  };

  // Frame styles (strictly monochrome / neutral)
  const frameBorderStyles = {
    none: 'border-0 shadow-xl',
    black: 'border-[8px] md:border-[12px] border-black shadow-2xl ring-1 ring-white/10',
    white: 'border-[8px] md:border-[12px] border-white shadow-2xl ring-1 ring-black/10',
    oak: 'border-[8px] md:border-[12px] border-[#D4D4D4] shadow-2xl ring-1 ring-black/10',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <div
        className="relative w-full max-w-5xl bg-white border border-neutral-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-500 uppercase">
              Room Visualizer
            </p>
            <h3 className="font-sans text-xl md:text-2xl font-bold uppercase tracking-tight text-black">
              View in Room: <span>{artwork.name}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Room Visual Canvas Area */}
        <div className="relative aspect-[16/10] w-full bg-neutral-200 overflow-hidden flex items-center justify-center select-none">
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
              className={`aspect-[4/5] relative bg-white transition-all duration-300 ${frameBorderStyles[frameType]}`}
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 10px 15px -3px rgba(0, 0, 0, 0.3)',
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
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Room Selector */}
          <div>
            <label className="block text-[11px] font-sans font-bold tracking-[0.14em] text-black uppercase mb-2">
              Select Interior Space
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ROOM_OPTIONS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`px-3 py-2 text-xs font-sans text-left transition-all border ${
                    selectedRoom === room.id
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                  }`}
                >
                  {room.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Selector */}
          <div>
            <label className="block text-[11px] font-sans font-bold tracking-[0.14em] text-black uppercase mb-2">
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
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 font-sans">
              Actual dimensions: {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
            </p>
          </div>

          {/* Frame Style in Room */}
          <div>
            <label className="block text-[11px] font-sans font-bold tracking-[0.14em] text-black uppercase mb-2">
              Framing Finish
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'none', label: 'Unframed' },
                  { id: 'black', label: 'Black Ash' },
                  { id: 'white', label: 'Studio White' },
                  { id: 'oak', label: 'Raw Oak' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrameType(f.id)}
                  className={`px-3 py-2 text-xs font-sans text-left transition-all border ${
                    frameType === f.id
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
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
