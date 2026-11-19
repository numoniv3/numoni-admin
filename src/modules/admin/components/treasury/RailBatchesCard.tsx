'use client'

import { useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Button } from '@/components/ui/button'
import { fmtNairaCompact, fmtNum } from '@/lib/format'
import type { BatchStatus, RailBatch } from '@/lib/api/numoni/types/admin'
import { DataTable } from '@/components/ui/data-table'

const batchTone: Record<BatchStatus, 'green' | 'orange' | 'neutral' | 'red' | 'sky'> = { Paid: 'green', Processing: 'orange', Queued: 'neutral', Held: 'sky', Failed: 'red' }

interface RailBatchesCardProps {
  batchSeed: RailBatch[]
}

export function RailBatchesCard({ batchSeed }: RailBatchesCardProps) {
  const [batches, setBatches] = useState<RailBatch[]>(batchSeed)
  const setBatch = (id: string, status: BatchStatus, note: string) => {
    setBatches((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)))
    toast.success(note, { description: `${id} · dual-control approval logged` })
  }

  return (
    <div className="card-surface p-5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold">Settlement batches by rail</h3>
          <p className="text-xs text-muted-foreground">Hold, release, retry, or force-run any batch — every action is dual-approved and audited</p>
        </div>
        <ExportCsvButton
          filename="settlement-batches"
          headers={['Batch', 'Rail', 'Window', 'Transactions', 'Gross ₦', 'Fees ₦', 'Net ₦', 'Status']}
          rows={batches.map((b) => [b.id, b.rail, b.window, b.txns, b.gross, b.fees, b.net, b.status])}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[860px]"
          data={batches}
          getRowId={(b) => b.id}
          headerCellClassName="label-caps font-semibold px-3 py-2.5"
          rowClassName="border-b last:border-0 hover:bg-accent/30"
          cellClassName="px-3 py-3"
          columns={[
            { id: 'batch', header: 'Batch', meta: { cellClassName: 'font-mono text-xs font-semibold' }, cell: ({ row: { original: b } }) => b.id },
            { id: 'rail', header: 'Rail', meta: { cellClassName: 'font-medium' }, cell: ({ row: { original: b } }) => b.rail },
            { id: 'window', header: 'Window', meta: { cellClassName: 'text-xs text-muted-foreground tnum' }, cell: ({ row: { original: b } }) => b.window },
            { id: 'txns', header: 'Txns', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: b } }) => fmtNum(b.txns) },
            { id: 'gross', header: 'Gross', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: b } }) => fmtNairaCompact(b.gross) },
            { id: 'fees', header: 'Fees', meta: { cellClassName: 'tnum text-muted-foreground' }, cell: ({ row: { original: b } }) => fmtNairaCompact(b.fees) },
            { id: 'netPayable', header: 'Net payable', meta: { cellClassName: 'tnum font-bold' }, cell: ({ row: { original: b } }) => fmtNairaCompact(b.net) },
            { id: 'status', header: 'Status', cell: ({ row: { original: b } }) => <Pill tone={batchTone[b.status]}>{b.status}</Pill> },
            {
              id: 'actions',
              header: 'Actions',
              cell: ({ row: { original: b } }) => (
                <div className="flex gap-1.5">
                  {b.status !== 'Held' && b.status !== 'Paid' && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5" onClick={() => setBatch(b.id, 'Held', 'Batch held')}>
                      <Pause className="h-3 w-3 mr-1" /> Hold
                    </Button>
                  )}
                  {b.status === 'Held' && (
                    <Button size="sm" className="h-7 text-[11px] px-2.5 bg-brand text-black hover:bg-brand/90" onClick={() => setBatch(b.id, 'Queued', 'Batch released to queue')}>
                      <Play className="h-3 w-3 mr-1" /> Release
                    </Button>
                  )}
                  {b.status === 'Failed' && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 text-orangeb" onClick={() => setBatch(b.id, 'Processing', 'Retrying batch')}>
                      <RotateCcw className="h-3 w-3 mr-1" /> Retry
                    </Button>
                  )}
                  {b.status === 'Queued' && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5" onClick={() => setBatch(b.id, 'Processing', 'Force-running batch')}>
                      <Play className="h-3 w-3 mr-1" /> Force run
                    </Button>
                  )}
                  {b.status === 'Paid' && <span className="text-[10px] text-muted-foreground">—</span>}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
