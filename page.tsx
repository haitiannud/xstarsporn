// frontend/src/app/page.tsx (Landing Page)
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { HeroBanner } from '@/components/home/HeroBanner'
import { TrendingSection } from '@/components/home/TrendingSection'
import { ContentRow } from '@/components/home/ContentRow'
import { FAQ } from '@/components/home/FAQ'
import { Features } from '@/components/home/Features'
import { useAuth } from '@/hooks/useAuth'
import { useContent } from '@/hooks/useContent'

export default function LandingPage() {
  const { user } = useAuth()
  const { trendingContent, featuredContent, loading } = useContent()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.')
      return
    }

    try {
      // Check if email exists
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.exists) {
        router.push(`/signin?email=${encodeURIComponent(email)}`)
      } else {
        router.push(`/signup?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      setEmailError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {loading ? (
          <Skeleton variant="rectangular" className="h-full w-full" />
        ) : (
          <HeroBanner content={featuredContent} />
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Unlimited Movies, TV Shows, Anime and More.
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-gray-300">
                Starting at <span className="text-white font-bold">650 HTG</span>
              </p>
              <p className="text-lg md:text-xl mb-8 text-gray-400">
                Watch anywhere. Stream instantly. Discover a world of entertainment powered by X Stars.
              </p>

              {/* Email Capture */}
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-6 py-4 bg-black/50 border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-white transition-colors"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>
                <Button size="xl" type="submit" glow>
                  Get Started
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </form>

              {user && (
                <Button variant="secondary" size="lg" onClick={() => router.push('/home')}>
                  Go To Home
                </Button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Curved Divider */}
      <div className="relative">
        <div className="absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black" />
        <svg
          className="relative w-full"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 100C240 0 480 0 720 0C960 0 1200 0 1440 100V100H0V100Z"
            className="fill-black"
          />
          <path
            d="M0 100C240 0 480 0 720 0C960 0 1200 0 1440 100"
            stroke="url(#gradient)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="50%" stopColor="#DC143C" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Trending Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Trending Now
          </motion.h2>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          ) : (
            <TrendingSection content={trendingContent} />
          )}
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Content Rows */}
      <ContentRow title="X Stars Originals" category="originals" />
      <ContentRow title="Popular Movies" category="movies" />
      <ContentRow title="Popular Series" category="series" />
      <ContentRow title="Anime" category="anime" />
      <ContentRow title="Action & Adventure" category="action" />
      <ContentRow title="Comedy" category="comedy" />

      {/* Platform Access Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Get Access To Content From Your Favorite Entertainment Worlds
          </motion.h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Discover movies, series, anime, documentaries, and premium entertainment experiences in one place.
          </p>

          {/* Brand Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
            {['brand1', 'brand2', 'brand3', 'brand4', 'brand5', 'brand6'].map((brand) => (
              <motion.img
                key={brand}
                whileHover={{ scale: 1.1, opacity: 1 }}
                src={`/assets/brands/${brand}.svg`}
                alt={brand}
                className="h-12"
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ready to start watching?
          </motion.h2>
          <p className="text-xl text-gray-400 mb-8">
            Enter your email to create or restart your membership.
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 px-6 py-4 bg-black/50 border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-white transition-colors"
            />
            <Button size="lg" type="submit" glow>
              Get Started
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
