'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** The Gateway's message under a sign-in form, or nothing. */
export function FormError({ error, className }: { error: string | null; className?: string }) {
  if (!error) return null
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className={cn('text-xs text-red-500', className)}>
      {error}
    </motion.p>
  )
}
