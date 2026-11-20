'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { BankAccountName, SettlementResult, Wallet } from '@/lib/api/numoni/types/wallet'
import { fmtNaira } from '@/lib/format'
import { useLookupBankAccount, useSettleToBank, useVerifySettlement } from '@/modules/wallet'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { RecordView } from '@/modules/ms/components/shared/DataView'
import { BANKS, bankCode, toNaira, toPoints } from './wallet-config'

interface SheetProps { wallet: Wallet; open: boolean; onOpenChange: (open: boolean) => void }

function Withdraw({ wallet, onDone }: { wallet: Wallet; onDone: () => void }) {
  const user = useSessionUser()
  const lookup = useLookupBankAccount()
  const settle = useSettleToBank()
  const verify = useVerifySettlement()
  // One key per withdrawal, so a retry can't pay out twice.
  const [key] = useState(() => crypto.randomUUID())
  const [bank, setBank] = useState('')
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState(user?.email ?? '')
  const [naira, setNaira] = useState('')
  const [holder, setHolder] = useState<BankAccountName | null>(null)
  const [result, setResult] = useState<SettlementResult | null>(null)
  const picked = BANKS.find((b) => b.name === bank)
  const amount = Number(naira.replace(/,/g, ''))
  const available = toNaira(wallet.balance)

  if (result) {
    const s = verify.data ?? result.settlement
    return (
      <div className="space-y-4">
        {s.status === 'completed'
          ? <div className="flex items-center gap-2 rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm"><CheckCircle2 className="h-5 w-5 text-brand" /> {fmtNaira(toNaira(s.points), 2)} sent to {s.beneficiaryAccountName}.</div>
          : <p className="text-sm">Your withdrawal is <b>{s.status.replace(/_/g, ' ')}</b>. Check again in a moment.</p>}
        <RecordView data={{ reference: s.reference, status: s.status, account: `${s.beneficiaryAccountName ?? ''} · ${s.beneficiaryAccountNumber ?? ''}`, fee: result.payout?.fee }} />
        {s.status !== 'completed' && <Button variant="outline" className="w-full rounded-full" disabled={verify.isPending} onClick={() => verify.mutate(s.id)}>{verify.isPending ? 'Checking…' : 'Check status'}</Button>}
        <Button className="w-full rounded-full" variant="outline" onClick={onDone}>Done</Button>
      </div>
    )
  }

  const check = () => {
    if (!picked || account.length !== 10) return toast.error('Pick the bank and enter the 10-digit account number')
    lookup.mutate({ accountNumber: account, bankCode: bankCode(picked) }, { onSuccess: setHolder, onError: () => toast.error('Couldn’t find that account', { description: 'Check the number and bank.' }) })
  }
  const send = () => {
    if (!holder || !picked) return
    if (!amount || amount <= 0) return toast.error('Enter an amount')
    if (amount > available) return toast.error('More than your balance', { description: fmtNaira(available, 2) })
    if (!email.trim()) return toast.error('Enter an email for the payout receipt')
    settle.mutate(
      { walletId: wallet.id, input: { points: toPoints(amount), accountNumber: account, bankCode: bankCode(picked), bankName: picked.name, accountName: holder.accountName, email: email.trim(), skipNameEnquiry: true }, idempotencyKey: key },
      { onSuccess: setResult },
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-caps">Bank</label>
          <Select value={bank || undefined} onValueChange={(v) => { setBank(v); setHolder(null) }}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick a bank…" /></SelectTrigger>
            <SelectContent>{BANKS.map((b) => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="label-caps">Account number</label>
          <Input value={account} onChange={(e) => { setAccount(e.target.value.replace(/\D/g, '').slice(0, 10)); setHolder(null) }} placeholder="0123456789" className="mt-1.5 tnum" inputMode="numeric" />
        </div>
      </div>
      {holder ? (
        <div className="rounded-2xl border border-brand/40 bg-brand/5 p-3 text-sm"><CheckCircle2 className="h-4 w-4 text-brand inline mr-1.5" /><b>{holder.accountName}</b> · {holder.bankName ?? bank}</div>
      ) : (
        <Button variant="outline" className="w-full rounded-full" disabled={lookup.isPending} onClick={check}>{lookup.isPending ? 'Checking…' : 'Confirm account name'}</Button>
      )}
      {holder && (
        <>
          <div>
            <label className="label-caps">Amount (₦) · {fmtNaira(available, 2)} available</label>
            <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="e.g. 20,000" className="mt-1.5 tnum text-lg h-12" inputMode="decimal" />
          </div>
          <div>
            <label className="label-caps">Receipt email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" type="email" />
          </div>
          <Button className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={settle.isPending} onClick={send}>
            {settle.isPending ? 'Sending…' : `Withdraw ${amount > 0 ? fmtNaira(amount, 2) : ''}`}
          </Button>
        </>
      )}
    </div>
  )
}

/** Name enquiry → `POST …/settlements` → `POST /wallet/settlements/{id}/verify-payment`. */
export function WithdrawToBankSheet({ wallet, open, onOpenChange }: SheetProps) {
  return (
    <FormSheet open={open} onOpenChange={onOpenChange} title="Withdraw to bank" sub="Confirm the account name first — then the money is sent by bank transfer.">
      {open && <Withdraw wallet={wallet} onDone={() => onOpenChange(false)} />}
    </FormSheet>
  )
}
