'use client'

import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'

interface LiveExampleCardProps {
  sellRate: number
  v1Tier: number
}

export function LiveExampleCard({ sellRate, v1Tier }: LiveExampleCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-4 w-4 text-brand" />
        <h3 className="font-display font-bold">Live example</h3>
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-xl border p-3.5">
          <div className="text-muted-foreground text-xs mb-1">Customer funds</div>
          <div className="font-display text-xl font-bold tnum">₦100,000</div>
        </div>
        <div className="flex justify-center"><motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-brand">↓</motion.span></div>
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-3.5">
          <div className="text-muted-foreground text-xs mb-1">Wallet credited</div>
          <div className="font-display text-xl font-bold tnum text-brand">{(100000 * (1 + v1Tier / 100)).toLocaleString()} pt</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">includes {v1Tier}% V1 reward</div>
        </div>
        <div className="rounded-xl border p-3.5 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">Merchant settles at ₦{sellRate.toFixed(3)}/pt</span><span className="tnum font-semibold">₦{(100000 * sellRate).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">nuMoni keeps</span><span className="tnum font-semibold text-brand">₦{(100000 * (1 - sellRate)).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  )
}
