'use client'

import { Gauge } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Progress } from '@/components/ui/progress'

export function ProviderStatusCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-3">Provider status</h3>
      <div className="mb-5">
        {[
          { name: 'VerifyMe', note: 'BVN / NIN lookups · 60% of identity traffic' },
          { name: 'Prembly', note: 'Business verification · 40% of identity traffic' },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-[10px] text-muted-foreground">{p.note}</div>
            </div>
            <Pill tone="green"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Operational</Pill>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-brand" />
        <h4 className="font-display font-bold text-sm">Compliance middleware rate limits</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { api: 'BVN lookup', used: 62, limit: '1,000/min' },
          { api: 'NIN verify', used: 38, limit: '500/min' },
          { api: 'CAC search', used: 21, limit: '200/min' },
          { api: 'Sanctions screen', used: 84, limit: '2,000/min' },
        ].map((r) => (
          <div key={r.api} className="rounded-xl border p-3.5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{r.api}</span>
              <span className={`tnum text-xs font-semibold ${r.used > 80 ? 'text-orangeb' : 'text-muted-foreground'}`}>{r.used}%</span>
            </div>
            <Progress value={r.used} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground mt-1.5 tnum">limit {r.limit}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
