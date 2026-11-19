'use client'

import { Filter, Play, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EXPLORER_AGE_BANDS as AGE_BANDS, type ExplorerCustomer } from '@/lib/api/numoni/types/admin'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterRow, FieldId } from '@/modules/admin/components/data-explorer/DataExplorerPage'
import { nextFilterId } from '@/modules/admin/components/data-explorer/filter-seq'
import { FIELDS } from '@/modules/admin/components/data-explorer/fields'

const CAT_OPS = [{ id: 'is', label: 'is' }, { id: 'not', label: 'is not' }]

const NUM_OPS = [{ id: 'gte', label: '≥' }, { id: 'lte', label: '≤' }]

interface ExplorerFilterBuilderProps {
  filters: FilterRow[]
  results: ExplorerCustomer[]
  setFilters: Dispatch<SetStateAction<FilterRow[]>>
  setRan: Dispatch<SetStateAction<number>>
}

export function ExplorerFilterBuilder({ filters, results, setFilters, setRan }: ExplorerFilterBuilderProps) {
  const update = (id: number, patch: Partial<FilterRow>) =>
    setFilters((fs) => fs.map((f) => {
      if (f.id !== id) return f
      const next = { ...f, ...patch }
      // reset op/value when the field type changes
      if (patch.field) {
        const def = FIELDS.find((x) => x.id === patch.field)!
        next.op = def.type === 'cat' ? 'is' : 'gte'
        next.value = def.type === 'cat' ? def.options![0] : ''
      }
      return next
    }))
  const describe = (f: FilterRow) => {
    const def = FIELDS.find((x) => x.id === f.field)!
    return `${def.label} ${f.op === 'gte' ? '≥' : f.op === 'lte' ? '≤' : f.op} ${f.value || '…'}`
  }

  return (
    <div className="card-surface p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold flex items-center gap-2"><Filter className="h-4 w-4 text-brand" /> Query builder</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFilters((fs) => [...fs, { id: nextFilterId(), field: 'age', op: 'is', value: AGE_BANDS[0] }])}>
            <Plus className="h-3.5 w-3.5" /> Add filter
          </Button>
          <Button size="sm" className="gap-1.5 bg-brand text-black hover:bg-brand/90 font-bold" onClick={() => { setRan((r) => r + 1); toast.success(`Query ran · ${results.length} customers match`) }}>
            <Play className="h-3.5 w-3.5" /> Run query
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filters.map((f, i) => {
          const def = FIELDS.find((x) => x.id === f.field)!
          const ops = def.type === 'cat' ? CAT_OPS : NUM_OPS
          return (
            <div key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground w-10 shrink-0">{i === 0 ? 'Where' : 'And'}</span>
              <Select value={f.field} onValueChange={(v) => update(f.id, { field: v as FieldId })}>
                <SelectTrigger className="w-[170px] h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FIELDS.map((x) => <SelectItem key={x.id} value={x.id}>{x.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={f.op} onValueChange={(v) => update(f.id, { op: v })}>
                <SelectTrigger className="w-[90px] h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ops.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {def.type === 'cat' ? (
                <Select value={f.value} onValueChange={(v) => update(f.id, { value: v })}>
                  <SelectTrigger className="w-[190px] h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {def.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={f.value} onChange={(e) => update(f.id, { value: e.target.value.replace(/[^\d]/g, '') })} inputMode="numeric" placeholder="0" className="w-[140px] h-9 text-xs tnum" />
              )}
              <button onClick={() => setFilters((fs) => fs.filter((x) => x.id !== f.id))} className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" disabled={filters.length === 1}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
        <span className="text-[11px] text-muted-foreground">Active query:</span>
        {filters.map((f) => <Pill key={f.id} tone="neutral">{describe(f)}</Pill>)}
        <button onClick={() => toast.success('Segment saved', { description: 'Marketing can now target this segment in campaigns' })} className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand">
          <Save className="h-3.5 w-3.5" /> Save as segment
        </button>
      </div>
    </div>
  )
}
