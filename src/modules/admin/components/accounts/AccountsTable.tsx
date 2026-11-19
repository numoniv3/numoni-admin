'use client'

import { Pill } from '@/components/ui/kit'
import { DataTable } from '@/components/ui/data-table'
import { fmtNairaCompact } from '@/lib/format'
import type { PlatformAccount } from '@/lib/api/numoni/types/admin'
import { STATUS_TONE, statusLabel, typeLabel } from '../../lib/account-labels'

const joined = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

export function AccountsTable({ rows, onOpen }: { rows: PlatformAccount[]; onOpen: (a: PlatformAccount) => void }) {
  return (
    <div className="card-surface overflow-x-auto">
      <DataTable
        className="w-full text-sm min-w-[860px]"
        data={rows}
        getRowId={(a) => a.universalId}
        rowClassName="border-b last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
        onRowClick={onOpen}
        emptyState="No accounts match these filters."
        emptyCellClassName="px-4 py-10 text-center text-muted-foreground"
        columns={[
          {
            id: 'account',
            header: 'Account',
            cell: ({ row: { original: a } }) => (
              <div className="min-w-0">
                <div className="font-semibold truncate">{a.name}</div>
                <div className="text-[11px] text-muted-foreground tnum truncate">{[a.phone, a.email].filter(Boolean).join(' · ') || a.universalId}</div>
              </div>
            ),
          },
          { id: 'type', header: 'Type', cell: ({ row: { original: a } }) => typeLabel(a) },
          { id: 'kyc', header: 'KYC', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: a } }) => `Tier ${a.kycTier}` },
          { id: 'status', header: 'Status', cell: ({ row: { original: a } }) => <Pill tone={STATUS_TONE[a.accountStatus]}>{statusLabel(a.accountStatus)}</Pill> },
          {
            id: 'limits',
            header: 'Pay-in / pay-out',
            meta: { cellClassName: 'tnum' },
            cell: ({ row: { original: a } }) => (a.limits ? `${fmtNairaCompact(a.limits.payin)} / ${fmtNairaCompact(a.limits.payout)}` : '—'),
          },
          { id: 'joined', header: 'Joined', meta: { cellClassName: 'tnum text-muted-foreground' }, cell: ({ row: { original: a } }) => joined(a.createdAt) },
        ]}
      />
    </div>
  )
}
