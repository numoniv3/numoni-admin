'use client'

import { Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { useSession } from '@/store/use-session-store'
import { usePlatformAdminsQuery } from '../../api/useAdminQueries'
import { useSetAccountStatus } from '../../api/useAdminMutations'
import { STATUS_TONE, initials, roleLabel, statusLabel } from '../../lib/account-labels'

/** `GET /admin/admins`, with suspend / restore through `PATCH /admin/users/{id}/status`. */
export function AdminListCard() {
  const { data: admins } = usePlatformAdminsQuery()
  const me = useSession((s) => s.user?.universalId)
  const setStatus = useSetAccountStatus()

  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-3">Admin users <span className="text-xs text-muted-foreground font-normal">({admins.length})</span></h3>
      {admins.length === 0 && <p className="text-sm text-muted-foreground">No admins yet — invite one to get started.</p>}
      <div className="space-y-2.5">
        {admins.map((a) => {
          const suspended = a.accountStatus === 'SUSPENDED'
          const locked = a.role === 'owner' || a.universalId === me
          const pending = setStatus.isPending && setStatus.variables?.universalId === a.universalId
          return (
            <div key={a.universalId} className={`rounded-xl border p-3 flex items-center gap-3 ${suspended ? 'opacity-60' : ''}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold shrink-0">{initials(a.name)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{a.name}</div>
                <div className="text-[10px] text-muted-foreground tnum truncate">{[a.email, a.phone].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Pill tone="purple">{roleLabel(a.role)}</Pill>
                <Pill tone={STATUS_TONE[a.accountStatus]}>{statusLabel(a.accountStatus)}</Pill>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 text-xs ${suspended ? '' : 'text-red-500'}`}
                  disabled={locked || pending}
                  title={locked ? 'You can’t suspend the owner or yourself' : undefined}
                  onClick={() => setStatus.mutate({ universalId: a.universalId, status: suspended ? 'ACTIVE' : 'SUSPENDED' })}
                >
                  {suspended ? 'Restore' : 'Suspend'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
