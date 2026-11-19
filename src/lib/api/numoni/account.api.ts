import { NUMONI_ENDPOINTS } from './endpoints'
import { apiRead, apiSend, apiUpload } from './request'
import { accountPolicy, accountProfiles, apiCredentials } from './mocks/account'
import { child, isObj, list, num, obj, str, tier, type Obj } from './parse'
import type {
  AccountPolicy, AccountProfiles, ApiCredential, BusinessProfile, IssuedCredential, SubAdminInput, UploadedFile, UserProfile,
} from './types/account'

const E = NUMONI_ENDPOINTS.account

const USER_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'address', 'gender', 'city', 'state', 'profession', 'incomeRange', 'ageRange'] as const
const BUSINESS_FIELDS = ['businessName', 'website', 'phone', 'email', 'address', 'state', 'city', 'industry', 'staffSize', 'revenueRange', 'tin', 'rc'] as const

function toUserProfile(o: Obj): UserProfile {
  const p: UserProfile = {}
  for (const k of USER_FIELDS) p[k] = str(o, k)
  if (Array.isArray(o.preferences)) p.preferences = o.preferences.filter((x): x is string => typeof x === 'string')
  return p
}

function toBusinessProfile(o: Obj): BusinessProfile {
  const p: BusinessProfile = { branches: num(o, 'branches') }
  for (const k of BUSINESS_FIELDS) p[k] = str(o, k)
  p.rc ??= str(o, 'cac', 'rcNumber')
  return p
}

function toProfiles(raw: unknown): AccountProfiles {
  const o = obj(raw)
  const user = child(o, 'user', 'userProfile', 'customer', 'profile')
  const business = child(o, 'merchant', 'merchantProfile', 'business', 'businessProfile')
  return {
    user: user ? toUserProfile(user) : 'firstName' in o ? toUserProfile(o) : null,
    business: business ? toBusinessProfile(business) : 'businessName' in o ? toBusinessProfile(o) : null,
  }
}

/** A PATCH answer: the updated record (bare or under `profile`/`user`/`merchant`), over what was sent. */
const updated = <T extends object>(sent: T, toProfile: (o: Obj) => T, ...keys: string[]) => (raw: unknown): T => {
  const back = toProfile(child(obj(raw), ...keys) ?? obj(raw))
  const known = Object.fromEntries(Object.entries(back).filter(([, v]) => v !== undefined))
  return { ...sent, ...known }
}

/**
 * The account's personal and business profiles.
 * @endpoint GET /profiles/{universalId}
 */
export function getAccountProfiles(universalId: string): Promise<AccountProfiles> {
  return apiRead(E.profiles(universalId), toProfiles, () => accountProfiles)
}

/**
 * Saves personal (customer) profile fields; only the fields passed change.
 * @endpoint PATCH /profiles/{universalId}/user
 */
export function updateUserProfile(universalId: string, patch: UserProfile): Promise<UserProfile> {
  return apiSend('PATCH', E.userProfile(universalId), patch, updated(patch, toUserProfile, 'profile', 'user'), (b) => b)
}

/**
 * Saves business profile fields (merchant, reseller, brand, enterprise).
 * @endpoint PATCH /profiles/{universalId}/merchant
 */
export function updateBusinessProfile(universalId: string, patch: BusinessProfile): Promise<BusinessProfile> {
  return apiSend('PATCH', E.businessProfile(universalId), patch, updated(patch, toBusinessProfile, 'profile', 'merchant'), (b) => b)
}

function toCredential(o: Obj): ApiCredential {
  const publicKey = str(o, 'publicKey', 'pk', 'public_key', 'publishableKey') ?? ''
  return {
    id: str(o, 'id', '_id', 'credentialId', 'keyId') ?? publicKey,
    publicKey,
    secretKeyHint: str(o, 'secretKeyHint', 'secretKeyMasked', 'secretKeyPrefix', 'skPrefix', 'skLast4'),
    environment: str(o, 'environment', 'env', 'mode'),
    createdAt: str(o, 'createdAt', 'created_at', 'issuedAt'),
  }
}

/**
 * Active Fintech / Enterprise SK/PK pairs, without their secrets. Pairs are
 * issued when the account reaches Tier 2.
 * @endpoint GET /credentials/enterprise/{universalId}
 */
