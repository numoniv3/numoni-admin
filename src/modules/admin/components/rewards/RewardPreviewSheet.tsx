'use client'

import { Pill } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { fmtCompact, fmtNaira } from '@/lib/format'
import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'
import type { Dispatch, SetStateAction } from 'react'

import { perfOf } from '@/modules/admin/components/rewards/perf-of'

interface RewardPreviewSheetProps {
  preview: RewardProgram | null
  setPreview: Dispatch<SetStateAction<RewardProgram | null>>
  toggle: (id: string) => void
}

export function RewardPreviewSheet({ preview, setPreview, toggle }: RewardPreviewSheetProps) {
  return (
    <FormSheet open={!!preview} onOpenChange={(o) => !o && setPreview(null)} title={preview?.name ?? ''} sub={preview ? `${preview.id} · ${preview.owner} · ${preview.ownerKind}` : ''}>
      {preview && (() => {
        const rate = Math.round((preview.redeemed / preview.issued) * 100)
        const roi = (preview.revenue / preview.cost).toFixed(1)
        return (
          <div className="space-y-4">
            <div className="flex gap-1.5">
              <Pill tone={preview.type === 'Coupon' ? 'purple' : preview.type === 'Raffle' ? 'orange' : preview.type === 'Gift' ? 'sky' : 'green'}>{preview.type}</Pill>
              <Pill tone={preview.active ? 'green' : 'neutral'}>{preview.active ? 'Active' : 'Inactive'}</Pill>
              <Pill tone={perfOf(preview) === 'Performing' ? 'green' : 'orange'}>{perfOf(preview)}</Pill>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Issued', fmtCompact(preview.issued)],
                ['Redeemed', `${fmtCompact(preview.redeemed)} · ${rate}%`],
                ['Reward cost', fmtNaira(preview.cost, 0)],
                ['Revenue influenced', fmtNaira(preview.revenue, 0)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border p-3">
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                  <div className="font-bold mt-0.5 text-sm tnum">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">Redemption progress</span><span className="tnum font-semibold">{rate}%</span></div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: rate + '%', background: rate >= 50 ? '#02DC4D' : '#E8A33D' }} />
              </div>
            </div>
            <div className="rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground">
              ROI <span className="text-brand font-bold">{roi}×</span> — every ₦1 of reward cost influences {fmtNaira(Number(roi), 0)} of sales. Cost posts to COGS 5001; unredeemed value stays in PPL until expiry sweep.
            </div>
            <Button onClick={() => { toggle(preview.id); setPreview((p) => p ? { ...p, active: !p.active } : p) }} variant="outline" className="w-full h-11 rounded-full">
              {preview.active ? 'Deactivate reward' : 'Activate reward'}
            </Button>
          </div>
        )
      })()}
    </FormSheet>
  )
}
