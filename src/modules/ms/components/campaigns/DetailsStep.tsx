'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CampaignResponseDto, EnumOptionDto } from '@/lib/api/numoni/types/rewards'
import { useCreateCampaign } from '@/modules/ms/api/useCampaignQueries'
import { dayToIso, fmtDate, titleCase } from './campaign-meta'

interface DetailsStepProps {
  campaign?: CampaignResponseDto
  channels: EnumOptionDto[]
  onCreated: (c: CampaignResponseDto) => void
}

/** Step 1. Creates the campaign; afterwards its details are read-only (the Reward MS can't rename or re-date one). */
export function DetailsStep({ campaign, channels, onCreated }: DetailsStepProps) {
  const create = useCreateCampaign()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [channel, setChannel] = useState<CampaignResponseDto['channel']>('ALL')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  if (campaign) {
    const rows: [string, string][] = [
      ['Reference', campaign.reference], ['Name', campaign.name], ['Description', campaign.description || '—'],
      ['Channel', channels.find((c) => c.value === campaign.channel)?.label ?? titleCase(campaign.channel)],
      ['Starts', fmtDate(campaign.startDate)], ['Ends', fmtDate(campaign.endDate)], ['Created', fmtDate(campaign.createdAt)],
    ]
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border divide-y">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right tnum">{v}</span></div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Name and dates are fixed once a campaign is created. Channel can be changed in the Audience step.</p>
      </div>
    )
  }

  const submit = () => {
    if (!name.trim()) return toast.error('Name your campaign')
    if (start && end && end < start) return toast.error('End date must be after the start date')
    create.mutate(
      { name: name.trim(), description: description.trim() || undefined, channel, startDate: dayToIso(start), endDate: dayToIso(end, true) },
      { onSuccess: onCreated },
    )
  }

  return (
    <div className="space-y-3.5">
      <div>
        <label className="label-caps">Campaign name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekend Shopping Surge" className="mt-1.5" />
      </div>
      <div>
        <label className="label-caps">Description <span className="normal-case text-muted-foreground/70">(optional)</span></label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this campaign pushing?" className="mt-1.5 min-h-[72px]" />
      </div>
      <div>
        <label className="label-caps">Channel</label>
        <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{channels.map((c) => <SelectItem key={c.value} value={c.value ?? ''}>{c.label} — {c.description}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-caps">Start date</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5 tnum" />
        </div>
        <div>
          <label className="label-caps">End date</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1.5 tnum" />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">Leave the start date empty to go live as soon as you launch; a future date schedules it.</p>
      <Button onClick={submit} disabled={create.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {create.isPending ? 'Creating…' : 'Create campaign & continue'}
      </Button>
    </div>
  )
}
