'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'

/** The centred card every dashboard sign-in screen sits in. */
export function AuthFrame({ label, stepKey, children }: { label: string; stepKey: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background grid-bg flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Logo className="text-2xl" />
          <span className="label-caps">{label}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28 }}
            className="card-surface p-7"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-5">
          <span />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
