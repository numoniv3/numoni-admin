'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { fmtNaira } from '@/lib/format'
import { DataTable } from '@/components/ui/data-table'
import type { JournalEntry } from '@/lib/api/numoni'

interface JournalTabProps {
  journal: JournalEntry[]
}

export function JournalTab({ journal }: JournalTabProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <div className="text-xs text-muted-foreground">General ledger · {journal.length} entries this month · every entry debits one account and credits another</div>
        <ExportCsvButton
          filename="numoni-general-journal-oct-2026"
          headers={['Entry', 'Date', 'Memo', 'Debit account', 'Credit account', 'Amount (₦)', 'Status', 'Posted by']}
          rows={journal.map((j) => [j.id, j.date, j.memo, j.debit, j.credit, j.amount, j.status, j.by])}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[860px]"
          data={journal}
          getRowId={(j) => j.id}
          headerCellClassName="label-caps font-semibold px-5 py-3"
          rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors"
          cellClassName="px-5 py-3"
          columns={[
            {
              id: 'entry',
              header: 'Entry',
              cell: ({ row: { original: j } }) => (
                <>
                  <div className="font-mono text-xs font-bold text-brand">{j.id}</div>
                  <div className="text-[10px] text-muted-foreground tnum">{j.date}</div>
                </>
              ),
            },
            { id: 'memo', header: 'Memo', meta: { cellClassName: 'font-medium max-w-[260px]' }, cell: ({ row: { original: j } }) => <span className="line-clamp-2">{j.memo}</span> },
            { id: 'debit', header: 'Debit (DR)', meta: { cellClassName: 'text-xs' }, cell: ({ row: { original: j } }) => <span className="inline-flex items-center gap-1"><ArrowDownLeft className="h-3 w-3 text-brand" />{j.debit}</span> },
            { id: 'credit', header: 'Credit (CR)', meta: { cellClassName: 'text-xs' }, cell: ({ row: { original: j } }) => <span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-orangeb" />{j.credit}</span> },
            { id: 'amount', header: 'Amount', meta: { cellClassName: 'tnum font-bold' }, cell: ({ row: { original: j } }) => fmtNaira(j.amount, 0) },
            { id: 'status', header: 'Status', cell: ({ row: { original: j } }) => <Pill tone={j.status === 'Posted' ? 'green' : 'orange'}>{j.status}</Pill> },
            { id: 'postedBy', header: 'Posted by', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: j } }) => j.by },
          ]}
        />
      </div>
    </div>
  )
}
