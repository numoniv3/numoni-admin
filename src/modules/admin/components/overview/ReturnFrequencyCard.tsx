'use client'

import type { ReturnFrequencyBucket } from '@/lib/api/numoni'


interface ReturnFrequencyCardProps {
  returnBuckets: ReturnFrequencyBucket[]
}

export function ReturnFrequencyCard({ returnBuckets }: ReturnFrequencyCardProps) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Return-frequency buckets</h3>
      <p className="text-xs text-muted-foreground mb-4">How often customers come back in a month</p>
      <div className="space-y-3">
        {returnBuckets.map((b) => (
          <div key={b.bucket} className="flex items-center gap-3">
            <span className="text-xs font-semibold w-14 shrink-0 tnum">{b.bucket}</span>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
            </div>
            <span className="tnum text-xs font-bold w-9 text-right">{b.pct}%</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-brand/30 bg-brand/5 p-3 text-[11px] text-muted-foreground">
        <span className="font-bold text-brand">48% of customers return 4+ times a month.</span> Win-back campaigns target the 18% single-visit bucket.
      </div>
    </div>
  )
}
