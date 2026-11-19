'use client'

import { Check, FileText, Search, ShieldCheck, X } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import type { Dispatch, SetStateAction } from 'react'

import { kindGroup } from '@/modules/admin/components/kyc/kind-group'
import type { KycCase } from '@/lib/api/numoni'

interface KycQueueCardProps {
  decide: (id: string, ok: boolean) => void
  q: string
  risk: string
  rows: KycCase[]
  setQ: Dispatch<SetStateAction<string>>
  setRisk: Dispatch<SetStateAction<string>>
  setType: Dispatch<SetStateAction<string>>
  setViewing: Dispatch<SetStateAction<KycCase | null>>
  type: string
}

export function KycQueueCard({ decide, q, risk, rows, setQ, setRisk, setType, setViewing, type }: KycQueueCardProps) {
  return (
    <div className="card-surface overflow-hidden mb-4">
      <div className="flex flex-wrap items-center gap-2 px-5 py-3.5 border-b">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search entity or reference…" className="pl-9 h-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            <SelectItem value="Customer">Customers</SelectItem>
            <SelectItem value="Merchant">Merchants</SelectItem>
            <SelectItem value="Business">Brands / Fintech / Resellers</SelectItem>
          </SelectContent>
        </Select>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All match scores</SelectItem>
            <SelectItem value="high">Strong (85%+)</SelectItem>
            <SelectItem value="review">Review (70–84%)</SelectItem>
            <SelectItem value="weak">Weak (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
        <Pill tone="orange">{rows.length} waiting</Pill>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[900px]"
          data={rows}
          getRowId={(r) => r.id}
          headerCellClassName="label-caps font-semibold px-5 py-3"
          rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors"
          cellClassName="px-5 py-3"
          emptyCellClassName="px-5 py-10 text-center"
          emptyState={<>
                            <ShieldCheck className="h-8 w-8 text-brand mx-auto mb-2" />
                            <p className="font-semibold text-sm">Queue clear</p>
                            <p className="text-xs text-muted-foreground">Every submission matching this filter has been reviewed.</p>
                          </>}
          columns={[
            {
              id: 'entity',
              header: 'Entity',
              cell: ({ row: { original: r } }) => (
                <>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground tnum">{r.id}</div>
                </>
              ),
            },
            { id: 'type', header: 'Type', cell: ({ row: { original: r } }) => <Pill tone={kindGroup(r.kind) === 'Customer' ? 'sky' : kindGroup(r.kind) === 'Merchant' ? 'green' : 'purple'}>{r.kind}</Pill> },
            { id: 'documents', header: 'Documents', meta: { cellClassName: 'text-muted-foreground text-xs max-w-[220px]' }, cell: ({ row: { original: r } }) => <span className="line-clamp-1">{r.doc}</span> },
            { id: 'provider', header: 'Provider', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: r } }) => r.provider },
            { id: 'match', header: 'Match', cell: ({ row: { original: r } }) => <span className={`tnum font-bold ${r.score >= 85 ? 'text-brand' : r.score >= 70 ? 'text-orangeb' : 'text-red-500'}`}>{r.score}%</span> },
            { id: 'submitted', header: 'Submitted', meta: { cellClassName: 'text-xs text-muted-foreground tnum' }, cell: ({ row: { original: r } }) => r.submitted },
            {
              id: 'actions',
              header: 'Actions',
              cell: ({ row: { original: r } }) => (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setViewing(r)}><FileText className="h-3.5 w-3.5 mr-1" /> Docs</Button>
                  <Button size="sm" className="h-8 bg-brand text-black hover:bg-brand/90" onClick={() => decide(r.id, true)}><Check className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" className="h-8 text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={() => decide(r.id, false)}><X className="h-3.5 w-3.5" /></Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
