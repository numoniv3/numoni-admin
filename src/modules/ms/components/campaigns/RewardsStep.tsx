'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CampaignResponseDto, CreateRewardDto, RewardResponseDto } from '@/lib/api/numoni/types/rewards'
import { useCampaignRewardsQuery, useSetCampaignRewards } from '@/modules/ms/api/useCampaignQueries'
import { PRIZE_TONE, prizeSummary, ruleSummary } from '@/modules/ms/components/rewards/rule-fields'
import { titleCase } from './campaign-meta'

/** A saved reward as a create body — for copying it onto another campaign. */
const asNewReward = (r: RewardResponseDto): CreateRewardDto => ({
  name: r.name, rewardDirection: r.rewardDirection, ruleType: r.ruleType, ruleConfig: r.ruleConfig, prizeType: r.prizeType,
  prizeValue: r.prizeValue ?? undefined, giftDetails: r.giftDetails, couponDetails: r.couponDetails, raffleDetails: r.raffleDetails,
  maxRewardPerUser: r.maxRewardPerUser ?? undefined, maxRewardPerTxn: r.maxRewardPerTxn ?? undefined,
})

interface RewardsStepProps {
  campaign: CampaignResponseDto
  /** Other campaigns whose rewards can be copied here. */
  others: CampaignResponseDto[]
  onDone: () => void
}

/** Step 3 — the campaign's rewards. Single rewards are managed on the Rewards page; this copies a whole set (`PUT …/rewards`). */
export function RewardsStep({ campaign, others, onDone }: RewardsStepProps) {
  const replace = useSetCampaignRewards()
  const [source, setSource] = useState('')
  // `GET …/{id}/rewards` (wizard step 3); the campaign payload’s copy shows until it loads.
  const { data: listed } = useCampaignRewardsQuery(campaign.id)
  const rewards = listed ?? campaign.rewards ?? []
  const donors = others.filter((c) => c.id !== campaign.id && c.rewards?.length)

  const copy = () => {
    const from = donors.find((c) => c.id === source)
    if (from) replace.mutate({ campaignId: campaign.id, rewards: from.rewards.map(asNewReward) }, { onSuccess: () => setSource('') })
  }

  return (
    <div className="space-y-4">
      {rewards.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">No rewards on this campaign yet.</div>
      ) : (
        <div className="rounded-2xl border divide-y">
          {rewards.map((r) => (
            <div key={r.id} className="px-4 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground tnum">{ruleSummary(r)} → {prizeSummary(r)}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Pill tone={PRIZE_TONE[r.prizeType]}>{titleCase(r.prizeType)}</Pill>
                <Pill tone={r.status === 'ACTIVE' ? 'green' : 'orange'}>{titleCase(r.status)}</Pill>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button asChild variant="outline" className="w-full rounded-full">
        <Link href={`/merchant/programs?campaign=${encodeURIComponent(campaign.id)}`}>Add or edit rewards on the Rewards page →</Link>
      </Button>

      {donors.length > 0 && (
        <div className="rounded-2xl border p-4">
          <div className="label-caps mb-2">Copy rewards from another campaign</div>
          <div className="flex gap-2">
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Pick a campaign…" /></SelectTrigger>
              <SelectContent>{donors.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} · {c.rewards.length} rewards</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={copy} disabled={!source || replace.isPending} variant="outline">{replace.isPending ? 'Copying…' : 'Replace'}</Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Replaces every reward on this campaign with copies of the other campaign’s rewards.</p>
        </div>
      )}

      <Button onClick={onDone} disabled={rewards.length === 0} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {rewards.length === 0 ? 'Add at least one reward to continue' : 'Continue to budget'}
      </Button>
    </div>
  )
}
