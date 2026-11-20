'use client'

import { FormSheet } from '@/components/ui/form-sheet'
import type { UseQueryResult } from '@tanstack/react-query'
import { useBusinessDocument, useBusinessRead, useIndividualDocument, useIndividualRead } from '@/modules/ms/api/useCompliance'
import { RowButton, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'

const docId = (r?: Row) => (r ? String(r.id ?? r._id ?? r.documentId ?? '') : null)

function DocumentList({ list, useOne }: { list: UseQueryResult<unknown>; useOne: (id: string | null) => UseQueryResult<unknown> }) {
  const sheet = useSheet<'view'>()
  const one = useOne(sheet.is('view') ? docId(sheet.target) : null)
  return (
    <>
      <QueryView query={list}>
        {(d) => (
          <DataView data={listOf(d) ?? []} empty="No documents submitted yet" columns={['documentType', 'type', 'status', 'fileName', 'createdAt']}
            onRowClick={(r) => sheet.show('view', r)} rowActions={(r) => <RowButton onClick={() => sheet.show('view', r)}>View</RowButton>} />
        )}
      </QueryView>
      <FormSheet open={sheet.is('view')} onOpenChange={sheet.onOpenChange} title="Document" sub={docId(sheet.target) ?? ''}>
        <QueryView query={one}>{(d) => <RecordView data={recordOf(d)} />}</QueryView>
      </FormSheet>
    </>
  )
}

/** `GET /compliance/kyc/business/documents` and `…/document/{id}`. */
export const BusinessDocuments = () => <DocumentList list={useBusinessRead('documents')} useOne={useBusinessDocument} />

/** `GET /compliance/kyc/individual/documents` and `…/document/{id}`. */
export const IndividualDocuments = () => <DocumentList list={useIndividualRead('documents')} useOne={useIndividualDocument} />
