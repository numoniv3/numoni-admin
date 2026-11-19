'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtNairaCompact } from '@/lib/format'
import { type Campaign } from '@/lib/api/numoni/types/platform'
import { tone } from '@/modules/admin/components/campaigns/tone'
import type { Dispatch, SetStateAction } from 'react'

interface CampaignGridProps {
  approve: (id: string, ok: boolean) => void
  filtered: Campaign[]
  setPreview: Dispatch<SetStateAction<Campaign | null>>
}

export function CampaignGrid({ approve, filtered, setPreview }: CampaignGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {filtered.map((c, i) => {
        const pct = Math.min(100, Math.round((c.spent / c.budget) * 100))
        const roi = c.spent > 0 ? (c.sales / c.spent).toFixed(1) : '—'
        return (
          <motion.div key={c.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setPreview(c)} className="card-surface p-5 cursor-pointer hover:border-brand/40 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="font-display font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.owner} · {c.merchantType}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Pill tone={c.model === 'V2' ? 'purple' : c.model === 'V3' ? 'orange' : 'green'}>{c.model}</Pill>
                <Pill tone={tone[c.status]}>{c.status}</Pill>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="rounded-lg bg-muted/50 p-2.5"><span className="text-muted-foreground">Goal</span><div className="font-semibold mt-0.5">{c.goal}</div></div>
              <div className="rounded-lg bg-muted/50 p-2.5"><span className="text-muted-foreground">Trigger</span><div className="font-semibold mt-0.5">{c.trigger}</div></div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Budget escrow pacing</span>
                <span className="tnum font-semibold">{fmtNairaCompact(c.spent)} / {fmtNairaCompact(c.budget)} · {pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div className={`h-full rounded-full ${pct > 90 ? 'bg-orangeb' : 'bg-brand'}`} initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 0.9, delay: i * 0.05, ease: 'easeOut' }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs">
                <span className="text-muted-foreground">Spend-vs-sales: </span>
                <span className="font-semibold tnum">{fmtNairaCompact(c.sales)} sales</span>
                <span className="text-muted-foreground"> · ROI </span>
                <span className="font-semibold text-brand tnum">{roi}×</span>
              </div>
              {c.status === 'Pending Approval' && (
                <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" onClick={() => approve(c.id, true)} className="bg-brand text-black hover:bg-brand/90 h-8"><Check className="h-3.5 w-3.5 mr-1" /> Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => approve(c.id, false)} className="h-8 text-red-500 border-red-500/30"><X className="h-3.5 w-3.5" /></Button>
                </div>
              )}
              {c.status !== 'Pending Approval' && <span className="text-[10px] text-muted-foreground tnum">{c.window}</span>}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
