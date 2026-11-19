'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Campaign } from '@/lib/api/numoni/types/platform'
import type { Dispatch, SetStateAction } from 'react'

interface CampaignFiltersProps {
  items: Campaign[]
  mtype: string
  q: string
  setMtype: Dispatch<SetStateAction<string>>
  setQ: Dispatch<SetStateAction<string>>
  setTab: Dispatch<SetStateAction<string>>
  tab: string
}

export function CampaignFilters({ items, mtype, q, setMtype, setQ, setTab, tab }: CampaignFiltersProps) {
  const merchantTypes = Array.from(new Set(items.map((c) => c.merchantType)))

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaign or owner…" className="pl-9 h-9" />
      </div>
      <Select value={mtype} onValueChange={setMtype}>
        <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Merchant type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All merchant types</SelectItem>
          {merchantTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
