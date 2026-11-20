'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CampaignResponseDto, EnumOptionDto } from '@/lib/api/numoni/types/rewards'
import { useSetCampaignAudience } from '@/modules/ms/api/useCampaignQueries'
import { toList } from './campaign-meta'

interface AudienceStepProps {
  campaign: CampaignResponseDto
  channels: EnumOptionDto[]
  onDone: () => void
}

/** Step 2 — `PATCH …/audience-channels`. Lists are comma or line separated. */
export function AudienceStep({ campaign, channels, onDone }: AudienceStepProps) {
  const save = useSetCampaignAudience()
  const [channel, setChannel] = useState(campaign.channel)
  const [audience, setAudience] = useState(campaign.targetAudience ?? '')
  const [geography, setGeography] = useState((campaign.targetGeography ?? []).join(', '))
  const [included, setIncluded] = useState((campaign.includedSkus ?? []).join(', '))
  const [excluded, setExcluded] = useState((campaign.excludedSkus ?? []).join(', '))

  const submit = () =>
    save.mutate(
      {
        campaignId: campaign.id,
        body: { channel, targetAudience: audience.trim() || undefined, targetGeography: toList(geography), includedSkus: toList(included), excludedSkus: toList(excluded) },
      },
      { onSuccess: onDone },
    )

  return (
    <div className="space-y-3.5">
      <div>
        <label className="label-caps">Channel</label>
        <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{channels.map((c) => <SelectItem key={c.value} value={c.value ?? ''}>{c.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <label className="label-caps">Target audience <span className="normal-case text-muted-foreground/70">(optional)</span></label>
        <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. ALL, NEW_CUSTOMERS, VIP" className="mt-1.5" />
      </div>
      <div>
        <label className="label-caps">Regions / states <span className="normal-case text-muted-foreground/70">(optional)</span></label>
        <Input value={geography} onChange={(e) => setGeography(e.target.value)} placeholder="e.g. Lagos, Abuja" className="mt-1.5" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-caps">Only these SKUs</label>
          <Textarea value={included} onChange={(e) => setIncluded(e.target.value)} placeholder="Empty = every product" className="mt-1.5 min-h-[72px] tnum" />
        </div>
        <div>
          <label className="label-caps">Exclude SKUs</label>
          <Textarea value={excluded} onChange={(e) => setExcluded(e.target.value)} placeholder="e.g. SKU-GIFT-CARD" className="mt-1.5 min-h-[72px] tnum" />
        </div>
      </div>
      <Button onClick={submit} disabled={save.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {save.isPending ? 'Saving…' : 'Save audience & continue'}
      </Button>
    </div>
  )
}
