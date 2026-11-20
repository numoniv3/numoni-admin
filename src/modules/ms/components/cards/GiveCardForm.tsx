'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import type { CardDto } from '@/lib/api/numoni/types/card'
import { useGiveCard } from '@/modules/ms/api/useCardQueries'

/** `POST /card/cards/{id}/give` — marks a MINTED card as handed over, optionally to a phone number. */
export function GiveCardForm({ card }: { card: CardDto }) {
  const give = useGiveCard()
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Optional — record who you gave the card to. The customer still activates it with serial <span className="font-mono">{card.serialNumber}</span> and its activation code.
      </p>
      <div>
        <label className="label-caps">Customer phone · optional</label>
        <PhoneInput value={phone} onChange={setPhone} className="mt-1.5" />
      </div>
      <div>
        <label className="label-caps">Notes · optional</label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Handed over at Ikeja branch" className="mt-1.5" />
      </div>
      <Button
        onClick={() => give.mutate({ id: card.reference, body: { customerPhone: phone.trim() || undefined, notes: notes.trim() || undefined } })}
        disabled={give.isPending}
        className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90"
      >
        {give.isPending ? 'Saving…' : 'Mark as given to customer'}
      </Button>
    </div>
  )
}
