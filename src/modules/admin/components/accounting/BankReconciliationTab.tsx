'use client'

import { BookOpen, CheckCircle2, Landmark } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import type { Dispatch, SetStateAction } from 'react'
import type { TreasuryBankAccount, UnmatchedBankLine } from '@/lib/api/numoni'

interface BankReconciliationTabProps {
  bankAccounts: TreasuryBankAccount[]
  setUnmatched: Dispatch<SetStateAction<UnmatchedBankLine[]>>
  unmatched: UnmatchedBankLine[]
}

export function BankReconciliationTab({ bankAccounts, setUnmatched, unmatched }: BankReconciliationTabProps) {
  const bookAdjustment = (id: string) => {
    const item = unmatched.find((u) => u.id === id)!
    setUnmatched((u) => u.filter((x) => x.id !== id))
    toast.success('Adjustment booked', { description: `${item.id} · ${fmtNaira(item.amount, 0)} journalised — accounts back in sync` })
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {bankAccounts.map((b) => {
          const diff = b.statement - b.book
          return (
            <div key={b.bank} className="card-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500"><Landmark className="h-4 w-4" /></span>
                {diff === 0 ? <Pill tone="green">Reconciled</Pill> : <Pill tone="orange">{Math.abs(diff) > 1e6 ? `${Math.abs(diff) / 1e6 < 10 ? '₦' + (Math.abs(diff) / 1e6).toFixed(1) + 'M' : fmtNairaCompact(Math.abs(diff))}` : fmtNaira(Math.abs(diff), 0)} open</Pill>}
              </div>
              <div className="font-display font-bold text-sm">{b.bank} <span className="text-[10px] text-muted-foreground font-normal tnum">{b.account}</span></div>
              <div className="text-[10px] text-muted-foreground mb-3">{b.purpose}</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Book balance</span><span className="tnum font-semibold">{fmtNaira(b.book, 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Bank statement</span><span className="tnum font-semibold">{fmtNaira(b.statement, 0)}</span></div>
                <div className="flex justify-between pt-1.5 border-t"><span className="text-muted-foreground">Difference</span><span className={`tnum font-bold ${diff === 0 ? 'text-brand' : 'text-orangeb'}`}>{diff === 0 ? '₦0' : fmtNaira(diff, 0)}</span></div>
              </div>
              <div className="text-[9px] text-muted-foreground mt-2.5 tnum">Last reconciled {b.lastRecon} · nightly auto-match</div>
            </div>
          )
        })}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b">
          <div>
            <h3 className="font-display font-bold text-sm">Unmatched items</h3>
            <p className="text-[10px] text-muted-foreground">Bank feed vs general ledger — clear each item to close the day</p>
          </div>
          <Pill tone={unmatched.length === 0 ? 'green' : 'orange'}>{unmatched.length === 0 ? 'All clear' : `${unmatched.length} open`}</Pill>
        </div>
        {unmatched.length === 0 && (
          <div className="p-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-brand mx-auto mb-2" />
            <div className="text-sm font-bold">Books match the bank</div>
            <div className="text-xs text-muted-foreground mt-1">Every ledger line has a bank counterpart — reconciliation is complete.</div>
          </div>
        )}
        <div className="divide-y">
          {unmatched.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orangeb/10 text-orangeb shrink-0"><BookOpen className="h-4 w-4" /></span>
              <div className="flex-1 min-w-[240px]">
                <div className="text-sm font-medium">{u.desc}</div>
                <div className="text-[10px] text-muted-foreground tnum">{u.id} · {u.side} · {u.age} old</div>
              </div>
              <span className="tnum font-bold">{fmtNaira(u.amount, 0)}</span>
              <Button size="sm" variant="outline" onClick={() => bookAdjustment(u.id)}>Book adjustment</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
