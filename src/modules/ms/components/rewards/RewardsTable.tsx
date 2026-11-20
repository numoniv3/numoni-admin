'use client'

import { Gift, Pause, Pencil, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState, Pill } from '@/components/ui/kit'
import type { CampaignResponseDto, RewardResponseDto, RewardRuleTypeOptionDto } from '@/lib/api/numoni/types/rewards'
import { useSetRewardStatus } from '@/modules/ms/api/useRewardQueries'
import { DeleteRewardButton } from './DeleteRewardButton'
import { PRIZE_TONE, prizeSummary, ruleSummary } from './rule-fields'

const CAMPAIGN_TONE: Record<CampaignResponseDto['status'], 'green' | 'sky' | 'neutral' | 'orange' | 'purple' | 'red'> = {
  ACTIVE: 'green', SCHEDULED: 'sky', DRAFT: 'neutral', PAUSED: 'orange', COMPLETED: 'purple', CANCELLED: 'red',
}
const titleCase = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, ' ')

interface RewardsTableProps {
  rewards: RewardResponseDto[]
  campaigns: CampaignResponseDto[]
  ruleTypes: RewardRuleTypeOptionDto[]
  onEdit: (reward: RewardResponseDto) => void
}

export function RewardsTable({ rewards, campaigns, ruleTypes, onEdit }: RewardsTableProps) {
  const setStatus = useSetRewardStatus()
  const campaignOf = (r: RewardResponseDto) => campaigns.find((c) => c.id === r.campaignId)
  const ruleLabel = (r: RewardResponseDto) => ruleTypes.find((t) => t.value === r.ruleType)?.label ?? titleCase(r.ruleType)

  if (rewards.length === 0) {
    return (
      <div className="card-surface">
        <EmptyState icon={Gift} title="No rewards yet" sub="Create a reward: pick a trigger and what the customer gets when it matches." />
      </div>
    )
  }

  return (
    <div className="card-surface overflow-x-auto">
      <DataTable
        className="w-full text-sm min-w-[960px]"
        data={rewards}
        getRowId={(r) => r.id}
        rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors"
        columns={[
          {
            id: 'reward',
            header: 'Reward',
            meta: { cellClassName: 'min-w-[180px]' },
            cell: ({ row: { original: r } }) => (
              <>
                <div className="font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground tnum">{r.reference}</div>
              </>
            ),
          },
          {
            id: 'campaign',
            header: 'Campaign',
            cell: ({ row: { original: r } }) => {
              const c = campaignOf(r)
              return c ? <div className="space-y-1"><div className="text-xs font-medium">{c.name}</div><Pill tone={CAMPAIGN_TONE[c.status]}>{titleCase(c.status)}</Pill></div> : '—'
            },
          },
          {
            id: 'rule',
            header: 'Trigger',
            cell: ({ row: { original: r } }) => (
              <div className="space-y-1">
                <Pill tone="sky">{ruleLabel(r)}</Pill>
                <div className="text-[11px] text-muted-foreground tnum">{ruleSummary(r)}</div>
              </div>
            ),
          },
          {
            id: 'prize',
            header: 'Customer gets',
            cell: ({ row: { original: r } }) => (
              <div className="space-y-1">
                <Pill tone={PRIZE_TONE[r.prizeType]}>{titleCase(r.prizeType)}</Pill>
                <div className="text-[11px] tnum">{prizeSummary(r)}</div>
              </div>
            ),
          },
          { id: 'direction', header: 'Direction', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: r } }) => titleCase(r.rewardDirection.replace('_REWARD', '')) },
          { id: 'status', header: 'Status', cell: ({ row: { original: r } }) => <Pill tone={r.status === 'ACTIVE' ? 'green' : 'orange'}>{titleCase(r.status)}</Pill> },
          {
            id: 'actions',
            header: '',
            meta: { stopRowClick: true },
            cell: ({ row: { original: r } }) => {
              const active = r.status === 'ACTIVE'
              const busy = setStatus.isPending && setStatus.variables?.rewardId === r.id
              return (
                <div className="flex items-center gap-1 justify-end">
                  <Button size="sm" variant="ghost" className="h-8" title="Edit" onClick={() => onEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button
                    size="sm" variant="ghost" className="h-8" title={active ? 'Pause' : 'Resume'} disabled={busy}
                    onClick={() => setStatus.mutate({ campaignId: r.campaignId, rewardId: r.id, status: active ? 'PAUSED' : 'ACTIVE', name: r.name })}
                  >
                    {active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </Button>
                  <DeleteRewardButton reward={r} />
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}
