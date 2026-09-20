export const SITE_CONFIG = {
  name: "Zorodoor Art & Home Décor",
  shortName: "Zorodoor",
  tagline: "Modern Art & Premium Home Décor",
  subTagline: "Original wall art, sculptures, and decorative pieces curated for modern spaces.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://art-ecommerce-omega.vercel.app",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 999,
  contact: {
    email: "support@zorodoor.com",
    supportHours: "Monday – Saturday: 10:00 – 18:00 IST",
    coverage: "Pan-India Shipping & Online Support",
  },
  socials: {
    instagram: "https://instagram.com",
    twitter: "https://x.com",
    pinterest: "https://pinterest.com",
  },
  shipping: {
    freeThreshold: 999,
    standardFee: 499,
  },
  announcement: {
    text: "FREE SHIPPING ON ORDERS ABOVE ₹999 • 100% SATISFACTION GUARANTEE • PREMIUM TRANSIT PACKAGING",
    items: [
      "FREE SHIPPING ON ORDERS ABOVE ₹999",
      "NEW ARRIVALS NOW LIVE",
      "CASH ON DELIVERY AVAILABLE",
      "7-DAY IN-HOME TRIAL",
      "CURATED WALL ART & SCULPTURES",
      "SHOP OUR LATEST COLLECTION",
    ],
  },
} as const;

export const siteConfig = SITE_CONFIG;

export type SiteConfig = typeof SITE_CONFIG;
