import { create } from 'zustand'
import { authClient } from '@/lib/auth/client'
import type { AuthResponse, NextStep, SessionUser } from '@/lib/auth/types'

// ── Who is signed in (shared by every app) ──────────────────────────────────
// Loaded once from `GET /api/auth/session`, then updated by each journey step.
// The token itself lives in an httpOnly cookie; `accessToken` is an in-memory
// copy for the axios client and is never written to storage.

interface SessionState {
  status: 'idle' | 'loading' | 'ready'
  user: SessionUser | null
  nextStep: NextStep | null
  accessToken: string | null
  /** Fetches the session once; later calls are no-ops. */
  load: () => Promise<void>
  /** Re-reads the session (`GET /journey/me`) after a change the token carries, e.g. a new KYC tier. */
  refresh: () => Promise<void>
  /** Applies a journey response — responses without a user leave the session as it is. */
  apply: (res: AuthResponse) => void
  signOut: () => Promise<void>
}

const SIGNED_OUT = { user: null, nextStep: null, accessToken: null }

export const useSession = create<SessionState>((set, get) => ({
  status: 'idle',
  ...SIGNED_OUT,

  load: async () => {
    if (get().status !== 'idle') return
    set({ status: 'loading' })
    try {
      get().apply(await authClient.session())
    } catch {
      // Gateway unreachable — fall through to signed out; the sign-in screen surfaces errors.
    }
    set({ status: 'ready' })
  },

  refresh: async () => {
    get().apply(await authClient.session())
  },

  apply: (res) => {
    if (!res.user) return
    set({ user: res.user, nextStep: res.nextStep ?? 'DASHBOARD', accessToken: res.accessToken ?? get().accessToken })
  },

  signOut: async () => {
    set({ ...SIGNED_OUT, status: 'ready' })
    await authClient.signOut().catch(() => undefined)
  },
}))

/** Shorthand for the token the axios client attaches. */
export const getAccessToken = () => useSession.getState().accessToken
