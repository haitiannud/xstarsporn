// src/app/(auth)/signin/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FcGoogle, FcFilm } from 'react-icons/fc'
import toast from 'react-hot-toast'

import { authService } from '@/services/auth'
import { useLocalization } from '@/hooks/useLocalization'
import { useAuth } from '@/hooks/useAuth'
import SEOHead from '@/components/shared/SEOHead'
import SkeletonLoader from '@/components/shared/SkeletonLoader'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type SignInForm = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLocalization()
  const { signIn, isLoading } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [backgrounds, setBackgrounds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      rememberMe: false,
    },
  })

  // Load dynamic backgrounds
  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        const content = await import('@/services/api').then(m => m.api.getFeaturedBackgrounds())
        setBackgrounds(content)
      } catch {
        setBackgrounds(['/assets/auth-bg-1.jpg', '/assets/auth-bg-2.jpg', '/assets/auth-bg-3.jpg'])
      }
    }
    loadBackgrounds()
  }, [])

  // Auto-rotate backgrounds
  useEffect(() => {
    if (backgrounds.length === 0) return
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % backgrounds.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [backgrounds])

  const onSubmit = async (data: SignInForm) => {
    setError(null)
    try {
      await signIn(data.email, data.password)
      
      // Check subscription status
      const subscription = await import('@/services/api').then(m => m.api.getSubscriptionStatus())
      
      if (!subscription.plan) {
        router.push('/plans')
      } else if (!subscription.hasProfile) {
        router.push('/create-profile')
      } else {
        router.push('/profile-selection')
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError(t('auth.no_account'))
      } else if (err.code === 'auth/wrong-password') {
        setError(t('auth.wrong_password'))
      } else if (err.code === 'auth/too-many-requests') {
        setError(t('auth.too_many_attempts'))
      } else {
        setError(t('auth.signin_error'))
      }
    }
  }

  return (
    <>
      <SEOHead title={t('auth.signin_title')} noIndex />
      
      <div className="min-h-screen bg-black flex">
        {/* Left - Background Carousel */}
        <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {backgrounds[heroIndex] && (
                <Image
                  src={backgrounds[heroIndex]}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 cinematic-overlay" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Content */}
          <div className="absolute bottom-16 left-16 right-16 z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              {t('auth.welcome_back')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-white/60"
            >
              {t('auth.signin_description')}
            </motion.p>
          </div>
        </div>

        {/* Right - Sign In Form */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="text-center mb-12">
              <FcFilm className="w-16 h-16 mx-auto mb-4 text-xstars-red" />
              <h1 className="text-3xl font-bold">X Stars</h1>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 
                           flex items-center gap-3 text-red-400"
                >
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 
                             rounded-lg text-white placeholder-gray-500
                             focus:outline-none focus:border-xstars-red focus:bg-white/10
                             transition-all duration-300"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 
                             rounded-lg text-white placeholder-gray-500
                             focus:outline-none focus:border-xstars-red focus:bg-white/10
                             transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-xstars-red 
                             focus:ring-xstars-red focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">{t('auth.remember_me')}</span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-xstars-red hover:underline"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50"
              >
                {isLoading ? t('auth.signing_in') : t('auth.sign_in')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-black text-sm text-gray-500">
                  {t('auth.or_continue_with')}
                </span>
              </div>
            </div>

            {/* Social Sign In */}
            <button className="w-full py-4 glass rounded-lg flex items-center justify-center gap-3
                             hover:bg-white/10 transition-all duration-300">
              <FcGoogle className="w-5 h-5" />
              <span>{t('auth.signin_with_google')}</span>
            </button>

            {/* Create Account Link */}
            <p className="text-center mt-8 text-gray-400">
              {t('auth.no_account')}{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-xstars-red hover:underline font-medium"
              >
                {t('auth.create_account')}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
