'use client'

import { Megaphone, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState, Pill } from '@/components/ui/kit'
import type { CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'
import { CampaignActions } from './CampaignActions'
import { STATUS_TONE, STEPS, fmtDate, stepsDone, titleCase } from './campaign-meta'

interface RewardCampaignsTableProps {
  campaigns: CampaignResponseDto[]
  onOpen: (c: CampaignResponseDto) => void
}

export function RewardCampaignsTable({ campaigns, onOpen }: RewardCampaignsTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="card-surface">
        <EmptyState icon={Megaphone} title="No campaigns" sub="Create a campaign: set its details and audience, add rewards, fund it and launch." />
      </div>
    )
  }

  return (
    <div className="card-surface overflow-x-auto">
      <DataTable
        className="w-full text-sm min-w-[980px]"
        data={campaigns}
        getRowId={(c) => c.id}
        rowClassName="border-b last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
        onRowClick={(c) => onOpen(c)}
        columns={[
          {
            id: 'campaign',
            header: 'Campaign',
            meta: { cellClassName: 'min-w-[200px]' },
            cell: ({ row: { original: c } }) => (
              <>
                <div className="font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground tnum">{c.reference} · {fmtDate(c.startDate)} → {fmtDate(c.endDate)}</div>
              </>
            ),
          },
          { id: 'channel', header: 'Channel', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: c } }) => titleCase(c.channel) },
          {
            id: 'setup',
            header: 'Setup',
            cell: ({ row: { original: c } }) => {
              const n = stepsDone(c)
              return (
                <div className="w-24">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-brand" style={{ width: `${(n / STEPS.length) * 100}%` }} /></div>
                  <div className="text-[11px] text-muted-foreground mt-1 tnum">{n}/{STEPS.length} · {STEPS[Math.min(n, STEPS.length - 1)].label}</div>
                </div>
              )
            },
          },
          { id: 'rewards', header: 'Rewards', meta: { cellClassName: 'tnum text-xs' }, cell: ({ row: { original: c } }) => c.rewards?.length ?? 0 },
          {
            id: 'budget',
            header: 'Budget',
            cell: ({ row: { original: c } }) => (
              <div className="text-xs tnum">
                <div className="font-medium">{fmtNaira(c.remainingBudget ?? 0, 0)} <span className="text-muted-foreground font-normal">left</span></div>
                <div className="text-muted-foreground">of {fmtNaira(c.totalBudget ?? 0, 0)}</div>
              </div>
            ),
          },
          { id: 'redemptions', header: 'Redemptions', meta: { cellClassName: 'tnum text-xs' }, cell: ({ row: { original: c } }) => c.redemptionsCount.toLocaleString() },
          { id: 'status', header: 'Status', cell: ({ row: { original: c } }) => <Pill tone={STATUS_TONE[c.status]}>{titleCase(c.status)}</Pill> },
          {
            id: 'actions',
            header: '',
            meta: { stopRowClick: true },
            cell: ({ row: { original: c } }) => (
              <div className="flex items-center gap-1 justify-end">
                <Button size="sm" variant="ghost" className="h-8" title="Manage" onClick={() => onOpen(c)}><Settings2 className="h-3.5 w-3.5" /></Button>
                <CampaignActions campaign={c} />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
