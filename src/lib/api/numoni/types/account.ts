/**
 * The signed-in account's own records on the Gateway's Auth routes:
 * profiles, Fintech/Enterprise API keys, sub-admins and uploads. Request
 * shapes follow the DTOs in `specs/numoni.json`.
 */

/** `UpdateUserProfileDto` — a person's soft profile. */
export interface UserProfile {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  gender?: string
  city?: string
  state?: string
  profession?: string
  incomeRange?: string
  ageRange?: string
  preferences?: string[]
}

/** `UpdateMerchantProfileDto` — a merchant / reseller / brand business profile. */
export interface BusinessProfile {
  businessName?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  state?: string
  city?: string
  industry?: string
  staffSize?: string
  branches?: number
  revenueRange?: string
  tin?: string
  rc?: string
}

/** `GET /profiles/{universalId}` — either side may be absent for the account type. */
export interface AccountProfiles {
  user: UserProfile | null
  business: BusinessProfile | null
}

/** An active SK/PK pair, listed without its secret. */
export interface ApiCredential {
  id: string
  publicKey: string
  /** Masked or absent — the secret is only returned when a pair is issued. */
  secretKeyHint?: string
  environment?: string
  createdAt?: string
}

/** `POST …/rotate` — the new pair, secret shown once. */
export interface IssuedCredential extends ApiCredential {
  secretKey: string
}

/** `CreateSubAdminDto` minus `parentUniversalId`, which comes from the session. */
export interface SubAdminInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  role?: string
}

/** `MediaUploadResponseDto`. */
export interface UploadedFile {
  url: string
  key: string
  mimeType: string
  size: number
}

/**
 * The policy every service enforces for an account (`UpsertPolicyDto`) —
 * `GET /policies/me`, `GET /policies/{universalId}`. Limits are in ₦.
 */
export interface AccountPolicy {
  universalId: string
  userType?: string
  role?: string
  accountStatus?: string
  kycTier: 1 | 2 | 3
  limits: { payin: number; payout: number }
  /** e.g. `wallet:payin`, `wallet:spend`. */
  permissions: string[]
  merchantId?: string
  appId?: string
}
