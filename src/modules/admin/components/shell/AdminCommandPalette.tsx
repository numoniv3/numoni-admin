'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { useAdminCampaignsQuery, useAdminMerchantsQuery } from '../../api/useAdminQueries'
import { ADMIN_BASE, ADMIN_NAV } from '../../nav-items'

/** ⌘K jump list: every admin page, every merchant, every campaign, plus a few actions. */
export function AdminCommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter()
  const { data: merchants } = useAdminMerchantsQuery()
  const { data: campaigns } = useAdminCampaignsQuery()

  const jumpTargets = useMemo(
    () => [
      ...ADMIN_NAV.map((n) => ({ label: n.label === 'Overview' ? 'Admin Overview' : n.label, to: ADMIN_BASE + n.to, kind: 'Page' })),
      ...merchants.map((m) => ({ label: m.name, to: `${ADMIN_BASE}/merchants/${m.id}`, kind: 'Merchant' })),
      ...campaigns.map((c) => ({ label: c.name, to: `${ADMIN_BASE}/campaigns`, kind: 'Campaign' })),
      { label: 'TXN-9F2K41 · Chicken Republic redemption', to: `${ADMIN_BASE}/treasury`, kind: 'Transaction' },
      { label: 'Run daily cut-off', to: `${ADMIN_BASE}/treasury`, kind: 'Action' },
    ],
    [merchants, campaigns],
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to a merchant, campaign, transaction, or setting…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {['Page', 'Merchant', 'Campaign', 'Transaction', 'Action'].map((kind, i) => (
          <div key={kind}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={kind + 's'}>
              {jumpTargets.filter((t) => t.kind === kind).map((t) => (
                <CommandItem
                  key={t.label}
                  onSelect={() => {
                    onOpenChange(false)
                    router.push(t.to)
                  }}
                >
                  {t.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
