'use client'

import { Check, X } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { fmtNaira } from '@/lib/format'
import { type Campaign } from '@/lib/api/numoni/types/platform'
import type { Dispatch, SetStateAction } from 'react'

import { tone } from '@/modules/admin/components/campaigns/tone'

const MODEL_DESC: Record<Campaign['model'], string> = {
  V1: 'Points only — customer earns platform points on qualifying transactions',
  V2: 'Points + wallet credit — points plus an instant cash-equivalent bonus',
  V3: 'Full stack — points, wallet credit, coupons and raffle entries',
}

interface CampaignPreviewSheetProps {
  approve: (id: string, ok: boolean) => void
  preview: Campaign | null
  setPreview: Dispatch<SetStateAction<Campaign | null>>
  togglePause: (id: string) => void
}

export function CampaignPreviewSheet({ approve, preview, setPreview, togglePause }: CampaignPreviewSheetProps) {
  return (
    <FormSheet open={!!preview} onOpenChange={(o) => !o && setPreview(null)} title={preview?.name ?? ''} sub={preview ? `${preview.id} · ${preview.owner} · ${preview.merchantType}` : ''} wide>
      {preview && (() => {
        const pct = Math.min(100, Math.round((preview.spent / preview.budget) * 100))
        const roi = preview.spent > 0 ? (preview.sales / preview.spent).toFixed(1) : '—'
        return (
          <div className="space-y-4">
            <div className="flex gap-1.5">
              <Pill tone={preview.model === 'V2' ? 'purple' : preview.model === 'V3' ? 'orange' : 'green'}>Model {preview.model}</Pill>
              <Pill tone={tone[preview.status]}>{preview.status}</Pill>
              <Pill tone="neutral">{preview.ownerType}</Pill>
              <span className="text-[10px] text-muted-foreground ml-auto tnum self-center">{preview.window}</span>
            </div>
            <p className="text-xs text-muted-foreground rounded-xl border border-dashed p-3">{MODEL_DESC[preview.model]}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Goal', preview.goal],
                ['Trigger', preview.trigger],
                ['Reward spend', fmtNaira(preview.spent, 0)],
                ['Attributed sales', fmtNaira(preview.sales, 0)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border p-3">
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                  <div className="font-bold mt-0.5 text-sm">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Budget escrow pacing</span>
                <span className="tnum font-semibold">{fmtNaira(preview.spent, 0)} / {fmtNaira(preview.budget, 0)} · {pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${pct > 90 ? 'bg-orangeb' : 'bg-brand'}`} style={{ width: pct + '%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>Escrow account · 4002 campaign fees accrue at 3%</span>
                <span>ROI <span className="text-brand font-bold">{roi}×</span></span>
              </div>
            </div>
            {preview.status === 'Pending Approval' && (
              <div className="flex gap-2">
                <Button onClick={() => approve(preview.id, true)} className="flex-1 h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90"><Check className="h-4 w-4 mr-1.5" /> Approve & go live</Button>
                <Button variant="outline" onClick={() => approve(preview.id, false)} className="flex-1 h-11 rounded-full text-red-500 border-red-500/30"><X className="h-4 w-4 mr-1.5" /> Send back</Button>
              </div>
            )}
            {(preview.status === 'Live' || preview.status === 'Paused') && (
              <Button variant="outline" onClick={() => { togglePause(preview.id); setPreview((p) => p ? { ...p, status: p.status === 'Live' ? 'Paused' : 'Live' } : p) }} className="w-full h-11 rounded-full">
                {preview.status === 'Live' ? 'Pause campaign' : 'Resume campaign'}
              </Button>
            )}
          </div>
        )
      })()}
    </FormSheet>
  )
}
