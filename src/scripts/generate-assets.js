const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', '..', 'public');
const artworksDir = path.join(publicDir, 'artworks');
const artistsDir = path.join(publicDir, 'artists');
const roomsDir = path.join(publicDir, 'rooms');

[artworksDir, artistsDir, roomsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to write SVG
function writeSvg(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
}

// ── ARTWORKS ────────────────────────────────────────────────────────────

// 1. Monsoon Over the Ghats
writeSvg(path.join(artworksDir, 'painting-monsoon-abstract.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11100F"/>
      <stop offset="40%" stop-color="#1C2833"/>
      <stop offset="70%" stop-color="#2C3E50"/>
      <stop offset="100%" stop-color="#0E1626"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#B08A4A"/>
      <stop offset="100%" stop-color="#7D5D25"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#g1)"/>
  <circle cx="400" cy="380" r="260" fill="url(#gold)" opacity="0.3" filter="blur(40px)"/>
  <!-- Abstract Monsoon Horizon & Water Strokes -->
  <path d="M0 600 Q 200 550, 400 590 T 800 560 L 800 1000 L 0 1000 Z" fill="#152238" opacity="0.9"/>
  <path d="M0 680 Q 250 630, 500 670 T 800 640 L 800 1000 L 0 1000 Z" fill="#0D1726"/>
  <!-- Gold leaf river reflections -->
  <path d="M 320 620 L 480 620 L 440 625 L 360 625 Z" fill="url(#gold)" opacity="0.75"/>
  <path d="M 280 660 L 520 660 L 470 666 L 330 666 Z" fill="url(#gold)" opacity="0.85"/>
  <path d="M 240 710 L 560 710 L 500 718 L 300 718 Z" fill="url(#gold)" opacity="0.6"/>
  <path d="M 200 770 L 600 770 L 540 779 L 260 779 Z" fill="url(#gold)" opacity="0.4"/>
  <!-- Architectural silhouette hints -->
  <path d="M 360 550 L 390 480 L 420 550 Z" fill="#0B1017"/>
  <path d="M 420 560 L 440 510 L 460 560 Z" fill="#0B1017"/>
  <circle cx="390" cy="470" r="4" fill="url(#gold)"/>
  <!-- Heavy rain vertical stroke lines -->
  <g stroke="rgba(244,239,231,0.06)" stroke-width="1.5" stroke-linecap="round">
    <line x1="120" y1="100" x2="100" y2="450" />
    <line x1="220" y1="80" x2="190" y2="520" />
    <line x1="340" y1="50" x2="310" y2="480" />
    <line x1="480" y1="120" x2="450" y2="540" />
    <line x1="620" y1="60" x2="590" y2="500" />
    <line x1="720" y1="90" x2="690" y2="510" />
  </g>
  <!-- Subtle canvas texture frame overlay -->
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(228,219,207,0.15)" stroke-width="1"/>
</svg>
`);

// 2. Solitude in Burnt Ochre
writeSvg(path.join(artworksDir, 'painting-solitude-in-ochre.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgOchre" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8D8C4"/>
      <stop offset="50%" stop-color="#C68B59"/>
      <stop offset="100%" stop-color="#6B3A2A"/>
    </linearGradient>
    <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#11100F" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#292622" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="#E4DBCF"/>
  <!-- Organic color field blocks -->
  <rect x="80" y="100" width="640" height="800" fill="url(#bgOchre)" rx="8"/>
  <circle cx="400" cy="400" r="220" fill="#292622" opacity="0.95"/>
  <circle cx="400" cy="400" r="216" fill="#B08A4A" opacity="0.25"/>
  <!-- Asymmetric geometric arch -->
  <path d="M 280 400 A 120 120 0 0 1 520 400 L 520 780 L 280 780 Z" fill="#F4EFE7" opacity="0.92"/>
  <rect x="340" y="520" width="120" height="260" fill="#11100F"/>
  <!-- Antique gold accent line -->
  <line x1="140" y1="400" x2="660" y2="400" stroke="#B08A4A" stroke-width="2" stroke-dasharray="8 6"/>
  <circle cx="400" cy="240" r="18" fill="#B08A4A"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.12)" stroke-width="1"/>
</svg>
`);

// 3. Echoes of the Durbar (Royal Burgundy & Gold)
writeSvg(path.join(artworksDir, 'painting-royal-durbar.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="burgundyRad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#6E2833"/>
      <stop offset="60%" stop-color="#481E25"/>
      <stop offset="100%" stop-color="#1A0A0D"/>
    </radialGradient>
    <linearGradient id="goldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2D06B"/>
      <stop offset="50%" stop-color="#B08A4A"/>
      <stop offset="100%" stop-color="#705220"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#burgundyRad)"/>
  <!-- Royal Archway Geometry -->
  <path d="M 150 900 L 150 450 C 150 250, 650 250, 650 450 L 650 900 Z" fill="none" stroke="url(#goldLeaf)" stroke-width="3" opacity="0.8"/>
  <path d="M 200 900 L 200 470 C 200 300, 600 300, 600 470 L 600 900 Z" fill="none" stroke="url(#goldLeaf)" stroke-width="1.5" opacity="0.4" stroke-dasharray="6 4"/>
  <!-- Central Stylized Royal Figure / Essence -->
  <path d="M 400 320 C 440 320 470 360 470 420 C 470 500 400 580 400 580 C 400 580 330 500 330 420 C 330 360 360 320 400 320 Z" fill="url(#goldLeaf)" opacity="0.85"/>
  <circle cx="400" cy="270" r="30" fill="url(#goldLeaf)"/>
  <!-- Floor reflections -->
  <polygon points="250,750 550,750 620,950 180,950" fill="#11100F" opacity="0.6"/>
  <line x1="250" y1="750" x2="550" y2="750" stroke="url(#goldLeaf)" stroke-width="2"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1"/>
</svg>
`);

// 4. Silent Horizon No. 4
writeSvg(path.join(artworksDir, 'painting-silent-horizon.svg'), `
<svg width="1000" height="800" viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F4EFE7"/>
      <stop offset="60%" stop-color="#E4DBCF"/>
      <stop offset="100%" stop-color="#C8BCAB"/>
    </linearGradient>
    <linearGradient id="earthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#292622"/>
      <stop offset="40%" stop-color="#1A1816"/>
      <stop offset="100%" stop-color="#11100F"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="480" fill="url(#skyGrad)"/>
  <rect y="480" width="1000" height="320" fill="url(#earthGrad)"/>
  <!-- Thin gold division line -->
  <line x1="0" y1="480" x2="1000" y2="480" stroke="#B08A4A" stroke-width="3"/>
  <line x1="0" y1="486" x2="1000" y2="486" stroke="#B08A4A" stroke-width="1" opacity="0.5"/>
  <!-- Faint sun disk -->
  <circle cx="500" cy="380" r="110" fill="#F4EFE7" opacity="0.7"/>
  <rect x="24" y="24" width="952" height="752" fill="none" stroke="rgba(17,16,15,0.08)" stroke-width="1"/>
</svg>
`);

// 5. Kashi Reverie in Dusk
writeSvg(path.join(artworksDir, 'painting-kashi-reverie.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="duskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#11100F"/>
      <stop offset="35%" stop-color="#3A242B"/>
      <stop offset="65%" stop-color="#7C3A27"/>
      <stop offset="100%" stop-color="#B08A4A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#duskGrad)"/>
  <!-- Temple spire silhouettes -->
  <path d="M 120 700 L 160 520 L 200 700 Z" fill="#11100F"/>
  <path d="M 220 700 L 280 440 L 340 700 Z" fill="#11100F"/>
  <path d="M 360 700 L 430 380 L 500 700 Z" fill="#11100F"/>
  <path d="M 520 700 L 570 480 L 620 700 Z" fill="#11100F"/>
  <path d="M 640 700 L 680 560 L 720 700 Z" fill="#11100F"/>
  <!-- River steps -->
  <rect x="0" y="700" width="800" height="300" fill="#191614"/>
  <g fill="#292622">
    <rect x="40" y="720" width="720" height="15" rx="2"/>
    <rect x="80" y="750" width="640" height="15" rx="2"/>
    <rect x="120" y="780" width="560" height="15" rx="2"/>
    <rect x="160" y="810" width="480" height="15" rx="2"/>
  </g>
  <!-- Diya flame floating on water -->
  <ellipse cx="400" cy="890" rx="35" ry="12" fill="#B08A4A" opacity="0.6"/>
  <circle cx="400" cy="880" r="10" fill="#F4EFE7"/>
  <circle cx="400" cy="876" r="5" fill="#FFC72C"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(244,239,231,0.15)" stroke-width="1"/>
</svg>
`);

// 6. Botanical Nocturne
writeSvg(path.join(artworksDir, 'painting-botanical-nocturne.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="emeraldRad" cx="40%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1B3B32"/>
      <stop offset="60%" stop-color="#0E211B"/>
      <stop offset="100%" stop-color="#08100D"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#emeraldRad)"/>
  <!-- Gold botanical leaf curves -->
  <g stroke="#B08A4A" fill="none" stroke-width="2" opacity="0.85">
    <path d="M 400 950 Q 420 600, 300 400 Q 200 250, 400 120"/>
    <path d="M 300 400 C 180 380, 160 480, 240 540 C 300 580, 360 480, 300 400" fill="#1B3B32" fill-opacity="0.5"/>
    <path d="M 380 300 C 460 220, 560 240, 520 340 C 480 420, 400 380, 380 300" fill="#1B3B32" fill-opacity="0.5"/>
    <path d="M 350 560 C 500 520, 580 620, 500 700 C 420 760, 360 660, 350 560" fill="#1B3B32" fill-opacity="0.5"/>
    <path d="M 280 680 C 160 660, 140 760, 220 820 C 280 860, 340 760, 280 680" fill="#1B3B32" fill-opacity="0.5"/>
  </g>
  <circle cx="400" cy="120" r="12" fill="#F4EFE7"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// 7. Geometric Rapture
writeSvg(path.join(artworksDir, 'painting-geometric-rapture.svg'), `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#11100F"/>
  <polygon points="100,100 700,100 400,700" fill="#481E25" opacity="0.9"/>
  <polygon points="150,150 650,150 400,650" fill="#F4EFE7"/>
  <circle cx="400" cy="380" r="160" fill="#B08A4A"/>
  <circle cx="400" cy="380" r="120" fill="#11100F"/>
  <circle cx="400" cy="380" r="60" fill="#F4EFE7"/>
  <line x1="100" y1="400" x2="700" y2="400" stroke="#11100F" stroke-width="4"/>
  <line x1="400" y1="100" x2="400" y2="700" stroke="#B08A4A" stroke-width="2"/>
  <rect x="20" y="20" width="760" height="760" fill="none" stroke="rgba(228,219,207,0.2)" stroke-width="1"/>
</svg>
`);

// 8. Whispering Dunes
writeSvg(path.join(artworksDir, 'painting-rajasthan-winds.svg'), `
<svg width="1000" height="700" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sand1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2C9A7"/>
      <stop offset="100%" stop-color="#C59E74"/>
    </linearGradient>
    <linearGradient id="sand2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A8754C"/>
      <stop offset="100%" stop-color="#7F4926"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="700" fill="#F4EFE7"/>
  <path d="M 0 350 Q 300 240, 600 320 T 1000 260 L 1000 700 L 0 700 Z" fill="url(#sand1)"/>
  <path d="M 0 460 Q 400 370, 750 450 T 1000 410 L 1000 700 L 0 700 Z" fill="url(#sand2)"/>
  <path d="M 0 570 Q 250 510, 600 580 T 1000 530 L 1000 700 L 0 700 Z" fill="#292622"/>
  <circle cx="750" cy="180" r="60" fill="#B08A4A" opacity="0.8"/>
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="rgba(17,16,15,0.1)" stroke-width="1"/>
</svg>
`);

// 9. Portrait of an Unknown Poet
writeSvg(path.join(artworksDir, 'painting-portrait-poet.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#E4DBCF"/>
  <ellipse cx="400" cy="420" rx="180" ry="240" fill="#292622"/>
  <!-- Minimalist facial plane abstraction -->
  <path d="M 330 320 C 350 250, 450 250, 470 320 C 490 400, 450 500, 400 560 C 350 500, 310 400, 330 320 Z" fill="#F4EFE7"/>
  <!-- Angular shadow -->
  <path d="M 400 260 L 400 560 C 450 500, 490 400, 470 320 Z" fill="#D6C4B0"/>
  <path d="M 370 420 L 400 440 L 400 420 Z" fill="#481E25"/>
  <line x1="370" y1="480" x2="430" y2="480" stroke="#481E25" stroke-width="4" stroke-linecap="round"/>
  <!-- Shoulders & Coat -->
  <path d="M 180 850 C 220 620, 320 580, 400 580 C 480 580, 580 620, 620 850 Z" fill="#11100F"/>
  <line x1="400" y1="580" x2="400" y2="850" stroke="#B08A4A" stroke-width="2"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(17,16,15,0.15)" stroke-width="1"/>
</svg>
`);

// 10. Celestial Tides
writeSvg(path.join(artworksDir, 'painting-celestial-tides.svg'), `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="oceanRad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0E3A40"/>
      <stop offset="70%" stop-color="#07191C"/>
      <stop offset="100%" stop-color="#11100F"/>
    </radialGradient>
  </defs>
  <rect width="900" height="900" fill="url(#oceanRad)"/>
  <g fill="none" stroke="#B08A4A" opacity="0.75">
    <circle cx="450" cy="450" r="360" stroke-width="1.5" stroke-dasharray="8 6"/>
    <circle cx="450" cy="450" r="280" stroke-width="2"/>
    <circle cx="450" cy="450" r="190" stroke-width="1" stroke-dasharray="4 8"/>
    <circle cx="450" cy="450" r="100" stroke-width="3"/>
  </g>
  <circle cx="450" cy="450" r="40" fill="#F4EFE7"/>
  <path d="M 100 450 Q 300 250, 450 450 T 800 450" stroke="#481E25" stroke-width="8" fill="none" opacity="0.8"/>
  <rect x="25" y="25" width="850" height="850" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// 11. Passage Through Hawa
writeSvg(path.join(artworksDir, 'painting-jaipur-arch.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#F4EFE7"/>
  <rect x="60" y="60" width="680" height="880" fill="#DFA390" opacity="0.3"/>
  <!-- Jharokha Multi-foil Arch -->
  <path d="M 180 850 L 180 480 C 180 300, 320 200, 400 160 C 480 200, 620 300, 620 480 L 620 850 Z" fill="#292622"/>
  <path d="M 230 850 L 230 500 C 230 350, 340 270, 400 230 C 460 270, 570 350, 570 500 L 570 850 Z" fill="#F4EFE7"/>
  <!-- Inner depth -->
  <circle cx="400" cy="450" r="90" fill="#B08A4A"/>
  <circle cx="400" cy="450" r="40" fill="#11100F"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.15)" stroke-width="1"/>
</svg>
`);

// 12. Shadows in Still Water
writeSvg(path.join(artworksDir, 'painting-shadows-time.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#E4DBCF"/>
  <g fill="#11100F">
    <rect x="120" y="160" width="260" height="420" rx="4"/>
    <rect x="420" y="240" width="260" height="520" rx="4"/>
  </g>
  <g fill="#B08A4A" opacity="0.8">
    <circle cx="250" cy="370" r="60"/>
    <rect x="480" y="500" width="140" height="140"/>
  </g>
  <line x1="80" y1="580" x2="720" y2="580" stroke="#11100F" stroke-width="3"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(17,16,15,0.1)" stroke-width="1"/>
</svg>
`);

// ── HAND-PAINTED (ONE OF ONE) ──────────────────────────────────────────

writeSvg(path.join(artworksDir, 'handpainted-sacred-geometry.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="impasto" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2D2013"/>
      <stop offset="70%" stop-color="#19130D"/>
      <stop offset="100%" stop-color="#11100F"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#impasto)"/>
  <!-- Gold Leaf Foil Texture Simulation -->
  <polygon points="400,180 620,400 400,620 180,400" fill="#B08A4A" opacity="0.85"/>
  <polygon points="400,240 560,400 400,560 240,400" fill="#11100F"/>
  <circle cx="400" cy="400" r="100" fill="none" stroke="#F4EFE7" stroke-width="4"/>
  <circle cx="400" cy="400" r="70" fill="#481E25"/>
  <circle cx="400" cy="400" r="20" fill="#B08A4A"/>
  <!-- Artist Stamp Seal -->
  <rect x="620" y="820" width="60" height="60" fill="#481E25" rx="4"/>
  <text x="650" y="855" fill="#F4EFE7" font-family="serif" font-size="22" text-anchor="middle">壹</text>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="#B08A4A" stroke-width="1" opacity="0.4"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'handpainted-crimson-veil.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#291216"/>
  <circle cx="400" cy="500" r="320" fill="#481E25"/>
  <path d="M 150 250 Q 400 400, 650 250 L 650 750 Q 400 600, 150 750 Z" fill="#6E2833" opacity="0.9"/>
  <line x1="400" y1="120" x2="400" y2="880" stroke="#B08A4A" stroke-width="3"/>
  <circle cx="400" cy="500" r="40" fill="#B08A4A"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'handpainted-mountain-passage.svg'), `
<svg width="900" height="700" viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="700" fill="#11100F"/>
  <!-- Mountain peaks with heavy white oil knife strokes -->
  <polygon points="100,550 350,150 550,550" fill="#F4EFE7"/>
  <polygon points="350,150 550,550 460,550" fill="#D2C5B3"/>
  <polygon points="380,550 620,220 820,550" fill="#E4DBCF"/>
  <polygon points="620,220 820,550 730,550" fill="#B5A490"/>
  <rect x="0" y="550" width="900" height="150" fill="#0A0909"/>
  <line x1="0" y1="550" x2="900" y2="550" stroke="#B08A4A" stroke-width="2"/>
  <rect x="20" y="20" width="860" height="660" fill="none" stroke="rgba(244,239,231,0.2)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'handpainted-terracotta-vessel.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#E4DBCF"/>
  <circle cx="400" cy="500" r="280" fill="#B85D3B"/>
  <circle cx="400" cy="500" r="230" fill="#8E3C1E"/>
  <circle cx="400" cy="500" r="160" fill="#11100F"/>
  <circle cx="400" cy="500" r="60" fill="#F4EFE7"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.15)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'handpainted-golden-hour.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldH" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="40%" stop-color="#B08A4A"/>
      <stop offset="80%" stop-color="#735422"/>
      <stop offset="100%" stop-color="#11100F"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#goldH)"/>
  <circle cx="400" cy="400" r="180" fill="#F4EFE7" opacity="0.85"/>
  <polygon points="400,200 480,360 600,400 480,440 400,600 320,440 200,400 320,360" fill="#11100F"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(244,239,231,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'handpainted-dark-rhapsody.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <circle cx="400" cy="500" r="260" fill="#292622"/>
  <path d="M 200 300 Q 400 150, 600 300 T 600 700 Q 400 850, 200 700 Z" fill="none" stroke="#F4EFE7" stroke-width="4"/>
  <circle cx="400" cy="500" r="90" fill="#B08A4A"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// ── SCULPTURES (3D GALLERY) ─────────────────────────────────────────────

writeSvg(path.join(artworksDir, 'sculpture-bronze-dancer.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C59B56"/>
      <stop offset="40%" stop-color="#8E6728"/>
      <stop offset="80%" stop-color="#4D3512"/>
      <stop offset="100%" stop-color="#231707"/>
    </linearGradient>
    <radialGradient id="pedestalSpot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#292622"/>
      <stop offset="100%" stop-color="#11100F"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="#11100F"/>
  <!-- Pedestal -->
  <polygon points="250,780 550,780 620,860 180,860" fill="#1C1A18"/>
  <rect x="180" y="860" width="440" height="100" fill="#151413"/>
  <!-- Sculpture Figure (Bronze Fluid Curve) -->
  <path d="M 400 240 C 460 260, 520 340, 480 440 C 450 520, 360 500, 350 600 C 340 700, 420 750, 400 780" fill="none" stroke="url(#bronze)" stroke-width="48" stroke-linecap="round"/>
  <circle cx="400" cy="220" r="35" fill="url(#bronze)"/>
  <ellipse cx="400" cy="780" rx="90" ry="20" fill="#0A0908"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.25)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'sculpture-marble-torso.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F4EFE7"/>
      <stop offset="50%" stop-color="#E4DBCF"/>
      <stop offset="100%" stop-color="#C2B7A5"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="#11100F"/>
  <!-- Black Granite Pedestal -->
  <rect x="280" y="820" width="240" height="140" fill="#1F1C1A"/>
  <rect x="260" y="800" width="280" height="20" fill="#292622"/>
  <!-- Classical Modern Torso Silhouette in Carrara Marble -->
  <path d="M 330 300 C 370 280, 430 280, 470 300 C 510 380, 530 460, 490 560 C 460 640, 470 720, 460 800 L 340 800 C 330 720, 340 640, 310 560 C 270 460, 290 380, 330 300 Z" fill="url(#marble)"/>
  <!-- Marble Veins -->
  <path d="M 360 360 Q 420 440, 400 520 T 440 680" stroke="rgba(17,16,15,0.15)" stroke-width="2" fill="none"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="rgba(244,239,231,0.15)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'sculpture-terracotta-totem.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="250" y="850" width="300" height="100" fill="#1A1816"/>
  <!-- Totem Tier Segments in Terracotta -->
  <g fill="#B85D3B">
    <polygon points="340,300 460,300 490,440 310,440"/>
    <polygon points="320,450 480,450 510,600 290,600"/>
    <polygon points="300,610 500,610 530,850 270,850"/>
  </g>
  <circle cx="400" cy="220" r="60" fill="#8E3C1E"/>
  <circle cx="400" cy="220" r="25" fill="#11100F"/>
  <!-- Incised tribal lines -->
  <g stroke="#11100F" stroke-width="3">
    <line x1="330" y1="370" x2="470" y2="370"/>
    <line x1="310" y1="520" x2="490" y2="520"/>
    <line x1="290" y1="720" x2="510" y2="720"/>
  </g>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.25)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'sculpture-kinetic-brass.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="240" y="860" width="320" height="80" fill="#292622" rx="4"/>
  <!-- Kinetic Brass Fulcrum and Arc -->
  <line x1="400" y1="860" x2="400" y2="450" stroke="#B08A4A" stroke-width="8"/>
  <circle cx="400" cy="450" r="16" fill="#F4EFE7"/>
  <!-- Balanced curved beam tilted at dynamic angle -->
  <g transform="rotate(-18 400 450)" stroke="#B08A4A" stroke-width="6" fill="none">
    <path d="M 120 450 C 260 400, 540 500, 680 450"/>
    <circle cx="120" cy="450" r="32" fill="#B08A4A"/>
    <circle cx="680" cy="450" r="22" fill="#481E25"/>
  </g>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.25)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'sculpture-brutalist-arch.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <polygon points="200,880 600,880 650,950 150,950" fill="#1A1817"/>
  <!-- Brutalist Cast Basalt Monolith with brass slit -->
  <rect x="240" y="240" width="320" height="640" fill="#292622"/>
  <rect x="390" y="200" width="20" height="680" fill="#B08A4A"/>
  <circle cx="400" cy="380" r="50" fill="#11100F"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(228,219,207,0.15)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'sculpture-serpent-form.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="260" y="860" width="280" height="80" fill="#1D1A18"/>
  <!-- Spiral Forged Steel Helix -->
  <path d="M 400 860 C 260 760, 260 620, 400 560 C 540 500, 540 360, 400 300 C 320 260, 320 180, 400 140" fill="none" stroke="#B08A4A" stroke-width="28" stroke-linecap="round"/>
  <circle cx="400" cy="140" r="22" fill="#F4EFE7"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.25)" stroke-width="1"/>
</svg>
`);

// ── COLLECTIBLE FIGURES (ART TOYS & CAST RESIN) ─────────────────────────

writeSvg(path.join(artworksDir, 'figure-cyber-deva.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <ellipse cx="400" cy="850" rx="200" ry="30" fill="#1A1817"/>
  <!-- Futuristic Designer Vinyl Figure Silhouette with Gold Mask -->
  <path d="M 330 360 C 330 240, 470 240, 470 360 C 470 420, 440 460, 400 480 C 360 460, 330 420, 330 360 Z" fill="#292622"/>
  <!-- Gold Mask Visor -->
  <polygon points="340,340 460,340 440,400 360,400" fill="#B08A4A"/>
  <!-- Cybernetic halo -->
  <circle cx="400" cy="360" r="140" fill="none" stroke="#B08A4A" stroke-width="3" stroke-dasharray="10 8"/>
  <!-- Body / Robes in matte obsidian -->
  <path d="M 280 500 C 340 480, 460 480, 520 500 L 550 840 L 250 840 Z" fill="#1E1C1A"/>
  <line x1="400" y1="480" x2="400" y2="840" stroke="#481E25" stroke-width="4"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'figure-astral-voyager.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <circle cx="400" cy="400" r="130" fill="#3D5A80" opacity="0.3"/>
  <circle cx="400" cy="350" r="80" fill="#F4EFE7"/>
  <polygon points="360,330 440,330 430,370 370,370" fill="#11100F"/>
  <!-- Suit Body -->
  <path d="M 310 440 L 490 440 L 520 780 L 280 780 Z" fill="#292622"/>
  <circle cx="400" cy="520" r="30" fill="#B08A4A"/>
  <ellipse cx="400" cy="820" rx="160" ry="25" fill="#191715"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(244,239,231,0.2)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'figure-ronin-monk.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <!-- Conical Straw Kasa Hat -->
  <polygon points="180,340 620,340 400,220" fill="#481E25"/>
  <circle cx="400" cy="380" r="45" fill="#E4DBCF"/>
  <!-- Kimono Silhouette -->
  <polygon points="260,420 540,420 600,850 200,850" fill="#292622"/>
  <polygon points="360,420 440,420 420,650 380,650" fill="#B08A4A"/>
  <ellipse cx="400" cy="870" rx="190" ry="25" fill="#181614"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.25)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'figure-solar-golem.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="280" y="260" width="240" height="200" rx="20" fill="#8E3C1E"/>
  <circle cx="400" cy="360" r="40" fill="#B08A4A"/>
  <!-- Torso & Boulder Arms -->
  <rect x="260" y="480" width="280" height="320" rx="16" fill="#B85D3B"/>
  <circle cx="400" cy="600" r="50" fill="#F4EFE7"/>
  <ellipse cx="400" cy="850" rx="200" ry="30" fill="#191715"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(184,93,59,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'figure-shadow-kitsune.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <!-- Fox mask shape with sharp ears -->
  <polygon points="320,220 280,340 360,320" fill="#481E25"/>
  <polygon points="480,220 520,340 440,320" fill="#481E25"/>
  <ellipse cx="400" cy="380" rx="100" ry="80" fill="#F4EFE7"/>
  <polygon points="400,430 380,410 420,410" fill="#11100F"/>
  <path d="M 330 460 C 370 440, 430 440, 470 460 L 530 840 L 270 840 Z" fill="#481E25"/>
  <circle cx="400" cy="620" r="28" fill="#B08A4A"/>
  <ellipse cx="400" cy="860" rx="180" ry="25" fill="#1A1817"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(72,30,37,0.4)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'figure-celestial-courier.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <!-- Winged Helmet Concept in Brass -->
  <polygon points="260,280 340,320 280,360" fill="#B08A4A"/>
  <polygon points="540,280 460,320 520,360" fill="#B08A4A"/>
  <circle cx="400" cy="350" r="70" fill="#292622"/>
  <rect x="360" y="330" width="80" height="20" rx="4" fill="#B08A4A"/>
  <path d="M 320 430 L 480 430 L 520 830 L 280 830 Z" fill="#1E1B19"/>
  <ellipse cx="400" cy="860" rx="170" ry="25" fill="#1A1715"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// ── PRINTS & LIMITED EDITIONS ───────────────────────────────────────────

writeSvg(path.join(artworksDir, 'print-lotus-monochrome.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#F4EFE7"/>
  <!-- Wide museum mat border -->
  <rect x="100" y="100" width="600" height="740" fill="#FFFFFF" stroke="#E4DBCF" stroke-width="1"/>
  <!-- Minimalist Ink Lotus -->
  <g fill="none" stroke="#11100F" stroke-width="2.5">
    <path d="M 400 300 C 370 380, 370 480, 400 560 C 430 480, 430 380, 400 300 Z" fill="#11100F"/>
    <path d="M 370 360 C 310 420, 310 500, 370 550"/>
    <path d="M 430 360 C 490 420, 490 500, 430 550"/>
    <path d="M 330 420 C 260 480, 270 540, 340 560"/>
    <path d="M 470 420 C 540 480, 530 540, 460 560"/>
    <line x1="400" y1="560" x2="400" y2="700" stroke-width="3"/>
  </g>
  <!-- Edition & Signature line -->
  <text x="120" y="870" font-family="sans-serif" font-size="12" fill="#888" letter-spacing="2">EDITION 14/100</text>
  <text x="680" y="870" font-family="serif" font-size="14" fill="#11100F" text-anchor="end" font-style="italic">Ananya Sen</text>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.08)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'print-haveli-facade.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#E4DBCF"/>
  <rect x="100" y="100" width="600" height="750" fill="#F4EFE7"/>
  <!-- Two-tone architectural Haveli linocut -->
  <g fill="#292622">
    <rect x="180" y="220" width="120" height="180" rx="60"/>
    <rect x="340" y="220" width="120" height="180" rx="60"/>
    <rect x="500" y="220" width="120" height="180" rx="60"/>
    <rect x="180" y="460" width="120" height="240" rx="60"/>
    <rect x="340" y="460" width="120" height="240" rx="60"/>
    <rect x="500" y="460" width="120" height="240" rx="60"/>
  </g>
  <g fill="#B08A4A">
    <circle cx="240" cy="310" r="20"/>
    <circle cx="400" cy="310" r="20"/>
    <circle cx="560" cy="310" r="20"/>
  </g>
  <text x="120" y="880" font-family="sans-serif" font-size="12" fill="#777" letter-spacing="2">LITHOGRAPH 24/50</text>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.08)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'print-cosmic-mandala.svg'), `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#11100F"/>
  <rect x="80" y="80" width="640" height="640" fill="#191614" stroke="#B08A4A" stroke-width="1"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="#B08A4A" stroke-width="2"/>
  <circle cx="400" cy="400" r="160" fill="none" stroke="#F4EFE7" stroke-width="1.5" stroke-dasharray="6 4"/>
  <polygon points="400,180 590,510 210,510" fill="none" stroke="#B08A4A" stroke-width="2"/>
  <polygon points="400,620 590,290 210,290" fill="none" stroke="#F4EFE7" stroke-width="2"/>
  <circle cx="400" cy="400" r="30" fill="#481E25"/>
  <circle cx="400" cy="400" r="8" fill="#B08A4A"/>
  <rect x="20" y="20" width="760" height="760" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'print-deccan-plateau.svg'), `
<svg width="1000" height="750" viewBox="0 0 1000 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="750" fill="#F4EFE7"/>
  <g fill="none" stroke="#292622" stroke-width="1.5" opacity="0.8">
    <ellipse cx="500" cy="380" rx="380" ry="240"/>
    <ellipse cx="500" cy="380" rx="320" ry="200"/>
    <ellipse cx="500" cy="380" rx="260" ry="160"/>
    <ellipse cx="500" cy="380" rx="200" ry="120" stroke="#B08A4A" stroke-width="2.5"/>
    <ellipse cx="500" cy="380" rx="140" ry="80"/>
    <ellipse cx="500" cy="380" rx="80" ry="40" fill="#481E25"/>
  </g>
  <rect x="20" y="20" width="960" height="710" fill="none" stroke="rgba(17,16,15,0.08)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'print-banaras-ghats.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#F4EFE7"/>
  <rect x="80" y="80" width="640" height="800" fill="#292622"/>
  <polygon points="120,400 400,200 680,400" fill="#F4EFE7"/>
  <rect x="200" y="400" width="400" height="300" fill="#E4DBCF"/>
  <line x1="200" y1="500" x2="600" y2="500" stroke="#B08A4A" stroke-width="3"/>
  <line x1="200" y1="600" x2="600" y2="600" stroke="#B08A4A" stroke-width="3"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.08)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'print-silent-chamber.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="100" y="100" width="600" height="780" fill="#1C1917" stroke="#481E25" stroke-width="2"/>
  <circle cx="400" cy="460" r="180" fill="#B08A4A" opacity="0.4"/>
  <line x1="400" y1="160" x2="400" y2="760" stroke="#F4EFE7" stroke-width="2"/>
  <line x1="160" y1="460" x2="640" y2="460" stroke="#F4EFE7" stroke-width="2"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// ── DESK & DECORATIVE OBJECTS ───────────────────────────────────────────

writeSvg(path.join(artworksDir, 'object-brass-sundial.svg'), `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#11100F"/>
  <circle cx="400" cy="400" r="280" fill="#292622"/>
  <circle cx="400" cy="400" r="260" fill="#B08A4A"/>
  <circle cx="400" cy="400" r="240" fill="#191715"/>
  <!-- Engraved markings -->
  <g stroke="#B08A4A" stroke-width="3">
    <line x1="400" y1="160" x2="400" y2="210"/>
    <line x1="400" y1="590" x2="400" y2="640"/>
    <line x1="160" y1="400" x2="210" y2="400"/>
    <line x1="590" y1="400" x2="640" y2="400"/>
  </g>
  <!-- Cast Gnomon pointer -->
  <polygon points="400,260 420,440 380,440" fill="#F4EFE7"/>
  <rect x="20" y="20" width="760" height="760" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'object-brutalist-vessel.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#F4EFE7"/>
  <rect x="220" y="440" width="360" height="420" rx="8" fill="#292622"/>
  <rect x="360" y="340" width="80" height="100" fill="#11100F"/>
  <!-- Minimalist dry branch -->
  <path d="M 400 340 Q 420 200, 320 120 M 410 240 Q 460 180, 520 140" fill="none" stroke="#B08A4A" stroke-width="4" stroke-linecap="round"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(17,16,15,0.1)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'object-incense-temple.svg'), `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#11100F"/>
  <rect x="200" y="780" width="400" height="80" rx="4" fill="#292622"/>
  <rect x="250" y="660" width="300" height="120" fill="#B08A4A"/>
  <polygon points="230,660 570,660 400,480" fill="#C59B56"/>
  <!-- Smoke plume -->
  <path d="M 400 480 Q 370 380, 420 280 T 380 120" fill="none" stroke="#F4EFE7" stroke-width="3" opacity="0.6"/>
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artworksDir, 'object-marble-sphere.svg'), `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#11100F"/>
  <rect x="180" y="600" width="440" height="60" fill="#292622" rx="4"/>
  <circle cx="400" cy="420" r="180" fill="#1D382B"/>
  <circle cx="360" cy="380" r="120" fill="#2A5240" opacity="0.6"/>
  <circle cx="330" cy="350" r="30" fill="#F4EFE7" opacity="0.4"/>
  <rect x="20" y="20" width="760" height="760" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// ── ARTISTS PORTRAITS ───────────────────────────────────────────────────

writeSvg(path.join(artistsDir, 'artist-ananya-sen.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="p1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2824"/>
      <stop offset="100%" stop-color="#11100F"/>
    </linearGradient>
  </defs>
  <rect width="600" height="750" fill="url(#p1)"/>
  <circle cx="300" cy="280" r="140" fill="#D8C8B8"/>
  <!-- Hair & Features -->
  <path d="M 160 280 C 160 140, 440 140, 440 280 C 440 340, 400 380, 400 450 L 200 450 C 200 380, 160 340, 160 280 Z" fill="#1C1815"/>
  <polygon points="180,480 420,480 480,750 120,750" fill="#481E25"/>
  <circle cx="300" cy="400" r="8" fill="#B08A4A"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artistsDir, 'artist-vikramaditya-roy.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#181513"/>
  <circle cx="300" cy="270" r="130" fill="#C9B49E"/>
  <path d="M 180 230 C 180 130, 420 130, 420 230 Z" fill="#11100F"/>
  <rect x="220" y="360" width="160" height="50" rx="10" fill="#11100F"/>
  <polygon points="150,470 450,470 510,750 90,750" fill="#292622"/>
  <line x1="300" y1="470" x2="300" y2="750" stroke="#B08A4A" stroke-width="3"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artistsDir, 'artist-tara-deshmukh.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#1F1B18"/>
  <circle cx="300" cy="290" r="135" fill="#DFCBB9"/>
  <path d="M 170 260 C 170 120, 430 120, 430 260 Z" fill="#0C0A09"/>
  <polygon points="160,490 440,490 500,750 100,750" fill="#11100F"/>
  <circle cx="300" cy="490" r="24" fill="#B08A4A"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artistsDir, 'artist-kaelen-vora.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#11100F"/>
  <circle cx="300" cy="270" r="130" fill="#D5C5B5"/>
  <!-- Futuristic frame glasses -->
  <rect x="210" y="240" width="70" height="35" rx="4" fill="#292622" stroke="#B08A4A" stroke-width="2"/>
  <rect x="320" y="240" width="70" height="35" rx="4" fill="#292622" stroke="#B08A4A" stroke-width="2"/>
  <line x1="280" y1="255" x2="320" y2="255" stroke="#B08A4A" stroke-width="3"/>
  <polygon points="160,460 440,460 500,750 100,750" fill="#1F1C1A"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artistsDir, 'artist-zoya-mir.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#20181A"/>
  <circle cx="300" cy="280" r="135" fill="#E8D5C4"/>
  <!-- Kashmiri Pashmina Drape -->
  <path d="M 170 240 C 170 120, 430 120, 430 240 L 470 540 L 130 540 Z" fill="#481E25" opacity="0.9"/>
  <polygon points="140,520 460,520 520,750 80,750" fill="#11100F"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

writeSvg(path.join(artistsDir, 'artist-devendra-patil.svg'), `
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#1C1815"/>
  <circle cx="300" cy="270" r="130" fill="#C5AE96"/>
  <path d="M 180 230 C 180 140, 420 140, 420 230 Z" fill="#292622"/>
  <polygon points="150,470 450,470 500,750 100,750" fill="#3D2B1F"/>
  <rect x="15" y="15" width="570" height="720" fill="none" stroke="rgba(176,138,74,0.3)" stroke-width="1"/>
</svg>
`);

// ── ROOM PREVIEWS ───────────────────────────────────────────────────────

// 1. Living Room
writeSvg(path.join(roomsDir, 'room-living-room.svg'), `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Minimalist Living Room Canvas Wall -->
  <rect width="1200" height="560" fill="#EFE9DE"/>
  <!-- Dark Herringbone Parquet Floor -->
  <rect y="560" width="1200" height="240" fill="#241E1A"/>
  <!-- Thin architectural baseboard -->
  <rect y="545" width="1200" height="15" fill="#E4DBCF"/>
  <!-- Designer Lowline Sofa -->
  <rect x="250" y="520" width="700" height="140" rx="16" fill="#11100F"/>
  <rect x="280" y="470" width="640" height="80" rx="14" fill="#1C1A18"/>
  <!-- Side table with sculptural lamp -->
  <rect x="1000" y="500" width="120" height="120" rx="6" fill="#292622"/>
  <ellipse cx="1060" cy="460" rx="25" ry="40" fill="#F4EFE7"/>
  <line x1="1060" y1="500" x2="1060" y2="460" stroke="#B08A4A" stroke-width="4"/>
  <!-- Warm overhead gallery spotlight cone -->
  <polygon points="600,0 300,560 900,560" fill="#FFFFFF" opacity="0.07"/>
</svg>
`);

// 2. Bedroom
writeSvg(path.join(roomsDir, 'room-bedroom.svg'), `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="560" fill="#E5DFD4"/>
  <rect y="560" width="1200" height="240" fill="#3D322B"/>
  <rect y="545" width="1200" height="15" fill="#D6CDBF"/>
  <!-- Bed Headboard & Pillows -->
  <rect x="280" y="420" width="640" height="160" rx="20" fill="#292622"/>
  <rect x="320" y="480" width="260" height="70" rx="10" fill="#F4EFE7"/>
  <rect x="620" y="480" width="260" height="70" rx="10" fill="#F4EFE7"/>
  <rect x="300" y="540" width="600" height="180" rx="12" fill="#E4DBCF"/>
</svg>
`);

// 3. Study / Library
writeSvg(path.join(roomsDir, 'room-study.svg'), `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="560" fill="#292622"/>
  <rect y="560" width="1200" height="240" fill="#1A1816"/>
  <!-- Dark Wood Bookshelves on Left -->
  <rect x="60" y="40" width="220" height="520" fill="#1C1815" stroke="#3D352E" stroke-width="4"/>
  <!-- Leather Desk Chair & Executive Table -->
  <rect x="420" y="480" width="460" height="140" rx="8" fill="#11100F"/>
  <circle cx="650" cy="440" r="50" fill="#481E25"/>
  <polygon points="650,0 450,560 850,560" fill="#F4EFE7" opacity="0.05"/>
</svg>
`);

// 4. Entryway / Gallery Foyer
writeSvg(path.join(roomsDir, 'room-entryway.svg'), `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="580" fill="#F4EFE7"/>
  <rect y="580" width="1200" height="220" fill="#1F1C1A"/>
  <!-- Marble Console Table -->
  <rect x="350" y="500" width="500" height="24" rx="3" fill="#E4DBCF" stroke="#B08A4A" stroke-width="2"/>
  <line x1="390" y1="524" x2="390" y2="680" stroke="#B08A4A" stroke-width="6"/>
  <line x1="810" y1="524" x2="810" y2="680" stroke="#B08A4A" stroke-width="6"/>
  <!-- Brutalist vase on console -->
  <rect x="420" y="420" width="50" height="80" rx="4" fill="#11100F"/>
</svg>
`);

console.log('All gallery artwork, artist, and room SVG assets successfully created.');
