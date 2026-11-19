'use client'

import { CheckCircle2 } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { fmtNaira } from '@/lib/format'

export function ChecksumCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Reconciliation check-sum</h3>
      <p className="text-xs text-muted-foreground mb-4">Runs every 60s against Payonus settlement file</p>
      <div className="rounded-xl bg-muted/50 p-4 font-mono text-xs space-y-1.5">
        <div className="flex justify-between"><span className="text-muted-foreground">NERW</span><span className="tnum">{fmtNaira(412_800_000, 0)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">+ PPL (net)</span><span className="tnum">{fmtNaira(626_000_000, 0)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">+ ΣRCS (commission)</span><span className="tnum">{fmtNaira(18_240_000, 0)}</span></div>
        <div className="flex justify-between border-t pt-1.5"><span className="text-muted-foreground">− Payonus file</span><span className="tnum">{fmtNaira(1_057_040_000, 0)}</span></div>
        <div className="flex justify-between font-bold text-brand"><span>= Variance</span><span className="tnum">₦0</span></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pill tone="green"><CheckCircle2 className="h-3 w-3" /> Books balanced</Pill>
        <span className="text-[10px] text-muted-foreground">last run 41s ago</span>
      </div>
    </div>
  )
}
