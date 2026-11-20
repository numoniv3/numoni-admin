import { useState } from 'react'
import type { CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { nextStepIndex } from './campaign-meta'

/** Which campaign the sheet shows (`null` = creating one), which wizard step, and whether it's open. */
export function useCampaignSheet() {
  const [open, setOpen] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [step, setStep] = useState(0)

  const openNew = () => { setCampaignId(null); setStep(0); setOpen(true) }
  /** Opens at `step`, or at the first step the campaign hasn't completed. */
  const openCampaign = (c: CampaignResponseDto, step?: number) => { setCampaignId(c.id); setStep(step ?? nextStepIndex(c)); setOpen(true) }
  /** Step 1 succeeded: keep the sheet open on the new campaign, at step 2. */
  const created = (c: CampaignResponseDto) => { setCampaignId(c.id); setStep(1) }

  return { open, setOpen, campaignId, step, setStep, openNew, openCampaign, created }
}

export type CampaignSheetState = ReturnType<typeof useCampaignSheet>
