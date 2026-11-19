import type { QueryClient } from '@tanstack/react-query'
import { syncPolicies } from '@/lib/api/numoni/account.api'
import { resetWorkspaceStores } from '@/store/reset-workspaces'
import { useSession } from '@/store/use-session-store'

/**
 * What follows a session change, app-wide. Returns the unsubscribe.
 * - Signing out (or into another account) drops everything loaded for the
 *   previous one — cached responses and the stores seeded from them.
 * - Reaching the dashboard, or a new KYC tier, syncs the account's policy so
 *   every service sees its current limits (`POST /policies/sync`).
 */
export function watchSession(queryClient: QueryClient) {
  return useSession.subscribe((state, prev) => {
    const id = state.user?.universalId
    const was = prev.user?.universalId
    if (was && id !== was) {
      queryClient.clear()
      resetWorkspaceStores()
    }

    const ready = !!id && state.nextStep === 'DASHBOARD'
    const wasReady = !!was && was === id && prev.nextStep === 'DASHBOARD'
    if (ready && (!wasReady || state.user?.kycTier !== prev.user?.kycTier)) void syncPolicies().catch(() => undefined)
  })
}
