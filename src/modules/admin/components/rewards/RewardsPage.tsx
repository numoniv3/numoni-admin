'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Gift, Ticket, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { SectionTitle, KpiCard, EmptyState, stagger } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { fmtCompact } from '@/lib/format'
import { useAdminRewardsQuery } from '../../api/useAdminQueries'
import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'
import { RewardPreviewSheet } from '@/modules/admin/components/rewards/RewardPreviewSheet'
import { perfOf } from '@/modules/admin/components/rewards/perf-of'
import { RewardProgramsTable } from '@/modules/admin/components/rewards/RewardProgramsTable'
import { RewardFilters } from '@/modules/admin/components/rewards/RewardFilters'
import { RafflesRunningCard } from '@/modules/admin/components/rewards/RafflesRunningCard'
import { CouponLifecycleCard } from '@/modules/admin/components/rewards/CouponLifecycleCard'

export function RewardsPage() {
  const { data: { programs: PROGRAMS, raffles: RAFFLES } } = useAdminRewardsQuery()
  const [items, setItems] = useState(PROGRAMS)
  const [raffles, setRaffles] = useState(RAFFLES)
  const [q, setQ] = useState('')
  const [owner, setOwner] = useState('all')
  const [type, setType] = useState('all')
  const [perf, setPerf] = useState('all')
  const [status, setStatus] = useState('all')
  const [preview, setPreview] = useState<RewardProgram | null>(null)
  const rows = items.filter((r) =>
    (q === '' || r.name.toLowerCase().includes(q.toLowerCase())) &&
    (owner === 'all' || r.owner === owner) &&
    (type === 'all' || r.type === type) &&
    (perf === 'all' || perfOf(r) === perf) &&
    (status === 'all' || (status === 'active' ? r.active : !r.active)),
  )

  const coupons = items.filter((r) => r.type === 'Coupon')
  const couponIssued = coupons.reduce((s, r) => s + r.issued, 0)
  const couponGenerated = couponIssued + 61_800 // issued + printed-but-unclaimed stock
  const activeCoupons = coupons.filter((r) => r.active).reduce((s, r) => s + (r.issued - r.redeemed), 0)
  const totalIssued = items.reduce((s, r) => s + r.issued, 0)
  const totalRedeemed = items.reduce((s, r) => s + r.redeemed, 0)
  const giftsSent = items.filter((r) => r.type === 'Gift').reduce((s, r) => s + r.issued, 0)

  const toggle = (id: string) => {
    const r = items.find((x) => x.id === id)!
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
    toast.success(`${r.name} ${r.active ? 'deactivated' : 'activated'}`, { description: 'Change applied to all rails · audit logged' })
  }

  return (
    <div>
      <SectionTitle
        title="Rewards"
        sub="Every reward live on the platform — points, coupons, gifts and raffles — with performance and status filters."
        right={
          <ExportCsvButton
            filename="numoni-rewards"
            headers={['ID', 'Reward', 'Owner', 'Type', 'Issued', 'Redeemed', 'Redemption %', 'Cost (₦)', 'Revenue influenced (₦)', 'Performance', 'Status']}
            rows={rows.map((r) => [r.id, r.name, r.owner, r.type, r.issued, r.redeemed, `${Math.round((r.redeemed / r.issued) * 100)}%`, r.cost, r.revenue, perfOf(r), r.active ? 'Active' : 'Inactive'])}
          />
        }
      />

      {/* KPI strip */}
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 xl:grid-cols-6 gap-3 mb-4">
        <motion.div variants={stagger.item}><KpiCard label="Coupons generated" numeric={couponGenerated} format={fmtCompact} icon={Ticket} sub="printed stock + issued" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Coupons issued" numeric={couponIssued} format={fmtCompact} icon={Ticket} tint="purple" sub="handed to customers" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Active coupons" numeric={activeCoupons} format={fmtCompact} icon={Ticket} tint="sky" sub="in wallets, not yet redeemed" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Redemption rate" value={Math.round((totalRedeemed / totalIssued) * 100) + '%'} delta={2.8} icon={Coins} tint="orange" sub="all reward types" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Raffles running" numeric={raffles.filter((r) => r.active).length} format={(n) => String(Math.round(n))} icon={Trophy} tint="purple" sub={`${fmtCompact(raffles.reduce((s, r) => s + r.tickets, 0))} tickets live`} /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Gifts sent" numeric={giftsSent} format={fmtCompact} icon={Gift} tint="sky" sub="peer-to-peer reward gifts" /></motion.div>
      </motion.div>

      {/* coupon funnel + raffles */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <CouponLifecycleCard activeCoupons={activeCoupons} couponGenerated={couponGenerated} couponIssued={couponIssued} coupons={coupons} />

        <RafflesRunningCard raffles={raffles} setRaffles={setRaffles} />
      </div>

      {/* filters */}
      <RewardFilters items={items} owner={owner} perf={perf} q={q} setOwner={setOwner} setPerf={setPerf} setQ={setQ} setStatus={setStatus} setType={setType} status={status} type={type} />

      {/* rewards table */}
      {rows.length === 0 ? (
        <div className="card-surface"><EmptyState icon={Gift} title="No rewards match" sub="Loosen the filters to see more reward programs." /></div>
      ) : (
        <RewardProgramsTable rows={rows} setPreview={setPreview} toggle={toggle} />
      )}

      {/* reward preview */}
      <RewardPreviewSheet preview={preview} setPreview={setPreview} toggle={toggle} />
    </div>
  )
}
