'use client'

import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { CardBatchResponseDto, CreateCardDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { useMintCards } from '@/modules/ms/api/useCardQueries'
import { amount, maskPan, moneyInput } from './card-meta'

const SCHEMES: { value: CreateCardDto['scheme']; label: string; desc: string }[] = [
  { value: 'CLOSED_LOOP', label: 'Closed loop', desc: 'Only usable with you. Frozen between uses — unlocked with the customer’s OTP for 60 s.' },
  { value: 'OPEN_LOOP', label: 'Open loop', desc: 'Usable at any nuMoni merchant in Nigeria. No lock.' },
]

interface MintCardsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** `POST /card/cards` — mints 1–1000 cards; shows the batch with activation codes to print. */
export function MintCardsSheet({ open, onOpenChange }: MintCardsSheetProps) {
  const mint = useMintCards()
  const [scheme, setScheme] = useState<CreateCardDto['scheme']>('CLOSED_LOOP')
  const [qty, setQty] = useState('50')
  const [name, setName] = useState('')
  const [initial, setInitial] = useState('')
  const [expiry, setExpiry] = useState('')
  const [batch, setBatch] = useState<CardBatchResponseDto | null>(null)

  const close = (v: boolean) => { onOpenChange(v); if (!v) setBatch(null) }
  const submit = () => {
    const quantity = Number(qty)
    if (!quantity || quantity < 1 || quantity > 1000) return toast.error('Mint between 1 and 1,000 cards')
    mint.mutate(
      { scheme, quantity, name: name.trim() || undefined, initialRewardAmount: amount(initial), expiryDate: expiry ? new Date(`${expiry}T23:59:59.000Z`).toISOString() : undefined },
      { onSuccess: setBatch },
    )
  }

  if (batch) {
    return (
      <FormSheet open={open} onOpenChange={close} title="Cards minted" sub={`${batch.quantity} cards · batch ${batch.batchReference}`} wide>
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/5 p-3 text-xs">
            <BadgeCheck className="h-4 w-4 text-brand shrink-0" /> Print each card with its serial and activation code — the customer needs both to activate it.
          </div>
          <ExportCsvButton
            filename={`cards-${batch.batchReference}`}
            headers={['Serial', 'Card number', 'Activation code', 'QR payload', 'Scheme']}
            rows={batch.cards.map((c) => [c.serialNumber, c.cardNumber, c.activationCode ?? '', c.qrPayload ?? '', c.scheme])}
          />
          <div className="rounded-xl border divide-y max-h-[50vh] overflow-y-auto">
            {batch.cards.map((c) => (
              <div key={c.reference} className="flex justify-between gap-3 px-3 py-2 text-xs tnum">
                <span className="font-mono font-semibold">{c.serialNumber}</span>
                <span className="text-muted-foreground">{maskPan(c.cardNumber)}</span>
                <span className="font-mono">{c.activationCode ?? '—'}</span>
              </div>
            ))}
          </div>
          <Button onClick={() => setBatch(null)} variant="outline" className="w-full rounded-full">Mint another batch</Button>
        </div>
      </FormSheet>
    )
  }

  const q = Number(qty) || 0
  return (
    <FormSheet open={open} onOpenChange={close} title="Mint reward cards" sub="Cards start unassigned; hand them to customers, who activate them with the code.">
      <div className="space-y-4 pb-2">
        <div className="grid gap-2">
          {SCHEMES.map((s) => (
            <button key={s.value} type="button" onClick={() => setScheme(s.value)}
              className={`rounded-xl border p-3 text-left transition-colors ${scheme === s.value ? 'border-brand bg-brand/5' : 'hover:border-foreground/25'}`}>
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">{s.desc}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-caps">Quantity (1–1,000)</label>
            <Input value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} className="mt-1.5 tnum" inputMode="numeric" />
          </div>
          <div>
            <label className="label-caps">Batch name · optional</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gold tier" className="mt-1.5" />
          </div>
          <div>
            <label className="label-caps">Starting reward (₦) · optional</label>
            <Input value={initial} onChange={(e) => setInitial(moneyInput(e.target.value))} placeholder="e.g. 500" className="mt-1.5 tnum" inputMode="decimal" />
          </div>
          <div>
            <label className="label-caps">Expires · optional</label>
            <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1.5 tnum" />
          </div>
        </div>
        {amount(initial) ? <p className="text-[11px] text-muted-foreground">Loads {fmtNaira(amount(initial)!, 0)} on each card — {fmtNaira(amount(initial)! * q, 0)} across the batch.</p> : null}
        <div className="grid grid-cols-4 gap-2">
          {[10, 50, 100, 500].map((v) => (
            <button key={v} type="button" onClick={() => setQty(String(v))}
              className={`rounded-xl border py-2 text-xs font-bold tnum transition-colors ${q === v ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}>{v}</button>
          ))}
        </div>
        <Button onClick={submit} disabled={mint.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
          {mint.isPending ? 'Minting…' : `Mint ${q || ''} card${q === 1 ? '' : 's'}`}
        </Button>
      </div>
    </FormSheet>
  )
}
