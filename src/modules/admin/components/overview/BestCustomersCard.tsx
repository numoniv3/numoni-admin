'use client'

import { useMemo } from 'react'
import { Crown } from 'lucide-react'
import { fmtNairaCompact } from '@/lib/format'
import { useAdminCustomersQuery } from '@/modules/admin/api/useAdminQueries'

export function BestCustomersCard() {
  const { data: customers } = useAdminCustomersQuery()
  const bestCustomers = useMemo(() => [...customers].sort((a, b) => b.lifetime - a.lifetime).slice(0, 6), [customers])

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold">Best customers</h3>
        <Crown className="h-4 w-4 text-amber-500" />
      </div>
      <div className="space-y-2.5">
        {bestCustomers.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="tnum text-xs text-muted-foreground w-4">{i + 1}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand text-[11px] font-bold shrink-0">
              {c.alias.split(' ').map((w) => w[0]).join('')}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{c.alias} <span className="text-[10px] text-muted-foreground font-normal">· {c.location}</span></div>
              <div className="text-[10px] text-muted-foreground">{c.segment} · {c.brandWallets} brand wallets · active {c.lastActive}</div>
            </div>
            <span className="tnum text-sm font-bold shrink-0">{fmtNairaCompact(c.lifetime)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
