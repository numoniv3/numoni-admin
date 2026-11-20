'use client'

import type { ReactNode } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/kit'
import { Inbox } from 'lucide-react'

/*
 * Renders any API payload: a list as a table (columns from its keys), an
 * object as label/value rows. Used where the spec leaves the response
 * untyped, so screens show what the service actually returns.
 */

export type Row = Record<string, unknown>
const isObj = (v: unknown): v is Row => !!v && typeof v === 'object' && !Array.isArray(v)
const LIST_KEYS = ['items', 'data', 'results', 'rows', 'docs', 'records', 'list']

/** The list inside a payload: a bare array, a known list key, or the first array of objects. */
export function listOf(v: unknown): Row[] | null {
  if (Array.isArray(v)) return v.map((x) => (isObj(x) ? x : { value: x }))
  if (!isObj(v)) return null
  for (const k of LIST_KEYS) if (Array.isArray(v[k])) return listOf(v[k])
  for (const val of Object.values(v)) if (Array.isArray(val) && val.length && isObj(val[0])) return listOf(val)
  for (const k of LIST_KEYS) if (isObj(v[k])) { const inner = listOf(v[k]); if (inner) return inner }
  return null
}

export const label = (k: string) => k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/
/** One value as short text. */
export function show(v: unknown): ReactNode {
  if (v === null || v === undefined || v === '') return <span className="text-muted-foreground">—</span>
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (typeof v === 'number') return v.toLocaleString()
  if (typeof v === 'string') return ISO.test(v) ? new Date(v).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : v
  if (Array.isArray(v)) return v.every((x) => typeof x !== 'object') ? v.join(', ') : `${v.length} item${v.length === 1 ? '' : 's'}`
  if (isObj(v)) {
    const name = v.name ?? v.title ?? v.label ?? v.reference ?? v.id
    return typeof name === 'string' ? name : `${Object.keys(v).length} fields`
  }
  return String(v)
}

/** Columns worth showing: scalar keys first, ids last, at most `max`. */
function columnsOf(rows: Row[], max: number, prefer: string[] = []): string[] {
  const keys: string[] = []
  for (const r of rows.slice(0, 25)) for (const k of Object.keys(r)) if (!keys.includes(k)) keys.push(k)
  const score = (k: string) => (prefer.includes(k) ? -100 + prefer.indexOf(k) : 0) + (/^_?id$|Id$|__v|password|token|secret/i.test(k) ? 50 : 0) + (rows.some((r) => isObj(r[k])) ? 10 : 0)
  return keys.sort((a, b) => score(a) - score(b)).slice(0, max)
}

interface DataViewProps {
  data: unknown
  /** Preferred columns, in order. */
  columns?: string[]
  maxColumns?: number
  rowActions?: (row: Row) => ReactNode
  onRowClick?: (row: Row) => void
  empty?: string
}

export function DataView({ data, columns, maxColumns = 7, rowActions, onRowClick, empty = 'Nothing here yet.' }: DataViewProps) {
  const rows = listOf(data)
  if (rows) {
    if (!rows.length) return <div className="card-surface"><EmptyState icon={Inbox} title={empty} sub="" /></div>
    const cols = columnsOf(rows, maxColumns, columns)
    return (
      <div className="card-surface overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[720px]"
          data={rows}
          getRowId={(r) => String(r.id ?? r._id ?? r.reference ?? JSON.stringify(r).slice(0, 80))}
          rowClassName={`border-b last:border-0 hover:bg-accent/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
          onRowClick={onRowClick}
          columns={[
            ...cols.map((k) => ({ id: k, header: label(k), meta: { cellClassName: 'text-xs tnum' }, cell: ({ row: { original: r } }: { row: { original: Row } }) => show(r[k]) })),
            ...(rowActions ? [{ id: '__actions', header: '', meta: { stopRowClick: true, cellClassName: 'text-right whitespace-nowrap' }, cell: ({ row: { original: r } }: { row: { original: Row } }) => rowActions(r) }] : []),
          ]}
        />
      </div>
    )
  }
  if (isObj(data)) return <RecordView data={data} />
  return <div className="card-surface p-4 text-sm">{show(data)}</div>
}

/** An object as label/value rows; nested objects one level deep. */
export function RecordView({ data, title }: { data: Row; title?: string }) {
  const entries = Object.entries(data).filter(([k]) => !/password|token|secret|__v/i.test(k))
  return (
    <div className="rounded-2xl border overflow-hidden">
      {title && <div className="px-4 py-2.5 border-b label-caps">{title}</div>}
      <div className="divide-y">
        {entries.length === 0 && <div className="px-4 py-3 text-xs text-muted-foreground">No data.</div>}
        {entries.map(([k, v]) => (
          isObj(v) && Object.keys(v).length <= 12 ? (
            <div key={k} className="px-4 py-2.5">
              <div className="text-xs text-muted-foreground mb-1">{label(k)}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(v).map(([k2, v2]) => <div key={k2} className="flex justify-between gap-2 text-xs"><span className="text-muted-foreground">{label(k2)}</span><span className="font-medium text-right tnum">{show(v2)}</span></div>)}
              </div>
            </div>
          ) : (
            <div key={k} className="flex justify-between gap-4 px-4 py-2 text-sm"><span className="text-muted-foreground">{label(k)}</span><span className="font-medium text-right tnum break-all">{show(v)}</span></div>
          )
        ))}
      </div>
    </div>
  )
}
