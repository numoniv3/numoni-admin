'use client'

import { Suspense, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Gift, QrCode, ScanLine, Send, Snowflake, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/kit'
import type { Wallet } from '@/lib/api/numoni/types/wallet'
import { fmtNaira } from '@/lib/format'
import { useCreateWallet, useMyWalletsQuery, useSetWalletFrozen, useWalletOptIn, useWalletQuery, useWalletTransactionsQuery } from '@/modules/wallet'
import { useSheet } from '@/modules/ms/components/shared/bits'
import { DataView } from '@/modules/ms/components/shared/DataView'
import { FundSheet } from './FundSheet'
import { PayQrSheet, ReceiveQrSheet } from './QrSheets'
import { RedeemSheet, SendSheet } from './SendRedeemSheets'
import { StatusLookup } from './StatusLookup'
import { toNaira } from './wallet-config'
import { WithdrawToBankSheet } from './WithdrawToBankSheet'

export type WalletSheet = 'fund' | 'withdraw' | 'send' | 'receive' | 'pay' | 'redeem'

const ACTIONS: { id: WalletSheet; label: string; icon: typeof Send }[] = [
  { id: 'fund', label: 'Fund', icon: ArrowDownToLine },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { id: 'send', label: 'Send', icon: Send },
  { id: 'receive', label: 'Receive', icon: QrCode },
  { id: 'pay', label: 'Pay QR', icon: ScanLine },
  { id: 'redeem', label: 'Redeem', icon: Gift },
]

const Loading = () => <div className="card-surface p-6 text-center text-xs text-muted-foreground animate-pulse">Loading wallet…</div>

function SetupWallet() {
  const optIn = useWalletOptIn()
  const create = useCreateWallet()
  const busy = optIn.isPending || create.isPending
  return (
    <div className="card-surface p-6 text-center space-y-3">
      <div className="font-semibold">Set up your nuMoni wallet</div>
      <p className="text-xs text-muted-foreground">Hold points, get paid by QR, and withdraw to your bank.</p>
      <Button disabled={busy} className="rounded-full bg-brand text-black font-bold hover:bg-brand/90" onClick={async () => { await optIn.mutateAsync(); create.mutate('NGN') }}>
        {busy ? 'Setting up…' : 'Create my wallet'}
      </Button>
    </div>
  )
}

function History({ walletId }: { walletId: string }) {
  const { data } = useWalletTransactionsQuery({ walletId, limit: 50 })
  return (
    <DataView
      data={data.map((t) => ({ ...t, amount: `${t.direction === 'credit' ? '+' : '−'}${fmtNaira(toNaira(t.points), 2)}`, balance: t.balanceAfter ? fmtNaira(toNaira(t.balanceAfter), 2) : undefined }))}
      columns={['type', 'amount', 'status', 'balance', 'memo', 'reference', 'createdAt']} empty="No transactions yet"
    />
  )
}

function WalletCard({ wallet: listed }: { wallet: Wallet }) {
  // `GET /wallet/wallets/{id}` — the live copy; the list row has the same shape.
  const { data: w } = useWalletQuery(listed.id)
  const sheet = useSheet<WalletSheet>()
  const freeze = useSetWalletFrozen()
  const frozen = w.status === 'frozen'
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white p-5">
        <div className="flex justify-between items-start">
          <span className="text-[11px] opacity-70">nuMoni wallet · {w.currency}</span>
          <Pill tone={frozen ? 'orange' : 'green'}>{frozen ? 'Frozen' : 'Active'}</Pill>
        </div>
        <div className="mt-5 text-3xl font-bold tnum">{fmtNaira(toNaira(w.balance), 2)}</div>
        <div className="text-[11px] opacity-70 tnum">{Number(w.balance).toLocaleString()} points · {w.id}</div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ACTIONS.map((a) => (
          <button key={a.id} disabled={frozen} onClick={() => sheet.show(a.id)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold hover:border-brand/60 transition-colors disabled:opacity-40">
            <a.icon className="h-4 w-4 text-brand" />{a.label}
          </button>
        ))}
      </div>
      <Button variant="outline" size="sm" className="rounded-full" disabled={freeze.isPending} onClick={() => freeze.mutate({ walletId: w.id, frozen: !frozen })}>
        {frozen ? <><Sun className="h-3.5 w-3.5 mr-1.5" /> Unfreeze wallet</> : <><Snowflake className="h-3.5 w-3.5 mr-1.5" /> Freeze wallet</>}
      </Button>

      <FundSheet wallet={w} open={sheet.is('fund')} onOpenChange={sheet.onOpenChange} />
      <WithdrawToBankSheet wallet={w} open={sheet.is('withdraw')} onOpenChange={sheet.onOpenChange} />
      <SendSheet wallet={w} open={sheet.is('send')} onOpenChange={sheet.onOpenChange} />
      <ReceiveQrSheet wallet={w} open={sheet.is('receive')} onOpenChange={sheet.onOpenChange} />
      <PayQrSheet wallet={w} open={sheet.is('pay')} onOpenChange={sheet.onOpenChange} />
      <RedeemSheet wallet={w} open={sheet.is('redeem')} onOpenChange={sheet.onOpenChange} />
    </div>
  )
}

function Wallets() {
  const { data: wallets } = useMyWalletsQuery()
  const [picked, setPicked] = useState(0)
  if (!wallets.length) return <SetupWallet />
  const w = wallets[Math.min(picked, wallets.length - 1)]
  return (
    <div className="space-y-5">
      {wallets.length > 1 && (
        <div className="flex gap-1.5">{wallets.map((x, i) => <button key={x.id} onClick={() => setPicked(i)} className={`rounded-full border px-3 py-1 text-xs ${i === picked ? 'border-brand text-brand' : 'text-muted-foreground'}`}>{x.currency} · {x.id.slice(0, 6)}</button>)}</div>
      )}
      <WalletCard key={w.id} wallet={w} />
      <div>
        <div className="label-caps mb-2">Transactions</div>
        <Suspense fallback={<Loading />}><History walletId={w.id} /></Suspense>
      </div>
      <StatusLookup />
    </div>
  )
}

/** The signed-in account's nuMoni wallet (Wallet MS): balance, fund, withdraw, send, QR, redeem, freeze, history. */
export function WalletPanel() {
  return <Suspense fallback={<Loading />}><Wallets /></Suspense>
}
