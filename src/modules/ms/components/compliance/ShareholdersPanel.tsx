'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateShareholders, useGenerateLiveness, useLivenessStatus, useShareholders, useUpdateShareholders } from '@/modules/ms/api/useCompliance'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { RowButton, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { fieldsFrom, recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { SHAREHOLDER } from './kyc-fields'

/** A liveness link or reference from the generate response, wherever the service puts it. */
const pick = (v: unknown, ...keys: string[]) => {
  const r = recordOf(v)
  for (const k of keys) if (typeof r[k] === 'string') return r[k] as string
  return undefined
}

function LivenessCheck() {
  const [ref, setRef] = useState('')
  const [checking, setChecking] = useState<string | null>(null)
  const status = useLivenessStatus(checking)
  return (
    <div className="card-surface p-4 space-y-3">
      <div className="label-caps">Check a liveness test</div>
      <div className="flex gap-2">
        <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Provider reference" className="tnum" />
        <Button variant="outline" onClick={() => setChecking(ref.trim() || null)} disabled={!ref.trim()}>Check</Button>
      </div>
      {checking && <QueryView query={status}>{(d) => <RecordView data={recordOf(d)} />}</QueryView>}
    </div>
  )
}

/** Directors / shareholders (`/compliance/kyc/business/{merchantId}/shareholders`) and their liveness tests. */
export function ShareholdersPanel() {
  const merchantId = useSessionUser()?.universalId ?? ''
  const q = useShareholders(merchantId)
  const create = useCreateShareholders()
  const update = useUpdateShareholders()
  const liveness = useGenerateLiveness()
  const sheet = useSheet<'add' | 'edit'>()
  const [link, setLink] = useState<{ who: string; url?: string; ref?: string } | null>(null)

  const generate = (r: Row) => {
    const id = String(r.id ?? r._id ?? r.shareholderId ?? '')
    liveness.mutate(id, { onSuccess: (res) => setLink({ who: `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim(), url: pick(res, 'url', 'livenessUrl', 'link', 'verificationUrl'), ref: pick(res, 'providerReference', 'reference') }) })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => sheet.show('add')} className="rounded-full bg-brand text-black hover:bg-brand/90">Add director / shareholder</Button></div>
      <QueryView query={q}>
        {(d) => (
          <>
            <DataView
              data={listOf(d) ?? []} empty="No directors or shareholders yet" columns={['firstName', 'lastName', 'role', 'ownershipPercentage', 'email', 'livenessStatus']}
              rowActions={(r) => (
                <>
                  <RowButton onClick={() => sheet.show('edit', r)}>Edit</RowButton>
                  <RowButton onClick={() => generate(r)} disabled={liveness.isPending}>Liveness link</RowButton>
                </>
              )}
            />
            <ActionSheet
              open={sheet.kind !== null} onOpenChange={sheet.onOpenChange}
              title={sheet.is('edit') ? 'Edit shareholder' : 'Add director / shareholder'}
              sub="Each director takes a liveness (selfie) test from a link you send them."
              fields={fieldsFrom(SHAREHOLDER, sheet.target)} initial={sheet.target}
              submitLabel="Save" pending={create.isPending || update.isPending}
              onSubmit={(v) => {
                if (sheet.is('edit')) update.mutate({ merchantId, body: { ...sheet.target, ...v } }, { onSuccess: sheet.close })
                else create.mutate({ merchantId, body: { shareholders: [v], ...v } }, { onSuccess: sheet.close })
              }}
            />
          </>
        )}
      </QueryView>
      {link && (
        <div className="rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm space-y-1">
          <div className="font-semibold">Liveness test for {link.who || 'shareholder'}</div>
          {link.url ? <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand break-all">{link.url} <ExternalLink className="h-3.5 w-3.5" /></a> : <div className="text-xs text-muted-foreground">The service didn’t return a link.</div>}
          {link.ref && <div className="text-xs text-muted-foreground tnum">Reference {link.ref} — check it below once they’re done.</div>}
        </div>
      )}
      <LivenessCheck />
    </div>
  )
}
