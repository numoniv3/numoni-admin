'use client'

import { useDeferredValue, useState } from 'react'
import { SectionTitle } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AccountFilters } from '@/lib/api/numoni/admin.api'
import type { AccountStatus, PlatformAccount } from '@/lib/api/numoni/types/admin'
import { USER_TYPE_LABEL } from '@/lib/auth/personas'
import type { UserType } from '@/lib/auth/types'
import { usePlatformAccountsQuery } from '../../api/useAdminQueries'
import { statusLabel } from '../../lib/account-labels'
import { AccountSheet } from './AccountSheet'
import { AccountsTable } from './AccountsTable'

const STATUSES: AccountStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'CLOSED']

/** Every signed-up account (`GET /admin/users`), with status and limits per account. */
export function AccountsPage() {
  const [filters, setFilters] = useState<AccountFilters>({ limit: 100 })
  // Deferred, so changing a filter keeps the current table on screen while the next page loads.
  const { data: rows } = usePlatformAccountsQuery(useDeferredValue(filters))
  const [openId, setOpenId] = useState<string | null>(null)
  const open = rows.find((a) => a.universalId === openId)

  return (
    <div>
      <SectionTitle
        title="Accounts"
        sub="Every customer, merchant, reseller and admin on nuMoni — set account status and pay-in / pay-out limits."
        right={
          <div className="flex gap-2">
            <Select value={filters.userType ?? 'all'} onValueChange={(v) => setFilters((f) => ({ ...f, userType: v === 'all' ? undefined : (v as UserType) }))}>
              <SelectTrigger className="w-44 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All account types</SelectItem>
                {(Object.keys(USER_TYPE_LABEL) as UserType[]).map((t) => <SelectItem key={t} value={t}>{USER_TYPE_LABEL[t]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.accountStatus ?? 'all'} onValueChange={(v) => setFilters((f) => ({ ...f, accountStatus: v === 'all' ? undefined : (v as AccountStatus) }))}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />
      <AccountsTable rows={rows} onOpen={(a: PlatformAccount) => setOpenId(a.universalId)} />
      {open && <AccountSheet key={open.universalId} account={open} onClose={() => setOpenId(null)} />}
    </div>
  )
}
