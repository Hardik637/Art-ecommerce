import type { Metadata } from 'next';
import { spaceGrotesk, bebasNeue } from '@/fonts';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CartToast from '@/components/CartToast';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Contemporary Art House & Collector Boutique`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    'Curated marketplace for original paintings, lost-wax bronze sculptures, collectible designer figures, and limited edition art objects. Complimentary white-glove shipping above ₹999.',
  keywords: [
    'contemporary art India',
    'buy original paintings online India',
    'bronze sculptures India',
    'collectible figures India',
    'art house gallery',
    'one of one art',
    'Indian contemporary artists',
    'fine art prints',
    'luxury home art',
    'architectural art objects',
  ],
  authors: [{ name: 'Atelier Curatorial Board', url: SITE_CONFIG.url }],
  creator: 'Atelier & Art House',
  publisher: 'Atelier & Art House',
  category: 'Fine Art & Collectibles',
  openGraph: {
    title: `${SITE_CONFIG.name} | Contemporary Art House & Collector Boutique`,
    description:
      'Curated marketplace for original paintings, bronze sculptures, designer figures, and fine art objects. Pan-India white-glove delivery.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/artworks/painting-monsoon-abstract.svg',
        width: 1200,
        height: 630,
        alt: 'Atelier & Art House Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/brand-seal.svg', type: 'image/svg+xml' }],
    apple: '/brand-seal.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

const storeSchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/brand-seal.svg`,
  description: SITE_CONFIG.subTagline,
  currenciesAccepted: 'INR',
  paymentAccepted: ['Credit Card', 'UPI', 'Net Banking', 'Cash on Delivery'],
  priceRange: '₹₹',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${bebasNeue.variable} bg-white text-black font-sans antialiased selection:bg-black selection:text-white`}
        suppressHydrationWarning
      >
        <Header />
        <CartDrawer />
        <CartToast />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
