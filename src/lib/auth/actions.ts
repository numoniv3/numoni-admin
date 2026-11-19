/**
 * The Gateway journey endpoints the browser may reach through
 * `POST /api/auth/{action}`. Anything not listed here is rejected, so the
 * route handler can't be used as an open proxy.
 *
 * `withId` actions need a session: the handler injects `universalId` from the
 * cookie's token, so the browser never chooses whose account it edits.
 */
export const AUTH_ACTIONS = {
  signup: { path: '/journey/signup', method: 'POST', withId: false },
  'signup-otp': { path: '/journey/signup/otp', method: 'POST', withId: false },
  verify: { path: '/journey/signup/verify', method: 'POST', withId: false },
  login: { path: '/journey/login', method: 'POST', withId: false },
  'profile-customer': { path: '/journey/profile/customer', method: 'POST', withId: true },
  'profile-business': { path: '/journey/profile/business', method: 'POST', withId: true },
  pin: { path: '/journey/pin', method: 'POST', withId: true },
  'pin-verify': { path: '/journey/pin/verify', method: 'POST', withId: true },
  lock: { path: '/journey/lock', method: 'PATCH', withId: true },
  'kyc-tier2': { path: '/journey/kyc/tier2', method: 'POST', withId: true },
  'kyc-tier3': { path: '/journey/kyc/tier3', method: 'POST', withId: true },
} as const

export type AuthAction = keyof typeof AUTH_ACTIONS

export const isAuthAction = (v: string): v is AuthAction => Object.hasOwn(AUTH_ACTIONS, v)

/** Whether sign-in is mocked — set by `API_MODE` in `src/lib/config.ts`. */
export { AUTH_MOCKING } from '@/lib/config'

/** The OTP the mock journey accepts. */
export const MOCK_OTP = '123456'
