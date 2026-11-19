'use client'

import { Ticket, Trophy } from 'lucide-react'
import { fmtCompact } from '@/lib/format'
import { TYPE_FACTOR } from '@/modules/admin/components/overview/type-factor'

import type { CustType } from '@/modules/admin/components/overview/OverviewPage'

interface RewardMixCardProps {
  ctype: CustType
  factor: number
}

export function RewardMixCard({ ctype, factor }: RewardMixCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-1">
        <Ticket className="h-4 w-4 text-purpleb" />
        <h3 className="font-display font-bold">Reward mix</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-2">What's live on the platform right now</p>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: 'Active rewards', value: String(Math.round(8 * TYPE_FACTOR[ctype]) || 8) },
          { label: 'Active coupons', value: fmtCompact(Math.round(52_600 * TYPE_FACTOR[ctype])) },
          { label: 'Raffle tickets live', value: fmtCompact(Math.round(352_600 * factor)) },
          { label: 'Gifts sent', value: fmtCompact(Math.round(12_360 * factor)) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="tnum font-display font-bold text-lg mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { name: 'Points programs', pct: 44, color: '#02DC4D' },
          { name: 'Coupons', pct: 28, color: '#7C5CBF' },
          { name: 'Raffles', pct: 18, color: '#E8A33D' },
          { name: 'Gifts', pct: 10, color: '#0EA5E9' },
        ].map((m) => (
          <div key={m.name} className="flex items-center gap-2.5">
            <span className="text-xs text-muted-foreground w-28 shrink-0">{m.name}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: m.pct + '%', background: m.color }} />
            </div>
            <span className="tnum text-xs font-semibold w-8 text-right">{m.pct}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground flex gap-2">
        <Trophy className="h-4 w-4 shrink-0 text-amber-500" /> October Mega Draw closes Oct 31 — 214,600 tickets issued, prize pool ₦5M + 10 Keke Napep.
      </div>
    </div>
  )
}
