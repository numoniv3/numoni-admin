'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CardDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { useLoadCardReward } from '@/modules/ms/api/useCardQueries'
import { amount, moneyInput } from './card-meta'

/** `POST /card/cards/{id}/rewards` — only the issuing merchant can load a card. */
export function LoadRewardForm({ card }: { card: CardDto }) {
  const load = useLoadCardReward()
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')

  const submit = () => {
    const n = amount(value)
    if (!n || n <= 0) return toast.error('Enter the amount to load')
    load.mutate({ id: card.reference, body: { amount: n, reason: reason.trim() || undefined } }, { onSuccess: () => { setValue(''); setReason('') } })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-caps">Amount (₦)</label>
          <Input value={value} onChange={(e) => setValue(moneyInput(e.target.value))} placeholder="e.g. 1,000" className="mt-1.5 tnum" inputMode="decimal" />
        </div>
        <div>
          <label className="label-caps">Reason · optional</label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Loyalty bonus" className="mt-1.5" />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Balance now {fmtNaira(card.balance, 0)}.{card.scheme === 'CLOSED_LOOP' ? ' Loading freezes a closed-loop card until the customer unlocks it.' : ''}
      </p>
      <Button onClick={submit} disabled={load.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {load.isPending ? 'Loading…' : 'Load reward'}
      </Button>
    </div>
  )
}
