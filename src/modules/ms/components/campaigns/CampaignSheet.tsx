'use client'

import { Check } from 'lucide-react'
import { FormSheet } from '@/components/ui/form-sheet'
import type { AllEnumsCatalogDto, CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { cn } from '@/lib/utils'
import { useCampaignQuery } from '@/modules/ms/api/useCampaignQueries'
import { AudienceStep } from './AudienceStep'
import { BudgetStep } from './BudgetStep'
import { STEPS, isClosed, stepsDone } from './campaign-meta'
import { DetailsStep } from './DetailsStep'
import { LaunchStep } from './LaunchStep'
import { RewardsStep } from './RewardsStep'
import type { CampaignSheetState } from './use-campaign-sheet'

interface CampaignSheetProps {
  sheet: CampaignSheetState
  enums: AllEnumsCatalogDto
  campaigns: CampaignResponseDto[]
}

/** Create a campaign and walk it through the wizard, or manage an existing one. */
export function CampaignSheet({ sheet, enums, campaigns }: CampaignSheetProps) {
  const { open, setOpen, campaignId, step, setStep, created } = sheet
  const { data: campaign } = useCampaignQuery(campaignId, campaigns.find((c) => c.id === campaignId))
  const done = stepsDone(campaign)
  // A finished campaign can only be looked at.
  const locked = campaign ? isClosed(campaign.status) : false
  const next = () => setStep(Math.min(step + 1, STEPS.length - 1))

  return (
    <FormSheet open={open} onOpenChange={setOpen} title={campaign ? campaign.name : 'Create Campaign'} sub={campaign ? campaign.reference : 'Five steps: details, audience, rewards, budget, launch.'} wide>
      <div className="space-y-5 pb-2">
        <ol className="grid grid-cols-5 gap-1.5">
          {STEPS.map((s, i) => {
            const reachable = i === 0 || !!campaign
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => setStep(i)}
                  className={cn(
                    'w-full rounded-xl border px-2 py-2 text-left transition-colors disabled:opacity-40',
                    step === i ? 'border-brand bg-brand/5' : 'hover:border-foreground/25',
                  )}
                >
                  <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold', i < done ? 'bg-brand text-black' : 'bg-muted text-muted-foreground')}>
                    {i < done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="block text-[11px] font-semibold mt-1">{s.label}</span>
                </button>
              </li>
            )
          })}
        </ol>

        {locked && step < 4 && (
          <p className="rounded-xl bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">This campaign has ended — changes aren’t accepted any more.</p>
        )}

        {step === 0 && <DetailsStep campaign={campaign} channels={enums.campaignChannels} onCreated={created} />}
        {campaign && step === 1 && <AudienceStep key={campaign.id} campaign={campaign} channels={enums.campaignChannels} onDone={next} />}
        {campaign && step === 2 && <RewardsStep campaign={campaign} others={campaigns} onDone={next} />}
        {campaign && step === 3 && <BudgetStep key={campaign.id} campaign={campaign} fundingSources={enums.fundingSources} onDone={next} />}
        {campaign && step === 4 && <LaunchStep campaign={campaign} />}
      </div>
    </FormSheet>
  )
}
