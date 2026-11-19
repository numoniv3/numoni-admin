/**
 * Auth shapes shared by the browser, the `/api/auth/*` route handlers and the
 * mock journey. They mirror the Gateway's `Authentication - Journey` contract
 * in `specs/numoni.json`.
 */

/** `userType` on the Gateway (`ADMIN` is never self-service). */
export type UserType =
  | 'CUSTOMER'
  | 'SME_MERCHANT'
  | 'FINTECH_MERCHANT'
  | 'BRAND_MERCHANT'
  | 'ENTERPRISE_MERCHANT'
  | 'RESELLER'
  | 'ADMIN'

/** Where the Gateway says the UI should go next. */
export type NextStep = 'OTP' | 'LOGIN_OTP' | 'NAME' | 'PIN' | 'PROFILE' | 'DASHBOARD'

export type KycTier = 1 | 2 | 3

/** The signed-in user, read from the fat JWT's claims. */
export interface SessionUser {
  universalId: string
  userType: UserType
  role?: string
  name?: string
  businessName?: string
  phone?: string
  email?: string
  kycTier: KycTier
}

/** What every `/api/auth/*` call answers with (errors use `AuthErrorBody`). */
export interface AuthResponse {
  user: SessionUser | null
  nextStep: NextStep | null
  /** Login step 1: an OTP was sent; resubmit with `code`. */
  requiresOtp: boolean
  /** Only when the Gateway runs with `OTP_DEV_MODE` (or the mock is on). */
  devOtp?: string
  referralCode?: string
  /** `POST /journey/pin/verify` result. */
  valid?: boolean
  /**
   * Kept in memory by the session store so the axios client can call the
   * Gateway directly. The durable copy lives in the httpOnly cookie.
   */
  accessToken?: string
}

/** NestJS `ApiErrorDto`, passed through from the Gateway unchanged. */
export interface AuthErrorBody {
  statusCode: number
  message: string | string[]
  error: string
}
