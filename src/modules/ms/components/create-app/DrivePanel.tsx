'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  useDeleteDriveDocument, useDriveDocument, useDriveDocuments, useDriveStats, useUpdateDriveDocument, useUploadDriveDocument,
} from '@/modules/ms/api/useCreateApp'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, Pager, RowButton, pageInfo, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { fieldsFrom, recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'

const idOf = (r?: Row) => (r ? String(r.id ?? r._id ?? r.documentId ?? '') : null)

/** An app's document drive: upload, list, open, rename/update, delete, totals. */
export function DrivePanel({ appId, readOnly }: { appId: string; readOnly?: boolean }) {
  const [page, setPage] = useState(1)
  const list = useDriveDocuments(appId, page)
  const upload = useUploadDriveDocument()
  const update = useUpdateDriveDocument()
  const remove = useDeleteDriveDocument()
  const sheet = useSheet<'view' | 'edit'>()
  const one = useDriveDocument(appId, sheet.kind ? idOf(sheet.target) : null)

  return (
    <div className="space-y-4">
      <ReadCard title="Drive totals" query={useDriveStats(appId)} />
      {!readOnly && (
        <Input type="file" disabled={upload.isPending} onChange={(e) => { const file = e.target.files?.[0]; if (file) upload.mutate({ id: appId, file }); e.target.value = '' }} />
      )}
      <QueryView query={list}>
        {(d) => (
          <>
            <DataView data={listOf(d) ?? []} empty="No documents" columns={['name', 'fileName', 'originalName', 'mimeType', 'size', 'createdAt']}
              rowActions={(r) => (
                <>
                  <RowButton onClick={() => sheet.show('view', r)}>Open</RowButton>
                  {!readOnly && <RowButton onClick={() => sheet.show('edit', r)}>Edit</RowButton>}
                  {!readOnly && <ConfirmButton danger label="Delete" title="Delete this document?" description="It’s removed from the app’s drive." onConfirm={() => remove.mutate({ id: appId, docId: idOf(r)! })} />}
                </>
              )} />
            <Pager page={page} setPage={setPage} {...pageInfo(d, page, 20)} />
          </>
        )}
      </QueryView>
      {sheet.is('view') && <QueryView query={one}>{(d) => <RecordView data={recordOf(d)} title="Document" />}</QueryView>}
      {sheet.is('edit') && (
        <div className="rounded-2xl border p-4">
          <ActionForm
            fields={fieldsFrom([{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description', kind: 'textarea' }], sheet.target)}
            initial={sheet.target} submitLabel="Save document" pending={update.isPending}
            onSubmit={(body) => update.mutate({ id: appId, docId: idOf(sheet.target)!, body }, { onSuccess: sheet.close })}
          />
        </div>
      )}
    </div>
  )
}
