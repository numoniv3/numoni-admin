'use client'

import { useEffect, useState } from 'react'
import { LockOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { toE164 } from '@/lib/auth/phone'
import type { CardDto } from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { useChargeCard, useInitiateUnlock, useVerifyUnlock } from '@/modules/ms/api/useCardQueries'
import { amount, moneyInput } from './card-meta'

/** Seconds left until `until`, ticking. */
function useCountdown(until: string | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!until) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [until])
  return until ? Math.max(0, Math.ceil((new Date(until).getTime() - now) / 1000)) : 0
}

/**
 * Redeem from a card. OPEN_LOOP: charge directly. CLOSED_LOOP: send the
 * customer an OTP (`unlock/initiate`), verify it (`unlock/verify`), then charge
 * within the 60-second window — the card re-locks after the charge.
 */
export function ChargeCardPanel({ card }: { card: CardDto }) {
  const initiate = useInitiateUnlock()
  const verify = useVerifyUnlock()
  const charge = useChargeCard()
  const [phone, setPhone] = useState(toE164(card.customerPhone ?? ''))
  const [code, setCode] = useState('')
  const [value, setValue] = useState('')
  const [unlockedUntil, setUnlockedUntil] = useState<string | null>(null)
  const left = useCountdown(unlockedUntil)
  const closed = card.scheme === 'CLOSED_LOOP'
  const canCharge = !closed || left > 0

  const sendCode = () => {
    if (!phone.trim()) return toast.error('Enter the customer’s phone number')
    initiate.mutate({ customerPhone: phone.trim(), cardId: card.reference }, { onSuccess: (r) => r.devOtp && setCode(r.devOtp) })
  }
  const unlock = () => verify.mutate({ customerPhone: phone.trim(), code: code.trim(), cardId: card.reference }, { onSuccess: (r) => setUnlockedUntil(r.unlockedUntil) })
  const submit = () => {
    const n = amount(value)
    if (!n || n <= 0) return toast.error('Enter the amount to charge')
    if (n > card.balance) return toast.error('More than the card balance', { description: fmtNaira(card.balance, 0) })
    charge.mutate({ id: card.reference, body: { amount: n, customerPhone: phone.trim() || undefined } }, { onSuccess: () => { setValue(''); setUnlockedUntil(null); setCode('') } })
  }

  return (
    <div className="space-y-3">
      {closed && (
        <div className="rounded-2xl border p-4 space-y-3">
          <div className="label-caps">1 · Unlock with the customer’s code</div>
          <div className="flex gap-2">
            <PhoneInput value={phone} onChange={setPhone} className="flex-1" />
            <Button variant="outline" onClick={sendCode} disabled={initiate.isPending}>{initiate.isPending ? 'Sending…' : 'Send code'}</Button>
          </div>
          {initiate.isSuccess && (
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="tnum tracking-widest" inputMode="numeric" />
              <Button variant="outline" onClick={unlock} disabled={verify.isPending || !code}>{verify.isPending ? 'Checking…' : 'Unlock'}</Button>
            </div>
          )}
          {left > 0 && <div className="flex items-center gap-1.5 text-xs text-brand"><LockOpen className="h-3.5 w-3.5" /> Unlocked — {left}s to charge</div>}
        </div>
      )}
      <div className={closed ? 'rounded-2xl border p-4 space-y-3' : 'space-y-3'}>
        {closed && <div className="label-caps">2 · Charge</div>}
        <div>
          <label className="text-xs text-muted-foreground">Amount (₦) · balance {fmtNaira(card.balance, 0)}</label>
          <Input value={value} onChange={(e) => setValue(moneyInput(e.target.value))} placeholder="e.g. 2,500" className="mt-1 tnum" inputMode="decimal" />
        </div>
        <Button onClick={submit} disabled={!canCharge || charge.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
          {charge.isPending ? 'Charging…' : canCharge ? 'Charge card' : 'Unlock the card first'}
        </Button>
      </div>
    </div>
  )
}
