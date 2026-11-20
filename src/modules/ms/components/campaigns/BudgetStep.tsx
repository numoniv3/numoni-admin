'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CampaignResponseDto, EnumOptionDto, SetCampaignBudgetDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'
import { useSetCampaignBudget } from '@/modules/ms/api/useCampaignQueries'

interface BudgetStepProps {
  campaign: CampaignResponseDto
  fundingSources: EnumOptionDto[]
  onDone: () => void
}

const amount = (v: string) => (v.replace(/[,\s₦]/g, '') === '' ? undefined : Number(v.replace(/[,\s₦]/g, '')))
const money = (v: string) => v.replace(/[^\d,]/g, '')

/** Step 4 — `PATCH …/budget`: sets or tops up the total and locks the difference in escrow. */
export function BudgetStep({ campaign: c, fundingSources, onDone }: BudgetStepProps) {
  const save = useSetCampaignBudget()
  const [total, setTotal] = useState(c.totalBudget ? String(c.totalBudget) : '')
  const [dailyCap, setDailyCap] = useState(c.dailyBudgetCap != null ? String(c.dailyBudgetCap) : '')
  const [quota, setQuota] = useState(c.maxRedemptionsQuota != null ? String(c.maxRedemptionsQuota) : '')
  const [source, setSource] = useState<NonNullable<SetCampaignBudgetDto['fundingSource']>>(c.fundingSource ?? 'MERCHANT_WALLET')
  const paysPoints = (c.rewards ?? []).some((r) => r.prizeType === 'POINTS')

  const submit = () => {
    const totalBudget = amount(total)
    if (totalBudget === undefined || totalBudget < 0) return toast.error('Set the total budget')
    if (totalBudget < c.spentBudget) return toast.error('Budget can’t be less than what’s already spent', { description: fmtNaira(c.spentBudget, 0) })
    save.mutate(
      { campaignId: c.id, body: { totalBudget, dailyBudgetCap: amount(dailyCap), maxRedemptionsQuota: amount(quota), fundingSource: source } },
      { onSuccess: onDone },
    )
  }

  const stats: [string, number][] = [['Total', c.totalBudget], ['In escrow', c.allocatedBudget], ['Spent', c.spentBudget], ['Remaining', c.remainingBudget]]

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-4 gap-2">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border p-2.5">
            <div className="text-[10px] label-caps">{k}</div>
            <div className="text-sm font-semibold tnum mt-0.5">{fmtNaira(v ?? 0, 0)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-caps">Total budget (₦)</label>
          <Input value={total} onChange={(e) => setTotal(money(e.target.value))} placeholder="e.g. 500,000" className="mt-1.5 tnum" inputMode="numeric" />
        </div>
        <div>
          <label className="label-caps">Funded from</label>
          <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{fundingSources.map((f) => <SelectItem key={f.value} value={f.value ?? ''}>{f.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="label-caps">Daily cap (₦) <span className="normal-case text-muted-foreground/70">· optional</span></label>
          <Input value={dailyCap} onChange={(e) => setDailyCap(money(e.target.value))} placeholder="e.g. 50,000" className="mt-1.5 tnum" inputMode="numeric" />
        </div>
        <div>
          <label className="label-caps">Max redemptions <span className="normal-case text-muted-foreground/70">· optional</span></label>
          <Input value={quota} onChange={(e) => setQuota(money(e.target.value))} placeholder="e.g. 1,000" className="mt-1.5 tnum" inputMode="numeric" />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Raising the total tops up escrow from the funding source; lowering it releases the difference.
        {paysPoints ? ' Points rewards draw from this budget, so it must be above ₦0 to launch.' : ''}
      </p>
      <Button onClick={submit} disabled={save.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {save.isPending ? 'Locking…' : c.totalBudget ? 'Update budget' : 'Lock budget & continue'}
      </Button>
    </div>
  )
}
