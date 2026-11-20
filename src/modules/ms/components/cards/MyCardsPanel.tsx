'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMyCardsQuery, useActivateCard } from '@/modules/ms/api/useCardQueries'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { fmtNaira } from '@/lib/format'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { toE164 } from '@/lib/auth/phone'
import { isUnlocked, maskPan, titleCase } from './card-meta'

/** The customer's reward cards (`GET /card/cards/my`) and activating a new one. */
export function MyCardsPanel() {
  const q = useMyCardsQuery()
  const activate = useActivateCard()
  const phone = toE164(useSessionUser()?.phone ?? '')
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      <QueryView query={q}>
        {(cards) => (
          <div className="space-y-3">
            {cards.length === 0 && <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">No reward cards yet — activate one a merchant gave you.</div>}
            {cards.map((c) => (
              <div key={c.reference} className="rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white p-4">
                <div className="flex justify-between text-[11px] opacity-80">
                  <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> {c.name ?? (c.scheme === 'CLOSED_LOOP' ? 'Store card' : 'nuMoni card')}</span>
                  <span>{titleCase(c.status)} · {isUnlocked(c) ? 'Unlocked' : 'Locked'}</span>
                </div>
                <div className="mt-4 text-xl font-bold tnum">{fmtNaira(c.balance, 0)}</div>
                <div className="mt-1 font-mono text-xs opacity-80 tnum">{maskPan(c.cardNumber)}</div>
                {c.scheme === 'CLOSED_LOOP' && <div className="mt-2 text-[10px] opacity-70">Only at the issuing store — you’ll get a code to unlock it when you pay.</div>}
              </div>
            ))}
          </div>
        )}
      </QueryView>
      {adding ? (
        <div className="rounded-2xl border p-4">
          <ActionForm
            fields={[
              { key: 'serialNumber', label: 'Serial or card number', required: true, placeholder: 'NUM-CRD-…' },
              { key: 'activationCode', label: 'Activation code', required: true },
              { key: 'customerPhone', label: 'Your phone', kind: 'phone', required: true },
            ]}
            initial={{ customerPhone: phone }}
            submitLabel="Activate card" pending={activate.isPending}
            onSubmit={(v) => {
              const id = String(v.serialNumber)
              // A 16-digit value is the card number; anything else is the printed serial.
              const ref = /^\d{12,19}$/.test(id) ? { cardNumber: id } : { serialNumber: id }
              activate.mutate({ ...ref, activationCode: String(v.activationCode), customerPhone: String(v.customerPhone) }, { onSuccess: () => setAdding(false) })
            }}
          />
        </div>
      ) : (
        <Button onClick={() => setAdding(true)} variant="outline" className="w-full rounded-full">Activate a card</Button>
      )}
    </div>
  )
}
