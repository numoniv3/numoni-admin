'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fmtNaira } from '@/lib/format'
import { useFundingStatus, useStartFunding } from '@/modules/ms/api/useFunding'
import type { Funding } from '@/lib/api/numoni/types/consumer'

const pts = (v?: string | null) => (v == null ? '—' : Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }))

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-semibold tnum text-right">
        {value}
        {copy && (
          <button type="button" aria-label={`Copy ${label}`} className="text-muted-foreground hover:text-foreground"
            onClick={() => { void navigator.clipboard?.writeText(value); toast.success(`${label} copied`) }}>
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    </div>
  )
}

/** Waiting for the transfer → points credited (polls `GET /consumer/funding/{id}`). */
function Progress({ started, onDone }: { started: Funding; onDone: () => void }) {
  const { data: f = started } = useFundingStatus(started.id, started)
  const acct = f.dedicatedAccount

  if (f.status === 'completed') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm">
          <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
          <div>
            <div className="font-semibold">{pts(f.pointsCredited?.points ?? f.pointsExpected)} points added</div>
            {f.bonusCredited && <div className="text-xs text-muted-foreground mt-0.5">+ {pts(f.bonusCredited.points)} bonus points</div>}
            {f.pointsCredited?.after != null && <div className="text-xs text-muted-foreground mt-0.5 tnum">New balance: {pts(f.pointsCredited.after)} points</div>}
          </div>
        </div>
        <Button className="w-full rounded-full" onClick={onDone}>Done</Button>
      </div>
    )
  }

  if (f.status === 'cancelled' || f.status === 'needs_recon') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-2xl border border-orange-400/40 bg-orange-400/5 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
          {f.status === 'cancelled'
            ? 'This purchase was cancelled. If you already transferred, contact support with the reference below.'
            : 'We received your payment but are still confirming it. Your points will land once it’s checked — no need to pay again.'}
        </div>
        <div className="rounded-2xl border divide-y"><Row label="Reference" value={f.reference} copy /></div>
        <Button variant="outline" className="w-full rounded-full" onClick={onDone}>Close</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {f.status === 'processing' ? (
        <p className="text-sm">Payment received — adding your points…</p>
      ) : (
        <p className="text-sm">Transfer exactly <b className="tnum">{fmtNaira(Number(f.amount), 2)}</b> to this account. Your points land as soon as it clears.</p>
      )}
      {acct && f.status === 'awaiting_payment' && (
        <div className="rounded-2xl border divide-y">
          <Row label="Bank" value={acct.bank} />
          <Row label="Account number" value={acct.number} copy />
          <Row label="Account name" value={acct.name} />
          {acct.expiry && <Row label="Pay before" value={new Date(acct.expiry).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} />}
        </div>
      )}
      <div className="rounded-2xl border divide-y">
        <Row label="You’ll get" value={`${pts(f.pointsExpected)} points`} />
        <Row label="Estimated bonus" value={`~${pts(f.bonusPreview.points)} points`} />
        <Row label="Reference" value={f.reference} copy />
      </div>
      <p className="text-[11px] text-muted-foreground">{f.bonusPreview.note}</p>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for your payment — this updates automatically.
      </div>
      <Button variant="outline" className="w-full rounded-full" onClick={onDone}>I’ll pay later</Button>
    </div>
  )
}

/** Customer Buy Points: `POST /consumer/funding` (1 point per ₦1) → transfer → poll until credited. */
export function CustomerFund({ onDone }: { onDone: () => void }) {
  const start = useStartFunding()
  // One key per funding attempt, so a double tap or retry can't create two orders.
  const [key] = useState(() => crypto.randomUUID())
  const [naira, setNaira] = useState('')
  const amount = Number(naira.replace(/,/g, ''))

  if (start.data) return <Progress started={start.data} onDone={onDone} />

  return (
    <div className="space-y-4">
      <div>
        <label className="label-caps">Amount (₦)</label>
        <Input value={naira} onChange={(e) => setNaira(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="e.g. 10,000" className="mt-1.5 tnum text-lg h-12" inputMode="decimal" />
        <div className="grid grid-cols-4 gap-2 mt-2">{[5000, 10000, 50000, 100000].map((v) => <button key={v} type="button" onClick={() => setNaira(String(v))} className="rounded-xl border py-2 text-xs font-bold tnum text-muted-foreground hover:border-brand/50">{fmtNaira(v, 0)}</button>)}</div>
        {amount > 0 && <p className="text-[11px] text-muted-foreground mt-1.5 tnum">= {amount.toLocaleString()} points, plus a bonus of about 5%</p>}
      </div>
      <Button
        className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={start.isPending}
        onClick={() => {
          if (!amount || amount <= 0) return toast.error('Enter an amount')
          start.mutate({ amount: amount.toFixed(2), idempotencyKey: key })
        }}
      >
        {start.isPending ? 'Creating payment…' : 'Continue'}
      </Button>
    </div>
  )
}
