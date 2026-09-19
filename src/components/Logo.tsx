import React from 'react';

interface LogoProps {
  inverted?: boolean;
  style?: React.CSSProperties;
  className?: string;
  /** numeric width fallback */
  width?: number;
}

export default function Logo({ inverted = false, style = {}, className, width }: LogoProps) {
  const src = inverted ? '/logo-white.svg' : '/logo-black.svg';
  
  // If no className is provided but width is, use fixed inline width to preserve old behavior
  const effectiveStyle = className ? style : { width: width ? `${width}px` : '180px', height: 'auto', ...style };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="ATELIER & ART HOUSE"
      className={className}
      style={{
        display: 'block',
        objectFit: 'contain',
        ...effectiveStyle,
      }}
    />
  );
}
