'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { BuyPointsResult, Wallet } from '@/lib/api/numoni/types/wallet'
import { fmtNaira } from '@/lib/format'
import { useBuyPoints, useVerifyBuyOrder } from '@/modules/wallet'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { toE164 } from '@/lib/auth/phone'
import { RecordView } from '@/modules/ms/components/shared/DataView'
import { toNaira, toPoints } from './wallet-config'

interface SheetProps { wallet: Wallet; open: boolean; onOpenChange: (open: boolean) => void }

function Fund({ wallet, onDone }: { wallet: Wallet; onDone: () => void }) {
  const user = useSessionUser()
  const buy = useBuyPoints()
  const verify = useVerifyBuyOrder()
  // One key per funding attempt, so a double tap or retry can't create two orders.
  const [key] = useState(() => crypto.randomUUID())
  const [naira, setNaira] = useState('')
  const [result, setResult] = useState<BuyPointsResult | null>(null)
  const amount = Number(naira.replace(/,/g, ''))
  const status = verify.data?.status ?? result?.order.status

  if (result) {
    const done = status === 'completed'
    return (
      <div className="space-y-4">
        {done ? (
          <div className="flex items-center gap-2 rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm"><CheckCircle2 className="h-5 w-5 text-brand" /> {fmtNaira(toNaira(result.order.points), 2)} added to your wallet.</div>
        ) : (
          <>
            <p className="text-sm">Transfer <b className="tnum">{fmtNaira(Number(result.order.fiatAmount ?? toNaira(result.order.points)), 2)}</b> to this account, then tap “I’ve paid”.</p>
            <RecordView data={{ bank: result.payment?.bankName ?? result.order.paymentBankName, accountNumber: result.payment?.accountNumber ?? result.order.paymentAccountNumber, reference: result.payment?.onusReference ?? result.order.reference, instructions: result.payment?.instructions, status }} />
            <Button className="w-full rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={verify.isPending} onClick={() => verify.mutate(result.order.id)}>
              {verify.isPending ? 'Checking…' : 'I’ve paid — check'}
            </Button>
          </>
        )}
        <Button variant="outline" className="w-full rounded-full" onClick={onDone}>Done</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label-caps">Amount (₦)</label>
        <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="e.g. 50,000" className="mt-1.5 tnum text-lg h-12" inputMode="decimal" />
        <div className="grid grid-cols-4 gap-2 mt-2">{[5000, 10000, 50000, 100000].map((v) => <button key={v} onClick={() => setNaira(String(v))} className="rounded-xl border py-2 text-xs font-bold tnum text-muted-foreground hover:border-brand/50">{fmtNaira(v, 0)}</button>)}</div>
        {amount > 0 && <p className="text-[11px] text-muted-foreground mt-1.5 tnum">= {toPoints(amount)} points</p>}
      </div>
      <Button
        className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={buy.isPending}
        onClick={() => {
          if (!amount || amount <= 0) return toast.error('Enter an amount')
          buy.mutate(
            { walletId: wallet.id, input: { points: toPoints(amount), name: user?.businessName ?? user?.name, email: user?.email, phone: user?.phone ? toE164(user.phone) : undefined }, idempotencyKey: key },
            { onSuccess: setResult },
          )
        }}
      >
        {buy.isPending ? 'Creating payment…' : 'Continue'}
      </Button>
    </div>
  )
}

/** `POST …/buy-points` → pay the virtual account → `POST /wallet/buy-orders/{id}/verify-payment`. */
export function FundSheet({ wallet, open, onOpenChange }: SheetProps) {
  return (
    <FormSheet open={open} onOpenChange={onOpenChange} title="Fund wallet" sub="Pay by bank transfer — points land as soon as the payment clears.">
      {open && <Fund wallet={wallet} onDone={() => onOpenChange(false)} />}
    </FormSheet>
  )
}