export function listApiCredentials(universalId: string): Promise<ApiCredential[]> {
  return apiRead(
    E.credentials(universalId),
    (raw) => list(raw, 'credentials', 'keys').filter(isObj).map(toCredential).filter((c) => c.publicKey),
    () => apiCredentials,
  )
}

/**
 * Revokes the active pair and issues a new one. The secret key is in this
 * response only — it can't be read again.
 * @endpoint POST /credentials/enterprise/{universalId}/rotate
 */
export function rotateApiCredentials(universalId: string): Promise<IssuedCredential> {
  return apiSend(
    'POST',
    E.rotateCredentials(universalId),
    undefined,
    (raw) => {
      const o = child(obj(raw), 'credential', 'credentials', 'keys', 'pair') ?? obj(raw)
      return { ...toCredential(o), secretKey: str(o, 'secretKey', 'sk', 'secret_key', 'secret') ?? '' }
    },
    () => {
      const id = crypto.randomUUID().replace(/-/g, '')
      return { id: `cred_${id.slice(0, 8)}`, publicKey: `pk_test_numoni_${id.slice(0, 12)}`, secretKey: `sk_test_numoni_${id.slice(12)}`, environment: 'test', createdAt: new Date().toISOString() }
    },
  )
}

/**
 * Adds a sub-admin (team member) under the signed-in account; the Gateway
 * sends them an OTP to finish signing in.
 * @endpoint POST /journey/sub-admin
 */
export function createSubAdmin(parentUniversalId: string, input: SubAdminInput): Promise<void> {
  return apiSend('POST', E.subAdmin, { parentUniversalId, ...input }, () => undefined, () => ({}))
}

/**
 * Stores a file (KYC documents, logos) in the nuMoni Space and returns its
 * CDN URL and key — journey endpoints take the key as a `…Ref`.
 * @endpoint POST /media/upload
 */
export function uploadFile(file: File, folder = 'kyc'): Promise<UploadedFile> {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  return apiUpload(
    E.upload,
    form,
    (raw) => {
      const o = obj(raw)
      return { url: str(o, 'url', 'cdnUrl', 'location') ?? '', key: str(o, 'key', 'objectKey', 'id') ?? '', mimeType: str(o, 'mimeType', 'contentType') ?? file.type, size: num(o, 'size') ?? file.size }
    },
    () => ({ url: `https://cdn.numoni.demo/${folder}/${encodeURIComponent(file.name)}`, key: `auth/demo/${folder}/${file.name}`, mimeType: file.type, size: file.size }),
  )
}

/**
 * Pushes the account's limits and permissions (from its token) to every
 * service. Called after sign-in reaches the dashboard and after a KYC change.
 * @endpoint POST /policies/sync
 */
export function syncPolicies(): Promise<void> {
  return apiSend('POST', E.policySync, undefined, () => undefined, () => ({}))
}

/** A policy envelope — `UpsertPolicyDto` fields, bare or under `policy`. */
export function toPolicy(raw: unknown, universalId: string): AccountPolicy {
  const o = child(obj(raw), 'policy') ?? obj(raw)
  const l = child(o, 'account_limit', 'accountLimit', 'limits') ?? {}
  return {
    universalId: str(o, 'universalId', 'userID', 'userId') ?? universalId,
    userType: str(o, 'user_type', 'userType'),
    role: str(o, 'user_role', 'userRole', 'role'),
    accountStatus: str(o, 'accountStatus', 'status'),
    kycTier: tier(o.kycStatus ?? o.kycTier),
    limits: { payin: num(l, 'payin', 'payinLimit') ?? 0, payout: num(l, 'payout', 'payoutLimit') ?? 0 },
    permissions: Array.isArray(o.permissions) ? o.permissions.filter((x): x is string => typeof x === 'string') : [],
    merchantId: str(o, 'merchantId'),
    appId: str(o, 'appId'),
  }
}

/**
 * The limits and permissions every service enforces for the signed-in
 * account. Syncs from the token on first read.
 * @endpoint GET /policies/me
 */
export function getMyPolicy(universalId: string): Promise<AccountPolicy> {
  return apiRead(E.policy, (raw) => toPolicy(raw, universalId), () => ({ ...accountPolicy, universalId }))
}
