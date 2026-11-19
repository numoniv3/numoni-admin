'use client'

import { DatabaseZap } from 'lucide-react'
import { toast } from 'sonner'
import { nextFilterId } from '@/modules/admin/components/data-explorer/filter-seq'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterRow } from '@/modules/admin/components/data-explorer/DataExplorerPage'

const PRESETS: { label: string; filters: Omit<FilterRow, 'id'>[] }[] = [
  { label: 'Lagos power spenders', filters: [{ field: 'location', op: 'is', value: 'Lekki, Lagos' }, { field: 'segment', op: 'is', value: 'Power Spender' }] },
  { label: 'Win-back targets', filters: [{ field: 'segment', op: 'is', value: 'Dormant 30d+' }, { field: 'lifetime', op: 'gte', value: '50000' }] },
  { label: 'Fintech 25–34', filters: [{ field: 'source', op: 'is', value: 'Fintech' }, { field: 'age', op: 'is', value: '25–34' }] },
  { label: 'Card holders, high KYC', filters: [{ field: 'cards', op: 'gte', value: '1' }, { field: 'kyc', op: 'is', value: '3' }] },
]

interface ExplorerPresetsProps {
  setFilters: Dispatch<SetStateAction<FilterRow[]>>
}

export function ExplorerPresets({ setFilters }: ExplorerPresetsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><DatabaseZap className="h-3.5 w-3.5" /> Presets</span>
      {PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => {
            setFilters(p.filters.map((f, i) => ({ ...f, id: nextFilterId() + i })))
            toast.success(`Preset applied`, { description: p.label })
          }}
          className="rounded-full border px-3.5 h-8 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-brand/50 transition-colors"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
