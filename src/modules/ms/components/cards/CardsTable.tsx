'use client'

import { CreditCard, Lock, LockOpen } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState, Pill } from '@/components/ui/kit'
import type { CardDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { STATUS_TONE, fmtDate, isUnlocked, maskPan, titleCase } from './card-meta'

export function CardsTable({ cards, onOpen }: { cards: CardDto[]; onOpen: (c: CardDto) => void }) {
  if (cards.length === 0) {
    return (
      <div className="card-surface">
        <EmptyState icon={CreditCard} title="No cards" sub="Mint a batch of reward cards, then hand them to customers." />
      </div>
    )
  }
  return (
    <div className="card-surface overflow-x-auto">
      <DataTable
        className="w-full text-sm min-w-[960px]"
        data={cards}
        getRowId={(c) => c.reference}
        rowClassName="border-b last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
        onRowClick={onOpen}
        columns={[
          {
            id: 'card',
            header: 'Card',
            cell: ({ row: { original: c } }) => (
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 text-white"><CreditCard className="h-4 w-4" /></span>
                <span>
                  <span className="block font-mono text-xs font-semibold tnum">{c.serialNumber}</span>
                  <span className="block text-[10px] text-muted-foreground tnum">{maskPan(c.cardNumber)}{c.name ? ` · ${c.name}` : ''}</span>
                </span>
              </div>
            ),
          },
          { id: 'scheme', header: 'Scheme', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: ({ row: { original: c } }) => (c.scheme === 'CLOSED_LOOP' ? 'Closed loop' : 'Open loop') },
          { id: 'customer', header: 'Customer', meta: { cellClassName: 'text-xs tnum' }, cell: ({ row: { original: c } }) => c.customerPhone ?? <span className="text-muted-foreground">Not assigned</span> },
          { id: 'status', header: 'Status', cell: ({ row: { original: c } }) => <Pill tone={STATUS_TONE[c.status]}>{titleCase(c.status)}</Pill> },
          {
            id: 'lock',
            header: 'Lock',
            cell: ({ row: { original: c } }) => (isUnlocked(c)
              ? <span className="inline-flex items-center gap-1 text-xs text-brand"><LockOpen className="h-3.5 w-3.5" /> Unlocked</span>
              : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Frozen</span>),
          },
          { id: 'balance', header: 'Balance', meta: { cellClassName: 'tnum font-semibold' }, cell: ({ row: { original: c } }) => fmtNaira(c.balance, 0) },
          {
            id: 'flow',
            header: 'Loaded / spent',
            meta: { cellClassName: 'tnum text-xs text-muted-foreground' },
            cell: ({ row: { original: c } }) => `${fmtNaira(c.totalLoaded, 0)} / ${fmtNaira(c.totalSpent, 0)}`,
          },
          { id: 'activated', header: 'Activated', meta: { cellClassName: 'text-xs text-muted-foreground whitespace-nowrap' }, cell: ({ row: { original: c } }) => fmtDate(c.activatedAt) },
        ]}
      />
    </div>
  )
}
