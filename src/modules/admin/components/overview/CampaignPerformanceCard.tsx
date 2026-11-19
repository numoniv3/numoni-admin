'use client'

import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Pill } from '@/components/ui/kit'
import { fmtNairaCompact } from '@/lib/format'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'
import type { AttributionPoint } from '@/lib/api/numoni'

interface CampaignPerformanceCardProps {
  attributionSeries: AttributionPoint[]
  factor: number
}

export function CampaignPerformanceCard({ attributionSeries, factor }: CampaignPerformanceCardProps) {
  const campaignTrend = useMemo(
    () => attributionSeries.map((w) => ({ ...w, spend: +(w.spend * factor).toFixed(1), sales: +(w.sales * factor).toFixed(1) })),
    [attributionSeries, factor],
  )
  const totalSpend = 28_900_000 * factor
  const conversion = 6.8

  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold">Campaign performance</h3>
          <p className="text-xs text-muted-foreground">Reward spend vs attributed sales · weekly</p>
        </div>
        <div className="flex gap-2">
          <Pill tone="green">Conversion {conversion}%</Pill>
          <Pill tone="orange">Total spend {fmtNairaCompact(totalSpend)}</Pill>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={campaignTrend} key={'cmp' + factor}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`₦${v}M`, name === 'spend' ? 'Reward spend' : 'Attributed sales']} />
          <Line type="monotone" dataKey="sales" stroke="#02DC4D" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="spend" stroke="#E8A33D" strokeWidth={2.5} dot={false} strokeDasharray="6 4" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs mt-2">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Attributed sales</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Reward spend</span>
        <span className="ml-auto text-muted-foreground">ROI ≈ <span className="font-bold text-foreground">11.6×</span></span>
      </div>
    </div>
  )
}
