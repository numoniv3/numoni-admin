'use client'

import { Check, Eye, X } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtNairaCompact } from '@/lib/format'
import { type Campaign } from '@/lib/api/numoni/types/platform'
import { DataTable } from '@/components/ui/data-table'
import { tone } from '@/modules/admin/components/campaigns/tone'
import type { Dispatch, SetStateAction } from 'react'

interface CampaignTableProps {
  approve: (id: string, ok: boolean) => void
  filtered: Campaign[]
  setPreview: Dispatch<SetStateAction<Campaign | null>>
  togglePause: (id: string) => void
}

export function CampaignTable({ approve, filtered, setPreview, togglePause }: CampaignTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[980px]"
          data={filtered}
          getRowId={(c) => c.id}
          headerCellClassName="label-caps font-semibold px-5 py-3"
          rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors cursor-pointer"
          onRowClick={(c) => setPreview(c)}
          cellClassName="px-5 py-3"
          columns={[
            {
              id: 'campaign',
              header: 'Campaign',
              cell: ({ row: { original: c } }) => (
                <>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground tnum">{c.id} · {c.owner} · {c.window}</div>
                </>
              ),
            },
            { id: 'merchantType', header: 'Merchant type', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: c } }) => c.merchantType },
            { id: 'model', header: 'Model', cell: ({ row: { original: c } }) => <Pill tone={c.model === 'V2' ? 'purple' : c.model === 'V3' ? 'orange' : 'green'}>{c.model}</Pill> },
            {
              id: 'escrowPacing',
              header: 'Escrow pacing',
              meta: { cellClassName: 'w-52' },
              cell: ({ row: { original: c } }) => {
                const pct = Math.min(100, Math.round((c.spent / c.budget) * 100))
                return (
                  <>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="tnum font-semibold">{fmtNairaCompact(c.spent)} / {fmtNairaCompact(c.budget)}</span>
                      <span className="text-muted-foreground tnum">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${pct > 90 ? 'bg-orangeb' : 'bg-brand'}`} style={{ width: pct + '%' }} />
                    </div>
                  </>
                )
              },
            },
            {
              id: 'roi',
              header: 'ROI',
              meta: { cellClassName: 'tnum font-bold text-brand' },
              cell: ({ row: { original: c } }) => {
                const roi = c.spent > 0 ? (c.sales / c.spent).toFixed(1) : '—'
                return <>{roi}×</>
              },
            },
            { id: 'status', header: 'Status', cell: ({ row: { original: c } }) => <Pill tone={tone[c.status]}>{c.status}</Pill> },
            {
              id: 'actions',
              header: 'Actions',
              meta: { stopRowClick: true },
              cell: ({ row: { original: c } }) => (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setPreview(c)}><Eye className="h-3.5 w-3.5" /></Button>
                  {c.status === 'Pending Approval' ? (
                    <>
                      <Button size="sm" className="h-8 bg-brand text-black hover:bg-brand/90" onClick={() => approve(c.id, true)}><Check className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" className="h-8 text-red-500 border-red-500/30" onClick={() => approve(c.id, false)}><X className="h-3.5 w-3.5" /></Button>
                    </>
                  ) : (c.status === 'Live' || c.status === 'Paused') && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => togglePause(c.id)}>{c.status === 'Live' ? 'Pause' : 'Resume'}</Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
