import localFont from 'next/font/local';

export const spaceGrotesk = localFont({
  src: [
    {
      path: './zorodoor-space-grotesk-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Space-Grotesk-700-latin.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const bebasNeue = localFont({
  src: [
    {
      path: './zorodoor-bebas-neue-latin.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bebas-neue',
  display: 'swap',
});
