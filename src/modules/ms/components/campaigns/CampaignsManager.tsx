'use client'

import { useDeferredValue, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RewardListCampaignsParams } from '@/lib/api/numoni/types/rewards'
import { useRewardCampaignsQuery, useRewardEnumsQuery } from '@/modules/ms/api/useRewardQueries'
import { CampaignKpis } from './CampaignKpis'
import { CampaignSheet } from './CampaignSheet'
import { RewardCampaignsTable } from './RewardCampaignsTable'
import { useCampaignSheet } from './use-campaign-sheet'

const ALL = '__all__'
type Status = NonNullable<RewardListCampaignsParams['status']>

/** Reward MS campaigns: KPIs, filters, table, and the create / manage sheet. */
export function CampaignsManager() {
  const { data: enums } = useRewardEnumsQuery()
  const [status, setStatus] = useState<string>(ALL)
  const [search, setSearch] = useState('')
  // Deferred, so typing keeps the current results on screen while the next page loads.
  const deferredStatus = useDeferredValue(status)
  const deferredSearch = useDeferredValue(search.trim())
  const { data } = useRewardCampaignsQuery({
    status: deferredStatus === ALL ? undefined : (deferredStatus as Status),
    search: deferredSearch || undefined,
  })
  const { data: everything } = useRewardCampaignsQuery()
  const sheet = useCampaignSheet()

  return (
    <div>
      <CampaignKpis summary={everything.summary} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or CMP_ reference" className="pl-9 w-64" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {enums.campaignStatuses.map((s) => <SelectItem key={s.value} value={s.value ?? ''}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={sheet.openNew} className="ml-auto rounded-full bg-brand text-black hover:bg-brand/90 font-semibold">
          <Plus className="h-4 w-4 mr-1.5" /> Create Campaign
        </Button>
      </div>

      <RewardCampaignsTable campaigns={data.campaigns} onOpen={(c) => sheet.openCampaign(c)} />

      <CampaignSheet sheet={sheet} enums={enums} campaigns={everything.campaigns} />
    </div>
  )
}
