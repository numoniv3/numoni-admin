'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { QrPaymentToken, Wallet } from '@/lib/api/numoni/types/wallet'
import { fmtNaira } from '@/lib/format'
import { useConfirmQrPayment, useGenerateQrPayment } from '@/modules/wallet'
import { toNaira, toPoints } from './wallet-config'

interface SheetProps { wallet: Wallet; open: boolean; onOpenChange: (open: boolean) => void }

function Receive({ wallet }: { wallet: Wallet }) {
  const gen = useGenerateQrPayment()
  const [naira, setNaira] = useState('')
  const [token, setToken] = useState<QrPaymentToken | null>(null)
  if (token) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-sm">Ask the customer to pay <b className="tnum">{fmtNaira(toNaira(token.points), 2)}</b> with this code</div>
        <div className="rounded-2xl border-2 border-dashed border-brand/60 p-6 font-mono text-xl font-bold tracking-wider break-all">{token.reference}</div>
        {token.payload !== token.reference && <div className="text-[11px] text-muted-foreground break-all font-mono">{token.payload}</div>}
        <Button variant="outline" className="rounded-full" onClick={() => { void navigator.clipboard.writeText(token.payload); toast.success('Code copied') }}><Copy className="h-4 w-4 mr-1.5" /> Copy code</Button>
        {token.expiresAt && <div className="text-[11px] text-muted-foreground">Expires {new Date(token.expiresAt).toLocaleTimeString()}</div>}
        <Button variant="ghost" className="w-full" onClick={() => setToken(null)}>New code</Button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="Amount (₦)" className="tnum text-lg h-12" inputMode="decimal" />
      <Button className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={gen.isPending}
        onClick={() => { const n = Number(naira.replace(/,/g, '')); if (!n) return toast.error('Enter an amount'); gen.mutate({ walletId: wallet.id, points: toPoints(n) }, { onSuccess: setToken }) }}>
        {gen.isPending ? 'Creating…' : 'Create payment code'}
      </Button>
    </div>
  )
}

function Pay({ wallet, onDone }: { wallet: Wallet; onDone: () => void }) {
  const confirm = useConfirmQrPayment()
  const [key] = useState(() => crypto.randomUUID())
  const [reference, setReference] = useState('')
  return (
    <div className="space-y-4">
      <Input value={reference} onChange={(e) => setReference(e.target.value.trim())} placeholder="Payment code" className="font-mono" />
      <p className="text-[11px] text-muted-foreground">Pays from this wallet ({fmtNaira(toNaira(wallet.balance), 2)} available).</p>
      <Button className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={!reference || confirm.isPending}
        onClick={() => confirm.mutate({ reference, fromWalletId: wallet.id, idempotencyKey: key }, { onSuccess: onDone })}>
        {confirm.isPending ? 'Paying…' : 'Pay'}
      </Button>
    </div>
  )
}

/** `POST /wallet/qr/generate` — a code a customer pays into this wallet. */
export function ReceiveQrSheet({ wallet, open, onOpenChange }: SheetProps) {
  return <FormSheet open={open} onOpenChange={onOpenChange} title="Receive payment">{open && <Receive wallet={wallet} />}</FormSheet>
}

/** `POST /wallet/qr/confirm` — pay someone’s code from this wallet. */
export function PayQrSheet({ wallet, open, onOpenChange }: SheetProps) {
  return <FormSheet open={open} onOpenChange={onOpenChange} title="Pay a code">{open && <Pay wallet={wallet} onDone={() => onOpenChange(false)} />}</FormSheet>
}
