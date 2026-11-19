'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { ClientBoundary } from '@/components/layout/client-boundary'
import { Logo } from '@/components/layout/logo'
import { PageLoader } from '@/components/layout/page-loader'

/**
 * Renders children inside an iPhone-style frame on desktop;
 * full-screen on real mobile (frame chrome hidden under 768px).
 */
export function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="min-h-dvh bg-background md:flex md:flex-col md:items-center md:justify-center md:py-8 grid-bg">
      {/* desktop header above frame */}
      <div className="hidden md:flex w-full max-w-[420px] items-center justify-between pb-4">
        <Logo className="text-lg" />
        <span className="label-caps">{label}</span>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="relative w-full md:w-[400px] md:rounded-[3rem] md:border-[10px] md:border-zinc-800 md:shadow-[0_40px_120px_-20px_rgb(2_220_77/0.15),0_25px_60px_-15px_rgb(0_0_0/0.5)] overflow-hidden bg-background md:h-[820px] h-dvh flex flex-col"
      >
        {/* notch */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 h-6 w-28 rounded-full bg-zinc-800 z-50" />
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <ClientBoundary fallback={<PageLoader className="flex-1 min-h-0" />}>{children}</ClientBoundary>
        </div>
      </motion.div>

      <div className="hidden md:flex items-center gap-2 pt-5 text-xs text-muted-foreground">
        <Logo className="text-sm" dark /> <span>· interactive demo — no real money moves</span>
      </div>
    </div>
  )
}
