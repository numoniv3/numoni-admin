'use client'

import { useState } from 'react'
import { FormSheet } from '@/components/ui/form-sheet'
import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AccountStatus, PlatformAccount } from '@/lib/api/numoni/types/admin'
import { useSetAccountLimits, useSetAccountStatus } from '../../api/useAdminMutations'
import { STATUS_TONE, statusLabel, typeLabel } from '../../lib/account-labels'

const STATUSES: AccountStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'CLOSED']

/** Status (`PATCH …/status`) and limits (`PATCH …/limits`) for one account. Keyed by account, so the form resets per account. */
export function AccountSheet({ account, onClose }: { account: PlatformAccount; onClose: () => void }) {
  const setStatus = useSetAccountStatus()
  const setLimits = useSetAccountLimits()
  const [payin, setPayin] = useState(String(account.limits?.payin ?? ''))
  const [payout, setPayout] = useState(String(account.limits?.payout ?? ''))
  const [status, setStatusValue] = useState(account.accountStatus)
  const limitsValid = Number(payin) > 0 && Number(payout) > 0
  const id = account.universalId

  return (
    <FormSheet open onOpenChange={(v) => { if (!v) onClose() }} title={account.name} sub={`${typeLabel(account)} · KYC Tier ${account.kycTier}`}>
      <div className="space-y-5 pb-2">
        <div className="rounded-xl border p-3.5 space-y-1.5 text-xs">
          {[['Account ID', id], ['Phone', account.phone], ['Email', account.email]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-semibold tnum truncate">{v || '—'}</span></div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-caps">Account status</label>
            <Pill tone={STATUS_TONE[status]}>{statusLabel(status)}</Pill>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={setStatus.isPending || s === status}
                onClick={() => setStatus.mutate({ universalId: id, status: s }, { onSuccess: () => setStatusValue(s) })}
                className={`rounded-full border px-2 py-2 text-xs font-semibold transition-colors disabled:cursor-default ${s === status ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps">Limits (₦)</label>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">Pay-in</div>
              <Input value={payin} onChange={(e) => setPayin(e.target.value.replace(/\D/g, ''))} inputMode="numeric" className="tnum" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">Pay-out</div>
              <Input value={payout} onChange={(e) => setPayout(e.target.value.replace(/\D/g, ''))} inputMode="numeric" className="tnum" />
            </div>
          </div>
          <Button
            disabled={!limitsValid || setLimits.isPending}
            onClick={() => setLimits.mutate({ universalId: id, limits: { payin: Number(payin), payout: Number(payout) } })}
            className="w-full h-11 mt-3 rounded-full bg-brand text-black font-bold hover:bg-brand/90"
          >
            {setLimits.isPending ? 'Saving…' : 'Save limits'}
          </Button>
        </div>
      </div>
    </FormSheet>
  )
}
