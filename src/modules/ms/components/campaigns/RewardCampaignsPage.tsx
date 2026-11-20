'use client'

import { SectionTitle } from '@/components/ui/kit'
import { CampaignsManager } from './CampaignsManager'

/** Reward MS campaigns as a page of its own (brand, enterprise). The merchant app nests `CampaignsManager` in its tabs. */
export function RewardCampaignsPage() {
  return (
    <div>
      <SectionTitle title="Campaigns" sub="Set up a campaign, add its rewards, lock a budget and launch — then pause, resume or stop it." />
      <CampaignsManager />
    </div>
  )
}
