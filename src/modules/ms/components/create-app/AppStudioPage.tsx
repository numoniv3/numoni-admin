'use client'

import { useState } from 'react'
import { AlertCircle, AppWindow, ExternalLink, KeyRound, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { EmptyState, Pill, SectionTitle } from '@/components/ui/kit'
import { cn } from '@/lib/utils'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { useApps, useCreateApp, useSubmitApp } from '@/modules/ms/api/useCreateApp'
import { AppForm } from './AppForm'
import { AppSheet } from './AppSheet'
import { STATUS, appsOf, canSubmit, fmtDate, type App, type AppStatus } from './app-meta'

const FILTERS: { id: 'all' | AppStatus; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'draft', label: 'Drafts' }, { id: 'submitted', label: 'In review' },
  { id: 'approved', label: 'Approved' }, { id: 'rejected', label: 'Rejected' },
]

const STEPS = [
  { title: 'Create', sub: 'Name your app and point it at your website.' },
  { title: 'Submit for review', sub: 'nuMoni checks it — usually quick.' },
  { title: 'Go live', sub: 'Add product keys and track transactions.' },
]

function AppCard({ app, onOpen }: { app: App; onOpen: () => void }) {
  const submit = useSubmitApp()
  const st = STATUS[app.status]
  return (
    <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="card-surface p-5 flex flex-col gap-3 cursor-pointer hover:border-brand/50 transition-colors text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-10 w-10 shrink-0 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold">{app.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0">
            <div className="font-semibold truncate">{app.name}</div>
            {app.alias && <div className="text-[11px] text-muted-foreground font-mono truncate">{app.alias}</div>}
          </div>
        </div>
        <Pill tone={st.tone}>{st.label}</Pill>
      </div>
      {app.description && <p className="text-xs text-muted-foreground line-clamp-2">{app.description}</p>}
      {(app.status === 'rejected' || app.status === 'incomplete') && app.rejectionReason && (
        <div className="flex gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-2.5 text-xs">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" /><span>{app.rejectionReason}</span>
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-3 min-w-0">
          {app.websiteUrl && (
            <a href={app.websiteUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 truncate hover:text-foreground">
              <ExternalLink className="h-3 w-3 shrink-0" />{app.websiteUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
          {app.status === 'approved' && <span className="flex items-center gap-1 shrink-0"><KeyRound className="h-3 w-3" />{app.productKeys.length}</span>}
        </span>
        {canSubmit(app) ? (
          <Button size="sm" variant="outline" className="h-7 rounded-full text-xs shrink-0" disabled={submit.isPending}
            onClick={(e) => { e.stopPropagation(); submit.mutate(app.id) }}>
            <Send className="h-3 w-3 mr-1" />{app.status === 'draft' ? 'Submit' : 'Resubmit'}
          </Button>
        ) : <span className="shrink-0">{fmtDate(app.updatedAt ?? app.createdAt)}</span>}
      </div>
    </div>
  )
}

/** The account's white-label apps (Create-App MS): create, submit for review, then keys, transactions and documents. */
export function AppStudioPage({ title = 'White-label Apps' }: { title?: string }) {
  const merchantId = useSessionUser()?.universalId
  const q = useApps(merchantId)
  const create = useCreateApp()
  const [creating, setCreating] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | AppStatus>('all')

  const apps = appsOf(q.data)
  const count = (id: 'all' | AppStatus) => (id === 'all' ? apps.length : apps.filter((a) => a.status === id || (id === 'rejected' && a.status === 'incomplete')).length)
  const shown = filter === 'all' ? apps : apps.filter((a) => a.status === filter || (filter === 'rejected' && a.status === 'incomplete'))

  return (
    <div>
      <SectionTitle
        title={title}
        sub="Branded apps that run on your own website, powered by nuMoni."
        right={<Button onClick={() => setCreating(true)} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> New app</Button>}
      />

      {q.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="card-surface h-40 animate-pulse" />)}</div>
      ) : q.isError ? (
        <div className="card-surface p-8 text-center text-sm text-muted-foreground">Couldn’t load your apps. <button className="underline" onClick={() => void q.refetch()}>Try again</button></div>
      ) : apps.length === 0 ? (
        <div className="card-surface p-8 space-y-6">
          <EmptyState icon={AppWindow} title="No apps yet" sub="Create your first white-label app in three steps." />
          <ol className="grid gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border p-4">
                <div className="text-xs font-bold text-brand tnum">Step {i + 1}</div>
                <div className="text-sm font-semibold mt-1">{s.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </li>
            ))}
          </ol>
          <div className="text-center"><Button onClick={() => setCreating(true)} className="rounded-full bg-brand text-black font-semibold hover:bg-brand/90"><Plus className="h-4 w-4 mr-1.5" /> Create an app</Button></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors', filter === f.id ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30')}>
                {f.label} <span className="tnum opacity-70">{count(f.id)}</span>
              </button>
            ))}
          </div>
          {shown.length === 0
            ? <div className="card-surface p-8 text-center text-sm text-muted-foreground">No apps here.</div>
            : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{shown.map((a) => <AppCard key={a.id} app={a} onOpen={() => setOpen(a.id)} />)}</div>}
        </div>
      )}

      <FormSheet open={creating} onOpenChange={setCreating} title="New white-label app" sub="It starts as a draft — submit it for review when it’s ready.">
        {creating && (
          <AppForm submitLabel="Create app" pending={create.isPending} onCancel={() => setCreating(false)}
            onSubmit={(body) => create.mutate(body, { onSuccess: (r) => { setCreating(false); const id = appsOf([r])[0]?.id; if (id) setOpen(id) } })} />
        )}
      </FormSheet>
      <AppSheet id={open} onClose={() => setOpen(null)} />
    </div>
  )
}
