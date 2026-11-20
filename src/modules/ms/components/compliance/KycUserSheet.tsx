'use client'

import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import {
  useCreateKycProfile, useReviewKyc, useSetDocumentStatus, useUpdateDocumentLegacy, useUserKyc, useVerifyDocumentAml,
} from '@/modules/ms/api/useCompliance'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, RowButton, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'

const DOC_STATUSES = ['APPROVED', 'REJECTED', 'PENDING', 'NEEDS_RESUBMISSION']
const idOf = (r: Row) => String(r.id ?? r._id ?? r.documentId ?? '')

function Documents({ userId }: { userId: string }) {
  const { documents } = useUserKyc(userId)
  const setStatus = useSetDocumentStatus()
  const legacy = useUpdateDocumentLegacy()
  const aml = useVerifyDocumentAml()
  const sheet = useSheet<'status'>()
  return (
    <div>
      <div className="label-caps mb-2">Documents</div>
      <QueryView query={documents}>
        {(d) => (
          <DataView data={listOf(d) ?? []} empty="No documents" columns={['documentType', 'type', 'status', 'url', 'createdAt']}
            rowActions={(r) => (
              <>
                {typeof r.url === 'string' && <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-brand px-2">Open</a>}
                <RowButton onClick={() => sheet.show('status', r)}>Set status</RowButton>
                <RowButton onClick={() => aml.mutate(idOf(r))} disabled={aml.isPending}>AML check</RowButton>
              </>
            )} />
        )}
      </QueryView>
      {sheet.is('status') && (
        <div className="mt-3 rounded-2xl border p-4">
          <ActionForm
            fields={[{ key: 'status', label: 'Status', kind: 'select', options: DOC_STATUSES, required: true }, { key: 'reason', label: 'Reason / note', kind: 'textarea' }]}
            submitLabel="Save document status" pending={setStatus.isPending || legacy.isPending}
            onSubmit={(body) => {
              const id = idOf(sheet.target!)
              // `/kyc/admin/document/{id}/status` is the admin route; fall back to the older `/kyc/document/{id}`.
              setStatus.mutate({ id, body }, { onSuccess: sheet.close, onError: () => legacy.mutate({ id, body }, { onSuccess: sheet.close }) })
            }}
          />
        </div>
      )}
    </div>
  )
}

function Review({ userId, kycId }: { userId: string; kycId?: string }) {
  const { status } = useUserKyc(userId)
  const review = useReviewKyc()
  const create = useCreateKycProfile()
  return (
    <QueryView query={status}>
      {(s) => {
        const rec = recordOf(s)
        const id = kycId || String(rec.id ?? rec._id ?? rec.kycId ?? '')
        return (
          <div className="rounded-2xl border p-4 space-y-3">
            <div className="label-caps">Decision</div>
            {id ? (
              <ActionForm
                fields={[
                  { key: 'decision', label: 'Decision', kind: 'select', options: ['APPROVED', 'REJECTED', 'NEEDS_MORE_INFO'], required: true },
                  { key: 'tier', label: 'Tier to grant', kind: 'select', options: ['T1', 'T2', 'T3'] },
                  { key: 'notes', label: 'Notes', kind: 'textarea' },
                ]}
                submitLabel="Record review" pending={review.isPending}
                onSubmit={(v) => review.mutate({ kycId: id, body: { ...v, status: v.decision } })}
              />
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">This user has no KYC record yet.</p>
                <ConfirmButton label="Create KYC profile" title="Create a KYC profile?" description="Creates a minimal KYC profile for this user so documents can be attached and reviewed." onConfirm={() => create.mutate({ userId, body: {} })} />
              </div>
            )}
          </div>
        )
      }}
    </QueryView>
  )
}

/** One user's KYC file for admin review. */
export function KycUserSheet({ target, onClose }: { target: { userId: string; kycId?: string } | null; onClose: () => void }) {
  return (
    <FormSheet open={!!target} onOpenChange={(v) => !v && onClose()} title="KYC review" sub={target?.userId} wide>
      {target && <UserFile userId={target.userId} kycId={target.kycId} onClose={onClose} />}
    </FormSheet>
  )
}

function UserFile({ userId, kycId, onClose }: { userId: string; kycId?: string; onClose: () => void }) {
  const q = useUserKyc(userId)
  return (
    <div className="space-y-5 pb-2">
      <ReadCard title="KYC status" query={q.status} />
      <ReadCard title="Individual profile" query={q.individual} />
      <ReadCard title="Business profile" query={q.business} />
      <Documents userId={userId} />
      <Review userId={userId} kycId={kycId} />
      <Button variant="outline" className="w-full rounded-full" onClick={onClose}>Done</Button>
    </div>
  )
}
