'use client'

import { useIndividualRead, useSubmitIndividualKyc, useUpdatePersonalInfo } from '@/modules/ms/api/useCompliance'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { fieldsFrom, recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { IndividualDocuments } from './BusinessDocuments'
import { PERSONAL_INFO } from './kyc-fields'
import { SubmitKycForm } from './SubmitKycForm'

function PersonalInfo() {
  // The status payload carries the profile the service holds; prefill from it.
  const q = useIndividualRead('status')
  const save = useUpdatePersonalInfo()
  return (
    <QueryView query={q}>
      {(d) => {
        const profile = recordOf(recordOf(d).personalInfo ?? recordOf(d).profile ?? d)
        return <ActionForm fields={fieldsFrom(PERSONAL_INFO, profile)} initial={profile} submitLabel="Save my details" pending={save.isPending} onSubmit={(v) => save.mutate(v)} />
      }}
    </QueryView>
  )
}

function Status() {
  return (
    <div className="space-y-4">
      <ReadCard title="KYC status" query={useIndividualRead('status')} />
      <ReadCard title="Risk assessment" query={useIndividualRead('risk')} />
      <ReadCard title="Enhanced verification" query={useIndividualRead('enhanced')} />
    </div>
  )
}

/** Individual KYC (Compliance MS) for a customer. */
export function IndividualKycPanel() {
  const submit = useSubmitIndividualKyc()
  return (
    <PageTabs tabs={[
      { id: 'status', label: 'Status', content: <Status /> },
      { id: 'details', label: 'My details', content: <PersonalInfo /> },
      { id: 'documents', label: 'Documents', content: <IndividualDocuments /> },
      { id: 'submit', label: 'Submit', content: <SubmitKycForm submit={submit} folder="kyc/individual" /> },
    ]} />
  )
}
