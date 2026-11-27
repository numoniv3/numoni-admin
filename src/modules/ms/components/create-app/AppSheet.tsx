'use client'

import { useState } from 'react'
import { AlertCircle, Check, Copy, ExternalLink, KeyRound, Pencil, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  useAddProductKey, useApp, useAppTransactionStats, useAppTransactions, useApproveApp, useDeleteApp, useProductKeys, useRejectApp,
  useSubmitApp, useUpdateApp,
} from '@/modules/ms/api/useCreateApp'
import { ConfirmButton, PageTabs, Pager, pageInfo } from '@/modules/ms/components/shared/bits'
import { DataView, listOf } from '@/modules/ms/components/shared/DataView'
import { AppForm } from './AppForm'
import { DrivePanel } from './DrivePanel'
import { STATUS, appOf, canSubmit, fmtDate, keysOf, type App } from './app-meta'

const ALL = '__all__'

/** Draft → In review → Approved, with the current step highlighted (rejected / needs info shown on step 2). */
function Stepper({ app }: { app: App }) {
  const at = app.status === 'approved' ? 2 : app.status === 'draft' ? 0 : 1
  const steps = ['Draft', app.status === 'rejected' ? 'Rejected' : app.status === 'incomplete' ? 'Needs info' : 'In review', 'Approved']
  const bad = app.status === 'rejected' || app.status === 'incomplete'
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
            i < at ? 'bg-brand text-black' : i === at ? (bad ? 'bg-red-500 text-white' : 'bg-brand/15 text-brand ring-1 ring-brand') : 'bg-muted text-muted-foreground')}>
            {i < at ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span className={cn('text-xs whitespace-nowrap', i === at ? 'font-semibold' : 'text-muted-foreground')}>{label}</span>
          {i < steps.length - 1 && <span className={cn('h-px flex-1', i < at ? 'bg-brand' : 'bg-border')} />}
        </div>
      ))}
    </div>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex justify-between gap-4 px-4 py-2.5 text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-right min-w-0 break-words">{children}</span></div>
}

