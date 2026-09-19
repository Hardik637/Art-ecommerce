export const SITE_CONFIG = {
  name: "ATELIER & ART HOUSE",
  shortName: "ATELIER",
  tagline: "Contemporary Art House & Collector Boutique",
  subTagline: "Original works, collectible figures and objects selected for spaces that demand presence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://atelierarthouse.com",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 999,
  contact: {
    email: "concierge@atelierarthouse.com",
    phone: "+91 98101 23456",
    address: "Gallery Quarter, 14 Civil Lines, New Delhi 110054",
    hours: "Tue – Sun: 11:00 – 19:00 IST",
  },
  socials: {
    instagram: "https://instagram.com",
    artsy: "https://artsy.net",
    pinterest: "https://pinterest.com",
    twitter: "https://x.com",
  },
  shipping: {
    freeThreshold: 999,
    standardFee: 0,
  },
  announcement: {
    text: "COMPLIMENTARY WHITE-GLOVE SHIPPING ON ORDERS ABOVE ₹999 • AUTHENTIC ORIGINAL ARTWORKS • CERTIFICATES OF AUTHENTICITY • SECURE TRANSIT INSURANCE",
  },
} as const;

export const siteConfig = SITE_CONFIG;

export type SiteConfig = typeof SITE_CONFIG;
