'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Pill } from '@/components/ui/kit'
import { fmtCompact } from '@/lib/format'
import { rnd } from '@/modules/admin/lib/heat-grid'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'

interface RewardsIssuedCardProps {
  factor: number
}

export function RewardsIssuedCard({ factor }: RewardsIssuedCardProps) {
  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold">Rewards issued vs redeemed</h3>
          <p className="text-xs text-muted-foreground">Points, coupons, gifts & raffle tickets · daily</p>
        </div>
        <div className="flex gap-2">
          <Pill tone="purple">{fmtCompact(Math.round(186_800 * factor))} coupons issued</Pill>
          <Pill tone="green">{fmtCompact(Math.round(72_800 * factor))} redeemed · 39%</Pill>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
          d,
          issued: Math.round(26_400 * (0.6 + rnd(i + 71) * 0.8) * factor),
          redeemed: Math.round(10_900 * (0.5 + rnd(i + 91) * 0.9 + i * 0.06) * factor),
        }))} key={'rwd' + factor}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={44} tickFormatter={(v: number) => fmtCompact(v)} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [fmtCompact(v), name === 'issued' ? 'Issued' : 'Redeemed']} />
          <Bar dataKey="issued" fill="#7C5CBF" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
          <Bar dataKey="redeemed" fill="#02DC4D" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs mt-2">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#7C5CBF' }} /> Issued</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Redeemed</span>
        <span className="ml-auto text-muted-foreground">unredeemed value sits in PPL until expiry sweep</span>
      </div>
    </div>
  )
}
