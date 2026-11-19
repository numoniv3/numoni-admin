'use client'

import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fmtNaira } from '@/lib/format'
import type { Dispatch, SetStateAction } from 'react'
import type { Account, JournalEntry } from '@/lib/api/numoni'

interface JournalEntrySheetProps {
  accounts: Account[]
  jeOpen: boolean
  setJeOpen: Dispatch<SetStateAction<boolean>>
  setJournal: Dispatch<SetStateAction<JournalEntry[]>>
}

export function JournalEntrySheet({ accounts, jeOpen, setJeOpen, setJournal }: JournalEntrySheetProps) {
  const [jeMemo, setJeMemo] = useState('')
  const [jeDebit, setJeDebit] = useState(accounts[0].code)
  const [jeCredit, setJeCredit] = useState(accounts[15].code)
  const [jeAmount, setJeAmount] = useState('')
  const postJe = () => {
    const amt = Number(jeAmount) || 0
    const d = accounts.find((a) => a.code === jeDebit)!
    const c = accounts.find((a) => a.code === jeCredit)!
    setJournal((j) => [{ id: `JE-${1043 + j.length - 10}`, date: 'Oct 10, 2026', memo: jeMemo.trim(), debit: `${d.code} · ${d.name}`, credit: `${c.code} · ${c.name}`, amount: amt, status: 'Posted', by: 'You' }, ...j])
    toast.success('Journal entry posted', { description: `DR ${d.code} · CR ${c.code} · ${fmtNaira(amt, 0)} — trial balance stays level` })
    setJeOpen(false); setJeMemo(''); setJeAmount('')
  }

  return (
    <FormSheet open={jeOpen} onOpenChange={setJeOpen} title="New journal entry" sub="Double-entry: pick the account to debit and the account to credit — amounts must match by definition.">
      <div className="space-y-4">
        <div>
          <label className="label-caps">Memo</label>
          <Input value={jeMemo} onChange={(e) => setJeMemo(e.target.value)} placeholder="e.g. Q4 licence invoice — Chicken Republic" className="mt-1.5" />
        </div>
        <div>
          <label className="label-caps flex items-center gap-1.5"><ArrowDownLeft className="h-3 w-3 text-brand" /> Debit account</label>
          <Select value={jeDebit} onValueChange={setJeDebit}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-64">
              {accounts.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} · {a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="label-caps flex items-center gap-1.5"><ArrowUpRight className="h-3 w-3 text-orangeb" /> Credit account</label>
          <Select value={jeCredit} onValueChange={setJeCredit}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-64">
              {accounts.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} · {a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="label-caps">Amount (₦)</label>
          <Input value={jeAmount} onChange={(e) => setJeAmount(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="1,000,000" className="mt-1.5 tnum" />
        </div>
        <div className="rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground">
          Debits and credits are always equal, so the trial balance stays level and the balance sheet keeps balancing.
        </div>
        <Button disabled={jeMemo.trim().length < 3 || !(Number(jeAmount) > 0) || jeDebit === jeCredit} onClick={postJe} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
          Post entry
        </Button>
      </div>
    </FormSheet>
  )
}
