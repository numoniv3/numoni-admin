'use client'

import { useState } from 'react'
import { Pill, SectionTitle } from '@/components/ui/kit'
import { useApps, useApproveApp } from '@/modules/ms/api/useCreateApp'
import { RowButton } from '@/modules/ms/components/shared/bits'
import { DataView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { AppSheet } from './AppSheet'

const STATUSES = ['all', 'submitted', 'approved', 'rejected', 'draft', 'incomplete'] as const
const idOf = (r: Row) => String(r.id ?? r._id ?? '')

/** Admin → every white-label app; approve or reject submissions. */
export function AppReviewPage() {
  const q = useApps()
  const approve = useApproveApp()
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('submitted')
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <SectionTitle title="White-label Apps" sub="Apps merchants and enterprises have built — review submissions (Create-App MS)." />
      <div className="flex flex-wrap gap-1.5 mb-4">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${status === s ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>{s}</button>
        ))}
      </div>
      <QueryView query={q}>
        {(d) => {
          const rows = (listOf(d) ?? []).filter((r) => status === 'all' || String(r.status) === status)
          return (
            <DataView data={rows} empty={`No ${status === 'all' ? '' : status} apps`} columns={['name', 'alias', 'merchantId', 'websiteUrl', 'status', 'createdAt']}
              onRowClick={(r) => setOpen(idOf(r))}
              rowActions={(r) => (
                <>
                  {r.status === 'approved' && <Pill tone="green">Approved</Pill>}
                  {r.status === 'submitted' && <RowButton onClick={() => approve.mutate(idOf(r))} disabled={approve.isPending}>Approve</RowButton>}
                  <RowButton onClick={() => setOpen(idOf(r))}>Review</RowButton>
                </>
              )} />
          )
        }}
      </QueryView>
      <AppSheet id={open} admin onClose={() => setOpen(null)} />
    </div>
  )
}
