'use client'

import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/kit'
import {
  useBusinessRead, useSubmitBusinessKyc, useUpdateBeneficialOwners, useUpdateBusinessInfo, useUpdateBusinessSurvey,
} from '@/modules/ms/api/useCompliance'
import { ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, PageTabs, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf } from '@/modules/ms/components/shared/DataView'
import { fieldsFrom, recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { BusinessDocuments } from './BusinessDocuments'
import { BENEFICIAL_OWNER, BUSINESS_INFO, BUSINESS_SURVEY } from './kyc-fields'
import { ShareholdersPanel } from './ShareholdersPanel'
import { SubmitKycForm } from './SubmitKycForm'

function Overview() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ReadCard title="KYC status" query={useBusinessRead('status')} />
      <ReadCard title="Risk assessment" query={useBusinessRead('risk')} />
      <ReadCard title="Enhanced due diligence" query={useBusinessRead('edd')} />
      <ReadCard title="Corporate structure" query={useBusinessRead('corporate')} />
      <ReadCard title="Non-profit verification" query={useBusinessRead('nonProfit')} />
      <ReadCard title="Government verification" query={useBusinessRead('government')} />
    </div>
  )
}

/** A record (business info / survey) with an edit sheet that writes it back with `PUT`. */
function EditableRecord({ read, title, defaults, save }: {
  read: 'info' | 'survey'; title: string; defaults: typeof BUSINESS_INFO; save: ReturnType<typeof useUpdateBusinessInfo>
}) {
  const q = useBusinessRead(read)
  const sheet = useSheet<'edit'>()
  return (
    <QueryView query={q}>
      {(d) => (
        <div className="space-y-3 max-w-2xl">
          <RecordView data={recordOf(d)} title={title} />
          <Button onClick={() => sheet.show('edit')} className="rounded-full bg-brand text-black hover:bg-brand/90">Edit {title.toLowerCase()}</Button>
          <ActionSheet
            open={sheet.is('edit')} onOpenChange={sheet.onOpenChange} title={`Edit ${title.toLowerCase()}`}
            fields={fieldsFrom(defaults, d)} initial={recordOf(d)} submitLabel="Save" pending={save.isPending}
            onSubmit={(body) => save.mutate(body, { onSuccess: sheet.close })}
          />
        </div>
      )}
    </QueryView>
  )
}

function OwnersTab() {
  const q = useBusinessRead('owners')
  const save = useUpdateBeneficialOwners()
  const sheet = useSheet<'add'>()
  return (
    <QueryView query={q}>
      {(d) => {
        const owners = listOf(d) ?? []
        const put = (list: typeof owners, onSuccess?: () => void) => save.mutate({ beneficialOwners: list }, { onSuccess })
        return (
          <div className="space-y-3">
            <div className="flex justify-end"><Button onClick={() => sheet.show('add')} className="rounded-full bg-brand text-black hover:bg-brand/90">Add owner</Button></div>
            <DataView
              data={owners} empty="No beneficial owners recorded" columns={['fullName', 'ownershipPercentage', 'nationality', 'idType']}
              rowActions={(r) => (
                <ConfirmButton danger label="Remove" title={`Remove ${String(r.fullName ?? 'this owner')}?`} description="Saves the owner list without them." onConfirm={() => put(owners.filter((o) => o !== r))} />
              )}
            />
            <p className="text-[11px] text-muted-foreground">Anyone owning 5% or more of the business. Saved as one list.</p>
            <ActionSheet
              open={sheet.is('add')} onOpenChange={sheet.onOpenChange} title="Add beneficial owner" fields={BENEFICIAL_OWNER}
              submitLabel="Add owner" pending={save.isPending} onSubmit={(o) => put([...owners, o], sheet.close)}
            />
          </div>
        )
      }}
    </QueryView>
  )
}

/** Business KYC (Compliance MS) — for merchant, brand, enterprise and reseller accounts. */
export function BusinessKycPage() {
  const info = useUpdateBusinessInfo()
  const survey = useUpdateBusinessSurvey()
  const submit = useSubmitBusinessKyc()
  return (
    <div>
      <SectionTitle title="Compliance" sub="Your business KYC with the nuMoni compliance team — details, owners, directors and documents." />
      <PageTabs tabs={[
        { id: 'overview', label: 'Status', content: <Overview /> },
        { id: 'info', label: 'Business info', content: <EditableRecord read="info" title="Business info" defaults={BUSINESS_INFO} save={info} /> },
        { id: 'survey', label: 'Survey', content: <EditableRecord read="survey" title="Business survey" defaults={BUSINESS_SURVEY} save={survey} /> },
        { id: 'owners', label: 'Beneficial owners', content: <OwnersTab /> },
        { id: 'shareholders', label: 'Directors & liveness', content: <ShareholdersPanel /> },
        { id: 'documents', label: 'Documents', content: <BusinessDocuments /> },
        { id: 'submit', label: 'Submit for review', content: <SubmitKycForm submit={submit} folder="kyc/business" /> },
      ]} />
    </div>
  )
}
