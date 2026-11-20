'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { Wallet } from '@/lib/api/numoni/types/wallet'
import { fmtNaira } from '@/lib/format'
import { useRedeemPoints, useTransferPoints } from '@/modules/wallet'
import { toNaira, toPoints } from './wallet-config'

interface SheetProps { wallet: Wallet; open: boolean; onOpenChange: (open: boolean) => void }

const amountOf = (v: string) => Number(v.replace(/,/g, ''))

function Send({ wallet, onDone }: { wallet: Wallet; onDone: () => void }) {
  const transfer = useTransferPoints()
  const [key] = useState(() => crypto.randomUUID())
  const [to, setTo] = useState('')
  const [naira, setNaira] = useState('')
  const [memo, setMemo] = useState('')
  return (
    <div className="space-y-3">
      <Input value={to} onChange={(e) => setTo(e.target.value.trim())} placeholder="Recipient wallet ID" className="font-mono" />
      <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="Amount (₦)" className="tnum" inputMode="decimal" />
      <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Note (optional)" />
      <p className="text-[11px] text-muted-foreground">{fmtNaira(toNaira(wallet.balance), 2)} available.</p>
      <Button className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={transfer.isPending}
        onClick={() => {
          const n = amountOf(naira)
          if (!to || !n) return toast.error('Enter the wallet ID and amount')
          transfer.mutate({ input: { fromWalletId: wallet.id, toWalletId: to, points: toPoints(n), memo: memo || undefined }, idempotencyKey: key }, { onSuccess: onDone })
        }}>
        {transfer.isPending ? 'Sending…' : 'Send'}
      </Button>
    </div>
  )
}

function Redeem({ wallet, onDone }: { wallet: Wallet; onDone: () => void }) {
  const redeem = useRedeemPoints()
  const [key] = useState(() => crypto.randomUUID())
  const [naira, setNaira] = useState('')
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Redeeming spends points from this wallet back into the nuMoni pool (e.g. against a purchase).</p>
      <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="Amount (₦)" className="tnum" inputMode="decimal" />
      <Button className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={redeem.isPending}
        onClick={() => { const n = amountOf(naira); if (!n) return toast.error('Enter an amount'); redeem.mutate({ walletId: wallet.id, points: toPoints(n), idempotencyKey: key }, { onSuccess: onDone }) }}>
        {redeem.isPending ? 'Redeeming…' : 'Redeem'}
      </Button>
    </div>
  )
}

/** `POST /wallet/transfers`. */
export function SendSheet({ wallet, open, onOpenChange }: SheetProps) {
  return <FormSheet open={open} onOpenChange={onOpenChange} title="Send points">{open && <Send wallet={wallet} onDone={() => onOpenChange(false)} />}</FormSheet>
}

/** `POST …/redeem`. */
export function RedeemSheet({ wallet, open, onOpenChange }: SheetProps) {
  return <FormSheet open={open} onOpenChange={onOpenChange} title="Redeem points">{open && <Redeem wallet={wallet} onDone={() => onOpenChange(false)} />}</FormSheet>
}
