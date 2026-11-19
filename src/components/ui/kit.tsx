'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CountUp } from '@/components/ui/count-up'

export function KpiCard({
  label,
  value,
  numeric,
  format,
  delta,
  icon: Icon,
  tint = 'brand',
  sub,
}: {
  label: string
  value?: string
  numeric?: number
  format?: (n: number) => string
  delta?: number
  icon: LucideIcon
  tint?: 'brand' | 'orange' | 'purple' | 'sky'
  sub?: string
}) {
  const tints: Record<string, string> = {
    brand: 'text-brand bg-brand/10',
    orange: 'text-orangeb bg-orangeb/10',
    purple: 'text-purpleb bg-purpleb/10',
    sky: 'text-sky-500 bg-sky-500/10',
  }
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card-surface p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="label-caps">{label}</span>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tints[tint])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-2xl font-bold tnum tracking-tight">
          {numeric !== undefined ? <CountUp value={numeric} format={format} /> : value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              'mb-0.5 flex items-center gap-0.5 text-xs font-semibold',
              delta >= 0 ? 'text-brand' : 'text-red-500',
            )}
          >
            {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {sub && <span className="text-xs text-muted-foreground -mt-1">{sub}</span>}
    </motion.div>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'green' | 'red' | 'orange' | 'purple' | 'sky' | 'neutral' }) {
  const tones: Record<string, string> = {
    green: 'bg-brand/10 text-branddeep dark:text-brand border-brand/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    orange: 'bg-orangeb/10 text-orangeb border-orangeb/20',
    purple: 'bg-purpleb/10 text-purpleb border-purpleb/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    neutral: 'bg-muted text-muted-foreground border-border',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap', tones[tone])}>
      {children}
    </span>
  )
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">{sub}</p>
    </div>
  )
}

export const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  },
}
