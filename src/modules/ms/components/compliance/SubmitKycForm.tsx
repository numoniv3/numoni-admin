'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { uploadFile } from '@/lib/api/numoni/account.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import type { UntypedBody } from '@/lib/api/numoni/types/compliance'
import type { useMsAction } from '@/modules/ms/api/ms-hooks'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { SUBMIT_DOCUMENTS } from './kyc-fields'

interface SubmitKycFormProps {
  submit: ReturnType<typeof useMsAction<UntypedBody, unknown>>
  folder: string
  /** Extra fields to send with the submission (e.g. personal info). */
  extra?: UntypedBody
}

/** Uploads the chosen files (`POST /media/upload`), then submits KYC with their links. */
export function SubmitKycForm({ submit, folder, extra }: SubmitKycFormProps) {
  const [uploading, setUploading] = useState(false)

  const send = async (v: UntypedBody) => {
    const files = (v.files as File[] | undefined) ?? []
    let urls = (v.documentUrls as string[] | undefined) ?? []
    if (files.length) {
      setUploading(true)
      try {
        const uploaded = await Promise.all(files.map((f) => uploadFile(f, folder)))
        urls = [...urls, ...uploaded.map((u) => u.url)]
      } catch (e) {
        toast.error('Couldn’t upload the documents', { description: apiErrorMessage(e) })
        return
      } finally {
        setUploading(false)
      }
    }
    const { files: _files, ...rest } = v
    void _files
    submit.mutate({
      ...extra, ...rest, documentUrls: urls,
      documents: urls.map((url) => ({ type: rest.documentType, url })),
    })
  }

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs text-muted-foreground">Fill in the Business info, owners and directors first, then attach your documents and submit — the compliance team reviews it and your status updates on the Status tab.</p>
      <ActionForm
        fields={[{ key: 'files', label: 'Documents', kind: 'files', accept: 'image/*,application/pdf' }, ...SUBMIT_DOCUMENTS]}
        submitLabel={uploading ? 'Uploading…' : 'Submit for review'}
        pending={uploading || submit.isPending}
        onSubmit={(v) => void send(v)}
      />
    </div>
  )
}
