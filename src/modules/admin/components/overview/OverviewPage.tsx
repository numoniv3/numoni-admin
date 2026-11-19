'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Banknote, CreditCard, Gift, Repeat, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { KpiCard, SectionTitle, stagger } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fmtNairaCompact, fmtCompact, fmtNaira } from '@/lib/format'
import { useAdminOverviewQuery } from '../../api/useAdminQueries'
import { TeamAuditTrailCard } from '@/modules/admin/components/overview/TeamAuditTrailCard'
import { CardAnalyticsCard } from '@/modules/admin/components/overview/CardAnalyticsCard'
import { TYPE_FACTOR } from '@/modules/admin/components/overview/type-factor'
import { RewardMixCard } from '@/modules/admin/components/overview/RewardMixCard'
import { RewardsIssuedCard } from '@/modules/admin/components/overview/RewardsIssuedCard'
import { CampaignMixCard } from '@/modules/admin/components/overview/CampaignMixCard'
import { CampaignPerformanceCard } from '@/modules/admin/components/overview/CampaignPerformanceCard'
import { ReturnFrequencyCard } from '@/modules/admin/components/overview/ReturnFrequencyCard'
import { BestCustomersCard } from '@/modules/admin/components/overview/BestCustomersCard'
import { AgeRangeCard } from '@/modules/admin/components/overview/AgeRangeCard'
import { CustomerOnboardingCard } from '@/modules/admin/components/overview/CustomerOnboardingCard'
import { ActivityHeatMapCard } from '@/modules/admin/components/overview/ActivityHeatMapCard'
import { SalesByRailCard } from '@/modules/admin/components/overview/SalesByRailCard'
import { SalesTrendCard } from '@/modules/admin/components/overview/SalesTrendCard'
import { OverviewFilters } from '@/modules/admin/components/overview/OverviewFilters'

export type Period = 'today' | 'week' | 'month' | 'custom'

export type CustType = 'all' | 'merchant' | 'fmcg' | 'brand' | 'fintech'

// ── OVERVIEW — platform intelligence hub ─────────────────────────────────────
export function OverviewPage() {
  const { data: { salesByRail: RAIL_SALES, ageRanges: AGE_RANGES, returnBuckets: RETURN_BUCKETS, campaignMix: CAMPAIGN_MIX, cardsByBrand: CARDS_BY_BRAND, attributionSeries } } = useAdminOverviewQuery()
  const [period, setPeriod] = useState<Period>('week')
  const [from, setFrom] = useState('2026-09-21')
  const [to, setTo] = useState('2026-09-27')
  const [ctype, setCtype] = useState<CustType>('all')

  const factor = useMemo(() => {
    let f = period === 'today' ? 0.16 : period === 'month' ? 4.2 : 1
    if (period === 'custom') {
      const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1)
      f = Math.min(8, Math.max(0.14, days / 7))
    }
    return f * TYPE_FACTOR[ctype]
  }, [period, from, to, ctype])

  // KPIs
  const sales = 938_000_000 * factor
  const avgSpend = 4_860 * (0.9 + TYPE_FACTOR[ctype] * 0.15)
  const retention = 68.4 - (1 - TYPE_FACTOR[ctype]) * 3
  const churn = 4.2 + (1 - TYPE_FACTOR[ctype]) * 1.4
  const returnFreq = 3.1
  const activeCards = Math.round(84_210 * TYPE_FACTOR[ctype])

  return (
    <div>
      <SectionTitle
        title="Intelligence Hub"
        sub="Every signal moving through nuMoni — filter it, cross-reference it, act on it."
        right={
          <Select value={ctype} onValueChange={(v) => setCtype(v as CustType)}>
            <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="Customer type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All customer types</SelectItem>
              <SelectItem value="merchant">Merchant customers</SelectItem>
              <SelectItem value="fmcg">FMCG customers</SelectItem>
              <SelectItem value="brand">Brand customers</SelectItem>
              <SelectItem value="fintech">Fintech customers</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* period pills */}
      <OverviewFilters ctype={ctype} from={from} period={period} setFrom={setFrom} setPeriod={setPeriod} setTo={setTo} to={to} />

      {/* KPI row */}
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <motion.div variants={stagger.item}><KpiCard label="Sales" numeric={sales} format={fmtNairaCompact} delta={12.4} icon={Banknote} /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Avg customer spend" numeric={avgSpend} format={(n) => fmtNaira(n, 0)} delta={3.8} icon={TrendingUp} tint="sky" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Retention" value={retention.toFixed(1) + '%'} delta={1.9} icon={Repeat} tint="purple" sub="30-day repeat" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Churn" value={churn.toFixed(1) + '%'} delta={-0.6} icon={TrendingDown} tint="orange" sub="Dormant 30d+" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Return frequency" value={returnFreq.toFixed(1) + '×'} delta={0.4} icon={Users} tint="sky" sub="Visits per customer / mo" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Active cards" numeric={activeCards} format={fmtCompact} delta={6.2} icon={CreditCard} tint="purple" /></motion.div>
      </motion.div>

      {/* sales trend + rail pie */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <SalesTrendCard factor={factor} />

        <SalesByRailCard factor={factor} railSales={RAIL_SALES} />
      </div>

      {/* heat map */}
      <ActivityHeatMapCard factor={factor} />

      {/* onboarding + age */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <CustomerOnboardingCard factor={factor} />

        <AgeRangeCard ageRanges={AGE_RANGES} />
      </div>

      {/* best customers + return buckets */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <BestCustomersCard />

        <ReturnFrequencyCard returnBuckets={RETURN_BUCKETS} />
      </div>

      {/* campaign intelligence */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <CampaignPerformanceCard attributionSeries={attributionSeries} factor={factor} />

        <CampaignMixCard campaignMix={CAMPAIGN_MIX} />
      </div>

      {/* rewards & coupons intelligence */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <RewardsIssuedCard factor={factor} />

        <RewardMixCard ctype={ctype} factor={factor} />
      </div>

      {/* card analytics + audit trail */}
      <div className="grid lg:grid-cols-2 gap-4">
        <CardAnalyticsCard cardsByBrand={CARDS_BY_BRAND} ctype={ctype} />

        <TeamAuditTrailCard />
      </div>

      <div className="mt-5 rounded-2xl border border-dashed p-4 flex items-center gap-3 text-xs text-muted-foreground">
        <Gift className="h-4 w-4 text-brand shrink-0" />
        Need to slice this deeper — by age, location, business type, industry? Open the <span className="font-bold text-foreground">Data Explorer</span> to build cross-referenced queries and export segments as CSV.
      </div>
    </div>
  )
}
