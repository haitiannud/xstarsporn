// src/app/(platform)/home/page.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { FiPlay, FiPlus, FiInfo, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useProfileStore } from '@/stores/profileStore'
import { useAds } from '@/hooks/useAds'
import { useLocalization } from '@/hooks/useLocalization'

import Navbar from '@/components/layout/Navbar'
import HeroBanner from '@/components/home/HeroBanner'
import ContentCarousel from '@/components/home/ContentCarousel'
import ContinueWatching from '@/components/home/ContinueWatching'
import SkeletonLoader from '@/components/shared/SkeletonLoader'
import BannerAd from '@/components/ads/BannerAd'

export default function HomePage() {
  const { user } = useAuth()
  const { subscription } = useSubscription()
  const { activeProfile } = useProfileStore()
  const { showAds } = useAds()
  const { t } = useLocalization()

  // Fetch personalized homepage data
  const { data: homepageData, isLoading } = useQuery({
    queryKey: ['homepage', activeProfile?.id],
    queryFn: () => api.getPersonalizedHomepage(activeProfile?.id),
    staleTime: 30000,
  })

  // Fetch hero banner
  const { data: heroContent } = useQuery({
    queryKey: ['hero-banner', activeProfile?.id],
    queryFn: () => api.getHeroBanner(activeProfile?.id),
  })

  // Fetch continue watching
  const { data: continueWatching } = useQuery({
    queryKey: ['continue-watching', activeProfile?.id],
    queryFn: () => api.getContinueWatching(activeProfile?.id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <SkeletonLoader type="hero" />
        <div className="p-8 space-y-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} type="carousel" />
          ))}
        </div>
      </div>
    )
  }

  const rows = homepageData?.rows || []

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Banner */}
      {heroContent && (
        <HeroBanner 
          content={heroContent}
          onPlay={(id) => router.push(`/watch/${id}`)}
          onMoreInfo={(slug) => router.push(`/movie/${slug}`)}
        />
      )}

      {/* Ad Banner for Free Users */}
      {showAds && subscription?.plan === 'free' && (
        <div className="px-8 py-4">
          <BannerAd zoneId="5831138" />
        </div>
      )}

      <div className="relative z-10 -mt-32">
        {/* Continue Watching */}
        {continueWatching && continueWatching.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-bold px-8 mb-4">
              {t('home.continue_watching')}
            </h2>
            <ContinueWatching items={continueWatching} />
          </section>
        )}

        {/* Dynamic Rows */}
        {rows.map((row, index) => (
          <motion.section
            key={row.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.1 }}
            className="py-4"
          >
            <h2 className="text-2xl font-bold px-8 mb-4">{row.title}</h2>
            <ContentCarousel items={row.content} />
          </motion.section>
        ))}
      </div>
    </div>
  )
}