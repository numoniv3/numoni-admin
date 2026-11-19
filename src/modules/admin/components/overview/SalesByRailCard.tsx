'use client'

import { useMemo } from 'react'
import {
  Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'
import type { RailSales } from '@/lib/api/numoni'

interface SalesByRailCardProps {
  factor: number
  railSales: RailSales[]
}

export function SalesByRailCard({ factor, railSales }: SalesByRailCardProps) {
  const rails = useMemo(() => railSales.map((r) => ({ ...r, value: +(r.value * factor).toFixed(1) })), [railSales, factor])

  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Sales by rail</h3>
      <p className="text-xs text-muted-foreground mb-2">₦ share per payment rail</p>
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie data={rails} dataKey="value" nameKey="rail" innerRadius={48} outerRadius={70} paddingAngle={3} strokeWidth={0} isAnimationActive={false}>
            {rails.map((r) => (
              <Cell key={r.rail} fill={r.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₦${v}M`]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {rails.map((r) => (
          <div key={r.rail} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: r.color }} />
            <span className="text-muted-foreground truncate">{r.rail}</span>
            <span className="ml-auto tnum font-semibold">₦{r.value}M</span>
          </div>
        ))}
      </div>
    </div>
  )
}
