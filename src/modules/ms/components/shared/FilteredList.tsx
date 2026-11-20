'use client'

import { useDeferredValue, useState, type ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pager, pageInfo } from './bits'
import { DataView, listOf, type Row } from './DataView'
import { QueryView } from './QueryView'

export interface Filter {
  key: string
  label: string
  kind?: 'text' | 'select' | 'date'
  options?: string[]
}

const ANY = '__any__'

/** A list hook taking the filter values plus `page` / `limit`. */
export type UseList = (params: Record<string, string | number | undefined>) => UseQueryResult<unknown>

interface FilteredListProps {
  filters: Filter[]
  /** Builds the query from the current filter values plus `page` / `limit`. */
  useList: UseList
  columns?: string[]
  rowActions?: (row: Row) => ReactNode
  onRowClick?: (row: Row) => void
  /** Rendered above the table with the full payload (e.g. totals). */
  header?: (data: unknown) => ReactNode
  limit?: number
  empty?: string
}

/** Filter bar + paginated table for a list endpoint. */
export function FilteredList({ filters, useList, columns, rowActions, onRowClick, header, limit = 20, empty }: FilteredListProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const deferred = useDeferredValue(values)
  const params = Object.fromEntries(Object.entries(deferred).filter(([, v]) => v).map(([k, v]) => [k, filters.find((f) => f.key === k)?.kind === 'date' ? new Date(v).toISOString() : v]))
  const q = useList({ ...params, page, limit })
  const set = (k: string, v: string) => { setValues((s) => ({ ...s, [k]: v === ANY ? '' : v })); setPage(1) }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (f.kind === 'select' ? (
          <Select key={f.key} value={values[f.key] || ANY} onValueChange={(v) => set(f.key, v)}>
            <SelectTrigger className="w-44"><SelectValue placeholder={f.label} /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>{f.label}: any</SelectItem>
              {(f.options ?? []).map((o) => <SelectItem key={o} value={o}>{o.replace(/_/g, ' ').toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <Input key={f.key} type={f.kind === 'date' ? 'date' : 'text'} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} placeholder={f.label} className="w-44" title={f.label} />
        )))}
      </div>
      <QueryView query={q}>
        {(d) => (
          <>
            {header?.(d)}
            <DataView data={listOf(d) ?? []} columns={columns} rowActions={rowActions} onRowClick={onRowClick} empty={empty} maxColumns={8} />
            <Pager page={page} setPage={setPage} {...pageInfo(d, page, limit)} />
          </>
        )}
      </QueryView>
    </div>
  )
}
