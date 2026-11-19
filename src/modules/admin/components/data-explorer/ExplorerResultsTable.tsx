'use client'

import { Pill } from '@/components/ui/kit'
import { fmtNairaCompact, fmtNum, fmtCompact } from '@/lib/format'
import { type ExplorerCustomer } from '@/lib/api/numoni/types/admin'
import { DataTable } from '@/components/ui/data-table'

interface ExplorerResultsTableProps {
  results: ExplorerCustomer[]
  totalValue: number
}

export function ExplorerResultsTable({ results, totalValue }: ExplorerResultsTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          data={results.slice(0, 24)}
          getRowId={(c) => c.id}
          headerRowClassName="border-b text-left text-[10px] uppercase tracking-wide text-muted-foreground"
          headerCellClassName="p-3 font-semibold"
          rowClassName="border-b last:border-0 hover:bg-accent/30"
          rowMotion={(i) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: Math.min(i * 0.02, 0.4) } })}
          cellClassName="p-3"
          emptyCellClassName="p-10 text-center text-sm text-muted-foreground"
          emptyState={<>No customers match this combination — loosen a filter.</>}
          columns={[
            {
              id: 'customer',
              header: 'Customer',
              cell: ({ row: { original: c } }) => (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand text-[10px] font-bold shrink-0">{c.alias.split(' ').map((w) => w[0]).join('')}</span>
                  <div>
                    <div className="text-xs font-semibold">{c.alias}</div>
                    <div className="text-[10px] text-muted-foreground tnum">{c.id} · {c.gender}</div>
                  </div>
                </div>
              ),
            },
            { id: 'age', header: 'Age', meta: { cellClassName: 'text-xs tnum' }, cell: ({ row: { original: c } }) => c.age },
            { id: 'location', header: 'Location', meta: { cellClassName: 'text-xs' }, cell: ({ row: { original: c } }) => c.location },
            { id: 'type', header: 'Type', cell: ({ row: { original: c } }) => <Pill tone={c.source === 'Fintech' ? 'purple' : c.source === 'FMCG' ? 'orange' : c.source === 'Brand' ? 'sky' : 'green'}>{c.source}</Pill> },
            { id: 'industry', header: 'Industry', meta: { cellClassName: 'text-xs' }, cell: ({ row: { original: c } }) => c.industry },
            { id: 'segment', header: 'Segment', meta: { cellClassName: 'text-xs' }, cell: ({ row: { original: c } }) => c.segment },
            { id: 'kyc', header: 'KYC', meta: { cellClassName: 'text-xs tnum' }, cell: ({ row: { original: c } }) => <>T{c.kyc}</> },
            { id: 'lifetime', header: 'Lifetime', meta: { headerClassName: 'text-right', cellClassName: 'text-xs tnum text-right font-semibold' }, cell: ({ row: { original: c } }) => fmtNairaCompact(c.lifetime) },
            { id: 'visits', header: 'Visits', meta: { headerClassName: 'text-right', cellClassName: 'text-xs tnum text-right' }, cell: ({ row: { original: c } }) => c.visits },
            { id: 'status', header: 'Status', cell: ({ row: { original: c } }) => <Pill tone={c.status === 'Active' ? 'green' : c.status === 'New' ? 'sky' : 'neutral'}>{c.status}</Pill> },
          ]}
        />
      </div>
      {results.length > 24 && (
        <div className="p-3 border-t text-center text-[11px] text-muted-foreground">
          Showing 24 of {fmtNum(results.length)} — export CSV for the full segment ({fmtCompact(totalValue)} lifetime value).
        </div>
      )}
    </div>
  )
}
