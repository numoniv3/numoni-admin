'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'
import type { Dispatch, SetStateAction } from 'react'

interface RewardFiltersProps {
  items: RewardProgram[]
  owner: string
  perf: string
  q: string
  setOwner: Dispatch<SetStateAction<string>>
  setPerf: Dispatch<SetStateAction<string>>
  setQ: Dispatch<SetStateAction<string>>
  setStatus: Dispatch<SetStateAction<string>>
  setType: Dispatch<SetStateAction<string>>
  status: string
  type: string
}

export function RewardFilters({ items, owner, perf, q, setOwner, setPerf, setQ, setStatus, setType, status, type }: RewardFiltersProps) {
  const owners = Array.from(new Set(items.map((r) => r.owner)))

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rewards…" className="pl-9 h-9" />
      </div>
      <Select value={owner} onValueChange={setOwner}>
        <SelectTrigger className="w-[210px] h-9"><SelectValue placeholder="Merchant / brand" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All merchants & brands</SelectItem>
          {owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {(['Points', 'Coupon', 'Gift', 'Raffle'] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={perf} onValueChange={setPerf}>
        <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All performance</SelectItem>
          <SelectItem value="Performing">Performing</SelectItem>
          <SelectItem value="Less performing">Less performing</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
