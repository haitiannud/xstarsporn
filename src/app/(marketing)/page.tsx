// src/app/(marketing)/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { FiMail, FiChevronRight, FiPlay, FiInfo } from 'react-icons/fi'
import { HiShieldCheck, HiDeviceMobile, HiDownload } from 'react-icons/hi'

// API service
import { api } from '@/services/api'
import { useLocalization } from '@/hooks/useLocalization'

// Components
import SEOHead from '@/components/shared/SEOHead'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContentCarousel from '@/components/home/ContentCarousel'
import SkeletonLoader from '@/components/shared/SkeletonLoader'

// Types
interface TrendingContent {
  id: string
  title: string
  poster: string
  backdrop: string
  genres: string[]
  rating: number
  type: 'movie' | 'series'
}

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

export default function LandingPage() {
  const router = useRouter()
  const { t, locale, currency } = useLocalization()
  const [email, setEmail] = useState('')
  const [currentHero, setCurrentHero] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch trending content for hero
  const { data: heroContent, isLoading: heroLoading } = useQuery({
    queryKey: ['landing-hero'],
    queryFn: () => api.getTrendingHero(),
    refetchInterval: 30000,
  })

  // Fetch trending content
  const { data: trendingContent } = useQuery({
    queryKey: ['landing-trending'],
    queryFn: () => api.getTrendingContent(),
  })

  // Fetch featured content
  const { data: featuredContent } = useQuery({
    queryKey: ['landing-featured'],
    queryFn: () => api.getFeaturedContent(),
  })

  // Auto-rotate hero
  useEffect(() => {
    if (!heroContent?.length) return
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroContent.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [heroContent])

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      setIsAuthenticated(!!auth.currentUser)
    }
    checkAuth()
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const exists = await api.checkEmailExists(email)
      if (exists) {
        router.push(`/signin?email=${encodeURIComponent(email)}`)
      } else {
        router.push(`/signup?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      console.error('Email check failed:', error)
    }
  }

  const features: Feature[] = [
    {
      icon: <HiDeviceMobile className="w-8 h-8" />,
      title: t('features.watch_anywhere'),
      description: t('features.watch_anywhere_desc'),
    },
    {
      icon: <HiDownload className="w-8 h-8" />,
      title: t('features.download'),
      description: t('features.download_desc'),
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: t('features.secure'),
      description: t('features.secure_desc'),
    },
  ]

  const plans = [
    {
      name: 'Basic',
      price: locale === 'ht' ? '650 HTG' : '$7.99',
      features: ['2 Profiles', '2 Devices', 'HD Streaming', 'No Ads'],
    },
    {
      name: 'Standard',
      price: locale === 'ht' ? '1309 HTG' : '$12.99',
      features: ['3 Profiles', '3 Devices', 'Full HD', 'No Ads', 'Downloads'],
      popular: true,
    },
    {
      name: 'Premium',
      price: locale === 'ht' ? '2450 HTG' : '$19.99',
      features: ['4 Profiles', '4 Devices', '4K HDR', 'Dolby Audio', 'Downloads'],
    },
    {
      name: 'Members',
      price: locale === 'ht' ? '4250 HTG' : '$29.99',
      features: ['7 Profiles', '7 Devices', '4K HDR', 'Exclusive Content', 'Premium Badge'],
    },
  ]

  const faqItems = [
    {
      question: t('faq.what_is'),
      answer: t('faq.what_is_answer'),
    },
    {
      question: t('faq.cost'),
      answer: t('faq.cost_answer'),
    },
    {
      question: t('faq.where'),
      answer: t('faq.where_answer'),
    },
    {
      question: t('faq.cancel'),
      answer: t('faq.cancel_answer'),
    },
  ]

  return (
    <>
      <SEOHead
        title={t('landing.title')}
        description={t('landing.description')}
        ogImage="/assets/og-image.jpg"
      />

      <div className="min-h-screen bg-black">
        <Navbar 
          isAuthenticated={isAuthenticated}
          onSignIn={() => router.push('/signin')}
          onGoHome={() => router.push('/home')}
        />

        {/* Hero Section */}
        <section className="hero-banner">
          <AnimatePresence mode="wait">
            {heroLoading ? (
              <SkeletonLoader type="hero" />
            ) : (
              heroContent && (
                <motion.div
                  key={currentHero}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  {/* Background Image/Video */}
                  <div className="absolute inset-0">
                    <Image
                      src={heroContent[currentHero]?.backdrop || '/assets/default-hero.jpg'}
                      alt=""
                      fill
                      className="object-cover animate-cinematic-zoom"
                      priority
                    />
                    <div className="absolute inset-0 cinematic-overlay" />
                  </div>

                  {/* Hero Content */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="hero-content"
                  >
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
                      {t('landing.hero_title')}
                    </h1>
                    <p className="text-xl text-white/80 mb-2">
                      {t('landing.hero_subtitle')}
                    </p>
                    <p className="text-lg text-white/60 mb-8">
                      {t('landing.starting_at')} {currency === 'HTG' ? '650 HTG' : '$7.99'}
                    </p>

                    {/* Email Capture */}
                    <form onSubmit={handleEmailSubmit} className="flex gap-4 max-w-lg">
                      <div className="relative flex-1">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('landing.email_placeholder')}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md 
                                   border border-white/20 rounded-lg text-white
                                   placeholder-gray-400 focus:outline-none focus:border-xstars-red
                                   transition-all duration-300"
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary flex items-center gap-2">
                        {t('landing.get_started')}
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </section>

        {/* Curved Divider */}
        <div className="curved-divider">
          <div className="h-24 bg-gradient-to-b from-transparent to-xstars-deep" />
        </div>

        {/* Trending Now */}
        <section className="py-16 px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            {t('landing.trending_now')}
          </motion.h2>
          {trendingContent ? (
            <ContentCarousel items={trendingContent} />
          ) : (
            <SkeletonLoader type="carousel" />
          )}
        </section>

        {/* Features */}
        <section className="py-16 px-8 bg-xstars-graphite">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              {t('landing.features_title')}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="glass-card p-8 text-center"
                >
                  <div className="text-xstars-red mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* X Stars Originals */}
        <section className="py-16 px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8"
          >
            {t('landing.originals')}
          </motion.h2>
          {featuredContent?.originals && (
            <ContentCarousel items={featuredContent.originals} variant="large" />
          )}
        </section>

        {/* Plans */}
        <section className="py-16 px-8 bg-xstars-graphite">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              {t('landing.plans_title')}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-8 relative ${
                    plan.popular ? 'border-xstars-red shadow-glow' : ''
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 
                                   bg-xstars-red px-4 py-1 rounded-full text-sm font-medium">
                      {t('landing.popular')}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-6">
                    {plan.price}
                    <span className="text-base font-normal text-gray-400">/mo</span>
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-300">
                        <span className="text-xstars-red">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-primary w-full">
                    {t('landing.choose_plan')}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              {t('landing.faq_title')}
            </motion.h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-8 bg-xstars-graphite">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('landing.final_cta_title')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('landing.final_cta_subtitle')}
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('landing.email_placeholder')}
                className="flex-1 px-4 py-4 bg-white/10 border border-white/20 
                         rounded-lg text-white placeholder-gray-400
                         focus:outline-none focus:border-xstars-red"
              />
              <button type="submit" className="btn-primary">
                {t('landing.get_started')}
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

// FAQ Accordion Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={false}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center"
      >
        <span className="text-lg font-medium">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 text-gray-400"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
