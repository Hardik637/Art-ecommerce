import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collector Portal | ATELIER & ART HOUSE',
  description:
    'Sign in to your Atelier & Art House collector cabinet. Manage acquisitions, view digital certificates of authenticity, track insured art freight, and follow master artists.',
  keywords: [
    'Atelier Art House collector sign in',
    'fine art portal login',
    'art acquisition tracking',
    'certificate of authenticity portal',
  ],
  robots: {
    index: false,
    follow: true,
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
