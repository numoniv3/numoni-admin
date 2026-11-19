'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CreditCard } from 'lucide-react'
import { fmtCompact, fmtNaira } from '@/lib/format'

import type { CustType } from '@/modules/admin/components/overview/OverviewPage'
import { TYPE_FACTOR } from '@/modules/admin/components/overview/type-factor'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'
import type { BrandCardCount } from '@/lib/api/numoni'

interface CardAnalyticsCardProps {
  cardsByBrand: BrandCardCount[]
  ctype: CustType
}

export function CardAnalyticsCard({ cardsByBrand, ctype }: CardAnalyticsCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold">Card analytics</h3>
          <p className="text-xs text-muted-foreground">Physical & virtual reward cards</p>
        </div>
        <CreditCard className="h-4 w-4 text-brand" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: 'Cards issued', value: fmtCompact(Math.round(96_400 * TYPE_FACTOR[ctype])) },
          { label: 'Active this period', value: fmtCompact(Math.round(84_210 * TYPE_FACTOR[ctype])) },
          { label: 'Frozen', value: fmtCompact(Math.round(1_240 * TYPE_FACTOR[ctype])) },
          { label: 'Avg spend / card', value: fmtNaira(12_800, 0) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="tnum font-display font-bold text-lg mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={cardsByBrand.map((b) => ({ ...b, cards: Math.round(b.cards * TYPE_FACTOR[ctype]) }))} key={'cards' + ctype}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="brand" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtCompact(v), 'Cards']} />
          <Bar dataKey="cards" fill="#7C5CBF" radius={[6, 6, 0, 0]} maxBarSize={30} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
