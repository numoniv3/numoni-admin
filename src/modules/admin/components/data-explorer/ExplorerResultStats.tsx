'use client'

import { DatabaseZap, Users } from 'lucide-react'
import { fmtNaira, fmtNairaCompact, fmtNum } from '@/lib/format'
import { type ExplorerCustomer } from '@/lib/api/numoni/types/admin'

interface ExplorerResultStatsProps {
  results: ExplorerCustomer[]
  totalValue: number
}

export function ExplorerResultStats({ results, totalValue }: ExplorerResultStatsProps) {
  const avgLifetime = results.length ? totalValue / results.length : 0
  const avgVisits = results.length ? results.reduce((s, c) => s + c.visits, 0) / results.length : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {[
        { label: 'Matching customers', value: fmtNum(results.length), icon: Users },
        { label: 'Combined lifetime value', value: fmtNairaCompact(totalValue), icon: DatabaseZap },
        { label: 'Avg lifetime spend', value: fmtNaira(Math.round(avgLifetime), 0), icon: DatabaseZap },
        { label: 'Avg visits (30d)', value: avgVisits.toFixed(1) + '×', icon: DatabaseZap },
      ].map((k) => (
        <div key={k.label} className="card-surface p-4">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{k.label}</div>
          <div className="tnum font-display font-bold text-xl">{k.value}</div>
        </div>
      ))}
    </div>
  )
}
