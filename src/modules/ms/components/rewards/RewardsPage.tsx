'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import { useRewardEnumsQuery, useRewardTemplatesQuery } from '@/modules/ms/api/useRewardQueries'
import { RewardFormSheet } from './RewardFormSheet'
import { RewardsTable } from './RewardsTable'
import { useRewardForm } from './use-reward-form'

// ── REWARDS (Reward MS: the merchant's reward library — reusable rule → prize templates) ──
export function RewardsPage() {
  const { data: enums } = useRewardEnumsQuery()
  const [status, setStatus] = useState<RewardTemplateResponseDto['status']>('ACTIVE')
  const { data: rewards } = useRewardTemplatesQuery({ status })
  const form = useRewardForm()

  return (
    <div>
      <SectionTitle
        title="Rewards"
        sub="Your reward library — trigger rules and what customers get. Add them to campaigns from a campaign’s Rewards step."
        right={
          <Button onClick={() => form.openAdd()} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold">
            <Plus className="h-4 w-4 mr-1.5" /> Create Reward
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active rewards</SelectItem>
            <SelectItem value="ARCHIVED">Archived rewards</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          Editing a reward creates a new version; campaigns already using it keep their copy.
        </span>
      </div>

      <RewardsTable rewards={rewards} ruleTypes={enums.rewardRuleTypes} onEdit={form.openEdit} />

      <RewardFormSheet form={form} enums={enums} />
    </div>
  )
}
