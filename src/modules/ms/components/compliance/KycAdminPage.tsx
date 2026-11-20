'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/kit'
import { ADMIN_LISTS, useAdminList, useCheckSanctions, useComplianceMetrics, useRiskSummary } from '@/modules/ms/api/useCompliance'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs, RowButton } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { KycUserSheet } from './KycUserSheet'

const userIdOf = (r: Row) => String(r.userId ?? r.universalId ?? r.user ?? r.ownerId ?? r.id ?? '')

function ProfileList({ list, onOpen }: { list: keyof typeof ADMIN_LISTS; onOpen: (userId: string, kycId?: string) => void }) {
  const q = useAdminList(list)
  return (
    <QueryView query={q}>
      {(d) => (
        <DataView data={listOf(d) ?? []} empty={`No ${ADMIN_LISTS[list].label.toLowerCase()}`}
          columns={['businessName', 'fullName', 'firstName', 'lastName', 'type', 'status', 'riskLevel', 'riskScore', 'tier', 'createdAt']}
          onRowClick={(r) => onOpen(userIdOf(r), String(r.id ?? r._id ?? ''))}
          rowActions={(r) => <RowButton onClick={() => onOpen(userIdOf(r), String(r.id ?? r._id ?? ''))}>Review</RowButton>} />
      )}
    </QueryView>
  )
}

function Lookup({ onOpen }: { onOpen: (userId: string) => void }) {
  const [id, setId] = useState('')
  return (
    <div className="flex gap-2 max-w-md">
      <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="Look up a user ID" className="tnum" />
      <Button variant="outline" onClick={() => id.trim() && onOpen(id.trim())}>Open</Button>
    </div>
  )
}

function Sanctions() {
  const check = useCheckSanctions()
  return (
    <div className="max-w-2xl space-y-4">
      <ActionForm
        fields={[
          { key: 'fullName', label: 'Full name or business name', required: true },
          { key: 'dateOfBirth', label: 'Date of birth', kind: 'date' },
          { key: 'nationality', label: 'Nationality' },
          { key: 'userId', label: 'User ID' },
          { key: 'entityType', label: 'Type', kind: 'select', options: ['INDIVIDUAL', 'BUSINESS'] },
        ]}
        submitLabel="Run sanctions check" pending={check.isPending} onSubmit={(v) => check.mutate(v)}
      />
      {check.data !== undefined && <RecordView data={recordOf(check.data)} title="Result" />}
    </div>
  )
}

function Reports() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ReadCard title="Risk summary" query={useRiskSummary()} />
      <ReadCard title="Compliance metrics" query={useComplianceMetrics()} />
    </div>
  )
}

/** Admin → Compliance MS: review queues, user KYC files, sanctions and reports. */
export function KycAdminPage() {
  const [open, setOpen] = useState<{ userId: string; kycId?: string } | null>(null)
  const show = (userId: string, kycId?: string) => userId && setOpen({ userId, kycId })
  return (
    <div>
      <SectionTitle title="KYC & Compliance" sub="Review KYC submissions, documents and risk (Compliance MS)." right={<Lookup onOpen={show} />} />
      <PageTabs tabs={[
        { id: 'pending', label: 'Pending review', content: <ProfileList list="pending" onOpen={show} /> },
        { id: 'high', label: 'High risk', content: <ProfileList list="highRisk" onOpen={show} /> },
        { id: 'profiles', label: 'All profiles', content: <ProfileList list="profiles" onOpen={show} /> },
        { id: 'records', label: 'KYC records', content: <ProfileList list="legacy" onOpen={show} /> },
        { id: 'sanctions', label: 'Sanctions check', content: <Sanctions /> },
        { id: 'reports', label: 'Reports', content: <Reports /> },
      ]} />
      <KycUserSheet target={open} onClose={() => setOpen(null)} />
    </div>
  )
}
