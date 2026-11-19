'use client'

import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { fmtNairaCompact } from '@/lib/format'

export function CommissionWalletsCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-3">Commission wallets (ΣRCS)</h3>
      <div className="space-y-3">
        {[
          { name: 'Reseller commissions', v: 5_642_000, pct: 31 },
          { name: 'Campaign fees accrued', v: 8_410_000, pct: 46 },
          { name: 'Spread revenue (today)', v: 4_188_000, pct: 23 },
        ].map((c) => (
          <div key={c.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{c.name}</span>
              <span className="tnum font-semibold">{fmtNairaCompact(c.v)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-purpleb rounded-full" initial={{ width: 0 }} animate={{ width: c.pct + '%' }} transition={{ duration: 0.9, ease: 'easeOut' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-dashed p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Wallet className="h-4 w-4 shrink-0" /> Reseller withdrawals unlock only after settlement runs.
      </div>
    </div>
  )
}
