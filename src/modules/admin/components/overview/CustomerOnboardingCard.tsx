'use client'

import { useMemo } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { UserPlus } from 'lucide-react'
import { fmtCompact } from '@/lib/format'
import { rnd } from '@/modules/admin/lib/heat-grid'
import { tooltipStyle } from '@/modules/admin/components/overview/tooltip-style'

interface CustomerOnboardingCardProps {
  factor: number
}

export function CustomerOnboardingCard({ factor }: CustomerOnboardingCardProps) {
  const onboarding = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((d, i) => ({ d, signups: Math.round(1_240 * (0.6 + rnd(i + 31) * 0.8 + i * 0.06) * factor) }))
  }, [factor])

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display font-bold">Customer onboarding</h3>
          <p className="text-xs text-muted-foreground">New wallets created per day</p>
        </div>
        <UserPlus className="h-4 w-4 text-brand" />
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={onboarding} key={'ob' + factor}>
          <defs>
            <linearGradient id="gOnb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtCompact(v), 'Sign-ups']} />
          <Area type="monotone" dataKey="signups" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#gOnb)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
