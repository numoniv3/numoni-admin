'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, CreditCard, Landmark, Lock } from 'lucide-react'
import { KpiCard, stagger } from '@/components/ui/kit'
import type { CardKpiSummaryDto } from '@/lib/api/numoni/types/card'
import { fmtNairaCompact } from '@/lib/format'

/** `GET /card/cards` → `summary`. */
export function CardKpis({ summary: s }: { summary: CardKpiSummaryDto }) {
  const int = (n: number) => String(Math.round(n))
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <motion.div variants={stagger.item}><KpiCard label="Cards minted" numeric={s.totalMinted} format={int} icon={CreditCard} /></motion.div>
      <motion.div variants={stagger.item}><KpiCard label="Active cards" numeric={s.totalActive} format={int} icon={BadgeCheck} tint="sky" /></motion.div>
      <motion.div variants={stagger.item}><KpiCard label="Frozen" numeric={s.totalFrozen} format={int} icon={Lock} tint="purple" sub={`${s.totalUnlocked} unlocked right now`} /></motion.div>
      <motion.div variants={stagger.item}><KpiCard label="Reward balance on cards" numeric={s.totalRewardBalance} format={fmtNairaCompact} icon={Landmark} tint="orange" /></motion.div>
    </motion.div>
  )
}
