'use client'

import { useState } from 'react'
import { LockOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { useChargeByNumber, useInitiateUnlock, useVerifyUnlock } from '@/modules/ms/api/useCardQueries'
import { amount, moneyInput } from './card-meta'

/**
 * Counter redemption by card number. Open-loop cards charge straight away; a
 * closed-loop card needs the customer's OTP first (unlocks it for 60 s).
 */
export function TillCardRedeem() {
  const initiate = useInitiateUnlock()
  const verify = useVerifyUnlock()
  const charge = useChargeByNumber()
  const [cardNumber, setCardNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [value, setValue] = useState('')
  const [closedLoop, setClosedLoop] = useState(true)

  const reset = () => { setCardNumber(''); setPhone(''); setCode(''); setValue(''); initiate.reset(); verify.reset() }
  const redeem = () => {
    const n = amount(value)
    if (!cardNumber.trim() && !phone.trim()) return toast.error('Enter the card number or the customer’s phone')
    if (!n || n <= 0) return toast.error('Enter the amount')
    charge.mutate({ cardNumber: cardNumber.trim() || undefined, customerPhone: phone.trim() || undefined, amount: n }, { onSuccess: reset })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {[true, false].map((c) => (
          <button key={String(c)} onClick={() => setClosedLoop(c)} className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${closedLoop === c ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>
            {c ? 'Store card (OTP)' : 'nuMoni card'}
          </button>
        ))}
      </div>
      <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))} placeholder="Card number" className="tnum font-mono" inputMode="numeric" />
      <PhoneInput value={phone} onChange={setPhone} placeholder="Customer phone" />
      {closedLoop && (
        <>
          <Button variant="outline" className="w-full rounded-full" disabled={!phone.trim() || initiate.isPending}
            onClick={() => initiate.mutate({ customerPhone: phone.trim(), cardNumber: cardNumber.trim() || undefined }, { onSuccess: (r) => r.devOtp && setCode(r.devOtp) })}>
            {initiate.isPending ? 'Sending…' : 'Send customer a code'}
          </Button>
          {initiate.isSuccess && (
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="Code" className="tnum tracking-widest" inputMode="numeric" />
              <Button variant="outline" disabled={!code || verify.isPending} onClick={() => verify.mutate({ customerPhone: phone.trim(), code, cardNumber: cardNumber.trim() || undefined })}>Unlock</Button>
            </div>
          )}
          {verify.isSuccess && <div className="flex items-center gap-1.5 text-xs text-brand"><LockOpen className="h-3.5 w-3.5" /> Unlocked for {verify.data.windowSeconds}s — redeem now</div>}
        </>
      )}
      <Input value={value} onChange={(e) => setValue(moneyInput(e.target.value))} placeholder="Amount (₦)" className="tnum text-lg h-12" inputMode="decimal" />
      <Button onClick={redeem} disabled={charge.isPending || (closedLoop && !verify.isSuccess)} className="w-full h-12 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {charge.isPending ? 'Redeeming…' : closedLoop && !verify.isSuccess ? 'Unlock the card first' : 'Redeem from card'}
      </Button>
    </div>
  )
}
