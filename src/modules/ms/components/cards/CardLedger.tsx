'use client'

import { Undo2 } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Pill } from '@/components/ui/kit'
import type { CardTransactionDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { useCardLedgerQuery, useReverseCardTransaction } from '@/modules/ms/api/useCardQueries'
import { fmtDate, titleCase } from './card-meta'

const TONE = { INITIAL_FUNDING: 'sky', REWARD_LOAD: 'green', CARD_CHARGE: 'orange', REVERSAL: 'purple' } as const

function ReverseButton({ txn, reversed }: { txn: CardTransactionDto; reversed: boolean }) {
  const reverse = useReverseCardTransaction()
  if (txn.type !== 'CARD_CHARGE' || reversed) return null
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7" title="Reverse charge" disabled={reverse.isPending}><Undo2 className="h-3.5 w-3.5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reverse this {fmtNaira(txn.amount, 0)} charge?</AlertDialogTitle>
          <AlertDialogDescription>The amount goes back on the card and a REVERSAL entry is added to its ledger.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => reverse.mutate({ ref: txn.reference, reason: 'Reversed by merchant' })}>Reverse charge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** `GET /card/cards/{id}/ledger`, newest first; charges can be reversed. */
export function CardLedger({ cardId }: { cardId: string }) {
  const { data, isLoading, isError } = useCardLedgerQuery(cardId)
  if (isLoading) return <div className="p-4 text-xs text-muted-foreground">Loading…</div>
  if (isError || !data) return <div className="p-4 text-xs text-muted-foreground">Couldn’t load the ledger.</div>
  if (data.length === 0) return <div className="p-4 text-xs text-muted-foreground">No transactions on this card yet.</div>

  // A charge counts as reversed once a REVERSAL points back at it.
  const reversed = new Set(data.filter((t) => t.type === 'REVERSAL').map((t) => t.sourceReference))
  const rows = [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="rounded-2xl border overflow-hidden max-h-80 overflow-y-auto">
      <DataTable
        className="w-full text-xs"
        data={rows}
        getRowId={(t) => t.reference}
        headerCellClassName="label-caps font-semibold px-3 py-2"
        cellClassName="px-3 py-2"
        columns={[
          { id: 'type', header: 'Type', cell: ({ row: { original: t } }) => <Pill tone={TONE[t.type]}>{titleCase(t.type)}</Pill> },
          { id: 'amount', header: 'Amount', meta: { cellClassName: 'tnum font-medium' }, cell: ({ row: { original: t } }) => fmtNaira(t.amount, 0) },
          { id: 'balance', header: 'Balance', meta: { cellClassName: 'tnum text-muted-foreground' }, cell: ({ row: { original: t } }) => fmtNaira(t.balanceAfter, 0) },
          { id: 'when', header: 'When', meta: { cellClassName: 'text-muted-foreground whitespace-nowrap' }, cell: ({ row: { original: t } }) => fmtDate(t.createdAt) },
          { id: 'actions', header: '', meta: { cellClassName: 'text-right' }, cell: ({ row: { original: t } }) => <ReverseButton txn={t} reversed={reversed.has(t.reference)} /> },
        ]}
      />
    </div>
  )
}
