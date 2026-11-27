'use client'

import { Gift, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState, Pill } from '@/components/ui/kit'
import type { RewardRuleTypeOptionDto, RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import { DeleteRewardButton } from './DeleteRewardButton'
import { PRIZE_TONE, prizeSummary, ruleSummary } from './rule-fields'

const titleCase = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, ' ')

interface RewardsTableProps {
  rewards: RewardTemplateResponseDto[]
  ruleTypes: RewardRuleTypeOptionDto[]
  onEdit: (reward: RewardTemplateResponseDto) => void
}

export function RewardsTable({ rewards, ruleTypes, onEdit }: RewardsTableProps) {
  const ruleLabel = (r: RewardTemplateResponseDto) => ruleTypes.find((t) => t.value === r.ruleType)?.label ?? titleCase(r.ruleType)

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
                <div className="text-[11px] text-muted-foreground tnum">{r.reference} · v{r.version}</div>
              </>
            ),
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
          {
            id: 'used',
            header: 'Used in',
            meta: { cellClassName: 'text-xs tnum' },
            cell: ({ row: { original: r } }) => (r.linkedRewardCount ? `${r.linkedRewardCount} campaign${r.linkedRewardCount > 1 ? 's' : ''}` : <span className="text-muted-foreground">Not in a campaign</span>),
          },
          { id: 'status', header: 'Status', cell: ({ row: { original: r } }) => <Pill tone={r.status === 'ACTIVE' ? 'green' : 'neutral'}>{titleCase(r.status)}</Pill> },
          {
            id: 'actions',
            header: '',
            meta: { stopRowClick: true },
            cell: ({ row: { original: r } }) => r.status === 'ACTIVE' && (
              <div className="flex items-center gap-1 justify-end">
                <Button size="sm" variant="ghost" className="h-8" title="Edit" onClick={() => onEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                <DeleteRewardButton reward={r} />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
