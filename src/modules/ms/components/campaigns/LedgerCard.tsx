'use client'

import { DataTable } from '@/components/ui/data-table'
import { Pill } from '@/components/ui/kit'
import { fmtNaira } from '@/lib/format'
import { useCampaignLedgerQuery } from '@/modules/ms/api/useCampaignQueries'
import { fmtDate, titleCase } from './campaign-meta'

const ENTRY_TONE = { LOCK: 'sky', TOP_UP: 'sky', DRAWDOWN: 'orange', REVERSAL_CREDIT: 'green', RELEASE: 'purple' } as const

/** The campaign's escrow history — `GET …/ledger`. */
export function LedgerCard({ campaignId }: { campaignId: string }) {
  const { data, isLoading, isError } = useCampaignLedgerQuery(campaignId, true)

  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="px-4 py-3 border-b label-caps">Escrow ledger</div>
      {isLoading ? (
        <div className="p-4 text-xs text-muted-foreground">Loading…</div>
      ) : isError || !data ? (
        <div className="p-4 text-xs text-muted-foreground">Couldn’t load the ledger.</div>
      ) : data.ledger.length === 0 ? (
        <div className="p-4 text-xs text-muted-foreground">No escrow movements yet — they start when the budget is locked.</div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <DataTable
            className="w-full text-xs"
            data={data.ledger}
            getRowId={(e) => e.reference}
            headerCellClassName="label-caps font-semibold px-3 py-2"
            cellClassName="px-3 py-2"
            columns={[
              { id: 'type', header: 'Entry', cell: ({ row: { original: e } }) => <Pill tone={ENTRY_TONE[e.entryType]}>{titleCase(e.entryType)}</Pill> },
              { id: 'amount', header: 'Amount', meta: { cellClassName: 'tnum font-medium' }, cell: ({ row: { original: e } }) => fmtNaira(e.amount, 0) },
              { id: 'balance', header: 'Balance', meta: { cellClassName: 'tnum text-muted-foreground' }, cell: ({ row: { original: e } }) => fmtNaira(e.balanceAfter, 0) },
              { id: 'when', header: 'When', meta: { cellClassName: 'text-muted-foreground whitespace-nowrap' }, cell: ({ row: { original: e } }) => fmtDate(e.createdAt) },
            ]}
          />
        </div>
      )}
    </div>
  )
}
