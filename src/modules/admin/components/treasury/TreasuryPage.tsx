'use client'

import { motion } from 'framer-motion'
import { Coins, Landmark, Lock, Play, RefreshCcw, ShieldCheck, type LucideIcon } from 'lucide-react'
import { KpiCard, SectionTitle, stagger } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtNairaCompact } from '@/lib/format'
import { useAdmin } from '@/store/use-admin-store'
import { useAdminMerchantsQuery, useAdminTreasuryQuery } from '../../api/useAdminQueries'
import type { TreasuryLedgerId } from '@/lib/api/numoni/types/admin'
import { MerchantSettlementConfigCard } from '@/modules/admin/components/treasury/MerchantSettlementConfigCard'
import { PayoutQueueCard } from '@/modules/admin/components/treasury/PayoutQueueCard'
import { RailBatchesCard } from '@/modules/admin/components/treasury/RailBatchesCard'
import { AutoRefundsCard } from '@/modules/admin/components/treasury/AutoRefundsCard'
import { SettlementScheduleCard } from '@/modules/admin/components/treasury/SettlementScheduleCard'
import { CommissionWalletsCard } from '@/modules/admin/components/treasury/CommissionWalletsCard'
import { ContingentLiabilityCard } from '@/modules/admin/components/treasury/ContingentLiabilityCard'
import { ChecksumCard } from '@/modules/admin/components/treasury/ChecksumCard'
import { CutoffBanner } from '@/modules/admin/components/treasury/CutoffBanner'

const LEDGER_STYLE: Record<TreasuryLedgerId, { icon: LucideIcon; tint: 'brand' | 'orange' | 'sky' | 'purple' }> = {
  nerw: { icon: Landmark, tint: 'brand' },
  'pool-minted': { icon: Coins, tint: 'orange' },
  'pool-burned': { icon: RefreshCcw, tint: 'sky' },
  'bank-treasury': { icon: ShieldCheck, tint: 'purple' },
}

export interface MerchantConfig { schedule: 'T+0 same-day' | 'T+1 next-day' | 'Weekly (Fri)'; minPayout: number; feeShare: number; holdAll: boolean }

export function TreasuryPage() {
  const { data: merchants } = useAdminMerchantsQuery()
  const { data: { ledgers, refunds, railBatches: batchSeed, payouts: payoutSeed } } = useAdminTreasuryQuery()
  const { cutoffPhase, runCutoff, resetCutoff } = useAdmin()

  return (
    <div>
      <SectionTitle
        title="Treasury & Settlement"
        sub="The money core — every point minted is backed by naira in the bank."
        right={
          cutoffPhase === 'idle' ? (
            <Button onClick={runCutoff} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold">
              <Play className="h-4 w-4 mr-1.5" /> Run daily cut-off
            </Button>
          ) : cutoffPhase === 'done' ? (
            <Button variant="outline" onClick={resetCutoff} className="rounded-full">
              <RefreshCcw className="h-4 w-4 mr-1.5" /> Reset demo
            </Button>
          ) : (
            <Button disabled className="rounded-full bg-brand/60 text-black">
              <Lock className="h-4 w-4 mr-1.5" /> Cut-off running…
            </Button>
          )
        }
      />

      {/* Cut-off sequence banner */}
      <CutoffBanner cutoffPhase={cutoffPhase} />

      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {ledgers.map((l) => (
          <motion.div key={l.name} variants={stagger.item}>
            <KpiCard label={l.name.split('—')[0].trim()} numeric={l.balance} format={fmtNairaCompact} icon={LEDGER_STYLE[l.id].icon} tint={LEDGER_STYLE[l.id].tint} sub={l.note} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Checksum */}
        <ChecksumCard />

        {/* Contingent liability gauge */}
        <ContingentLiabilityCard />

        {/* Commission wallets */}
        <CommissionWalletsCard />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Settlement schedule */}
        <SettlementScheduleCard merchants={merchants} />

        {/* Auto refunds */}
        <AutoRefundsCard refunds={refunds} />
      </div>

      {/* ── granular settlement control ─────────────────────────────────── */}
      <RailBatchesCard batchSeed={batchSeed} />

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* payout queue */}
        <PayoutQueueCard payoutSeed={payoutSeed} />

        {/* per-merchant config */}
        <MerchantSettlementConfigCard merchants={merchants} />
      </div>
    </div>
  )
}