function Details({ id, admin, onClose }: { id: string; admin: boolean; onClose: () => void }) {
  const q = useApp(id)
  const update = useUpdateApp()
  const submit = useSubmitApp()
  const remove = useDeleteApp()
  const approve = useApproveApp()
  const reject = useRejectApp()
  const [editing, setEditing] = useState(false)
  const [reason, setReason] = useState('')

  if (q.isLoading) return <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">Loading…</div>
  if (q.isError) return <div className="p-6 text-center text-sm text-muted-foreground">Couldn’t load this app. <button className="underline" onClick={() => void q.refetch()}>Try again</button></div>
  const app = appOf(q.data)
  const st = STATUS[app.status]

  if (editing) {
    return <AppForm app={app} submitLabel="Save changes" pending={update.isPending} onCancel={() => setEditing(false)}
      onSubmit={(body) => update.mutate({ id, body }, { onSuccess: () => setEditing(false) })} />
  }

  return (
    <div className="space-y-4">
      <Stepper app={app} />
      <p className="text-xs text-muted-foreground">{st.next}</p>
      {(app.status === 'rejected' || app.status === 'incomplete') && app.rejectionReason && (
        <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <div><div className="font-semibold text-xs mb-0.5">Reviewer’s note</div>{app.rejectionReason}</div>
        </div>
      )}

      <div className="rounded-2xl border divide-y">
        <Fact label="Name">{app.name}</Fact>
        <Fact label="Alias"><span className="font-mono">{app.alias || '—'}</span></Fact>
        <Fact label="Website">{app.websiteUrl ? <a href={app.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">{app.websiteUrl.replace(/^https?:\/\//, '')}<ExternalLink className="h-3 w-3" /></a> : '—'}</Fact>
        {admin && app.merchantId && <Fact label="Merchant"><span className="font-mono text-xs">{app.merchantId}</span></Fact>}
        {app.createdAt && <Fact label="Created">{fmtDate(app.createdAt)}</Fact>}
      </div>
      {app.description && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{app.description}</p>}

      {admin ? (
        <div className="rounded-2xl border p-4 space-y-3">
          <div className="label-caps">Review</div>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason — sent to the merchant when rejecting" />
          <div className="flex gap-2">
            <Button className="flex-1 rounded-full bg-brand text-black hover:bg-brand/90" disabled={approve.isPending || app.status === 'approved'} onClick={() => approve.mutate(id)}>Approve</Button>
            <Button variant="outline" className="flex-1 rounded-full" disabled={reject.isPending}
              onClick={() => (reason.trim() ? reject.mutate({ id, reason: reason.trim() }) : toast.error('Say why it’s rejected'))}>Reject</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {canSubmit(app) && (
            <Button className="rounded-full bg-brand text-black font-semibold hover:bg-brand/90" disabled={submit.isPending} onClick={() => submit.mutate(id)}>
              <Send className="h-3.5 w-3.5 mr-1.5" />{app.status === 'draft' ? 'Submit for review' : 'Resubmit'}
            </Button>
          )}
          <Button variant="outline" className="rounded-full" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5 mr-1.5" />Edit details</Button>
          <span className="ml-auto">
            <ConfirmButton danger label="Delete app" title={`Delete ${app.name}?`} description="Removes the app, its product keys and documents. This can’t be undone."
              onConfirm={() => remove.mutate(id, { onSuccess: onClose })} />
          </span>
        </div>
      )}
    </div>
  )
}

function Keys({ id, admin }: { id: string; admin: boolean }) {
  const q = useProductKeys(id)
  const add = useAddProductKey()
  const [key, setKey] = useState('')
  const keys = keysOf(q.data)
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Product keys link this app to the nuMoni products it can use.</p>
      {!admin && (
        <div className="flex gap-2">
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste a product key" className="font-mono"
            onKeyDown={(e) => e.key === 'Enter' && key.trim() && add.mutate({ id, key: key.trim() }, { onSuccess: () => setKey('') })} />
          <Button variant="outline" disabled={!key.trim() || add.isPending} onClick={() => add.mutate({ id, key: key.trim() }, { onSuccess: () => setKey('') })}>Add</Button>
        </div>
      )}
      {q.isLoading ? <div className="text-xs text-muted-foreground animate-pulse">Loading…</div> : keys.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground"><KeyRound className="h-5 w-5 mx-auto mb-2 opacity-60" />No product keys yet.</div>
      ) : (
        <div className="rounded-2xl border divide-y">
          {keys.map((k) => (
            <div key={k} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="font-mono text-xs truncate">{k}</span>
              <button type="button" aria-label="Copy key" className="text-muted-foreground hover:text-foreground"
                onClick={() => { void navigator.clipboard?.writeText(k); toast.success('Key copied') }}><Copy className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Numeric totals from the untyped stats payload, as tiles (nested objects flattened one level). */
function StatTiles({ data }: { data: unknown }) {
  const tiles: [string, number][] = []
  const walk = (o: unknown, prefix = '') => {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      const label = `${prefix}${k}`.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
      if (typeof v === 'number') tiles.push([label, v])
      else if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) tiles.push([label, Number(v)])
      else if (!prefix) walk(v, `${k} `)
    }
  }
  walk(data)
  if (!tiles.length) return null
  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.slice(0, 8).map(([label, n]) => (
        <div key={label} className="rounded-xl border p-3"><div className="text-[11px] text-muted-foreground truncate">{label}</div><div className="text-lg font-bold tnum">{n.toLocaleString()}</div></div>
      ))}
    </div>
  )
}

function Transactions({ id }: { id: string }) {
  const [type, setType] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [page, setPage] = useState(1)
  const stats = useAppTransactionStats(id)
  const q = useAppTransactions(id, { page, limit: 20, type: type === ALL ? undefined : (type as 'credit'), status: status === ALL ? undefined : (status as 'pending') })
  const rows = listOf(q.data) ?? []
  return (
    <div className="space-y-4">
      <StatTiles data={stats.data} />
      <div className="flex gap-2">
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1) }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All types</SelectItem><SelectItem value="credit">Credits</SelectItem><SelectItem value="debit">Debits</SelectItem></SelectContent></Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All statuses</SelectItem>{['pending', 'completed', 'failed', 'cancelled'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
      </div>
      {q.isLoading ? <div className="text-xs text-muted-foreground animate-pulse">Loading…</div> : (
        <>
          <DataView data={rows} empty="No transactions yet" columns={['reference', 'type', 'amount', 'status', 'description', 'createdAt']} />
          <Pager page={page} setPage={setPage} {...pageInfo(q.data, page, 20)} />
        </>
      )}
    </div>
  )
}

/** One white-label app: overview & review, product keys, transactions, documents. `admin` reviews instead of editing. */
export function AppSheet({ id, admin = false, onClose }: { id: string | null; admin?: boolean; onClose: () => void }) {
  const q = useApp(id ?? '')
  const app = id && q.data ? appOf(q.data) : null
  return (
    <FormSheet open={!!id} onOpenChange={(v) => !v && onClose()} title={app?.name ?? 'White-label app'} sub={app ? STATUS[app.status].label : undefined} wide>
      {id && (
        <div className="pb-2">
          <PageTabs key={id} tabs={[
            { id: 'details', label: admin ? 'Review' : 'Overview', content: <Details id={id} admin={admin} onClose={onClose} /> },
            { id: 'keys', label: 'Product keys', content: <Keys id={id} admin={admin} /> },
            { id: 'txns', label: 'Transactions', content: <Transactions id={id} /> },
            { id: 'drive', label: 'Documents', content: <DrivePanel appId={id} readOnly={admin} /> },
          ]} />
        </div>
      )}
    </FormSheet>
  )
}
