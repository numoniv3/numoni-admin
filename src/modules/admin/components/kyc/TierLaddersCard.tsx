'use client'

import { Progress } from '@/components/ui/progress'

const tiers = [
  { tier: 'Customer Tier 1', limit: '₦50,000 / day', req: 'Phone + OTP', pct: 33 },
  { tier: 'Customer Tier 2', limit: '₦500,000 / day', req: 'NIN / BVN verified', pct: 66 },
  { tier: 'Customer Tier 3', limit: 'Unlimited', req: 'Bank statement + address', pct: 100 },
  { tier: 'Merchant Tier 1', limit: '₦100,000 / month withdrawal', req: 'CAC + utility bill', pct: 40 },
  { tier: 'Merchant Tier 2', limit: '₦1,000,000 / month withdrawal', req: 'CAC + director ID', pct: 70 },
  { tier: 'Business KYB (Brand / Fintech / Reseller)', limit: 'Contract-based limits', req: 'Licences + board resolution', pct: 100 },
]

export function TierLaddersCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-4">Tier ladders</h3>
      <div className="space-y-4">
        {tiers.map((t) => (
          <div key={t.tier}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{t.tier}</span>
              <span className="tnum text-muted-foreground text-xs">{t.limit}</span>
            </div>
            <Progress value={t.pct} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground mt-1">{t.req}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
