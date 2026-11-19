'use client'

import { Percent } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import type { Dispatch, SetStateAction } from 'react'

interface RewardTiersCardProps {
  setV1Tier: Dispatch<SetStateAction<number>>
  v1Tier: number
}

export function RewardTiersCard({ setV1Tier, v1Tier }: RewardTiersCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Percent className="h-4 w-4 text-brand" />
        <h3 className="font-display font-bold">V1 Global Reward tiers</h3>
      </div>
      <div className="rounded-xl bg-muted/50 p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="label-caps">Headline reward</span>
          <span className="tnum text-sm font-bold text-brand">{v1Tier}% on funding ≥ ₦10,000</span>
        </div>
        <Slider value={[v1Tier * 10]} min={30} max={70} step={5} onValueChange={([v]) => setV1Tier(v / 10)} />
      </div>
      <div className="space-y-2 text-sm">
        {[
          { band: '₦1,000 – ₦4,999', reward: (v1Tier * 0.4).toFixed(1) + '%' },
          { band: '₦5,000 – ₦9,999', reward: (v1Tier * 0.7).toFixed(1) + '%' },
          { band: '₦10,000+', reward: v1Tier.toFixed(1) + '%' },
        ].map((b) => (
          <div key={b.band} className="flex justify-between rounded-lg border p-3">
            <span className="tnum text-muted-foreground">{b.band}</span>
            <span className="tnum font-semibold text-brand">{b.reward}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Prorated bands below ₦10k keep the headline 5% honest.</p>
    </div>
  )
}
