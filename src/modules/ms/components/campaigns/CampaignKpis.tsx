'use client'

import { Coins, Megaphone, Ticket, Wallet } from 'lucide-react'
import { KpiCard } from '@/components/ui/kit'
import type { AllCampaignsKpiSummaryDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'

/** Totals from `GET /rewards/campaigns` → `summary`. */
export function CampaignKpis({ summary: s }: { summary: AllCampaignsKpiSummaryDto }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <KpiCard label="Campaigns" numeric={s.totalCampaigns} icon={Megaphone} sub={`${s.activeCampaigns} active · ${s.scheduledCampaigns} scheduled · ${s.draftCampaigns} draft`} />
      <KpiCard label="Budget in escrow" numeric={s.totalAllocatedBudget} format={(n) => fmtNaira(n, 0)} icon={Wallet} tint="sky" />
      <KpiCard label="Spent on rewards" numeric={s.totalSpentBudget} format={(n) => fmtNaira(n, 0)} icon={Coins} tint="orange" sub={`${fmtNaira(s.totalRemainingBudget, 0)} remaining`} />
      <KpiCard label="Redemptions" numeric={s.totalRedemptionsCount} icon={Ticket} tint="purple" sub={`${s.completedCampaigns} completed campaigns`} />
    </div>
  )
}
