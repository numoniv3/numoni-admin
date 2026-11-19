'use client'

import { Eye, Pause, Play } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtCompact, fmtNairaCompact } from '@/lib/format'
import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'
import { DataTable } from '@/components/ui/data-table'
import { perfOf } from '@/modules/admin/components/rewards/perf-of'
import type { Dispatch, SetStateAction } from 'react'

interface RewardProgramsTableProps {
  rows: RewardProgram[]
  setPreview: Dispatch<SetStateAction<RewardProgram | null>>
  toggle: (id: string) => void
}

export function RewardProgramsTable({ rows, setPreview, toggle }: RewardProgramsTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[980px]"
          data={rows}
          getRowId={(r) => r.id}
          headerCellClassName="label-caps font-semibold px-5 py-3"
          rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors cursor-pointer"
          onRowClick={(r) => setPreview(r)}
          cellClassName="px-5 py-3"
          columns={[
            {
              id: 'reward',
              header: 'Reward',
              cell: ({ row: { original: r } }) => (
                <>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground tnum">{r.id} · {r.owner}</div>
                </>
              ),
            },
            { id: 'type', header: 'Type', cell: ({ row: { original: r } }) => <Pill tone={r.type === 'Coupon' ? 'purple' : r.type === 'Raffle' ? 'orange' : r.type === 'Gift' ? 'sky' : 'green'}>{r.type}</Pill> },
            { id: 'issued', header: 'Issued', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: r } }) => fmtCompact(r.issued) },
            { id: 'redeemed', header: 'Redeemed', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: r } }) => fmtCompact(r.redeemed) },
            {
              id: 'redemption',
              header: 'Redemption',
              cell: ({ row: { original: r } }) => {
                const rate = Math.round((r.redeemed / r.issued) * 100)
                return (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: rate + '%', background: rate >= 50 ? '#02DC4D' : '#E8A33D' }} />
                    </div>
                    <span className="tnum text-xs font-semibold">{rate}%</span>
                  </div>
                )
              },
            },
            { id: 'cost', header: 'Cost', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: r } }) => fmtNairaCompact(r.cost) },
            { id: 'revenueInfluenced', header: 'Revenue influenced', meta: { cellClassName: 'tnum font-semibold' }, cell: ({ row: { original: r } }) => fmtNairaCompact(r.revenue) },
            {
              id: 'performance',
              header: 'Performance',
              cell: ({ row: { original: r } }) => {
                const perf = perfOf(r)
                return <Pill tone={perf === 'Performing' ? 'green' : 'orange'}>{perf}</Pill>
              },
            },
            { id: 'status', header: 'Status', cell: ({ row: { original: r } }) => <Pill tone={r.active ? 'green' : 'neutral'}>{r.active ? 'Active' : 'Inactive'}</Pill> },
            {
              id: 'actions',
              header: 'Actions',
              meta: { stopRowClick: true },
              cell: ({ row: { original: r } }) => (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setPreview(r)}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" className="h-8" onClick={() => toggle(r.id)}>
                    {r.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
