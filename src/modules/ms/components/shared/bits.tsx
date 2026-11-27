'use client'

import { useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Row } from './DataView'

/** Which sheet is open and for which record: `show('edit', row)`, `close()`. */
export function useSheet<K extends string, T = Row>() {
  const [state, setState] = useState<{ kind: K; target?: T } | null>(null)
  return {
    kind: state?.kind ?? null,
    target: state?.target,
    is: (k: K) => state?.kind === k,
    show: (kind: K, target?: T) => setState({ kind, target }),
    close: () => setState(null),
    onOpenChange: (open: boolean) => { if (!open) setState(null) },
  }
}

/** A small action button that asks before running. */
export function ConfirmButton({ label, title, description, onConfirm, danger, disabled, children }: {
  label: string; title: string; description: string; onConfirm: () => void; danger?: boolean; disabled?: boolean; children?: ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className={`h-8 ${danger ? 'text-muted-foreground hover:text-red-500' : ''}`} disabled={disabled} title={label}>{children ?? label}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={danger ? 'bg-red-500 text-white hover:bg-red-500/90' : undefined} onClick={onConfirm}>{label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** A text button for a table row. */
export const RowButton = ({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) => (
  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={onClick} disabled={disabled}>{children}</Button>
)

/**
 * A page split into tabs; only the open tab mounts (so only its queries run).
 * Pass `value` + `onValueChange` to control it, or `initial` to pick the first one shown.
 */
export function PageTabs({ tabs, initial, value, onValueChange }: { tabs: { id: string; label: string; content: ReactNode }[]; initial?: string; value?: string; onValueChange?: (id: string) => void }) {
  const [own, setOwn] = useState(initial ?? tabs[0]?.id)
  const tab = value ?? own
  const setTab = onValueChange ?? setOwn
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-5 flex-wrap h-auto">{tabs.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList>
      {tabs.map((t) => <TabsContent key={t.id} value={t.id}>{tab === t.id && t.content}</TabsContent>)}
    </Tabs>
  )
}

/** Previous / next page controls. */
export function Pager({ page, setPage, hasNext, total }: { page: number; setPage: (p: number) => void; hasNext: boolean; total?: number }) {
  if (page <= 1 && !hasNext) return null
  return (
    <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
      <span className="tnum">Page {page}{total !== undefined ? ` · ${total.toLocaleString()} total` : ''}</span>
      <Button size="sm" variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
      <Button size="sm" variant="outline" className="h-8" disabled={!hasNext} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  )
}

/** Reads a total / page count from a paginated payload, whatever the service calls them. */
export function pageInfo(data: unknown, page: number, limit: number) {
  const o = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const meta = (o.meta ?? o.pagination ?? o) as Record<string, unknown>
  const num = (...keys: string[]) => { for (const k of keys) { const v = Number(meta[k] ?? o[k]); if (Number.isFinite(v) && v > 0) return v } return undefined }
  const total = num('total', 'totalCount', 'count', 'totalItems')
  const pages = num('totalPages', 'lastPage', 'last_page', 'lastpage', 'pages')
  const hasNext = pages ? page < pages : total ? page * limit < total : false
  return { total, hasNext }
}
