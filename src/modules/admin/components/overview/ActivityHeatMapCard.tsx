'use client'

import { useState } from 'react'
import { type HeatGran, type HeatMetric, METRIC_LABEL } from '@/modules/admin/lib/heat-grid'
import { HeatGrid } from '@/modules/admin/components/overview/HeatGrid'

interface ActivityHeatMapCardProps {
  factor: number
}

export function ActivityHeatMapCard({ factor }: ActivityHeatMapCardProps) {
  const [heatGran, setHeatGran] = useState<HeatGran>('week')
  const [heatMetric, setHeatMetric] = useState<HeatMetric>('visits')

  return (
    <div className="card-surface p-5 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold">Activity heat map</h3>
          <p className="text-xs text-muted-foreground">When customers actually show up — plan campaigns around the peaks</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 rounded-full border p-1">
            {(['day', 'week', 'month'] as const).map((g) => (
              <button key={g} onClick={() => setHeatGran(g)}
                className={`rounded-full px-3.5 h-7 text-[11px] font-bold capitalize transition-colors ${heatGran === g ? 'bg-brand text-black' : 'text-muted-foreground'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-full border p-1">
            {(['visits', 'cards', 'patronage'] as const).map((m) => (
              <button key={m} onClick={() => setHeatMetric(m)}
                className={`rounded-full px-3.5 h-7 text-[11px] font-bold transition-colors ${heatMetric === m ? 'bg-brand text-black' : 'text-muted-foreground'}`}>
                {METRIC_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <HeatGrid gran={heatGran} metric={heatMetric} factor={factor} />
    </div>
  )
}
