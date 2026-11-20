'use client'

import * as Card from '@/lib/api/numoni/card.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import * as R from '@/lib/api/numoni/rewards.api'
import { useMsQuery } from '@/modules/ms/api/ms-hooks'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'

/* Every single-list lookup the Reward and Card services expose — one card each. */

const KR = numoniKeys.rewards
const KC = numoniKeys.card

const REWARD = [
  ['Reward directions', KR.getRewardDirections(), R.getRewardDirections],
  ['Rule types', KR.getRewardRuleTypes(), R.getRewardRuleTypes],
  ['Prize types', KR.getPrizeTypes(), R.getPrizeTypes],
  ['Event kinds', KR.getEventKinds(), R.getEventKinds],
  ['Gamification triggers', KR.getGamificationTriggers(), R.getGamificationTriggers],
  ['Gift categories', KR.getGiftCategories(), R.getGiftCategories],
  ['Campaign channels', KR.getCampaignChannels(), R.getCampaignChannels],
  ['Campaign statuses', KR.getCampaignStatuses(), R.getCampaignStatuses],
  ['Wizard steps', KR.getWizardSteps(), R.getWizardSteps],
  ['Funding sources', KR.getFundingSources(), R.getFundingSources],
  ['KYC tiers', KR.getKycTiers(), R.getKycTiers],
] as const

const CARD = [
  ['Card schemes', KC.getCardSchemes(), Card.getCardSchemes],
  ['Card statuses', KC.getCardStatuses(), Card.getCardStatuses],
  ['Lock statuses', KC.getCardLockStatuses(), Card.getCardLockStatuses],
  ['Card transaction types', KC.getTransactionTypes(), Card.getTransactionTypes],
] as const

function Lookup({ title, qk, fn }: { title: string; qk: readonly unknown[]; fn: () => Promise<unknown> }) {
  return <ReadCard title={title} query={useMsQuery(qk, fn)} />
}

export function LookupsTab() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">{REWARD.map(([t, k, f]) => <Lookup key={t} title={`Reward · ${t}`} qk={k} fn={f} />)}</div>
      <div className="grid lg:grid-cols-2 gap-4">{CARD.map(([t, k, f]) => <Lookup key={t} title={`Card · ${t}`} qk={k} fn={f} />)}</div>
    </div>
  )
}
