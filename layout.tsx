// frontend/src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SubscriptionProvider } from '@/components/providers/SubscriptionProvider'
import { ToastProvider } from '@/components/ui/Toast'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit'
})

export const metadata: Metadata = {
  title: {
    default: 'X Stars - Unlimited Movies, TV Shows & More',
    template: '%s | X Stars'
  },
  description: 'Stream unlimited movies, TV shows, anime, and exclusive originals on X Stars. Watch anywhere, anytime. Start your premium streaming experience today.',
  keywords: ['streaming', 'movies', 'TV shows', 'anime', 'X Stars', 'entertainment'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xstars.com',
    siteName: 'X Stars',
    images: [
      {
        url: 'https://cdn.xstars.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'X Stars'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xstars',
    creator: '@xstars'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>
          <AuthProvider>
            <SubscriptionProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}