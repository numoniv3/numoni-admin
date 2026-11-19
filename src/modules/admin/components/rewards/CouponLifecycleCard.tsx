'use client'

import { Ticket } from 'lucide-react'
import { fmtCompact } from '@/lib/format'
import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'

interface CouponLifecycleCardProps {
  activeCoupons: number
  couponGenerated: number
  couponIssued: number
  coupons: RewardProgram[]
}

export function CouponLifecycleCard({ activeCoupons, couponGenerated, couponIssued, coupons }: CouponLifecycleCardProps) {
  const couponRedeemed = coupons.reduce((s, r) => s + r.redeemed, 0)

  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-3">
        <Ticket className="h-4 w-4 text-purpleb" />
        <h3 className="font-display font-bold">Coupon lifecycle</h3>
      </div>
      {[
        { label: 'Generated', v: couponGenerated, pct: 100, color: '#7C5CBF' },
        { label: 'Issued to customers', v: couponIssued, pct: Math.round((couponIssued / couponGenerated) * 100), color: '#0EA5E9' },
        { label: 'Redeemed', v: couponRedeemed, pct: Math.round((couponRedeemed / couponGenerated) * 100), color: '#02DC4D' },
        { label: 'Active in wallets', v: activeCoupons, pct: Math.round((activeCoupons / couponGenerated) * 100), color: '#E8A33D' },
      ].map((f) => (
        <div key={f.label} className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{f.label}</span>
            <span className="tnum font-semibold">{fmtCompact(f.v)} · {f.pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: f.pct + '%', background: f.color }} />
          </div>
        </div>
      ))}
      <div className="text-[10px] text-muted-foreground mt-2">Unredeemed coupon value is held inside the PPL (₦124.9M) until redemption or expiry sweep.</div>
    </div>
  )
}
