'use client'

import { Input } from '@/components/ui/input'
import type { Dispatch, SetStateAction } from 'react'
import type { Period, CustType } from '@/modules/admin/components/overview/OverviewPage'

interface OverviewFiltersProps {
  ctype: CustType
  from: string
  period: Period
  setFrom: Dispatch<SetStateAction<string>>
  setPeriod: Dispatch<SetStateAction<Period>>
  setTo: Dispatch<SetStateAction<string>>
  to: string
}

export function OverviewFilters({ ctype, from, period, setFrom, setPeriod, setTo, to }: OverviewFiltersProps) {
  const periodLabel = period === 'today' ? 'today' : period === 'week' ? 'this week' : period === 'month' ? 'this month' : 'custom range'

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <div className="flex gap-1 rounded-full border p-1">
        {(['today', 'week', 'month', 'custom'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-4 h-8 text-xs font-bold capitalize transition-colors ${period === p ? 'bg-brand text-black' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'Custom'}
          </button>
        ))}
      </div>
      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-[150px] text-xs" />
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 w-[150px] text-xs" />
        </div>
      )}
      <span className="text-[11px] text-muted-foreground ml-auto">
        Showing <span className="font-bold text-foreground">{ctype === 'all' ? 'all types' : ctype}</span> · {periodLabel}
      </span>
    </div>
  )
}
