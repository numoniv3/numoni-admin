'use client'

import type { ReactNode } from 'react'
import { PageLoader } from '@/components/layout/page-loader'
import { canEnter, type Persona } from '@/lib/auth/personas'
import { useSession } from '@/store/use-session-store'
import { useSessionBootstrap } from '../../lib/use-session-bootstrap'
import { DashboardAuthScreen } from './DashboardAuthScreen'
import { WrongAccountScreen } from './WrongAccountScreen'

/**
 * Wraps a dashboard shell: renders it only for a signed-in account of the
 * right type whose journey has reached `DASHBOARD`. The Gateway still checks
 * every request — this decides which screen to show, not what's allowed.
 */
export function DashboardAuthGate({ persona, children }: { persona: Persona; children: ReactNode }) {
  const status = useSessionBootstrap()
  const user = useSession((s) => s.user)
  const nextStep = useSession((s) => s.nextStep)

  if (status !== 'ready') return <PageLoader fullScreen />
  if (user && !canEnter(persona, user.userType)) return <WrongAccountScreen persona={persona} user={user} />
  if (!user || nextStep !== 'DASHBOARD') return <DashboardAuthScreen persona={persona} />
  return children
}
