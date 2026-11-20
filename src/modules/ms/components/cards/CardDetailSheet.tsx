'use client'

import { Ban, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Pill } from '@/components/ui/kit'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CardDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { useCardQuery, useSetCardStatus } from '@/modules/ms/api/useCardQueries'
import { STATUS_TONE, fmtDate, isUnlocked, maskPan, titleCase } from './card-meta'
import { CardLedger } from './CardLedger'
import { ChargeCardPanel } from './ChargeCardPanel'
import { GiveCardForm } from './GiveCardForm'
import { LoadRewardForm } from './LoadRewardForm'

interface CardDetailSheetProps {
  card: CardDto | null
  onClose: () => void
}

/** One card (`GET /card/cards/{id}`) and everything a merchant can do with it. */
export function CardDetailSheet({ card: row, onClose }: CardDetailSheetProps) {
  const { data: card } = useCardQuery(row?.reference ?? null, row ?? undefined)
  const setStatus = useSetCardStatus()
  if (!card) return null

  const ended = card.status === 'EXPIRED' || card.status === 'CANCELLED'
  const facts: [string, string][] = [
    ['Card number', maskPan(card.cardNumber)], ['Scheme', card.scheme === 'CLOSED_LOOP' ? 'Closed loop' : 'Open loop'],
    ['Customer', card.customerPhone ?? 'Not assigned'], ['Lock', isUnlocked(card) ? 'Unlocked' : 'Frozen'],
    ['Loaded', fmtNaira(card.totalLoaded, 0)], ['Spent', fmtNaira(card.totalSpent, 0)],
    ['Activated', fmtDate(card.activatedAt)], ['Expires', fmtDate(card.expiresAt)], ['Batch', card.batchReference ?? '—'],
  ]

  return (
    <FormSheet open={!!row} onOpenChange={(v) => !v && onClose()} title={card.serialNumber} sub={card.name ?? card.reference} wide>
      <div className="space-y-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white p-5">
          <div className="flex justify-between items-start">
            <Pill tone={STATUS_TONE[card.status]}>{titleCase(card.status)}</Pill>
            <span className="text-[11px] opacity-70">{card.scheme === 'CLOSED_LOOP' ? 'Closed loop' : 'Open loop'}</span>
          </div>
          <div className="mt-6 text-2xl font-bold tnum">{fmtNaira(card.balance, 0)}</div>
          <div className="mt-1 font-mono text-xs opacity-80 tnum">{maskPan(card.cardNumber)}</div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            {card.status === 'MINTED' && <TabsTrigger value="give">Hand over</TabsTrigger>}
            {!ended && <TabsTrigger value="load">Load reward</TabsTrigger>}
            {card.status === 'ACTIVE' && <TabsTrigger value="charge">Charge</TabsTrigger>}
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-3 mt-4">
            <div className="rounded-2xl border divide-y">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-2 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium tnum text-right">{v}</span></div>
              ))}
            </div>
            {!ended && (
              <Button
                variant="outline"
                className="w-full rounded-full"
                disabled={setStatus.isPending}
                onClick={() => setStatus.mutate({ id: card.reference, status: card.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' })}
              >
                {card.status === 'SUSPENDED' ? <><RotateCcw className="h-4 w-4 mr-1.5" /> Reinstate card</> : <><Ban className="h-4 w-4 mr-1.5" /> Suspend card</>}
              </Button>
            )}
          </TabsContent>
          <TabsContent value="give" className="mt-4"><GiveCardForm card={card} /></TabsContent>
          <TabsContent value="load" className="mt-4"><LoadRewardForm card={card} /></TabsContent>
          <TabsContent value="charge" className="mt-4"><ChargeCardPanel key={card.reference} card={card} /></TabsContent>
          <TabsContent value="ledger" className="mt-4"><CardLedger cardId={card.reference} /></TabsContent>
        </Tabs>
      </div>
    </FormSheet>
  )
}
