'use client'

import { Pause, Play, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtCompact } from '@/lib/format'
import { DataTable } from '@/components/ui/data-table'
import type { Dispatch, SetStateAction } from 'react'
import type { AdminRaffle } from '@/lib/api/numoni'

interface RafflesRunningCardProps {
  raffles: AdminRaffle[]
  setRaffles: Dispatch<SetStateAction<AdminRaffle[]>>
}

export function RafflesRunningCard({ raffles, setRaffles }: RafflesRunningCardProps) {
  const toggleRaffle = (id: string) => {
    const r = raffles.find((x) => x.id === id)!
    setRaffles((xs) => xs.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
    toast.success(`${r.name} ${r.active ? 'paused' : 'resumed'}`, { description: 'Ticket issuance updated immediately' })
  }

  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-bold">Raffles running</h3>
        </div>
        <Pill tone="green">{raffles.filter((r) => r.active).length} live draws</Pill>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[560px]"
          data={raffles}
          getRowId={(r) => r.id}
          headerCellClassName="label-caps font-semibold px-3 py-2.5"
          cellClassName="px-3 py-3"
          columns={[
            {
              id: 'raffle',
              header: 'Raffle',
              cell: ({ row: { original: r } }) => (
                <>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground tnum">{r.id} · {r.owner}</div>
                </>
              ),
            },
            { id: 'ticketsIssued', header: 'Tickets issued', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: r } }) => fmtCompact(r.tickets) },
            { id: 'prizePool', header: 'Prize pool', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: r } }) => r.prize },
            { id: 'draw', header: 'Draw', meta: { cellClassName: 'text-xs tnum' }, cell: ({ row: { original: r } }) => r.draw },
            { id: 'status', header: 'Status', cell: ({ row: { original: r } }) => <Pill tone={r.active ? 'green' : 'neutral'}>{r.active ? 'Running' : 'Paused'}</Pill> },
            {
              id: 'actions',
              header: '',
              cell: ({ row: { original: r } }) => (
                <Button size="sm" variant="outline" className="h-8" onClick={() => toggleRaffle(r.id)}>
                  {r.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </Button>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
