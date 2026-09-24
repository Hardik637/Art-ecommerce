'use client';

import { useState } from 'react';
import { ProductDimensions } from '@/types/art';
import { ChevronDown, Ruler } from 'lucide-react';

interface ArtworkScaleVisualizerProps {
  dimensions?: ProductDimensions;
  artworkName: string;
}

export default function ArtworkScaleVisualizer({
  dimensions,
  artworkName,
}: ArtworkScaleVisualizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!dimensions || !dimensions.width || !dimensions.height) {
    return null;
  }

  const { width, height, unit } = dimensions;

  // Convert to both cm and inches
  const widthCm = unit === 'cm' ? width : Math.round(width * 2.54);
  const heightCm = unit === 'cm' ? height : Math.round(height * 2.54);
  const widthIn = unit === 'in' ? width : Math.round(width / 2.54);
  const heightIn = unit === 'in' ? height : Math.round(height / 2.54);

  // Reference sofa is standard 200 cm (80 inches) wide
  // Scale factor: represent 240cm total width in the SVG viewBox of 400 units
  const sofaWidthCm = 200;
  const artWidthUnits = Math.min(260, Math.max(40, (widthCm / sofaWidthCm) * 250));
  const artHeightUnits = Math.min(180, Math.max(30, (heightCm / sofaWidthCm) * 250));

  return (
    <div className="border border-neutral-200 bg-neutral-50/50 p-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Ruler size={15} className="text-black" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-black group-hover:text-neutral-600 transition-colors">
            How Big Is It? — Scale Visualizer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-bold text-neutral-600">
            {widthIn} × {heightIn} IN ({widthCm} × {heightCm} CM)
          </span>
          <ChevronDown
            size={14}
            className={`text-neutral-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="pt-4 mt-3 border-t border-neutral-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-baseline justify-between text-[11px] font-sans text-neutral-500">
            <span>
              Real Dimensions:{' '}
              <strong className="text-black font-bold">
                {widthIn} &times; {heightIn} IN
              </strong>{' '}
              ({widthCm} &times; {heightCm} {unit})
              {dimensions.depth ? ` &bull; Depth: ${dimensions.depth} ${unit}` : ''}
            </span>
            <span className="text-[10px] uppercase text-neutral-400">
              Proportional Scale Reference
            </span>
          </div>

          {/* Minimalist Architectural Scale Illustration */}
          <div className="relative w-full bg-white border border-neutral-200 p-4 sm:p-6 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 360 220"
              className="w-full max-w-sm h-auto select-none overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={`Scale reference for ${artworkName} relative to a 200cm standard sofa`}
            >
              <title>{artworkName} Scale Visualization</title>
              {/* Floor baseline */}
              <line
                x1="20"
                y1="200"
                x2="340"
                y2="200"
                stroke="#D4D4D8"
                strokeWidth="1.5"
              />

              {/* Minimalist 3-Seater Sofa Silhouette (200cm reference, 250 units wide) */}
              <g transform="translate(55, 115)">
                {/* Sofa Backrest */}
                <rect
                  x="0"
                  y="0"
                  width="250"
                  height="45"
                  rx="2"
                  fill="#F5F5F5"
                  stroke="#171717"
                  strokeWidth="1.5"
                />
                {/* Sofa Seat Cushion */}
                <rect
                  x="15"
                  y="30"
                  width="220"
                  height="35"
                  rx="1"
                  fill="#EAEAEA"
                  stroke="#171717"
                  strokeWidth="1.5"
                />
                {/* Sofa Armrests */}
                <rect
                  x="0"
                  y="15"
                  width="22"
                  height="50"
                  rx="2"
                  fill="#F5F5F5"
                  stroke="#171717"
                  strokeWidth="1.5"
                />
                <rect
                  x="228"
                  y="15"
                  width="22"
                  height="50"
                  rx="2"
                  fill="#F5F5F5"
                  stroke="#171717"
                  strokeWidth="1.5"
                />
                {/* Sofa Legs */}
                <line x1="25" y1="65" x2="25" y2="85" stroke="#171717" strokeWidth="2.5" />
                <line x1="225" y1="65" x2="225" y2="85" stroke="#171717" strokeWidth="2.5" />
                {/* Label */}
                <text
                  x="125"
                  y="53"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                  fill="#71717A"
                  letterSpacing="0.05em"
                >
                  STANDARD 200 CM (80 IN) SOFA
                </text>
              </g>

              {/* Artwork Drawn Strictly To Scale Mounted Centered Above Sofa */}
              {(() => {
                const artX = 180 - artWidthUnits / 2;
                const artY = Math.max(15, 100 - artHeightUnits);
                return (
                  <g>
                    {/* Artwork Canvas Rectangle */}
                    <rect
                      x={artX}
                      y={artY}
                      width={artWidthUnits}
                      height={artHeightUnits}
                      fill="#FFFFFF"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    {/* Cross line accent indicating canvas face */}
                    <line
                      x1={artX + 6}
                      y1={artY + 6}
                      x2={artX + artWidthUnits - 6}
                      y2={artY + artHeightUnits - 6}
                      stroke="#F4EFE7"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* Width dimension indicator above artwork */}
                    <line
                      x1={artX}
                      y1={artY - 6}
                      x2={artX + artWidthUnits}
                      y2={artY - 6}
                      stroke="#171717"
                      strokeWidth="1"
                    />
                    <text
                      x={180}
                      y={artY - 10}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      fill="#000000"
                    >
                      {widthIn}&Prime; ({widthCm} cm)
                    </text>

                    {/* Height dimension indicator on side */}
                    <text
                      x={artX - 6}
                      y={artY + artHeightUnits / 2 + 3}
                      textAnchor="end"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      fill="#000000"
                    >
                      {heightIn}&Prime;
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <p className="text-[10px] font-sans text-neutral-500 text-center leading-relaxed">
            Scaled illustration relative to a standard 3-seater sofa. For optimal visual balance in living spaces, hang 6–8 inches (15–20 cm) above furniture.
          </p>
        </div>
      )}
    </div>
  );
}
