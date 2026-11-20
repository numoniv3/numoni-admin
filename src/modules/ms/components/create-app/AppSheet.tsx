'use client'

import { useState } from 'react'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useAddProductKey, useApp, useAppTransactionStats, useAppTransactions, useApproveApp, useDeleteApp, useProductKeys, useRejectApp,
  useSubmitApp, useUpdateApp,
} from '@/modules/ms/api/useCreateApp'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, PageTabs, Pager, pageInfo } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { DrivePanel } from './DrivePanel'
import { APP_FIELDS } from './app-fields'

const ALL = '__all__'

function Details({ id, admin, onClose }: { id: string; admin: boolean; onClose: () => void }) {
  const q = useApp(id)
  const update = useUpdateApp()
  const submit = useSubmitApp()
  const remove = useDeleteApp()
  const approve = useApproveApp()
  const reject = useRejectApp()
  const [reason, setReason] = useState('')
  return (
    <QueryView query={q}>
      {(d) => {
        const app = recordOf(d)
        const status = String(app.status ?? '')
        return (
          <div className="space-y-4">
            <RecordView data={app} />
            {admin ? (
              <div className="rounded-2xl border p-4 space-y-3">
                <div className="label-caps">Review</div>
                <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (sent to the merchant when rejecting)" />
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-full bg-brand text-black hover:bg-brand/90" disabled={approve.isPending} onClick={() => approve.mutate(id)}>Approve</Button>
                  <Button variant="outline" className="flex-1 rounded-full" disabled={reject.isPending} onClick={() => reject.mutate({ id, reason: reason.trim() || undefined })}>Reject</Button>
                </div>
              </div>
            ) : (
              <>
                <ActionForm fields={APP_FIELDS} initial={app} submitLabel="Save changes" pending={update.isPending} onSubmit={(body) => update.mutate({ id, body })} />
                <div className="flex gap-2">
                  {(status === 'draft' || status === 'rejected' || status === 'incomplete' || !status) && (
                    <Button variant="outline" className="flex-1 rounded-full" disabled={submit.isPending} onClick={() => submit.mutate(id)}>Submit for review</Button>
                  )}
                  <ConfirmButton danger label="Delete app" title="Delete this app?" description="Removes the app, its product keys and drive documents." onConfirm={() => remove.mutate(id, { onSuccess: onClose })} />
                </div>
              </>
            )}
          </div>
        )
      }}
    </QueryView>
  )
}

function Keys({ id, admin }: { id: string; admin: boolean }) {
  const q = useProductKeys(id)
  const add = useAddProductKey()
  const [key, setKey] = useState('')
  return (
    <div className="space-y-3">
      {!admin && (
        <div className="flex gap-2">
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Product key" className="font-mono" />
          <Button variant="outline" disabled={!key.trim() || add.isPending} onClick={() => add.mutate({ id, key: key.trim() }, { onSuccess: () => setKey('') })}>Add key</Button>
        </div>
      )}
      <QueryView query={q}>{(d) => <DataView data={listOf(d) ?? (Array.isArray(recordOf(d).productKeys) ? recordOf(d).productKeys : [])} empty="No product keys" />}</QueryView>
    </div>
  )
}

function Transactions({ id }: { id: string }) {
  const [type, setType] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [page, setPage] = useState(1)
  const q = useAppTransactions(id, { page, limit: 20, type: type === ALL ? undefined : (type as 'credit'), status: status === ALL ? undefined : (status as 'pending') })
  return (
    <div className="space-y-4">
      <ReadCard title="Totals" query={useAppTransactionStats(id)} />
      <div className="flex gap-2">
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1) }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All types</SelectItem><SelectItem value="credit">Credit</SelectItem><SelectItem value="debit">Debit</SelectItem></SelectContent></Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All statuses</SelectItem>{['pending', 'completed', 'failed', 'cancelled'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>
      <QueryView query={q}>{(d) => <><DataView data={listOf(d) ?? []} empty="No transactions" /><Pager page={page} setPage={setPage} {...pageInfo(d, page, 20)} /></>}</QueryView>
    </div>
  )
}

/** One white-label app: details & review, product keys, transactions, drive. `admin` shows approve/reject instead of editing. */
export function AppSheet({ id, admin = false, onClose }: { id: string | null; admin?: boolean; onClose: () => void }) {
  return (
    <FormSheet open={!!id} onOpenChange={(v) => !v && onClose()} title="White-label app" sub={id ?? ''} wide>
      {id && (
        <div className="pb-2">
          <PageTabs tabs={[
            { id: 'details', label: admin ? 'Review' : 'Details', content: <Details id={id} admin={admin} onClose={onClose} /> },
            { id: 'keys', label: 'Product keys', content: <Keys id={id} admin={admin} /> },
            { id: 'txns', label: 'Transactions', content: <Transactions id={id} /> },
            { id: 'drive', label: 'Drive', content: <DrivePanel appId={id} readOnly={admin} /> },
          ]} />
        </div>
      )}
    </FormSheet>
  )
}
