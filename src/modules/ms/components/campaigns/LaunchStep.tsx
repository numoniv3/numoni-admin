'use client'

import { Check, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/kit'
import type { CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'
import { useCampaignAction } from '@/modules/ms/api/useCampaignQueries'
import { CampaignActions } from './CampaignActions'
import { STATUS_TONE, fmtDate, stepsDone, titleCase } from './campaign-meta'
import { LedgerCard } from './LedgerCard'

/** Step 5 — `POST …/start`, then the campaign's live state, lifecycle actions and escrow ledger. */
export function LaunchStep({ campaign: c }: { campaign: CampaignResponseDto }) {
  const start = useCampaignAction()
  const rewards = c.rewards ?? []
  const paysPoints = rewards.some((r) => r.prizeType === 'POINTS')
  const checks: [string, boolean][] = [
    ['Audience set', stepsDone(c) >= 2],
    [`${rewards.length} reward${rewards.length === 1 ? '' : 's'}`, rewards.length > 0],
    [paysPoints ? `Budget ${fmtNaira(c.totalBudget, 0)} (points need one)` : `Budget ${fmtNaira(c.totalBudget, 0)}`, !paysPoints || c.totalBudget > 0],
  ]
  const ready = checks.every(([, ok]) => ok)
  const canStart = c.status === 'DRAFT'

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4 flex items-center justify-between">
        <div>
          <div className="label-caps">Status</div>
          <div className="mt-1 flex items-center gap-2">
            <Pill tone={STATUS_TONE[c.status]}>{titleCase(c.status)}</Pill>
            {!c.adminApproved && c.status !== 'DRAFT' && <span className="text-[11px] text-muted-foreground">awaiting admin approval</span>}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1.5 tnum">
            {c.redemptionsCount.toLocaleString()} redemptions · started {fmtDate(c.startedAt)}{c.completedAt ? ` · ended ${fmtDate(c.completedAt)}` : ''}
          </div>
        </div>
        <CampaignActions campaign={c} labels />
      </div>

      {canStart && (
        <div className="rounded-2xl border p-4 space-y-2">
          {checks.map(([label, ok]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {ok ? <Check className="h-4 w-4 text-brand" /> : <X className="h-4 w-4 text-red-500" />}
              <span className={ok ? '' : 'text-muted-foreground'}>{label}</span>
            </div>
          ))}
          <Button
            onClick={() => start.mutate({ campaignId: c.id, action: 'start' })}
            disabled={!ready || start.isPending}
            className="w-full h-11 mt-2 rounded-full bg-brand text-black font-bold hover:bg-brand/90"
          >
            <Rocket className="h-4 w-4 mr-1.5" />
            {start.isPending ? 'Launching…' : c.startDate && new Date(c.startDate) > new Date() ? `Schedule for ${fmtDate(c.startDate)}` : 'Launch campaign'}
          </Button>
        </div>
      )}

      {(c.escrowLocked || c.totalBudget > 0) && <LedgerCard campaignId={c.id} />}
    </div>
  )
}
