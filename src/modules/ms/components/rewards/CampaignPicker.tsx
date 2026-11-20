'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CampaignResponseDto, EnumOptionDto } from '@/lib/api/numoni/types/rewards'
import { NEW_CAMPAIGN, type RewardDraft } from './reward-draft'

interface CampaignPickerProps {
  campaigns: CampaignResponseDto[]
  channels: EnumOptionDto[]
  draft: RewardDraft
  update: (patch: Partial<RewardDraft>) => void
  /** A saved reward can't move to another campaign. */
  locked: boolean
}

/** Which campaign the reward belongs to — an existing one, or a new draft campaign created on save. */
export function CampaignPicker({ campaigns, channels, draft, update, locked }: CampaignPickerProps) {
  const isNew = draft.campaignId === NEW_CAMPAIGN
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div>
        <label className="label-caps">Campaign</label>
        <Select value={draft.campaignId || undefined} onValueChange={(campaignId) => update({ campaignId })} disabled={locked}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick a campaign…" /></SelectTrigger>
          <SelectContent>
            {campaigns.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} · {c.status.toLowerCase()}</SelectItem>
            ))}
            <SelectItem value={NEW_CAMPAIGN}>+ New campaign</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {locked ? 'A saved reward stays in its campaign.' : 'Rewards pay out while their campaign is active. Campaign dates and budget are set on the campaign.'}
        </p>
      </div>
      {isNew && !locked && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Campaign name</label>
            <Input value={draft.newCampaignName} onChange={(e) => update({ newCampaignName: e.target.value })} placeholder="e.g. Weekend Shopping Surge" className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Channel</label>
            <Select value={draft.newCampaignChannel} onValueChange={(v) => update({ newCampaignChannel: v as RewardDraft['newCampaignChannel'] })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {channels.map((c) => <SelectItem key={c.value} value={c.value ?? ''}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
