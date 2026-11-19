'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { SectionTitle } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { useAdminKycQueueQuery } from '../../api/useAdminQueries'
import { KycDocumentsSheet } from '@/modules/admin/components/kyc/KycDocumentsSheet'
import { ProviderStatusCard } from '@/modules/admin/components/kyc/ProviderStatusCard'
import { TierLaddersCard } from '@/modules/admin/components/kyc/TierLaddersCard'
import { KycQueueCard } from '@/modules/admin/components/kyc/KycQueueCard'
import { kindGroup } from '@/modules/admin/components/kyc/kind-group'

export function KycPage() {
  const { data: kycQueue } = useAdminKycQueueQuery()
  const [queue, setQueue] = useState(kycQueue)
  const [viewing, setViewing] = useState<(typeof kycQueue)[number] | null>(null)
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [risk, setRisk] = useState('all')

  const rows = queue.filter((r) =>
    (q === '' || r.name.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase())) &&
    (type === 'all' || kindGroup(r.kind) === type) &&
    (risk === 'all' || (risk === 'high' ? r.score >= 85 : risk === 'review' ? r.score >= 70 && r.score < 85 : r.score < 70)),
  )

  const decide = (id: string, ok: boolean) => {
    const item = queue.find((x) => x.id === id)
    setQueue((xs) => xs.filter((x) => x.id !== id))
    if (ok) toast.success(`${item?.name} approved`, { description: 'Tier upgraded · audit entry written' })
    else toast.error(`${item?.name} denied`, { description: 'Reason sent via SMS · audit entry written' })
  }

  return (
    <div>
      <SectionTitle
        title="KYC & Compliance"
        sub="Verification queue built for volume — search, filter by entity type and risk band, decide in one click."
        right={
          <ExportCsvButton
            filename="numoni-kyc-queue"
            headers={['ID', 'Entity', 'Type', 'Document', 'Provider', 'Match score', 'Submitted']}
            rows={rows.map((r) => [r.id, r.name, r.kind, r.doc, r.provider, `${r.score}%`, r.submitted])}
          />
        }
      />

      {/* queue table */}
      <KycQueueCard decide={decide} q={q} risk={risk} rows={rows} setQ={setQ} setRisk={setRisk} setType={setType} setViewing={setViewing} type={type} />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Tier ladders */}
        <TierLaddersCard />

        {/* Provider status + rate limits */}
        <ProviderStatusCard />
      </div>

      {/* Document viewer — side modal */}
      <KycDocumentsSheet decide={decide} setViewing={setViewing} viewing={viewing} />
    </div>
  )
}
