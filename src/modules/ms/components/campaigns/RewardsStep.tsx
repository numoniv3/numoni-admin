'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Pause, Play, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/kit'
import type { CampaignResponseDto, RewardResponseDto, RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import {
  useCampaignRewardsQuery, useRemoveCampaignReward, useSetCampaignRewardStatus, useSyncCampaignReward,
} from '@/modules/ms/api/useCampaignQueries'
import { rewardTemplatesQuery } from '@/modules/ms/api/useRewardQueries'
import { PRIZE_TONE, prizeSummary, ruleSummary } from '@/modules/ms/components/rewards/rule-fields'
import { AttachRewardPanel } from './AttachRewardPanel'
import { isClosed, titleCase } from './campaign-meta'

interface RewardsStepProps {
  campaign: CampaignResponseDto
  onDone: () => void
}

/** Step 3 — the campaign's rewards, attached from the merchant's reward library (managed on the Rewards page). */
export function RewardsStep({ campaign, onDone }: RewardsStepProps) {
  // `GET …/{id}/rewards` (wizard step 3); the campaign payload’s copy shows until it loads.
  const { data: listed } = useCampaignRewardsQuery(campaign.id)
  const rewards = listed ?? campaign.rewards ?? []
  const { data: library = [] } = useQuery(rewardTemplatesQuery())
  const closed = isClosed(campaign.status)
  // The Rewards page sits beside the Campaigns page in every app that has both.
  const rewardsHref = usePathname().replace(/\/campaigns(\/.*)?$/, '/rewards')

  return (
    <div className="space-y-4">
      {rewards.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">No rewards on this campaign yet.</div>
      ) : (
        <div className="rounded-2xl border divide-y">
          {rewards.map((r) => (
            <CampaignRewardRow key={r.id} reward={r} campaign={campaign} template={library.find((t) => t.id === r.templateId)} closed={closed} />
          ))}
        </div>
      )}

      {!closed && <AttachRewardPanel campaignId={campaign.id} library={library} attached={rewards} />}

      <Button asChild variant="outline" className="w-full rounded-full">
        <Link href={rewardsHref}>Create or edit rewards in your library →</Link>
      </Button>

      <Button onClick={onDone} disabled={rewards.length === 0} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {rewards.length === 0 ? 'Attach at least one reward to continue' : 'Continue to budget'}
      </Button>
    </div>
  )
}

interface CampaignRewardRowProps {
  reward: RewardResponseDto
  campaign: CampaignResponseDto
  /** The library reward it was copied from, when it's still active. */
  template?: RewardTemplateResponseDto
  closed: boolean
}

function CampaignRewardRow({ reward: r, campaign, template, closed }: CampaignRewardRowProps) {
  const sync = useSyncCampaignReward()
  const setStatus = useSetCampaignRewardStatus()
  const remove = useRemoveCampaignReward()
  const ids = { campaignId: campaign.id, rewardId: r.id, name: r.name }
  const active = r.status === 'ACTIVE'
  // A live campaign never changes payout silently: syncing is allowed only while it's not running.
  const outdated = !!template && !!r.templateVersion && template.version > r.templateVersion
  const canSync = outdated && ['DRAFT', 'SCHEDULED', 'PAUSED'].includes(campaign.status)
  const busy = sync.isPending || setStatus.isPending || remove.isPending

  return (
    <div className="px-4 py-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{r.name}</div>
        <div className="text-[11px] text-muted-foreground tnum">{ruleSummary(r)} → {prizeSummary(r)}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {r.templateId ? `From your library · v${r.templateVersion ?? 1}` : 'Added directly to this campaign'}
          {outdated && <span className="text-orange-500"> · v{template!.version} available{canSync ? '' : ' — pause the campaign to update'}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Pill tone={PRIZE_TONE[r.prizeType]}>{titleCase(r.prizeType)}</Pill>
        <Pill tone={active ? 'green' : 'orange'}>{titleCase(r.status)}</Pill>
        {!closed && (
          <>
            {canSync && (
              <Button size="sm" variant="ghost" className="h-8" title={`Update to v${template!.version}`} disabled={busy} onClick={() => sync.mutate(ids)}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8" title={active ? 'Pause' : 'Resume'} disabled={busy} onClick={() => setStatus.mutate({ ...ids, status: active ? 'PAUSED' : 'ACTIVE' })}>
              {active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-red-500" title="Remove from campaign" disabled={busy} onClick={() => remove.mutate(ids)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
