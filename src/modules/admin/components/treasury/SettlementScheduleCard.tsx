'use client'

import { motion } from 'framer-motion'
import { Pill } from '@/components/ui/kit'
import { fmtNaira } from '@/lib/format'
import type { Merchant } from '@/lib/api/numoni'

interface SettlementScheduleCardProps {
  merchants: Merchant[]
}

export function SettlementScheduleCard({ merchants }: SettlementScheduleCardProps) {
  const settlementRows = merchants.slice(0, 8).map((m, i) => ({
    id: `SET-0927-${String(i + 1).padStart(3, '0')}`,
    merchant: m.name,
    amount: Math.round(m.gmv * 0.0084),
    state: i < 3 ? 'Paid' : i < 6 ? 'Processing' : 'Queued',
  }))

  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold">Today's settlement schedule</h3>
        <Pill tone="orange">Cut-off 24:00 · T+1 payouts</Pill>
      </div>
      <div className="space-y-2">
        {settlementRows.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between rounded-xl border p-3 text-sm"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{s.merchant}</div>
              <div className="text-xs text-muted-foreground tnum">{s.id}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="tnum font-semibold">{fmtNaira(s.amount, 0)}</span>
              <Pill tone={s.state === 'Paid' ? 'green' : s.state === 'Processing' ? 'orange' : 'neutral'}>{s.state}</Pill>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
