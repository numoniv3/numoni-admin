'use client'

import { useMemo } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { Pill } from '@/components/ui/kit'
import { fmtCompact } from '@/lib/format'
import { rnd } from '@/modules/admin/lib/heat-grid'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'

interface SalesTrendCardProps {
  factor: number
}

export function SalesTrendCard({ factor }: SalesTrendCardProps) {
  const trend = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((d, i) => ({
      d,
      sales: +(138 * (0.72 + rnd(i + 3) * 0.55 + i * 0.05) * factor).toFixed(1),
      txns: Math.round(41200 * (0.7 + rnd(i + 13) * 0.6) * factor),
    }))
  }, [factor])

  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold">Sales trend</h3>
          <p className="text-xs text-muted-foreground">₦ millions · all rails combined</p>
        </div>
        <Pill tone="green">+12.4% vs prior period</Pill>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={trend} key={String(factor)}>
          <defs>
            <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#02DC4D" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#02DC4D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => (name === 'sales' ? [`₦${v}M`, 'Sales'] : [fmtCompact(v), 'Transactions'])} />
          <Area type="monotone" dataKey="sales" stroke="#02DC4D" strokeWidth={2.5} fill="url(#gSales)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
