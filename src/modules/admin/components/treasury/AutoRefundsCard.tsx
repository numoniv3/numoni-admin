'use client'

import type { AutoRefund } from '@/lib/api/numoni'
import { fmtNaira } from '@/lib/format'

interface AutoRefundsCardProps {
  refunds: AutoRefund[]
}

export function AutoRefundsCard({ refunds }: AutoRefundsCardProps) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-3">Auto-refund events</h3>
      <div className="space-y-2.5">
        {refunds.map((r) => (
          <div key={r.id} className="rounded-xl border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium tnum">{r.id}</span>
              <span className="tnum font-semibold text-orangeb">{fmtNaira(r.amount, 0)}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>
            <div className="text-[10px] text-muted-foreground mt-1 tnum">{r.txn} · {r.time} · ledger reversal entry</div>
          </div>
        ))}
      </div>
    </div>
  )
}
