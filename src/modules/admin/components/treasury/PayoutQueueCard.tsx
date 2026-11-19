'use client'

import { useState } from 'react'
import { Pause, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Button } from '@/components/ui/button'
import { fmtNaira } from '@/lib/format'
import type { Payout, PayoutStatus } from '@/lib/api/numoni/types/admin'

const payoutTone: Record<PayoutStatus, 'green' | 'neutral' | 'sky'> = { Sent: 'green', Scheduled: 'neutral', Held: 'sky' }

interface PayoutQueueCardProps {
  payoutSeed: Payout[]
}

export function PayoutQueueCard({ payoutSeed }: PayoutQueueCardProps) {
  const [payouts, setPayouts] = useState<Payout[]>(payoutSeed)
  const setPayout = (id: string, status: PayoutStatus, note: string) => {
    setPayouts((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)))
    toast.success(note, { description: `${id} · ${payouts.find((p) => p.id === id)?.merchant}` })
  }

  return (
    <div className="card-surface p-5 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold">Payout queue</h3>
          <p className="text-xs text-muted-foreground">NIP payouts to merchant bank accounts · release or hold individually</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="neutral">{payouts.filter((p) => p.status === 'Scheduled').length} scheduled</Pill>
          <ExportCsvButton
            filename="payout-queue"
            headers={['Payout', 'Merchant', 'Bank', 'Account', 'Amount ₦', 'Status']}
            rows={payouts.map((p) => [p.id, p.merchant, p.bank, p.account, p.amount, p.status])}
          />
        </div>
      </div>
      <div className="space-y-2">
        {payouts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-3 text-sm">
            <div className="flex-1 min-w-[200px]">
              <div className="font-medium truncate">{p.merchant}</div>
              <div className="text-[10px] text-muted-foreground tnum">{p.id} · {p.bank} · {p.account}</div>
            </div>
            <span className="tnum font-bold shrink-0">{fmtNaira(p.amount, 0)}</span>
            <Pill tone={payoutTone[p.status]}>{p.status}</Pill>
            <div className="flex gap-1.5 shrink-0">
              {p.status === 'Scheduled' && (
                <>
                  <Button size="sm" className="h-7 text-[11px] px-2.5 bg-brand text-black hover:bg-brand/90" onClick={() => setPayout(p.id, 'Sent', 'Payout released via NIP')}>
                    <Send className="h-3 w-3 mr-1" /> Release
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5" onClick={() => setPayout(p.id, 'Held', 'Payout held')}>
                    <Pause className="h-3 w-3 mr-1" /> Hold
                  </Button>
                </>
              )}
              {p.status === 'Held' && (
                <Button size="sm" className="h-7 text-[11px] px-2.5 bg-brand text-black hover:bg-brand/90" onClick={() => setPayout(p.id, 'Sent', 'Payout released via NIP')}>
                  <Send className="h-3 w-3 mr-1" /> Release
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
