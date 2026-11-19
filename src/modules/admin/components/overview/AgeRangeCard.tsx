'use client'

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'
import type { AgeRangeShare } from '@/lib/api/numoni'

interface AgeRangeCardProps {
  ageRanges: AgeRangeShare[]
}

export function AgeRangeCard({ ageRanges }: AgeRangeCardProps) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Age-range breakdown</h3>
      <p className="text-xs text-muted-foreground mb-3">Share of active customers</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={ageRanges} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="range" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v + '%', 'Customers']} />
          <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={18} isAnimationActive={false}>
            {ageRanges.map((a, i) => (
              <Cell key={a.range} fill={['#02DC4D', '#0EA5E9', '#7C5CBF', '#E8A33D', '#64748B'][i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-muted-foreground mt-2">25–34 is your power band — 38% of actives, highest campaign response.</p>
    </div>
  )
}
