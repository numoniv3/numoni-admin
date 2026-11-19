'use client'

import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import type { Dispatch, SetStateAction } from 'react'

interface ConversionRatesCardProps {
  sellRate: number
  setSellRate: Dispatch<SetStateAction<number>>
}

export function ConversionRatesCard({ sellRate, setSellRate }: ConversionRatesCardProps) {
  const [buyRate] = useState(1.0)
  const spread = ((buyRate - sellRate) / buyRate) * 100

  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="h-4 w-4 text-brand" />
        <h3 className="font-display font-bold">Point conversion</h3>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="label-caps mb-1">Buy rate (customer funds)</div>
          <div className="font-display text-2xl font-bold tnum">₦1 → 1 pt</div>
          <div className="text-xs text-muted-foreground mt-1">Fixed 1:1 · plus V1 reward on top</div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="label-caps">Sell rate (merchant settlement)</span>
            <span className="tnum text-sm font-bold text-brand">1 pt → ₦{sellRate.toFixed(3)}</span>
          </div>
          <Slider value={[sellRate * 1000]} min={900} max={945} step={1} onValueChange={([v]) => setSellRate(v / 1000)} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tnum"><span>0.900</span><span>0.945</span></div>
        </div>
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 flex items-center justify-between">
          <span className="text-sm font-medium">nuMoni spread</span>
          <span className="font-display text-xl font-bold text-brand tnum">{spread.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
