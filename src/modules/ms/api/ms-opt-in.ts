import { optIn as cardOptIn } from '@/lib/api/numoni/card.api'
import { optIn as complianceOptIn } from '@/lib/api/numoni/compliance.api'
import { optIn as createAppOptIn } from '@/lib/api/numoni/create-app.api'
import { optIn as rewardsOptIn } from '@/lib/api/numoni/rewards.api'
import type { CardOptInDto } from '@/lib/api/numoni/types/card'
import type { RewardOptInDto } from '@/lib/api/numoni/types/rewards'
import type { SessionUser } from '@/lib/auth/types'
import { useSession } from '@/store/use-session-store'

// Each microservice keeps its own record of an account, created by its
// `POST /<service>/opt-in`. Opt-in is idempotent, so it runs once per service
// and account per page load, before the first call to that service.
const pending = new Map<string, Promise<unknown>>()

function once(service: string, user: SessionUser | null, run: (user: SessionUser) => Promise<unknown>): Promise<unknown> {
  if (!user) return Promise.resolve()
  const key = `${service}:${user.universalId}`
  let p = pending.get(key)
  if (!p) {
    p = run(user).catch((error: unknown) => {
      pending.delete(key) // retry on the next call
      throw error
    })
    pending.set(key, p)
  }
  return p
}

export type OptInService = 'rewards' | 'card' | 'compliance' | 'create-app'

const OPT_IN: Record<OptInService, (u: SessionUser) => Promise<unknown>> = {
  rewards: (u) => rewardsOptIn({ universalId: u.universalId, userType: u.userType as RewardOptInDto['userType'] }),
  card: (u) => cardOptIn({ universalId: u.universalId, userType: u.userType as CardOptInDto['userType'] }),
  compliance: (u) => complianceOptIn({ universalId: u.universalId, userType: u.userType }),
  'create-app': (u) => createAppOptIn({ universalId: u.universalId, userType: u.userType }),
}

export const ensureOptIn = (service: OptInService, user: SessionUser | null) => once(service, user, OPT_IN[service])
export const ensureRewardsOptIn = (user: SessionUser | null) => ensureOptIn('rewards', user)
export const ensureCardOptIn = (user: SessionUser | null) => ensureOptIn('card', user)

export const useSessionUser = () => useSession((s) => s.user)
