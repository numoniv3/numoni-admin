'use client'

import {
  Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { Megaphone } from 'lucide-react'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'
import type { CampaignMixSlice } from '@/lib/api/numoni'

interface CampaignMixCardProps {
  campaignMix: CampaignMixSlice[]
}

export function CampaignMixCard({ campaignMix }: CampaignMixCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-1">
        <Megaphone className="h-4 w-4 text-purpleb" />
        <h3 className="font-display font-bold">Campaign mix</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Live campaigns by goal</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={campaignMix} dataKey="value" nameKey="name" innerRadius={44} outerRadius={66} paddingAngle={3} strokeWidth={0} isAnimationActive={false}>
            {campaignMix.map((c) => (
              <Cell key={c.name} fill={c.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v + '%']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-1">
        {campaignMix.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="text-muted-foreground">{c.name}</span>
            <span className="ml-auto tnum font-semibold">{c.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
