'use client'

import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

export function ContingentLiabilityCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Contingent liability</h3>
      <p className="text-xs text-muted-foreground mb-4">Outstanding points vs treasury cash</p>
      <div className="flex flex-col items-center py-2">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none" stroke="#02DC4D" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.78) }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold tnum">78%</span>
            <span className="text-[10px] text-muted-foreground">redeemed</span>
          </div>
        </div>
        <div className="mt-3 w-full space-y-2 text-xs">
          <div>
            <div className="flex justify-between mb-1"><span className="text-muted-foreground">Treasury coverage</span><span className="tnum font-semibold text-brand">104.2%</span></div>
            <Progress value={100} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between mb-1"><span className="text-muted-foreground">Dormant points (90d+)</span><span className="tnum font-semibold">6.1%</span></div>
            <Progress value={6.1} className="h-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
