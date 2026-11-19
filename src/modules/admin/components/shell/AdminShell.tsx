'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { DashShell } from '@/components/layout/dash-shell'
import { ClientBoundary } from '@/components/layout/client-boundary'
import { DashboardAuthGate, SignOutButton } from '@/modules/auth'
import { ADMIN_BASE, ADMIN_NAV } from '../../nav-items'
import { AdminCommandPalette } from './AdminCommandPalette'
import { ReconBanner } from './ReconBanner'

/** Control Tower frame — rendered once by `app/(dashboards)/admin/layout.tsx`. */
export function AdminShell({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <DashboardAuthGate persona="admin">
      <DashShell
        base={ADMIN_BASE}
        items={ADMIN_NAV}
        title="Control Tower"
        accent="text-brand"
        onCommand={() => setCmdOpen(true)}
        headerRight={<><ReconBanner /><SignOutButton /></>}
      >
        <ClientBoundary fallback={null}>
          <AdminCommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
        </ClientBoundary>
        {children}
      </DashShell>
    </DashboardAuthGate>
  )
}
