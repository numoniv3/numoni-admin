'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRewardCampaignsQuery, useRewardEnumsQuery } from '@/modules/ms/api/useRewardQueries'
import { RewardFormSheet } from './RewardFormSheet'
import { RewardsTable } from './RewardsTable'
import { useRewardForm } from './use-reward-form'

const ALL = '__all__'

// ── REWARDS (Reward MS: each campaign's rule → prize rewards) ────────────────
export function RewardsPage() {
  const { data: enums } = useRewardEnumsQuery()
  const { data: view } = useRewardCampaignsQuery()
  // `?campaign=<id>` (from a campaign's Rewards step) opens filtered to that campaign.
  const linked = useSearchParams().get('campaign')
  const [campaignId, setCampaignId] = useState(() => (linked && view.campaigns.some((c) => c.id === linked) ? linked : ALL))
  const form = useRewardForm()

  const campaigns = view.campaigns
  const rewards = campaigns.filter((c) => campaignId === ALL || c.id === campaignId).flatMap((c) => c.rewards ?? [])
  const notLive = campaigns.filter((c) => c.rewards?.length && (c.status === 'DRAFT' || c.status === 'PAUSED')).length

  return (
    <div>
      <SectionTitle
        title="Rewards"
        sub="Trigger rules and what customers get — each reward belongs to a campaign."
        right={
          <Button onClick={() => form.openAdd(campaignId === ALL ? '' : campaignId)} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold">
            <Plus className="h-4 w-4 mr-1.5" /> Create Reward
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={campaignId} onValueChange={setCampaignId}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All campaigns ({campaigns.length})</SelectItem>
            {campaigns.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} · {c.rewards?.length ?? 0} rewards</SelectItem>)}
          </SelectContent>
        </Select>
        {notLive > 0 && (
          <span className="text-xs text-muted-foreground">
            {notLive} campaign{notLive > 1 ? 's have' : ' has'} rewards but {notLive > 1 ? 'aren’t' : 'isn’t'} live — rewards pay out only while their campaign is active.
          </span>
        )}
      </div>

      <RewardsTable rewards={rewards} campaigns={campaigns} ruleTypes={enums.rewardRuleTypes} onEdit={form.openEdit} />

      <RewardFormSheet form={form} enums={enums} campaigns={campaigns} />
    </div>
  )
}
